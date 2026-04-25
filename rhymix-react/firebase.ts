// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8XpBGABKWoEW4RjLl3Mu3I_ELmN0xtag",
  authDomain: "rhymix-ae041.firebaseapp.com",
  projectId: "rhymix-ae041",
  storageBucket: "rhymix-ae041.firebasestorage.app",
  messagingSenderId: "106242890905",
  appId: "1:106242890905:web:bd420f8d9550a076696c08",
  measurementId: "G-EM9C69VSEM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);