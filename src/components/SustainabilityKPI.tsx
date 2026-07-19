import { useAppContext } from '../context/AppContext';
import { STADIUMS } from '../data/stadiums';

export function SustainabilityKPI() {
  const { selectedStadium } = useAppContext();
  const activeStadium = STADIUMS[selectedStadium] || STADIUMS.azteca;

  return (
    <section className="mt-6 mb-4">
      <h2 className="text-2xl font-semibold text-[#1c1b1b] mb-4">Event Sustainability</h2>
      <div className="grid grid-cols-2 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-[#e8f5e9] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#a5d6a7]">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#2e7d32]">eco</span>
            <span className="text-sm font-semibold text-[#2e7d32]">Energy source</span>
          </div>
          <div className="text-2xl font-bold text-[#1b5e20]">{activeStadium.sustainability.renewableEnergyPercent}%</div>
          <p className="text-xs text-[#2e7d32] mt-1">{activeStadium.sustainability.certification}</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#e3f2fd] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#90caf9]">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#1565c0]">recycling</span>
            <span className="text-sm font-semibold text-[#1565c0]">Waste Diverted</span>
          </div>
          <div className="text-2xl font-bold text-[#0d47a1]">{activeStadium.sustainability.wasteRecyclingPercent}%</div>
          <p className="text-xs text-[#1565c0] mt-1">Recycled/Composted</p>
        </div>

      </div>
    </section>
  );
}
