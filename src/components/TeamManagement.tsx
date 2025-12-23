import React, { useState } from 'react';
import { Users, UserPlus, Crown, Shield, User, Eye, Settings, Activity, Clock, Mail, Trash2, Edit } from 'lucide-react';
import { TeamMember, ROLE_PERMISSIONS } from '../types/team';
import { format } from 'date-fns';

interface TeamManagementProps {
  currentUser: TeamMember;
  teamMembers: TeamMember[];
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (email: string, name: string, role: TeamMember['role']) => boolean;
  onUpdateRole: (memberId: string, role: TeamMember['role']) => boolean;
  onRemoveMember: (memberId: string) => boolean;
  onSwitchUser: (memberId: string) => boolean;
  hasPermission: (action: string, resource: string) => boolean;
  activityLog: any[];
}

export function TeamManagement({
  currentUser,
  teamMembers,
  isOpen,
  onClose,
  onAddMember,
  onUpdateRole,
  onRemoveMember,
  onSwitchUser,
  hasPermission,
  activityLog
}: TeamManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    email: '',
    name: '',
    role: 'staff' as TeamMember['role']
  });
  const [selectedTab, setSelectedTab] = useState<'members' | 'activity' | 'permissions'>('members');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMember.email && newMember.name) {
      const success = onAddMember(newMember.email, newMember.name, newMember.role);
      if (success) {
        setNewMember({ email: '', name: '', role: 'staff' });
        setShowAddForm(false);
      }
    }
  };

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
      case 'owner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'staff': return 'bg-green-100 text-green-800 border-green-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeSince = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-soft">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
              <p className="text-sm text-gray-600 font-medium">Manage team members, roles, and permissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            ×
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Current User Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold text-lg">{currentUser.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900">Logged in as: {currentUser.name}</h3>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(currentUser.role)}
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRoleColor(currentUser.role)}`}>
                      {currentUser.role.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-700 font-semibold">{currentUser.email}</p>
                <p className="text-xs text-blue-600">Last active: {getTimeSince(currentUser.lastActive)}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { id: 'members', label: 'Team Members', icon: Users },
              { id: 'activity', label: 'Activity Log', icon: Activity },
              { id: 'permissions', label: 'Permissions', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-semibold transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'bg-blue-500 text-white shadow-soft'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Members Tab */}
          {selectedTab === 'members' && (
            <div className="space-y-6">
              {/* Add Member Button */}
              {hasPermission('create', 'team') && (
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Team Members ({teamMembers.length})</h3>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft"
                  >
                    <UserPlus className="w-4 h-4" />
                    {showAddForm ? 'Cancel' : 'Add Member'}
                  </button>
                </div>
              )}

              {/* Add Member Form */}
              {showAddForm && (
                <form onSubmit={handleAddMember} className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
                  <h4 className="font-bold text-green-900 mb-4">Add New Team Member</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={newMember.email}
                      onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={newMember.name}
                      onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                      required
                    />
                    <select
                      value={newMember.role}
                      onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value as TeamMember['role'] }))}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
                    >
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 px-6 py-3 gradient-success text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft"
                  >
                    Add Member
                  </button>
                </form>
              )}

              {/* Team Members List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.map(member => (
                  <div key={member.id} className={`rounded-2xl p-6 shadow-soft border-2 ${
                    member.id === currentUser.id 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-soft ${
                          member.isActive 
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                            : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}>
                          <span className="text-white font-bold text-lg">{member.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600 font-semibold">{member.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getRoleIcon(member.role)}
                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {hasPermission('update', 'team') && member.id !== currentUser.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onSwitchUser(member.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
                            title="Switch to this user"
                          >
                            <User className="w-4 h-4" />
                          </button>
                          {member.role !== 'owner' && (
                            <button
                              onClick={() => onRemoveMember(member.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                              title="Remove member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 font-semibold">
                          Joined {format(member.joinedAt, 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 font-semibold">
                          Last active: {getTimeSince(member.lastActive)}
                        </span>
                      </div>
                    </div>

                    {/* Role Change */}
                    {hasPermission('update', 'team') && member.role !== 'owner' && member.id !== currentUser.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <label className="block text-xs text-gray-500 font-bold mb-2">CHANGE ROLE</label>
                        <select
                          value={member.role}
                          onChange={(e) => onUpdateRole(member.id, e.target.value as TeamMember['role'])}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold"
                        >
                          <option value="staff">Staff</option>
                          <option value="manager">Manager</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </div>
                    )}

                    {member.id === currentUser.id && (
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <span className="text-blue-600 font-bold text-sm">👤 Currently logged in</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {selectedTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Team Activity</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activityLog.slice(0, 20).map(activity => (
                  <div key={activity.id} className="bg-white rounded-xl p-4 shadow-soft border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{activity.userName}</p>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-semibold">
                          {format(activity.timestamp, 'MMM dd, HH:mm')}
                        </p>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold">
                          {activity.action}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {selectedTab === 'permissions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Role Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
                  <div key={role} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      {getRoleIcon(role as TeamMember['role'])}
                      <h4 className="font-bold text-gray-900 capitalize">{role}</h4>
                    </div>
                    <div className="space-y-2">
                      {permissions.map((permission, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700 font-semibold">
                            {permission.action} {permission.resource}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Switching */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
            <h4 className="font-bold text-purple-900 mb-4">Switch User (Demo Mode)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {teamMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => onSwitchUser(member.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    member.id === currentUser.id
                      ? 'border-purple-500 bg-purple-100'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{member.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.role}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-purple-600 mt-3 font-medium">
              Click any team member to experience the app from their perspective with role-based permissions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}