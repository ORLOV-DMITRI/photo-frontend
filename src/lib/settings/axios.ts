import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!baseURL) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined in your environment variables');
}

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});


export default api;
