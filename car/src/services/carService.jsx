// src/services/carService.js
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where,
    getDoc
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  
  export const addCar = async (carData) => {
    try {
      const docRef = await addDoc(collection(db, 'cars'), {
        ...carData,
        createdAt: new Date().toISOString()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding car:', error);
      throw error;
    }
  };
  
  export const getAllCars = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cars'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting cars:', error);
      throw error;
    }
  };
  
  export const updateCarPrice = async (carId, newPrice) => {
    try {
      const carRef = doc(db, 'cars', carId);
      await updateDoc(carRef, { price: newPrice });
      return true;
    } catch (error) {
      console.error('Error updating car price:', error);
      throw error;
    }
  };
  
  export const getPurchaseRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'purchaseRequests'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting purchase requests:', error);
      throw error;
    }
  };
  
  export const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const requestRef = doc(db, 'purchaseRequests', requestId);
      await updateDoc(requestRef, { status: newStatus });
      return true;
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  };
  
  export const submitPurchaseRequest = async (carId, userId, userEmail, carDetails, price) => {
    try {
      const docRef = await addDoc(collection(db, 'purchaseRequests'), {
        carId,
        userId,
        userEmail,
        carDetails,
        price,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error submitting purchase request:', error);
      throw error;
    }
  };
  
  export const getUserPurchaseRequests = async (userId) => {
    try {
      const q = query(collection(db, 'purchaseRequests'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user purchase requests:', error);
      throw error;
    }
  };