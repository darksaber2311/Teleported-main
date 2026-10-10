import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import MapView from '../components/MapView';
import Navbar from '../components/Navbar';
import FloatingCard from '../components/FloatingCard';
import ProfileSidebar from '../components/ProfileSidebar';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const hasPlaceParam = new URLSearchParams(location.search).has('place');

  // Handle ?place=id query param (from "Show on Map" button in PlaceDetail)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const placeId = params.get('place');
    if (placeId) {
      axios.get(`${API}/places/${placeId}`)
        .then(r => setSelectedPlace(r.data))
        .catch(() => {});
    }
  }, [location.search]);

  // Listen for profile open event from Navbar
  useEffect(() => {
    const handler = () => setProfileOpen(true);
    window.addEventListener('openProfile', handler);
    return () => window.removeEventListener('openProfile', handler);
  }, []);

  return (
    <div className="map-page">
      <MapView
        selectedPlace={selectedPlace}
        onMarkerClick={(place) => setSelectedPlace(place)}
        skipIntro={hasPlaceParam}
      />

      <Navbar onSelectPlace={(place) => setSelectedPlace(place)} />

      <AnimatePresence>
        {selectedPlace && (
          <FloatingCard
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profileOpen && (
          <ProfileSidebar onClose={() => setProfileOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
