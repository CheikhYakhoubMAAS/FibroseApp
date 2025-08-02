import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const result = await authService.getCurrentUser();
        if (result.data) {
          setAuthState({
            user: result.data,
            isAuthenticated: true
          });
        } else {
          // Token invalide, nettoyer le localStorage
          authService.logout();
        }
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authService.login(email, password);
      if (result.data) {
        setAuthState({
          user: result.data.user,
          isAuthenticated: true
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState({ user: null, isAuthenticated: false });
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    // Pour l'instant, on garde la simulation
    // En production, vous implémenteriez l'appel API
    console.log('Enregistrement:', userData);
    return true;
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};