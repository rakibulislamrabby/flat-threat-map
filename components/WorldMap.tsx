"use client";

import * as d3 from "d3";
import { feature } from "topojson-client";
import { useEffect, useMemo, useRef } from "react";
import * as topojson from "topojson-client";

// Import the world atlas data
const countries110m = require("world-atlas/countries-110m.json");

type Props = { width?: number; height?: number };

type Capital = {
  name: string;
  lat: number;
  lon: number; // note: lon, then lat for projection
};

// Example capitals (replace with fetch to your CSV if you like)
const capitalsSample: Capital[] = [
  { name: "Dhaka", lat: 23.8103, lon: 90.4125 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Washington, D.C.", lat: 38.9072, lon: -77.0369 }
];

export default function WorldMap({ width = 960, height = 520 }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  // Convert TopoJSON → GeoJSON once
  const countries = useMemo(() => {
    try {
      if (!countries110m || !countries110m.objects || !countries110m.objects.countries) {
        console.error('Invalid world atlas data structure');
        return [];
      }
      
      // `countries-110m.json` has an "objects.countries" topology
      const geo = topojson.feature(
        countries110m,
        countries110m.objects.countries
      ) as any;
      
      console.log('Countries loaded successfully:', geo.features.length);
      return geo.features;
    } catch (error) {
      console.error('Error converting TopoJSON to GeoJSON:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (!ref.current || countries.length === 0) {
      console.log('SVG ref or countries not ready:', { ref: !!ref.current, countriesCount: countries.length });
      return;
    }

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // idempotent rerenders

    // Group for everything (handy for zoom/pan later)
    const g = svg.append("g");

    // Projection & path
    const projection = d3
      .geoMercator()
      .translate([width / 2, height / 2])
      .scale((width / (2 * Math.PI)) * 1.3); // decent default

    const path = d3.geoPath(projection);

    console.log('Drawing', countries.length, 'countries');

    // Draw countries
    g.selectAll("path.country")
      .data(countries)
      .join("path")
      .attr("class", "country")
      .attr("d", path as any)
      .attr("fill", "#e8eef5")
      .attr("stroke", "#aab7c4")
      .attr("stroke-width", 0.5);

    // Plot capitals as dots
    g.selectAll("circle.capital")
      .data(capitalsSample)
      .join("circle")
      .attr("class", "capital")
      .attr("r", 2.5)
      .attr("cx", d => projection([d.lon, d.lat])![0])
      .attr("cy", d => projection([d.lon, d.lat])![1])
      .attr("fill", "#333");

    // Labels
    g.selectAll("text.capital-label")
      .data(capitalsSample)
      .join("text")
      .attr("class", "capital-label")
      .attr("x", d => projection([d.lon, d.lat])![0])
      .attr("y", d => projection([d.lon, d.lat])![1])
      .attr("dx", 6)
      .attr("dy", 3)
      .style("fontSize", "10px")
      .style("fontFamily", "system-ui, -apple-system, Segoe UI, Roboto, sans-serif")
      .text(d => d.name);

    console.log('Map rendering complete');
  }, [countries, width, height]);

  return (
    <div className="w-full">
      {countries.length === 0 ? (
        <div className="p-4 bg-gray-100 border rounded">
          Loading world map data...
        </div>
      ) : (
        <svg
          ref={ref}
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="auto"
          style={{ 
            background: "white", 
            maxWidth: width,
            border: "1px solid #ddd",
            minHeight: "400px"
          }}
          role="img"
          aria-label="World map with selected capitals"
        />
      )}
    </div>
  );
}
