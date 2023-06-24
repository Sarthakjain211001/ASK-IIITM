// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1cKE-y4IsRk_yT1tgsur-EDPsISHMHD0",
  authDomain: "qna-iiitm.firebaseapp.com",
  projectId: "qna-iiitm",
  storageBucket: "qna-iiitm.appspot.com",
  messagingSenderId: "499152684260",
  appId: "1:499152684260:web:f7828f2d2c73b2bcdd18f1"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;