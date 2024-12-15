import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKiEZ0rPXepLno0DdvcSeLd2DtneU_OeA",
  authDomain: "quizgame-92fd9.firebaseapp.com",
  projectId: "quizgame-92fd9",
  storageBucket: "quizgame-92fd9.firebasestorage.app",
  messagingSenderId: "543542501286",
  appId: "1:543542501286:web:eea2ed7581030976f2b967"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firestore
const db = getFirestore(app);

export default db;