import { useState, useEffect } from 'react';
import { TeamMember, Team, ActivityLog, ROLE_PERMISSIONS } from '../types/team';

const STORAGE_KEY = 'food-inventory-team-data';

export function useTeam() {
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load team data from localStorage
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const teamData = JSON.parse(savedData);
        const teamWithDates = {
          ...teamData,
          createdAt: new Date(teamData.createdAt),
          members: teamData.members.map((member: any) => ({
            ...member,
            joinedAt: new Date(member.joinedAt),
            lastActive: new Date(member.lastActive)
          }))
        };
        setTeam(teamWithDates);
        
        // Set current user (for demo, use first member)
        if (teamWithDates.members.length > 0) {
          setCurrentUser(teamWithDates.members[0]);
        }
      } catch (error) {
        console.error('Failed to load team data:', error);
      }
    } else {
      // Create default team for demo
      createDefaultTeam();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (team) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
    }
  }, [team]);

  const createDefaultTeam = () => {
    const defaultTeam: Team = {
      id: crypto.randomUUID(),
      name: 'Restaurant Team',
      description: 'Main kitchen and inventory team',
      ownerId: crypto.randomUUID(),
      createdAt: new Date(),
      members: [
        {
          id: crypto.randomUUID(),
          email: 'chef@restaurant.com',
          name: 'Head Chef',
          role: 'owner',
          joinedAt: new Date(),
          lastActive: new Date(),
          permissions: ROLE_PERMISSIONS.owner,
          isActive: true
        },
        {
          id: crypto.randomUUID(),
          email: 'manager@restaurant.com',
          name: 'Kitchen Manager',
          role: 'manager',
          joinedAt: new Date(),
          lastActive: new Date(),
          permissions: ROLE_PERMISSIONS.manager,
          isActive: true
        },
        {
          id: crypto.randomUUID(),
          email: 'staff1@restaurant.com',
          name: 'Line Cook',
          role: 'staff',
          joinedAt: new Date(),
          lastActive: new Date(),
          permissions: ROLE_PERMISSIONS.staff,
          isActive: true
        }
      ],
      settings: {
        allowVoiceInput: true,
        requireQualityChecks: true,
        autoBackup: true,
        notificationSettings: {
          lowStock: true,
          expiration: true,
          qualityIssues: true,
          teamUpdates: true
        },
        workflowSettings: {
          requireApproval: false,
          approvalThreshold: 1000,
          autoReorder: false
        }
      },
      subscription: {
        planId: 'professional',
        maxMembers: 10,
        features: ['unlimited_items', 'team_collaboration', 'advanced_analytics']
      }
    };

    setTeam(defaultTeam);
    setCurrentUser(defaultTeam.members[0]);
  };

  const addTeamMember = (email: string, name: string, role: TeamMember['role']) => {
    if (!team || !currentUser) return false;

    // Check if user has permission
    if (!hasPermission('create', 'team')) return false;

    // Check member limit
    if (team.members.length >= team.subscription.maxMembers) return false;

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      email,
      name,
      role,
      joinedAt: new Date(),
      lastActive: new Date(),
      permissions: ROLE_PERMISSIONS[role],
      isActive: true
    };

    setTeam(prev => prev ? {
      ...prev,
      members: [...prev.members, newMember]
    } : null);

    logActivity('create', 'team', `Added new team member: ${name} (${role})`);
    return true;
  };

  const updateMemberRole = (memberId: string, newRole: TeamMember['role']) => {
    if (!team || !currentUser || !hasPermission('update', 'team')) return false;

    setTeam(prev => prev ? {
      ...prev,
      members: prev.members.map(member =>
        member.id === memberId
          ? { ...member, role: newRole, permissions: ROLE_PERMISSIONS[newRole] }
          : member
      )
    } : null);

    const member = team.members.find(m => m.id === memberId);
    if (member) {
      logActivity('update', 'team', `Changed ${member.name}'s role to ${newRole}`);
    }
    return true;
  };

  const removeMember = (memberId: string) => {
    if (!team || !currentUser || !hasPermission('delete', 'team')) return false;

    const member = team.members.find(m => m.id === memberId);
    if (!member || member.role === 'owner') return false;

    setTeam(prev => prev ? {
      ...prev,
      members: prev.members.filter(m => m.id !== memberId)
    } : null);

    logActivity('delete', 'team', `Removed team member: ${member.name}`);
    return true;
  };

  const switchUser = (memberId: string) => {
    if (!team) return false;
    
    const member = team.members.find(m => m.id === memberId);
    if (!member) return false;

    setCurrentUser(member);
    
    // Update last active
    setTeam(prev => prev ? {
      ...prev,
      members: prev.members.map(m =>
        m.id === memberId ? { ...m, lastActive: new Date() } : m
      )
    } : null);

    return true;
  };

  const hasPermission = (action: string, resource: string): boolean => {
    if (!currentUser) return false;
    
    return currentUser.permissions.some(p => 
      p.action === action && p.resource === resource
    );
  };

  const logActivity = (action: string, resource: string, details: string) => {
    if (!currentUser) return;

    const activity: ActivityLog = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      resource,
      details,
      timestamp: new Date()
    };

    setActivityLog(prev => [activity, ...prev].slice(0, 100)); // Keep last 100 activities
  };

  const getTeamStats = () => {
    if (!team) return null;

    const activeMembers = team.members.filter(m => m.isActive).length;
    const recentActivity = activityLog.filter(log => 
      new Date().getTime() - log.timestamp.getTime() < 24 * 60 * 60 * 1000
    ).length;

    return {
      totalMembers: team.members.length,
      activeMembers,
      recentActivity,
      roles: team.members.reduce((acc, member) => {
        acc[member.role] = (acc[member.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  return {
    currentUser,
    team,
    activityLog,
    isLoading,
    addTeamMember,
    updateMemberRole,
    removeMember,
    switchUser,
    hasPermission,
    logActivity,
    getTeamStats
  };
}