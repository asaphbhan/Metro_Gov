/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MissionSystemTab, Incident, WardData, IncidentStatus } from './types';
import { INITIAL_INCIDENTS } from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { IncidentOperationsView } from './components/operations/IncidentOperationsView';
import { WardAnalyticsView } from './components/analytics/WardAnalyticsView';
import { LiveDispatchView } from './components/dispatch/LiveDispatchView';
import { AiSpecWorkspaceView } from './components/spec/AiSpecWorkspaceView';
import { SystemSettingsView } from './components/settings/SystemSettingsView';
import { Toast } from './components/common/Toast';
import { BroadcastAlertModal } from './components/modals/BroadcastAlertModal';
import { WardDossierModal } from './components/modals/WardDossierModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<MissionSystemTab>('incident-operations');
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedWardForDossier, setSelectedWardForDossier] = useState<WardData | null>(null);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState('Metro Central - Zone 01');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  const handleUpdateIncidentStatus = (id: string, newStatus: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleBroadcastAlert = (message: string, sector: string, urgency: string) => {
    showToast(`Emergency alert broadcast transmitted to ${sector} [${urgency}].`);
  };

  const handleInterveneWard = (wardCode: string) => {
    showToast(`Rapid Intervention Taskforce deployed to ${wardCode}.`);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen antialiased">
      {/* 1. Fixed Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedZone={selectedZone}
        onChangeZone={(zone) => {
          setSelectedZone(zone);
          showToast(`Jurisdiction zone switched to: ${zone}`);
        }}
      />

      {/* 2. Main Workspace Layout */}
      <div className="pl-72">
        {/* Fixed Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearch={(q) => setSearchQuery(q)}
          onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
        />

        {/* Content Viewport */}
        <main className="relative pt-16 bg-surface min-h-screen w-full px-space-lg pb-space-xl">
          <div className="py-space-md">
            {activeTab === 'incident-operations' && (
              <IncidentOperationsView
                incidents={incidents}
                onUpdateIncidentStatus={handleUpdateIncidentStatus}
                onShowToast={showToast}
                onOpenIncidentDetail={(inc) => setSelectedIncident(inc)}
                selectedIncident={selectedIncident}
                onCloseDrawer={() => setSelectedIncident(null)}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'ward-analytics' && (
              <WardAnalyticsView
                onOpenWardDossier={(ward) => setSelectedWardForDossier(ward)}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'live-dispatch-and-field-units' && (
              <LiveDispatchView
                onShowToast={showToast}
                onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
              />
            )}

            {activeTab === 'ai-prompt-engineering-and-ese-spec-workspace' && (
              <AiSpecWorkspaceView onShowToast={showToast} />
            )}

            {activeTab === 'system-settings' && (
              <SystemSettingsView
                onShowToast={showToast}
                selectedZone={selectedZone}
                onChangeZone={(zone) => {
                  setSelectedZone(zone);
                  showToast(`Jurisdiction zone updated to: ${zone}`);
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals & Feedback */}
      <BroadcastAlertModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onBroadcast={handleBroadcastAlert}
      />

      <WardDossierModal
        ward={selectedWardForDossier}
        isOpen={!!selectedWardForDossier}
        onClose={() => setSelectedWardForDossier(null)}
        onIntervene={handleInterveneWard}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
