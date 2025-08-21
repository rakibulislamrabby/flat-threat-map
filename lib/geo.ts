import * as d3 from 'd3';
import * as topojson from 'topojson-client';

// Cache for world data
let worldDataCache: any = null;

export async function fetchWorld110m(): Promise<any> {
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

export function toCountries(topo: any): d3.GeoPermissibleObjects[] {
  if (!topo || !topo.objects || !topo.objects.countries) {
    throw new Error('Invalid TopoJSON structure');
  }
  
  try {
    const countries = topojson.feature(topo, topo.objects.countries);
    return (countries as any).features || [];
  } catch (error) {
    console.error('Error converting TopoJSON to GeoJSON:', error);
    throw error;
  }
}

export function makeProjection(width: number, height: number): d3.GeoProjection {
  const projection = d3.geoNaturalEarth1();
  
  if (!projection) {
    throw new Error('Failed to create Natural Earth projection');
  }
  
  // Set scale and center manually for more predictable results
  const scale = Math.min(width / 6.5, height / 4.5);
  
  return projection
    .scale(scale)
    .translate([width / 2, height / 2])
    .center([0, 0]);
}

export function getGreatCircleDistance(src: { lon: number; lat: number }, dst: { lon: number; lat: number }): number {
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

export function createArcPath(
  projection: d3.GeoProjection,
  src: { lon: number; lat: number },
  dst: { lon: number; lat: number }
): string {
  try {
    const srcPoint = projection([src.lon, src.lat]);
    const dstPoint = projection([dst.lon, dst.lat]);
    
    if (!srcPoint || !dstPoint || srcPoint.length < 2 || dstPoint.length < 2) {
      return '';
    }
    
    // Validate coordinates
    if (!isFinite(srcPoint[0]) || !isFinite(srcPoint[1]) || 
        !isFinite(dstPoint[0]) || !isFinite(dstPoint[1])) {
      return '';
    }
    
    // Calculate midpoint for quadratic bezier curve
    const midLon = (src.lon + dst.lon) / 2;
    const midLat = (src.lat + dst.lat) / 2;
    
    // Add offset based on great circle distance
    const distance = getGreatCircleDistance(src, dst);
    const offset = Math.min(distance * 0.1, 20); // Max 20 degrees offset
    
    const controlPoint = projection([midLon, midLat + offset]);
    
    if (!controlPoint || controlPoint.length < 2 || 
        !isFinite(controlPoint[0]) || !isFinite(controlPoint[1])) {
      // Fallback to straight line
      return `M ${srcPoint[0]} ${srcPoint[1]} L ${dstPoint[0]} ${dstPoint[1]}`;
    }
    
    return `M ${srcPoint[0]} ${srcPoint[1]} Q ${controlPoint[0]} ${controlPoint[1]} ${dstPoint[0]} ${dstPoint[1]}`;
  } catch (error) {
    console.error('Error creating arc path:', error);
    return '';
  }
}
