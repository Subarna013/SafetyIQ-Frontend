import { useState } from 'react';
import type { ZoneReadings } from '../types';

interface SensorChartsProps {
  zoneReadings: ZoneReadings;
}

const SENSOR_UNITS: Record<string, string> = {
  CO: 'ppm',
  CH4: '% LEL',
  H2S: 'ppm',
  O2: '%',
  H2: 'ppm',
  TEMP: '°C',
  PRESS: 'bar',
  VIB: 'mm/s',
  FLOW: 'm³/hr',
};

const THRESHOLDS: Record<string, { attention: number; alarm: number }> = {
  CO: { attention: 25, alarm: 50 },
  CH4: { attention: 10, alarm: 25 },
  H2S: { attention: 5, alarm: 10 },
  H2: { attention: 15, alarm: 25 },
};

export function SensorCharts({ zoneReadings }: SensorChartsProps) {
  const [selectedZone, setSelectedZone] = useState<string>('A');
  const zones = Object.keys(zoneReadings);
  const readings = zoneReadings[selectedZone] || {};

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-300">
          Sensor Readings
        </h2>
        <div className="flex gap-1">
          {(zones.length > 0 ? zones : ['A', 'B', 'C', 'D', 'E', 'F']).map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                selectedZone === zone
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(readings).length === 0 ? (
        <div className="text-center py-8 text-gray-600 text-sm">
          No sensor data for Zone {selectedZone}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(readings).map(([sensor, value]) => {
            const threshold = THRESHOLDS[sensor];
            const isAboveAttention = threshold && value > threshold.attention;
            const isAboveAlarm = threshold && value > threshold.alarm;
            
            return (
              <div
                key={sensor}
                className={`p-3 rounded-lg border transition-colors ${
                  isAboveAlarm ? 'border-red-700 bg-red-950/30' :
                  isAboveAttention ? 'border-yellow-700 bg-yellow-950/20' :
                  'border-gray-800 bg-gray-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-400">{sensor}</span>
                  <span className="text-[10px] text-gray-500">{SENSOR_UNITS[sensor] || ''}</span>
                </div>
                <p className={`text-lg font-bold tabular-nums ${
                  isAboveAlarm ? 'text-red-400' :
                  isAboveAttention ? 'text-yellow-400' :
                  'text-gray-200'
                }`}>
                  {typeof value === 'number' ? value.toFixed(1) : value}
                </p>
                {threshold && (
                  <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isAboveAlarm ? 'bg-red-500' :
                        isAboveAttention ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (value / threshold.alarm) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SCADA comparison footer */}
      <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          <span className="text-gray-400 font-medium">Traditional SCADA:</span> 47 alarms/hour (ignored)
        </div>
        <div className="text-xs text-gray-500">
          <span className="text-blue-400 font-medium">SafetyIQ:</span> Compound analysis active
        </div>
      </div>
    </div>
  );
}
