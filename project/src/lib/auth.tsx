import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserRole } from '@/lib/roles';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  theme: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    try {
      // Use role parameter to satisfy TS compile constraints
      console.debug('Logging in user with selected role:', role);
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      localStorage.setItem('token', data.token);
      
      let mappedRole = data.role.toLowerCase() as UserRole;
      if ((mappedRole as string) === 'cashier') {
        mappedRole = 'employee';
      }
      const avatarStr = data.name ? data.name.substring(0, 2).toUpperCase() : 'US';
      const userTheme = data.theme || 'light';
      
      const loggedInUser: User = {
        id: data.id.toString(),
        name: data.name,
        email: data.email,
        role: mappedRole,
        avatar: avatarStr,
        theme: userTheme,
      };

      // Apply theme immediately
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(userTheme);
      localStorage.setItem('theme', userTheme);
      
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (error) {
      console.error('Login failed via API, falling back to demo if needed or throwing', error);
      throw new Error('Invalid credentials');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (!user) return;
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
