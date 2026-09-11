import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DashboardLayout } from './layouts/DashboardLayout';

import { DashboardPage } from './pages/DashboardPage';
import { BinMonitoringPage } from './pages/BinMonitoringPage';
import { AIPredictionsPage } from './pages/AIPredictionsPage';
import { WasteDetectionPage } from './pages/WasteDetectionPage';
import { RoutePlannerPage } from './pages/RoutePlannerPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { CitizenReportsPage } from './pages/CitizenReportsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/monitoring" element={<BinMonitoringPage />} />
              <Route path="/predictions" element={<AIPredictionsPage />} />
              <Route path="/waste-detection" element={<WasteDetectionPage />} />
              <Route path="/routes" element={<RoutePlannerPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/reports" element={<CitizenReportsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DashboardLayout>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
