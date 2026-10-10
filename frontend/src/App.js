import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login       from './pages/Login';
import Signup      from './pages/Signup';
import Home        from './pages/Home';
import PlaceDetail from './pages/PlaceDetail';
import StateDetail from './pages/StateDetail';
import Explore     from './pages/Explore';
import Wishlist    from './pages/Wishlist';
import Visited     from './pages/Visited';
import Visiting    from './pages/Visiting';

const Protected = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Login  />} />
        <Route path="/signup"  element={<Signup />} />
        <Route path="/home"    element={<Protected><Home /></Protected>} />
        <Route path="/place/:id"    element={<Protected><PlaceDetail /></Protected>} />
        <Route path="/state/:name"  element={<Protected><StateDetail /></Protected>} />
        <Route path="/explore"      element={<Protected><Explore   /></Protected>} />
        <Route path="/wishlist"     element={<Protected><Wishlist  /></Protected>} />
        <Route path="/visited"      element={<Protected><Visited   /></Protected>} />
        <Route path="/visiting"     element={<Protected><Visiting  /></Protected>} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;