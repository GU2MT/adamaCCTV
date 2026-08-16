import { useEffect, useState } from 'react';
import { getAllIncidents, findNearbyCameras } from '../services/api';

export default function PoliceIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [nearbyByIncident, setNearbyByIncident] = useState({});

  useEffect(() => {
    getAllIncidents()
      .then((res) => {
        if (res.error) setError(res.error);
        else setIncidents(res.incidents || []);
      })
      .catch(() => setError('Could not load incidents.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleNearby = async (incident) => {
    if (expandedId === incident.incident_id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(incident.incident_id);

    if (!nearbyByIncident[incident.incident_id]) {
      const res = await findNearbyCameras(incident.latitude, incident.longitude, 500);
      setNearbyByIncident((prev) => ({ ...prev, [incident.incident_id]: res || [] }));
    }
  };

  if (loading) return <p>Loading incidents...</p>;
  if (error) return <p>{error}</p>;
  if (incidents.length === 0) return <p>No incidents reported yet.</p>;

  return (
    <div className="card">
      <h2>Reported Incidents</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((i) => (
            <>
              <tr key={i.incident_id}>
                <td>{i.incident_type}</td>
                <td>{i.description}</td>
                <td>{new Date(i.incident_time).toLocaleString()}</td>
                <td>{i.status}</td>
                <td>
                  <button type="button" onClick={() => toggleNearby(i)}>
                    {expandedId === i.incident_id ? 'Hide' : 'Nearby Cameras'}
                  </button>
                </td>
              </tr>
              {expandedId === i.incident_id && (
                <tr>
                  <td colSpan={5}>
                    <strong>Nearby verified cameras:</strong>
                    <ul>
                      {(nearbyByIncident[i.incident_id] || []).length === 0 ? (
                        <li>None found within 500m.</li>
                      ) : (
                        nearbyByIncident[i.incident_id].map((c) => (
                          <li key={c.camera_id}>
                            {c.camera_name} — {Math.round(c.distance_meters)} m — {c.address}
                          </li>
                        ))
                      )}
                    </ul>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
