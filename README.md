# 🚀 Flat Threat Map

A **production-ready, modern threat visualization application** built with Next.js, TypeScript, and D3.js. Features a beautiful dark theme with glass morphism effects, animated threat arcs, and real-time data streaming capabilities.

![Threat Map Preview](https://via.placeholder.com/800x400/1e293b/ffffff?text=Threat+Map+Preview)

## ✨ Features

### 🎨 **Modern Design**
- **Dark Theme**: Sophisticated dark gradient background with glass morphism effects
- **Glass Morphism**: Translucent panels with backdrop blur for modern aesthetics
- **Animated Elements**: Smooth transitions, hover effects, and pulse animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support

### 🗺️ **Interactive Map**
- **2D World Map**: Natural Earth projection with country boundaries
- **Animated Arcs**: Smooth quadratic bezier curves with traveling dots
- **Real-time Updates**: Live threat event visualization
- **Hover Tooltips**: Rich information display with threat details
- **Performance Optimized**: 60+ FPS with canvas rendering

### 🎛️ **Advanced Controls**
- **Severity Filtering**: Filter by high, medium, or low threat levels
- **Family Filtering**: Focus on specific threat types (botnet, RCE, SQL injection, etc.)
- **Time Window**: Adjustable time range (10-300 seconds)
- **Live Statistics**: Real-time event counters and status indicators
- **Interactive Legend**: Visual threat type and severity indicators

### 🔧 **Technical Excellence**
- **TypeScript**: Full type safety and IntelliSense support
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Performance**: Optimized rendering with requestAnimationFrame
- **Memory Management**: Proper cleanup and resource management
- **WebSocket Ready**: Drop-in replacement for live data streaming

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Visualization**: D3.js (d3-geo, d3-selection, d3-transition)
- **Data**: TopoJSON for world geometry
- **Build Tool**: Vite (via Next.js)
- **Linting**: ESLint with Next.js config

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd flat-threat-map

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
flat-threat-map/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles and Tailwind
├── components/            # React components
│   ├── ThreatMap.tsx      # Main map visualization
│   ├── ThreatControls.tsx # Filter and control panel
│   └── Tooltip.tsx        # Hover information display
├── lib/                   # Utility functions
│   ├── colors.ts          # Color palette and mappings
│   ├── events-static.ts   # Sample threat events
│   ├── geo.ts            # Geographic utilities
│   ├── stream.ts         # Data streaming logic
│   └── types.ts          # TypeScript type definitions
└── styles/               # Additional styling
    └── globals.css       # Custom CSS and animations
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue to Purple gradient (`#3b82f6` → `#8b5cf6`)
- **Background**: Dark slate gradient (`#1e293b` → `#334155`)
- **Accent**: Red, Yellow, Green for severity levels
- **Text**: White and slate variants for hierarchy

### Typography
- **Headings**: Bold, large text with gradient effects
- **Body**: Clean, readable text with proper contrast
- **Monospace**: Used for coordinates and technical data

### Components
- **Glass Panels**: Translucent backgrounds with backdrop blur
- **Gradient Buttons**: Smooth hover effects and focus states
- **Animated Icons**: SVG icons with hover animations
- **Custom Sliders**: Styled range inputs with gradient thumbs

## 🔌 Data Integration

### Current Mode: Static Simulation
The app currently runs in static simulation mode, replaying sample events in a loop.

### WebSocket Integration
To switch to live data streaming:

1. Edit `lib/stream.ts`
2. Set `USE_STATIC = false`
3. Implement your WebSocket connection in `connectSocket()`

```typescript
// Example WebSocket implementation
export function connectSocket(onEvent: (e: Event) => void): () => void {
  const ws = new WebSocket('ws://your-server/threats');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onEvent(data);
  };
  
  return () => ws.close();
}
```

## 📊 Event Schema

```typescript
type Event = {
  ts: number;                 // Timestamp (epoch ms)
  src: { lon: number; lat: number }; // Source coordinates
  dst: { lon: number; lat: number }; // Destination coordinates
  family: string;             // Threat family (botnet, rce, etc.)
  severity: "low" | "medium" | "high"; // Threat severity
};
```

## 🎯 Performance Features

- **60+ FPS**: Optimized canvas rendering
- **Memory Efficient**: Automatic cleanup of old arcs
- **Responsive**: Adapts to container size changes
- **Accessibility**: Respects `prefers-reduced-motion`
- **Error Resilient**: Graceful handling of invalid data

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Custom WebSocket endpoint
NEXT_PUBLIC_WS_ENDPOINT=ws://localhost:8080/threats

# Optional: Custom API endpoint
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001/api
```

### Customization
- **Colors**: Modify `lib/colors.ts` for custom color schemes
- **Events**: Add sample events in `lib/events-static.ts`
- **Styling**: Customize Tailwind classes and CSS variables
- **Animation**: Adjust timing in `components/ThreatMap.tsx`

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Code Quality
- **ESLint**: Configured with Next.js rules
- **TypeScript**: Strict mode enabled
- **Prettier**: Code formatting (optional)
- **Husky**: Git hooks (optional)

## 🌟 Key Features

### Interactive Map
- **Hover Effects**: Rich tooltips with threat details
- **Zoom Support**: Responsive to container resizing
- **Performance**: Smooth 60+ FPS animation
- **Accessibility**: Keyboard navigation support

### Real-time Updates
- **Live Events**: Continuous threat event simulation
- **Time Window**: Configurable event visibility
- **Status Indicators**: Live system status display
- **Statistics**: Real-time event counters

### Modern UI/UX
- **Glass Morphism**: Modern translucent design
- **Smooth Animations**: CSS transitions and keyframes
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Eye-friendly dark color scheme

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **D3.js**: For powerful data visualization capabilities
- **Next.js**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Natural Earth**: For the world geometry data

---

**Built with ❤️ using Next.js, TypeScript, and D3.js**
