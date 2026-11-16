import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppErrorBoundary } from './shared/components/AppErrorBoundary';
import { MaintenancePage } from './features/maintenance/MaintenancePage';
import { MAINTENANCE_MODE } from './features/maintenance/maintenanceConfig';
import './style.css';
import './demo.css';
import './appearance.css';
import './fallback.css';
import './path.css';
import './discovery.css';
import './research.css';
import './v2.css';
import './features/assessment/assessment.css';

if (MAINTENANCE_MODE) {
  document.title = 'Estude com Calma — voltamos em breve';
  const robots = document.createElement('meta');
  robots.name = 'robots';
  robots.content = 'noindex, nofollow';
  document.head.append(robots);
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>{MAINTENANCE_MODE ? <MaintenancePage /> : <App />}</AppErrorBoundary>
  </React.StrictMode>,
);
