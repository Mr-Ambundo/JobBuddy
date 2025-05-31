// src/components/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Define types for our context
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any; // For any additional properties
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
  setUser: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          try {
            const parsedUser = JSON.parse(storedUser) as User;
            setUser(parsedUser);
            
            // Optionally verify token with backend
            const response = await fetch('/api/auth/users', {
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.user) {
                setUser(data.user);
              }
            } else {
              // Token verification failed
              throw new Error('Token verification failed');
            }
          } catch (error) {
            console.error('Failed to parse stored user or verify token:', error);
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login function (original)
  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    
    // Store in localStorage for persistence
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function (original)
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Sign in function (from new implementation)
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      const { token: authToken, user: userData } = data;
      
      // Store token in localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set user and token in state
      setUser(userData);
      setToken(authToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function (from new implementation)
  const signOut = async () => {
    try {
      // Attempt to notify backend about logout
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.warn('Logout API call failed');
        }
      }
      
      // Clear local state
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if API call fails
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // Value to be provided by the context
  const contextValue: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    signIn,
    signOut,
    setUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};