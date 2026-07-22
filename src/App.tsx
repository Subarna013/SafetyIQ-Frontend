import { useWebSocket } from './hooks/useWebSocket';
import { RiskScore } from './components/RiskScore';
import { AlertTimeline } from './components/AlertTimeline';
import { InterventionPanel } from './components/InterventionPanel';
import { BarrierBoard } from './components/BarrierBoard';
import { ZoneTable } from './components/ZoneTable';
import { SensorCharts } from './components/SensorCharts';
import { Header } from './components/Header';
import { ScenarioControl } from './components/ScenarioControl';
import { CCTVPanel } from './components/CCTVPanel';
import PlantMap from './components/PlantMap';

export default function App() {
  const {
    connected,
    riskState,
    barriers,
    alerts,
    intervention,
    zoneReadings,
    sendMessage,
  } = useWebSocket();

  // Compute per-zone risk scores from barrier + sensor data
  const zoneRiskScores: Record<string, number> = {};
  if (zoneReadings) {
    const baselines: Record<string, Record<string, number>> = {
      A: { CO: 5, CH4: 0.3, H2S: 0.5, TEMP: 250, PRESS: 1.2 },
      B: { CO: 8, CH4: 0.5, TEMP: 1500, PRESS: 2.0, VIB: 3.0 },
      C: { CO: 3, TEMP: 1650, O2: 20.9, PRESS: 1.8, VIB: 2.5 },
      D: { CO: 2, TEMP: 1200, H2: 3, PRESS: 1.5, VIB: 2.0 },
      E: { PRESS: 3.5, FLOW: 450, TEMP: 80 },
      F: { TEMP: 95, VIB: 4.0, PRESS: 1.0 },
    };

    for (const [zoneId, readings] of Object.entries(zoneReadings)) {
      const zoneBase = baselines[zoneId] || {};
      let maxDev = 0;
      for (const [sensor, value] of Object.entries(readings)) {
        const base = zoneBase[sensor] || value;
        if (base > 0) {
          const dev = Math.abs((value - base) / base);
          maxDev = Math.max(maxDev, dev);
        }
      }
      zoneRiskScores[zoneId] = Math.min(maxDev * 2, 1.0); // Scale to 0-1
    }
  }

  const handleReset = () => {
    sendMessage({ type: 'request_state' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header connected={connected} riskLevel={riskState?.alert_level || 'GREEN'} />

      <main className="max-w-[1920px] mx-auto p-4 grid grid-cols-12 gap-4">
        {/* Left Column - Risk Score & Barriers & CCTV */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <RiskScore
            score={riskState?.score ?? 0}
            alertLevel={riskState?.alert_level || 'GREEN'}
            explanation={riskState?.explanation || 'Awaiting sensor data...'}
            degradedBarriers={riskState?.degraded_barriers ?? 0}
            alignedHoles={riskState?.aligned_holes ?? 0}
          />
          <BarrierBoard barriers={barriers} />
          <CCTVPanel
            alertLevel={riskState?.alert_level || 'GREEN'}
            zoneId={riskState?.zone_id || 'A'}
          />
        </div>

        {/* Center Column - Map, Zone Table, Sensors */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          {/* Geospatial Safety Heatmap */}
          <div className="h-[400px] rounded-xl overflow-hidden border border-gray-700">
            <PlantMap
              zoneReadings={zoneReadings || {}}
              zoneRiskScores={zoneRiskScores}
              activeAlertZone={riskState?.alert_level === 'CRITICAL' ? riskState?.zone_id : undefined}
            />
          </div>

          <ZoneTable zoneReadings={zoneReadings} />
          <SensorCharts zoneReadings={zoneReadings} />
          
          {/* Intervention Panel - shows when CRITICAL */}
          {intervention && (
            <InterventionPanel intervention={intervention} />
          )}
        </div>

        {/* Right Column - Timeline & Controls */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <ScenarioControl onReset={handleReset} />
          <AlertTimeline alerts={alerts} />
        </div>
      </main>
    </div>
  );
}
