export function TransportWidget() {

  return (
    <section className="mt-6">
      <h2 className="text-2xl font-semibold text-[#1c1b1b] mb-4">Transit Status</h2>
      <div className="bg-[#F8F9FA] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#bec9c1]/20 space-y-4">
        
        {/* Metro Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#2e7d32]">
              <span className="material-symbols-outlined">train</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1c1b1b]">Metro Line 1</p>
              <p className="text-xs text-[#3f4943]">Arriving in 3 min</p>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-[#e8f5e9] text-[#2e7d32] text-xs font-semibold">On Time</span>
        </div>

        {/* Bus Status */}
        <div className="flex items-center justify-between pt-4 border-t border-[#bec9c1]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fff3e0] flex items-center justify-center text-[#ef6c00]">
              <span className="material-symbols-outlined">directions_bus</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1c1b1b]">Shuttle Bus A</p>
              <p className="text-xs text-[#3f4943]">Next departure in 12 min</p>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-[#fff3e0] text-[#ef6c00] text-xs font-semibold">Delayed</span>
        </div>

      </div>
    </section>
  );
}
