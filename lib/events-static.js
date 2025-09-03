// Static sample events for simulation with proper latitude and longitude coordinates
export const SAMPLE_EVENTS = [
  // High severity threats - Major cyber attacks
  {
    ts: Date.now() - 1000,
    src: { lat: 37.7749, lon: -122.4194 }, // San Francisco, USA
    dst: { lat: 51.5074, lon: -0.1278 },   // London, UK
    family: 'rce',
    severity: 'high'
  },
  {
    ts: Date.now() - 2000,
    src: { lat: 39.9042, lon: 116.4074 },  // Beijing, China
    dst: { lat: 40.7128, lon: -74.0060 },  // New York, USA
    family: 'malware',
    severity: 'high'
  },
  {
    ts: Date.now() - 3000,
    src: { lat: 55.7558, lon: 37.6173 },   // Moscow, Russia
    dst: { lat: 35.6762, lon: 139.6503 },  // Tokyo, Japan
    family: 'botnet',
    severity: 'high'
  },
  
  // Medium severity threats - Targeted attacks
  {
    ts: Date.now() - 4000,
    src: { lat: 52.5200, lon: 13.4050 },   // Berlin, Germany
    dst: { lat: -33.8688, lon: 151.2093 }, // Sydney, Australia
    family: 'sql-injection',
    severity: 'medium'
  },
  {
    ts: Date.now() - 5000,
    src: { lat: 19.4326, lon: -99.1332 },  // Mexico City, Mexico
    dst: { lat: 48.8566, lon: 2.3522 },    // Paris, France
    family: 'xss',
    severity: 'medium'
  },
  {
    ts: Date.now() - 6000,
    src: { lat: -23.5505, lon: -46.6333 }, // São Paulo, Brazil
    dst: { lat: 28.6139, lon: 77.2090 },   // New Delhi, India
    family: 'phishing',
    severity: 'medium'
  },
  
  // Low severity threats - Scanning and probing
  {
    ts: Date.now() - 7000,
    src: { lat: 41.9028, lon: 12.4964 },   // Rome, Italy
    dst: { lat: 59.3293, lon: 18.0686 },   // Stockholm, Sweden
    family: 'dos',
    severity: 'low'
  },
  {
    ts: Date.now() - 8000,
    src: { lat: -26.2041, lon: 28.0473 },  // Johannesburg, South Africa
    dst: { lat: 1.3521, lon: 103.8198 },   // Singapore
    family: 'brute-force',
    severity: 'low'
  },
  
  // Additional diverse events - Global coverage
  {
    ts: Date.now() - 9000,
    src: { lat: 64.1466, lon: -21.9426 },  // Reykjavik, Iceland
    dst: { lat: -34.6037, lon: -58.3816 }, // Buenos Aires, Argentina
    family: 'malware',
    severity: 'medium'
  },
  {
    ts: Date.now() - 10000,
    src: { lat: 25.2048, lon: 55.2708 },   // Dubai, UAE
    dst: { lat: -37.8136, lon: 144.9631 }, // Melbourne, Australia
    family: 'rce',
    severity: 'high'
  },
  {
    ts: Date.now() - 11000,
    src: { lat: 60.1699, lon: 24.9384 },   // Helsinki, Finland
    dst: { lat: 6.5244, lon: 3.3792 },     // Lagos, Nigeria
    family: 'botnet',
    severity: 'low'
  },
  {
    ts: Date.now() - 12000,
    src: { lat: 31.7683, lon: 35.2137 },   // Jerusalem, Israel
    dst: { lat: 45.4215, lon: -75.6972 },  // Ottawa, Canada
    family: 'sql-injection',
    severity: 'medium'
  },
  
  // High-impact cross-continental attacks
  {
    ts: Date.now() - 13000,
    src: { lat: 55.7558, lon: 37.6173 },   // Moscow, Russia
    dst: { lat: 37.7749, lon: -122.4194 }, // San Francisco, USA
    family: 'rce',
    severity: 'high'
  },
  {
    ts: Date.now() - 14000,
    src: { lat: 39.9042, lon: 116.4074 },  // Beijing, China
    dst: { lat: 51.5074, lon: -0.1278 },   // London, UK
    family: 'malware',
    severity: 'high'
  },
  {
    ts: Date.now() - 15000,
    src: { lat: 25.2048, lon: 55.2708 },   // Dubai, UAE
    dst: { lat: 40.7128, lon: -74.0060 },  // New York, USA
    family: 'botnet',
    severity: 'high'
  },
  {
    ts: Date.now() - 16000,
    src: { lat: -33.8688, lon: 151.2093 }, // Sydney, Australia
    dst: { lat: 52.5200, lon: 13.4050 },   // Berlin, Germany
    family: 'phishing',
    severity: 'medium'
  },
  {
    ts: Date.now() - 17000,
    src: { lat: 28.6139, lon: 77.2090 },   // New Delhi, India
    dst: { lat: 48.8566, lon: 2.3522 },    // Paris, France
    family: 'xss',
    severity: 'medium'
  },
  
  // Additional events for more dynamic visualization
  {
    ts: Date.now() - 18000,
    src: { lat: 35.6762, lon: 139.6503 },  // Tokyo, Japan
    dst: { lat: 55.7558, lon: 37.6173 },   // Moscow, Russia
    family: 'malware',
    severity: 'high'
  },
  {
    ts: Date.now() - 19000,
    src: { lat: 48.8566, lon: 2.3522 },    // Paris, France
    dst: { lat: 39.9042, lon: 116.4074 },  // Beijing, China
    family: 'rce',
    severity: 'medium'
  },
  {
    ts: Date.now() - 20000,
    src: { lat: 40.7128, lon: -74.0060 },  // New York, USA
    dst: { lat: 25.2048, lon: 55.2708 },   // Dubai, UAE
    family: 'botnet',
    severity: 'high'
  },
  {
    ts: Date.now() - 21000,
    src: { lat: 51.5074, lon: -0.1278 },   // London, UK
    dst: { lat: -23.5505, lon: -46.6333 }, // São Paulo, Brazil
    family: 'sql-injection',
    severity: 'medium'
  },
  {
    ts: Date.now() - 22000,
    src: { lat: 37.7749, lon: -122.4194 }, // San Francisco, USA
    dst: { lat: 60.1699, lon: 24.9384 },   // Helsinki, Finland
    family: 'phishing',
    severity: 'low'
  }
];
