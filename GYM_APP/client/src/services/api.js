// API Base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  register: (userData) => apiCall('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => apiCall('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};

// Member APIs
export const memberAPI = {
  buyMembership: (data) => apiCall('/membership', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getMembership: (userId) => apiCall(`/membership/${userId}`),
  checkIn: (userId) => apiCall('/checkin', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  }),
  getAttendance: (userId) => apiCall(`/attendance/${userId}`),
  logWorkout: (data) => apiCall('/workout', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getProgress: (userId) => apiCall(`/progress/${userId}`),
  logBodyMetrics: (data) => apiCall('/bodymetrics', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getBodyMetrics: (userId) => apiCall(`/bodymetrics/${userId}`),
  bookClass: (data) => apiCall('/booking', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getBookings: (userId) => apiCall(`/booking/${userId}`),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => apiCall('/admin/dashboard'),
  getMembers: () => apiCall('/admin/members'),
  renewMembership: (data) => apiCall('/admin/renew', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getTrainers: () => apiCall('/admin/trainers'),
  getEquipment: () => apiCall('/admin/equipment'),
  addEquipment: (data) => apiCall('/admin/equipment', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateEquipment: (id, data) => apiCall(`/admin/equipment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  sendNotification: (data) => apiCall('/admin/notification', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Trainer APIs
export const trainerAPI = {
  getClients: (trainerId) => apiCall(`/trainer/clients/${trainerId}`),
  getClientProgress: (userId) => apiCall(`/clientprogress/${userId}`),
  assignDietPlan: (data) => apiCall('/dietplan', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getDietPlan: (userId) => apiCall(`/dietplan/${userId}`),
  getBookings: (trainerId) => apiCall(`/trainer/bookings/${trainerId}`),
  updateAvailability: (trainerId, availability) => apiCall(`/trainer/availability/${trainerId}`, {
    method: 'PUT',
    body: JSON.stringify({ availability }),
  }),
};
