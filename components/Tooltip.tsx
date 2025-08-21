'use client';

import type { Event } from '@/lib/types';

interface TooltipProps {
  event: Event | null;
  x: number;
  y: number;
  visible: boolean;
}

export default function Tooltip({ event, x, y, visible }: TooltipProps) {
  if (!visible || !event) {
    return null;
  }

  const formatLocation = (pt: { lon: number; lat: number }) => {
    const latDir = pt.lat >= 0 ? 'N' : 'S';
    const lonDir = pt.lon >= 0 ? 'E' : 'W';
    return `${Math.abs(pt.lat).toFixed(1)}°${latDir}, ${Math.abs(pt.lon).toFixed(1)}°${lonDir}`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return (
          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="absolute z-50 px-4 py-3 text-sm bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl pointer-events-none max-w-sm"
      style={{
        left: x + 12,
        top: y - 12,
        transform: 'translateY(-100%)',
      }}
    >
      {/* Arrow */}
      <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900/95"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
          <h3 className="font-bold text-white text-base">
            {event.family.replace('-', ' ').toUpperCase()}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {getSeverityIcon(event.severity)}
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            event.severity === 'high' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
            event.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
            'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}>
            {event.severity}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-slate-400 text-xs font-medium mb-1">SOURCE</div>
            <div className="text-white font-mono text-sm">{formatLocation(event.src)}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-slate-400 text-xs font-medium mb-1">DESTINATION</div>
            <div className="text-white font-mono text-sm">{formatLocation(event.dst)}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-slate-400 text-xs font-medium mb-1">TIMESTAMP</div>
            <div className="text-white font-mono text-sm">{formatTime(event.ts)}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Threat ID</span>
          <span className="text-slate-300 font-mono">#{Math.abs(event.ts % 10000).toString().padStart(4, '0')}</span>
        </div>
      </div>
    </div>
  );
}
