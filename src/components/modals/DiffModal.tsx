import React from 'react';

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiffModal: React.FC<DiffModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-space-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest max-w-3xl w-full rounded-xl shadow-2xl overflow-hidden flex flex-col border border-surface-container-high">
        {/* Header */}
        <div className="p-space-lg bg-surface-container-low flex items-center justify-between border-b border-surface-container">
          <div>
            <span className="font-label-mono-xs text-label-mono-xs text-secondary uppercase font-semibold">
              ESE Prompt Engineering Audit Tool
            </span>
            <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Prompt Evolution & Semantic Diff Visualizer
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Diff Content */}
        <div className="p-space-lg space-y-space-md max-h-[540px] overflow-y-auto">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Visualizing step-change iterations between initial naive generation prompts and the final ESE production prompts across Phase 1 to Phase 4.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm font-label-mono-xs text-label-mono-xs">
            <div className="bg-error-container/30 p-space-sm rounded-lg border-l-2 border-error">
              <span className="text-error font-bold block mb-1">[-] Phase 2 Baseline (Naive)</span>
              <span className="text-on-surface-variant block">
                "Create a dashboard table for municipal tickets with search and filters."
              </span>
              <span className="text-error font-semibold mt-2 block">
                Issues: Unspecified color systems, generic layout without telemetry tokens, missing keyboard accessibility, arbitrary spacing.
              </span>
            </div>
            <div className="bg-surface-container p-space-sm rounded-lg border-l-2 border-secondary">
              <span className="text-secondary font-bold block mb-1">[+] Phase 2 Hardened (ESE Spec)</span>
              <span className="text-on-surface block">
                "Using Tailwind tokens and React 18, generate Incident Operations table with sticky column anchors, severity-coded pips (WCAG AAA), and contextual flyout drawer."
              </span>
              <span className="text-secondary font-semibold mt-2 block">
                Gains: Deterministic design tokens, zero arbitrary styles, exact institutional aesthetics, tabular alignment, responsive drawer.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm font-label-mono-xs text-label-mono-xs">
            <div className="bg-error-container/30 p-space-sm rounded-lg border-l-2 border-error">
              <span className="text-error font-bold block mb-1">[-] Phase 3 Baseline (Naive)</span>
              <span className="text-on-surface-variant block">
                "Add some charts to show complaints by department."
              </span>
              <span className="text-error font-semibold mt-2 block">
                Issues: Static mock SVG with hardcoded values; zero filtering sync with the table grid.
              </span>
            </div>
            <div className="bg-surface-container p-space-sm rounded-lg border-l-2 border-secondary">
              <span className="text-secondary font-bold block mb-1">[+] Phase 3 Hardened (ESE Spec)</span>
              <span className="text-on-surface block">
                "Integrate dynamic smart-city incident volume analytics into the interface with SVG/Recharts equivalents, Donut resolution SLA gauge, and bi-directional filter linking."
              </span>
              <span className="text-secondary font-semibold mt-2 block">
                Gains: Real-time dynamic recalculations upon filter selection, interactive SLA status gauge, JetBrains Mono telemetry figures.
              </span>
            </div>
          </div>

          <div className="bg-surface-container-low p-space-sm rounded-lg font-label-mono-xs text-label-mono-xs text-on-surface">
            <span className="text-on-surface-variant uppercase font-semibold block mb-1">
              Diff Summary Metrics
            </span>
            <div className="grid grid-cols-3 gap-space-xs text-center">
              <div className="bg-surface-container-lowest p-2 rounded-lg">
                <span className="text-on-surface-variant block">Lexical Specificity</span>
                <span className="font-semibold text-secondary text-body-sm">+240%</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg">
                <span className="text-on-surface-variant block">Token Compliance</span>
                <span className="font-semibold text-secondary text-body-sm">100% Valid</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg">
                <span className="text-on-surface-variant block">Hallucination Rate</span>
                <span className="font-semibold text-secondary text-body-sm">0.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-space-md bg-surface-container-low flex justify-end border-t border-surface-container">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-space-md bg-secondary text-on-secondary rounded-lg font-body-sm text-body-sm font-semibold hover:bg-secondary/90 transition-colors cursor-pointer"
          >
            Close Visualizer
          </button>
        </div>
      </div>
    </div>
  );
};
