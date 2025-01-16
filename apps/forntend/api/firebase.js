// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkw0SQdY8oyFgVufgDddC0mDE7BW8vCHg",
  authDomain: "shopper-29d9c.firebaseapp.com",
  projectId: "shopper-29d9c",
  storageBucket: "shopper-29d9c.appspot.com",
  messagingSenderId: "317309601832",
  appId: "1:317309601832:web:903620955bf27caa7d0d1d",
  measurementId: "G-C5M5GGQX48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
