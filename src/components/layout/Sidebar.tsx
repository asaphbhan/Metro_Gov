import React from 'react';
import { MissionSystemTab } from '../../types';

interface SidebarProps {
  activeTab: MissionSystemTab;
  onSelectTab: (tab: MissionSystemTab) => void;
  selectedZone: string;
  onChangeZone: (zone: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  selectedZone,
  onChangeZone,
}) => {
  const [zoneDropdownOpen, setZoneDropdownOpen] = React.useState(false);

  const zones = [
    'Metro Central - Zone 01',
    'North Commercial - Zone 02',
    'Highgate West - Zone 03',
    'South Transit Hub - Zone 04',
    'Tech Corridor - Zone 05',
  ];

  const navItems = [
    {
      id: 'incident-operations' as MissionSystemTab,
      label: 'Incident Operations',
      icon: 'emergency_home',
    },
    {
      id: 'ward-analytics' as MissionSystemTab,
      label: 'Ward Analytics',
      icon: 'bar_chart_4_bars',
    },
    {
      id: 'live-dispatch-and-field-units' as MissionSystemTab,
      label: 'Live Dispatch & Field Units',
      icon: 'local_police',
    },
    {
      id: 'ai-prompt-engineering-and-ese-spec-workspace' as MissionSystemTab,
      label: 'AI Spec Workspace',
      icon: 'cognition',
    },
    {
      id: 'system-settings' as MissionSystemTab,
      label: 'System Settings',
      icon: 'tune',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none">
      <div className="flex flex-col">
        {/* Brand Lockup */}
        <div className="h-16 px-space-lg flex items-center gap-space-sm bg-surface-container-low border-b border-surface-container-high/30">
          <img
            alt="MetroGov CivicPulse Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJZirAAokKjKBBO6OZfKoxFkmAtyTAnKVKBfEeCHtQFPLB21JopucLbeTNVfAFGCbiChTD7axnAVcvzhogzYW_7WNdFYXIdFA5l3G94n4ytZomZkAU7DaaOlT9GqyDlPwrxVBDR5uN8NALpgjt08mmEm1Tk87HXNMPFtseH7iriz8VH9u0wWc38gt2oDU6N-OEvbXaS3jlbxxcLjAymcDl_lv-iVgy928HLqOLPqnXbkiIPGmJn8Ji"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface truncate">
              CivicPulse
            </span>
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase tracking-wider">
              Metro Operations
            </span>
          </div>
        </div>

        {/* Jurisdiction Selector */}
        <div className="p-space-md relative">
          <button
            type="button"
            onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
            className="w-full bg-surface-container px-space-md py-space-sm rounded-lg flex items-center justify-between text-left hover:bg-surface-container-high transition-colors"
          >
            <div className="flex flex-col min-w-0">
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                Jurisdiction Zone
              </span>
              <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                {selectedZone}
              </span>
            </div>
            <span className="material-symbols-outlined text-secondary text-sm">
              unfold_more
            </span>
          </button>

          {zoneDropdownOpen && (
            <div className="absolute left-space-md right-space-md top-full mt-1 bg-surface-container-lowest rounded-lg shadow-xl border border-surface-container-high py-1 z-30">
              {zones.map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => {
                    onChangeZone(zone);
                    setZoneDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-surface-container-low transition-colors ${
                    zone === selectedZone
                      ? 'text-secondary font-bold bg-surface-container-low'
                      : 'text-on-surface'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section Heading */}
        <div className="px-space-md pt-space-xs">
          <span className="px-space-sm font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant tracking-wider font-semibold">
            Mission Systems
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="mt-space-xs px-space-md flex flex-col gap-space-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {item.icon}
                </span>
                <span className="font-body-md text-body-md truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Node Health Indicator */}
      <div className="p-space-md bg-surface-container-low border-t border-surface-container-high/30">
        <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-lowest shadow-xs">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface font-semibold">
              NODE METRO-01
            </span>
          </div>
          <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
            99.98% SLA
          </span>
        </div>
      </div>
    </aside>
  );
};
