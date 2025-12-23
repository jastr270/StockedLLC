import React, { useState } from 'react';
import { User, Settings, LogOut, Shield, Crown, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export function UserProfile() {
  const { user, team, logout, hasPermission } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  if (!user || !team) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-purple-600" />;
      case 'admin': return <Shield className="w-4 h-4 text-blue-600" />;
      default: return <User className="w-4 h-4 text-green-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manager': return 'bg-green-100 text-green-800 border-green-200';
      case 'staff': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSave = () => {
    // In real app, this would update the user profile
    setIsEditing(false);
  };

  return (
    <div className="glass-effect rounded-2xl shadow-elegant p-6 mb-8 border border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-xl">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          
          <div>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-1 border border-white/30 rounded-lg bg-white/20 text-white font-bold"
                />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  className="px-3 py-1 border border-white/30 rounded-lg bg-white/20 text-white/80 text-sm"
                />
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <p className="text-white/80 font-semibold">{user.email}</p>
              </>
            )}
            
            <div className="flex items-center gap-2 mt-2">
              {getRoleIcon(user.role)}
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleColor(user.role)}`}>
                {user.role.toUpperCase()}
              </span>
              <span className="text-white/60 text-xs font-semibold">
                in {team.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 text-green-300 hover:text-green-100 hover:bg-green-500/20 rounded-lg transition-all duration-300"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-lg transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              <Edit className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={logout}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-white/60 font-semibold">Member Since</p>
          <p className="text-white font-bold">{format(user.createdAt, 'MMM yyyy')}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-white/60 font-semibold">Last Login</p>
          <p className="text-white font-bold">{format(user.lastLogin, 'MMM dd')}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-white/60 font-semibold">Team Members</p>
          <p className="text-white font-bold">{team.members?.length || 1}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-white/60 font-semibold">Subscription</p>
          <p className="text-white font-bold capitalize">{team.subscription.status}</p>
        </div>
      </div>
    </div>
  );
}