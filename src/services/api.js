// API Service for GDG on Campus SATI Vidisha Frontend

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('gdg_token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

export const api = {
  // Auth
  auth: {
    signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
    sendSignupOtp: (body) => request('/auth/send-signup-otp', { method: 'POST', body: JSON.stringify(body) }),
    verifySignupOtp: (body) => request('/auth/verify-signup-otp', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    sendLoginOtp: (body) => request('/auth/send-login-otp', { method: 'POST', body: JSON.stringify(body) }),
    verifyLoginOtp: (body) => request('/auth/verify-login-otp', { method: 'POST', body: JSON.stringify(body) }),
    sendForgotPasswordOtp: (body) => request('/auth/forgot-password/send-otp', { method: 'POST', body: JSON.stringify(body) }),
    resetPasswordWithOtp: (body) => request('/auth/forgot-password/reset', { method: 'POST', body: JSON.stringify(body) }),
    googleAuth: (body) => request('/auth/google', { method: 'POST', body: JSON.stringify(body) }),
    getGoogleClientId: () => request('/auth/google-client-id'),
    getMe: () => request('/auth/me'),
    getUserByUsername: (username) => request(`/auth/user/${username}`),
    updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  },

  // Events
  events: {
    getAll: () => request('/events'),
    getBySlug: (slug) => request(`/events/${slug}`),
    create: (body) => request('/events', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  },

  // Projects
  projects: {
    getAll: () => request('/projects'),
    create: (body) => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
    requestProject: (body) => request('/projects/request', { method: 'POST', body: JSON.stringify(body) }),
    getRequests: () => request('/projects/requests'),
    approveRequest: (id) => request(`/projects/requests/${id}/approve`, { method: 'POST' }),
    updateRequestStatus: (id, status) => request(`/projects/requests/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    deleteRequest: (id) => request(`/projects/requests/${id}`, { method: 'DELETE' }),
  },

  // Team
  team: {
    getAll: () => request('/team'),
    create: (body) => request('/team', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/team/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/team/${id}`, { method: 'DELETE' }),
    reorder: (orderedIds) => request('/team/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
  },

  // Alumni
  alumni: {
    getAll: () => request('/alumni'),
    create: (body) => request('/alumni', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/alumni/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/alumni/${id}`, { method: 'DELETE' }),
    reorder: (orderedIds) => request('/alumni/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
  },

  // Gallery
  gallery: {
    getAll: () => request('/gallery'),
    create: (body) => request('/gallery', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),
    addImage: (id, imageUrl) => request(`/gallery/${id}/images`, { method: 'POST', body: JSON.stringify({ imageUrl }) }),
    removeImage: (id, imageUrl) => request(`/gallery/${id}/images`, { method: 'DELETE', body: JSON.stringify({ imageUrl }) }),
    reorder: (orderedIds) => request('/gallery/reorder', { method: 'POST', body: JSON.stringify({ orderedIds }) }),
  },

  // Contact Queries
  contact: {
    submit: (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) }),
    getAll: () => request('/contact'),
    updateStatus: (id, status) => request(`/contact/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: (id) => request(`/contact/${id}`, { method: 'DELETE' }),
  },

  // Stats & Users (Admin)
  stats: {
    getDashboardStats: () => request('/stats'),
    getUsers: () => request('/stats/users'),
    updateUserRole: (id, role) => request(`/stats/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
    deleteUser: (id) => request(`/stats/users/${id}`, { method: 'DELETE' }),
  },

  // Section configs
  sections: {
    get: (key) => request(`/sections/${key}`),
    getAll: () => request('/sections'),
    update: (key, body) => request(`/sections/${key}`, { method: 'PUT', body: JSON.stringify(body) }),
  },
};

export default api;
