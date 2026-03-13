import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (data: { user: User; accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      const refreshToken = localStorage.getItem('refreshToken');
      if (accessToken && userStr && refreshToken) {
        const user = JSON.parse(userStr);
        dispatch({ type: 'LOGIN', payload: { user, accessToken, refreshToken } });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = useCallback((data: { user: User; accessToken: string; refreshToken: string }) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    dispatch({ type: 'LOGIN', payload: data });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('demoMode');
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const useAuthWithNavigate = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const logoutAndRedirect = useCallback(() => {
    auth.logout();
    navigate('/login');
  }, [auth, navigate]);
  return { ...auth, logoutAndRedirect };
};
