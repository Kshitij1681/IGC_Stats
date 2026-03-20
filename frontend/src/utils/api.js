const BASE = '/api';

const getHeaders = (token, isJson = true) => {
  const h = {};
  if (isJson) h['Content-Type'] = 'application/json';
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
};

// Public bowler endpoints
export const fetchBowlers = async () => {
  const res = await fetch(`${BASE}/bowlers`);
  return res.json();
};

export const fetchRankings = async () => {
  const res = await fetch(`${BASE}/bowlers/rankings`);
  return res.json();
};

export const fetchBowlerById = async (id) => {
  const res = await fetch(`${BASE}/bowlers/${id}`);
  return res.json();
};

// Bowler of week
export const fetchBowlerOfWeek = async () => {
  const res = await fetch(`${BASE}/bowler-of-week/current`);
  return res.json();
};

export const fetchBowlerOfWeekHistory = async () => {
  const res = await fetch(`${BASE}/bowler-of-week/history`);
  return res.json();
};

// Admin endpoints
export const adminFetchBowlers = async (token) => {
  const res = await fetch(`${BASE}/admin/bowlers`, {
    headers: getHeaders(token)
  });
  return res.json();
};

export const adminAddBowler = async (token, data) => {
  const res = await fetch(`${BASE}/admin/bowlers`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const adminUpdateBowler = async (token, id, data) => {
  const res = await fetch(`${BASE}/admin/bowlers/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const adminUpdateStats = async (token, id, type, stats) => {
  const res = await fetch(`${BASE}/admin/bowlers/${id}/stats`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify({ type, stats })
  });
  return res.json();
};

export const adminDeleteBowler = async (token, id) => {
  const res = await fetch(`${BASE}/admin/bowlers/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });
  return res.json();
};

export const adminAnnounceBowlerOfWeek = async (token, data) => {
  const res = await fetch(`${BASE}/bowler-of-week`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const adminDeleteBowlerOfWeek = async (token, id) => {
  const res = await fetch(`${BASE}/bowler-of-week/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });
  return res.json();
};
