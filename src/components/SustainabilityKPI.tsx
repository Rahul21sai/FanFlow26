export function SustainabilityKPI() {

  return (
    <section className="mt-6 mb-4">
      <h2 className="text-2xl font-semibold text-[#1c1b1b] mb-4">Event Sustainability</h2>
      <div className="grid grid-cols-2 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-[#e8f5e9] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#a5d6a7]">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#2e7d32]">eco</span>
            <span className="text-sm font-semibold text-[#2e7d32]">Carbon Offset</span>
          </div>
          <div className="text-2xl font-bold text-[#1b5e20]">450t</div>
          <p className="text-xs text-[#2e7d32] mt-1">CO₂ reduced today</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#e3f2fd] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#90caf9]">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#1565c0]">recycling</span>
            <span className="text-sm font-semibold text-[#1565c0]">Waste Diverted</span>
          </div>
          <div className="text-2xl font-bold text-[#0d47a1]">82%</div>
          <p className="text-xs text-[#1565c0] mt-1">Recycled/Composted</p>
        </div>

      </div>
    </section>
  );
}
