import React, { useState, useMemo } from 'react';
import { Incident, Department, Severity, IncidentStatus } from '../../types';

interface IncidentOperationsViewProps {
  incidents: Incident[];
  onUpdateIncidentStatus: (id: string, newStatus: IncidentStatus) => void;
  onShowToast: (message: string) => void;
  onOpenIncidentDetail: (incident: Incident) => void;
  selectedIncident: Incident | null;
  onCloseDrawer: () => void;
  searchQuery: string;
}

export const IncidentOperationsView: React.FC<IncidentOperationsViewProps> = ({
  incidents,
  onUpdateIncidentStatus,
  onShowToast,
  onOpenIncidentDetail,
  selectedIncident,
  onCloseDrawer,
  searchQuery,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [drawerStatus, setDrawerStatus] = useState<IncidentStatus>('In Progress');

  // Sync drawer status when selected incident changes
  React.useEffect(() => {
    if (selectedIncident) {
      setDrawerStatus(selectedIncident.status);
    }
  }, [selectedIncident]);

  // Dynamic filter application
  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.narrative.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = selectedDept === 'All' || item.department === selectedDept;
      const matchesSev = selectedSeverity === 'All' || item.severity === selectedSeverity;
      const matchesWard = selectedWard === 'All' || item.ward === selectedWard;
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

      return matchesSearch && matchesDept && matchesSev && matchesWard && matchesStatus;
    });
  }, [incidents, searchQuery, selectedDept, selectedSeverity, selectedWard, selectedStatus]);

  // Dynamic KPI counts based on active incidents
  const totalCount = incidents.length;
  const inProgressCount = incidents.filter((i) => i.status === 'In Progress').length;
  const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length;
  const criticalCount = incidents.filter((i) => i.severity === 'Critical').length;

  const handleResetFilters = () => {
    setSelectedDept('All');
    setSelectedSeverity('All');
    setSelectedWard('All');
    setSelectedStatus('All');
    setCurrentPage(1);
    onShowToast('Filters reset to default view.');
  };

  const handleSaveDrawerStatus = () => {
    if (!selectedIncident) return;
    onUpdateIncidentStatus(selectedIncident.id, drawerStatus);
    onShowToast(`Incident #${selectedIncident.id} status updated to "${drawerStatus}".`);
    onCloseDrawer();
  };

  const handleEscalateToMayor = () => {
    onShowToast(`Priority alert dispatched to City Operations Council!`);
    onCloseDrawer();
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* 1. Operational Telemetry Ribbon */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-sm border border-surface-container-high/30">
        <div className="flex items-center gap-space-md flex-wrap">
          <div className="flex items-center gap-space-xs px-space-sm py-1 bg-surface-container rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface uppercase font-semibold">
              City Telemetry: Optimal
            </span>
          </div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-mono-sm text-label-mono-sm">
            <span className="material-symbols-outlined text-sm text-secondary">wifi_tethering</span>
            <span>99.4% Grid Connectivity</span>
          </div>
          <span className="hidden md:inline text-outline-variant font-body-sm">•</span>
          <div className="flex items-center gap-space-xs text-on-surface font-body-sm">
            <span className="material-symbols-outlined text-sm text-on-surface-variant">location_city</span>
            <span>
              Active Wards: <strong className="font-label-mono-sm text-label-mono-sm">12</strong>
            </span>
          </div>
          <span className="hidden md:inline text-outline-variant font-body-sm">•</span>
          <div className="flex items-center gap-space-xs text-on-surface font-body-sm">
            <span className="material-symbols-outlined text-sm text-on-surface-variant">badge</span>
            <span>
              Shift Commander: <span className="font-semibold text-primary-container">Marcus Vance</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-md self-end lg:self-auto">
          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant uppercase">
              Auto-Sync 30s
            </span>
          </div>
          <div className="flex items-center gap-space-xs font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>14:32:48 UTC</span>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics / KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* KPI 1: Total Incidents */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between relative overflow-hidden border border-surface-container-high/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant tracking-wider font-semibold">
                Total Reported
              </span>
              <div className="flex items-baseline gap-space-sm mt-space-xs">
                <span className="font-data-metric-lg text-data-metric-lg text-on-surface">1,428</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-mono-xs text-label-mono-xs font-semibold">
                  +8.2%
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-lg">stacked_inbox</span>
            </div>
          </div>
          <div className="mt-space-md flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Across 12 Metropolitan Wards</span>
            <svg className="w-20 h-6 overflow-visible text-secondary" fill="none" viewBox="0 0 80 24">
              <path d="M0 18 Q 15 14, 25 19 T 50 8 T 80 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              <circle cx="80" cy="4" fill="currentColor" r="2.5" />
            </svg>
          </div>
        </div>

        {/* KPI 2: In Progress */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between relative overflow-hidden border border-surface-container-high/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container" />
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant tracking-wider font-semibold">
                In Progress / Field Crews
              </span>
              <div className="flex items-baseline gap-space-sm mt-space-xs">
                <span className="font-data-metric-lg text-data-metric-lg text-on-surface">342</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface font-label-mono-xs text-label-mono-xs font-semibold">
                  -3.1%
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-lg">engineering</span>
            </div>
          </div>
          <div className="mt-space-md flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">28 Teams Actively Deployed</span>
            <svg className="w-20 h-6 overflow-visible text-on-surface-variant" fill="none" viewBox="0 0 80 24">
              <path d="M0 6 Q 20 18, 40 10 T 65 16 T 80 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              <circle cx="80" cy="8" fill="currentColor" r="2.5" />
            </svg>
          </div>
        </div>

        {/* KPI 3: Resolved Today */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between relative overflow-hidden border border-surface-container-high/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-container" />
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant tracking-wider font-semibold">
                Resolved Today
              </span>
              <div className="flex items-baseline gap-space-sm mt-space-xs">
                <span className="font-data-metric-lg text-data-metric-lg text-on-surface">189</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-mono-xs text-label-mono-xs font-semibold">
                  +12% speed
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-lg">task_alt</span>
            </div>
          </div>
          <div className="mt-space-md flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Avg: <strong className="font-label-mono-sm text-label-mono-sm">4.2 hrs</strong> (Target: 5.0h)
            </span>
            <div className="flex items-center gap-1 font-label-mono-xs text-label-mono-xs text-secondary font-semibold">
              <span className="material-symbols-outlined text-xs">trending_up</span>98.1% SLA
            </div>
          </div>
        </div>

        {/* KPI 4: Critical Escalations */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between relative overflow-hidden border border-surface-container-high/30">
          <div className="absolute top-0 left-0 right-0 h-1 bg-error" />
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-mono-xs text-label-mono-xs uppercase text-error tracking-wider font-bold">
                Critical Escalations
              </span>
              <div className="flex items-baseline gap-space-sm mt-space-xs">
                <span className="font-data-metric-lg text-data-metric-lg text-error">14</span>
                <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-mono-xs text-label-mono-xs font-bold">
                  3 UNASSIGNED
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error animate-pulse">
              <span className="material-symbols-outlined text-lg">warning</span>
            </div>
          </div>
          <div className="mt-space-md flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-error font-medium">Requires Immediate Dispatch</span>
            <button
              type="button"
              className="px-space-sm py-0.5 rounded bg-error text-on-error font-label-mono-xs text-label-mono-xs hover:bg-error/90 transition-all flex items-center gap-1 cursor-pointer"
              onClick={() => setSelectedSeverity('Critical')}
            >
              <span>Triage</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Analytics Visualization Charts Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Complaints Volume by Department */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between border border-surface-container-high/30">
          <div className="flex items-center justify-between pb-space-sm mb-space-md">
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-headline-md text-headline-md font-bold text-on-surface">
                  Complaints Volume by Department
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Breakdown by civic domain & current resolution queues
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="px-2 py-1 rounded bg-surface-container text-on-surface font-label-mono-xs text-label-mono-xs">
                Current 7-Day Window
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-space-sm">
            {/* Sanitation */}
            <div
              className="flex flex-col gap-1 cursor-pointer hover:opacity-85 transition-opacity"
              onClick={() => setSelectedDept(selectedDept === 'Sanitation' ? 'All' : 'Sanitation')}
            >
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="font-semibold text-on-surface flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-secondary-container" />
                  Sanitation & Solid Waste
                </span>
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                  412 <span className="text-on-surface-variant font-normal">(28.8%)</span>
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden flex">
                <div className="h-full bg-secondary-container transition-all duration-500" style={{ width: '72%' }} title="Resolved: 296" />
                <div className="h-full bg-primary-container transition-all duration-500" style={{ width: '20%' }} title="In Progress: 82" />
                <div className="h-full bg-error transition-all duration-500" style={{ width: '8%' }} title="Critical: 34" />
              </div>
            </div>

            {/* Roads */}
            <div
              className="flex flex-col gap-1 cursor-pointer hover:opacity-85 transition-opacity"
              onClick={() => setSelectedDept(selectedDept === 'Roads' ? 'All' : 'Roads')}
            >
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="font-semibold text-on-surface flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  Roads & Potholes Infrastructure
                </span>
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                  389 <span className="text-on-surface-variant font-normal">(27.2%)</span>
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden flex">
                <div className="h-full bg-secondary transition-all duration-500" style={{ width: '64%' }} title="Resolved: 249" />
                <div className="h-full bg-primary-container transition-all duration-500" style={{ width: '26%' }} title="In Progress: 101" />
                <div className="h-full bg-error transition-all duration-500" style={{ width: '10%' }} title="Critical: 39" />
              </div>
            </div>

            {/* Water */}
            <div
              className="flex flex-col gap-1 cursor-pointer hover:opacity-85 transition-opacity"
              onClick={() => setSelectedDept(selectedDept === 'Water' ? 'All' : 'Water')}
            >
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="font-semibold text-on-surface flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-on-tertiary-container" />
                  Hydrology & Water Supply
                </span>
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                  295 <span className="text-on-surface-variant font-normal">(20.7%)</span>
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden flex">
                <div className="h-full bg-on-tertiary-container transition-all duration-500" style={{ width: '58%' }} title="Resolved: 171" />
                <div className="h-full bg-primary-container transition-all duration-500" style={{ width: '30%' }} title="In Progress: 88" />
                <div className="h-full bg-error transition-all duration-500" style={{ width: '12%' }} title="Critical: 36" />
              </div>
            </div>

            {/* Electrical */}
            <div
              className="flex flex-col gap-1 cursor-pointer hover:opacity-85 transition-opacity"
              onClick={() => setSelectedDept(selectedDept === 'Electrical' ? 'All' : 'Electrical')}
            >
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="font-semibold text-on-surface flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-surface-tint" />
                  Electrical & Grid Lighting
                </span>
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                  214 <span className="text-on-surface-variant font-normal">(15.0%)</span>
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden flex">
                <div className="h-full bg-surface-tint transition-all duration-500" style={{ width: '60%' }} title="Resolved: 128" />
                <div className="h-full bg-primary-container transition-all duration-500" style={{ width: '32%' }} title="In Progress: 68" />
                <div className="h-full bg-error transition-all duration-500" style={{ width: '8%' }} title="Critical: 18" />
              </div>
            </div>

            {/* Public Safety */}
            <div
              className="flex flex-col gap-1 cursor-pointer hover:opacity-85 transition-opacity"
              onClick={() => setSelectedDept(selectedDept === 'Public Safety' ? 'All' : 'Public Safety')}
            >
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="font-semibold text-on-surface flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                  Public Safety & Hazards
                </span>
                <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                  118 <span className="text-on-surface-variant font-normal">(8.3%)</span>
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden flex">
                <div className="h-full bg-primary-container transition-all duration-500" style={{ width: '52%' }} title="Resolved: 61" />
                <div className="h-full bg-secondary transition-all duration-500" style={{ width: '25%' }} title="In Progress: 30" />
                <div className="h-full bg-error transition-all duration-500" style={{ width: '23%' }} title="Critical: 27" />
              </div>
            </div>
          </div>

          <div className="mt-space-md pt-space-sm flex items-center justify-between flex-wrap gap-space-sm text-on-surface-variant font-label-mono-xs text-label-mono-xs border-t border-surface-container-high/20">
            <div className="flex items-center gap-space-md">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-secondary-container inline-block" /> Resolved
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-primary-container inline-block" /> In Progress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-error inline-block" /> Critical
              </span>
            </div>
            <span>Total Municipal Volume: 1,428</span>
          </div>
        </div>

        {/* Resolution & SLA Gauge */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between border border-surface-container-high/30">
          <div className="flex items-center justify-between pb-space-sm">
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-headline-md text-headline-md font-bold text-on-surface">
                  Resolution & SLA Gauge
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Live municipal performance target: 92.0%
              </span>
            </div>
            <div className="px-space-sm py-0.5 rounded bg-surface-container text-secondary font-label-mono-xs text-label-mono-xs font-semibold">
              TARGET EXCEEDED
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-space-lg my-space-sm">
            {/* SVG Donut Chart */}
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" fill="none" r="48" stroke="#eff4ff" strokeWidth="14" />
                <circle
                  className="transition-all duration-700"
                  cx="60"
                  cy="60"
                  fill="none"
                  r="48"
                  stroke="#0051d5"
                  strokeDasharray="187 302"
                  strokeDashoffset="0"
                  strokeWidth="14"
                />
                <circle
                  className="transition-all duration-700"
                  cx="60"
                  cy="60"
                  fill="none"
                  r="48"
                  stroke="#131b2e"
                  strokeDasharray="72 302"
                  strokeDashoffset="-187"
                  strokeWidth="14"
                />
                <circle
                  className="transition-all duration-700"
                  cx="60"
                  cy="60"
                  fill="none"
                  r="48"
                  stroke="#565e74"
                  strokeDasharray="30 302"
                  strokeDashoffset="-259"
                  strokeWidth="14"
                />
                <circle
                  className="transition-all duration-700"
                  cx="60"
                  cy="60"
                  fill="none"
                  r="48"
                  stroke="#ba1a1a"
                  strokeDasharray="12 302"
                  strokeDashoffset="-289"
                  strokeWidth="14"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-data-metric-lg text-data-metric-lg font-bold text-on-surface tracking-tight">
                  94.2%
                </span>
                <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-semibold">
                  SLA On-Time
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-space-xs w-full max-w-xs">
              <div
                className="flex items-center justify-between p-space-xs rounded bg-surface-container-low font-body-sm text-body-sm cursor-pointer hover:bg-surface-container transition-colors"
                onClick={() => setSelectedStatus(selectedStatus === 'Resolved' ? 'All' : 'Resolved')}
              >
                <span className="flex items-center gap-space-xs text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Resolved
                </span>
                <span className="font-label-mono-sm text-label-mono-sm font-bold text-on-surface">
                  885 (62%)
                </span>
              </div>
              <div
                className="flex items-center justify-between p-space-xs rounded bg-surface-container-low font-body-sm text-body-sm cursor-pointer hover:bg-surface-container transition-colors"
                onClick={() => setSelectedStatus(selectedStatus === 'In Progress' ? 'All' : 'In Progress')}
              >
                <span className="flex items-center gap-space-xs text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container" /> In Progress
                </span>
                <span className="font-label-mono-sm text-label-mono-sm font-bold text-on-surface">
                  342 (24%)
                </span>
              </div>
              <div
                className="flex items-center justify-between p-space-xs rounded bg-surface-container-low font-body-sm text-body-sm cursor-pointer hover:bg-surface-container transition-colors"
                onClick={() => setSelectedStatus(selectedStatus === 'Open' ? 'All' : 'Open')}
              >
                <span className="flex items-center gap-space-xs text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-tint" /> Open / Triage
                </span>
                <span className="font-label-mono-sm text-label-mono-sm font-bold text-on-surface">
                  143 (10%)
                </span>
              </div>
              <div
                className="flex items-center justify-between p-space-xs rounded bg-error-container font-body-sm text-body-sm text-on-error-container cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedSeverity(selectedSeverity === 'Critical' ? 'All' : 'Critical')}
              >
                <span className="flex items-center gap-space-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-error" /> Escalated / Urgent
                </span>
                <span className="font-label-mono-sm text-label-mono-sm font-bold">58 (4%)</span>
              </div>
            </div>
          </div>

          <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface">
              Average Time to Dispatch: <strong className="font-label-mono-sm text-label-mono-sm">18.4 mins</strong>
            </span>
            <span className="font-label-mono-xs text-label-mono-xs text-secondary font-semibold">
              MTTR: 3h 48m
            </span>
          </div>
        </div>
      </div>

      {/* 4. Main Incident Workspace (Filter Bar + Table + Live Incident Stream) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md">
        {/* Table & Filters (Left 9 cols) */}
        <div className="xl:col-span-9 flex flex-col gap-space-md">
          {/* Multi-Criteria Filter Bar */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col gap-space-sm border border-surface-container-high/30">
            {/* Department Filters Tabs */}
            <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs">
              <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-bold pr-space-xs shrink-0">
                Dept:
              </span>
              {(['All', 'Sanitation', 'Roads', 'Water', 'Electrical', 'Public Safety'] as const).map((dept) => {
                const isActive = selectedDept === dept;
                const countMap: Record<string, string> = {
                  All: '1,428',
                  Sanitation: '412',
                  Roads: '389',
                  Water: '295',
                  Electrical: '214',
                  'Public Safety': '118',
                };
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDept(dept)}
                    className={`px-space-sm py-1 rounded font-body-sm text-body-sm whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-primary-container text-on-primary font-semibold'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {dept === 'Public Safety' ? 'Safety' : dept === 'Water' ? 'Water Supply' : dept} ({countMap[dept]})
                  </button>
                );
              })}
            </div>

            {/* Severity & Ward & Search Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
              {/* Severity Pills */}
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-bold pr-space-xs">
                  Priority:
                </span>
                {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((sev) => {
                  const isActive = selectedSeverity === sev;
                  return (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSelectedSeverity(sev)}
                      className={`px-2 py-0.5 rounded font-label-mono-xs text-label-mono-xs font-semibold cursor-pointer transition-all ${
                        sev === 'Critical'
                          ? `bg-error-container text-on-error-container flex items-center gap-1 ${
                              isActive ? 'ring-2 ring-error' : ''
                            }`
                          : isActive
                          ? 'bg-primary-container text-on-primary ring-2 ring-secondary'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {sev === 'Critical' && <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />}
                      {sev.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              {/* Ward, Status & Reset */}
              <div className="flex items-center gap-space-xs flex-wrap">
                <div className="flex items-center bg-surface-container-low rounded px-2 py-1">
                  <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant mr-1">
                    WARD:
                  </span>
                  <select
                    className="bg-transparent font-label-mono-xs text-label-mono-xs font-semibold text-on-surface outline-none cursor-pointer"
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                  >
                    <option value="All">All Wards (1-12)</option>
                    <option value="Ward 1">Ward 01 - Civic Center</option>
                    <option value="Ward 2">Ward 02 - Market Square</option>
                    <option value="Ward 3">Ward 03 - Highgate</option>
                    <option value="Ward 4">Ward 04 - Elmwood</option>
                    <option value="Ward 5">Ward 05 - River District</option>
                    <option value="Ward 6">Ward 06 - Harbor North</option>
                    <option value="Ward 7">Ward 07 - Westside Industrial</option>
                    <option value="Ward 8">Ward 08 - Apex Valley</option>
                    <option value="Ward 9">Ward 09 - Metro South</option>
                    <option value="Ward 10">Ward 10 - Tech Park</option>
                    <option value="Ward 11">Ward 11 - University Hts</option>
                    <option value="Ward 12">Ward 12 - East Perimeter</option>
                  </select>
                </div>

                <div className="flex items-center bg-surface-container-low rounded px-2 py-1">
                  <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant mr-1">
                    STATUS:
                  </span>
                  <select
                    className="bg-transparent font-label-mono-xs text-label-mono-xs font-semibold text-on-surface outline-none cursor-pointer"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Open">Open / Triage</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high font-label-mono-xs text-label-mono-xs text-on-surface flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">restart_alt</span>
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Incident Data Table Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col border border-surface-container-high/30">
            <div className="p-space-md flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-space-sm">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">
                  Active Operations Queue
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-mono-xs text-label-mono-xs font-semibold">
                  {filteredIncidents.length} displayed
                </span>
              </div>
              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  onClick={() => onShowToast('Incident export queued: civicpulse-log-1428.csv')}
                  className="px-space-sm py-1 rounded bg-surface-container-lowest hover:bg-surface-container font-label-mono-xs text-label-mono-xs text-on-surface flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">download</span>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {filteredIncidents.length === 0 ? (
              <div className="p-space-xl flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-space-sm">
                  <span className="material-symbols-outlined text-2xl">search_off</span>
                </div>
                <span className="font-headline-md text-headline-md font-bold text-on-surface">
                  No Incidents Match Selected Filters
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-1">
                  Adjust department, severity, or ward query criteria to view historical records.
                </span>
                <button
                  type="button"
                  className="mt-space-md px-space-md py-1.5 bg-primary-container text-on-primary rounded font-body-sm text-body-sm font-semibold cursor-pointer hover:bg-primary-container/90 transition-colors"
                  onClick={handleResetFilters}
                >
                  Reset Active Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant tracking-wider">
                      <th className="py-space-sm px-space-md">Incident ID</th>
                      <th className="py-space-sm px-space-md">Title & Narrative</th>
                      <th className="py-space-sm px-space-md">Department</th>
                      <th className="py-space-sm px-space-md">Ward & Location</th>
                      <th className="py-space-sm px-space-md">Reported</th>
                      <th className="py-space-sm px-space-md">Severity</th>
                      <th className="py-space-sm px-space-md">Status</th>
                      <th className="py-space-sm px-space-md text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {filteredIncidents.map((incident) => {
                      return (
                        <tr
                          key={incident.id}
                          onClick={() => onOpenIncidentDetail(incident)}
                          className="hover:bg-surface-container-low/70 transition-colors cursor-pointer group"
                        >
                          <td className="py-space-md px-space-md font-label-mono-sm text-label-mono-sm font-bold text-secondary">
                            #{incident.id}
                          </td>
                          <td className="py-space-md px-space-md max-w-xs">
                            <div className="font-body-md text-body-md font-semibold text-on-surface truncate">
                              {incident.title}
                            </div>
                            <div className="font-body-sm text-body-sm text-on-surface-variant truncate">
                              {incident.narrative}
                            </div>
                          </td>
                          <td className="py-space-md px-space-md">
                            <span
                              className={`px-2 py-0.5 rounded font-label-mono-xs text-label-mono-xs font-semibold ${
                                incident.department === 'Water'
                                  ? 'bg-on-tertiary-container/10 text-on-tertiary-container'
                                  : incident.department === 'Roads'
                                  ? 'bg-secondary/10 text-secondary'
                                  : incident.department === 'Electrical'
                                  ? 'bg-surface-tint/10 text-surface-tint'
                                  : incident.department === 'Sanitation'
                                  ? 'bg-secondary-container/10 text-secondary-container'
                                  : 'bg-primary-container/10 text-primary-container'
                              }`}
                            >
                              {incident.department === 'Water'
                                ? 'Water Supply'
                                : incident.department}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md">
                            <div className="font-body-sm text-body-sm text-on-surface font-semibold">
                              {incident.ward}
                            </div>
                            <div className="font-body-sm text-body-sm text-on-surface-variant text-xs truncate">
                              {incident.location}
                            </div>
                          </td>
                          <td className="py-space-md px-space-md font-label-mono-xs text-label-mono-xs text-on-surface-variant">
                            {incident.reportedTime}
                          </td>
                          <td className="py-space-md px-space-md">
                            {incident.severity === 'Critical' ? (
                              <span className="px-2 py-0.5 rounded font-label-mono-xs text-label-mono-xs font-bold bg-error-container text-on-error-container inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                                CRITICAL
                              </span>
                            ) : incident.severity === 'High' ? (
                              <span className="px-2 py-0.5 rounded font-label-mono-xs text-label-mono-xs font-bold bg-surface-container text-on-surface inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                HIGH
                              </span>
                            ) : incident.severity === 'Medium' ? (
                              <span className="px-2 py-0.5 rounded font-label-mono-xs text-label-mono-xs font-bold bg-surface-container-high text-on-surface inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                                MEDIUM
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded font-label-mono-xs text-label-mono-xs font-semibold bg-surface-container-low text-on-surface">
                                LOW
                              </span>
                            )}
                          </td>
                          <td className="py-space-md px-space-md">
                            <span
                              className={`px-2 py-0.5 rounded font-label-mono-xs text-label-mono-xs font-semibold ${
                                incident.status === 'Resolved'
                                  ? 'bg-secondary text-on-secondary'
                                  : incident.status === 'In Progress'
                                  ? 'bg-primary-container text-on-primary'
                                  : 'bg-surface-container text-on-surface'
                              }`}
                            >
                              {incident.status}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md text-right">
                            <button
                              type="button"
                              className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-base">
                                arrow_forward
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer Pagination */}
            <div className="p-space-md bg-surface-container-low flex items-center justify-between text-on-surface-variant font-label-mono-xs text-label-mono-xs">
              <span>Showing {filteredIncidents.length} of 1,428 active records</span>
              <div className="flex items-center gap-space-xs">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>
                <span className="px-2 py-1 bg-primary-container text-on-primary rounded font-bold">
                  {currentPage}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(3)}
                  className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                >
                  3
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className="px-2 py-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Incident Stream & GIS Preview (Right 3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-space-md">
          {/* Live Incident Stream Widget */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col border border-surface-container-high/30">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface font-bold tracking-wider">
                  Live Incident Stream
                </span>
              </div>
              <span className="font-label-mono-xs text-label-mono-xs text-secondary font-semibold">
                FEED ACTIVE
              </span>
            </div>

            <div className="flex flex-col gap-space-sm mt-space-sm">
              {/* Event 1 */}
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 transition-all hover:bg-surface-container">
                <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs">
                  <span className="text-error font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-error" />
                    CRITICAL ESCALATION
                  </span>
                  <span className="text-on-surface-variant">42s ago</span>
                </div>
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                  911 CAD Ingest: Main Gas Leak Check
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  Ward 8 • Apex Valley Corridor • Crew #09 Dispatched
                </span>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-label-mono-xs text-label-mono-xs text-secondary">#CAD-9012</span>
                  <button
                    type="button"
                    onClick={() => {
                      const item = incidents.find((i) => i.id === 'INC-8942');
                      if (item) onOpenIncidentDetail(item);
                    }}
                    className="text-secondary font-label-mono-xs text-label-mono-xs font-semibold hover:underline cursor-pointer"
                  >
                    Inspect
                  </button>
                </div>
              </div>

              {/* Event 2 */}
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 transition-all hover:bg-surface-container">
                <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs">
                  <span className="text-secondary font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    CREW DISPATCH
                  </span>
                  <span className="text-on-surface-variant">3m ago</span>
                </div>
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                  Unit Engine 4B En Route
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  Assigned to #INC-8941 (Elmwood Blvd Pothole)
                </span>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant">ETA: 6 mins</span>
                  <span className="font-label-mono-xs text-label-mono-xs text-secondary font-semibold">GPS LOCKED</span>
                </div>
              </div>

              {/* Event 3 */}
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 transition-all hover:bg-surface-container">
                <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs">
                  <span className="text-secondary-container font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                    SLA RESOLUTION
                  </span>
                  <span className="text-on-surface-variant">8m ago</span>
                </div>
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                  Sanitation Crew #14 Closed Ticket
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  #INC-8935 verified resolved by citizen SMS
                </span>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-label-mono-xs text-label-mono-xs text-secondary font-semibold">
                    SLA: 1h 22m (Fast)
                  </span>
                  <span className="material-symbols-outlined text-secondary text-sm">verified</span>
                </div>
              </div>

              {/* Event 4 */}
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 transition-all hover:bg-surface-container">
                <div className="flex items-center justify-between font-label-mono-xs text-label-mono-xs">
                  <span className="text-on-surface font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-surface" />
                    AI SENSOR TRIGGER
                  </span>
                  <span className="text-on-surface-variant">14m ago</span>
                </div>
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                  Acoustic Water Sensor Node #A-14
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  Pressure spike detected at Ward 7 basin main line
                </span>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-label-mono-xs text-label-mono-xs text-error font-bold">Auto-Triage INC-8942</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">sensors</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onShowToast('Displaying 42 telemetry events from past shift Alpha.')}
              className="mt-space-md w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high font-label-mono-xs text-label-mono-xs text-on-surface font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">history</span>
              <span>View Telemetry Audit Log</span>
            </button>
          </div>

          {/* Quick GIS Jurisdiction Map Preview */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col gap-space-sm border border-surface-container-high/30">
            <div className="flex items-center justify-between">
              <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-bold">
                Metropolitan Ward Coverage
              </span>
              <span className="font-label-mono-xs text-label-mono-xs text-secondary font-semibold">GIS LIVE</span>
            </div>
            <div
              className="w-full h-44 bg-cover bg-center rounded-lg relative overflow-hidden flex items-end p-space-sm"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCUMu07HllrOiF-yjUJEl8K5bjesfWdXgTUT9UzNa9sciy5OCZE2iWAHisv6l4CMZccpE4jYOvacTXymDKzIAOnmsmYuNLNhClJvzv6BrvFA3lgw9NZyENKqRhfQiUQtGYWQ3f1EMMvfX9Gc_DrO35eV5vsAr8hdcM9VZh2sQH9iRrtji1aqqPp2pQT6nOc_5S19mjNQhEh8MuPjC0otuInoVpM-IY44q8d5ub_JVpcnGW4jHyu-VV-')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="relative z-10 flex items-center justify-between w-full text-on-primary">
                <div>
                  <span className="font-body-sm text-body-sm font-bold block">Central Sector - 12 Wards</span>
                  <span className="font-label-mono-xs text-label-mono-xs text-inverse-on-surface">
                    3 Active Dispatch Geo-Zones
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onShowToast('GIS Map full multi-layer vector display opened.')}
                  className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-label-mono-xs text-label-mono-xs font-semibold cursor-pointer hover:bg-secondary/90"
                >
                  EXPAND
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-space-xs font-label-mono-xs text-label-mono-xs">
              <div className="p-2 rounded bg-surface-container-low flex flex-col">
                <span className="text-on-surface-variant">ACTIVE UNITS</span>
                <span className="font-bold text-on-surface mt-0.5 text-sm">28 Engaged</span>
              </div>
              <div className="p-2 rounded bg-surface-container-low flex flex-col">
                <span className="text-on-surface-variant">EST. RESPONSE</span>
                <span className="font-bold text-on-surface mt-0.5 text-sm">14.6 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Slide-Over Incident Details Drawer Modal */}
      {selectedIncident && (
        <>
          <div
            className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={onCloseDrawer}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-surface-container-lowest shadow-2xl z-50 flex flex-col justify-between border-l border-surface-container-high transition-transform duration-300">
            {/* Drawer Header */}
            <div className="p-space-lg bg-surface-container-low flex items-center justify-between border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <span className="font-label-mono-sm text-label-mono-sm font-bold text-secondary">
                  #{selectedIncident.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-label-mono-xs text-label-mono-xs font-bold ${
                    selectedIncident.severity === 'Critical'
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-surface-container text-on-surface'
                  }`}
                >
                  {selectedIncident.severity.toUpperCase()}
                </span>
              </div>
              <button
                type="button"
                onClick={onCloseDrawer}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-space-lg flex-1 overflow-y-auto flex flex-col gap-space-md">
              <div>
                <span className="px-2 py-0.5 rounded font-label-mono-xs text-label-mono-xs font-semibold bg-on-tertiary-container/10 text-on-tertiary-container">
                  {selectedIncident.department} Operations
                </span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface mt-space-xs">
                  {selectedIncident.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
                  {selectedIncident.narrative}
                </p>
              </div>

              {/* Photo Evidence */}
              <div className="flex flex-col gap-1">
                <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-bold">
                  Citizen & Field Evidence Media
                </span>
                <div className="relative w-full h-44 rounded-lg overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover"
                    alt="Civic field photograph of municipal incident"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8TjJ4var05_jZWyQanwA_7TENaSn3U8Qk99z_rs5foa6oneh7KIDiNWjFHqztk_aiDSd6Z7qVpKdTz7OEjiS9qUYQ0zOAgIj-mwUwqNkkjsJEOJ0iFozmUmxyPyTI4c_hCULI0vlu66pdq5FTa4ShaMgipeIHaBqKFFHT86EGv-J8m8cm-cQ9YBgBtVtz86V3hBrQvo23xjtSOVQechyqFASl36ZmQOisnC2Z0pC21vxUxRVwf27T"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-inverse-surface/80 text-inverse-on-surface font-label-mono-xs text-label-mono-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">photo_camera</span>
                    <span>CITIZEN ATTACHMENT • 2.4 MB</span>
                  </div>
                </div>
              </div>

              {/* Key Metadata Panel */}
              <div className="grid grid-cols-2 gap-space-sm bg-surface-container-low p-space-md rounded-lg font-body-sm text-body-sm">
                <div>
                  <span className="text-on-surface-variant font-label-mono-xs text-label-mono-xs uppercase block">
                    Location / Ward
                  </span>
                  <span className="font-semibold text-on-surface">
                    {selectedIncident.ward} - {selectedIncident.location}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant font-label-mono-xs text-label-mono-xs uppercase block">
                    Reported Timestamp
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                    {selectedIncident.timestamp}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant font-label-mono-xs text-label-mono-xs uppercase block">
                    Citizen Reporter Contact
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm font-semibold text-on-surface">
                    {selectedIncident.reporterPhone || '+1 (555) 019-8234'}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant font-label-mono-xs text-label-mono-xs uppercase block">
                    SLA Target Countdown
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm font-bold text-error flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">timer</span> {selectedIncident.slaRemaining}
                  </span>
                </div>
              </div>

              {/* Field Unit Assignment */}
              <div className="p-space-md rounded-lg bg-surface-container flex flex-col gap-space-xs">
                <span className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-bold">
                  Assigned Field Unit
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-base">local_shipping</span>
                    </div>
                    <div>
                      <span className="font-body-md text-body-md font-bold text-on-surface">
                        {selectedIncident.assignedUnit || 'Unit Hydro-04 (Emergency Crew)'}
                      </span>
                      <span className="font-label-mono-xs text-label-mono-xs text-on-surface-variant block">
                        Lead: {selectedIncident.assignedLead || 'Specialist K. Chen • 3 Technicians'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onShowToast(`Unit re-assignment request sent to CAD Controller.`)}
                    className="px-space-sm py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded text-on-surface font-label-mono-xs text-label-mono-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Reassign
                  </button>
                </div>
              </div>

              {/* Status Update Form */}
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-mono-xs text-label-mono-xs uppercase text-on-surface-variant font-bold">
                  Update Operational Status
                </label>
                <div className="flex gap-space-xs">
                  <select
                    className="flex-1 h-9 px-space-sm bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface font-semibold outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
                    value={drawerStatus}
                    onChange={(e) => setDrawerStatus(e.target.value as IncidentStatus)}
                  >
                    <option value="Open">Open / Triage</option>
                    <option value="In Progress">In Progress (Crew Active)</option>
                    <option value="Resolved">Resolved (Complete Field Verification)</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleSaveDrawerStatus}
                    className="px-space-md h-9 bg-primary-container text-on-primary rounded-lg font-body-sm text-body-sm font-semibold hover:bg-primary-container/90 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">check</span>
                    <span>Update</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-space-md bg-surface-container-low flex items-center justify-between border-t border-surface-container">
              <button
                type="button"
                onClick={onCloseDrawer}
                className="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-body-sm text-body-sm text-on-surface font-semibold transition-colors cursor-pointer"
              >
                Close Panel
              </button>
              <button
                type="button"
                onClick={handleEscalateToMayor}
                className="px-space-md py-1.5 rounded-lg bg-error text-on-error font-body-sm text-body-sm font-semibold hover:bg-error/90 flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">notification_important</span>
                <span>Escalate to Mayor's Desk</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
