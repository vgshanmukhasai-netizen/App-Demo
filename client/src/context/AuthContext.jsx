import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/authAPI';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Initial auth check

  // On mount, restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('agroself_token');
    const storedFarmer = localStorage.getItem('agroself_farmer');

    if (storedToken && storedFarmer) {
      try {
        setToken(storedToken);
        setFarmer(JSON.parse(storedFarmer));
      } catch {
        localStorage.removeItem('agroself_token');
        localStorage.removeItem('agroself_farmer');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token: newToken, farmer: farmerData } = response.data.data;

    localStorage.setItem('agroself_token', newToken);
    localStorage.setItem('agroself_farmer', JSON.stringify(farmerData));
    setToken(newToken);
    setFarmer(farmerData);

    return farmerData;
  };

  const register = async (data) => {
    const response = await authAPI.register(data);
    const { token: newToken, farmer: farmerData } = response.data.data;

    localStorage.setItem('agroself_token', newToken);
    localStorage.setItem('agroself_farmer', JSON.stringify(farmerData));
    setToken(newToken);
    setFarmer(farmerData);

    return farmerData;
  };

  const logout = () => {
    localStorage.removeItem('agroself_token');
    localStorage.removeItem('agroself_farmer');
    setToken(null);
    setFarmer(null);
  };

  const updateFarmerLocally = (updatedFarmer) => {
    setFarmer(updatedFarmer);
    localStorage.setItem('agroself_farmer', JSON.stringify(updatedFarmer));
  };

  return (
    <AuthContext.Provider
      value={{
        farmer,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateFarmerLocally,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
