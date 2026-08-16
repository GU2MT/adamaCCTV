import { useEffect, useState } from 'react';
import { getPendingCameras, verifyCamera } from '../services/api';

export default function VerifyCctv() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const loadPending = () => {
    setLoading(true);
    getPendingCameras()
      .then((res) => {
        if (res.error) setError(res.error);
        else {
          setCameras(res.cameras || []);
          setError(null);
        }
      })
      .catch(() => setError('Could not load pending cameras.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleDecision = async (camera_id, decision) => {
    setActionMessage(null);
    const res = await verifyCamera(camera_id, decision);
    if (res.error) {
      setActionMessage(res.error);
    } else {
      setActionMessage(`Camera ${decision}d successfully.`);
      loadPending(); // refresh the list
    }
  };

  if (loading) return <p>Loading pending cameras...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="card">
      <h2>Verify CCTV Cameras</h2>
      {actionMessage && <p>{actionMessage}</p>}

      {cameras.length === 0 ? (
        <p>No cameras waiting for verification.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Address</th>
              <th>Direction</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cameras.map((c) => (
              <tr key={c.camera_id}>
                <td>{c.camera_name}</td>
                <td>{c.ownership_type}</td>
                <td>{c.address}</td>
                <td>{c.viewing_direction}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => handleDecision(c.camera_id, 'approve')}>
                    Approve
                  </button>
                  <button type="button" onClick={() => handleDecision(c.camera_id, 'reject')}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}