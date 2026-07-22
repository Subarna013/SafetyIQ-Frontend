import { useState } from 'react';

interface ScenarioControlProps {
  onReset: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function ScenarioControl({ onReset }: ScenarioControlProps) {
  const [running, setRunning] = useState(false);
  const [scenario, setScenario] = useState('vizag');
  const [speed, setSpeed] = useState(2);
  const [status, setStatus] = useState('');

  const startScenario = async () => {
    setRunning(true);
    setStatus(`Starting ${scenario} scenario...`);
    
    // Reset first
    await fetch(`${API_BASE}/api/scenario/reset`, { method: 'POST' });
    onReset();
    
    setStatus(`Running ${scenario} (tick: ${speed}s) — watch the dashboard!`);
  };

  const resetSystem = async () => {
    await fetch(`${API_BASE}/api/scenario/reset`, { method: 'POST' });
    onReset();
    setRunning(false);
    setStatus('System reset. Ready for new scenario.');
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
        Demo Control
      </h3>

      <div className="space-y-3">
        {/* Scenario selector */}
        <div className="flex gap-2">
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-gray-200"
            disabled={running}
          >
            <option value="vizag">Vizag Pattern (Primary)</option>
            <option value="hot_work">Hot Work Proximity</option>
            <option value="equipment_cascade">Equipment Cascade</option>
          </select>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-gray-200"
            disabled={running}
          >
            <option value={1}>Fast (1s)</option>
            <option value={2}>Normal (2s)</option>
            <option value={5}>Slow (5s)</option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={startScenario}
            disabled={running}
            className={`flex-1 py-2 rounded font-medium text-sm transition-colors ${
              running
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {running ? '▶ Running...' : '▶ Start Demo'}
          </button>
          <button
            onClick={resetSystem}
            className="px-4 py-2 rounded font-medium text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
          >
            ↺ Reset
          </button>
        </div>

        {/* Instructions */}
        {!running && !status && (
          <p className="text-xs text-gray-500">
            Run the simulator in terminal:{' '}
            <code className="bg-gray-800 px-1 rounded">
              SCENARIO={scenario} TICK_INTERVAL={speed} python -m simulator.main
            </code>
          </p>
        )}

        {/* Status */}
        {status && (
          <p className="text-xs text-emerald-400">{status}</p>
        )}
      </div>
    </div>
  );
}
