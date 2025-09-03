// Color palette for threat visualization
export const LIGHT_MUTED = [
  '#9CA3AF', // gray-400
  '#F87171', // red-400
  '#FB923C', // orange-400
  '#FBBF24', // amber-400
  '#A3E635', // lime-400
  '#34D399', // emerald-400
  '#22D3EE', // cyan-400
  '#60A5FA', // blue-400
  '#A78BFA', // violet-400
  '#F472B6', // pink-400
  '#FB7185', // rose-400
  '#FDBA74'  // orange-300
];

// Severity color mapping
export const SEVERITY_COLORS = {
  low: '#10B981',    // emerald-500
  medium: '#F59E0B', // amber-500
  high: '#EF4444'    // red-500
};

// All arcs will use the same bright color for better visibility
export const ARC_COLOR = '#00ff88'; // Bright green for all arcs

// Get color for threat family - now returns the same color for all
export function getFamilyColor(family) {
  return ARC_COLOR; // All arcs same color
}
