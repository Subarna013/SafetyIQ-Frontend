import type { AlertLevel } from '../types';
import { RISK_COLORS } from '../utils/colors';

interface RiskScoreProps {
  score: number;
  alertLevel: AlertLevel;
  explanation: string;
  degradedBarriers: number;
  alignedHoles: number;
}

export function RiskScore({ score, alertLevel, explanation, degradedBarriers, alignedHoles }: RiskScoreProps) {
  const isCritical = alertLevel === 'CRITICAL';
  const isRed = alertLevel === 'RED';
  const color = RISK_COLORS[alertLevel];

  return (
    <div className={`rounded-xl border-2 p-6 transition-all duration-500 ${
      isCritical ? 'border-red-700 bg-red-950/50 risk-pulse-fast' :
      isRed ? 'border-red-500 bg-red-950/30 risk-pulse' :
      alertLevel === 'ORANGE' ? 'border-orange-500 bg-orange-950/20' :
      alertLevel === 'YELLOW' ? 'border-yellow-500 bg-yellow-950/20' :
      'border-gray-700 bg-gray-900'
    }`}>
      <div className="text-center">
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
          Compound Risk Score
        </p>
        
        {/* Big score number */}
        <div
          className="text-6xl font-black tabular-nums mb-1 transition-colors duration-300"
          style={{ color }}
        >
          {score.toFixed(2)}
        </div>
        
        {/* Alert level badge */}
        <div
          className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mt-2 ${
            isCritical ? 'bg-red-900 text-red-200 animate-pulse' :
            isRed ? 'bg-red-900/50 text-red-300' :
            alertLevel === 'ORANGE' ? 'bg-orange-900/50 text-orange-300' :
            alertLevel === 'YELLOW' ? 'bg-yellow-900/50 text-yellow-300' :
            'bg-green-900/50 text-green-300'
          }`}
        >
          {alertLevel}
        </div>
      </div>

      {/* Swiss Cheese indicators */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-orange-400">{degradedBarriers}/8</p>
          <p className="text-xs text-gray-400 mt-1">Barriers Degraded</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{alignedHoles}</p>
          <p className="text-xs text-gray-400 mt-1">Holes Aligned</p>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
        <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
          {explanation}
        </p>
      </div>
    </div>
  );
}
