import api from './api';

const handleError = (error, method, url) => {
  console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
  if (error.response) {
    console.error('Response Data:', error.response.data);
    console.error('Status:', error.response.status);
  } else if (error.request) {
    console.error('Request Error:', error.request);
  } else {
    console.error('General Error:', error.message);
  }
  throw error;
};

const apiService = {
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      handleError(error, 'get', url);
    }
  },

  post: async (url, data = {}) => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      handleError(error, 'post', url);
    }
  },

  put: async (url, data = {}) => {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      handleError(error, 'put', url);
    }
  },

  delete: async (url, data = {}) => {
    try {
      const response = await api.delete(url, { data });
      return response.data;
    } catch (error) {
      handleError(error, 'delete', url);
    }
  },

  setToken: (token) => localStorage.setItem('accessToken', token),
  setRefreshToken: (refreshToken) => localStorage.setItem('refreshToken', refreshToken),
  clearToken: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('region_id');
  }
};

export default apiService;
