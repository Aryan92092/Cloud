import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import ResultProcessingPage from './pages/ResultProcessingPage';
import RankingEnginePage from './pages/RankingEnginePage';
import AlgorithmVisualizerPage from './pages/AlgorithmVisualizerPage';
import AlgorithmComparisonPage from './pages/AlgorithmComparisonPage';
import SearchPage from './pages/SearchPage';
import MeritListPage from './pages/MeritListPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AboutDAAPage from './pages/AboutDAAPage';
import SettingsPage from './pages/SettingsPage';
import StudentModal from './components/students/StudentModal';
import { useStudents } from './context/StudentContext';

export default function App() {
  const { isAuthenticated } = useAuth();
  const { addStudent } = useStudents();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage setCurrentPage={setCurrentPage} />;
      case 'students': return <StudentsPage />;
      case 'results': return <ResultProcessingPage />;
      case 'ranking': return <RankingEnginePage />;
      case 'visualizer': return <AlgorithmVisualizerPage />;
      case 'comparison': return <AlgorithmComparisonPage />;
      case 'search': return <SearchPage />;
      case 'merit': return <MeritListPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'about-daa': return <AboutDAAPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="no-print"><Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} /></div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="no-print"><Navbar currentPage={currentPage} onOpenAddStudent={() => setIsAddModalOpen(true)} /></div>
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (data) => {
          await addStudent(data);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}
