'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchWorld110m, toCountries } from '../lib/geo';

export default function DottedWorldMap({ width, height }) {
  const canvasRef = useRef(null);
  const mapDrawnRef = useRef(false);

  useEffect(() => {
    if (!width || !height || mapDrawnRef.current) return;

    const drawDottedMap = async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Load world data
        const worldData = await fetchWorld110m();
        const countries = toCountries(worldData);

        // Create projection - matching deck.gl's coordinate system
        const projection = d3.geoNaturalEarth1()
          .scale(Math.min(width, height) / 6.5)
          .translate([width / 2, height / 2])
          .center([0, 0]);

        const path = d3.geoPath().projection(projection);

        // Draw each country as dots
        countries.forEach(country => {
          try {
            const pathString = path(country);
            if (!pathString) return;

            // Create a temporary path to get bounds
            const tempPath = new Path2D(pathString);
            // Get bounding box of the country
            const bounds = path.bounds(country);
            const [[x0, y0], [x1, y1]] = bounds;
            
            // Draw dots in a grid pattern within the country bounds
            const dotSpacing = 4; // Even smaller spacing for detailed map
            const dotSize = 0.8; // Smaller individual dots
            
            // Use brighter, more visible color
            ctx.fillStyle = 'rgba(180, 200, 220, 0.9)';
            
            for (let x = x0; x <= x1; x += dotSpacing) {
              for (let y = y0; y <= y1; y += dotSpacing) {
                // Check if point is inside the country
                if (ctx.isPointInPath(tempPath, x, y)) {
                  ctx.beginPath();
                  ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
                  ctx.fill();
                }
              }
            }
            
            // Draw country borders for better definition
            ctx.strokeStyle = 'rgba(200, 220, 240, 0.3)';
            ctx.lineWidth = 0.5;
            ctx.stroke(tempPath);
          } catch (error) {
            // Skip countries that cause errors
          }
        });

        mapDrawnRef.current = true;
        console.log('✅ Dotted world map drawn successfully');

      } catch (error) {
        console.error('❌ Error drawing dotted map:', error);
      }
    };

    drawDottedMap();
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
}
