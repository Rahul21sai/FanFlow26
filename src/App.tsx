/**
 * @fileoverview Main application component with routing and state management.
 * Provides context for auth, crowd data, and accessibility settings.
 */

import React, { useState, useCallback, Suspense } from 'react';
import { AppView } from './types';
import { useGemini, useCrowdData, useRouting } from './hooks';
import { AppHeader, BottomNav } from './components';
import { useAppContext } from './context/AppContext';
import { useTranslation } from 'react-i18next';

// Lazy loaded components for better efficiency
const OnboardingScreen = React.lazy(() => import('./components').then(m => ({ default: m.OnboardingScreen })));
const FanDashboard = React.lazy(() => import('./components').then(m => ({ default: m.FanDashboard })));
const StadiumMap = React.lazy(() => import('./components').then(m => ({ default: m.StadiumMap })));
const ChatAssistant = React.lazy(() => import('./components').then(m => ({ default: m.ChatAssistant })));
const OpsDashboard = React.lazy(() => import('./components').then(m => ({ default: m.OpsDashboard })));
const AccessibilitySettingsScreen = React.lazy(() => import('./components').then(m => ({ default: m.AccessibilitySettingsScreen })));

// Loading fallback
const LoadingSpinner = () => (
  <div className="flex-grow flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00543b]"></div>
  </div>
);

/**
 * Root application component that manages navigation, state, and view rendering.
 * Uses a simple view-based navigation instead of react-router for simplicity
 * while maintaining clean separation of concerns.
 * @returns The rendered application
 */
function App() {
  const { currentView, setCurrentView, accessibilitySettings, toggleAccessibilitySetting } = useAppContext();
  const { i18n } = useTranslation();

  // Custom hooks
  const { crowdData } = useCrowdData();
  const { messages, isLoading, error, sendMessage } = useGemini('en');
  const { activeRoute, calculateRoute, findNearest, clearRoute } = useRouting(
    crowdData,
    accessibilitySettings.wheelchairRouting
  );

  // State for map zone selection
  const [selectedFromZone, setSelectedFromZone] = useState<string | null>(null);

  const handleNavigate = useCallback((view: AppView) => {
    setCurrentView(view);
  }, [setCurrentView]);

  const handleContinueAsGuest = useCallback(() => {
    setCurrentView(AppView.DASHBOARD);
  }, [setCurrentView]);

  const handleSignIn = useCallback(() => {
    // In production, this would show a sign-in modal
    setCurrentView(AppView.DASHBOARD);
  }, [setCurrentView]);

  const handleZoneClick = useCallback((zoneId: string) => {
    if (!selectedFromZone) {
      setSelectedFromZone(zoneId);
    } else {
      calculateRoute(selectedFromZone, zoneId);
      setSelectedFromZone(null);
    }
  }, [selectedFromZone, calculateRoute]);

  const handleFindFacility = useCallback((type: string) => {
    // Default starting zone; in production, would use user's current location
    findNearest(selectedFromZone ?? 'gate-a', type);
  }, [selectedFromZone, findNearest]);

  // Apply accessibility classes
  const appClasses = [
    'min-h-screen bg-[#fcf9f8] flex flex-col',
    accessibilitySettings.highContrast ? 'contrast-high' : '',
    accessibilitySettings.largeText ? 'text-lg' : '',
  ].join(' ');

  // Onboarding has no header/nav
  if (currentView === AppView.ONBOARDING) {
    return (
      <div className={appClasses} style={{ fontFamily: 'Inter, sans-serif' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <OnboardingScreen
            onContinueAsGuest={handleContinueAsGuest}
            onSignIn={handleSignIn}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div className={appClasses} style={{ fontFamily: 'Inter, sans-serif' }}>
      <AppHeader
        onMenuClick={() => setCurrentView(AppView.DASHBOARD)}
        onAccessibilityClick={() => setCurrentView(AppView.ACCESSIBILITY)}
      />

      <Suspense fallback={<LoadingSpinner />}>
        {currentView === AppView.DASHBOARD && (
          <FanDashboard
            crowdData={crowdData}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === AppView.MAP && (
          <StadiumMap
            crowdData={crowdData}
            activeRoute={activeRoute}
            onZoneClick={handleZoneClick}
            onFindFacility={handleFindFacility}
            onEndRoute={clearRoute}
          />
        )}

        {currentView === AppView.ASSISTANT && (
          <ChatAssistant
            messages={messages}
            isLoading={isLoading}
            error={error}
            onSendMessage={sendMessage}
          />
        )}

        {currentView === AppView.OPS && (
          <OpsDashboard crowdData={crowdData} />
        )}

        {currentView === AppView.ACCESSIBILITY && (
          <AccessibilitySettingsScreen
            settings={accessibilitySettings}
            onToggle={toggleAccessibilitySetting}
          />
        )}

        {currentView === AppView.PROFILE && (
          <main className="flex-grow pt-20 pb-24 px-4 md:px-12 max-w-2xl mx-auto w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#00543b] to-[#0b6e4f] flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                G
              </div>
              <h2 className="text-2xl font-bold text-[#1c1b1b]">Guest Fan</h2>
              <p className="text-base text-[#3f4943] mt-1">FIFA World Cup 2026 attendee</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setCurrentView(AppView.ACCESSIBILITY)}
                className="w-full flex items-center gap-4 p-4 bg-[#F8F9FA] rounded-xl border border-[#bec9c1]/30 shadow-sm hover:bg-white transition-colors text-left min-h-[56px]"
              >
                <span className="material-symbols-outlined text-[#00543b]">accessibility_new</span>
                <span className="text-base font-medium text-[#1c1b1b]">Accessibility Settings</span>
                <span className="material-symbols-outlined text-[#6f7a73] ml-auto">chevron_right</span>
              </button>

              <button
                onClick={() => {
                  const langs = ['en', 'es', 'fr', 'ar', 'hi', 'pt'];
                  const currentIndex = langs.indexOf(i18n.language) || 0;
                  const nextLang = langs[(currentIndex + 1) % langs.length];
                  i18n.changeLanguage(nextLang);
                }}
                className="w-full flex items-center gap-4 p-4 bg-[#F8F9FA] rounded-xl border border-[#bec9c1]/30 shadow-sm hover:bg-white transition-colors text-left min-h-[56px]"
              >
                <span className="material-symbols-outlined text-[#00543b]">language</span>
                <span className="text-base font-medium text-[#1c1b1b]">Change Language ({i18n.language.toUpperCase()})</span>
                <span className="material-symbols-outlined text-[#6f7a73] ml-auto">swap_horiz</span>
              </button>

              <button
                onClick={() => setCurrentView(AppView.MAP)}
                className="w-full flex items-center gap-4 p-4 bg-[#F8F9FA] rounded-xl border border-[#bec9c1]/30 shadow-sm hover:bg-white transition-colors text-left min-h-[56px]"
              >
                <span className="material-symbols-outlined text-[#00543b]">map</span>
                <span className="text-base font-medium text-[#1c1b1b]">Stadium Map</span>
                <span className="material-symbols-outlined text-[#6f7a73] ml-auto">chevron_right</span>
              </button>

              <button
                onClick={() => setCurrentView(AppView.ONBOARDING)}
                className="w-full flex items-center gap-4 p-4 bg-[#ffdad6] rounded-xl border border-[#ba1a1a]/20 shadow-sm hover:bg-[#ffc8c2] transition-colors text-left min-h-[56px] mt-6"
              >
                <span className="material-symbols-outlined text-[#ba1a1a]">logout</span>
                <span className="text-base font-medium text-[#ba1a1a]">Sign Out</span>
              </button>
            </div>
          </main>
        )}
      </Suspense>

      <BottomNav activeView={currentView} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
