import axios from "axios"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./Constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is due to unauthorized access and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                
                if (!refreshToken) {
                    // Redirect to login if no refresh token
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Try to refresh the token
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/token/refresh/`, {
                    refresh: refreshToken
                });

                // Update the access token
                const { access } = response.data;
                localStorage.setItem(ACCESS_TOKEN, access);

                // Retry the original request with the new token
                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return axios(originalRequest);

            } catch (refreshError) {
                // If token refresh fails, clear tokens and redirect to login
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
)

export default api