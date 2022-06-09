import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAdSp7gJXav_CtX34KeW1XAkh880S2juhs",
  authDomain: "invoice-app-1c5bf.firebaseapp.com",
  projectId: "invoice-app-1c5bf",
  storageBucket: "invoice-app-1c5bf.appspot.com",
  messagingSenderId: "144529822358",
  appId: "1:144529822358:web:0d3b51fe08b166fdaf28b7"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();