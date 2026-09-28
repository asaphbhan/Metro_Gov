import React, { useState, useMemo } from 'react';
import { WardData } from '../../types';
import { WARDS_LEADERBOARD } from '../../data/mockData';

interface WardAnalyticsViewProps {
  onOpenWardDossier: (ward: WardData) => void;
  onShowToast: (message: string) => void;
}

export const WardAnalyticsView: React.FC<WardAnalyticsViewProps> = ({
  onOpenWardDossier,
  onShowToast,
}) => {
  const [horizon, setHorizon] = useState<'30D' | '90D' | 'YTD'>('90D');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWardMap, setSelectedWardMap] = useState<string>('Ward 04');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const filteredWards = useMemo(() => {
    return WARDS_LEADERBOARD.filter((w) => {
      const term = searchTerm.toLowerCase();
      return (
        w.name.toLowerCase().includes(term) ||
        w.code.toLowerCase().includes(term) ||
        w.councilor.toLowerCase().includes(term)
      );
    });
  }, [searchTerm]);

  const handleRunSimulation = () => {
    setSimulationRunning(true);
    setTimeout(() => {
      setSimulationRunning(false);
      setSimulationResult(
        'FY25-Q3 Optimization Model: Allocating $102,500 will reduce city-wide average TTR from 2.7h to 1.9h and eliminate Ward 04 congestion bottleneck.'
      );
      onShowToast('Municipal simulation complete: Optimal grant distribution computed.');
    }, 900);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Contextual Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-surface-container-high/30">
        <div className="flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-xl">analytics</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-mono-xs text-label-mono-xs text-secondary font-semibold uppercase tracking-wider">
                Telemetry Unit 04
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                Metro District Grid V3.4
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
              Ward Analytics & Inter-Departmental Diagnostic Matrix
            </h2>
          </div>
        </div>

        {/* Live Horizon & Scope Filters */}
        <div className="flex items-center flex-wrap gap-space-xs">
          <div className="flex items-center bg-surface-container-low px-space-sm py-1 rounded-lg">
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant mr-space-xs uppercase">
              Horizon:
            </span>
            <button
              type="button"
              onClick={() => setHorizon('30D')}
              className={`px-space-xs py-0.5 rounded font-label-mono-xs text-label-mono-xs cursor-pointer transition-colors ${
                horizon === '30D'
                  ? 'bg-surface-container-lowest text-secondary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              30D
            </button>
            <button
              type="button"
              onClick={() => setHorizon('90D')}
              className={`px-space-xs py-0.5 rounded font-label-mono-xs text-label-mono-xs cursor-pointer transition-colors ${
                horizon === '90D'
                  ? 'bg-surface-container-lowest text-secondary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              90D QTR
            </button>
            <button
              type="button"
              onClick={() => setHorizon('YTD')}
              className={`px-space-xs py-0.5 rounded font-label-mono-xs text-label-mono-xs cursor-pointer transition-colors ${
                horizon === 'YTD'
                  ? 'bg-surface-container-lowest text-secondary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              YTD
            </button>
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              onClick={() => onShowToast('Showing all 12 Municipal Jurisdictions.')}
              className="h-8 px-space-sm bg-surface-container-low hover:bg-surface-container rounded-lg flex items-center gap-space-xs text-on-surface font-body-sm text-body-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-on-surface-variant">tune</span>
              <span>Wards (1-12)</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="h-8 px-space-md bg-primary-container text-on-primary rounded-lg flex items-center gap-space-xs hover:bg-primary-container/90 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">ios_share</span>
              <span className="font-body-sm text-body-sm font-semibold">Generate Ward Audit Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Telemetry Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden border border-surface-container-high/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
          <div className="flex items-center justify-between">
            <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant tracking-wider">
              Active Civic Tickets
            </span>
            <span className="px-1.5 py-0.5 bg-surface-container-low rounded font-label-mono-xs text-label-mono-xs text-secondary font-semibold">
              +6.4% MoM
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-space-sm">
            <span className="font-data-metric-lg text-data-metric-lg text-on-surface">1,428</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">across 12 wards</span>
          </div>
          <div className="mt-space-sm flex items-center justify-between text-on-surface-variant font-label-mono-xs text-label-mono-xs">
            <span>Cleared Past 24h: 184</span>
            <span className="text-secondary font-semibold">92.4% Intake SLA</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden border border-surface-container-high/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-container" />
          <div className="flex items-center justify-between">
            <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant tracking-wider">
              Composite Resolution Velocity
            </span>
            <span className="px-1.5 py-0.5 bg-surface-container-low rounded font-label-mono-xs text-label-mono-xs text-secondary font-semibold">
              -18m vs target
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-space-sm">
            <span className="font-data-metric-lg text-data-metric-lg text-on-surface">2.7h</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">median dispatch-to-close</span>
          </div>
          <div className="mt-space-sm flex items-center justify-between text-on-surface-variant font-label-mono-xs text-label-mono-xs">
            <span>Ward 04 Outlier: 4.6h</span>
            <span className="text-secondary font-semibold">Fastest: Ward 08 (1.2h)</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden border border-surface-container-high/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-outline-variant" />
          <div className="flex items-center justify-between">
            <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant tracking-wider">
              QTD Maintenance Outlay
            </span>
            <span className="px-1.5 py-0.5 bg-surface-container-low rounded font-label-mono-xs text-label-mono-xs text-on-surface-variant font-semibold">
              84.2% Expended
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-space-sm">
            <span className="font-data-metric-lg text-data-metric-lg text-on-surface">$175.1k</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Allocated: $210k</span>
          </div>
          <div className="mt-space-sm flex items-center justify-between text-on-surface-variant font-label-mono-xs text-label-mono-xs">
            <span>Cost per Ticket: $122.60</span>
            <span className="text-secondary font-semibold">$34.9k Contingency</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden border border-surface-container-high/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-error" />
          <div className="flex items-center justify-between">
            <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant tracking-wider">
              Citizen CSAT & SLA Rating
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-error-container/40 rounded font-label-mono-xs text-label-mono-xs text-error font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
              2 Ward Alerts
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-space-sm">
            <span className="font-data-metric-lg text-data-metric-lg text-on-surface">92.2%</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">SLA Threshold: 90%</span>
          </div>
          <div className="mt-space-sm flex items-center justify-between text-on-surface-variant font-label-mono-xs text-label-mono-xs">
            <span>Sample Size: 12,890 Citizens</span>
            <span className="text-secondary font-semibold">94.1% Verified</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Geospatial Density & Ward Comparison Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md">
        {/* Geospatial Interactive Map Visualizer (7 cols) */}
        <div className="xl:col-span-7 bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between border border-surface-container-high/30">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-mono-sm text-label-mono-sm font-semibold uppercase text-on-surface tracking-wider">
                Jurisdiction Congestion Heatmap (Wards 1 – 12)
              </span>
            </div>
            <div className="flex items-center gap-1 font-label-mono-xs text-label-mono-xs text-on-surface-variant">
              <span className="w-2 h-2 rounded-xs bg-surface-container-high" /> Low
              <span className="w-2 h-2 rounded-xs bg-secondary-fixed-dim" /> Med
              <span className="w-2 h-2 rounded-xs bg-secondary" /> High
              <span className="w-2 h-2 rounded-xs bg-error" /> Critical (Ward 04)
            </div>
          </div>

          {/* Simulated GIS Vector Heatmap Projection */}
          <div className="relative w-full h-80 rounded-lg bg-surface-container-low overflow-hidden flex flex-col justify-between p-space-md border border-surface-container-high/20">
            <svg
              className="absolute inset-0 w-full h-full"
              fill="none"
              viewBox="0 0 700 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Gridlines */}
              <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 4" x1="50" x2="50" y1="0" y2="320" />
              <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 4" x1="175" x2="175" y1="0" y2="320" />
              <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 4" x1="300" x2="300" y1="0" y2="320" />
              <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 4" x1="425" x2="425" y1="0" y2="320" />
              <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 4" x1="550" x2="550" y1="0" y2="320" />

              {/* Ward 01: North Commercial */}
              <polygon
                className="text-secondary-fixed-dim/40 hover:text-secondary/50 transition-colors cursor-pointer"
                fill="currentColor"
                points="60,30 180,25 210,110 90,130"
                onClick={() => setSelectedWardMap('Ward 01')}
              />
              <text className="text-on-surface font-label-mono-xs text-[10px] font-bold" fill="currentColor" x="120" y="80">
                W-01 [28%]
              </text>

              {/* Ward 02: Central Highrise */}
              <polygon
                className="text-secondary-container/45 hover:text-secondary transition-colors cursor-pointer"
                fill="currentColor"
                points="215,30 360,40 340,140 215,115"
                onClick={() => setSelectedWardMap('Ward 02')}
              />
              <text className="text-on-secondary-container font-label-mono-xs text-[11px] font-bold" fill="currentColor" x="250" y="90">
                WARD 02 [MED]
              </text>

              {/* Ward 03: Riverfront Industrial */}
              <polygon
                className="text-surface-container-high/60 hover:text-secondary-fixed-dim transition-colors cursor-pointer"
                fill="currentColor"
                points="365,45 520,35 490,130 345,145"
                onClick={() => setSelectedWardMap('Ward 03')}
              />
              <text className="text-on-surface-variant font-label-mono-xs text-[10px] font-medium" fill="currentColor" x="410" y="85">
                W-03 [12%]
              </text>

              {/* Ward 04: South Transit Hub - CRITICAL HOTSPOT */}
              <polygon
                className="text-error/30 hover:text-error/50 transition-colors cursor-pointer"
                fill="currentColor"
                points="95,135 240,120 280,260 110,270"
                onClick={() => setSelectedWardMap('Ward 04')}
              />
              <circle className="text-error/25 animate-ping" cx="180" cy="190" fill="currentColor" r="32" />
              <circle className="text-error/60" cx="180" cy="190" fill="currentColor" r="16" />
              <text className="text-error font-headline-md text-[13px] font-bold" fill="currentColor" x="135" y="195">
                WARD 04: HIGH
              </text>
              <text className="text-error font-label-mono-xs text-[9px] font-bold" fill="currentColor" x="135" y="210">
                312 CONGESTION TIX
              </text>

              {/* Ward 05: Tech Corridor */}
              <polygon
                className="text-secondary-container/40 hover:text-secondary-container/70 transition-colors cursor-pointer"
                fill="currentColor"
                points="245,125 380,148 400,270 285,265"
                onClick={() => setSelectedWardMap('Ward 05')}
              />
              <text className="text-on-surface font-label-mono-xs text-[10px] font-bold" fill="currentColor" x="300" y="200">
                W-05 [64%]
              </text>

              {/* Ward 08: Greenbelt */}
              <polygon
                className="text-surface-container-high/40 hover:text-secondary/30 transition-colors cursor-pointer"
                fill="currentColor"
                points="565,165 675,165 680,290 565,270"
                onClick={() => setSelectedWardMap('Ward 08')}
              />
              <text className="text-secondary font-label-mono-xs text-[11px] font-bold" fill="currentColor" x="590" y="225">
                WARD 08 [LOW]
              </text>
              <text className="text-on-surface-variant font-label-mono-xs text-[9px]" fill="currentColor" x="590" y="240">
                42 TIX • OPTIMAL
              </text>

              {/* Outer perimeter line */}
              <path
                className="text-secondary"
                d="M 60,30 L 660,50 L 680,290 L 110,270 Z"
                fill="none"
                stroke="currentColor"
                strokeDasharray="6 4"
                strokeWidth="1.5"
              />
            </svg>

            {/* Dynamic Floating Ward Card */}
            <div className="relative z-10 self-start bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-lg max-w-xs shadow-md border border-surface-container-high/40">
              <div className="flex items-center justify-between gap-space-sm">
                <span className="font-label-mono-xs text-label-mono-xs text-error font-bold uppercase">
                  Focus: {selectedWardMap} (South Transit)
                </span>
                <span className="material-symbols-outlined text-error text-sm">warning</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface mt-0.5">
                Heavy congestion alert along 4th Ave Corridor. Water main rupture coupled with drainage backup.
              </p>
              <div className="mt-space-xs flex items-center justify-between text-on-surface-variant font-label-mono-xs text-label-mono-xs">
                <span>Crew Deployment: 14 units</span>
                <span className="text-on-surface font-semibold">TTR: 4h 36m</span>
              </div>
            </div>

            <div className="relative z-10 self-end bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-1 rounded text-on-surface font-label-mono-xs text-label-mono-xs shadow-xs">
              <span>Projection: WGS84 Civic EPSG:4326 | Live Raster Delta: 3.2s</span>
            </div>
          </div>

          {/* Map Sub-Bar Quick Stats */}
          <div className="grid grid-cols-3 gap-space-sm mt-space-sm pt-space-xs">
            <div className="bg-surface-container-low p-space-xs rounded flex flex-col">
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                Critical Zones
              </span>
              <span className="font-headline-md text-headline-md text-error font-bold">
                Ward 04 & 09
              </span>
            </div>
            <div className="bg-surface-container-low p-space-xs rounded flex flex-col">
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                Average Ward Volume
              </span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                119 tix / ward
              </span>
            </div>
            <div className="bg-surface-container-low p-space-xs rounded flex flex-col">
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                Congestion Variance
              </span>
              <span className="font-headline-md text-headline-md text-secondary font-bold">
                ± 42.4% std
              </span>
            </div>
          </div>
        </div>

        {/* Ward Response Velocity vs Volume Matrix (5 cols) */}
        <div className="xl:col-span-5 bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between border border-surface-container-high/30">
          <div>
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary-container" />
                <span className="font-label-mono-sm text-label-mono-sm font-semibold uppercase text-on-surface tracking-wider">
                  Ward Performance Matrix
                </span>
              </div>
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                Velocity vs Volume
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Quadratic distribution mapping responsiveness efficiency against civic inbound ticket loads.
            </p>

            {/* Scatter/Quadrant Matrix Visualizer */}
            <div className="relative w-full h-56 bg-surface-container-low rounded-lg p-space-sm flex flex-col justify-between border border-surface-container-high/20">
              <div className="absolute top-2 left-2 font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase font-semibold">
                Slow / High Volume (Risk)
              </div>
              <div className="absolute top-2 right-2 font-label-mono-xs text-label-mono-xs text-secondary uppercase font-semibold">
                High Volume / Resilient
              </div>
              <div className="absolute bottom-2 left-2 font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase font-semibold">
                Low Volume / Slow
              </div>
              <div className="absolute bottom-2 right-2 font-label-mono-xs text-label-mono-xs text-secondary uppercase font-semibold">
                Optimal Velocity (Star)
              </div>

              {/* Grid Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-px bg-outline-variant/40" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-full w-px bg-outline-variant/40" />
              </div>

              {/* Positioned Ward Nodes */}
              {/* Ward 04 */}
              <div
                className="absolute top-8 left-14 flex items-center gap-1 group cursor-pointer"
                onClick={() => {
                  const w = WARDS_LEADERBOARD.find((i) => i.code === 'Ward 04');
                  if (w) onOpenWardDossier(w);
                }}
              >
                <span className="w-5 h-5 rounded-full bg-error text-on-error flex items-center justify-center font-label-mono-xs text-[9px] font-bold shadow-xs">
                  04
                </span>
                <div className="hidden group-hover:flex absolute -top-8 left-6 bg-primary text-on-primary text-label-mono-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-20">
                  Ward 04: 312 tickets | 4.6h avg
                </div>
              </div>

              {/* Ward 02 */}
              <div
                className="absolute top-24 left-1/2 -translate-x-6 flex items-center gap-1 group cursor-pointer"
                onClick={() => {
                  const w = WARDS_LEADERBOARD.find((i) => i.code === 'Ward 02');
                  if (w) onOpenWardDossier(w);
                }}
              >
                <span className="w-4 h-4 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-mono-xs text-[9px] font-bold shadow-xs">
                  02
                </span>
                <span className="font-label-mono-xs text-label-mono-xs text-on-surface font-semibold">
                  W-02
                </span>
              </div>

              {/* Ward 08 */}
              <div
                className="absolute bottom-6 right-16 flex items-center gap-1 group cursor-pointer"
                onClick={() => {
                  const w = WARDS_LEADERBOARD.find((i) => i.code === 'Ward 08');
                  if (w) onOpenWardDossier(w);
                }}
              >
                <span className="w-4 h-4 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-mono-xs text-[9px] font-bold shadow-xs">
                  08
                </span>
                <span className="font-label-mono-xs text-label-mono-xs text-secondary font-bold">
                  W-08 (1.2h)
                </span>
              </div>

              {/* Ward 01 */}
              <div className="absolute bottom-12 left-28 flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-label-mono-xs text-[8px] font-bold">
                  01
                </span>
              </div>

              {/* Ward 05 */}
              <div className="absolute top-16 right-24 flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-mono-xs text-[8px] font-bold">
                  05
                </span>
              </div>

              {/* Ward 11 */}
              <div className="absolute bottom-20 right-36 flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-label-mono-xs text-[8px] font-bold">
                  11
                </span>
              </div>
            </div>
          </div>

          <div className="mt-space-sm space-y-space-xs">
            <div className="p-space-xs bg-surface-container-low rounded flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-base">speed</span>
                <span className="font-body-sm text-body-sm text-on-surface">Target Velocity Variance:</span>
              </div>
              <span className="font-label-mono-xs text-label-mono-xs font-bold text-on-surface">
                8 of 12 Wards within SLA
              </span>
            </div>
            <div className="p-space-xs bg-surface-container-low rounded flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-error text-base">emergency_share</span>
                <span className="font-body-sm text-body-sm text-on-surface">Escalation Trigger:</span>
              </div>
              <span className="font-label-mono-xs text-label-mono-xs font-bold text-error">
                Ward 04 exceeds 4.0h ceiling
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Departmental Deep Dive Comparison Metrics (5 Core Departments) */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container-high/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-md">
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-mono-sm text-label-mono-sm font-semibold uppercase text-on-surface tracking-wider">
                Departmental Deep Dive SLA Matrix
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Comparative workload, response velocity, fiscal footprint, and citizen appraisal across the 5 primary agencies.
            </p>
          </div>
          <span className="px-space-sm py-1 bg-surface-container-low rounded font-label-mono-xs text-label-mono-xs text-on-surface-variant">
            Active Municipal FY2025
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-md">
          {/* Roads */}
          <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-colors">
            <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-container" />
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-lg">add_road</span>
                </span>
                <span className="px-1.5 py-0.5 bg-surface-container-lowest text-secondary rounded font-label-mono-xs text-label-mono-xs font-semibold">
                  91% CSAT
                </span>
              </div>
              <h3 className="font-body-md text-body-md font-bold text-on-surface leading-snug">
                Roads & Infrastructure
              </h3>
              <p className="font-label-mono-xs text-label-mono-xs text-on-surface-variant mt-0.5">Asset Ref: DPW-RD</p>
              <div className="mt-space-md space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Open Tickets:</span>
                  <span className="font-data-metric-md text-data-metric-md text-on-surface">389</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Avg Resolution:</span>
                  <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">3.8h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Maint. Spend:</span>
                  <span className="font-label-mono-sm text-label-mono-sm font-bold text-secondary">$42,500</span>
                </div>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs">
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary-container h-full rounded-full" style={{ width: '91%' }} />
              </div>
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant mt-1 block text-right">
                91% SLA Rate
              </span>
            </div>
          </div>

          {/* Sanitation */}
          <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-colors">
            <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-lg">delete_sweep</span>
                </span>
                <span className="px-1.5 py-0.5 bg-surface-container-lowest text-secondary rounded font-label-mono-xs text-label-mono-xs font-semibold">
                  94% CSAT
                </span>
              </div>
              <h3 className="font-body-md text-body-md font-bold text-on-surface leading-snug">
                Sanitation & Solid Waste
              </h3>
              <p className="font-label-mono-xs text-label-mono-xs text-on-surface-variant mt-0.5">Asset Ref: DSW-OPS</p>
              <div className="mt-space-md space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Open Tickets:</span>
                  <span className="font-data-metric-md text-data-metric-md text-on-surface">412</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Avg Resolution:</span>
                  <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">2.1h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Maint. Spend:</span>
                  <span className="font-label-mono-sm text-label-mono-sm font-bold text-secondary">$31,200</span>
                </div>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs">
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '94%' }} />
              </div>
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant mt-1 block text-right">
                94% SLA Rate
              </span>
            </div>
          </div>

          {/* Water */}
          <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-colors">
            <div className="absolute top-0 left-0 right-0 h-1 bg-error" />
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-lg">water_drop</span>
                </span>
                <span className="px-1.5 py-0.5 bg-error-container/50 text-error rounded font-label-mono-xs text-label-mono-xs font-semibold">
                  88% CSAT
                </span>
              </div>
              <h3 className="font-body-md text-body-md font-bold text-on-surface leading-snug">
                Water Supply & Drainage
              </h3>
              <p className="font-label-mono-xs text-label-mono-xs text-on-surface-variant mt-0.5">Asset Ref: DWS-HYD</p>
              <div className="mt-space-md space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Open Tickets:</span>
                  <span className="font-data-metric-md text-data-metric-md text-on-surface">295</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Avg Resolution:</span>
                  <span className="font-label-mono-sm text-label-mono-sm font-semibold text-error">4.9h (Slow)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Maint. Spend:</span>
                  <span className="font-label-mono-sm text-label-mono-sm font-bold text-secondary">$58,900</span>
                </div>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs">
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div className="bg-error h-full rounded-full" style={{ width: '88%' }} />
              </div>
              <span className="font-label-mono-xs text-label-mono-xs text-error mt-1 block text-right font-semibold">
                88% SLA Rate (Alert)
              </span>
            </div>
          </div>

          {/* Electrical */}
          <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-colors">
            <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-lg">lightbulb</span>
                </span>
                <span className="px-1.5 py-0.5 bg-surface-container-lowest text-secondary rounded font-label-mono-xs text-label-mono-xs font-semibold">
                  96% CSAT
                </span>
              </div>
              <h3 className="font-body-md text-body-md font-bold text-on-surface leading-snug">
                Electrical & Street Lighting
              </h3>
              <p className="font-label-mono-xs text-label-mono-xs text-on-surface-variant mt-0.5">Asset Ref: DEL-GRID</p>
              <div className="mt-space-md space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Open Tickets:</span>
                  <span className="font-data-metric-md text-data-metric-md text-on-surface">214</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Avg Resolution:</span>
                  <span className="font-label-mono-sm text-label-mono-sm font-semibold text-secondary">1.8h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Maint. Spend:</span>
                  <span className="font-label-mono-sm text-label-mono-sm font-bold text-secondary">$18,400</span>
                </div>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs">
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '96%' }} />
              </div>
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant mt-1 block text-right">
                96% SLA Rate
              </span>
            </div>
          </div>

          {/* Public Safety */}
          <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-colors">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">shield</span>
                </span>
                <span className="px-1.5 py-0.5 bg-surface-container-lowest text-on-surface rounded font-label-mono-xs text-label-mono-xs font-semibold">
                  92% CSAT
                </span>
              </div>
              <h3 className="font-body-md text-body-md font-bold text-on-surface leading-snug">
                Public Safety & Code
              </h3>
              <p className="font-label-mono-xs text-label-mono-xs text-on-surface-variant mt-0.5">Asset Ref: DPS-CODE</p>
              <div className="mt-space-md space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Open Tickets:</span>
                  <span className="font-data-metric-md text-data-metric-md text-on-surface">118</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Avg Resolution:</span>
                  <span className="font-label-mono-sm text-label-mono-sm font-semibold text-secondary">0.9h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Maint. Spend:</span>
                  <span className="font-label-mono-sm text-label-mono-sm font-bold text-secondary">$24,100</span>
                </div>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs">
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '92%' }} />
              </div>
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant mt-1 block text-right">
                92% SLA Rate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Deep Performance Breakdown Charts & Planning Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* 6-Month Intake vs Resolution (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between border border-surface-container-high/30">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-label-mono-sm text-label-mono-sm font-semibold uppercase text-on-surface tracking-wider">
                  6-Month Intake vs Resolution
                </span>
              </div>
              <div className="flex items-center gap-space-sm font-label-mono-xs text-label-mono-xs">
                <span className="flex items-center gap-1 text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-outline-variant" /> Inflow
                </span>
                <span className="flex items-center gap-1 text-secondary font-semibold">
                  <span className="w-2 h-2 rounded-full bg-secondary" /> Resolved
                </span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Historical trend shows closure velocity outperforming intake across Q1 and early Q2.
            </p>

            {/* Inline SVG Multi-Bar & Line Chart */}
            <div className="w-full h-48">
              <svg className="w-full h-full" fill="none" viewBox="0 0 450 180" xmlns="http://www.w3.org/2000/svg">
                <line className="text-surface-container" stroke="currentColor" strokeWidth="1" x1="40" x2="430" y1="20" y2="20" />
                <line className="text-surface-container" stroke="currentColor" strokeWidth="1" x1="40" x2="430" y1="60" y2="60" />
                <line className="text-surface-container" stroke="currentColor" strokeWidth="1" x1="40" x2="430" y1="100" y2="100" />
                <line className="text-surface-container" stroke="currentColor" strokeWidth="1" x1="40" x2="430" y1="140" y2="140" />

                <text className="text-on-surface-variant font-label-mono-xs text-[9px]" textAnchor="end" x="30" y="24">1.5k</text>
                <text className="text-on-surface-variant font-label-mono-xs text-[9px]" textAnchor="end" x="30" y="64">1.0k</text>
                <text className="text-on-surface-variant font-label-mono-xs text-[9px]" textAnchor="end" x="30" y="104">500</text>
                <text className="text-on-surface-variant font-label-mono-xs text-[9px]" textAnchor="end" x="30" y="144">0</text>

                {/* Dec */}
                <rect className="fill-surface-container-highest" height="85" rx="2" width="14" x="65" y="55" />
                <rect className="fill-secondary" height="78" rx="2" width="14" x="83" y="62" />
                <text className="text-on-surface-variant font-label-mono-xs text-[10px]" textAnchor="middle" x="81" y="160">DEC</text>

                {/* Jan */}
                <rect className="fill-surface-container-highest" height="95" rx="2" width="14" x="125" y="45" />
                <rect className="fill-secondary" height="90" rx="2" width="14" x="143" y="50" />
                <text className="text-on-surface-variant font-label-mono-xs text-[10px]" textAnchor="middle" x="141" y="160">JAN</text>

                {/* Feb */}
                <rect className="fill-surface-container-highest" height="80" rx="2" width="14" x="185" y="60" />
                <rect className="fill-secondary" height="82" rx="2" width="14" x="203" y="58" />
                <text className="text-on-surface-variant font-label-mono-xs text-[10px]" textAnchor="middle" x="201" y="160">FEB</text>

                {/* Mar */}
                <rect className="fill-surface-container-highest" height="100" rx="2" width="14" x="245" y="40" />
                <rect className="fill-secondary" height="102" rx="2" width="14" x="263" y="38" />
                <text className="text-on-surface-variant font-label-mono-xs text-[10px]" textAnchor="middle" x="261" y="160">MAR</text>

                {/* Apr */}
                <rect className="fill-surface-container-highest" height="108" rx="2" width="14" x="305" y="32" />
                <rect className="fill-secondary" height="112" rx="2" width="14" x="323" y="28" />
                <text className="text-on-surface-variant font-label-mono-xs text-[10px]" textAnchor="middle" x="321" y="160">APR</text>

                {/* May */}
                <rect className="fill-surface-container-highest" height="110" rx="2" width="14" x="365" y="30" />
                <rect className="fill-secondary" height="116" rx="2" width="14" x="383" y="24" />
                <text className="text-secondary font-label-mono-xs text-[10px] font-bold" textAnchor="middle" x="381" y="160">MAY</text>

                <path
                  className="text-secondary-container"
                  d="M 81,62 L 141,50 L 201,58 L 261,38 L 321,28 L 381,24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <circle className="fill-surface-container-lowest stroke-secondary" cx="381" cy="24" r="3.5" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="mt-space-sm p-space-xs bg-surface-container-low rounded flex items-center justify-between text-on-surface font-label-mono-xs text-label-mono-xs">
            <span>6-Mo Cumulative Recovery: 98.4%</span>
            <span className="text-secondary font-semibold">+4.8% Efficiency Delta</span>
          </div>
        </div>

        {/* Root Cause Attribution (3 cols) */}
        <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between border border-surface-container-high/30">
          <div>
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-mono-sm text-label-mono-sm font-semibold uppercase text-on-surface tracking-wider">
                Root Cause Attribution
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
              Categorical incident catalyst analysis based on field engineer diagnostic reports.
            </p>
            <div className="space-y-space-sm mt-space-sm">
              <div>
                <div className="flex items-center justify-between font-body-sm text-body-sm mb-1">
                  <span className="text-on-surface font-medium">Weather / Pothole Erosion</span>
                  <span className="font-label-mono-xs text-label-mono-xs font-bold text-on-surface">38.4% (548 tix)</span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '38.4%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between font-body-sm text-body-sm mb-1">
                  <span className="text-on-surface font-medium">Infrastructure Age (&gt;25 yrs)</span>
                  <span className="font-label-mono-xs text-label-mono-xs font-bold text-on-surface">29.1% (415 tix)</span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary-container h-full rounded-full" style={{ width: '29.1%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between font-body-sm text-body-sm mb-1">
                  <span className="text-on-surface font-medium">Equipment / Pump Failure</span>
                  <span className="font-label-mono-xs text-label-mono-xs font-bold text-on-surface">21.3% (304 tix)</span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className="bg-outline-variant h-full rounded-full" style={{ width: '21.3%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between font-body-sm text-body-sm mb-1">
                  <span className="text-on-surface font-medium">Citizen Misuse & Hazards</span>
                  <span className="font-label-mono-xs text-label-mono-xs font-bold text-on-surface">11.2% (161 tix)</span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className="bg-surface-container-high h-full rounded-full" style={{ width: '11.2%' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-space-md p-space-xs bg-surface-container-low rounded">
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant block uppercase">
              Analyst Diagnostic Note:
            </span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              Heavy late-spring rains amplified Ward 04 pavement sub-base erosion by 2.4x.
            </span>
          </div>
        </div>

        {/* Budget Allocation vs Maintenance Output Correlation (4 cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between border border-surface-container-high/30">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-label-mono-sm text-label-mono-sm font-semibold uppercase text-on-surface tracking-wider">
                  Next Quarter Planning Matrix
                </span>
              </div>
              <span className="px-1.5 py-0.5 bg-surface-container-low rounded font-label-mono-xs text-label-mono-xs text-secondary font-bold">
                FY25-Q3 Model
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
              Budget vs Output optimization model for city planners allocating resurfacing & rehabilitation grants.
            </p>

            <div className="bg-surface-container-low rounded-lg p-space-sm space-y-space-sm">
              <div className="flex items-center justify-between pb-space-xs">
                <span className="font-body-sm text-body-sm text-on-surface font-semibold">Priority 1: Ward 04 Resurfacing</span>
                <span className="font-label-mono-xs text-label-mono-xs text-error font-bold">$64,000 Req.</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant font-label-mono-xs text-label-mono-xs">
                <span>Forecasted Volume Drop: -42%</span>
                <span>Payback Velocity: 4.2 Mo</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-error h-full rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div className="mt-space-sm bg-surface-container-low rounded-lg p-space-sm space-y-space-sm">
              <div className="flex items-center justify-between pb-space-xs">
                <span className="font-body-sm text-body-sm text-on-surface font-semibold">Priority 2: Ward 02 Drainage Relining</span>
                <span className="font-label-mono-xs text-label-mono-xs text-secondary font-bold">$38,500 Req.</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant font-label-mono-xs text-label-mono-xs">
                <span>Forecasted Volume Drop: -28%</span>
                <span>Payback Velocity: 3.1 Mo</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '54%' }} />
              </div>
            </div>

            {simulationResult && (
              <div className="mt-space-sm p-space-xs bg-secondary-container/10 border border-secondary rounded text-xs text-secondary font-medium">
                {simulationResult}
              </div>
            )}
          </div>

          <div className="mt-space-md flex items-center justify-between pt-space-xs">
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
              Recommended Reserve: $85,000
            </span>
            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={simulationRunning}
              className="px-space-sm py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-on-surface font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{simulationRunning ? 'Computing...' : 'Run Simulation'}</span>
              <span className="material-symbols-outlined text-xs">tune</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: Ward Comparison Leaderboard Table */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container-high/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-mono-sm text-label-mono-sm font-semibold uppercase text-on-surface tracking-wider">
                Ward Comparison Operational Leaderboard
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Real-time status of all 12 Municipal Jurisdictions ranked by response velocity and SLA adherence.
            </p>
          </div>

          {/* Table Filter and Export Controls */}
          <div className="flex items-center gap-space-xs flex-wrap">
            <div className="relative">
              <input
                className="h-8 pl-7 pr-3 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:bg-surface-container transition-colors w-56"
                placeholder="Filter Ward or Councilor..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                search
              </span>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Export queued: ward-operational-leaderboard.csv')}
              className="h-8 px-space-sm bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-body-sm text-body-sm flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const w = WARDS_LEADERBOARD[0];
                onOpenWardDossier(w);
              }}
              className="h-8 px-space-sm bg-secondary text-on-secondary rounded-lg font-body-sm text-body-sm font-semibold flex items-center gap-1 hover:bg-secondary/90 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
              <span>Full Ward Dossier (PDF)</span>
            </button>
          </div>
        </div>

        {/* Structured Tabular Data View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-mono-xs text-label-mono-xs uppercase">
                <th className="py-2.5 px-space-md font-semibold">Ward Code & District</th>
                <th className="py-2.5 px-space-md font-semibold">Ward Officer / Councilor</th>
                <th className="py-2.5 px-space-md font-semibold text-right">Active Complaints</th>
                <th className="py-2.5 px-space-md font-semibold text-center">Velocity Rank</th>
                <th className="py-2.5 px-space-md font-semibold text-center">Avg TTR</th>
                <th className="py-2.5 px-space-md font-semibold text-right">SLA Compliance</th>
                <th className="py-2.5 px-space-md font-semibold text-center">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/30 text-body-md font-body-md">
              {filteredWards.map((w) => {
                const isCrit = w.density === 'Critical';
                return (
                  <tr
                    key={w.code}
                    className={`transition-colors group ${
                      isCrit
                        ? 'bg-error-container/15 hover:bg-error-container/25'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <td className="py-2.5 px-space-md">
                      <div className="flex items-center gap-space-xs">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isCrit
                              ? 'bg-error animate-ping'
                              : w.density === 'High'
                              ? 'bg-secondary'
                              : 'bg-secondary-container'
                          }`}
                        />
                        <span
                          className={`font-semibold ${
                            isCrit ? 'text-error font-bold' : 'text-on-surface'
                          }`}
                        >
                          {w.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-space-md text-on-surface-variant">{w.councilor}</td>
                    <td
                      className={`py-2.5 px-space-md text-right font-data-metric-md text-data-metric-md ${
                        isCrit ? 'text-error font-bold' : 'text-on-surface'
                      }`}
                    >
                      {w.activeComplaints}
                    </td>
                    <td className="py-2.5 px-space-md text-center">
                      <span
                        className={`px-2 py-0.5 rounded font-label-mono-xs text-label-mono-xs font-bold ${
                          isCrit
                            ? 'bg-error text-on-error'
                            : w.velocityRank === 1
                            ? 'bg-surface-container text-secondary'
                            : 'bg-surface-container-low text-on-surface-variant'
                        }`}
                      >
                        #{w.velocityRank} RANK
                      </span>
                    </td>
                    <td
                      className={`py-2.5 px-space-md text-center font-label-mono-xs text-label-mono-xs font-semibold ${
                        isCrit ? 'text-error font-bold' : 'text-on-surface'
                      }`}
                    >
                      {w.avgTtrHours}h
                    </td>
                    <td
                      className={`py-2.5 px-space-md text-right font-label-mono-xs text-label-mono-xs font-bold ${
                        w.slaCompliance >= 90 ? 'text-secondary' : 'text-error'
                      }`}
                    >
                      {w.slaCompliance}%
                    </td>
                    <td className="py-2.5 px-space-md text-center">
                      {isCrit ? (
                        <button
                          type="button"
                          onClick={() => onOpenWardDossier(w)}
                          className="px-space-sm py-1 bg-error text-on-error hover:bg-error/90 rounded font-label-mono-xs text-label-mono-xs font-semibold inline-flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">campaign</span>
                          <span>Intervene</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenWardDossier(w)}
                          className="px-space-xs py-1 text-on-surface-variant hover:text-secondary font-label-mono-xs text-label-mono-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          <span>Detail</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="mt-space-md pt-space-xs flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs text-on-surface-variant font-label-mono-xs text-label-mono-xs">
          <div>Displaying {filteredWards.length} of 12 active jurisdictions | Auto-refreshed: 14:32:00 UTC</div>
          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              disabled
              className="px-2 py-1 bg-surface-container-low rounded text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 py-1 bg-surface-container-high rounded font-bold text-on-surface">1</span>
            <button
              type="button"
              className="px-2 py-1 bg-surface-container-low rounded text-on-surface hover:bg-surface-container transition-colors"
            >
              2
            </button>
            <button
              type="button"
              className="px-2 py-1 bg-surface-container-low rounded text-on-surface hover:bg-surface-container transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
