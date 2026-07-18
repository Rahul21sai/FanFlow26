/**
 * @fileoverview Shared layout components: AppHeader and BottomNav.
 * These persist across all views and match the Stitch design system.
 */

import { useTranslation } from 'react-i18next';
import { type AppView } from '../types';

/** Props for the AppHeader component. */
export interface AppHeaderProps {
  /** Callback when menu button is clicked. */
  readonly onMenuClick?: () => void;
  /** Callback when accessibility button is clicked. */
  readonly onAccessibilityClick?: () => void;
}

/**
 * Top app bar with logo, menu, and accessibility buttons.
 * Fixed position, glassmorphism background. Matches Stitch TopAppBar.
 * @param props - Header configuration
 * @returns The rendered header element
 */
export function AppHeader({ onMenuClick, onAccessibilityClick }: AppHeaderProps) {
  return (
    <header
      id="app-header"
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-white/80 backdrop-blur-md shadow-sm"
    >
      <button
        id="btn-menu"
        aria-label="Menu"
        onClick={onMenuClick}
        className="flex items-center justify-center w-11 h-11 hover:bg-[#f0eded] transition-colors rounded-full active:scale-95"
      >
        <span className="material-symbols-outlined text-[#00543b] text-2xl">menu</span>
      </button>
      <h1 className="font-bold text-2xl tracking-tight text-[#00543b]" style={{ fontFamily: 'Inter' }}>
        FanFlow26
      </h1>
      <button
        id="btn-accessibility"
        aria-label="Accessibility Settings"
        onClick={onAccessibilityClick}
        className="flex items-center justify-center w-11 h-11 hover:bg-[#f0eded] transition-colors rounded-full active:scale-95"
      >
        <span className="material-symbols-outlined text-[#00543b] text-2xl">accessibility_new</span>
      </button>
    </header>
  );
}

/** Props for the BottomNav component. */
export interface BottomNavProps {
  /** Currently active navigation tab. */
  readonly activeView: AppView;
  /** Callback when a nav tab is selected. */
  readonly onNavigate: (view: AppView) => void;
}

/** Configuration for a single navigation item. */
interface NavItem {
  readonly view: AppView;
  readonly icon: string;
  readonly labelKey: string;
}

/** Navigation items matching the Stitch bottom bar. */
const NAV_ITEMS: readonly NavItem[] = [
  { view: 'DASHBOARD' as AppView, icon: 'home', labelKey: 'nav.home' },
  { view: 'MAP' as AppView, icon: 'map', labelKey: 'nav.map' },
  { view: 'ASSISTANT' as AppView, icon: 'chat_bubble', labelKey: 'nav.assistant' },
  { view: 'OPS' as AppView, icon: 'admin_panel_settings', labelKey: 'nav.ops' },
  { view: 'PROFILE' as AppView, icon: 'person', labelKey: 'nav.profile' },
];

/**
 * Mobile bottom navigation bar with 5 tabs.
 * Active tab shows primary-container background with filled icon.
 * Matches Stitch BottomNavBar component.
 * @param props - Navigation state and callbacks
 * @returns The rendered bottom navigation
 */
export function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  const { t } = useTranslation();

  return (
    <nav
      id="bottom-nav"
      className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 h-20 bg-white/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
      role="navigation"
      aria-label="Main Navigation"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeView === item.view;
        return (
          <button
            key={item.view}
            id={`nav-${item.view.toLowerCase()}`}
            onClick={() => onNavigate(item.view)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center px-3 py-1.5 min-w-[64px] min-h-[44px] transition-all duration-200 active:scale-90 rounded-xl ${
              isActive
                ? 'bg-[#0b6e4f] text-[#98edc6]'
                : 'text-[#3f4943] hover:bg-[#eae7e7]'
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className={`text-xs mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
              {t(item.labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
