import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon paths (a common Leaflet + bundler issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Adama City approx. center
const ADAMA_CENTER = [8.541, 39.268];

export default function CctvMap({ cameras = [], height = '400px' }) {
  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer center={ADAMA_CENTER} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cameras.map((c) => (
          <Marker key={c.camera_id} position={[c.latitude, c.longitude]}>
            <Popup>
              <strong>{c.camera_name}</strong>
              <br />
              {c.ownership_type} — {c.verification_status}
              <br />
              {c.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}