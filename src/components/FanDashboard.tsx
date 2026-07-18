/**
 * @fileoverview Fan Dashboard with match card, quick actions, and promotions.
 * Matches the Stitch "Fan Dashboard" screen design.
 */

import { useTranslation } from 'react-i18next';
import type { CrowdData } from '../types';
import { AppView } from '../types';
import { getDensityLabel, getDensityBgColor, getDensityFromPercentage } from '../utils/density';

/** Props for the FanDashboard component. */
export interface FanDashboardProps {
  /** Current crowd data for overall density display. */
  readonly crowdData: ReadonlyMap<string, CrowdData>;
  /** Callback to navigate to a different view. */
  readonly onNavigate: (view: AppView) => void;
}

/**
 * Fan-facing dashboard with match info, quick action tiles, and promotions.
 * Shows a welcome greeting, live match card with crowd density bar,
 * and a grid of quick action buttons.
 * @param props - Dashboard configuration
 * @returns The rendered fan dashboard
 */
export function FanDashboard({ crowdData, onNavigate }: FanDashboardProps) {
  const { t } = useTranslation();

  // Calculate overall crowd density
  const allPercentages = Array.from(crowdData.values())
    .filter((d) => d.percentage > 0)
    .map((d) => d.percentage);
  const avgPercentage = allPercentages.length > 0
    ? Math.round(allPercentages.reduce((a, b) => a + b, 0) / allPercentages.length)
    : 60;
  const overallDensity = getDensityFromPercentage(avgPercentage);

  const quickActions = [
    { id: 'navigate', icon: 'navigation', label: t('dashboard.navigate'), view: AppView.MAP, primary: true },
    { id: 'assistant', icon: 'smart_toy', label: t('dashboard.askAssistant'), view: AppView.ASSISTANT, primary: false },
    { id: 'facilities', icon: 'wc', label: t('dashboard.facilities'), view: AppView.MAP, primary: false },
    { id: 'seat', icon: 'event_seat', label: t('dashboard.mySeat'), view: AppView.MAP, primary: false },
    { id: 'accessibility', icon: 'accessible', label: t('dashboard.accessibility'), view: AppView.ACCESSIBILITY, primary: false },
  ];

  return (
    <main className="flex-grow px-4 md:px-12 py-6 space-y-6 max-w-[1200px] mx-auto w-full pt-20 pb-24" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Greeting */}
      <section className="space-y-1">
        <h1 className="text-[28px] leading-9 font-bold text-[#1c1b1b]">{t('dashboard.welcome')}</h1>
        <p className="text-base text-[#3f4943]">{t('dashboard.readyMessage')}</p>
      </section>

      {/* Current Match Card */}
      <section className="bg-[#F8F9FA] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-l-4 border-[#FFC107] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FA] to-[#f6f3f2] opacity-50 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#f0eded] text-[#FFC107] text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#FFC107] animate-pulse" />
              {t('dashboard.liveUpcoming')}
            </span>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#1c1b1b]">Estadio Azteca</p>
              <p className="text-base text-[#3f4943]">{t('dashboard.kickoff')} 18:00</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">A</div>
              <span className="text-2xl font-semibold text-[#1c1b1b]">Team A</span>
            </div>
            <div className="text-5xl font-bold text-[#3f4943] opacity-30">{t('dashboard.vs')}</div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">B</div>
              <span className="text-2xl font-semibold text-[#1c1b1b]">Team B</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1 pt-4 border-t border-[#bec9c1]/30">
            <span className="material-symbols-outlined text-[#FFC107]" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            <span className="text-sm font-semibold text-[#1c1b1b]">{getDensityLabel(overallDensity)} Crowd Density</span>
            <div className="flex-grow bg-[#e5e2e1] h-2 rounded-full overflow-hidden ml-2">
              <div className={`${getDensityBgColor(overallDensity)} h-full rounded-full transition-all duration-500`} style={{ width: `${avgPercentage}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Tiles */}
      <section>
        <h2 className="text-2xl font-semibold text-[#1c1b1b] mb-4">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              id={`action-${action.id}`}
              onClick={() => onNavigate(action.view)}
              className={`rounded-xl p-4 flex flex-col items-start gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:scale-[1.02] active:scale-95 transition-all duration-200 min-h-[120px] justify-between ${
                action.primary
                  ? 'bg-[#00543b] text-white'
                  : 'bg-[#f0eded] text-[#1c1b1b] border border-[#bec9c1]/20'
              } ${action.id === 'accessibility' ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <span
                className={`material-symbols-outlined text-[32px] ${action.primary ? '' : 'text-[#00543b]'}`}
                style={{ fontVariationSettings: action.primary ? "'FILL' 1" : "'FILL' 0" }}
              >
                {action.icon}
              </span>
              <span className="text-sm font-semibold">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Promotions */}
      <section className="mt-6">
        <div className="bg-[#F8F9FA] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#bec9c1]/20 flex gap-4 items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#0b6e4f] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4" />
          <div className="w-12 h-12 bg-[#0b6e4f] text-[#98edc6] rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1c1b1b]">{t('dashboard.merchOpen')}</h3>
            <p className="text-sm text-[#3f4943]">{t('dashboard.merchSubtitle')}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
