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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                
                if (!refreshToken) {
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/token/refresh/`, {
                    refresh: refreshToken
                });

                const { access } = response.data;
                localStorage.setItem(ACCESS_TOKEN, access);

                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return axios(originalRequest);

            } catch (refreshError) {
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