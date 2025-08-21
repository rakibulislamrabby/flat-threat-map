'use client';

import { useState } from 'react';
import type { FilterState, Severity, ThreatFamily } from '@/lib/types';
import { SAMPLE_EVENTS } from '@/lib/events-static';
import ThreatMap from '@/components/ThreatMap';
import ThreatControls from '@/components/ThreatControls';

const DEFAULT_FILTERS: FilterState = {
  severities: ['high', 'medium', 'low'],
  families: ['botnet', 'rce', 'sql-injection', 'scan', 'waf-bypass', 'ddos', 'phishing', 'malware'],
  timeWindow: 60 // 60 seconds
};

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
                Threat Map
              </h1>
              <p className="text-slate-300 mt-2 text-lg">
                Real-time threat visualization with animated arcs
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-white text-sm font-medium">Live Events</div>
                <div className="text-slate-300 text-xs">{SAMPLE_EVENTS.length} samples</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-white text-sm font-medium">Status</div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 h-[calc(100vh-240px)]">
          {/* Controls Panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <ThreatControls
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </div>

          {/* Map Container */}
          <div className="xl:col-span-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden h-full">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-semibold text-lg">Global Threat Activity</h2>
                  <div className="flex items-center gap-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>High</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Low</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[calc(100%-80px)]">
                <ThreatMap
                  filters={filters}
                  events={SAMPLE_EVENTS}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Events</p>
                <p className="text-white text-2xl font-bold">{SAMPLE_EVENTS.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Threats</p>
                <p className="text-white text-2xl font-bold">24/7</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Update Interval</p>
                <p className="text-white text-2xl font-bold">2s</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <p className="text-slate-300 text-sm">
              <span className="font-medium text-white">Interactive Features:</span> Hover over arcs for detailed threat information • 
              Use filters to focus on specific threat types • 
              Adjust time window to control event visibility
            </p>
            <p className="text-slate-400 text-xs mt-2">
              Toggle <code className="bg-white/10 px-2 py-1 rounded text-white">USE_STATIC</code> in <code className="bg-white/10 px-2 py-1 rounded text-white">lib/stream.ts</code> to switch to WebSocket mode
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
