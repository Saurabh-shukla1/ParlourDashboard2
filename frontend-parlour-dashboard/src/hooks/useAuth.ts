import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  role: string;
  email: string;
}

export function useAuth(requiredRole?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData = {
        name: payload.name || 'User',
        role: payload.role,
        email: payload.email
      };

      // Check if user has required role
      if (requiredRole && payload.role !== requiredRole) {
        // Redirect to appropriate dashboard based on actual role
        if (payload.role === 'superadmin') {
          router.replace('/dashboard/superadmin');
        } else if (payload.role === 'admin') {
          router.replace('/dashboard/admin');
        } else {
          router.replace('/dashboard');
        }
        return;
      }

      setUser(userData);
    } catch (_error) {
      // Invalid token
      localStorage.removeItem('token');
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  }, [router, requiredRole]);

  const logout = () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  return { user, loading, logout };
}

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Redirect to appropriate dashboard
        if (payload.role === 'superadmin') {
          router.replace('/dashboard/superadmin');
        } else if (payload.role === 'admin') {
          router.replace('/dashboard/admin');
        } else {
          router.replace('/dashboard');
        }
      } catch (_error) {
        // Invalid token, clear it
        localStorage.removeItem('token');
      }
    }
  }, [router]);
}
