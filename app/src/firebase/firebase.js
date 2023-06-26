// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRr958o8Him0N1VeouUEerihDzNxIhr64",
  authDomain: "leetcodetracker-d071e.firebaseapp.com",
  projectId: "leetcodetracker-d071e",
  storageBucket: "leetcodetracker-d071e.appspot.com",
  messagingSenderId: "731097278467",
  appId: "1:731097278467:web:6d42742910ce36b3be8636",
  measurementId: "G-1D45X4GXT8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =getAuth(app)
export const googleProvider=new GoogleAuthProvider()
export const db=getFirestore(app)