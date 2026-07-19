import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { AppView, type AccessibilitySettings } from '../types';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  accessibilitySettings: AccessibilitySettings;
  setAccessibilitySettings: (settings: AccessibilitySettings) => void;
  toggleAccessibilitySetting: (key: keyof AccessibilitySettings) => void;
  selectedStadium: string;
  setSelectedStadium: (stadium: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

const defaultAccessibilitySettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  wheelchairRouting: false,
  screenReaderOptimized: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>(AppView.ONBOARDING);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(defaultAccessibilitySettings);
  const [selectedStadium, setSelectedStadium] = useState<string>('azteca');
  const [selectedRole, setSelectedRole] = useState<string>('fan');

  const toggleAccessibilitySetting = useCallback((key: keyof AccessibilitySettings) => {
    setAccessibilitySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const value = {
    currentView,
    setCurrentView,
    accessibilitySettings,
    setAccessibilitySettings,
    toggleAccessibilitySetting,
    selectedStadium,
    setSelectedStadium,
    selectedRole,
    setSelectedRole,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
