// Risk level color mapping
import type { AlertLevel } from '../types';

export const RISK_COLORS: Record<AlertLevel, string> = {
  GREEN: '#22c55e',
  YELLOW: '#eab308',
  ORANGE: '#f97316',
  RED: '#ef4444',
  CRITICAL: '#7f1d1d',
};

export const RISK_BG_COLORS: Record<AlertLevel, string> = {
  GREEN: 'bg-green-500',
  YELLOW: 'bg-yellow-500',
  ORANGE: 'bg-orange-500',
  RED: 'bg-red-500',
  CRITICAL: 'bg-red-900',
};

export const RISK_TEXT_COLORS: Record<AlertLevel, string> = {
  GREEN: 'text-green-400',
  YELLOW: 'text-yellow-400',
  ORANGE: 'text-orange-400',
  RED: 'text-red-400',
  CRITICAL: 'text-red-300',
};

export const RISK_BORDER_COLORS: Record<AlertLevel, string> = {
  GREEN: 'border-green-500',
  YELLOW: 'border-yellow-500',
  ORANGE: 'border-orange-500',
  RED: 'border-red-500',
  CRITICAL: 'border-red-700',
};

export const BARRIER_STATUS_COLORS = {
  INTACT: '#22c55e',
  STRESSED: '#eab308',
  DEGRADED: '#f97316',
  FAILED: '#ef4444',
};

export function getAlertIcon(level: AlertLevel): string {
  switch (level) {
    case 'GREEN': return '[OK]';
    case 'YELLOW': return '[WARN]';
    case 'ORANGE': return '[HIGH]';
    case 'RED': return '[CRIT]';
    case 'CRITICAL': return '[!!!]';
  }
}

export function getBarrierIcon(status: string): string {
  switch (status) {
    case 'INTACT': return '[OK]';
    case 'STRESSED': return '[WARN]';
    case 'DEGRADED': return '[HIGH]';
    case 'FAILED': return '[FAIL]';
    default: return '[--]';
  }
}
