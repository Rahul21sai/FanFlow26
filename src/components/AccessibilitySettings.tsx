/**
 * @fileoverview Accessibility Settings screen with toggles and facility list.
 * Matches Stitch "Accessibility Mode" screen design.
 */

import { useTranslation } from 'react-i18next';
import type { AccessibilitySettings as AccessibilitySettingsType } from '../types';

/** Props for the AccessibilitySettingsScreen component. */
export interface AccessibilitySettingsProps {
  /** Current accessibility settings. */
  readonly settings: AccessibilitySettingsType;
  /** Callback when a setting is toggled. */
  readonly onToggle: (key: keyof AccessibilitySettingsType) => void;
}

/**
 * Accessibility settings screen with toggle switches for high contrast,
 * large text, wheelchair routing, and screen-reader optimization.
 * Also shows nearest accessible facilities.
 * @param props - Settings state and toggle callback
 * @returns The rendered accessibility settings
 */
export function AccessibilitySettingsScreen({
  settings,
  onToggle,
}: AccessibilitySettingsProps) {
  const { t } = useTranslation();

  const toggles = [
    { key: 'highContrast' as const, icon: 'contrast', label: t('accessibility.highContrast') },
    { key: 'largeText' as const, icon: 'format_size', label: t('accessibility.largeText') },
    { key: 'wheelchairRouting' as const, icon: 'accessible_forward', label: t('accessibility.wheelchairRouting') },
    { key: 'screenReaderOptimized' as const, icon: 'record_voice_over', label: t('accessibility.screenReader') },
  ];

  const facilities = [
    { name: 'Elevator Gate A', icon: 'elevator', distance: '20m', level: 1, color: 'bg-[#0b6e4f]/10 text-[#00543b]', distBg: 'bg-[#28A745]/10 text-[#28A745]' },
    { name: 'Accessible Restroom Sec 105', icon: 'wc', distance: '45m', level: 1, color: 'bg-[#feae2c]/20 text-[#835500]', distBg: 'bg-[#FFC107]/20 text-[#6b4500]' },
  ];

  return (
    <main className="pt-24 pb-32 px-4 md:px-12 max-w-4xl mx-auto" id="main-content" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-[#00543b] focus:text-white focus:top-0 focus:left-0 text-sm font-semibold"
      >
        Skip to main content
      </a>

      <div className="mb-6">
        <h2 className="text-[28px] leading-9 font-bold text-[#1c1b1b]">{t('accessibility.title')}</h2>
        <p className="text-lg text-[#3f4943] mt-1">{t('accessibility.subtitle')}</p>
      </div>

      {/* Toggles Section */}
      <section aria-labelledby="preferences-heading" className="mb-8">
        <h3 className="text-2xl font-semibold text-[#1c1b1b] mb-4" id="preferences-heading">{t('accessibility.preferences')}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {toggles.map((toggle) => (
            <label
              key={toggle.key}
              className="relative flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#bec9c1]/30 cursor-pointer hover:bg-white transition-colors min-h-[64px] group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#f0eded] rounded-lg group-hover:bg-[#0b6e4f]/10 transition-colors">
                  <span className="material-symbols-outlined text-[#1c1b1b]">{toggle.icon}</span>
                </div>
                <span className="text-lg text-[#1c1b1b] font-medium">{toggle.label}</span>
              </div>
              <div className="relative">
                <input
                  id={`toggle-${toggle.key}`}
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings[toggle.key]}
                  onChange={() => onToggle(toggle.key)}
                  aria-label={toggle.label}
                />
                <div className={`block w-14 h-8 rounded-full transition-colors border-2 border-transparent ${
                  settings[toggle.key] ? 'bg-[#00543b]' : 'bg-[#e5e2e1]'
                }`} />
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform shadow-sm ${
                  settings[toggle.key] ? 'translate-x-6' : ''
                }`} />
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Nearest Accessible Facilities */}
      <section aria-labelledby="facilities-heading">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-[#1c1b1b]" id="facilities-heading">
            {t('accessibility.nearestFacilities')}
          </h3>
          <button className="text-sm font-semibold text-[#00543b] hover:underline p-2 -mr-2 focus:outline-none focus:ring-2 focus:ring-[#00543b] rounded">
            {t('accessibility.refresh')}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {facilities.map((facility, i) => (
            <div
              key={i}
              className="bg-[#F8F9FA] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#bec9c1]/30 flex items-center justify-between min-h-[80px]"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${facility.color.split(' ')[0]} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined text-[28px] ${facility.color.split(' ')[1]}`}>{facility.icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1c1b1b] mb-1">{facility.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full ${facility.distBg} text-xs font-medium`}>
                      <span className="material-symbols-outlined text-[14px] mr-1">location_on</span>
                      {facility.distance}
                    </span>
                    <span className="text-xs text-[#3f4943]">{t('accessibility.level', { number: facility.level })}</span>
                  </div>
                </div>
              </div>
              <button
                aria-label={`${t('accessibility.getDirections')} ${facility.name}`}
                className="min-w-[44px] min-h-[44px] w-11 h-11 bg-[#00543b] text-white rounded-full flex items-center justify-center hover:bg-[#056c4d] transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066CC]"
              >
                <span className="material-symbols-outlined">directions</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
