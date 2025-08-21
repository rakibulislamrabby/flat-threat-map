// Static sample events for simulation
export const SAMPLE_EVENTS = [
  // High severity threats
  {
    ts: Date.now() - 1000,
    src: { lat: 37.7749, lon: -122.4194 }, // San Francisco
    dst: { lat: 51.5074, lon: -0.1278 },   // London
    family: 'rce',
    severity: 'high'
  },
  {
    ts: Date.now() - 2000,
    src: { lat: 39.9042, lon: 116.4074 },  // Beijing
    dst: { lat: 40.7128, lon: -74.0060 },  // New York
    family: 'malware',
    severity: 'high'
  },
  {
    ts: Date.now() - 3000,
    src: { lat: 55.7558, lon: 37.6173 },   // Moscow
    dst: { lat: 35.6762, lon: 139.6503 },  // Tokyo
    family: 'botnet',
    severity: 'high'
  },
  
  // Medium severity threats
  {
    ts: Date.now() - 4000,
    src: { lat: 52.5200, lon: 13.4050 },   // Berlin
    dst: { lat: -33.8688, lon: 151.2093 }, // Sydney
    family: 'sql-injection',
    severity: 'medium'
  },
  {
    ts: Date.now() - 5000,
    src: { lat: 19.4326, lon: -99.1332 },  // Mexico City
    dst: { lat: 48.8566, lon: 2.3522 },    // Paris
    family: 'xss',
    severity: 'medium'
  },
  {
    ts: Date.now() - 6000,
    src: { lat: -23.5505, lon: -46.6333 }, // São Paulo
    dst: { lat: 28.6139, lon: 77.2090 },   // New Delhi
    family: 'phishing',
    severity: 'medium'
  },
  
  // Low severity threats
  {
    ts: Date.now() - 7000,
    src: { lat: 41.9028, lon: 12.4964 },   // Rome
    dst: { lat: 59.3293, lon: 18.0686 },   // Stockholm
    family: 'dos',
    severity: 'low'
  },
  {
    ts: Date.now() - 8000,
    src: { lat: -26.2041, lon: 28.0473 },  // Johannesburg
    dst: { lat: 1.3521, lon: 103.8198 },   // Singapore
    family: 'brute-force',
    severity: 'low'
  },
  
  // Additional diverse events
  {
    ts: Date.now() - 9000,
    src: { lat: 64.1466, lon: -21.9426 },  // Reykjavik
    dst: { lat: -34.6037, lon: -58.3816 }, // Buenos Aires
    family: 'malware',
    severity: 'medium'
  },
  {
    ts: Date.now() - 10000,
    src: { lat: 25.2048, lon: 55.2708 },   // Dubai
    dst: { lat: -37.8136, lon: 144.9631 }, // Melbourne
    family: 'rce',
    severity: 'high'
  },
  {
    ts: Date.now() - 11000,
    src: { lat: 60.1699, lon: 24.9384 },   // Helsinki
    dst: { lat: 6.5244, lon: 3.3792 },     // Lagos
    family: 'botnet',
    severity: 'low'
  },
  {
    ts: Date.now() - 12000,
    src: { lat: 31.7683, lon: 35.2137 },   // Jerusalem
    dst: { lat: 45.4215, lon: -75.6972 },  // Ottawa
    family: 'sql-injection',
    severity: 'medium'
  }
];
