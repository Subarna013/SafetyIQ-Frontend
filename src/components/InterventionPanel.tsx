import type { InterventionData } from '../types';

interface InterventionPanelProps {
  intervention: InterventionData;
}

export function InterventionPanel({ intervention }: InterventionPanelProps) {
  return (
    <div className="rounded-xl border-2 border-red-700 bg-red-950/40 p-5 risk-pulse">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">[!!!]</span>
        <h2 className="text-lg font-bold text-red-200 uppercase tracking-wider">
          Immediate Actions Required
        </h2>
      </div>

      {/* Actions */}
      <div className="space-y-3 mb-5">
        {intervention.actions.map((action, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg border border-red-800/50"
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-red-800 flex items-center justify-center text-sm font-bold text-red-200">
              {action.priority}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-100">
                {action.description}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-red-300">
                  {action.type === 'revoke_permit' ? '[P] Permit' :
                   action.type === 'alert_workers' ? '[W] Personnel' :
                   action.type === 'isolate_equipment' ? '[E] Equipment' :
                   action.type === 'escalate' ? '[!] Escalation' : '[A] Action'}
                </span>
                {action.zone_id && (
                  <span className="text-xs px-1.5 py-0.5 bg-red-800/50 rounded text-red-300">
                    Zone {action.zone_id}
                  </span>
                )}
                <span className="text-xs text-red-400 font-medium uppercase">
                  {action.urgency}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Regulatory Citations */}
      {intervention.citations.length > 0 && (
        <div className="border-t border-red-800/50 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <span>[R]</span>
            <h3 className="text-sm font-semibold text-red-200">Regulatory Basis</h3>
          </div>
          <div className="space-y-2">
            {intervention.citations.map((citation, idx) => (
              <div key={idx} className="text-xs p-2 bg-red-900/20 rounded border border-red-800/30">
                <p className="font-semibold text-red-200">
                  {citation.standard} Sec {citation.section}
                </p>
                <p className="text-red-300 mt-0.5">{citation.text}</p>
                <p className="text-red-400 mt-0.5 italic">{citation.relevance}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
