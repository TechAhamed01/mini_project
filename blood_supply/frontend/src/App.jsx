import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import HospitalDashboard from './pages/Dashboard/HospitalDashboard';
import BloodBankDashboard from './pages/Dashboard/BloodBankDashboard';
import DonorDashboard from './pages/Dashboard/DonorDashboard';
import Layout from './layouts/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
      light: '#ff6659',
      dark: '#9a0007',
    },
    secondary: {
      main: '#1976d2',
      light: '#63a4ff',
      dark: '#004ba0',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const PrivateRoute = ({ children, allowedTypes }) => {
  const { isAuthenticated, userType } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedTypes && !allowedTypes.includes(userType)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { userType } = useAuth();

  const getDashboard = () => {
    switch (userType) {
      case 'HOSPITAL':
        return <HospitalDashboard />;
      case 'BLOOD_BANK':
        return <BloodBankDashboard />;
      case 'DONOR':
        return <DonorDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>{getDashboard()}</Layout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" />
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;