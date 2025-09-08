'use client';

import { useState, useEffect } from 'react';
import ThreatMapDeckGL from '../components/ThreatMapDeckGL';
import ThreatControls from '../components/ThreatControls';
import { SAMPLE_EVENTS } from '../lib/events-static';

const DEFAULT_FILTERS = {
  severities: ['low', 'medium', 'high'],
  families: ['botnet', 'rce', 'sql-injection', 'xss', 'malware', 'phishing', 'dos', 'brute-force'],
  timeWindow: 30 // seconds
};

export default function Home() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [attackCount, setAttackCount] = useState(3840587);

  // Increment attack counter for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setAttackCount(prev => prev + Math.floor(Math.random() * 50) + 10);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}>
      {/* CheckPoint-Style Header */}
      <header className="text-center py-8 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%)' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            background: `
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-widest" style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
            LIVE CYBER THREAT MAP
          </h1>
          <div className="text-3xl font-bold tracking-widest mb-2" style={{ color: '#ff4444', textShadow: '0 0 15px rgba(255,68,68,0.5)' }}>
            {attackCount.toLocaleString()} ATTACKS ON THIS DAY
          </div>
          <div className="text-sm text-gray-300 tracking-wider">
            Real-time cyber attack visualization powered by WebGL
          </div>
        </div>
      </header>

      {/* Main Content - Full width map like CheckPoint */}
      <main className="w-full h-[calc(100vh-180px)]">
        <ThreatMapDeckGL filters={filters} events={SAMPLE_EVENTS} />
        
        {/* Hidden controls - can be toggled later */}
        <div className="hidden">
          <ThreatControls filters={filters} onFiltersChange={setFilters} />
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
