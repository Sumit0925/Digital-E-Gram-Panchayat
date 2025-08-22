import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';

// Components
import Navbar from './components/Navbar';
import Homepage from './components/HomePage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ServiceList from './components/ServiceList';
import MyApplications from './components/MyApplications';
import OfficerDashboard from './components/OfficerDashboard';
import StaffDashboard from './components/StaffDashboard';
import Unauthorized from './components/Unauthorized';

// Dashboard Router Component
const DashboardRouter = () => {
  const { user } = useAuth();

  if (user?.role === 'officer') {
    return <OfficerDashboard />;
  } else if (user?.role === 'staff') {
    return <StaffDashboard />;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/services" element={<ServiceList />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route
              path="/my-applications"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <MyApplications />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['staff', 'officer']}>
                  <DashboardRouter />
                </PrivateRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;