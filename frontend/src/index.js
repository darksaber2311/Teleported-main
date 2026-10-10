import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import './styles/auth.css';
import './styles/map.css';
import './styles/components.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PlacesProvider } from './context/PlacesContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-calendar/dist/Calendar.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <AuthProvider>
      <PlacesProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={2500}
          theme="dark"
          toastStyle={{ fontFamily: 'DM Sans, sans-serif' }}
        />
      </PlacesProvider>
    </AuthProvider>
  </ThemeProvider>
);
