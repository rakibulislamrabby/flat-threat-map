'use client';

import { useState, useEffect } from 'react';
import type { FilterState, Severity, ThreatFamily } from '@/lib/types';
import { SEVERITY_COLORS } from '@/lib/colors';

interface ThreatControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const THREAT_FAMILIES: ThreatFamily[] = [
  'botnet', 'rce', 'sql-injection', 'scan', 'waf-bypass', 'ddos', 'phishing', 'malware'
];

const SEVERITIES: Severity[] = ['high', 'medium', 'low'];

export default function ThreatControls({ filters, onFiltersChange }: ThreatControlsProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSeverityChange = (severity: Severity, checked: boolean) => {
    const newSeverities = checked
      ? [...localFilters.severities, severity]
      : localFilters.severities.filter(s => s !== severity);
    
    const newFilters = { ...localFilters, severities: newSeverities };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFamilyChange = (family: ThreatFamily, checked: boolean) => {
    const newFamilies = checked
      ? [...localFilters.families, family]
      : localFilters.families.filter(f => f !== family);
    
    const newFilters = { ...localFilters, families: newFamilies };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTimeWindowChange = (value: number) => {
    const newFilters = { ...localFilters, timeWindow: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
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
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Threat Severity
        </h4>
        <div className="space-y-3">
          {SEVERITIES.map(severity => (
            <label key={severity} className="flex items-center group cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={localFilters.severities.includes(severity)}
                  onChange={(e) => handleSeverityChange(severity, e.target.checked)}
                  className="sr-only"
                  aria-label={`Filter by ${severity} severity threats`}
                />
                <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                  localFilters.severities.includes(severity)
                    ? 'border-white bg-white'
                    : 'border-slate-400 group-hover:border-slate-300'
                }`}>
                  {localFilters.severities.includes(severity) && (
                    <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex items-center ml-3 flex-1">
                <div
                  className="w-3 h-3 rounded-full mr-3 shadow-lg"
                  style={{ backgroundColor: SEVERITY_COLORS[severity] }}
                />
                <span className="text-white font-medium capitalize group-hover:text-slate-200 transition-colors">
                  {severity}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Family Filter */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Threat Families
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {THREAT_FAMILIES.map(family => (
            <label key={family} className="flex items-center group cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={localFilters.families.includes(family)}
                  onChange={(e) => handleFamilyChange(family, e.target.checked)}
                  className="sr-only"
                  aria-label={`Filter by ${family} threats`}
                />
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                  localFilters.families.includes(family)
                    ? 'border-white bg-white'
                    : 'border-slate-400 group-hover:border-slate-300'
                }`}>
                  {localFilters.families.includes(family) && (
                    <svg className="w-2.5 h-2.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-slate-300 text-sm ml-3 capitalize group-hover:text-white transition-colors">
                {family.replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Time Window Slider */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Time Window
          </h4>
          <span className="text-white font-bold text-lg">{localFilters.timeWindow}s</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="10"
            max="300"
            step="10"
            value={localFilters.timeWindow}
            onChange={(e) => handleTimeWindowChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            aria-label="Adjust time window for threat display"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>10s</span>
            <span>300s</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-white/10 pt-6">
        <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Legend
        </h4>
        <div className="space-y-2">
          {SEVERITIES.map(severity => (
            <div key={severity} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-3 shadow-lg"
                style={{ backgroundColor: SEVERITY_COLORS[severity] }}
              />
              <span className="text-slate-300 text-sm capitalize">{severity} severity</span>
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
