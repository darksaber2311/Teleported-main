import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import FloatingCard from "./FloatingCard";
import L from "leaflet";
import markerIcon from "../assets/marker.svg";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const MapView = ({
  selectedPlace,
  setSelectedPlace,
  setWishlist,
  setVisited
}) => {
  return (
    <div className="map-wrapper">
      <MapContainer
        center={[22.9734, 83.6569]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedPlace && (
          <Marker position={[selectedPlace.lat, selectedPlace.lng]} icon={customIcon}>
            <Popup>{selectedPlace.name}</Popup>
          </Marker>
        )}
      </MapContainer>

      <FloatingCard
        place={selectedPlace}
        setSelectedPlace={setSelectedPlace}
        setWishlist={setWishlist}
        setVisited={setVisited}
      />
    </div>
  );
};

export default MapView;