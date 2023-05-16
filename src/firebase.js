// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAJw3zmZ0VKwImEfnWWpEv63FVZjdtNYCM",
  authDomain: "control-liceodrv.firebaseapp.com",
  projectId: "control-liceodrv",
  storageBucket: "control-liceodrv.appspot.com",
  messagingSenderId: "449853020438",
  appId: "1:449853020438:web:464d757e041c83298e1837"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);