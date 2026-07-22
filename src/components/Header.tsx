import type { AlertLevel } from '../types';
import { getAlertIcon } from '../utils/colors';

interface HeaderProps {
  connected: boolean;
  riskLevel: AlertLevel;
}

export function Header({ connected, riskLevel }: HeaderProps) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const isNight = now.getHours() >= 18 || now.getHours() < 6;

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">[!]</span>
        <h1 className="text-xl font-bold tracking-tight">
          Safety<span className="text-blue-400">IQ</span>
        </h1>
        <span className="text-gray-500 text-sm hidden sm:inline">|</span>
        <span className="text-gray-400 text-sm hidden sm:inline">
          AI-Powered Industrial Safety Intelligence
        </span>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="hidden md:flex items-center gap-2 text-gray-400">
          <span>Plant:</span>
          <span className="text-gray-200 font-medium">VSP Integrated Steel</span>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-gray-400">
          <span>Shift:</span>
          <span className="text-gray-200 font-medium">{isNight ? 'Night' : 'Day'} A</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400">Status:</span>
          <span>{getAlertIcon(riskLevel)}</span>
          <span className={`font-semibold ${
            riskLevel === 'CRITICAL' ? 'text-red-400' :
            riskLevel === 'RED' ? 'text-red-400' :
            riskLevel === 'ORANGE' ? 'text-orange-400' :
            riskLevel === 'YELLOW' ? 'text-yellow-400' :
            'text-green-400'
          }`}>{riskLevel}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} ${connected ? '' : 'animate-pulse'}`} />
          <span className="text-gray-400">{timeStr}</span>
        </div>
      </div>
    </header>
  );
}
