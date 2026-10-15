import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
// Remove useAuth import from App.js
import Services from './pages/Services';
import ContactUs from './pages/ContactUs';
import Filing from './pages/Filing';
import Appointment from './pages/Appointment';
import Payment from './pages/Payment';
import AdminPatients from './pages/admin/Patients';
import AdminBookings from './pages/admin/Bookings';
import AdminFiles from './pages/admin/Files';
import AdminReports from './pages/AdminReports';
import PatientDashboard from './pages/PatientDashboard';
import SeedDoctors from './pages/SeedDoctors';

// Import global styles
import { GlobalStyle } from './styles/theme';

function App() {
  return (
    <AuthProvider>
      <Router>
        <style>{GlobalStyle}</style>
        <div className="App">
          <Routes>
            {/* Routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="payment" element={<Payment />} />
              <Route path="filing" element={<PrivateRoute><Filing /></PrivateRoute>} />
              <Route path="appointment" element={<PrivateRoute><Appointment /></PrivateRoute>} />
              <Route path="dashboard" element={<PrivateRoute><PatientDashboard /></PrivateRoute>} />
              {/* Admin routes */}
              <Route path="admin/dashboard" element={<PrivateRoute adminOnly><Dashboard /></PrivateRoute>} />
              <Route path="admin/patients" element={<PrivateRoute adminOnly><AdminPatients /></PrivateRoute>} />
              <Route path="admin/bookings" element={<PrivateRoute adminOnly><AdminBookings /></PrivateRoute>} />
              <Route path="admin/files" element={<PrivateRoute adminOnly><AdminFiles /></PrivateRoute>} />
              <Route path="admin/reports" element={<PrivateRoute adminOnly><AdminReports /></PrivateRoute>} />
            </Route>
            {/* Dev: seed doctors (remove in production) */}
            <Route path="seed-doctors" element={<SeedDoctors />} />
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;