import WorldMap from "../components/WorldMap";

export default function Page() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          World Map (D3 + TopoJSON)
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <WorldMap width={960} height={520} />
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          Interactive world map showing countries and major capitals
        </div>
      </div>
    </main>
  );
}
