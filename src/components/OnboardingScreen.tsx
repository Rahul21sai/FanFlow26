/**
 * @fileoverview Onboarding screen with language picker and auth options.
 * Matches the Stitch "Onboarding & Language Picker" screen design.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants';

/** Props for the OnboardingScreen component. */
export interface OnboardingScreenProps {
  /** Callback when user selects "Continue as Guest". */
  readonly onContinueAsGuest: () => void;
  /** Callback when user selects "Sign In". */
  readonly onSignIn: () => void;
}

/**
 * Onboarding screen with hero image, language selection, and auth buttons.
 * Users pick their preferred language and choose guest or authenticated access.
 * @param props - Onboarding callbacks
 * @returns The rendered onboarding screen
 */
export function OnboardingScreen({ onContinueAsGuest, onSignIn }: OnboardingScreenProps) {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || 'en'
  );

  const handleLanguageSelect = (code: SupportedLanguage) => {
    setSelectedLang(code);
    i18n.changeLanguage(code);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero Section */}
      <div className="relative w-full h-[353px] md:h-[442px] overflow-hidden flex-shrink-0 bg-[#f6f3f2] rounded-b-[2.5rem] shadow-sm">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-multiply"
          style={{
            backgroundImage: `linear-gradient(135deg, #00543b 0%, #0b6e4f 30%, #056c4d 50%, #feae2c 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f8] via-[#fcf9f8]/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 text-center z-10 mt-8">
          <h1 className="text-5xl font-bold text-[#00543b] tracking-tight mb-1">FanFlow26</h1>
          <p className="text-lg text-[#3f4943] max-w-sm">Your smart stadium companion</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-4 md:px-12 -mt-8 z-20 w-full max-w-2xl mx-auto pb-8">
        {/* Language Selection Card */}
        <div className="glass-panel w-full rounded-3xl p-4 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-6"
          style={{
            background: 'rgba(248, 249, 250, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(229, 231, 235, 0.5)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#00543b]" style={{ fontVariationSettings: "'FILL' 1" }}>language</span>
            <h2 className="text-2xl font-semibold text-[#1c1b1b]">Select Language</h2>
          </div>
          <div className="space-y-2 max-h-[309px] overflow-y-auto pr-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  id={`lang-${lang.code}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all min-h-[56px] focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2 ${
                    isSelected
                      ? 'border-2 border-[#00543b] bg-[#0b6e4f]/10'
                      : 'border border-[#bec9c1] bg-[#F8F9FA] hover:bg-[#f0eded]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center gap-4">
                    <span aria-hidden="true" className="text-2xl">{lang.flag}</span>
                    <span className="text-sm font-semibold text-[#1c1b1b]">{lang.nativeName}</span>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[#00543b]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4 mt-auto pt-4">
          <button
            id="btn-continue-guest"
            onClick={onContinueAsGuest}
            className="w-full bg-[#00543b] text-white font-semibold text-sm rounded-2xl py-4 px-6 min-h-[56px] flex items-center justify-center gap-2 hover:bg-[#00543b]/90 active:scale-[0.98] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2"
          >
            <span>Continue as Guest</span>
            <span className="material-symbols-outlined text-white">arrow_forward</span>
          </button>
          <button
            id="btn-sign-in"
            onClick={onSignIn}
            className="w-full bg-[#F8F9FA] text-[#00543b] border border-[#bec9c1] font-semibold text-sm rounded-2xl py-4 px-6 min-h-[56px] flex items-center justify-center gap-2 hover:bg-[#f0eded] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2"
          >
            Sign in
          </button>
        </div>
      </main>
    </div>
  );
}
