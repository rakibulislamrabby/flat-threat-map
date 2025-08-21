export type Pt = { lon: number; lat: number };

export type Event = {
  ts: number;                 // epoch ms
  src: Pt;                    // source lon/lat
  dst: Pt;                    // destination lon/lat
  family: string;             // e.g., "botnet" | "rce" | "sql-injection" | "scan" | "waf-bypass"
  severity: "low" | "medium" | "high";
};

export type Severity = "low" | "medium" | "high";

export type ThreatFamily = 
  | "botnet" 
  | "rce" 
  | "sql-injection" 
  | "scan" 
  | "waf-bypass"
  | "ddos"
  | "phishing"
  | "malware";

export type FilterState = {
  severities: Severity[];
  families: ThreatFamily[];
  timeWindow: number; // seconds
};

export type AnimatedArc = {
  event: Event;
  startTime: number;
  progress: number;
  alpha: number;
};
