import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      if (!adminOnly || !user?.email) {
        if (mounted) setIsAdmin(false);
        return;
      }
      try {
        const adminsCol = collection(db, 'admins');
        const q = query(adminsCol, where('email', '==', user.email));
        const snap = await getDocs(q);
        if (mounted) setIsAdmin(!snap.empty);
      } catch (err) {
        if (mounted) setIsAdmin(false);
      }
    };
    checkAdmin();
    return () => { mounted = false; };
  }, [adminOnly, user]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && isAdmin === false) {
    return <Navigate to="/" replace />;
  }
  // while checking admin status, show nothing / loading
  if (adminOnly && isAdmin === null) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;