export const LIGHT_MUTED = [
  "#F2B8A0", "#A9AEC1", "#B8D8C4", "#F7E3B8", "#B9A6D4",
  "#C7BCC9", "#89BFC1", "#F3DFA5", "#7A8A91", "#E3C9C9",
  "#BFC6D1", "#F6CFA8", "#91B6D1", "#CDE8E7", "#E8CFA2",
  "#9FAE82", "#6E7B5E", "#D8A8AF", "#A994AD", "#8394B3",
  "#F29FA2", "#F4D1BA", "#C4E1DB", "#A99EB4", "#E2CCC6",
  "#BBD1C9", "#F7AFA9", "#C7AA8E", "#D4E4A9", "#BFE1F0"
];

// Severity color mapping
export const SEVERITY_COLORS = {
  high: LIGHT_MUTED[0],    // "#F2B8A0"
  medium: LIGHT_MUTED[11], // "#F6CFA8"
  low: LIGHT_MUTED[13]     // "#CDE8E7"
} as const;

// Family color mapping - assign colors to different threat families
export const getFamilyColor = (family: string): string => {
  const familyColors: Record<string, string> = {
    botnet: LIGHT_MUTED[2],      // "#B8D8C4"
    rce: LIGHT_MUTED[5],         // "#C7BCC9"
    "sql-injection": LIGHT_MUTED[8], // "#E3C9C9"
    scan: LIGHT_MUTED[12],       // "#91B6D1"
    "waf-bypass": LIGHT_MUTED[15], // "#9FAE82"
    ddos: LIGHT_MUTED[18],       // "#8394B3"
    phishing: LIGHT_MUTED[21],   // "#F4D1BA"
    malware: LIGHT_MUTED[24],    // "#E2CCC6"
    default: LIGHT_MUTED[27]     // "#C7AA8E"
  };
  
  return familyColors[family] || familyColors.default;
};
