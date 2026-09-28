/**
 * Smart City Urban Incident & Complaint Analytics Dashboard - Type Definitions
 */

export type Department = 
  | 'Sanitation' 
  | 'Roads' 
  | 'Water' 
  | 'Electrical' 
  | 'Public Safety';

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus = 'Open' | 'In Progress' | 'Resolved';

export interface Incident {
  id: string;
  title: string;
  narrative: string;
  category: string;
  department: Department;
  ward: string;
  location: string;
  reportedTime: string;
  timestamp: string;
  severity: Severity;
  status: IncidentStatus;
  slaRemaining: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  reporterPhone?: string;
  assignedUnit?: string;
  assignedLead?: string;
  photoUrl?: string;
}

export interface WardData {
  code: string;
  name: string;
  councilor: string;
  activeComplaints: number;
  velocityRank: number;
  avgTtrHours: number;
  slaCompliance: number;
  density: 'Low' | 'Med' | 'High' | 'Critical';
  polygonCoords?: string;
}

export interface FieldUnit {
  id: string;
  callSign: string;
  type: 'water' | 'road' | 'elec' | 'sanit';
  typeName: string;
  driver: string;
  radioChannel: string;
  coordinates: string;
  vitals: string;
  status: 'Available' | 'In Transit' | 'On Scene';
  currentTicket?: string;
  ward: string;
  fuelPct: number;
  lastPing: string;
  mapPos: { top: string; left: string };
}

export interface StreamEvent {
  id: string;
  type: 'CRITICAL ESCALATION' | 'CREW DISPATCH' | 'SLA RESOLUTION' | 'AI SENSOR TRIGGER';
  title: string;
  location: string;
  timestamp: string;
  cadRef?: string;
  incidentId?: string;
  tag?: string;
}

export type MissionSystemTab = 
  | 'incident-operations' 
  | 'ward-analytics' 
  | 'live-dispatch-and-field-units' 
  | 'ai-prompt-engineering-and-ese-spec-workspace' 
  | 'system-settings';
