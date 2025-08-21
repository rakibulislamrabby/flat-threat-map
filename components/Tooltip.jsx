'use client';

export default function Tooltip({ event, x, y, visible }) {
  if (!visible || !event) {
    return null;
  }

  const formatLocation = (pt) => {
    return `${pt.lat.toFixed(2)}°${pt.lat >= 0 ? 'N' : 'S'}, ${Math.abs(pt.lon).toFixed(2)}°${pt.lon >= 0 ? 'E' : 'W'}`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return (
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
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
        {/* Source */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-blue-300 font-medium text-xs">Source</span>
          </div>
          <p className="text-slate-300 text-xs font-mono ml-6">
            {formatLocation(event.src)}
          </p>
        </div>
        
        {/* Destination */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-purple-300 font-medium text-xs">Destination</span>
          </div>
          <p className="text-slate-300 text-xs font-mono ml-6">
            {formatLocation(event.dst)}
          </p>
        </div>
        
        {/* Timestamp */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-300 font-medium text-xs">Detected</span>
          </div>
          <p className="text-slate-300 text-xs font-mono ml-6">
            {formatTime(event.ts)}
          </p>
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
