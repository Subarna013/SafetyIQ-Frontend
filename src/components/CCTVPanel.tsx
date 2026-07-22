import type { AlertLevel } from '../types';

interface CCTVPanelProps {
  alertLevel: AlertLevel;
  zoneId: string;
}

/**
 * CCTV Analytics Mock Panel
 * Demonstrates Computer Vision integration for safety monitoring.
 * Shows simulated camera feeds with AI annotations.
 */
export function CCTVPanel({ alertLevel, zoneId }: CCTVPanelProps) {
  const isCritical = alertLevel === 'CRITICAL' || alertLevel === 'RED';

  // Simulated CCTV detections based on alert level
  const detections = getDetections(alertLevel, zoneId);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          📹 CCTV Analytics
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded ${
          isCritical ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
        }`}>
          {isCritical ? 'ALERT' : 'MONITORING'}
        </span>
      </div>

      {/* Camera grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {['CAM-A1', 'CAM-B1', 'CAM-C1', 'CAM-E1'].map((cam) => (
          <div
            key={cam}
            className={`relative bg-gray-800 rounded border ${
              cam.includes(zoneId) && isCritical
                ? 'border-red-500'
                : 'border-gray-700'
            } aspect-video flex items-center justify-center`}
          >
            <div className="text-center">
              <div className="text-gray-600 text-xs">{cam}</div>
              <div className="text-gray-500 text-[10px]">
                Zone {cam.split('-')[1][0]}
              </div>
            </div>
            {/* Recording indicator */}
            <div className="absolute top-1 right-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[9px] text-red-400">REC</span>
            </div>
            {/* AI detection overlay */}
            {cam.includes(zoneId) && isCritical && (
              <div className="absolute inset-0 border-2 border-red-500/50 rounded flex items-center justify-center">
                <span className="text-red-400 text-[10px] font-bold bg-black/60 px-1 rounded">
                  ⚠ ANOMALY
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CV Detections */}
      <div className="space-y-1.5">
        <div className="text-xs text-gray-400 font-medium">AI Detections:</div>
        {detections.map((det, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 text-xs p-1.5 rounded ${
              det.severity === 'high'
                ? 'bg-red-950/30 text-red-300'
                : det.severity === 'medium'
                ? 'bg-yellow-950/30 text-yellow-300'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            <span>{det.icon}</span>
            <span className="flex-1">{det.text}</span>
            <span className="text-[10px] text-gray-500">{det.confidence}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Detection {
  icon: string;
  text: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
}

function getDetections(alertLevel: AlertLevel, zoneId: string): Detection[] {
  const base: Detection[] = [
    { icon: '👷', text: 'PPE compliance: 100%', confidence: 97, severity: 'low' },
    { icon: '🚶', text: `Workers in Zone ${zoneId}: 3 detected`, confidence: 94, severity: 'low' },
  ];

  if (alertLevel === 'YELLOW' || alertLevel === 'ORANGE') {
    base.push(
      { icon: '💨', text: `Vapor plume detected near Zone ${zoneId}`, confidence: 78, severity: 'medium' },
    );
  }

  if (alertLevel === 'RED' || alertLevel === 'CRITICAL') {
    return [
      { icon: '🔥', text: 'Thermal anomaly detected — flange area', confidence: 92, severity: 'high' },
      { icon: '💨', text: 'Gas plume visible — expanding', confidence: 88, severity: 'high' },
      { icon: '👷', text: `3 workers in danger zone ${zoneId}`, confidence: 96, severity: 'high' },
      { icon: '🚫', text: 'PPE violation: no escape respirator', confidence: 85, severity: 'medium' },
    ];
  }

  return base;
}
