import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Estos datos los sacas de la consola de Firebase > Configuración del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyB-URCQmBhbpf4tjP4tPr0P71Oecx3veMA",
  authDomain: "skillnet-8533c.firebaseapp.com",
  databaseURL: "https://skillnet-8533c-default-rtdb.firebaseio.com",
  projectId: "skillnet-8533c",
  storageBucket: "skillnet-8533c.firebasestorage.app",
  messagingSenderId: "241284136543",
  appId: "1:241284136543:web:529fc05e92ae249a2865ea",
  measurementId: "G-6SR30QE50D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 