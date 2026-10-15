import { createContext, useContext, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext();

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  const save = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const errMsg = (e) => e.response?.data?.message || 'Could not connect to the server';

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      save(data);
    } catch (e) {
      throw new Error(errMsg(e));
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      save(data);
    } catch (e) {
      throw new Error(errMsg(e));
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
