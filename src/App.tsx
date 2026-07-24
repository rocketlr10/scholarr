import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CommandPalette } from './components/CommandPalette';
import { QuickAddModal } from './components/QuickAddModal';
import { AuthModal } from './components/AuthModal';
import { SchoologyTutorialModal } from './components/modals/SchoologyTutorialModal';

import { DashboardView } from './components/views/DashboardView';
import { AssignmentsView } from './components/views/AssignmentsView';
import { CalendarView } from './components/views/CalendarView';
import { StudyTimerView } from './components/views/StudyTimerView';
import { SubjectsView } from './components/views/SubjectsView';
import { NotesView } from './components/views/NotesView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'calendar':
        return <CalendarView />;
      case 'study':
        return <StudyTimerView />;
      case 'subjects':
        return <SubjectsView />;
      case 'notes':
        return <NotesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-200 flex selection:bg-indigo-500/30 selection:text-white relative overflow-hidden">
      {/* Background Ambient Radial Glows */}
      <div className="fixed top-[-100px] left-[-100px] w-[400px] h-[400px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 max-w-7xl mx-auto px-2 sm:px-4">
        <Header />
        <main className="flex-1 px-2 sm:px-4 pt-4">
          {renderView()}
        </main>
      </div>

      {/* Global Dialogs & Modals */}
      <NotificationDrawer />
      <CommandPalette />
      <QuickAddModal />
      <AuthModal />
      <SchoologyTutorialModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
