import React, { useState } from 'react';

interface BroadcastAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (message: string, sector: string, urgency: string) => void;
}

export const BroadcastAlertModal: React.FC<BroadcastAlertModalProps> = ({
  isOpen,
  onClose,
  onBroadcast,
}) => {
  const [sector, setSector] = useState('All 12 Wards - Priority Wide Call');
  const [urgency, setUrgency] = useState<'Standard' | 'High Priority' | 'Code RED'>('High Priority');
  const [message, setMessage] = useState(
    'Attention City Operators: Severe weather front approaching Metro Central. Field squads alert for storm drain surcharges and downed electrical limbs.'
  );

  if (!isOpen) return null;

  const handleTransmit = () => {
    onBroadcast(message, sector, urgency);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-space-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-surface-container-high">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined">campaign</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                Citywide Broadcast Alert System
              </h3>
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                Encrypted Emergency Dispatch Transmission
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Sector Selection */}
        <div className="flex flex-col gap-1">
          <label className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold">
            Target Broadcast Sector
          </label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="h-9 px-space-sm bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/30 outline-none focus:ring-1 focus:ring-secondary cursor-pointer"
          >
            <option>All 12 Wards - Priority Wide Call</option>
            <option>Ward 4 & 7 - Industrial Hydrology Corridor</option>
            <option>Ward 1 & 2 - Downtown Metro Grid</option>
            <option>Ward 8 & 9 - Valley Express Transit</option>
            <option>Sanitation District - All Route Haulers</option>
          </select>
        </div>

        {/* Urgency */}
        <div className="flex flex-col gap-1">
          <label className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold">
            Urgency Level
          </label>
          <div className="grid grid-cols-3 gap-space-xs">
            {(['Standard', 'High Priority', 'Code RED'] as const).map((lvl) => (
              <label
                key={lvl}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-colors ${
                  urgency === lvl
                    ? lvl === 'Code RED'
                      ? 'bg-error-container/60 border-error text-error font-bold'
                      : 'bg-surface-container border-secondary text-secondary font-bold'
                    : 'bg-surface-container-low border-transparent text-on-surface'
                }`}
              >
                <input
                  type="radio"
                  name="urgency_radio"
                  checked={urgency === lvl}
                  onChange={() => setUrgency(lvl)}
                  className="accent-secondary"
                />
                <span className="font-label-mono-xs text-label-mono-xs">{lvl}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1">
          <label className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold">
            Broadcast Audio Synthesizer / Text Dispatch
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="p-space-sm bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/30 outline-none focus:ring-1 focus:ring-secondary resize-none"
            placeholder="Enter broadcast instructions for field squads and station monitors..."
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-space-sm border-t border-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
              42 Transponders Active
            </span>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTransmit}
              className="h-8 px-space-md bg-error text-on-error font-body-sm text-body-sm font-semibold rounded-lg flex items-center gap-1 shadow-sm hover:bg-error/90 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">podcasts</span>
              <span>Transmit City Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
