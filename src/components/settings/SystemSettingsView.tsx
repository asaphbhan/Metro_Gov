import React, { useState } from 'react';

interface SystemSettingsViewProps {
  onShowToast: (message: string) => void;
  selectedZone: string;
  onChangeZone: (zone: string) => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({
  onShowToast,
  selectedZone,
  onChangeZone,
}) => {
  const [autoSyncInterval, setAutoSyncInterval] = useState('30');
  const [criticalSlaMinutes, setCriticalSlaMinutes] = useState('60');
  const [highSlaMinutes, setHighSlaMinutes] = useState('180');
  const [acousticSensitivity, setAcousticSensitivity] = useState('94');
  const [smsCitizenVerification, setSmsCitizenVerification] = useState(true);
  const [aiTriageAutoAssign, setAiTriageAutoAssign] = useState(true);
  const [radioEncryption, setRadioEncryption] = useState('AES-256-GCM');

  const handleSaveSettings = () => {
    onShowToast('System settings and CAD telemetry thresholds updated successfully.');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Header */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-surface-container-high/30 flex items-center justify-between">
        <div className="flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-xl">tune</span>
          </div>
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-mono-xs text-label-mono-xs text-secondary uppercase font-semibold">
                Node Configuration
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                MetroGov OS 4.8
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              System Settings & Mission Control Parameters
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="h-8 px-space-md bg-secondary text-on-secondary rounded-lg font-body-sm text-body-sm font-semibold hover:bg-secondary/90 transition-colors shadow-xs cursor-pointer"
        >
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        {/* Panel 1: Jurisdiction & Cad integration */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-surface-container-high/30 flex flex-col gap-space-md">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-container">
            <span className="material-symbols-outlined text-secondary text-base">domain</span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
              Jurisdiction & Telemetry Binding
            </h3>
          </div>

          <div className="space-y-space-sm font-body-sm text-body-sm">
            <div>
              <label className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold block mb-1">
                Active Operational Zone
              </label>
              <select
                value={selectedZone}
                onChange={(e) => onChangeZone(e.target.value)}
                className="w-full h-9 px-space-sm bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/30 outline-none focus:ring-1 focus:ring-secondary cursor-pointer"
              >
                <option value="Metro Central - Zone 01">Metro Central - Zone 01 (Wards 1-12)</option>
                <option value="North Commercial - Zone 02">North Commercial - Zone 02</option>
                <option value="Highgate West - Zone 03">Highgate West - Zone 03</option>
                <option value="South Transit Hub - Zone 04">South Transit Hub - Zone 04</option>
                <option value="Tech Corridor - Zone 05">Tech Corridor - Zone 05</option>
              </select>
            </div>

            <div>
              <label className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold block mb-1">
                Live Telemetry Auto-Sync Polling Interval
              </label>
              <div className="flex items-center gap-space-xs">
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={autoSyncInterval}
                  onChange={(e) => setAutoSyncInterval(e.target.value)}
                  className="w-28 h-9 px-space-sm bg-surface-container-low rounded-lg text-on-surface border border-outline-variant/30 outline-none"
                />
                <span className="text-on-surface-variant font-label-mono-xs text-label-mono-xs">
                  Seconds (Default: 30s)
                </span>
              </div>
            </div>

            <div>
              <label className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold block mb-1">
                Field Radio Encryption Standard
              </label>
              <input
                type="text"
                value={radioEncryption}
                onChange={(e) => setRadioEncryption(e.target.value)}
                className="w-full h-9 px-space-sm bg-surface-container-low rounded-lg text-on-surface border border-outline-variant/30 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Panel 2: SLA & AI Automation Rules */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-surface-container-high/30 flex flex-col gap-space-md">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-container">
            <span className="material-symbols-outlined text-secondary text-base">timer</span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
              SLA Thresholds & AI Automation
            </h3>
          </div>

          <div className="space-y-space-sm font-body-sm text-body-sm">
            <div className="grid grid-cols-2 gap-space-sm">
              <div>
                <label className="font-label-mono-xs text-label-mono-xs uppercase text-error font-semibold block mb-1">
                  Critical SLA Target (Mins)
                </label>
                <input
                  type="number"
                  value={criticalSlaMinutes}
                  onChange={(e) => setCriticalSlaMinutes(e.target.value)}
                  className="w-full h-9 px-space-sm bg-surface-container-low rounded-lg text-on-surface border border-outline-variant/30 outline-none"
                />
              </div>
              <div>
                <label className="font-label-mono-xs text-label-mono-xs uppercase text-secondary font-semibold block mb-1">
                  High Priority SLA Target (Mins)
                </label>
                <input
                  type="number"
                  value={highSlaMinutes}
                  onChange={(e) => setHighSlaMinutes(e.target.value)}
                  className="w-full h-9 px-space-sm bg-surface-container-low rounded-lg text-on-surface border border-outline-variant/30 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold block mb-1">
                IoT Acoustic Sensor Node Sensitivity ({acousticSensitivity}%)
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={acousticSensitivity}
                onChange={(e) => setAcousticSensitivity(e.target.value)}
                className="w-full accent-secondary"
              />
            </div>

            <div className="pt-space-xs space-y-2">
              <label className="flex items-center justify-between p-2 rounded bg-surface-container-low cursor-pointer">
                <div>
                  <span className="font-semibold text-on-surface block">Automatic AI Ticket Triage</span>
                  <span className="text-on-surface-variant text-xs">
                    Assign incoming 911 telemetry to closest verified vehicle
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={aiTriageAutoAssign}
                  onChange={(e) => setAiTriageAutoAssign(e.target.checked)}
                  className="w-4 h-4 accent-secondary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-surface-container-low cursor-pointer">
                <div>
                  <span className="font-semibold text-on-surface block">Citizen SMS Verification Loop</span>
                  <span className="text-on-surface-variant text-xs">
                    Dispatch automated verification text when crew marks ticket resolved
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsCitizenVerification}
                  onChange={(e) => setSmsCitizenVerification(e.target.checked)}
                  className="w-4 h-4 accent-secondary cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
