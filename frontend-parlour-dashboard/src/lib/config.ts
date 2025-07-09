// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://parlourbackend.onrender.com' 
    : 'http://localhost:5001');

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://parlourbackend.onrender.com' 
    : 'http://localhost:5001');

export { API_BASE_URL, SOCKET_URL };
