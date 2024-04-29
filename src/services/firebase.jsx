// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNdAope0-o1W0153m97eIXtctyYQKqSkE",
  authDomain: "novellia-92ee0.firebaseapp.com",
  projectId: "novellia-92ee0",
  storageBucket: "novellia-92ee0.appspot.com",
  messagingSenderId: "934603288986",
  appId: "1:934603288986:web:292dfbdb20f9045d68ca23"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export const db = getFirestore(appFirebase);
export const storage = getStorage(appFirebase); 
export default appFirebase;
