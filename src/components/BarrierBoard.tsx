import type { BarrierStatus } from '../types';
import { getBarrierIcon } from '../utils/colors';

interface BarrierBoardProps {
  barriers: BarrierStatus[];
}

export function BarrierBoard({ barriers }: BarrierBoardProps) {
  const degradedCount = barriers.filter(b => b.score < 0.5).length;
  const bowTieStatus = degradedCount >= 3 ? 'CRITICAL' : degradedCount >= 2 ? 'STRESSED' : 'INTACT';

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-300">
          Barrier Status
        </h2>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          bowTieStatus === 'CRITICAL' ? 'bg-red-900/50 text-red-300' :
          bowTieStatus === 'STRESSED' ? 'bg-yellow-900/50 text-yellow-300' :
          'bg-green-900/50 text-green-300'
        }`}>
          {bowTieStatus}
        </span>
      </div>

      {barriers.length === 0 ? (
        <div className="space-y-2">
          {['Gas Detection', 'Interlocks', 'Permits', 'Supervision', 'ESD', 'Ventilation', 'Physical', 'Training'].map((name, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 px-2 rounded bg-gray-800/30">
              <div className="flex items-center gap-2">
                <span>[OK]</span>
                <span className="text-xs text-gray-400">{name}</span>
              </div>
              <span className="text-xs text-gray-500 font-mono">1.00</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {barriers.map((barrier) => (
            <BarrierRow key={barrier.id} barrier={barrier} />
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between text-xs">
        <span className="text-gray-400">
          Degraded: <span className="text-orange-400 font-semibold">{degradedCount}/8</span>
        </span>
        <span className="text-gray-400">
          Holes: <span className="text-red-400 font-semibold">
            {barriers.filter(b => b.score < 0.3).length}
          </span>
        </span>
      </div>
    </div>
  );
}

function BarrierRow({ barrier }: { barrier: BarrierStatus }) {
  const barWidth = Math.max(0, Math.min(100, barrier.score * 100));
  
  return (
    <div className={`py-1.5 px-2 rounded transition-colors ${
      barrier.score < 0.3 ? 'bg-red-950/30' :
      barrier.score < 0.5 ? 'bg-orange-950/20' :
      'bg-gray-800/30'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{getBarrierIcon(barrier.status)}</span>
          <span className="text-xs text-gray-300 truncate max-w-[120px]">
            {barrier.name.replace('System', '').replace('& Competence', '').trim()}
          </span>
        </div>
        <span className={`text-xs font-mono ${
          barrier.score < 0.3 ? 'text-red-400' :
          barrier.score < 0.5 ? 'text-orange-400' :
          barrier.score < 0.7 ? 'text-yellow-400' :
          'text-green-400'
        }`}>
          {barrier.score.toFixed(2)}
        </span>
      </div>
      {/* Mini progress bar */}
      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            barrier.score < 0.3 ? 'bg-red-500' :
            barrier.score < 0.5 ? 'bg-orange-500' :
            barrier.score < 0.7 ? 'bg-yellow-500' :
            'bg-green-500'
          }`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      {barrier.reason && (
        <p className="text-[10px] text-gray-500 mt-0.5 truncate">{barrier.reason}</p>
      )}
    </div>
  );
}
