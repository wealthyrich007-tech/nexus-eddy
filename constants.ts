import { 
  LayoutDashboard, 
  ScanLine, 
  BrainCircuit, 
  Settings, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Globe,
  Radio,
  FileBadge,
  Stamp,
  PieChart,
  Server,
  Landmark
} from 'lucide-react';
import { NavItem, AppView, UserRole } from './types';

export const APP_NAME = "DGM NEXUS";
export const PROVINCES_COUNT = 26;

export const NAV_ITEMS: NavItem[] = [
  { 
    id: AppView.DASHBOARD, 
    label: 'Command Center', 
    icon: LayoutDashboard 
    // All roles can access dashboard
  },
  { 
    id: AppView.VERIFICATION, 
    label: 'Border Control', 
    icon: ScanLine,
    allowedRoles: [
      UserRole.BORDER_AGENT, 
      UserRole.SENIOR_INSPECTOR, 
      UserRole.ZONE_COMMANDER, 
      UserRole.DIRECTOR_GENERAL,
      UserRole.SYSTEM_ADMIN
    ]
  },
  {
    id: AppView.FOREIGNERS,
    label: 'Police Étrangers',
    icon: FileBadge,
    allowedRoles: [
      UserRole.SENIOR_INSPECTOR,
      UserRole.ZONE_COMMANDER,
      UserRole.DIRECTOR_GENERAL,
      UserRole.INTELLIGENCE_OFFICER,
      UserRole.BORDER_AGENT
    ]
  },
  {
    id: AppView.VISA_SERVICES,
    label: 'Chancellerie',
    icon: Stamp,
    allowedRoles: [
      UserRole.SENIOR_INSPECTOR,
      UserRole.ZONE_COMMANDER,
      UserRole.DIRECTOR_GENERAL,
      UserRole.SYSTEM_ADMIN
    ]
  },
  {
    id: AppView.FINANCE,
    label: 'Finance',
    icon: Landmark,
    allowedRoles: [
      UserRole.DIRECTOR_GENERAL,
      UserRole.ZONE_COMMANDER,
      UserRole.SYSTEM_ADMIN,
      UserRole.AUDITOR
    ]
  },
  {
    id: AppView.OPERATIONS,
    label: 'Ops Center',
    icon: Server,
    allowedRoles: [
      UserRole.DIRECTOR_GENERAL,
      UserRole.ZONE_COMMANDER,
      UserRole.SYSTEM_ADMIN
    ]
  },
  {
    id: AppView.ANALYTICS,
    label: 'Analytics Hub',
    icon: PieChart,
    allowedRoles: [
      UserRole.DIRECTOR_GENERAL,
      UserRole.ZONE_COMMANDER,
      UserRole.INTELLIGENCE_OFFICER,
      UserRole.SYSTEM_ADMIN
    ]
  },
  {
    id: AppView.COMMUNICATION,
    label: 'Comms Hub',
    icon: Radio,
    allowedRoles: [
      UserRole.ZONE_COMMANDER,
      UserRole.DIRECTOR_GENERAL,
      UserRole.SENIOR_INSPECTOR,
      UserRole.INTELLIGENCE_OFFICER
    ]
  },
  { 
    id: AppView.INTELLIGENCE, 
    label: 'DGM Intelligence', 
    icon: BrainCircuit,
    allowedRoles: [
      UserRole.INTELLIGENCE_OFFICER, 
      UserRole.SENIOR_INSPECTOR, 
      UserRole.ZONE_COMMANDER, 
      UserRole.DIRECTOR_GENERAL
    ]
  },
  { 
    id: AppView.SETTINGS, 
    label: 'System Config', 
    icon: Settings,
    allowedRoles: [
      UserRole.SYSTEM_ADMIN, 
      UserRole.DIRECTOR_GENERAL
    ]
  },
];

export const MOCK_STATS = [
  {
    title: "Daily Crossings",
    value: "12,453",
    change: "+8.2%",
    isPositive: true,
    icon: Users
  },
  {
    title: "Active Alerts",
    value: "47",
    change: "-2.1%",
    isPositive: true,
    icon: AlertTriangle
  },
  {
    title: "Clearance Rate",
    value: "98.4%",
    change: "+0.4%",
    isPositive: true,
    icon: CheckCircle
  },
  {
    title: "Active Posts",
    value: "142",
    change: "0%",
    isPositive: true,
    icon: Globe
  }
];

export const ACTIVITY_DATA = [
  { name: '06:00', in: 400, out: 240 },
  { name: '08:00', in: 800, out: 430 },
  { name: '10:00', in: 1200, out: 900 },
  { name: '12:00', in: 1600, out: 1100 },
  { name: '14:00', in: 1400, out: 1300 },
  { name: '16:00', in: 1100, out: 1500 },
  { name: '18:00', in: 600, out: 900 },
];