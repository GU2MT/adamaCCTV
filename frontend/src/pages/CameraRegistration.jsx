import { useState } from 'react';
import { registerCamera } from '../services/api';

export default function CameraRegistration() {
  const [form, setForm] = useState({ camera_type: 'PRIVATE', establishment_name: '', address_kebele: '', coverage_direction: '', latitude: '', longitude: '' });
  const [message, setMessage] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      owner_id: null,
      camera_type: form.camera_type,
      establishment_name: form.establishment_name,
      address_kebele: form.address_kebele,
      coverage_direction: form.coverage_direction,
      location: { latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude) }
    };

    const res = await registerCamera(payload);
    if (res.error) setMessage(res.error);
    else setMessage('Camera registration submitted. Awaiting verification.');
  };

  return (
    <div className="card">
      <h2>Register CCTV Camera</h2>
      {message && <p>{message}</p>}
      <form onSubmit={onSubmit}>
        <label>Type
          <select name="camera_type" value={form.camera_type} onChange={onChange}>
            <option value="PRIVATE">Private</option>
            <option value="PUBLIC">Public</option>
          </select>
        </label>
        <label>Establishment Name
          <input name="establishment_name" value={form.establishment_name} onChange={onChange} />
        </label>
        <label>Address / Kebele
          <input name="address_kebele" value={form.address_kebele} onChange={onChange} />
        </label>
        <label>Coverage Direction
          <input name="coverage_direction" value={form.coverage_direction} onChange={onChange} />
        </label>
        <label>Latitude
          <input name="latitude" value={form.latitude} onChange={onChange} />
        </label>
        <label>Longitude
          <input name="longitude" value={form.longitude} onChange={onChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
