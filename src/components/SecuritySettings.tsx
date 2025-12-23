import React, { useState } from 'react';
import { Shield, Lock, Users, Clock, Eye, AlertTriangle, CheckCircle, Key, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SecuritySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecuritySettings({ isOpen, onClose }: SecuritySettingsProps) {
  const { user, team, hasPermission } = useAuth();
  const [settings, setSettings] = useState({
    requireTwoFactor: false,
    sessionTimeout: 480, // 8 hours
    allowMobileAccess: true,
    auditLogging: true,
    passwordExpiry: 90, // days
    maxLoginAttempts: 5,
    allowGuestAccess: false,
    ipWhitelist: '',
    dataRetention: 365 // days
  });

  const [activeSessions, setActiveSessions] = useState([
    {
      id: '1',
      device: 'Chrome on MacBook Pro',
      location: 'New York, NY',
      lastActive: new Date(),
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'New York, NY',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      current: false
    }
  ]);

  const [auditLog, setAuditLog] = useState([
    {
      id: '1',
      action: 'User Login',
      user: user?.name || 'Current User',
      timestamp: new Date(),
      ipAddress: '192.168.1.100',
      details: 'Successful login from Chrome browser'
    },
    {
      id: '2',
      action: 'Inventory Updated',
      user: user?.name || 'Current User',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      ipAddress: '192.168.1.100',
      details: 'Updated White Rice quantity from 25 to 23'
    },
    {
      id: '3',
      action: 'Team Member Invited',
      user: user?.name || 'Current User',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ipAddress: '192.168.1.100',
      details: 'Invited staff@restaurant.com as Staff member'
    }
  ]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const revokeSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl shadow-soft">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Security & Privacy</h2>
              <p className="text-sm text-gray-600 font-medium">Manage account security and team access controls</p>
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
          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-800">Security Score</span>
              </div>
              <p className="text-3xl font-bold text-green-700">94%</p>
              <p className="text-sm text-green-600">Excellent protection</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Active Sessions</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">{activeSessions.length}</p>
              <p className="text-sm text-blue-600">Logged in devices</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">Audit Events</span>
              </div>
              <p className="text-3xl font-bold text-purple-700">{auditLog.length}</p>
              <p className="text-sm text-purple-600">Recent activities</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-amber-600" />
                <span className="font-bold text-amber-800">Session Timeout</span>
              </div>
              <p className="text-3xl font-bold text-amber-700">{Math.floor(settings.sessionTimeout / 60)}h</p>
              <p className="text-sm text-amber-600">Auto logout</p>
            </div>
          </div>

          {/* Security Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Authentication Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add extra security with SMS or app</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.requireTwoFactor}
                      onChange={(e) => handleSettingChange('requireTwoFactor', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Mobile Access</p>
                      <p className="text-sm text-gray-600">Allow login from mobile devices</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowMobileAccess}
                      onChange={(e) => handleSettingChange('allowMobileAccess', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <p className="font-semibold text-gray-900">Session Timeout</p>
                  </div>
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg font-medium"
                  >
                    <option value={60}>1 hour</option>
                    <option value={240}>4 hours</option>
                    <option value={480}>8 hours</option>
                    <option value={720}>12 hours</option>
                    <option value={1440}>24 hours</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Team Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Audit Logging</p>
                      <p className="text-sm text-gray-600">Track all user actions</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.auditLogging}
                      onChange={(e) => handleSettingChange('auditLogging', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="w-5 h-5 text-red-600" />
                    <p className="font-semibold text-gray-900">Data Retention</p>
                  </div>
                  <select
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg font-medium"
                  >
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={365}>1 year</option>
                    <option value={1095}>3 years</option>
                    <option value={-1}>Forever</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Active Sessions</h3>
            <div className="space-y-3">
              {activeSessions.map(session => (
                <div key={session.id} className={`p-4 border rounded-xl ${
                  session.current ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${session.current ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <p className="font-semibold text-gray-900">{session.device}</p>
                        <p className="text-sm text-gray-600">{session.location}</p>
                        <p className="text-xs text-gray-500">
                          {session.current ? 'Current session' : `Last active: ${format(session.lastActive, 'MMM dd, HH:mm')}`}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => revokeSession(session.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 text-sm font-semibold"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Security Audit Log</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {auditLog.map(log => (
                <div key={log.id} className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-600">{log.details}</p>
                      <p className="text-xs text-gray-500">
                        {log.user} • {format(log.timestamp, 'MMM dd, HH:mm')} • {log.ipAddress}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                      log.action.includes('Login') ? 'bg-blue-100 text-blue-800' :
                      log.action.includes('Updated') ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {log.action.split(' ')[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Password Policy */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-amber-900 mb-4">Password Policy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-amber-800 font-semibold">Minimum 8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-amber-800 font-semibold">Uppercase and lowercase letters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-amber-800 font-semibold">At least one number</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-amber-800 font-semibold">Special character required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-amber-800 font-semibold">No common passwords</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-800 font-semibold">Expires every {settings.passwordExpiry} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Actions */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-red-900 mb-4">Emergency Security Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-red-300 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 font-bold text-sm">
                <Key className="w-5 h-5 mx-auto mb-2" />
                Reset All Passwords
              </button>
              <button className="p-4 border-2 border-red-300 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 font-bold text-sm">
                <Users className="w-5 h-5 mx-auto mb-2" />
                Revoke All Sessions
              </button>
              <button className="p-4 border-2 border-red-300 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 font-bold text-sm">
                <Lock className="w-5 h-5 mx-auto mb-2" />
                Lock Team Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}