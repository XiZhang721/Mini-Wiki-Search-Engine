import {initializeApp} from "firebase/app";
import{getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATLTdlPNfu9QU1ov5gaLcfZO90T98O84c",
  authDomain: "ttds-412917.firebaseapp.com",
  databaseURL: "https://ttds-412917-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ttds-412917",
  storageBucket: "ttds-412917.appspot.com",
  messagingSenderId: "103578864740",
  appId: "1:103578864740:web:e74101a9a3f14de241e371",
  measurementId: "G-14N8RC92HP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
