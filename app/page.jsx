'use client';

import { useState } from 'react';
import ThreatMap from '../components/ThreatMap';
import ThreatControls from '../components/ThreatControls';
import { SAMPLE_EVENTS } from '../lib/events-static';

const DEFAULT_FILTERS = {
  severities: ['low', 'medium', 'high'],
  families: ['botnet', 'rce', 'sql-injection', 'xss', 'malware', 'phishing', 'dos', 'brute-force'],
  timeWindow: 30 // seconds
};

export default function Home() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  return (
        <div className="h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <svg className="w-8 h-8 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Threat Map
              </h1>
              <p className="text-slate-300 mt-2 text-lg">
                Real-time threat visualization with animated arcs
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#00ff88]/20 rounded-lg border border-[#00ff88]/30">
                <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></div>
                <span className="text-[#00ff88] text-sm font-medium">Live Events</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#00ff88]/10 rounded-lg border border-[#00ff88]/20">
                <div className="w-2 h-2 bg-[#00ff88] rounded-full"></div>
                <span className="text-[#00ff88] text-sm font-medium">Status: Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 h-[calc(100vh-240px)]">
          {/* Controls Panel (sticky) */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <ThreatControls filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Map Container (glass morphism) */}
          <div className="xl:col-span-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden h-full">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-semibold text-lg">Global Threat Activity</h2>
                  <div className="flex items-center gap-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#00ff88] rounded-full"></div>
                      <span>All Threats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#00ff88]/70 rounded-full"></div>
                      <span>Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#00ff88]/40 rounded-full"></div>
                      <span>Monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[calc(100%-80px)]">
                <ThreatMap filters={filters} events={SAMPLE_EVENTS} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Info */}
        {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Active Threats</h3>
                <p className="text-slate-400 text-sm">Currently monitoring</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">2,847</div>
            <div className="text-green-400 text-sm">+12% from last hour</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Events/Min</h3>
                <p className="text-slate-400 text-sm">Real-time rate</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">156</div>
            <div className="text-blue-400 text-sm">Peak: 203 events/min</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Coverage</h3>
                <p className="text-slate-400 text-sm">Global regions</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">98.7%</div>
            <div className="text-emerald-400 text-sm">247 countries monitored</div>
          </div>
        </div> */}

        {/* Footer Info */}
        {/* <div className="mt-8 text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <p className="text-slate-300 text-sm">
              <span className="font-medium text-white">Interactive Features:</span> Hover over arcs for detailed threat information •
              Use filters to focus on specific threat types •
              Adjust time window to control event visibility
            </p>
            <p className="text-slate-400 text-xs mt-2">
              Toggle <code className="bg-white/10 px-2 py-1 rounded text-white">USE_STATIC</code> in <code className="bg-white/10 px-2 py-1 rounded text-white">lib/stream.js</code> to switch to WebSocket mode
            </p>
          </div>
        </div> */}
      </main>
    </div>
  );
}
