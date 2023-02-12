import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from '@firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzdc6B_R5qfZ0sxsphZVYsx3wbIzqBJwQ",
  authDomain: "fir-final-project-9a40c.firebaseapp.com",
  databaseURL: "https://fir-final-project-9a40c-default-rtdb.firebaseio.com",
  projectId: "fir-final-project-9a40c",
  storageBucket: "fir-final-project-9a40c.appspot.com",
  messagingSenderId: "980757971098",
  appId: "1:980757971098:web:0da87ecab4ab961d98df23"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const db = getFirestore(app);