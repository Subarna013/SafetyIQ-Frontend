import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

interface PlantMapProps {
  zoneReadings: Record<string, Record<string, number>>;
  zoneRiskScores?: Record<string, number>;
  activeAlertZone?: string;
}

interface ZoneConfig {
  id: string;
  name: string;
  coordinates: LatLngExpression;
}

const ZONES: ZoneConfig[] = [
  { id: 'A', name: 'Coke Oven', coordinates: [17.7160, 83.2980] },
  { id: 'B', name: 'Blast Furnace', coordinates: [17.7165, 83.2990] },
  { id: 'C', name: 'Steel Melting Shop', coordinates: [17.7170, 83.3000] },
  { id: 'D', name: 'Continuous Casting', coordinates: [17.7175, 83.3010] },
  { id: 'E', name: 'Gas Holder', coordinates: [17.7155, 83.2985] },
  { id: 'F', name: 'Power Plant', coordinates: [17.7160, 83.3005] },
];

const PLANT_CENTER: LatLngExpression = [17.716, 83.299];
const DEFAULT_ZOOM = 16;

function getRiskColor(score: number): string {
  if (score >= 0.8) return '#8b0000'; // darkred
  if (score >= 0.6) return '#dc2626'; // red
  if (score >= 0.4) return '#f97316'; // orange
  if (score >= 0.2) return '#eab308'; // yellow
  return '#22c55e'; // green
}

function getRiskLabel(score: number): string {
  if (score >= 0.8) return 'Critical';
  if (score >= 0.6) return 'High';
  if (score >= 0.4) return 'Moderate';
  if (score >= 0.2) return 'Low';
  return 'Safe';
}

/** Flies to active alert zone when it changes */
function FlyToAlert({ activeZone }: { activeZone?: string }) {
  const map = useMap();

  useEffect(() => {
    if (!activeZone) return;
    const zone = ZONES.find((z) => z.id === activeZone);
    if (zone) {
      map.flyTo(zone.coordinates, 17, { duration: 1 });
    }
  }, [activeZone, map]);

  return null;
}

/** Pulsing circle for critical zones */
function PulsingMarker({
  center,
  color,
}: {
  center: LatLngExpression;
  color: string;
}) {
  return (
    <CircleMarker
      center={center}
      radius={22}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.2,
        weight: 2,
        opacity: 0.6,
        className: 'zone-pulse-marker',
      }}
    />
  );
}

export default function PlantMap({
  zoneReadings,
  zoneRiskScores = {},
  activeAlertZone,
}: PlantMapProps) {
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-700">
      {/* Pulse animation style for critical zones */}
      <style>{`
        @keyframes zone-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.15);
          }
        }
        .zone-pulse-marker {
          animation: zone-pulse 1.2s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      <MapContainer
        center={PLANT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full min-h-[400px]"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToAlert activeZone={activeAlertZone} />

        {ZONES.map((zone) => {
          const riskScore = zoneRiskScores[zone.id] ?? 0;
          const color = getRiskColor(riskScore);
          const isCritical = riskScore >= 0.8;
          const readings = zoneReadings[zone.id] ?? {};

          return (
            <span key={zone.id}>
              {/* Pulsing outer ring for critical zones */}
              {isCritical && (
                <PulsingMarker center={zone.coordinates} color={color} />
              )}

              {/* Main zone marker */}
              <CircleMarker
                center={zone.coordinates}
                radius={14}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.5,
                  weight: 3,
                }}
              >
                <Popup>
                  <div className="text-sm min-w-[180px]">
                    <div className="font-bold text-base mb-1">
                      Zone {zone.id}: {zone.name}
                    </div>
                    <div
                      className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white mb-2"
                      style={{ backgroundColor: color }}
                    >
                      {getRiskLabel(riskScore)} — {(riskScore * 100).toFixed(0)}%
                    </div>

                    {Object.keys(readings).length > 0 && (
                      <div className="mt-2 border-t border-gray-200 pt-2">
                        <div className="font-semibold text-xs text-gray-600 mb-1">
                          Sensor Readings:
                        </div>
                        <ul className="text-xs space-y-0.5">
                          {Object.entries(readings).map(([sensor, value]) => (
                            <li key={sensor} className="flex justify-between">
                              <span className="text-gray-700">{sensor}:</span>
                              <span className="font-mono">
                                {typeof value === 'number' ? value.toFixed(2) : value}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            </span>
          );
        })}
      </MapContainer>

      {/* Legend overlay */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-xs">
        <div className="font-semibold text-gray-200 mb-1.5">Risk Level</div>
        <div className="space-y-1">
          {[
            { label: 'Safe (0–20%)', color: '#22c55e' },
            { label: 'Low (20–40%)', color: '#eab308' },
            { label: 'Moderate (40–60%)', color: '#f97316' },
            { label: 'High (60–80%)', color: '#dc2626' },
            { label: 'Critical (80%+)', color: '#8b0000' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
