import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/accounts/login/', credentials),
  register: (userData) => api.post('/accounts/register/', userData),
  logout: () => api.post('/accounts/logout/'),
  profile: () => api.get('/accounts/profile/'),
  dashboard: () => api.get('/accounts/dashboard/'),
};

export const inventoryAPI = {
  getInventory: (params) => api.get('/inventory/blood/', { params }),
  addInventory: (data) => api.post('/inventory/blood/', data),
  searchBlood: (data) => api.post('/inventory/search/', data),
  getRequests: () => api.get('/inventory/requests/'),
  createRequest: (data) => api.post('/inventory/requests/', data),
  fulfillRequest: (requestId) => api.post(`/inventory/requests/${requestId}/fulfill/`),
  getExpiryAlerts: () => api.get('/inventory/expiry-alerts/'),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications/'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read/`),
  deleteNotification: (id) => api.delete(`/notifications/${id}/`),
};

export default api;