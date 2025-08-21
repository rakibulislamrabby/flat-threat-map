'use client';

import { useState, useEffect } from 'react';
import { SEVERITY_COLORS, getFamilyColor } from '@/lib/colors';

const THREAT_FAMILIES = [
  'botnet', 'rce', 'sql-injection', 'xss', 
  'malware', 'phishing', 'dos', 'brute-force'
];

const DEFAULT_FILTERS = {
  severities: ['low', 'medium', 'high'],
  families: THREAT_FAMILIES,
  timeWindow: 30 // seconds
};

export default function ThreatControls({ filters, onFiltersChange }) {
  const [localFilters, setLocalFilters] = useState(filters || DEFAULT_FILTERS);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange(localFilters);
    }, 300);

    return () => clearTimeout(timer);
  }, [localFilters, onFiltersChange]);

  const handleSeverityChange = (severity) => {
    setLocalFilters(prev => ({
      ...prev,
      severities: prev.severities.includes(severity)
        ? prev.severities.filter(s => s !== severity)
        : [...prev.severities, severity]
    }));
  };

  const handleFamilyChange = (family) => {
    setLocalFilters(prev => ({
      ...prev,
      families: prev.families.includes(family)
        ? prev.families.filter(f => f !== family)
        : [...prev.families, family]
    }));
  };

  const handleTimeWindowChange = (e) => {
    setLocalFilters(prev => ({
      ...prev,
      timeWindow: parseInt(e.target.value)
    }));
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
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Filters & Controls</h3>
      </div>

      {/* Severity Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h4 className="text-lg font-semibold text-white">Threat Severity</h4>
        </div>
        <div className="space-y-3">
          {['high', 'medium', 'low'].map(severity => (
            <label key={severity} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={localFilters.severities.includes(severity)}
                  onChange={() => handleSeverityChange(severity)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                  localFilters.severities.includes(severity)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500'
                    : 'border-slate-500 group-hover:border-blue-400'
                }`}>
                  {localFilters.severities.includes(severity) && (
                    <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getSeverityIcon(severity)}
                <span className={`text-sm font-medium capitalize ${
                  severity === 'high' ? 'text-red-300' :
                  severity === 'medium' ? 'text-yellow-300' :
                  'text-green-300'
                }`}>
                  {severity}
                </span>
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: SEVERITY_COLORS[severity] }}
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Family Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h4 className="text-lg font-semibold text-white">Threat Families</h4>
        </div>
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
          {THREAT_FAMILIES.map(family => (
            <label key={family} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={localFilters.families.includes(family)}
                  onChange={() => handleFamilyChange(family)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
                  localFilters.families.includes(family)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500'
                    : 'border-slate-500 group-hover:border-blue-400'
                }`}>
                  {localFilters.families.includes(family) && (
                    <svg className="w-2.5 h-2.5 text-white absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-slate-300 capitalize">
                  {family.replace('-', ' ')}
                </span>
                <div 
                  className="w-2.5 h-2.5 rounded-full ml-auto"
                  style={{ backgroundColor: getFamilyColor(family) }}
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Time Window */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-lg font-semibold text-white">Time Window</h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Show events from last:</span>
            <span className="font-mono font-bold text-white">{localFilters.timeWindow}s</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={localFilters.timeWindow}
              onChange={handleTimeWindowChange}
              className="slider w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>5s</span>
              <span>120s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h4 className="text-lg font-semibold text-white">Arc Colors</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {THREAT_FAMILIES.slice(0, 6).map(family => (
            <div key={family} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getFamilyColor(family) }}
              />
              <span className="text-slate-300 capitalize">
                {family.replace('-', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <h5 className="text-sm font-semibold text-slate-300 mb-2">Active Filters</h5>
        <div className="text-xs text-slate-400 space-y-1">
          <div>Severities: {localFilters.severities.length}/3</div>
          <div>Families: {localFilters.families.length}/8</div>
          <div>Window: {localFilters.timeWindow}s</div>
        </div>
      </div>
    </div>
  );
}
