import { useState, useEffect } from 'react';
import { api, type DeliveryRequest, type User } from './api';

export function useDeliveryData(pollMs = 5000) {
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [reqRes, usersRes] = await Promise.all([
        api.get('/delivery-requests'),
        api.get('/users'),
      ]);
      setRequests(reqRes.data);
      setUsers(usersRes.data);
    } catch (e) {
      console.error('API Error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, pollMs);
    return () => clearInterval(id);
    
  }, []);

  return { requests, users, loading, refresh: fetchAll };
}