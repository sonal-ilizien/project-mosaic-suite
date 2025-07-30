import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API,
});

// Get tokens
const getToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Clear all relevant storage on logout/401
const clearToken = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('region_id');
};

// Refresh token function
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${import.meta.env.VITE_PUBLIC_API}/accounts/auth/refresh/`, {
      refresh: refreshToken
    });

    if (response.data?.access) {
      localStorage.setItem('accessToken', response.data.access);
      // Schedule next token refresh
      scheduleTokenRefresh();
      return response.data.access;
    } else {
      throw new Error('No access token in refresh response');
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearToken();
    // Don't redirect immediately, let the calling code handle it
    throw error;
  }
};

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

// Proactive token refresh
let refreshTimeout = null;

const scheduleTokenRefresh = () => {
  const token = getToken();
  if (token) {
    try {
      // Decode JWT to get expiration time
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      
      // Refresh token 5 minutes before expiry
      const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 60000); // At least 1 minute
      
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      
      refreshTimeout = setTimeout(async () => {
        try {
          await refreshAccessToken();
          scheduleTokenRefresh(); // Schedule next refresh
        } catch (error) {
          console.error('Proactive token refresh failed:', error);
        }
      }, refreshTime);
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }
};

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Schedule token refresh on first request with token
      if (!refreshTimeout) {
        scheduleTokenRefresh();
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiry with automatic refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if we have a refresh token
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Cleanup function to clear refresh timeout
export const clearRefreshTimeout = () => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
};

// Initialize token refresh if token exists
if (getToken()) {
  scheduleTokenRefresh();
}

export default api;
