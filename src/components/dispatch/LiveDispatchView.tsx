import React, { useState } from 'react';
import { FieldUnit } from '../../types';
import { FIELD_UNITS } from '../../data/mockData';

interface LiveDispatchViewProps {
  onShowToast: (message: string) => void;
  onOpenBroadcastModal: () => void;
}

export const LiveDispatchView: React.FC<LiveDispatchViewProps> = ({
  onShowToast,
  onOpenBroadcastModal,
}) => {
  const [activeDivision, setActiveDivision] = useState<'all' | 'road' | 'water' | 'elec' | 'sanit'>('all');
  const [selectedUnit, setSelectedUnit] = useState<FieldUnit>(FIELD_UNITS[0]);
  const [crewSearch, setCrewSearch] = useState('');
  const [activeChannel, setActiveChannel] = useState<'CH-01' | 'CH-04'>('CH-01');
  const [isPttActive, setIsPttActive] = useState(false);
  const [units, setUnits] = useState<FieldUnit[]>(FIELD_UNITS);

  // Unassigned incidents in dispatch queue
  const [unassignedQueue, setUnassignedQueue] = useState([
    {
      id: '#INC-8945',
      title: 'Water Main Rupture - 14" Sub-Pavement',
      location: 'Ward 4 · 450 W Columbus St. Basement flooding threat in 3 commercial storefronts.',
      severity: 'CRITICAL SLA',
      countdown: 'T-MINUS 04:12',
      aiRec: 'Unit W-02',
      eta: '0.8 mi away (3.5 min ETA)',
      dispatched: false,
    },
    {
      id: '#INC-8951',
      title: 'Traffic Light Controller Board Blown',
      location: 'Ward 2 · Grand Ave & 9th St. 4-way intersection gridlock forming during rush hour.',
      severity: 'HIGH PRIORITY',
      countdown: 'T-MINUS 11:30',
      aiRec: 'Unit E-03',
      eta: '1.4 mi away (6.0 min ETA)',
      dispatched: false,
    },
    {
      id: '#INC-8953',
      title: 'Fallen Tree Limb Obstructing Bus Lane',
      location: 'Ward 8 · Valley Blvd Eastbound. Transit authority requesting rapid clearing crane.',
      severity: 'MEDIUM',
      countdown: 'T-MINUS 32:00',
      aiRec: 'Unit R-08',
      eta: '2.1 mi away (8.5 min ETA)',
      dispatched: false,
    },
  ]);

  // Audio synthesizer tone utility
  const playTone = (freq = 520, type: OscillatorType = 'sine', duration = 0.15) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const handleUnitClick = (unit: FieldUnit) => {
    setSelectedUnit(unit);
    playTone(880, 'triangle', 0.12);
  };

  const handlePingTransponder = () => {
    playTone(1100, 'sine', 0.25);
    onShowToast(`Transponder ${selectedUnit.id} ping acknowledged (Latency: 1.2ms).`);
  };

  const handleRecenter = () => {
    playTone(660, 'sine', 0.1);
    onShowToast(`Radar viewport recentered on Unit ${selectedUnit.id}.`);
  };

  const handleDispatchTicket = (id: string, aiRec: string) => {
    playTone(720, 'square', 0.2);
    setUnassignedQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, dispatched: true } : item))
    );
    onShowToast(`Dispatched ${aiRec} to ticket ${id}. GPS route synced.`);
  };

  const handleCycleStatus = (unitId: string) => {
    const states: ('Available' | 'In Transit' | 'On Scene')[] = ['Available', 'In Transit', 'On Scene'];
    playTone(540, 'sine', 0.08);
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === unitId) {
          const nextIdx = (states.indexOf(u.status) + 1) % states.length;
          return { ...u, status: states[nextIdx] };
        }
        return u;
      })
    );
    onShowToast(`Squad ${unitId} status updated.`);
  };

  const handleRadioCall = (unitId: string) => {
    playTone(660, 'sine', 0.15);
    onShowToast(`Radio channel linked to Unit ${unitId}. Audio stream open.`);
  };

  const handleTogglePtt = () => {
    if (!isPttActive) {
      playTone(480, 'sawtooth', 0.2);
      setIsPttActive(true);
      onShowToast(`Microphone active: Broadcasting on ${activeChannel}...`);
    } else {
      setIsPttActive(false);
      onShowToast('PTT released. Transmission ended.');
    }
  };

  const filteredCrews = units.filter((u) => {
    const term = crewSearch.toLowerCase();
    return (
      u.id.toLowerCase().includes(term) ||
      u.driver.toLowerCase().includes(term) ||
      u.ward.toLowerCase().includes(term) ||
      u.typeName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Sub-header Command Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-surface-container-high/30">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-mono-xs text-label-mono-xs uppercase tracking-wider mb-1">
            <span>Municipal Operational Telemetry</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="text-secondary font-semibold">Active Sector: Central & North Corridors</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Live Dispatch & Field Units Console
          </h1>
        </div>

        {/* Quick Operations Tools */}
        <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
          <div className="flex items-center bg-surface-container-low px-space-sm py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse mr-2" />
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface font-semibold uppercase">
              RT-GPS Stream
            </span>
            <span className="ml-2 font-label-mono-xs text-label-mono-xs text-on-surface-variant">250ms Ping</span>
          </div>
          <div className="h-6 w-px bg-surface-container-high hidden sm:block" />
          <button
            type="button"
            onClick={onOpenBroadcastModal}
            className="h-8 px-space-md bg-secondary text-on-secondary rounded-lg font-body-sm text-body-sm font-semibold flex items-center gap-space-xs hover:bg-secondary/90 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">cell_tower</span>
            <span>Ward Broadcast Radio</span>
          </button>
          <button
            type="button"
            onClick={() => onShowToast('Priority Escalation broadcast transmitted to 4 sector squads.')}
            className="h-8 px-space-md bg-error text-on-error rounded-lg font-body-sm text-body-sm font-semibold flex items-center gap-space-xs hover:bg-error/90 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">warning</span>
            <span>Priority Escalation (4)</span>
          </button>
        </div>
      </div>

      {/* Operational Fleet & Field Units KPI Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <div className="relative bg-surface-container-lowest p-space-md rounded-xl shadow-xs overflow-hidden flex flex-col justify-between border border-surface-container-high/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold tracking-wider">
                Units Deployed
              </span>
              <span className="font-data-metric-lg text-data-metric-lg text-on-surface mt-1">
                42 <span className="text-on-surface-variant font-normal text-headline-md">/ 48</span>
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-lg">local_shipping</span>
            </div>
          </div>
          <div className="mt-space-sm pt-space-xs flex items-center justify-between border-t border-surface-container-high/40">
            <div className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-mono-xs text-label-mono-xs text-on-surface">87.5% Active Load</span>
            </div>
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">12 Wards Mapped</span>
          </div>
        </div>

        <div className="relative bg-surface-container-lowest p-space-md rounded-xl shadow-xs overflow-hidden flex flex-col justify-between border border-surface-container-high/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-surface-tint" />
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold tracking-wider">
                Assigned Dispatches
              </span>
              <span className="font-data-metric-lg text-data-metric-lg text-on-surface mt-1">
                28 <span className="text-on-surface-variant font-normal text-body-lg">Active</span>
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-lg">assignment_turned_in</span>
            </div>
          </div>
          <div className="mt-space-sm pt-space-xs flex items-center justify-between border-t border-surface-container-high/40">
            <span className="font-label-mono-xs text-label-mono-xs text-secondary font-medium">+6 In Last 45m</span>
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">4 Pending Route</span>
          </div>
        </div>

        <div className="relative bg-surface-container-lowest p-space-md rounded-xl shadow-xs overflow-hidden flex flex-col justify-between border border-surface-container-high/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-container" />
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold tracking-wider">
                Avg Response Arrival
              </span>
              <span className="font-data-metric-lg text-data-metric-lg text-on-surface mt-1">
                14.2 <span className="text-on-surface-variant font-normal text-headline-md">MIN</span>
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-lg">speed</span>
            </div>
          </div>
          <div className="mt-space-sm pt-space-xs flex items-center justify-between border-t border-surface-container-high/40">
            <span className="font-label-mono-xs text-label-mono-xs text-secondary font-medium">▼ 1.8m Under SLA</span>
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">SLA Goal: &lt;16m</span>
          </div>
        </div>

        <div className="relative bg-surface-container-lowest p-space-md rounded-xl shadow-xs overflow-hidden flex flex-col justify-between border border-surface-container-high/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-error" />
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-mono-xs text-label-mono-xs uppercase text-error font-semibold tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                Critical In-Flight
              </span>
              <span className="font-data-metric-lg text-data-metric-lg text-error mt-1">
                04 <span className="text-on-surface-variant font-normal text-body-lg">Squads</span>
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-lg">crisis_alert</span>
            </div>
          </div>
          <div className="mt-space-sm pt-space-xs flex items-center justify-between border-t border-surface-container-high/40">
            <span className="font-label-mono-xs text-label-mono-xs text-error font-bold">Priority Code Red</span>
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">2 Hydrology / 2 Elec</span>
          </div>
        </div>
      </section>

      {/* Interactive Live Ward Dispatch Map & Radar Telemetry */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
        {/* Map Control Center (8 cols) */}
        <div className="xl:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden border border-surface-container-high/30">
          {/* Header */}
          <div className="p-space-md flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low/70 border-b border-surface-container-high/30">
            <div className="flex items-center gap-space-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">satellite_alt</span>
                <span className="font-body-md text-body-md font-semibold text-on-surface">
                  Ward 01 - 12 Fleet Telemetry Radar
                </span>
              </div>
              <span className="px-space-sm py-0.5 rounded bg-surface-container-highest font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                37.7749° N, 122.4194° W
              </span>
            </div>
            {/* Division Filter Chips */}
            <div className="flex items-center gap-1 sm:gap-2">
              {[
                { id: 'all', label: 'ALL (42)' },
                { id: 'road', label: 'ROADS (12)' },
                { id: 'water', label: 'WATER (8)' },
                { id: 'elec', label: 'ELEC (6)' },
                { id: 'sanit', label: 'SANIT (16)' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setActiveDivision(chip.id as any);
                    playTone(600, 'sine', 0.08);
                  }}
                  className={`px-space-sm py-1 rounded font-label-mono-xs text-label-mono-xs cursor-pointer transition-colors ${
                    activeDivision === chip.id
                      ? 'bg-primary-container text-on-primary font-semibold'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map Canvas */}
          <div className="relative w-full h-[460px] bg-surface-container-high/40 overflow-hidden select-none">
            <svg className="absolute inset-0 w-full h-full text-surface-container-highest/60" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeDasharray="2,4" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#radarGrid)" />
              <path d="M-50,180 Q320,160 600,240 T1200,320" fill="none" opacity="0.6" stroke="#CBD5E1" strokeWidth="6" />
              <path d="M120,-20 L280,500" fill="none" opacity="0.5" stroke="#CBD5E1" strokeWidth="4" />
              <path d="M680,-20 L580,520" fill="none" opacity="0.5" stroke="#CBD5E1" strokeWidth="4" />
              <path d="M150,380 L880,120" fill="none" opacity="0.4" stroke="#CBD5E1" strokeWidth="3" />
              <path d="M380,-10 C420,120 340,260 490,520" fill="none" opacity="0.25" stroke="#93ccff" strokeWidth="14" />
              <circle className="animate-ping" cx="50%" cy="46%" r="180" fill="none" stroke="#316bf3" strokeWidth="1" opacity="0.2" style={{ animationDuration: '4s' }} />
              <circle cx="50%" cy="46%" r="90" fill="none" stroke="#316bf3" strokeWidth="1.5" opacity="0.4" />
            </svg>

            {/* Ward Labels */}
            <div className="absolute top-6 left-8 font-label-mono-xs text-label-mono-xs text-on-surface-variant/70 uppercase">
              Ward 03 - Commercial Harbor
            </div>
            <div className="absolute top-20 right-16 font-label-mono-xs text-label-mono-xs text-on-surface-variant/70 uppercase">
              Ward 04 - High-Density Core
            </div>
            <div className="absolute bottom-12 left-16 font-label-mono-xs text-label-mono-xs text-on-surface-variant/70 uppercase">
              Ward 07 - South Industrial Corridor
            </div>
            <div className="absolute bottom-20 right-28 font-label-mono-xs text-label-mono-xs text-on-surface-variant/70 uppercase">
              Ward 11 - Highland Residential
            </div>

            {/* Interactive Squad Pins */}
            {units.map((unit) => {
              const matchesDiv = activeDivision === 'all' || unit.type === activeDivision;
              if (!matchesDiv) return null;
              const isSelected = selectedUnit.id === unit.id;
              const isWater = unit.type === 'water';

              return (
                <div
                  key={unit.id}
                  onClick={() => handleUnitClick(unit)}
                  style={{ top: unit.mapPos.top, left: unit.mapPos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 ${
                    isSelected ? 'scale-110' : ''
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    {isWater && <span className="absolute w-8 h-8 rounded-full bg-error/30 animate-ping" />}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-surface-container-lowest ${
                        isWater
                          ? 'bg-error text-on-error'
                          : unit.type === 'elec'
                          ? 'bg-secondary text-on-secondary'
                          : unit.type === 'road'
                          ? 'bg-primary-container text-on-primary'
                          : 'bg-on-surface-variant text-surface-container-lowest'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {unit.type === 'water'
                          ? 'water_damage'
                          : unit.type === 'elec'
                          ? 'bolt'
                          : unit.type === 'road'
                          ? 'forklift'
                          : 'delete_sweep'}
                      </span>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface p-2 rounded shadow-xl min-w-44 z-30 pointer-events-none">
                      <div className="flex items-center justify-between">
                        <span className="font-label-mono-xs text-label-mono-xs font-bold text-secondary-fixed">
                          UNIT {unit.id} [{unit.status.toUpperCase()}]
                        </span>
                        <span className="font-label-mono-xs text-label-mono-xs">ETA 4m</span>
                      </div>
                      <span className="font-body-sm text-body-sm mt-0.5">{unit.currentTicket}</span>
                      <span className="font-label-mono-xs text-label-mono-xs text-on-primary-container">
                        {unit.ward} · {unit.driver}
                      </span>
                    </div>
                  </div>
                  <span className="block text-center font-label-mono-xs text-label-mono-xs font-bold bg-surface-container-lowest/90 px-1 rounded shadow mt-1">
                    {unit.id}
                  </span>
                </div>
              );
            })}

            {/* Dynamic Map Telemetry HUD Bottom */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-space-sm bg-surface-container-lowest/95 backdrop-blur-md rounded-lg shadow-xs text-on-surface border border-surface-container-high/40">
              <div className="flex items-center gap-space-md">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                  <span className="font-label-mono-xs text-label-mono-xs font-bold uppercase">
                    Selected Squad:{' '}
                    <span className="text-secondary font-bold">
                      {selectedUnit.id} ({selectedUnit.status}) - Lead: {selectedUnit.driver}
                    </span>
                  </span>
                </div>
                <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant hidden md:inline">
                  Telemetry: {selectedUnit.vitals} · Radio {selectedUnit.radioChannel}
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  type="button"
                  onClick={handleRecenter}
                  className="px-space-sm py-1 bg-surface-container hover:bg-surface-container-high rounded font-label-mono-xs text-label-mono-xs font-semibold text-on-surface transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">my_location</span>
                  <span>Recenter</span>
                </button>
                <button
                  type="button"
                  onClick={handlePingTransponder}
                  className="px-space-sm py-1 bg-primary text-on-primary rounded font-label-mono-xs text-label-mono-xs font-semibold hover:bg-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">sensors</span>
                  <span>Ping Transponder</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Legend */}
          <div className="p-space-sm px-space-md bg-surface-container-low flex flex-wrap items-center justify-between text-on-surface-variant gap-y-2 border-t border-surface-container-high/30">
            <div className="flex items-center gap-space-md font-label-mono-xs text-label-mono-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary" /> On Scene (14)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-error" /> Urgent Response (4)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-container" /> In Transit (18)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-outline-variant" /> Available Staging (6)
              </span>
            </div>
            <div className="font-label-mono-xs text-label-mono-xs">
              Geo-fence Status: <span className="text-secondary font-semibold">100% Perimeter Locked</span>
            </div>
          </div>
        </div>

        {/* Live Department Fleet Status Split (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          {/* Fleet Division Health */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between border border-surface-container-high/30">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                Fleet Division Health
              </span>
              <span className="font-label-mono-xs text-label-mono-xs bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-semibold">
                ALL SECTORS
              </span>
            </div>

            <div className="space-y-space-sm">
              {/* Water */}
              <div className="flex flex-col bg-surface-container-low/60 p-space-sm rounded-lg">
                <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs mb-1">
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-secondary">water_drop</span> Water & Hydrology
                  </span>
                  <span className="font-semibold text-secondary">7 / 8 Deployed</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5">
                  <div className="bg-secondary h-1.5 rounded-full" style={{ width: '87.5%' }} />
                </div>
                <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs text-on-surface-variant mt-1">
                  <span>2 High Priority Tasks</span>
                  <span>Squad Alpha, Gamma Lead</span>
                </div>
              </div>

              {/* Roads */}
              <div className="flex flex-col bg-surface-container-low/60 p-space-sm rounded-lg">
                <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs mb-1">
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">engineering</span> Roads & Heavy Transit
                  </span>
                  <span className="font-semibold text-on-surface">11 / 12 Deployed</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '91%' }} />
                </div>
                <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs text-on-surface-variant mt-1">
                  <span>Pothole & Barrier Crews</span>
                  <span>Avg Repair: 38m</span>
                </div>
              </div>

              {/* Electrical */}
              <div className="flex flex-col bg-surface-container-low/60 p-space-sm rounded-lg">
                <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs mb-1">
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-secondary-container">flash_on</span> Electrical & Traffic Signals
                  </span>
                  <span className="font-semibold text-secondary-container">6 / 6 Max Load</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5">
                  <div className="bg-secondary-container h-1.5 rounded-full" style={{ width: '100%' }} />
                </div>
                <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs text-error mt-1 font-semibold">
                  <span>0 Standby Available</span>
                  <span>Reserve Request Pending</span>
                </div>
              </div>

              {/* Sanitation */}
              <div className="flex flex-col bg-surface-container-low/60 p-space-sm rounded-lg">
                <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs mb-1">
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">recycling</span> Sanitation & Waste Ops
                  </span>
                  <span className="font-semibold text-on-surface">18 / 22 Deployed</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5">
                  <div className="bg-on-surface-variant h-1.5 rounded-full" style={{ width: '81%' }} />
                </div>
                <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs text-on-surface-variant mt-1">
                  <span>Night Shift Prep Ongoing</span>
                  <span>Depot Landfill 3 Clear</span>
                </div>
              </div>
            </div>
          </div>

          {/* Supervisor Quick Comm Patch */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between border border-surface-container-high/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body-md text-body-md font-semibold text-on-surface">
                Direct Radio Patch
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
              Select frequency channel to broadcast urgent tactical directions to field squad leads.
            </p>
            <div className="grid grid-cols-2 gap-space-xs mb-space-sm">
              <button
                type="button"
                onClick={() => {
                  setActiveChannel('CH-01');
                  playTone(500, 'sine', 0.08);
                }}
                className={`p-2 rounded text-left transition-all cursor-pointer ${
                  activeChannel === 'CH-01'
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                <span className="block font-label-mono-xs text-label-mono-xs uppercase font-bold">
                  CH-01 Primary
                </span>
                <span className="text-body-sm font-semibold">Zone 01 All-Hands</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveChannel('CH-04');
                  playTone(500, 'sine', 0.08);
                }}
                className={`p-2 rounded text-left transition-all cursor-pointer ${
                  activeChannel === 'CH-04'
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                <span className="block font-label-mono-xs text-label-mono-xs uppercase font-bold">
                  CH-04 Water Ops
                </span>
                <span className="text-body-sm font-semibold">Hydrology Command</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleTogglePtt}
              className={`w-full h-8 rounded font-body-sm text-body-sm font-semibold flex items-center justify-center gap-space-xs transition-all cursor-pointer ${
                isPttActive
                  ? 'bg-error text-on-error animate-pulse'
                  : 'bg-primary-container text-on-primary hover:bg-primary-container/90'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {isPttActive ? 'mic_off' : 'mic'}
              </span>
              <span>{isPttActive ? 'Release PTT Transmission' : 'Hold PTT to Transmit Voice'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Dispatch Queue & Incident Assignment Console */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg mb-space-xl">
        {/* Unassigned Incident Queue (5 cols) */}
        <div className="xl:col-span-5 flex flex-col bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden border border-surface-container-high/30">
          <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-surface-container-high/30">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-error text-base">emergency_share</span>
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-bold text-on-surface">
                  Unassigned Incident Queue
                </span>
                <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                  Prioritized by SLA Urgency
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-error font-label-mono-xs text-label-mono-xs font-bold">
              {unassignedQueue.filter((q) => !q.dispatched).length} PENDING
            </span>
          </div>

          <div className="divide-y divide-surface-container-low p-space-sm space-y-space-xs overflow-y-auto max-h-[580px]">
            {unassignedQueue.map((item) => (
              <div
                key={item.id}
                className={`p-space-sm rounded-lg hover:bg-surface-container-low/70 transition-all border-l-4 flex flex-col gap-space-xs ${
                  item.severity.includes('CRITICAL')
                    ? 'border-error'
                    : item.severity.includes('HIGH')
                    ? 'border-secondary-container'
                    : 'border-outline-variant'
                } ${item.dispatched ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-label-mono-xs text-label-mono-xs font-bold px-1.5 py-0.5 rounded ${
                        item.severity.includes('CRITICAL')
                          ? 'bg-error-container/60 text-error'
                          : item.severity.includes('HIGH')
                          ? 'bg-surface-container-high text-secondary-container'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {item.severity}
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm font-bold text-on-surface">
                      {item.id}
                    </span>
                  </div>
                  <span
                    className={`font-label-mono-xs text-label-mono-xs font-semibold ${
                      item.severity.includes('CRITICAL') ? 'text-error' : 'text-on-surface-variant'
                    }`}
                  >
                    {item.countdown}
                  </span>
                </div>

                <div>
                  <h4 className="font-body-md text-body-md font-semibold text-on-surface">
                    {item.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    {item.location}
                  </p>
                </div>

                <div className="bg-surface-container p-2 rounded flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-sm">near_me</span>
                    <div className="flex flex-col">
                      <span className="font-label-mono-xs text-label-mono-xs text-on-surface font-bold">
                        AI Rec: {item.aiRec}
                      </span>
                      <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                        {item.eta}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={item.dispatched}
                    onClick={() => handleDispatchTicket(item.id, item.aiRec)}
                    className={`h-7 px-space-sm rounded font-label-mono-xs text-label-mono-xs font-semibold transition-transform active:scale-95 cursor-pointer ${
                      item.dispatched
                        ? 'bg-surface-tint text-on-primary cursor-not-allowed'
                        : 'bg-secondary text-on-secondary hover:bg-secondary/90'
                    }`}
                  >
                    {item.dispatched ? 'DISPATCHED ✓' : 'Dispatch Squad'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Field Crew Telemetry Cards (7 cols) */}
        <div className="xl:col-span-7 flex flex-col bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden border border-surface-container-high/30">
          <div className="p-space-md bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container-high/30">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-base">badge</span>
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-bold text-on-surface">
                  Active Field Crew Status & Telemetry
                </span>
                <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                  Real-Time Radio Call-Signs & Vital Telemetry
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs">
              <input
                className="h-7 px-space-sm bg-surface-container-lowest rounded text-body-sm placeholder:text-on-surface-variant outline-none focus:ring-1 focus:ring-secondary w-48 text-on-surface border border-outline-variant/30"
                placeholder="Filter Unit, Crew lead, or Ward..."
                type="text"
                value={crewSearch}
                onChange={(e) => setCrewSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="p-space-md grid grid-cols-1 md:grid-cols-2 gap-space-md overflow-y-auto max-h-[580px]">
            {filteredCrews.map((crew) => (
              <div
                key={crew.id}
                className="bg-surface-container-low/50 hover:bg-surface-container-low p-space-md rounded-xl transition-all border border-surface-container-high flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary font-headline-md font-bold">
                        {crew.callSign}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-headline-md text-headline-md font-bold text-on-surface">
                            Unit {crew.id}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface font-label-mono-xs text-label-mono-xs font-bold uppercase">
                            {crew.type.toUpperCase()}
                          </span>
                        </div>
                        <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                          {crew.typeName}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCycleStatus(crew.id)}
                      className={`px-2 py-0.5 rounded font-label-mono-xs text-label-mono-xs font-semibold cursor-pointer ${
                        crew.status === 'On Scene'
                          ? 'bg-secondary text-on-secondary'
                          : crew.status === 'In Transit'
                          ? 'bg-error text-on-error'
                          : 'bg-surface-tint text-on-primary'
                      }`}
                    >
                      {crew.status}
                    </button>
                  </div>

                  <div className="mt-space-md grid grid-cols-2 gap-2 text-on-surface">
                    <div className="flex flex-col">
                      <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                        Crew Lead
                      </span>
                      <span className="font-body-sm text-body-sm font-semibold truncate">{crew.driver}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                        Radio Contact
                      </span>
                      <span className="font-label-mono-xs text-label-mono-xs font-bold text-secondary">
                        {crew.radioChannel}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                        Coordinates
                      </span>
                      <span className="font-label-mono-xs text-label-mono-xs truncate">{crew.coordinates}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
                        Vehicle Vitals
                      </span>
                      <span className="font-label-mono-xs text-label-mono-xs text-secondary font-semibold">
                        {crew.vitals}
                      </span>
                    </div>
                  </div>

                  <div className="mt-space-sm p-space-xs px-space-sm bg-surface-container-lowest rounded flex items-center justify-between">
                    <span className="font-label-mono-xs text-label-mono-xs font-semibold text-on-surface truncate max-w-[200px]">
                      {crew.currentTicket}
                    </span>
                    <span className="font-label-mono-xs text-label-mono-xs text-secondary font-bold">
                      {crew.ward}
                    </span>
                  </div>
                </div>

                <div className="mt-space-md pt-space-xs flex items-center justify-between border-t border-surface-container-high/60">
                  <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                    Last ping: {crew.lastPing}
                  </span>
                  <div className="flex items-center gap-space-xs">
                    <button
                      type="button"
                      onClick={() => handleRadioCall(crew.id)}
                      className="h-6 px-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-mono-xs text-label-mono-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">call</span> Radio
                    </button>
                    <button
                      type="button"
                      onClick={() => onShowToast(`Logged situational telemetry update for Unit ${crew.id}.`)}
                      className="h-6 px-2 bg-primary-container text-on-primary rounded font-label-mono-xs text-label-mono-xs font-semibold hover:bg-primary-container/80 cursor-pointer"
                    >
                      Log Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Dispatch Timeline & Telemetry Feed (Bottom Ribbon) */}
      <section className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-surface-container-high/30">
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-low mb-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-sm">history_toggle_off</span>
            <span className="font-body-md text-body-md font-bold text-on-surface">
              Live Municipal Dispatch Timeline & Event Stream
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">Stream Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
          <div className="p-space-sm rounded bg-surface-container-low/60 flex flex-col">
            <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs text-on-surface-variant">
              <span className="font-bold text-on-surface">14:31:40 UTC</span>
              <span className="text-error font-semibold">DISPATCHED</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface mt-1">
              Squad W-02 dispatched to #INC-8945 (Water Main Rupture, Ward 4).
            </p>
          </div>

          <div className="p-space-sm rounded bg-surface-container-low/60 flex flex-col">
            <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs text-on-surface-variant">
              <span className="font-bold text-on-surface">14:28:15 UTC</span>
              <span className="text-secondary font-semibold">ARRIVED</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface mt-1">
              Squad E-04 marked On-Scene at 7th & Lexington Ave.
            </p>
          </div>

          <div className="p-space-sm rounded bg-surface-container-low/60 flex flex-col">
            <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs text-on-surface-variant">
              <span className="font-bold text-on-surface">14:22:04 UTC</span>
              <span className="text-on-surface-variant font-semibold">RESOLVED</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface mt-1">
              Squad R-03 closed #INC-8938 (Pavement sinkhole filled, Ward 1).
            </p>
          </div>

          <div className="p-space-sm rounded bg-surface-container-low/60 flex flex-col">
            <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs text-on-surface-variant">
              <span className="font-bold text-on-surface">14:15:50 UTC</span>
              <span className="text-secondary-container font-semibold">TELEMETRY</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface mt-1">
              Geo-Fence auto-verification passed for all 42 active vehicle transponders.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
