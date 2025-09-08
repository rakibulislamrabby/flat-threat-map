import * as d3 from 'd3';
import * as topojson from 'topojson-client';

// Cache for world data
let worldDataCache = null;

export async function fetchWorld110m() {
  if (worldDataCache) {
    return worldDataCache;
  }
  
  try {
    const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch world data: ${response.status}`);
    }
    worldDataCache = await response.json();
    return worldDataCache;
  } catch (error) {
    console.error('Error fetching world data:', error);
    throw error;
  }
}

export function toCountries(topo) {
  if (!topo || !topo.objects || !topo.objects.countries) {
    throw new Error('Invalid TopoJSON structure');
  }
  
  try {
    const countries = topojson.feature(topo, topo.objects.countries);
    return countries.features || [];
  } catch (error) {
    console.error('Error converting TopoJSON to GeoJSON:', error);
    throw error;
  }
}

export function makeProjection(width, height) {
  try {
    const projection = d3.geoNaturalEarth1();
    
    if (!projection) {
      throw new Error('Failed to create Natural Earth projection');
    }
    
    // Set scale and center manually for more predictable results
    const scale = Math.min(width / 6.5, height / 4.5);
    
    const configuredProjection = projection
      .scale(scale)
      .translate([width / 2, height / 2])
      .center([0, 0]);
    
    // Test the configured projection
    const testPoint = configuredProjection([-0.1276, 51.5074]); // London
    if (!testPoint || !Array.isArray(testPoint) || testPoint.length < 2) {
      throw new Error('Projection configuration failed');
    }
    
    return configuredProjection;
  } catch (error) {
    console.error('Error creating projection:', error);
    // Return a fallback projection instead of throwing
    try {
      return d3.geoNaturalEarth1().scale(100).translate([400, 300]).center([0, 0]);
    } catch (fallbackError) {
      console.error('Fallback projection also failed:', fallbackError);
      return null;
    }
  }
}

export function getGreatCircleDistance(src, dst) {
  const R = 6371; // Earth's radius in km
  const dLat = (dst.lat - src.lat) * Math.PI / 180;
  const dLon = (dst.lon - src.lon) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(src.lat * Math.PI / 180) * Math.cos(dst.lat * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function createArcPath(projection, src, dst) {
  try {
    if (!projection) {
      console.warn('No projection provided to createArcPath');
      return '';
    }
    
    console.log('🎯 Creating arc path from', src.lat + ',' + src.lon, 'to', dst.lat + ',' + dst.lon);
    
    // Test projection with a known valid point first (London)
    try {
      const testPoint = projection([-0.1276, 51.5074]);
      if (!testPoint || !Array.isArray(testPoint) || testPoint.length < 2) {
        console.warn('Projection test failed in createArcPath');
        return '';
      }
    } catch (testError) {
      console.warn('Projection test error in createArcPath:', testError);
      return '';
    }
    
    const srcPoint = projection([src.lon, src.lat]);
    const dstPoint = projection([dst.lon, dst.lat]);
    
    console.log('📍 Projected points:', srcPoint, dstPoint);
    
    if (!srcPoint || !dstPoint || srcPoint.length < 2 || dstPoint.length < 2) {
      console.warn('Invalid projected points');
      return '';
    }
    
    // Validate coordinates
    if (!isFinite(srcPoint[0]) || !isFinite(srcPoint[1]) || 
        !isFinite(dstPoint[0]) || !isFinite(dstPoint[1])) {
      console.warn('Non-finite coordinates');
      return '';
    }
    
    // Calculate midpoint for quadratic bezier curve
    const midLon = (src.lon + dst.lon) / 2;
    const midLat = (src.lat + dst.lat) / 2;
    
         // Add offset based on great circle distance - make arcs more dramatic
     const distance = getGreatCircleDistance(src, dst);
     const offset = Math.min(distance * 0.15, 30); // Increased offset for more dramatic curves
    
    const controlPoint = projection([midLon, midLat + offset]);
    
    if (!controlPoint || controlPoint.length < 2 || 
        !isFinite(controlPoint[0]) || !isFinite(controlPoint[1])) {
      // Fallback to straight line
      const path = `M ${srcPoint[0]} ${srcPoint[1]} L ${dstPoint[0]} ${dstPoint[1]}`;
      console.log('📏 Using straight line path:', path);
      return path;
    }
    
    const path = `M ${srcPoint[0]} ${srcPoint[1]} Q ${controlPoint[0]} ${controlPoint[1]} ${dstPoint[0]} ${dstPoint[1]}`;
    console.log('🎨 Created curved path:', path);
    return path;
  } catch (error) {
    console.error('Error creating arc path:', error);
    return '';
  }
}
