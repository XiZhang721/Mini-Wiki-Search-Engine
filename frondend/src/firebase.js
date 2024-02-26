// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtlQE-Y8lWjz0dFf-vKaNfxNV6EYcnQto",
  authDomain: "ttds-test.firebaseapp.com",
  projectId: "ttds-test",
  storageBucket: "ttds-test.appspot.com",
  messagingSenderId: "175574809982",
  appId: "1:175574809982:web:6240d3ef35ae7c6a49472f",
  measurementId: "G-403301Q7DW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;