import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDwibjsZaSTHF3wReCsDqjV0FQnbB0EdUE',
  authDomain: 'blog-19e43.firebaseapp.com',
  projectId: 'blog-19e43',
  storageBucket: 'blog-19e43.appspot.com',
  messagingSenderId: '147799040431',
  appId: '1:147799040431:web:3539a858a9a8696c80cf5a',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();

export const firestore = firebase.firestore();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const storage = firebase.storage();
