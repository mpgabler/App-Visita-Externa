if (!window.firebase) {
  console.error("Firebase ainda não carregou! Aguarde...");
  await new Promise((resolve) => {
    const check = () => (window.firebase ? resolve() : setTimeout(check, 50));
    check();
  });
}

const {
  auth,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  signInAnonymously,
  onAuthStateChanged,
} = window.firebase;

// Agora sim pode usar normalmente
console.log("Firebase pronto para uso");

// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   enableIndexedDbPersistence,
// } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOUIc3_1VujnV40HRU3HYEw6lt4aaZu1w",
  authDomain: "app-visita-externa.firebaseapp.com",
  projectId: "app-visita-externa",
  storageBucket: "app-visita-externa.firebasestorage.app",
  messagingSenderId: "120780076208",
  appId: "1:120780076208:web:5043211212f17bee343775",
  measurementId: "G-QK4DF2P52F",
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const fs = getFirestore(app);

// Ativa persistência offline (só depois que o getFirestore já retornou)
enableIndexedDbPersistence(fs).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Múltiplas abas abertas – persistência só funciona em uma");
  } else if (err.code === "unimplemented") {
    console.warn("Browser não suporta persistência offline");
  }
});

export { app, fs };
