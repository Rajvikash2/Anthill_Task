import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

    apiKey: "AIzaSyAGqw9fQpWzOl-aEXc2W96tdUuOMx5MZdw",
  
    authDomain: "cars-297e4.firebaseapp.com",
  
    projectId: "cars-297e4",
  
    storageBucket: "cars-297e4.firebasestorage.app",
  
    messagingSenderId: "1049119972569",
  
    appId: "1:1049119972569:web:0709dc627451a92a9eb2c8",
  
    measurementId: "G-MNKTH7R076"
  
  };
  

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  
  export default app;