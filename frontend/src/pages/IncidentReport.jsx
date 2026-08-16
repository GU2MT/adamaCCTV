import { useState } from 'react';
import { reportIncident, findNearbyCameras } from '../services/api';

export default function IncidentReport() {
  const [form, setForm] = useState({ incident_type: 'THEFT', description: '', incident_time: '', latitude: '', longitude: '' });
  const [message, setMessage] = useState(null);
  const [nearby, setNearby] = useState([]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      incident_type: form.incident_type,
      description: form.description,
      incident_time: form.incident_time,
      location: { latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude) }
    };

    const res = await reportIncident(payload);
    if (res.error) setMessage(res.error);
    else {
      setMessage('Incident reported. Nearby cameras returned.');
      setNearby(res.nearby_cameras || []);
    }
  };

  const checkNearby = async () => {
    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    if (!lat || !lng) return;
    const res = await findNearbyCameras(lat, lng, 500);
    setNearby(res || []);
  };

  return (
    <div className="card">
      <h2>Report Incident</h2>
      {message && <p>{message}</p>}
      <form onSubmit={onSubmit}>
        <label>Type
          <select name="incident_type" value={form.incident_type} onChange={onChange}>
            <option value="THEFT">Theft</option>
            <option value="ACCIDENT">Accident</option>
            <option value="VANDALISM">Vandalism</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label>Description
          <textarea name="description" value={form.description} onChange={onChange} />
        </label>
        <label>Incident Time
          <input type="datetime-local" name="incident_time" value={form.incident_time} onChange={onChange} />
        </label>
        <label>Latitude
          <input name="latitude" value={form.latitude} onChange={onChange} />
        </label>
        <label>Longitude
          <input name="longitude" value={form.longitude} onChange={onChange} />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={checkNearby}>Check Nearby Cameras</button>
          <button type="submit">Report Incident</button>
        </div>
      </form>

      <section>
        <h3>Nearby Verified Cameras</h3>
        <ul>
          {nearby.map((c) => (
            <li key={c.camera_id}>{c.camera_name} — {Math.round(c.distance_meters)} m — {c.address}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}