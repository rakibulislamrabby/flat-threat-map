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
            const progress = Math.min(age / 2000, 1); // 2 second animation for faster flow
            const alpha = Math.max(1 - age / (filters.timeWindow * 1000), 0.1);
            
            // Create a flowing effect - arc becomes brighter as it progresses
            const flowAlpha = progress < 0.8 ? 
              Math.max(alpha, 0.4 + 0.6 * Math.sin(progress * Math.PI)) : 
              alpha;
            
            return {
              ...arc,
              progress,
              alpha: flowAlpha
            };
          });
      });
    }, 50); // 20 FPS update rate

    return () => clearInterval(animationInterval);
  }, [filters.timeWindow]);

  // Convert events to deck.gl arc data
  const arcData = animatedArcs.map(arc => ({
    id: arc.id,
    sourcePosition: [arc.event.src.lon, arc.event.src.lat],
    targetPosition: [arc.event.dst.lon, arc.event.dst.lat],
    color: getSeverityColor(arc.event.severity),
    alpha: arc.alpha,
    progress: arc.progress,
    event: arc.event
  }));

  // Convert events to deck.gl scatter plot data for markers with pulsing effect
  const markerData = animatedArcs.flatMap(arc => {
    const now = Date.now();
    const age = now - arc.startTime;
    const pulseScale = 1 + 0.5 * Math.sin((age / 200) % (2 * Math.PI)); // Pulsing effect
    
    return [
      {
        position: [arc.event.src.lon, arc.event.src.lat],
        color: [...getSeverityColor(arc.event.severity), arc.alpha * 255],
        radius: 6 * pulseScale,
        type: 'source',
        event: arc.event
      },
      {
        position: [arc.event.dst.lon, arc.event.dst.lat],
        color: [...getSeverityColor(arc.event.severity), arc.alpha * 255],
        radius: 5 * pulseScale,
        type: 'destination',
        event: arc.event
      }
    ];
  });

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

  // Create traveling dots data for arcs
  const travelingDots = animatedArcs
    .filter(arc => arc.progress < 1 && arc.alpha > 0.3)
    .map(arc => {
      // Calculate position along the arc
      const srcLon = arc.event.src.lon;
      const srcLat = arc.event.src.lat;
      const dstLon = arc.event.dst.lon;
      const dstLat = arc.event.dst.lat;
      
      // Simple linear interpolation for the traveling dot
      const dotLon = srcLon + (dstLon - srcLon) * arc.progress;
      const dotLat = srcLat + (dstLat - srcLat) * arc.progress;
      
      return {
        position: [dotLon, dotLat],
        color: [...getSeverityColor(arc.event.severity), 255],
        radius: 4 + arc.alpha * 2,
        event: arc.event
      };
    });

  // Layers
  const layers = [
    // Threat Arcs Layer
    new ArcLayer({
      id: 'threat-arcs',
      data: arcData,
      getSourcePosition: d => d.sourcePosition,
      getTargetPosition: d => d.targetPosition,
      getSourceColor: d => [...d.color, Math.min(d.alpha * 255, 255)],
      getTargetColor: d => [...d.color.map(c => c * 0.7), Math.min(d.alpha * 255, 255)], // Fade to darker at target
      getWidth: d => 1.5 + d.alpha * 1.5, // Variable width based on alpha
      getHeight: 0.6,
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
    new ScatterplotLayer({
      id: 'threat-markers',
      data: markerData,
      getPosition: d => d.position,
      getColor: d => d.color,
      getRadius: d => d.radius,
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
    
    // Traveling Dots Layer
    new ScatterplotLayer({
      id: 'traveling-dots',
      data: travelingDots,
      getPosition: d => d.position,
      getColor: d => d.color,
      getRadius: d => d.radius,
      radiusUnits: 'pixels',
      pickable: false
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

// Helper function to get color based on severity - CheckPoint style
function getSeverityColor(severity) {
  switch (severity) {
    case 'high':
      return [255, 100, 50]; // Bright Red-Orange
    case 'medium':
      return [255, 200, 50]; // Bright Orange-Yellow
    case 'low':
      return [255, 255, 100]; // Bright Yellow
    default:
      return [255, 180, 0]; // CheckPoint Orange
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
