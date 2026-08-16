import { useEffect, useState } from 'react';
import { getMyCameras } from '../services/api';

export default function MyCctv() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyCameras()
      .then((res) => {
        if (res.error) setError(res.error);
        else setCameras(res.cameras || []);
      })
      .catch(() => setError('Could not load your cameras.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading your cameras...</p>;
  if (error) return <p>{error}</p>;
  if (cameras.length === 0) return <p>You haven't registered any cameras yet.</p>;

  return (
    <div className="card">
      <h2>My CCTV Cameras</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Address</th>
            <th>Verification</th>
          </tr>
        </thead>
        <tbody>
          {cameras.map((c) => (
            <tr key={c.camera_id}>
              <td>{c.camera_name}</td>
              <td>{c.ownership_type}</td>
              <td>{c.address}</td>
              <td>{c.verification_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}