import axios from 'axios';
import { toast } from 'react-toastify';

// Dummy function for sending email confirmation (replace with real backend/cloud function)
export async function sendEmailConfirmation({ to, subject, body }) {
  // You must implement this with a backend or Firebase Cloud Function
  // For now, just resolve immediately (simulate success)
  return Promise.resolve();
}

// Track session toast to avoid duplicates
let sessionToastId = null;

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!sessionToastId) {
        sessionToastId = toast.error('Session expired or unauthorized. Please log in again.', {
          toastId: 'session-expired',
          onClose: () => { sessionToastId = null; }
        });
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Appointments API
export const appointmentsAPI = {
  create: (appointmentData) => api.post('/appointments', appointmentData),
  getMyAppointments: () => api.get('/appointments/my-appointments'),
  getAllAppointments: (params) => api.get('/appointments/all', { params }),
  updateStatus: (id, statusData) => api.put(`/appointments/${id}/status`, statusData),
  updatePayment: (id, paymentData) => api.put(`/appointments/${id}/payment`, paymentData),
  cancel: (id) => api.delete(`/appointments/${id}`),
};

// Patients API
export const patientsAPI = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  updateStatus: (id, statusData) => api.put(`/patients/${id}/status`, statusData),
  getStats: () => api.get('/patients/stats/overview'),
};

// Files API
export const filesAPI = {
  // Let axios set the multipart/form-data header (it will include the proper boundary)
  upload: (formData) => api.post('/files/upload', formData),
  getMyFiles: (params) => api.get('/files/my-files', { params }),
  getAllFiles: (params) => api.get('/files/all', { params }),
  review: (id, reviewData) => api.put(`/files/${id}/review`, reviewData),
  download: (id) => api.get(`/files/${id}/download`, { responseType: 'blob' }),
  delete: (id) => api.delete(`/files/${id}`),
};

// Doctors API
export const doctorsAPI = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  getSchedule: (id, params) => api.get(`/doctors/${id}/schedule`, { params }),
  createProfile: (profileData) => api.post('/doctors/profile', profileData),
  updateProfile: (id, profileData) => api.put(`/doctors/profile/${id}`, profileData),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAppointmentAnalytics: (params) => api.get('/dashboard/appointments/analytics', { params }),
  getRevenueAnalytics: (params) => api.get('/dashboard/revenue/analytics', { params }),
};

// Utility functions
export const formatDate = (date) => {
  // Use South African locale for date display (e.g., 26 October 2025)
  return new Date(date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time) => {
  // Use 24-hour format common in South Africa
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatCurrency = (amount, currency = 'ZAR') => {
  // Default to South African Rand and locale formatting
  try {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(amount) || 0);
  } catch (e) {
    // Fallback: prefix with currency symbol for ZAR
    const value = (Number(amount) || 0).toFixed(2);
    return currency === 'ZAR' ? `R ${value}` : `${currency} ${value}`;
  }
};

export const getStatusColor = (status) => {
  const colors = {
    scheduled: '#ed8936',
    confirmed: '#4299e1',
    completed: '#48bb78',
    cancelled: '#f56565',
    'no-show': '#718096',
    pending: '#ed8936',
    approved: '#48bb78',
    rejected: '#f56565',
    under_review: '#4299e1',
    paid: '#48bb78',
    failed: '#f56565',
    refunded: '#718096'
  };
  return colors[status] || '#718096';
};

export default api;