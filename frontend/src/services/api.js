const API_BASE = import.meta.env.VITE_API_BASE || '';

function authHeaders() {
  try {
    const stored = localStorage.getItem('adama-cctv-session');
    if (!stored) return {};
    const session = JSON.parse(stored);
    return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
  } catch (e) {
    return {};
  }
}

export async function health() {
  const res = await fetch(`${API_BASE}/api/health`);
  return res.json();
}

export async function registerCamera(payload) {
  const res = await fetch(`${API_BASE}/api/cctv/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function reportIncident(payload) {
  const res = await fetch(`${API_BASE}/api/incidents/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function findNearbyCameras(lat, lng, radius) {
  const q = new URLSearchParams({ lat: lat.toString(), lng: lng.toString(), radius: (radius || 200).toString() });
  const res = await fetch(`${API_BASE}/api/cctv/nearby?${q}`, {
    headers: { ...authHeaders() },
  });
  return res.json();
}
export async function getMyCameras() {
  const res = await fetch(`${API_BASE}/api/cctv/my`, {
    headers: { ...authHeaders() },
  });
  return res.json();
}
export async function getPendingCameras() {
  const res = await fetch(`${API_BASE}/api/cctv/pending`, {
    headers: { ...authHeaders() },
  });
  return res.json();
}

export async function verifyCamera(camera_id, decision) {
  const res = await fetch(`${API_BASE}/api/cctv/${camera_id}/verify`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ decision }),
  });
  return res.json();
}
export async function getAllCamerasForMap() {
  const res = await fetch(`${API_BASE}/api/cctv/map`, {
    headers: { ...authHeaders() },
  });
  return res.json();
}
export async function getAllIncidents() {
  const res = await fetch(`${API_BASE}/api/incidents`, {
    headers: { ...authHeaders() },
  });
  return res.json();
}