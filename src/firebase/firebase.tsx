// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDT6IUMmbqtVWCtDuNBpe9XhRRbhK0hr1Y",
    authDomain: "klarity-44857.firebaseapp.com",
    projectId: "klarity-44857",
    storageBucket: "klarity-44857.firebasestorage.app",
    messagingSenderId: "383854480888",
    appId: "1:383854480888:web:2db9853001f553cca51a0d",
    measurementId: "G-KFXHWZEBL9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// User profile functions
const createUserProfile = async (user: any, additionalData = {}) => {
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    name: user.displayName || '',
    photoURL: user.photoURL || '',
    createdAt: serverTimestamp(),
    ...additionalData
  });
};

const getUserProfile = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() : null;
};

export { app, auth, db, createUserProfile, getUserProfile };
