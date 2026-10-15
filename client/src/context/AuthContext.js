import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
  // Send password reset email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

const AuthContext = createContext();

const initialState = {
  user: null,
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);


  // Firebase: Load user from auth state
  const loadUser = useCallback((user) => {
    if (user) {
      dispatch({ type: 'USER_LOADED', payload: user });
    } else {
      dispatch({ type: 'AUTH_ERROR', payload: null });
    }
  }, []);

  // Register user with Firebase Auth
  const register = async (formData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      // Optionally update profile with displayName
      if (formData.firstName || formData.lastName) {
        await updateProfile(userCredential.user, {
          displayName: `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
        });
      }
      // Add user to 'patients' collection in Firestore
      try {
        await addDoc(collection(db, 'patients'), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          createdAt: serverTimestamp ? serverTimestamp() : new Date(),
        });
      } catch (e) {
        // Ignore Firestore errors for now
      }
      dispatch({ type: 'REGISTER_SUCCESS', payload: userCredential.user });
      return { success: true, data: userCredential.user };
    } catch (err) {
      dispatch({ type: 'REGISTER_FAIL', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  // Login user with Firebase Auth
  const login = async (formData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: userCredential.user });
      return { success: true, data: userCredential.user };
    } catch (err) {
      dispatch({ type: 'LOGIN_FAIL', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  // Logout with Firebase Auth
  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'LOGOUT', payload: null });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message });
    }
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  // Optionally update profile (displayName)
  const updateProfileInfo = async (profileData) => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, profileData);
        dispatch({ type: 'USER_LOADED', payload: { ...auth.currentUser } });
        return { success: true, data: auth.currentUser };
      }
      return { success: false, error: 'No user logged in' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      loadUser(user);
    });
    return () => unsubscribe();
  }, [loadUser]);

  const value = {
    ...state,
    register,
    login,
    logout,
    loadUser,
    clearErrors,
    updateProfile: updateProfileInfo,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
export default AuthContext;