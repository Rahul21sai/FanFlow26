/**
 * @fileoverview Interactive SVG Stadium Map with clickable zones,
 * crowd density overlays, facility markers, and route visualization.
 * Replaces Google Maps with a free, testable SVG implementation.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CrowdData, Route } from '../types';
import { FacilityType } from '../types';
import { STADIUM_ZONES } from '../constants';
import { getDensityBgColor, getDensityFromPercentage, getDensityLabel, formatPercentage } from '../utils';

/** Props for the StadiumMap component. */
export interface StadiumMapProps {
  /** Current crowd density data per zone. */
  readonly crowdData: ReadonlyMap<string, CrowdData>;
  /** Currently active navigation route, if any. */
  readonly activeRoute: Route | null;
  /** Callback when a zone is clicked. */
  readonly onZoneClick: (zoneId: string) => void;
  /** Callback to find a specific facility type. */
  readonly onFindFacility: (type: string) => void;
  /** Callback to end the current route. */
  readonly onEndRoute: () => void;
}

/**
 * Interactive SVG-based stadium map with crowd density overlays.
 * Features clickable zones, quick-find buttons, and route visualization.
 * @param props - Map configuration and callbacks
 * @returns The rendered stadium map
 */
export function StadiumMap({
  crowdData,
  activeRoute,
  onZoneClick,
  onFindFacility,
  onEndRoute,
}: StadiumMapProps) {
  const { t } = useTranslation();
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const getDensityFill = (zoneId: string): string => {
    const data = crowdData.get(zoneId);
    if (!data) return 'rgba(159, 244, 204, 0.3)';
    const p = data.percentage;
    if (p <= 40) return 'rgba(40, 167, 69, 0.35)';
    if (p <= 70) return 'rgba(255, 193, 7, 0.4)';
    if (p <= 90) return 'rgba(220, 53, 69, 0.45)';
    return 'rgba(186, 26, 26, 0.55)';
  };

  const routeZones = activeRoute ? new Set(activeRoute.steps.map((s) => s.zoneId)) : new Set<string>();

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    onZoneClick(zoneId);
  };

  return (
    <main className="pt-20 pb-24 px-4 md:px-8 max-w-[1200px] mx-auto w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Quick Action Chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {[
          { type: FacilityType.EXIT, icon: 'exit_to_app', label: t('map.findExit') },
          { type: FacilityType.RESTROOM, icon: 'wc', label: t('map.findRestroom') },
          { type: FacilityType.MEDICAL, icon: 'local_hospital', label: t('map.findMedical') },
        ].map((btn) => (
          <button
            key={btn.type}
            id={`find-${btn.type.toLowerCase()}`}
            onClick={() => onFindFacility(btn.type)}
            className="shrink-0 flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#1c1b1b] border border-[#bec9c1] rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm min-h-[44px] hover:bg-[#eae7e7] hover:border-[#00543b] transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-xl text-[#00543b]">{btn.icon}</span>
            {btn.label}
          </button>
        ))}
      </div>

      {/* SVG Map Container */}
      <div className="bg-[#f0eded] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#bec9c1]/30 relative">
        <svg viewBox="0 0 400 420" className="w-full" role="img" aria-label="Stadium Map">
          {/* Stadium outline */}
          <ellipse cx="200" cy="210" rx="190" ry="200" fill="#e5e2e1" stroke="#bec9c1" strokeWidth="2" />
          <ellipse cx="200" cy="210" rx="170" ry="180" fill="#f6f3f2" stroke="#bec9c1" strokeWidth="1" />

          {/* Zone overlays */}
          {STADIUM_ZONES.map((zone) => (
            <g key={zone.id}>
              <path
                d={zone.svgPath}
                fill={routeZones.has(zone.id) ? 'rgba(0, 84, 59, 0.4)' : getDensityFill(zone.id)}
                stroke={hoveredZone === zone.id || selectedZone === zone.id ? '#00543b' : '#6f7a73'}
                strokeWidth={hoveredZone === zone.id || selectedZone === zone.id ? 2.5 : 1}
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleZoneClick(zone.id)}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                role="button"
                aria-label={`${zone.name} - ${getDensityLabel(getDensityFromPercentage(crowdData.get(zone.id)?.percentage ?? 0))}`}
              />
              <text
                x={zone.labelPosition.x}
                y={zone.labelPosition.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none select-none"
                fill="#1c1b1b"
                fontSize="8"
                fontWeight="600"
                fontFamily="Inter"
              >
                {zone.name.split('(')[0].trim().substring(0, 12)}
              </text>
              {/* Percentage badge */}
              {crowdData.get(zone.id) && zone.capacity > 0 && (
                <text
                  x={zone.labelPosition.x}
                  y={zone.labelPosition.y + 12}
                  textAnchor="middle"
                  className="pointer-events-none"
                  fill="#3f4943"
                  fontSize="7"
                  fontFamily="Inter"
                >
                  {formatPercentage(crowdData.get(zone.id)!.percentage)}
                </text>
              )}
            </g>
          ))}

          {/* Playing field */}
          <rect x="155" y="185" width="90" height="70" rx="4" fill="#28A745" opacity="0.3" stroke="#28A745" strokeWidth="1" />
          <text x="200" y="220" textAnchor="middle" fill="#00543b" fontSize="10" fontWeight="700" fontFamily="Inter">⚽ FIELD</text>

          {/* Route path overlay */}
          {activeRoute && activeRoute.steps.length > 0 && (
            <g>
              {activeRoute.steps.map((step, i) => {
                const zone = STADIUM_ZONES.find((z) => z.id === step.zoneId);
                if (!zone) return null;
                const prevZoneId = i === 0 ? activeRoute.startZone : activeRoute.steps[i - 1].zoneId;
                const prevZone = STADIUM_ZONES.find((z) => z.id === prevZoneId);
                if (!prevZone) return null;
                return (
                  <line
                    key={`route-${i}`}
                    x1={prevZone.labelPosition.x}
                    y1={prevZone.labelPosition.y}
                    x2={zone.labelPosition.x}
                    y2={zone.labelPosition.y}
                    stroke="#00543b"
                    strokeWidth="3"
                    strokeDasharray="6,3"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#00543b" />
                </marker>
              </defs>
            </g>
          )}
        </svg>

        {/* Tooltip for hovered zone */}
        {hoveredZone && (() => {
          const zone = STADIUM_ZONES.find((z) => z.id === hoveredZone);
          const data = crowdData.get(hoveredZone);
          if (!zone) return null;
          return (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-[#bec9c1]/30 text-center pointer-events-none">
              <p className="text-sm font-semibold text-[#1c1b1b]">{zone.name}</p>
              {data && (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${getDensityBgColor(data.density)}`} />
                  <span className="text-xs text-[#3f4943]">{getDensityLabel(data.density)} — {formatPercentage(data.percentage)}</span>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Map Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs text-[#3f4943]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[rgba(40,167,69,0.5)]" />
          <span>Low (&lt;40%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[rgba(255,193,7,0.55)]" />
          <span>Moderate (40-70%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[rgba(220,53,69,0.55)]" />
          <span>High (70-90%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[rgba(186,26,26,0.65)]" />
          <span>Critical (&gt;90%)</span>
        </div>
      </div>

      {/* Instruction text */}
      {!activeRoute && (
        <p className="text-center text-sm text-[#6f7a73] mt-3">
          Tap a zone to select it as your start, then tap another to find a route.
        </p>
      )}

      {/* Route Panel */}
      {activeRoute && activeRoute.steps.length > 0 && (
        <div className="mt-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[#bec9c1]/30 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#1c1b1b]">
                {t('map.routeTo', { destination: STADIUM_ZONES.find((z) => z.id === activeRoute.endZone)?.name ?? activeRoute.endZone })}
              </h2>
              <span className="text-sm font-bold text-[#00543b] bg-[#0b6e4f]/10 px-3 py-1 rounded-full">
                {activeRoute.totalMinutes} mins
              </span>
            </div>

            <div className="flex flex-col gap-2 relative">
              <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-[#bec9c1]/50" />
              {activeRoute.steps.slice(0, 5).map((step, i) => (
                <div key={`step-${i}`} className="flex items-start gap-4 relative z-10">
                  <div className={`w-6 h-6 rounded-full bg-white border-2 ${i === 0 ? 'border-[#00543b]' : 'border-[#bec9c1]'} flex items-center justify-center shrink-0 mt-0.5`}>
                    {i === 0 ? <span className="w-2 h-2 rounded-full bg-[#00543b]" /> : <span className="material-symbols-outlined text-[14px] text-[#bec9c1]">turn_left</span>}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1c1b1b]">{t('map.step', { number: i + 1 })}</p>
                    <p className="text-base text-[#3f4943]">{step.instruction}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              id="btn-end-route"
              onClick={onEndRoute}
              className="w-full bg-[#00543b] text-white text-sm font-semibold h-12 rounded-lg mt-2 flex justify-center items-center active:scale-95 transition-transform duration-150 hover:bg-[#00543b]/90 min-w-[44px]"
            >
              {t('map.endRoute')}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
