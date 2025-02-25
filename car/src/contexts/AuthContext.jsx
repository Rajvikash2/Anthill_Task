// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store or update user in Firestore
  const storeUserData = async (user) => {
    if (!user) return null;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        // User exists, update last login
        const existingData = userSnap.data();
        await updateDoc(userRef, {
          lastLogin: new Date().toISOString()
        });
        setUserData(existingData);
        return existingData;
      } else {
        const newUserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAdmin: false, 
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        await setDoc(userRef, newUserData);
        setUserData(newUserData);
        return newUserData;
      }
    } catch (error) {
      console.error("Error accessing user data:", error);
      setError(error.message);
      return { isAdmin: false };
    }
  };

 
  const updateAdminStatus = async (uid, isAdmin) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { isAdmin });
      
      if (user && user.uid === uid) {
        setUserData(prevData => ({
          ...prevData,
          isAdmin
        }));
      }
      
      return true;
    } catch (error) {
      console.error("Error updating admin status:", error);
      setError(error.message);
      return false;
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await storeUserData(result.user);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError(error.message);
      throw error;
    }
  };

  const signOut = () => {
    setUserData(null);
    setError(null);
    return firebaseSignOut(auth);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        try {
          await storeUserData(authUser);
        } catch (error) {
          console.error("Error in auth state change:", error);
          setError(error.message);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const value = {
    user,
    userData,
    signInWithGoogle,
    signOut,
    isAdmin: userData?.isAdmin || false,
    updateAdminStatus,
    error,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};