import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // This imports the database tool


const firebaseConfig = {
  apiKey: "AIzaSyActyT8DUjPuWWRzXNAubLcUQNImMYEC1Y",
  authDomain: "cloud-task-manager-80fcc.firebaseapp.com",
  projectId: "cloud-task-manager-80fcc",
  storageBucket: "cloud-task-manager-80fcc.firebasestorage.app",
  messagingSenderId: "19258017519",
  appId: "1:19258017519:web:a27877d43065f24af7fd1a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);