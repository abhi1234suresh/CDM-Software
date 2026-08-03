import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://10.176.11.93:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to attach the JWT token to every request, except for signup
// apiClient.interceptors.request.use(
  // (config) => {
    // Skip Authorization header for signup endpoint
    // if (config.url.includes('/users/') && config.method === 'post') {
      // return config;
    // }
    // const token = localStorage.getItem('access_token');
    // if (token) {
      // config.headers.Authorization = `Bearer ${token}`;
    // }
    // return config;
  // },
  // (error) => {
    // console.error('Request Interceptor Error:', error);
    // return Promise.reject(error);
  // }
// );

// Add an interceptor to handle token refresh on 401 errors
// apiClient.interceptors.response.use(
  // (response) => response,
  // async (error) => {
    // const originalRequest = error.config;
    // Skip token refresh for signup and token-related endpoints
    // if (
      //error.response?.status === 401 &&
      //!originalRequest._retry &&
      //!originalRequest.url.includes('token/') &&
     // !(originalRequest.url.includes('/users/') && originalRequest.method === 'post')
    //) {
      //originalRequest._retry = true;
      //try {
      //  const refreshToken = localStorage.getItem('refresh_token');
      //  const response = await apiClient.post('token/refresh/', { refresh: refreshToken });
      //  const newAccessToken = response.data.access;
      //  localStorage.setItem('access_token', newAccessToken);
      //  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      //  return apiClient(originalRequest);
      //} catch (refreshError) {
      //  console.error('Token Refresh Error:', refreshError);
      //  localStorage.removeItem('access_token');
      //  localStorage.removeItem('refresh_token');
      //  localStorage.removeItem('username');
      //  window.location.href = '/';
      //  return Promise.reject(refreshError);
      //}
   // }
    // Enhanced error logging for signup 401 errors
    //if (
   //   error.response?.status === 401 &&
   //   originalRequest.url.includes('/users/') &&
   //   originalRequest.method === 'post'
    //) {
   //   console.warn('Signup request failed due to 401. Ensure backend does not require authentication for /users/ POST.');
   // }
   // console.error('Response Interceptor Error:', error.response?.data || error.message);
   // return Promise.reject(error);
//  }
// );

export default apiClient;