'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { fetchWorld110m, toCountries, makeProjection, createArcPath } from '../lib/geo';
import { simulateLoop } from '../lib/stream';
import Tooltip from './Tooltip';

export default function ThreatMap({ filters, events }) {
  console.log('🔍 ThreatMap received events:', events?.length, 'filters:', filters);
  
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const resizeObserverRef = useRef();
  const mountedRef = useRef(true);
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [projection, setProjection] = useState(() => {
    try {
      return d3.geoNaturalEarth1().scale(100).translate([400, 300]).center([0, 0]);
    } catch (error) {
      console.error('Error creating default projection:', error);
      return null;
    }
  });
  const [projectionReady, setProjectionReady] = useState(false);
  const [animatedArcs, setAnimatedArcs] = useState([]);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    event: null
  });
  const [fps, setFps] = useState(0);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  
  const lastFrameTime = useRef(0);
  const frameCount = useRef(0);
  const lastFpsUpdate = useRef(0);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const animationDuration = prefersReducedMotion ? 600 : 1500;
  const showTravelingDots = !prefersReducedMotion;

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Initialize map
  const initializeMap = useCallback(async () => {
    if (!mountedRef.current || !containerRef.current || !svgRef.current) return;
    
    const { width, height } = dimensions;
    if (width <= 0 || height <= 0) return;

    console.log('🗺️ Initializing map with dimensions:', width, 'x', height);

    try {
      const worldData = await fetchWorld110m();
      const countries = toCountries(worldData);
      
      console.log('🌍 World data loaded, countries:', countries.length);
      
      const newProjection = makeProjection(width, height);
      
      if (!newProjection) {
        console.error('Failed to create projection');
        return;
      }
      
      console.log('📍 Projection created successfully');
      
      if (!mountedRef.current) {
        console.error('Component unmounted during projection creation');
        return;
      }
      
      if (mountedRef.current) {
        setProjection(newProjection);
        setProjectionReady(true);
        console.log('✅ Projection set and ready');
      }

      const svg = d3.select(svgRef.current);
      if (svg.empty()) return;
      
      svg.selectAll('*').remove();

      const path = d3.geoPath().projection(newProjection);

      svg.selectAll('path')
        .data(countries)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#0f172a')
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 1);

      setIsMapInitialized(true);
      console.log('✅ Map initialized successfully');

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [dimensions]);

  // Handle new events
  const handleNewEvent = useCallback((event) => {
    if (!mountedRef.current || !projection || !projectionReady) return;

    // TEMPORARILY BYPASS FILTERS FOR DEBUGGING
    console.log('🎯 Processing event:', event.family, event.severity);
    
    // if (!filters.severities.includes(event.severity) ||
    //     !filters.families.includes(event.family)) {
    //   console.log('❌ Event filtered out:', event.family, event.severity);
    //   return;
    // }

    const now = Date.now();
    const cutoffTime = now - (filters.timeWindow * 1000);
    
    console.log('🎯 NEW ATTACK EVENT:', event.family, 'from', event.src.lat + ',' + event.src.lon, 'to', event.dst.lat + ',' + event.dst.lon);
    
    setAnimatedArcs(prev => {
      const filtered = prev.filter(arc => arc.startTime > cutoffTime);
      const newArcs = [...filtered, {
        event,
        startTime: now,
        progress: 0,
        alpha: 1
      }];
      console.log('📊 Total arcs now:', newArcs.length);
      return newArcs;
    });
  }, [projection, projectionReady, filters]);

  // Animation loop - FIXED VERSION
  const animate = useCallback((currentTime) => {
    if (!mountedRef.current) return;
    
    if (!canvasRef.current || !projection || !projectionReady) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    const now = Date.now();
    const cutoffTime = now - (filters.timeWindow * 1000);

    // Update arcs without triggering re-render
    const updated = animatedArcs
      .filter(arc => arc.startTime > cutoffTime)
      .map(arc => {
        const elapsed = now - arc.startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        const alpha = Math.max(0, 1 - progress);
        return { ...arc, progress, alpha };
      });

    // Update state once at the end
    if (updated.length !== animatedArcs.length) {
      setAnimatedArcs(updated);
    }

    // Draw arcs immediately
    if (updated.length > 0) {
      console.log('🎨 Drawing', updated.length, 'arcs at time', currentTime);
      
      // TEST: Draw a simple red dot to verify canvas is working
      ctx.fillStyle = 'red';
      ctx.fillRect(100, 100, 20, 20);
      console.log('🔴 Test red dot drawn at (100,100)');
    }
    updated.forEach(arc => {
      try {
        console.log('🎯 Drawing arc:', arc.event.family, 'progress:', arc.progress.toFixed(2));
        const path = createArcPath(projection, arc.event.src, arc.event.dst);
        if (!path) return;

        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path);
        
        const pathLength = pathElement.getTotalLength();
        if (pathLength === 0) return;

        // SIMPLE TEST: Draw a basic line first
        console.log('🎯 Drawing simple test line');
        ctx.strokeStyle = '#ff0000'; // Red for testing
        ctx.globalAlpha = 1;
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        // Draw a simple diagonal line
        ctx.moveTo(200, 200);
        ctx.lineTo(400, 400);
        ctx.stroke();
        console.log('🔴 Simple test line drawn');
        
        // Now try the complex arc
        ctx.strokeStyle = '#00ff88';
        ctx.globalAlpha = arc.alpha * 0.9;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        const currentPosition = arc.progress * pathLength;
        const trailLength = Math.min(currentPosition, pathLength * 0.7);
        const trailStart = Math.max(0, currentPosition - trailLength);
        
        for (let i = 0; i <= 150; i++) {
          const t = trailStart + (i / 150) * trailLength;
          if (t > currentPosition) break;
          
          try {
            const point = pathElement.getPointAtLength(t);
            if (point && isFinite(point.x) && isFinite(point.y)) {
              if (i === 0) {
                ctx.moveTo(point.x, point.y);
              } else {
                ctx.lineTo(point.x, point.y);
              }
            }
          } catch (error) {
            continue;
          }
        }
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Draw traveling dot
        if (showTravelingDots && arc.progress < 1) {
          try {
            const dotT = arc.progress * pathLength;
            const dotPoint = pathElement.getPointAtLength(dotT);
            
            if (dotPoint && isFinite(dotPoint.x) && isFinite(dotPoint.y)) {
              const dotSize = 12;
              
              ctx.shadowColor = '#00ff88';
              ctx.shadowBlur = 20;
              
              ctx.globalAlpha = arc.alpha;
              ctx.fillStyle = '#00ff88';
              ctx.beginPath();
              ctx.arc(dotPoint.x, dotPoint.y, dotSize, 0, 2 * Math.PI);
              ctx.fill();
              
              ctx.shadowBlur = 0;
              
              // Pulse effect
              const pulseSize = dotSize + Math.sin(Date.now() * 0.008) * 8;
              ctx.globalAlpha = arc.alpha * 0.5;
              ctx.beginPath();
              ctx.arc(dotPoint.x, dotPoint.y, pulseSize, 0, 2 * Math.PI);
              ctx.fill();
              ctx.globalAlpha = arc.alpha;
            }
          } catch (error) {
            // Skip invalid dot position
          }
        }
      } catch (error) {
        console.error('Error drawing arc:', error);
      }
    });
    
    // Draw source and destination markers
    updated.forEach(arc => {
      try {
        const srcPoint = projection([arc.event.src.lon, arc.event.src.lat]);
        if (srcPoint && isFinite(srcPoint[0]) && isFinite(srcPoint[1])) {
          ctx.globalAlpha = arc.alpha * 0.9;
          ctx.fillStyle = '#00ff88';
          ctx.beginPath();
          ctx.arc(srcPoint[0], srcPoint[1], 6, 0, 2 * Math.PI);
          ctx.fill();
        }
        
        const dstPoint = projection([arc.event.dst.lon, arc.event.dst.lat]);
        if (dstPoint && isFinite(dstPoint[0]) && isFinite(dstPoint[1])) {
          ctx.globalAlpha = arc.alpha * 0.9;
          ctx.fillStyle = '#00ff88';
          ctx.beginPath();
          ctx.arc(dstPoint[0], dstPoint[1], 5, 0, 2 * Math.PI);
          ctx.fill();
        }
      } catch (error) {
        // Skip marker drawing if there's an error
      }
    });

    // FPS calculation
    frameCount.current++;
    if (currentTime - lastFpsUpdate.current >= 1000) {
      setFps(Math.round((frameCount.current * 1000) / (currentTime - lastFpsUpdate.current)));
      frameCount.current = 0;
      lastFpsUpdate.current = currentTime;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [projection, projectionReady, dimensions, filters, animationDuration, showTravelingDots, animatedArcs]);

  // Handle mouse move for tooltips
  const handleMouseMove = useCallback((e) => {
    if (!mountedRef.current || !projection || !projectionReady || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let nearestArc = null;
    let minDistance = 10;

    animatedArcs.forEach((arc) => {
      try {
        const path = createArcPath(projection, arc.event.src, arc.event.dst);
        if (!path) return;

        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path);
        
        const pathLength = pathElement.getTotalLength();
        if (pathLength === 0) return;

        for (let i = 0; i <= 20; i++) {
          try {
            const t = (i / 20) * pathLength;
            const point = pathElement.getPointAtLength(t);
            
            if (point && isFinite(point.x) && isFinite(point.y)) {
              const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
              
              if (distance < minDistance) {
                minDistance = distance;
                nearestArc = arc;
              }
            }
          } catch (error) {
            continue;
          }
        }
      } catch (error) {
        console.error('Error checking arc distance:', error);
      }
    });

    setTooltip({
      visible: !!nearestArc,
      x: e.clientX,
      y: e.clientY,
      event: nearestArc ? nearestArc.event : null
    });
  }, [projection, projectionReady, animatedArcs]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (!mountedRef.current) return;
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  // Resize handler
  const handleResize = useCallback((entries) => {
    if (!mountedRef.current) return;
    
    const entry = entries[0];
    if (entry) {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setDimensions({ width, height });
      }
    }
  }, []);

  // Initialize dimensions and resize observer
  useEffect(() => {
    if (!mountedRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.max(rect.width || 800, 100);
    const height = Math.max(rect.height || 600, 100);
    setDimensions({ width, height });

    try {
      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(containerRef.current);
    } catch (error) {
      console.error('Error setting up resize observer:', error);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [handleResize]);

  // Initialize map when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setProjectionReady(false);
      setIsMapInitialized(false);
      initializeMap();
    }
  }, [dimensions, initializeMap]);

  // Start animation loop
  useEffect(() => {
    if (isMapInitialized && projectionReady) {
      console.log('🎬 Starting animation loop in 200ms...');
      const timer = setTimeout(() => {
        if (mountedRef.current && projection && projectionReady) {
          console.log('🎬 Animation loop started');
          animationRef.current = requestAnimationFrame(animate);
        }
      }, 200);
      
      return () => {
        clearTimeout(timer);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isMapInitialized, projectionReady, projection]);

  // Start event simulation
  useEffect(() => {
    if (!isMapInitialized || !projectionReady) return;
    
    console.log('🎯 Map ready, starting simulation immediately...');
    console.log('📊 Events data:', events);
    console.log('📊 Events length:', events?.length);
    
    // TEST: Draw something immediately to verify canvas works
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        console.log('🧪 Testing canvas immediately');
        ctx.fillStyle = 'yellow';
        ctx.fillRect(50, 50, 30, 30);
        console.log('🟡 Test yellow square drawn at (50,50)');
      }
    }
    
    if (mountedRef.current && projection && projectionReady) {
      console.log('🎯 Starting event simulation with', events?.length, 'events');
      const cleanup = simulateLoop(events, handleNewEvent, 200);
      return cleanup;
    }
  }, [events, handleNewEvent, isMapInitialized, projectionReady, projection]);

  return (
    <div className="relative w-full h-full bg-slate-950" ref={containerRef}>
      {/* Loading State */}
      {!isMapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50">
          <div className="text-white text-lg">Loading map...</div>
        </div>
      )}
      
      {/* Canvas for Arcs - MUST BE ON TOP */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute top-0 left-0 z-50"
        onMouseMove={isMapInitialized ? handleMouseMove : undefined}
        onMouseLeave={isMapInitialized ? handleMouseLeave : undefined}
        style={{ cursor: isMapInitialized ? 'crosshair' : 'default' }}
      />
      
      {/* SVG World Map - BEHIND Canvas */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute top-0 left-0 z-10"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 z-5 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-[#00ff88]/10 via-transparent to-[#00ff88]/10 animate-pulse"></div>
      </div>
      
      {/* Tooltip */}
      <Tooltip
        event={tooltip.event}
        x={tooltip.x}
        y={tooltip.y}
        visible={tooltip.visible}
      />
      
      {/* FPS Meter */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-white text-sm px-3 py-2 rounded-lg z-30 font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>{fps} FPS</span>
        </div>
      </div>
      
      {/* Live Attack Counter */}
      <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-white text-sm px-3 py-2 rounded-lg z-30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></div>
          <span className="text-[#00ff88] font-bold">LIVE ATTACKS: {animatedArcs.length}</span>
        </div>
      </div>
      
      {/* Live Attack Flow Indicator */}
      <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-white text-sm px-3 py-2 rounded-lg z-30">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#00ff88] rounded-full animate-ping"></div>
          <span className="text-[#00ff88] font-bold">ATTACK FLOW: ACTIVE</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {animatedArcs.length > 0 ? `${animatedArcs.length} attacks flowing` : 'No active attacks'}
        </div>
      </div>
      
      {/* Manual Test Button */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-white text-sm px-3 py-2 rounded-lg z-30">
        <button 
          onClick={() => {
            console.log('🧪 Manual test button clicked');
            if (events && events.length > 0) {
              console.log('📊 Events available:', events.length);
              const testEvent = events[0];
              console.log('🎯 Test event:', testEvent);
              handleNewEvent(testEvent);
            } else {
              console.log('❌ No events available');
            }
          }}
          className="bg-[#00ff88] text-black px-3 py-1 rounded text-xs font-bold hover:bg-[#00ff88]/80"
        >
          TEST ATTACK
        </button>
        
        {/* Debug Button - Create Test Arc */}
        <button 
          onClick={() => {
            console.log('🐛 Debug: Creating test arc manually');
            const testArc = {
              event: {
                family: 'test',
                severity: 'high',
                src: { lat: 40.7128, lon: -74.0060 }, // New York
                dst: { lat: 51.5074, lon: -0.1278 },  // London
                ts: Date.now()
              },
              startTime: Date.now(),
              progress: 0,
              alpha: 1
            };
            console.log('🐛 Test arc created:', testArc);
            setAnimatedArcs(prev => [...prev, testArc]);
          }}
          className="ml-2 bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600"
        >
          DEBUG ARC
        </button>
        
        {/* Canvas Debug Info */}
        <div className="mt-2 text-xs text-white">
          Canvas: {dimensions.width} x {dimensions.height}
        </div>
      </div>
    </div>
  );
}
