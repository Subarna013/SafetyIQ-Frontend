import type { ZoneReadings } from '../types';

interface ZoneTableProps {
  zoneReadings: ZoneReadings;
}

const ZONE_NAMES: Record<string, string> = {
  A: 'Coke Oven Battery',
  B: 'Blast Furnace',
  C: 'Steel Melting Shop',
  D: 'Continuous Casting',
  E: 'Gas Holder',
  F: 'Power Plant',
};

const BASELINES: Record<string, Record<string, number>> = {
  A: { CO: 5, CH4: 0.3, H2S: 0.5, TEMP: 250, PRESS: 1.2 },
  B: { CO: 8, CH4: 0.5, TEMP: 1500, PRESS: 2.0, VIB: 3.0 },
  C: { CO: 3, TEMP: 1650, O2: 20.9, PRESS: 1.8, VIB: 2.5 },
  D: { CO: 2, TEMP: 1200, H2: 3, PRESS: 1.5, VIB: 2.0 },
  E: { PRESS: 3.5, FLOW: 450, TEMP: 80 },
  F: { TEMP: 95, VIB: 4.0, PRESS: 1.0 },
};

function getZoneScore(zoneId: string, readings: Record<string, number>): number {
  const baselines = BASELINES[zoneId] || {};
  let totalDev = 0;
  let count = 0;
  for (const [sensor, value] of Object.entries(readings)) {
    const baseline = baselines[sensor];
    if (baseline && baseline > 0) {
      totalDev += Math.abs((value - baseline) / baseline);
      count++;
    }
  }
  return count > 0 ? Math.min(totalDev / count, 1.0) : 0;
}

function getZoneLevel(score: number): string {
  if (score >= 0.3) return 'RED';
  if (score >= 0.2) return 'ORANGE';
  if (score >= 0.1) return 'YELLOW';
  return 'GREEN';
}

export function ZoneTable({ zoneReadings }: ZoneTableProps) {
  const zones = Object.entries(zoneReadings);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-300">
          Zone Risk Overview
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase">
              <th className="px-4 py-2 text-left">Zone</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-center">Score</th>
              <th className="px-3 py-2 text-center">Level</th>
              <th className="px-3 py-2 text-left">Key Readings</th>
            </tr>
          </thead>
          <tbody>
            {zones.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Awaiting sensor data...
                </td>
              </tr>
            ) : (
              zones.map(([zoneId, readings]) => {
                const score = getZoneScore(zoneId, readings);
                const level = getZoneLevel(score);
                return (
                  <tr key={zoneId} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-4 py-2 font-mono font-bold text-gray-200">{zoneId}</td>
                    <td className="px-3 py-2 text-gray-300 text-xs">{ZONE_NAMES[zoneId] || zoneId}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`font-mono text-xs ${
                        level === 'RED' ? 'text-red-400' :
                        level === 'ORANGE' ? 'text-orange-400' :
                        level === 'YELLOW' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {score.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        level === 'RED' ? 'bg-red-900/50 text-red-300' :
                        level === 'ORANGE' ? 'bg-orange-900/50 text-orange-300' :
                        level === 'YELLOW' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-green-900/50 text-green-300'
                      }`}>
                        {level}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(readings).slice(0, 4).map(([sensor, value]) => (
                          <span key={sensor} className="text-[10px] px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">
                            {sensor}: {typeof value === 'number' ? value.toFixed(1) : value}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
