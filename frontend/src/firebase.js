// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use


// Initialize Firebase

var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ttds-412917-default-rtdb.europe-west1.firebasedatabase.app"
});

export const auth = getAuth(app);
export default app;