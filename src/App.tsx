import React from 'react';
import { SalonProvider, useSalon } from './context/SalonContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ServicesView } from './components/ServicesView';
import { TeamView } from './components/TeamView';
import { AdminView } from './components/AdminView';
import { WorkerDashboard } from './components/WorkerDashboard';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';

const MainContent: React.FC = () => {
  const { currentPage } = useSalon();

  return (
    <>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 180px)' }}>
        {currentPage === 'home' && <HomeView />}
        {currentPage === 'services' && <ServicesView />}
        {currentPage === 'team' && <TeamView />}
        {currentPage === 'worker-dashboard' && <WorkerDashboard />}
        {currentPage === 'admin' && <AdminView />}
      </div>
      <BookingConfirmationModal />
      <Footer />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <SalonProvider>
      <MainContent />
    </SalonProvider>
  );
};

export default App;
