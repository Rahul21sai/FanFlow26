/**
 * @fileoverview Shared layout components: AppHeader and BottomNav.
 * These persist across all views and match the Stitch design system.
 */

import { useTranslation } from 'react-i18next';
import { type AppView } from '../types';
import { useAppContext } from '../context/AppContext';

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
  const { selectedStadium, setSelectedStadium, selectedRole, setSelectedRole } = useAppContext();
  const { i18n } = useTranslation();

  return (
    <header
      id="app-header"
      className="fixed top-0 left-0 w-full z-50 flex flex-wrap gap-y-2 justify-between items-center px-4 py-2 min-h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-[#bec9c1]/20"
    >
      <div className="flex items-center gap-2">
        <button
          id="btn-menu"
          aria-label="Menu"
          onClick={onMenuClick}
          className="flex items-center justify-center w-10 h-10 hover:bg-[#f0eded] transition-colors rounded-full active:scale-95"
        >
          <span className="material-symbols-outlined text-[#00543b] text-2xl">menu</span>
        </button>
        <h1 className="font-bold text-xl tracking-tight text-[#00543b]" style={{ fontFamily: 'Inter' }}>
          FanFlow26
        </h1>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Stadium Selector */}
        <select
          id="global-stadium"
          aria-label="Select Stadium"
          value={selectedStadium}
          onChange={(e) => setSelectedStadium(e.target.value)}
          className="bg-[#f0eded] text-sm text-[#1c1b1b] font-medium py-1.5 px-3 rounded-lg border-none outline-none focus:ring-2 focus:ring-[#00543b] h-9"
        >
          <option value="azteca">Estadio Azteca</option>
          <option value="metlife">MetLife Stadium</option>
          <option value="sofi">SoFi Stadium</option>
          <option value="bc_place">BC Place</option>
          <option value="att">AT&T Stadium</option>
        </select>

        {/* Role Selector */}
        <select
          id="global-role"
          aria-label="Select Role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-[#f0eded] text-sm text-[#1c1b1b] font-medium py-1.5 px-3 rounded-lg border-none outline-none focus:ring-2 focus:ring-[#00543b] h-9"
        >
          <option value="fan">Fan</option>
          <option value="volunteer">Volunteer</option>
          <option value="operations">Operations</option>
        </select>

        {/* Language Selector */}
        <select
          id="global-language"
          aria-label="Select Language"
          value={i18n.language || 'en'}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="bg-[#f0eded] text-sm text-[#1c1b1b] font-medium py-1.5 px-3 rounded-lg border-none outline-none focus:ring-2 focus:ring-[#00543b] h-9"
        >
          <option value="en">🇬🇧 EN</option>
          <option value="es">🇪🇸 ES</option>
          <option value="fr">🇫🇷 FR</option>
          <option value="pt">🇵🇹 PT</option>
          <option value="ar">🇸🇦 AR</option>
          <option value="hi">🇮🇳 HI</option>
        </select>

        <button
          id="btn-accessibility"
          aria-label="Accessibility Settings"
          onClick={onAccessibilityClick}
          className="flex items-center justify-center w-10 h-10 hover:bg-[#f0eded] transition-colors rounded-full active:scale-95"
        >
          <span className="material-symbols-outlined text-[#00543b] text-2xl">accessibility_new</span>
        </button>
      </div>
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
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 h-20 bg-white/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
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
