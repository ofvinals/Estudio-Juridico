// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzMYzx6kGI_8j-5Bagaa67hg_MambIJgA",
  authDomain: "estudio-juridico-fbd74.firebaseapp.com",
  projectId: "estudio-juridico-fbd74",
  storageBucket: "estudio-juridico-fbd74.appspot.com",
  messagingSenderId: "993541654096",
  appId: "1:993541654096:web:2253b40c73a951a855b355",
  measurementId: "G-GJTPNW12SS"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;