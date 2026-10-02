import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { cropAPI } from '../services/cropAPI';
import { useAuth } from './AuthContext';

const CropContext = createContext(null);

const normalizeCrop = (crop) => ({ ...crop, _id: crop._id ?? crop.id });

export const CropProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCrops = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await cropAPI.getCrops();
      setCrops(res.data.data.crops.map(normalizeCrop));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load crops');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  const addCrop = async (data) => {
    const res = await cropAPI.addCrop(data);
    const newCrop = normalizeCrop(res.data.data.crop);
    setCrops((prev) => [newCrop, ...prev]);
    return newCrop;
  };

  const updateCrop = async (id, data) => {
    const res = await cropAPI.updateCrop(id, data);
    const updated = normalizeCrop(res.data.data.crop);
    setCrops((prev) => prev.map((c) => (c._id === id ? updated : c)));
    return updated;
  };

  const deleteCrop = async (id) => {
    await cropAPI.deleteCrop(id);
    setCrops((prev) => prev.filter((c) => c._id !== id));
  };

  const updateGrowthStage = async (id, stage, notes = '') => {
    const res = await cropAPI.updateGrowthStage(id, { stage, notes });
    const updated = normalizeCrop(res.data.data.crop);
    setCrops((prev) => prev.map((c) => (c._id === id ? updated : c)));
    return updated;
  };

  const activeCrops = crops.filter((c) => c.status === 'Active');
  const harvestedCrops = crops.filter((c) => c.status === 'Harvested');

  return (
    <CropContext.Provider
      value={{
        crops,
        activeCrops,
        harvestedCrops,
        loading,
        error,
        fetchCrops,
        addCrop,
        updateCrop,
        deleteCrop,
        updateGrowthStage,
      }}
    >
      {children}
    </CropContext.Provider>
  );
};

export const useCrops = () => {
  const ctx = useContext(CropContext);
  if (!ctx) throw new Error('useCrops must be used within CropProvider');
  return ctx;
};

export default CropContext;
