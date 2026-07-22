// SafetyIQ Type Definitions

export type AlertLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | 'CRITICAL';

export interface RiskState {
  score: number;
  alert_level: AlertLevel;
  zone_id: string;
  explanation: string;
  contributing_factors: string[];
  amplifiers: Record<string, number>;
  degraded_barriers: number;
  aligned_holes: number;
}

export interface BarrierStatus {
  id: string;
  name: string;
  score: number;
  status: 'INTACT' | 'STRESSED' | 'DEGRADED' | 'FAILED';
  reason: string;
}

export interface AlertEntry {
  id: string;
  timestamp: string;
  alert_level: AlertLevel;
  title: string;
  description: string;
  zone_id: string;
  score: number;
}

export interface InterventionAction {
  priority: number;
  type: string;
  description: string;
  target: string;
  urgency: string;
  zone_id: string;
}

export interface RegulatoryCitation {
  standard: string;
  section: string;
  text: string;
  relevance: string;
}

export interface InterventionData {
  actions: InterventionAction[];
  citations: RegulatoryCitation[];
}

export interface ZoneReading {
  [sensorType: string]: number;
}

export interface ZoneReadings {
  [zoneId: string]: ZoneReading;
}

export interface FullState {
  compound_risk_score: number;
  alert_level: AlertLevel;
  zone_readings: ZoneReadings;
  barrier_health: Record<string, number>;
  aligned_holes: number;
  active_permits: number;
  permit_conflicts: Array<{ type: string; severity: string }>;
  sensor_anomalies: Array<{ zone: string; sensor: string; severity: string }>;
  explanation: string;
  interventions: Array<{ priority: number; type: string; description: string }>;
  citations: RegulatoryCitation[];
  timestamp: string;
}

export interface WSMessage {
  type: 'risk_update' | 'barrier_update' | 'sensor_update' | 'alert' | 'intervention' | 'full_state' | 'timeline_sync' | 'pong' | 'reset';
  timestamp: string;
  data: any;
}
