import type { AlertEntry } from '../types';
import { getAlertIcon } from '../utils/colors';

interface AlertTimelineProps {
  alerts: AlertEntry[];
}

export function AlertTimeline({ alerts }: AlertTimelineProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 h-[calc(100vh-120px)] flex flex-col">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-300">
          Alert Timeline
        </h2>
        <span className="text-xs text-gray-500">{alerts.length} events</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p className="text-3xl mb-2">[*]</p>
            <p className="text-sm">Waiting for events...</p>
            <p className="text-xs mt-1">Start the simulator to see alerts</p>
          </div>
        ) : (
          alerts.map((alert, idx) => (
            <AlertCard key={alert.id || idx} alert={alert} isLatest={idx === 0} />
          ))
        )}
      </div>
    </div>
  );
}

function AlertCard({ alert, isLatest }: { alert: AlertEntry; isLatest: boolean }) {
  const time = new Date(alert.timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className={`p-3 rounded-lg border transition-all duration-300 ${
      isLatest ? 'border-gray-600 bg-gray-800/80' : 'border-gray-800 bg-gray-900/50'
    } ${
      alert.alert_level === 'CRITICAL' ? 'border-red-800 bg-red-950/30' :
      alert.alert_level === 'RED' ? 'border-red-900 bg-red-950/20' :
      ''
    }`}>
      <div className="flex items-start gap-2">
        <span className="text-sm mt-0.5">{getAlertIcon(alert.alert_level)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-gray-300 truncate">
              {alert.title}
            </span>
            <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {alert.description}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {alert.zone_id && (
              <span className="text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">
                Zone {alert.zone_id}
              </span>
            )}
            {alert.score > 0 && (
              <span className={`text-xs font-mono ${
                alert.score >= 0.8 ? 'text-red-400' :
                alert.score >= 0.6 ? 'text-orange-400' :
                'text-yellow-400'
              }`}>
                {alert.score.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
