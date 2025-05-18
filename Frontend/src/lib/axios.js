import axios from 'axios';

const BASE_URL = import.meta.env.MODE === "development" ? 'https://streamify-backend-5j04.onrender.com/api' : '/api';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});
