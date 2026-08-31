import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('reflex_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('reflex_token');
      localStorage.removeItem('reflex_user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export interface DeliveryRequest {
  id: string;
  request_number: string;
  customer_name: string;
  address: string;
  item_description: string;
  status: 'open' | 'assigned' | 'picked_up' | 'delivered';
  assigned_rider_id?: string;
  created_by?: string;
  customer_id?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
}
