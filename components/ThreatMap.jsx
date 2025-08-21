'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { SEVERITY_COLORS, getFamilyColor } from '@/lib/colors';
import { fetchWorld110m, toCountries, makeProjection, createArcPath } from '@/lib/geo';
import { simulateLoop } from '@/lib/stream';
import Tooltip from './Tooltip';

export default function ThreatMap({ filters, events }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const resizeObserverRef = useRef();
  const mountedRef = useRef(true);
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [projection, setProjection] = useState(() => {
    // Create a default projection that won't cause errors
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

  const animationDuration = prefersReducedMotion ? 600 : 1200; // ms
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

    try {
      const worldData = await fetchWorld110m();
      const countries = toCountries(worldData);
      
      const newProjection = makeProjection(width, height);
      
      if (!newProjection) {
        console.error('Failed to create projection');
        return;
      }
      
      if (!mountedRef.current) {
        console.error('Component unmounted during projection creation');
        return;
      }
      
      // Only set projection if component is still mounted
      if (mountedRef.current) {
        setProjection(newProjection);
        setProjectionReady(true);
      }

      // Clear existing content
      const svg = d3.select(svgRef.current);
      if (svg.empty()) return;
      
      svg.selectAll('*').remove();

      // Create path generator
      const path = d3.geoPath().projection(newProjection);

      // Draw countries
      svg.selectAll('path')
        .data(countries)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#f8fafc') // Light gray for land
        .attr('stroke', '#e2e8f0') // Border color
        .attr('stroke-width', 0.5);

      setIsMapInitialized(true);

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [dimensions]);

  // Handle new events
  const handleNewEvent = useCallback((event) => {
    if (!mountedRef.current || !projection || !projectionReady) return;

    // Check if event passes filters
    if (!filters.severities.includes(event.severity) ||
        !filters.families.includes(event.family)) {
      return;
    }

    const now = Date.now();
    const cutoffTime = now - (filters.timeWindow * 1000);
    
    setAnimatedArcs(prev => {
      const filtered = prev.filter(arc => arc.startTime > cutoffTime);
      return [...filtered, {
        event,
        startTime: now,
        progress: 0,
        alpha: 1
      }];
    });
  }, [projection, projectionReady, filters]);

  // Animation loop
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

    // Update and draw arcs
    setAnimatedArcs(prev => {
      const updated = prev
        .filter(arc => arc.startTime > cutoffTime)
        .map(arc => {
          const elapsed = now - arc.startTime;
          const progress = Math.min(elapsed / animationDuration, 1);
          const alpha = Math.max(0, 1 - progress);
          
          return { ...arc, progress, alpha };
        });

      // Draw arcs in next frame to avoid state update issues
      requestAnimationFrame(() => {
        if (!mountedRef.current || !ctx || !projection || !projectionReady) return;
        
        updated.forEach(arc => {
          try {
            const path = createArcPath(projection, arc.event.src, arc.event.dst);
            if (!path) return;

            const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathElement.setAttribute('d', path);
            
            const pathLength = pathElement.getTotalLength();
            if (pathLength === 0) return;

            // Draw arc trail
            ctx.strokeStyle = getFamilyColor(arc.event.family);
            ctx.globalAlpha = arc.alpha * 0.3;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const trailLength = Math.min(arc.progress * pathLength, pathLength * 0.3);
            const trailStart = Math.max(0, arc.progress * pathLength - trailLength);
            
            for (let i = 0; i <= 50; i++) {
              const t = trailStart + (i / 50) * trailLength;
              if (t > arc.progress * pathLength) break;
              
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

            // Draw traveling dot
            if (showTravelingDots && arc.progress < 1) {
              try {
                const dotT = arc.progress * pathLength;
                const dotPoint = pathElement.getPointAtLength(dotT);
                
                if (dotPoint && isFinite(dotPoint.x) && isFinite(dotPoint.y)) {
                  ctx.globalAlpha = arc.alpha;
                  ctx.fillStyle = SEVERITY_COLORS[arc.event.severity];
                  ctx.beginPath();
                  ctx.arc(dotPoint.x, dotPoint.y, 3, 0, 2 * Math.PI);
                  ctx.fill();
                }
              } catch (error) {
                // Skip invalid dot position
              }
            }
          } catch (error) {
            console.error('Error drawing arc:', error);
          }
        });
      });

      return updated;
    });

    // FPS calculation
    frameCount.current++;
    if (currentTime - lastFpsUpdate.current >= 1000) {
      setFps(Math.round((frameCount.current * 1000) / (currentTime - lastFpsUpdate.current)));
      frameCount.current = 0;
      lastFpsUpdate.current = currentTime;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [projection, projectionReady, dimensions, filters, animationDuration, showTravelingDots]);

  // Handle mouse move for tooltips
  const handleMouseMove = useCallback((e) => {
    if (!mountedRef.current || !projection || !projectionReady || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find nearest arc within 10px
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

        // Check distance to arc path
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

    // Set initial dimensions with fallback values
    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.max(rect.width || 800, 100);
    const height = Math.max(rect.height || 600, 100);
    setDimensions({ width, height });

    // Setup resize observer
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
      // Add a small delay to ensure projection is fully ready
      const timer = setTimeout(() => {
        if (mountedRef.current && projection && projectionReady) {
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
    
    // Add a small delay to ensure everything is ready
    const timer = setTimeout(() => {
      if (mountedRef.current && projection && projectionReady) {
        const cleanup = simulateLoop(events, handleNewEvent, 2000);
        return cleanup;
      }
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [events, handleNewEvent, isMapInitialized, projectionReady, projection]);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {/* Loading State */}
      {!isMapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50">
          <div className="text-white text-lg">Loading map...</div>
        </div>
      )}
      
      {/* SVG World Map */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute top-0 left-0 z-10"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Canvas for Arcs */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute top-0 left-0 z-20"
        onMouseMove={isMapInitialized ? handleMouseMove : undefined}
        onMouseLeave={isMapInitialized ? handleMouseLeave : undefined}
        style={{ cursor: isMapInitialized ? 'crosshair' : 'default' }}
      />
      
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
    </div>
  );
}
