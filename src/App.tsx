/**
 * @fileoverview Main application component with routing and state management.
 * Provides context for auth, crowd data, and accessibility settings.
 */

import { useState, useCallback } from 'react';
import { AppView, type AccessibilitySettings } from './types';
import { useGemini, useCrowdData, useRouting } from './hooks';
import {
  AppHeader,
  BottomNav,
  OnboardingScreen,
  FanDashboard,
  StadiumMap,
  ChatAssistant,
  OpsDashboard,
  AccessibilitySettingsScreen,
} from './components';

/**
 * Root application component that manages navigation, state, and view rendering.
 * Uses a simple view-based navigation instead of react-router for simplicity
 * while maintaining clean separation of concerns.
 * @returns The rendered application
 */
function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.ONBOARDING);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    wheelchairRouting: false,
    screenReaderOptimized: false,
  });

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
  }, []);

  const handleContinueAsGuest = useCallback(() => {
    setCurrentView(AppView.DASHBOARD);
  }, []);

  const handleSignIn = useCallback(() => {
    // In production, this would show a sign-in modal
    setCurrentView(AppView.DASHBOARD);
  }, []);

  const handleAccessibilityToggle = useCallback((key: keyof AccessibilitySettings) => {
    setAccessibilitySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

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
    'min-h-screen bg-[#fcf9f8]',
    accessibilitySettings.highContrast ? 'contrast-high' : '',
    accessibilitySettings.largeText ? 'text-lg' : '',
  ].join(' ');

  // Onboarding has no header/nav
  if (currentView === AppView.ONBOARDING) {
    return (
      <div className={appClasses} style={{ fontFamily: 'Inter, sans-serif' }}>
        <OnboardingScreen
          onContinueAsGuest={handleContinueAsGuest}
          onSignIn={handleSignIn}
        />
      </div>
    );
  }

  return (
    <div className={appClasses} style={{ fontFamily: 'Inter, sans-serif' }}>
      <AppHeader
        onMenuClick={() => setCurrentView(AppView.DASHBOARD)}
        onAccessibilityClick={() => setCurrentView(AppView.ACCESSIBILITY)}
      />

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
          onToggle={handleAccessibilityToggle}
        />
      )}

      {currentView === AppView.PROFILE && (
        <div className="pt-20 pb-24 px-4 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#00543b] to-[#0b6e4f] flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
            G
          </div>
          <h2 className="text-2xl font-bold text-[#1c1b1b]">Guest Fan</h2>
          <p className="text-base text-[#3f4943] mt-1">FIFA World Cup 2026 attendee</p>
        </div>
      )}

      <BottomNav activeView={currentView} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
