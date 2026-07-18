/**
 * @fileoverview Operations Dashboard with AI suggestions, alerts,
 * density overview, and incident feed. Matches Stitch "Ops Dashboard" screen.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CrowdData, Incident } from '../types';
import { IncidentSeverity, IncidentStatus } from '../types';
import { getDensityFromPercentage, getDensityBgColor, getDensityTextColor, formatPercentage } from '../utils/density';
import { formatTimestamp } from '../utils/format';

/** Props for the OpsDashboard component. */
export interface OpsDashboardProps {
  /** Current crowd density data per zone. */
  readonly crowdData: ReadonlyMap<string, CrowdData>;
}

/**
 * Operations dashboard for organizers with AI suggestions,
 * bottleneck alerts, density bars, crowd trend chart, and incident feed.
 * @param props - Dashboard data
 * @returns The rendered ops dashboard
 */
export function OpsDashboard({ crowdData }: OpsDashboardProps) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  // Simulated incidents
  const incidents: Incident[] = [
    { id: '1', title: 'Spill reported Gate C', description: 'Water spill near entrance', severity: IncidentSeverity.MEDIUM, status: IncidentStatus.DISPATCHED, zoneId: 'gate-c', reportedAt: new Date(Date.now() - 2 * 60_000), icon: 'water_drop' },
    { id: '2', title: 'Wait time at Concessions B: 15m', description: 'Long queue', severity: IncidentSeverity.LOW, status: IncidentStatus.MONITORING, zoneId: 'concourse-east', reportedAt: new Date(Date.now() - 10 * 60_000), icon: 'fastfood' },
    { id: '3', title: 'VIP Entrance A Clear', description: 'All clear', severity: IncidentSeverity.LOW, status: IncidentStatus.RESOLVED, zoneId: 'gate-a', reportedAt: new Date(Date.now() - 15 * 60_000), icon: 'info' },
  ];

  // Chart data
  const [chartData, setChartData] = useState<{ time: string; density: number }[]>([]);
  useEffect(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      data.push({
        time: `${18 - i}:00`,
        density: Math.round(30 + Math.random() * 50 + (6 - i) * 5),
      });
    }
    setChartData(data);
  }, []);

  // Get key zone densities
  const keyZones = [
    { id: 'concourse-north', name: 'Zone A (North Concourse)' },
    { id: 'concourse-east', name: 'Zone B (East Concourse)' },
    { id: 'concourse-south', name: 'Zone C (South Gates)' },
  ];

  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-12 py-6 pt-20 pb-24" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Dashboard Header */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <p className="text-sm font-semibold text-[#00543b] uppercase tracking-wider mb-1">{t('ops.title')}</p>
          <h2 className="text-5xl font-bold text-[#1c1b1b]">{t('ops.liveDashboard')}</h2>
        </div>
        <div className="flex items-center gap-2 bg-[#F8F9FA] p-2 rounded-full border border-[#bec9c1] shadow-sm w-fit">
          <span className="w-3 h-3 rounded-full bg-[#DC3545] animate-pulse ml-2" />
          <span className="text-xs font-medium text-[#3f4943] pr-2">{t('ops.liveSync')}</span>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* AI Suggestion Card */}
        {!dismissed && (
          <section className="col-span-1 md:col-span-8 bg-[#F8F9FA] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#bec9c1] relative overflow-hidden flex flex-col justify-between min-h-[200px]">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FFC107]" />
            <div className="flex items-start gap-3 z-10 relative">
              <div className="w-10 h-10 rounded-full bg-[#feae2c] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#6b4500]">smart_toy</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1c1b1b] mb-1 flex items-center gap-2">
                  {t('ops.aiSuggestion')}
                  <span className="bg-[#FFC107]/20 text-[#835500] text-[10px] font-medium px-2 py-0.5 rounded-full uppercase">{t('ops.actionRequired')}</span>
                </h3>
                <p className="text-2xl font-semibold text-[#1c1b1b] leading-tight mb-2">Redirect Gate D traffic to Gate A</p>
                <p className="text-sm text-[#3f4943]">Gate D is currently experiencing a severe bottleneck. Re-routing expected to reduce wait times by 25 mins.</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3 z-10 relative">
              <button id="btn-execute-reroute" className="bg-[#00543b] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#005139] transition-colors active:scale-95 min-w-[44px] min-h-[44px]">
                {t('ops.execute')}
              </button>
              <button id="btn-dismiss" onClick={() => setDismissed(true)} className="bg-transparent border border-[#6f7a73] text-[#1c1b1b] text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#f0eded] transition-colors active:scale-95 min-w-[44px] min-h-[44px]">
                {t('ops.dismiss')}
              </button>
            </div>
          </section>
        )}

        {/* Critical Alert */}
        <section className={`col-span-1 ${dismissed ? 'md:col-span-12' : 'md:col-span-4'} bg-[#ffdad6] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#ba1a1a]/30 relative flex flex-col`}>
          <div className="absolute top-0 left-0 w-1 h-full bg-[#ba1a1a]" />
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <h3 className="text-sm font-semibold text-[#93000a] uppercase tracking-wider">{t('ops.criticalAlert')}</h3>
          </div>
          <div className="bg-white/50 rounded-lg p-3 mb-3 border border-[#ba1a1a]/10">
            <p className="text-lg font-semibold text-[#93000a]">Exit Bottleneck at Gate D detected</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="material-symbols-outlined text-[#ba1a1a] text-sm">group</span>
              <span className="text-xs font-medium text-[#ba1a1a]">Est. 1200+ fans delayed</span>
            </div>
          </div>
          <div className="mt-auto pt-2">
            <button id="btn-view-camera" className="w-full bg-[#ba1a1a] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#93000a] transition-colors min-h-[44px] flex items-center justify-center gap-2">
              <span>{t('ops.viewCamera')}</span>
              <span className="material-symbols-outlined text-sm">videocam</span>
            </button>
          </div>
        </section>

        {/* Density Overview */}
        <section className="col-span-1 md:col-span-6 bg-[#F8F9FA] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#bec9c1]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-[#1c1b1b] uppercase tracking-wider">{t('ops.densityOverview')}</h3>
            <button className="text-[#00543b] text-xs font-medium hover:underline min-w-[44px] min-h-[44px] flex items-center">{t('ops.fullMap')}</button>
          </div>
          <div className="space-y-4">
            {keyZones.map((zone) => {
              const data = crowdData.get(zone.id);
              const pct = data?.percentage ?? 50;
              const level = getDensityFromPercentage(pct);
              return (
                <div key={zone.id}>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-base text-[#1c1b1b] font-medium">{zone.name}</span>
                    <span className={`text-2xl font-semibold ${getDensityTextColor(level)}`}>{formatPercentage(pct)}</span>
                  </div>
                  <div className="w-full bg-[#eae7e7] rounded-full h-2">
                    <div className={`${getDensityBgColor(level)} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Crowd Trend Chart */}
        <section className="col-span-1 md:col-span-6 bg-[#F8F9FA] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#bec9c1]">
          <h3 className="text-sm font-semibold text-[#1c1b1b] uppercase tracking-wider mb-4">Crowd Density Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="densityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00543b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00543b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#bec9c1" opacity={0.3} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#3f4943' }} />
              <YAxis tick={{ fontSize: 11, fill: '#3f4943' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #bec9c1', fontSize: '12px' }} />
              <Area type="monotone" dataKey="density" stroke="#00543b" strokeWidth={2} fillOpacity={1} fill="url(#densityGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        {/* Incident Feed */}
        <section className="col-span-1 md:col-span-12 bg-[#F8F9FA] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#bec9c1] flex flex-col max-h-[300px]">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="text-sm font-semibold text-[#1c1b1b] uppercase tracking-wider">{t('ops.incidentFeed')}</h3>
            <span className="bg-[#eae7e7] text-[#3f4943] text-[10px] font-medium px-2 py-1 rounded-md uppercase">{t('ops.filter')}</span>
          </div>
          <div className="overflow-y-auto pr-2 space-y-3 pb-2 flex-grow">
            {incidents.map((incident) => {
              const bgColors: Record<string, string> = { water_drop: 'bg-[#974946]', fastfood: 'bg-[#feae2c]', info: 'bg-[#eae7e7]' };
              const textColors: Record<string, string> = { water_drop: 'text-white', fastfood: 'text-[#6b4500]', info: 'text-[#3f4943]' };
              return (
                <div key={incident.id} className="flex gap-3 items-start pb-3 border-b border-[#eae7e7] last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-full ${bgColors[incident.icon] ?? 'bg-[#eae7e7]'} flex items-center justify-center shrink-0 mt-0.5`}>
                    <span className={`material-symbols-outlined text-sm ${textColors[incident.icon] ?? 'text-[#3f4943]'}`}>{incident.icon}</span>
                  </div>
                  <div>
                    <p className="text-base text-[#1c1b1b] font-medium">{incident.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#3f4943]">{formatTimestamp(incident.reportedAt)}</span>
                      {incident.status !== IncidentStatus.RESOLVED && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-[#bec9c1]" />
                          <span className={`text-xs ${incident.status === IncidentStatus.DISPATCHED ? 'text-[#00543b]' : 'text-[#3f4943]'}`}>
                            {incident.status === IncidentStatus.DISPATCHED ? t('ops.dispatched') : t('ops.monitoring')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
