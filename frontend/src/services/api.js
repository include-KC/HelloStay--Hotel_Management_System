import axios from 'axios';

// Create a central instance of axios
// This means we don't have to type http://127.0.0.1:8000 on every request
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
