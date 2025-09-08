'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer, ScatterplotLayer, GeoJsonLayer, TextLayer } from '@deck.gl/layers';
import { simulateLoop, USE_STATIC } from '../lib/stream';
import Tooltip from './Tooltip';
import DottedWorldMap from './DottedWorldMap';

// Constants
const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 1.3,
  pitch: 0,
  bearing: 0
};

// Constants for animation and colors - Accurate country coordinates
const COUNTRY_NAMES = {
  'United States': { lat: 39.8283, lon: -98.5795 },
  'United Kingdom': { lat: 55.3781, lon: -3.4360 },
  'China': { lat: 35.8617, lon: 104.1954 },
  'Russia': { lat: 61.5240, lon: 105.3188 },
  'Germany': { lat: 51.1657, lon: 10.4515 },
  'Japan': { lat: 36.2048, lon: 138.2529 },
  'France': { lat: 46.6034, lon: 1.8883 },
  'Brazil': { lat: -14.2350, lon: -51.9253 },
  'India': { lat: 20.5937, lon: 78.9629 },
  'Australia': { lat: -25.2744, lon: 133.7751 },
  'Canada': { lat: 56.1304, lon: -106.3468 },
  'Mexico': { lat: 23.6345, lon: -102.5528 },
  'Italy': { lat: 41.8719, lon: 12.5674 },
  'Spain': { lat: 40.4637, lon: -3.7492 },
  'South Korea': { lat: 35.9078, lon: 127.7669 },
  'Turkey': { lat: 38.9637, lon: 35.2433 },
  'Iran': { lat: 32.4279, lon: 53.6880 },
  'Ukraine': { lat: 48.3794, lon: 31.1656 },
  'Poland': { lat: 51.9194, lon: 19.1451 },
  'Netherlands': { lat: 52.1326, lon: 5.2913 }
};

export default function ThreatMapDeckGL({ filters, events }) {
  console.log('🔍 ThreatMapDeckGL received events:', events?.length, 'filters:', filters);
  
  const mountedRef = useRef(true);
  const cleanupFunctionRef = useRef(null);
  
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [animatedArcs, setAnimatedArcs] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [activeLabels, setActiveLabels] = useState(new Set());
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    event: null
  });

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
      }
    };
  }, []);

  // Handle container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (mountedRef.current) {
        const container = document.querySelector('.threat-map-container');
        if (container) {
          const rect = container.getBoundingClientRect();
          setDimensions({ width: rect.width, height: rect.height });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle new threat events
  const handleNewEvent = useCallback((event) => {
    if (!mountedRef.current) return;
    
    console.log('🎯 NEW ATTACK EVENT:', event.family, 'from', event.src.lat + ',' + event.src.lon, 'to', event.dst.lat + ',' + event.dst.lon);
    
    const now = Date.now();
    const cutoffTime = now - (filters.timeWindow * 1000);
    
    setAnimatedArcs(prev => {
      const filtered = prev.filter(arc => arc.startTime > cutoffTime);
      const newArcs = [...filtered, {
        event,
        startTime: now,
        progress: 0,
        alpha: 1,
        id: `${event.src.lat}-${event.src.lon}-${event.dst.lat}-${event.dst.lon}-${now}`
      }];
      console.log('📊 Total arcs now:', newArcs.length);
      return newArcs;
    });
  }, [filters.timeWindow]);

  // Initialize event stream
  useEffect(() => {
    if (!events || events.length === 0) {
      console.warn('No events provided for ThreatMapDeckGL');
      return;
    }

    console.log('🚀 Starting event stream with', events.length, 'events');
    
    if (USE_STATIC) {
      console.log('📡 Starting static simulation loop');
      cleanupFunctionRef.current = simulateLoop(events, handleNewEvent, 100); // Very fast like CheckPoint
    } else {
      console.log('🔌 Would connect to WebSocket here');
      // Future: WebSocket implementation
    }

    return () => {
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
        cleanupFunctionRef.current = null;
      }
    };
  }, [events, handleNewEvent]);

  // Animation loop for arc progression
  useEffect(() => {
    const animationInterval = setInterval(() => {
      if (!mountedRef.current) return;
      
      const now = Date.now();
      const cutoffTime = now - (filters.timeWindow * 1000);
      
      setAnimatedArcs(prev => {
        return prev
          .filter(arc => arc.startTime > cutoffTime)
          .map(arc => {
            const age = now - arc.startTime;
            const progress = Math.min(age / 2000, 1); // 2 second animation
            const alpha = Math.max(1 - age / (filters.timeWindow * 1000), 0.1);
            
            // Smooth animated arcs between fixed country points
            const smoothProgress = progress * progress * (3.0 - 2.0 * progress);
            
            return {
              ...arc,
              progress: smoothProgress,
              alpha: Math.max(alpha, 0.3)
            };
          });
      });
    }, 50); // 20 FPS update rate

    return () => clearInterval(animationInterval);
  }, [filters.timeWindow]);

  // Convert events to deck.gl arc data with dash animation
  const arcData = animatedArcs.map(arc => {
    const now = Date.now();
    const age = now - arc.startTime;
    const dashOffset = (age / 50) % 20; // Moving dash effect
    
    return {
      id: arc.id,
      sourcePosition: [arc.event.src.lon, arc.event.src.lat],
      targetPosition: [arc.event.dst.lon, arc.event.dst.lat],
      color: getSeverityColor(arc.event.severity),
      alpha: arc.alpha,
      progress: arc.progress,
      dashOffset: dashOffset,
      event: arc.event
    };
  });

  // Convert events to simple markers - minimalist style
  const markerData = animatedArcs.flatMap(arc => [
    {
      position: [arc.event.src.lon, arc.event.src.lat],
      color: [...getSeverityColor(arc.event.severity), arc.alpha * 180],
      type: 'source',
      event: arc.event
    },
    {
      position: [arc.event.dst.lon, arc.event.dst.lat],
      color: [...getSeverityColor(arc.event.severity), arc.alpha * 180],
      type: 'destination',
      event: arc.event
    }
  ]);

  // Get country labels for active attacks
  const labelData = [];
  const recentArcs = animatedArcs.filter(arc => arc.alpha > 0.7); // Only show labels for recent attacks
  
  recentArcs.forEach(arc => {
    const srcCountry = getNearestCountry(arc.event.src.lat, arc.event.src.lon);
    const dstCountry = getNearestCountry(arc.event.dst.lat, arc.event.dst.lon);
    
    if (srcCountry) {
      labelData.push({
        position: [arc.event.src.lon, arc.event.src.lat + 5], // Offset slightly above
        text: srcCountry,
        color: [255, 255, 255, arc.alpha * 255],
        size: 14
      });
    }
    
    if (dstCountry) {
      labelData.push({
        position: [arc.event.dst.lon, arc.event.dst.lat + 5], // Offset slightly above
        text: dstCountry,
        color: [255, 255, 255, arc.alpha * 255],
        size: 14
      });
    }
  });

  // Create traveling dots on arcs for tech effect
  const travelingDots = animatedArcs
    .filter(arc => arc.progress < 1 && arc.alpha > 0.3)
    .map(arc => {
      // Calculate position along the curved arc
      const srcLon = arc.event.src.lon;
      const srcLat = arc.event.src.lat;
      const dstLon = arc.event.dst.lon;
      const dstLat = arc.event.dst.lat;
      
      // Create curved path interpolation
      const midLon = (srcLon + dstLon) / 2;
      const midLat = (srcLat + dstLat) / 2;
      
      // Add arc height for curved path
      const distance = Math.sqrt(Math.pow(dstLon - srcLon, 2) + Math.pow(dstLat - srcLat, 2));
      const arcHeight = Math.min(distance / 120, 1.5);
      
      // Calculate curved position
      const t = arc.progress;
      const dotLon = (1-t)*(1-t)*srcLon + 2*(1-t)*t*midLon + t*t*dstLon;
      const dotLat = (1-t)*(1-t)*srcLat + 2*(1-t)*t*(midLat + arcHeight) + t*t*dstLat;
      
      return {
        position: [dotLon, dotLat],
        color: [...getSeverityColor(arc.event.severity), 255],
        radius: 4,
        event: arc.event
      };
    });

  // Tech-style curved arc data
  const techArcData = arcData.map(arc => ({
    ...arc,
    // Higher curvature for tech/circular appearance
    curvature: Math.min(
      Math.sqrt(
        Math.pow(arc.targetPosition[0] - arc.sourcePosition[0], 2) + 
        Math.pow(arc.targetPosition[1] - arc.sourcePosition[1], 2)
      ) / 60, // More pronounced curvature
      3 // Higher max height for tech look
    )
  }));

  // Layers
  const layers = [
    // Tech-style Curved Arcs
    new ArcLayer({
      id: 'tech-threat-arcs',
      data: techArcData,
      getSourcePosition: d => d.sourcePosition,
      getTargetPosition: d => d.targetPosition,
      getSourceColor: d => [...d.color, Math.min(d.alpha * 200, 200)],
      getTargetColor: d => [...d.color, Math.min(d.alpha * 150, 150)],
      getWidth: 2, // Slightly thicker for tech look
      getHeight: d => d.curvature,
      pickable: true,
      billboard: false,
      widthUnits: 'pixels',
      onHover: (info, event) => {
        if (info.object) {
          setTooltip({
            visible: true,
            x: event.offsetX,
            y: event.offsetY,
            event: info.object.event
          });
        } else {
          setTooltip(prev => ({ ...prev, visible: false }));
        }
      }
    }),
    
    // Animated Traveling Dots
    new ScatterplotLayer({
      id: 'traveling-dots',
      data: travelingDots,
      getPosition: d => d.position,
      getColor: d => d.color,
      getRadius: d => d.radius,
      radiusUnits: 'pixels',
      pickable: false
    }),
    
    // Simple source/destination markers
    new ScatterplotLayer({
      id: 'country-markers',
      data: markerData,
      getPosition: d => d.position,
      getColor: d => d.color,
      getRadius: d => 3, // Fixed small size for minimalist look
      radiusUnits: 'pixels',
      pickable: true,
      onHover: (info, event) => {
        if (info.object) {
          setTooltip({
            visible: true,
            x: event.offsetX,
            y: event.offsetY,
            event: info.object.event
          });
        } else {
          setTooltip(prev => ({ ...prev, visible: false }));
        }
      }
    }),
    
    // Country Labels Layer
    new TextLayer({
      id: 'country-labels',
      data: labelData,
      getPosition: d => d.position,
      getText: d => d.text,
      getColor: d => d.color,
      getSize: d => d.size,
      getAngle: 0,
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'center',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      pickable: false
    })
  ];

  return (
    <div className="threat-map-container relative w-full h-full">
      {/* Darker background to make world map more visible */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a0a1a 0%, #111122 50%, #060608 100%)',
          zIndex: 0
        }}
      />
      
      {/* Dotted World Map */}
      <DottedWorldMap width={dimensions.width} height={dimensions.height} />
      
      {/* Deck.gl for arcs */}
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        style={{ position: 'relative', zIndex: 10 }}
      />
      
      {/* Tooltip */}
      <Tooltip
        event={tooltip.event}
        x={tooltip.x}
        y={tooltip.y}
        visible={tooltip.visible}
      />
      
      {/* Live Stats - CheckPoint Style */}
      <div className="absolute bottom-6 left-6 text-white z-30">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
          <div className="text-xs text-gray-300 mb-2 tracking-wider">LIVE STATISTICS</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Active Attacks:</span>
              <span className="text-orange-400 font-bold">{animatedArcs.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Per Minute:</span>
              <span className="text-red-400 font-bold">{Math.floor(animatedArcs.length * 6)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Top Source:</span>
              <span className="text-yellow-400 font-bold text-xs">CHINA</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Attack Types Legend */}
      <div className="absolute top-6 right-6 text-white z-30">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 min-w-[180px]">
          <div className="text-xs text-gray-300 mb-2 tracking-wider">ATTACK TYPES</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-red-500 rounded"></div>
              <span className="text-xs text-gray-300">High Severity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-orange-400 rounded"></div>
              <span className="text-xs text-gray-300">Medium Severity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-yellow-400 rounded"></div>
              <span className="text-xs text-gray-300">Low Severity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get color based on severity - Professional like ReactGlobe
function getSeverityColor(severity) {
  switch (severity) {
    case 'high':
      return [255, 60, 60]; // Bright Red like ReactGlobe
    case 'medium':
      return [255, 140, 0]; // Bright Orange
    case 'low':
      return [0, 200, 255]; // Bright Blue
    default:
      return [0, 255, 150]; // Bright Cyan-Green
  }
}

// Helper function to get nearest country name - improved accuracy
function getNearestCountry(lat, lon) {
  let nearestCountry = null;
  let minDistance = Infinity;
  
  Object.entries(COUNTRY_NAMES).forEach(([country, coords]) => {
    // Use Haversine-like distance for better geographical accuracy
    const latDiff = lat - coords.lat;
    const lonDiff = lon - coords.lon;
    const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestCountry = country;
    }
  });
  
  // More generous distance threshold for better labeling
  return minDistance < 40 ? nearestCountry : null;
}
