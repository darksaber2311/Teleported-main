import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const PlacesContext = createContext();
export const usePlaces = () => useContext(PlacesContext);

const API = 'http://localhost:5000/api';

export const PlacesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist,  setWishlist]  = useState([]);
  const [visited,   setVisited]   = useState([]);
  const [visiting,  setVisiting]  = useState(null);
  const [loading,   setLoading]   = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/user/profile`);
      setWishlist(data.wishlist  || []);
      setVisited(data.visited   || []);
      setVisiting(data.visiting || null);
    } catch (err) {
      console.error('fetchProfile error', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const toggleWishlist = async (placeId) => {
    try {
      const { data } = await axios.put(`${API}/user/wishlist/${placeId}`);
      setWishlist(data.wishlist  || []);
      setVisited(data.visited   || []);
    } catch (err) { console.error(err); }
  };

  const toggleVisited = async (placeId) => {
    try {
      const { data } = await axios.put(`${API}/user/visited/${placeId}`);
      setWishlist(data.wishlist  || []);
      setVisited(data.visited   || []);
    } catch (err) { console.error(err); }
  };

  const startVisiting = async (placeId, startDate) => {
    try {
      const { data } = await axios.put(`${API}/user/visiting`, { placeId, startDate });
      setVisiting(data);
    } catch (err) { console.error(err); }
  };

  const stopVisiting = async () => {
    try {
      await axios.put(`${API}/user/visiting`, { placeId: null });
      setVisiting(null);
      // Re-fetch profile so visited list reflects the newly added place
      await fetchProfile();
    } catch (err) { console.error(err); }
  };

  const updateDay = async (dayData) => {
    try {
      const { data } = await axios.put(`${API}/user/visiting/day`, dayData);
      setVisiting(data);
    } catch (err) { console.error(err); }
  };

  const isWishlisted = (id) => wishlist.some(p => (p._id || p) === id);
  const isVisited    = (id) => visited.some(p  => (p._id || p) === id);

  return (
    <PlacesContext.Provider value={{
      wishlist, visited, visiting, loading,
      toggleWishlist, toggleVisited,
      startVisiting, stopVisiting, updateDay,
      isWishlisted, isVisited, fetchProfile,
    }}>
      {children}
    </PlacesContext.Provider>
  );
};
