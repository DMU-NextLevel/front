import { useEffect, useState } from 'react';
import { api } from '../AxiosInstance';
import { useAuth } from './AuthContext';

type UserRole = 'USER' | 'ADMIN' | null;

export const useUserRole = () => {
  const { isLoggedIn } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      api.get('/public/login/token')
        .then(res => {
          if (res.data.message === 'success') {
            setRole(res.data.data); // "USER" or "ADMIN"
          }
        })
        .catch(err => {
          console.error('Failed to fetch role', err);
          setRole(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setRole(null);
    }
  }, [isLoggedIn]);

  return { role, loading };
};

// user role 반환 hooks