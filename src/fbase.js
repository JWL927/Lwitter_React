import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCgcxW8AC_DeBBHvODGD9mg9dHe-a81Wlk",
  authDomain: "lwitter-cc845.firebaseapp.com",
  projectId: "lwitter-cc845",
  storageBucket: "lwitter-cc845.appspot.com",
  messagingSenderId: "202452450907",
  appId: "1:202452450907:web:b1bc73dc09acf866e4497e"
  };

  firebase.initializeApp(firebaseConfig);

  export const firebaseInstance = firebase;

  export const authService = firebase.auth();
  export const dbService = getFirestore();
  export const storageService = getStorage();
