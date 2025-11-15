// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC24_J_4gpUd1usCl7Jz2LKZZbvYaymwyQ",
  authDomain: "flowstate-3b5a7.firebaseapp.com",
  projectId: "flowstate-3b5a7",
  storageBucket: "flowstate-3b5a7.firebasestorage.app",
  messagingSenderId: "223221026820",
  appId: "1:223221026820:web:01a2b50133e3d9244b2551"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);