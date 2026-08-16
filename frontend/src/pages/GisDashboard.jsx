import { useEffect, useState } from 'react';
import { getAllCamerasForMap } from '../services/api';
import CctvMap from '../components/CctvMap';

export default function GisDashboard() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllCamerasForMap()
      .then((res) => {
        if (res.error) setError(res.error);
        else setCameras(res.cameras || []);
      })
      .catch(() => setError('Could not load camera map data.'))
      .finally(() => setLoading(false));
  }, []);

  const verifiedCount = cameras.filter((c) => c.verification_status === 'VERIFIED').length;
  const pendingCount = cameras.filter((c) => c.verification_status === 'PENDING').length;

  return (
    <div className="card">
      <h2>GIS Dashboard</h2>
      {loading && <p>Loading map...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <p>
            {cameras.length} total cameras — {verifiedCount} verified, {pendingCount} pending
          </p>
          <CctvMap cameras={cameras} height="500px" />
        </>
      )}
    </div>
  );
}
