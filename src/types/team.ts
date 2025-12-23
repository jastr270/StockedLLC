export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'manager' | 'staff' | 'viewer';
  avatar?: string;
  joinedAt: Date;
  lastActive: Date;
  permissions: Permission[];
  isActive: boolean;
}

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'analytics' | 'quality_control' | 'voice_input' | 'camera_scan';
  resource: 'inventory' | 'reports' | 'team' | 'settings' | 'suppliers';
}

export interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: Date;
  settings: TeamSettings;
  subscription: {
    planId: string;
    maxMembers: number;
    features: string[];
  };
}

export interface TeamSettings {
  allowVoiceInput: boolean;
  requireQualityChecks: boolean;
  autoBackup: boolean;
  notificationSettings: {
    lowStock: boolean;
    expiration: boolean;
    qualityIssues: boolean;
    teamUpdates: boolean;
  };
  workflowSettings: {
    requireApproval: boolean;
    approvalThreshold: number;
    autoReorder: boolean;
  };
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
}

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: [
    { action: 'create', resource: 'inventory' },
    { action: 'read', resource: 'inventory' },
    { action: 'update', resource: 'inventory' },
    { action: 'delete', resource: 'inventory' },
    { action: 'export', resource: 'reports' },
    { action: 'read', resource: 'analytics' },
    { action: 'create', resource: 'team' },
    { action: 'update', resource: 'team' },
    { action: 'delete', resource: 'team' },
    { action: 'update', resource: 'settings' },
    { action: 'create', resource: 'suppliers' },
    { action: 'update', resource: 'suppliers' }
  ],
  manager: [
    { action: 'create', resource: 'inventory' },
    { action: 'read', resource: 'inventory' },
    { action: 'update', resource: 'inventory' },
    { action: 'delete', resource: 'inventory' },
    { action: 'export', resource: 'reports' },
    { action: 'read', resource: 'analytics' },
    { action: 'read', resource: 'team' },
    { action: 'create', resource: 'suppliers' },
    { action: 'update', resource: 'suppliers' }
  ],
  staff: [
    { action: 'create', resource: 'inventory' },
    { action: 'read', resource: 'inventory' },
    { action: 'update', resource: 'inventory' },
    { action: 'read', resource: 'reports' },
    { action: 'read', resource: 'team' }
  ],
  viewer: [
    { action: 'read', resource: 'inventory' },
    { action: 'read', resource: 'reports' },
    { action: 'read', resource: 'team' }
  ]
};