
export interface NavItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles?: UserRole[];
}

export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: any;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  VERIFICATION = 'VERIFICATION',
  FOREIGNERS = 'FOREIGNERS',
  VISA_SERVICES = 'VISA_SERVICES',
  ANALYTICS = 'ANALYTICS',
  OPERATIONS = 'OPERATIONS',
  FINANCE = 'FINANCE', // New Module: Direction des Finances
  INTELLIGENCE = 'INTELLIGENCE', 
  COMMUNICATION = 'COMMUNICATION',
  SETTINGS = 'SETTINGS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface PassportData {
  id: string;
  name: string;
  nationality: string;
  dob: string;
  status: 'VALID' | 'EXPIRED' | 'FLAGGED';
  confidence: number;
}

export enum UserRole {
  DIRECTOR_GENERAL = 'DIRECTOR_GENERAL',
  ZONE_COMMANDER = 'ZONE_COMMANDER',
  SENIOR_INSPECTOR = 'SENIOR_INSPECTOR',
  BORDER_AGENT = 'BORDER_AGENT',
  INTELLIGENCE_OFFICER = 'INTELLIGENCE_OFFICER',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  AUDITOR = 'AUDITOR'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  clearanceLevel: number;
  location: string;
  isEmergencyMode?: boolean;
}