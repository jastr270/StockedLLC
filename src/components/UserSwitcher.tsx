import React from 'react';
import { Users, Crown, Shield, User, Eye } from 'lucide-react';
import { TeamMember } from '../types/team';

interface UserSwitcherProps {
  currentUser: TeamMember;
  teamMembers: TeamMember[];
  onSwitchUser: (memberId: string) => void;
}

export function UserSwitcher({ currentUser, teamMembers, onSwitchUser }: UserSwitcherProps) {
  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-purple-600" />;
      case 'manager': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'staff': return <User className="w-4 h-4 text-green-600" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner': return 'from-purple-400 to-purple-600';
      case 'manager': return 'from-blue-400 to-blue-600';
      case 'staff': return 'from-green-400 to-green-600';
      case 'viewer': return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="glass-effect rounded-2xl shadow-elegant p-6 mb-8 border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-white">Team Collaboration</h3>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(currentUser.role)} rounded-full flex items-center justify-center shadow-soft`}>
            <span className="text-white font-bold text-lg">{currentUser.name.charAt(0)}</span>
          </div>
          <div>
            <p className="text-white font-bold">{currentUser.name}</p>
            <div className="flex items-center gap-2">
              {getRoleIcon(currentUser.role)}
              <span className="text-white/80 text-sm font-semibold">{currentUser.role}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {teamMembers.filter(m => m.id !== currentUser.id).slice(0, 3).map(member => (
            <button
              key={member.id}
              onClick={() => onSwitchUser(member.id)}
              className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(member.role)} rounded-full flex items-center justify-center shadow-soft hover:scale-110 transition-all duration-300`}
              title={`Switch to ${member.name} (${member.role})`}
            >
              <span className="text-white font-bold text-sm">{member.name.charAt(0)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-white/60 font-semibold">Team Size</p>
          <p className="text-white font-bold">{teamMembers.length} members</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-white/60 font-semibold">Your Role</p>
          <p className="text-white font-bold capitalize">{currentUser.role}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-white/60 font-semibold">Permissions</p>
          <p className="text-white font-bold">{currentUser.permissions.length} granted</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-white/60 font-semibold">Status</p>
          <p className="text-white font-bold">{currentUser.isActive ? 'Active' : 'Inactive'}</p>
        </div>
      </div>
    </div>
  );
}