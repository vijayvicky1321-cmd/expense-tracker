import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDS4ArvvoIAXzLLZ9X5Bewy62LPLLZF0sg',
  authDomain: 'expense-tracker-6e908.firebaseapp.com',
  projectId: 'expense-tracker-6e908',
  storageBucket: 'expense-tracker-6e908.firebasestorage.app',
  messagingSenderId: '22565566357',
  appId: '1:22565566357:web:c5a1849a145511a7c8689c',
  measurementId: 'G-HLXP0DDS38',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
