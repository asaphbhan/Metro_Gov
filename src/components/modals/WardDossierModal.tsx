import React from 'react';
import { WardData } from '../../types';

interface WardDossierModalProps {
  ward: WardData | null;
  isOpen: boolean;
  onClose: () => void;
  onIntervene?: (wardCode: string) => void;
}

export const WardDossierModal: React.FC<WardDossierModalProps> = ({
  ward,
  isOpen,
  onClose,
  onIntervene,
}) => {
  if (!isOpen || !ward) return null;

  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-space-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest max-w-2xl w-full rounded-xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-surface-container-high">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-container pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary font-headline-md font-bold">
              {ward.code.replace('Ward ', 'W')}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                  {ward.name}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded font-label-mono-xs text-label-mono-xs font-bold uppercase ${
                    ward.density === 'Critical'
                      ? 'bg-error-container text-error'
                      : ward.density === 'High'
                      ? 'bg-surface-container text-on-surface'
                      : 'bg-surface-container-low text-secondary'
                  }`}
                >
                  {ward.density} DENSITY
                </span>
              </div>
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                Officer in Charge: {ward.councilor}
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

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm font-label-mono-xs text-label-mono-xs">
          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
            <span className="text-on-surface-variant uppercase">Active Complaints</span>
            <span className="font-data-metric-md text-data-metric-md text-on-surface font-bold mt-1">
              {ward.activeComplaints}
            </span>
          </div>
          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
            <span className="text-on-surface-variant uppercase">Velocity Rank</span>
            <span className="font-data-metric-md text-data-metric-md text-secondary font-bold mt-1">
              #{ward.velocityRank} of 12
            </span>
          </div>
          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
            <span className="text-on-surface-variant uppercase">Mean TTR (Hours)</span>
            <span className="font-data-metric-md text-data-metric-md text-on-surface font-bold mt-1">
              {ward.avgTtrHours}h
            </span>
          </div>
          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
            <span className="text-on-surface-variant uppercase">SLA Compliance</span>
            <span
              className={`font-data-metric-md text-data-metric-md font-bold mt-1 ${
                ward.slaCompliance >= 90 ? 'text-secondary' : 'text-error'
              }`}
            >
              {ward.slaCompliance}%
            </span>
          </div>
        </div>

        {/* Diagnostic Breakdown */}
        <div className="p-space-sm rounded-lg bg-surface-container space-y-2">
          <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-bold block">
            Sub-District Diagnostic Notes
          </span>
          <p className="font-body-sm text-body-sm text-on-surface">
            Historical incident telemetry indicates high volume clustering near transit interchanges and aging hydrology mains. Field engineer reports recommend focused pavement rehabilitation and proactive storm drain sediment desilting.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-space-sm border-t border-surface-container">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-8 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-body-sm text-body-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Print Dossier Brief</span>
          </button>
          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-body-sm text-body-sm font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            {ward.slaCompliance < 90 && (
              <button
                type="button"
                onClick={() => {
                  onIntervene?.(ward.code);
                  onClose();
                }}
                className="h-8 px-space-md bg-error text-on-error rounded-lg font-body-sm text-body-sm font-semibold flex items-center gap-1 hover:bg-error/90 shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">campaign</span>
                <span>Dispatch Emergency Taskforce</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
