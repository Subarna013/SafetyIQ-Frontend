import { useState, useEffect, useRef, useCallback } from 'react';
import type { WSMessage, RiskState, BarrierStatus, AlertEntry, InterventionData, ZoneReadings, FullState } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 10;

interface SafetyIQState {
  connected: boolean;
  riskState: RiskState | null;
  barriers: BarrierStatus[];
  alerts: AlertEntry[];
  intervention: InterventionData | null;
  zoneReadings: ZoneReadings;
  fullState: FullState | null;
}

export function useWebSocket() {
  const [state, setState] = useState<SafetyIQState>({
    connected: false,
    riskState: null,
    barriers: [],
    alerts: [],
    intervention: null,
    zoneReadings: {},
    fullState: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setState(prev => ({ ...prev, connected: true }));
        reconnectAttempts.current = 0;
        
        // Start ping/pong keepalive
        pingInterval.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      ws.onclose = () => {
        setState(prev => ({ ...prev, connected: false }));
        if (pingInterval.current) clearInterval(pingInterval.current);
        attemptReconnect();
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (e) {
      console.error('WebSocket connection error:', e);
      attemptReconnect();
    }
  }, []);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) return;
    
    reconnectAttempts.current++;
    reconnectTimeout.current = setTimeout(() => {
      connect();
    }, RECONNECT_DELAY);
  }, [connect]);

  const handleMessage = useCallback((message: WSMessage) => {
    switch (message.type) {
      case 'risk_update':
        setState(prev => ({
          ...prev,
          riskState: message.data as RiskState,
          // Clear intervention if risk drops below CRITICAL
          intervention: message.data.alert_level !== 'CRITICAL' ? null : prev.intervention,
        }));
        break;

      case 'barrier_update':
        setState(prev => ({
          ...prev,
          barriers: message.data as BarrierStatus[],
        }));
        break;

      case 'sensor_update':
        setState(prev => ({
          ...prev,
          zoneReadings: message.data as ZoneReadings,
        }));
        break;

      case 'alert':
        setState(prev => ({
          ...prev,
          alerts: [message.data as AlertEntry, ...prev.alerts].slice(0, 50),
        }));
        break;

      case 'intervention':
        setState(prev => ({
          ...prev,
          intervention: message.data as InterventionData,
        }));
        break;

      case 'full_state':
        const fullState = message.data as FullState;
        setState(prev => ({
          ...prev,
          fullState,
          riskState: {
            score: fullState.compound_risk_score,
            alert_level: fullState.alert_level,
            zone_id: '',
            explanation: fullState.explanation,
            contributing_factors: [],
            amplifiers: {},
            degraded_barriers: Object.values(fullState.barrier_health).filter(v => v < 0.5).length,
            aligned_holes: fullState.aligned_holes,
          },
          zoneReadings: fullState.zone_readings,
        }));
        break;

      case 'timeline_sync':
        setState(prev => ({
          ...prev,
          alerts: message.data as AlertEntry[],
        }));
        break;

      case 'reset':
        setState({
          connected: true,
          riskState: null,
          barriers: [],
          alerts: [],
          intervention: null,
          zoneReadings: {},
          fullState: null,
        });
        break;

      case 'pong':
        // Keepalive response, no action needed
        break;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (pingInterval.current) clearInterval(pingInterval.current);
    };
  }, [connect]);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { ...state, sendMessage };
}
