import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CameraRegistration from './CameraRegistration';
import MyCctv from './MyCctv';
import IncidentReport from './IncidentReport';
import VerifyCctv from './VerifyCctv';
import GisDashboard from './GisDashboard';
import PoliceIncidents from './PoliceIncidents';

const viewsByLabel = {
  'Register CCTV': CameraRegistration,
  'My CCTV': MyCctv,
  'Report Incident': IncidentReport,
  'Verify CCTV': VerifyCctv,
  'GIS Dashboard': GisDashboard,
  'View Incidents': PoliceIncidents,
};
const dashboardItemsByRole = {
  Citizen: [
    'Register CCTV',
    'Report Incident',
    'My CCTV',
    'My Reports',
    'Profile',
  ],
  Police: [
    'View Incidents',
    'Nearby Cameras',
    'GIS Map',
    'Camera Requests',
    'Reports',
  ],
  Administrator: [
    'Manage Users',
    'Verify CCTV',
    'GIS Dashboard',
    'Statistics',
    'Settings',
  ],
};

// Maps a card label to the component it should open.
// Add more entries here as each page gets built.


export default function Dashboard() {
  const { user, signOut } = useAuth();
  const role = user?.role || 'Citizen';
  const items = dashboardItemsByRole[role] || dashboardItemsByRole.Citizen;
  const [activeView, setActiveView] = useState(null);

  const ActiveComponent = activeView ? viewsByLabel[activeView] : null;

  if (ActiveComponent) {
    return (
      <div className="dashboard-shell">
        <button
          type="button"
          className="auth-button secondary"
          onClick={() => setActiveView(null)}
        >
          ← Back to Dashboard
        </button>
        <ActiveComponent />
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Adama CCTV & GIS System</p>
          <h1>Dashboard</h1>
          <p className="dashboard-welcome">
            Welcome back, {user?.first_name} {user?.last_name} ({role})
          </p>
        </div>

        <button className="auth-button secondary" type="button" onClick={signOut}>
          Sign Out
        </button>
      </header>

      <section className="dashboard-overview">
        <h2>Your quick actions</h2>
        <div className="dashboard-cards">
          {items.map((entry) => (
            <div
              key={entry}
              className="dashboard-card"
              onClick={() => viewsByLabel[entry] && setActiveView(entry)}
              style={{ cursor: viewsByLabel[entry] ? 'pointer' : 'default', opacity: viewsByLabel[entry] ? 1 : 0.5 }}
            >
              <strong>{entry}</strong>
              {!viewsByLabel[entry] && <p style={{ fontSize: '12px', margin: '4px 0 0' }}>Coming soon</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}