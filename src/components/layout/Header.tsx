import React, { useEffect, useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onOpenBroadcastModal: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  searchQuery,
  onOpenBroadcastModal,
  unreadCount = 5,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const yyyy = now.getUTCFullYear();
      const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(now.getUTCDate()).padStart(2, '0');
      const hh = String(now.getUTCHours()).padStart(2, '0');
      const min = String(now.getUTCMinutes()).padStart(2, '0');
      const ss = String(now.getUTCSeconds()).padStart(2, '0');
      setCurrentTime(`${yyyy}-${mm}-${dd} ${hh}:${min}:${ss} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    { id: 1, title: 'Critical Water Main Rupture in Ward 7', time: '12m ago', unread: true },
    { id: 2, title: 'Unit Engine 4B Arrived on Scene at Ward 4', time: '28m ago', unread: true },
    { id: 3, title: '911 Ingest: Gas Odor Check Cleared', time: '45m ago', unread: false },
    { id: 4, title: 'Streetlight Substation Breaker Tripped', time: '1h ago', unread: false },
    { id: 5, title: 'Acoustic Sensor Node #A-14 Alert Logged', time: '2h ago', unread: false },
  ];

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl z-40 flex items-center justify-between px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high/30">
      {/* Left: Global Search & Feeds Status */}
      <div className="flex items-center gap-space-lg flex-1">
        <div className="relative max-w-md w-full">
          <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">
            search
          </span>
          <input
            className="w-full h-8 pl-8 pr-space-md bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary transition-all"
            placeholder="Search active incidents, CAD identifiers, civic tags..."
            type="search"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="hidden xl:flex items-center gap-space-xs px-space-sm py-1 bg-surface-container-low rounded-full">
          <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
          <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant font-medium">
            Feeds: Live Sync
          </span>
        </div>
      </div>

      {/* Right: Operational Clock, Broadcast CTA, Alerts, User Avatar */}
      <div className="flex items-center gap-space-md">
        <div className="hidden md:flex flex-col items-end">
          <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">
            {currentTime || '2025-05-14 14:32:08 UTC'}
          </span>
          <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
            Command Shift Alpha
          </span>
        </div>

        <button
          className="h-8 px-space-md bg-error text-on-error rounded-lg flex items-center gap-space-xs hover:bg-error/90 transition-all shadow-sm active:scale-95 cursor-pointer"
          type="button"
          onClick={onOpenBroadcastModal}
        >
          <span className="material-symbols-outlined text-sm">campaign</span>
          <span className="font-body-sm text-body-sm font-semibold">Broadcast Alert</span>
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-space-xs text-on-surface-variant hover:text-on-surface cursor-pointer rounded-lg hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-error text-on-error rounded-full flex items-center justify-center font-label-mono-xs text-label-mono-xs font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-2xl border border-surface-container-high p-space-sm z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container">
                <span className="font-headline-md text-body-md font-bold text-on-surface">
                  Operational Alerts
                </span>
                <span className="font-label-mono-xs text-label-mono-xs text-secondary font-semibold">
                  5 New
                </span>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                        {n.title}
                      </span>
                    </div>
                    <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-space-sm pl-space-sm border-l border-surface-container-high/40">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="font-body-sm text-body-sm font-semibold text-on-surface">
              Dir. Marcus Vance
            </span>
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
              City Operations
            </span>
          </div>
          <img
            alt="Dir. Marcus Vance Profile"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container-high"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4b1fHaBnbMcCrlWSTyjQKKFikfhyIN73nPkO_8ywWtT7lzAq1cxFUaKvPmutnsDI-j2beFSR13dNjXOKQRSZBfy5tUNjkswQRhOyOFl7cbkDpa6CIsbxGv9Pe2sNbRylFPlJ5904Qws7XJqeEFdgVI0UijU5qmiwKb-XrzHsLYeEM4BFbtDkURskJktBJC4n_DMocJpBt6p0e8-ZGE17g4xTuQOsBMaAfeSfhqrtPjcL02u0u3DPA"
          />
        </div>
      </div>
    </header>
  );
};
