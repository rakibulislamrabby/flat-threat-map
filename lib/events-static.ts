import type { Event } from './types';

export const SAMPLE_EVENTS: Event[] = [
  // High severity events
  {
    ts: Date.now() - 1000,
    src: { lon: -74.006, lat: 40.7128 }, // New York
    dst: { lon: 90.3563, lat: 23.8103 }, // Dhaka
    family: "rce",
    severity: "high"
  },
  {
    ts: Date.now() - 2000,
    src: { lon: 139.6917, lat: 35.6895 }, // Tokyo
    dst: { lon: -0.1276, lat: 51.5074 }, // London
    family: "botnet",
    severity: "high"
  },
  {
    ts: Date.now() - 3000,
    src: { lon: 2.3522, lat: 48.8566 }, // Paris
    dst: { lon: 37.6173, lat: 55.7558 }, // Moscow
    family: "sql-injection",
    severity: "high"
  },
  
  // Medium severity events
  {
    ts: Date.now() - 4000,
    src: { lon: -79.3832, lat: 43.6532 }, // Toronto
    dst: { lon: 151.2093, lat: -33.8688 }, // Sydney
    family: "scan",
    severity: "medium"
  },
  {
    ts: Date.now() - 5000,
    src: { lon: 103.8198, lat: 1.3521 }, // Singapore
    dst: { lon: 90.3563, lat: 23.8103 }, // Dhaka
    family: "waf-bypass",
    severity: "medium"
  },
  {
    ts: Date.now() - 6000,
    src: { lon: -46.6333, lat: -23.5505 }, // São Paulo
    dst: { lon: 31.2357, lat: 30.0444 }, // Cairo
    family: "ddos",
    severity: "medium"
  },
  {
    ts: Date.now() - 7000,
    src: { lon: 114.1694, lat: 22.3193 }, // Hong Kong
    dst: { lon: 77.2090, lat: 28.6139 }, // New Delhi
    family: "phishing",
    severity: "medium"
  },
  
  // Low severity events
  {
    ts: Date.now() - 8000,
    src: { lon: -3.1883, lat: 55.9533 }, // Edinburgh
    dst: { lon: 4.9041, lat: 52.3676 }, // Amsterdam
    family: "scan",
    severity: "low"
  },
  {
    ts: Date.now() - 9000,
    src: { lon: 100.5018, lat: 13.7563 }, // Bangkok
    dst: { lon: 106.6297, lat: 10.8231 }, // Ho Chi Minh City
    family: "malware",
    severity: "low"
  },
  {
    ts: Date.now() - 10000,
    src: { lon: -99.1332, lat: 19.4326 }, // Mexico City
    dst: { lon: -58.3816, lat: -34.6037 }, // Buenos Aires
    family: "scan",
    severity: "low"
  },
  
  // More diverse events
  {
    ts: Date.now() - 11000,
    src: { lon: 55.2708, lat: 25.2048 }, // Dubai
    dst: { lon: 90.3563, lat: 23.8103 }, // Dhaka
    family: "botnet",
    severity: "medium"
  },
  {
    ts: Date.now() - 12000,
    src: { lon: 121.4737, lat: 31.2304 }, // Shanghai
    dst: { lon: 139.6917, lat: 35.6895 }, // Tokyo
    family: "rce",
    severity: "high"
  },
  {
    ts: Date.now() - 13000,
    src: { lon: -87.6298, lat: 41.8781 }, // Chicago
    dst: { lon: -79.3832, lat: 43.6532 }, // Toronto
    family: "sql-injection",
    severity: "medium"
  },
  {
    ts: Date.now() - 14000,
    src: { lon: 28.9784, lat: 41.0082 }, // Istanbul
    dst: { lon: 37.6173, lat: 55.7558 }, // Moscow
    family: "ddos",
    severity: "low"
  },
  {
    ts: Date.now() - 15000,
    src: { lon: 18.4241, lat: -33.9249 }, // Cape Town
    dst: { lon: 31.2357, lat: 30.0444 }, // Cairo
    family: "phishing",
    severity: "medium"
  },
  {
    ts: Date.now() - 16000,
    src: { lon: 77.2090, lat: 28.6139 }, // New Delhi
    dst: { lon: 90.3563, lat: 23.8103 }, // Dhaka
    family: "waf-bypass",
    severity: "low"
  },
  {
    ts: Date.now() - 17000,
    src: { lon: 151.2093, lat: -33.8688 }, // Sydney
    dst: { lon: 103.8198, lat: 1.3521 }, // Singapore
    family: "malware",
    severity: "high"
  },
  {
    ts: Date.now() - 18000,
    src: { lon: 4.9041, lat: 52.3676 }, // Amsterdam
    dst: { lon: 2.3522, lat: 48.8566 }, // Paris
    family: "scan",
    severity: "low"
  },
  {
    ts: Date.now() - 19000,
    src: { lon: 106.6297, lat: 10.8231 }, // Ho Chi Minh City
    dst: { lon: 100.5018, lat: 13.7563 }, // Bangkok
    family: "botnet",
    severity: "medium"
  },
  {
    ts: Date.now() - 20000,
    src: { lon: -34.6037, lat: -58.3816 }, // Buenos Aires
    dst: { lon: -46.6333, lat: -23.5505 }, // São Paulo
    family: "rce",
    severity: "low"
  },
  {
    ts: Date.now() - 21000,
    src: { lon: 55.2708, lat: 25.2048 }, // Dubai
    dst: { lon: 121.4737, lat: 31.2304 }, // Shanghai
    family: "sql-injection",
    severity: "high"
  },
  {
    ts: Date.now() - 22000,
    src: { lon: 139.6917, lat: 35.6895 }, // Tokyo
    dst: { lon: 114.1694, lat: 22.3193 }, // Hong Kong
    family: "ddos",
    severity: "medium"
  },
  {
    ts: Date.now() - 23000,
    src: { lon: 37.6173, lat: 55.7558 }, // Moscow
    dst: { lon: 28.9784, lat: 41.0082 }, // Istanbul
    family: "phishing",
    severity: "low"
  },
  {
    ts: Date.now() - 24000,
    src: { lon: 31.2357, lat: 30.0444 }, // Cairo
    dst: { lon: 18.4241, lat: -33.9249 }, // Cape Town
    family: "waf-bypass",
    severity: "high"
  },
  {
    ts: Date.now() - 25000,
    src: { lon: 103.8198, lat: 1.3521 }, // Singapore
    dst: { lon: 151.2093, lat: -33.8688 }, // Sydney
    family: "malware",
    severity: "medium"
  },
  {
    ts: Date.now() - 26000,
    src: { lon: 2.3522, lat: 48.8566 }, // Paris
    dst: { lon: 4.9041, lat: 52.3676 }, // Amsterdam
    family: "scan",
    severity: "low"
  },
  {
    ts: Date.now() - 27000,
    src: { lon: 100.5018, lat: 13.7563 }, // Bangkok
    dst: { lon: 106.6297, lat: 10.8231 }, // Ho Chi Minh City
    family: "botnet",
    severity: "high"
  },
  {
    ts: Date.now() - 28000,
    src: { lon: -23.5505, lat: -46.6333 }, // São Paulo
    dst: { lon: -34.6037, lat: -58.3816 }, // Buenos Aires
    family: "rce",
    severity: "medium"
  },
  {
    ts: Date.now() - 29000,
    src: { lon: 121.4737, lat: 31.2304 }, // Shanghai
    dst: { lon: 55.2708, lat: 25.2048 }, // Dubai
    family: "sql-injection",
    severity: "low"
  }
];
