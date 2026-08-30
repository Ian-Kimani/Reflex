import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

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
