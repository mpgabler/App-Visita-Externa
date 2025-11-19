if (!window.firebase) {
  console.error("Firebase ainda não carregou! Aguarde...");
  await new Promise((resolve) => {
    const check = () => (window.firebase ? resolve() : setTimeout(check, 50));
    check();
  });
}

const {
  fs,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} = window.firebase;

// Agora sim pode usar normalmente
console.log("Firebase pronto para uso");

// import {
//   getAuth,
//   signInAnonymously,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { app } from "./firebase.js";

export const auth = getAuth(app);

// Função que garante login anônimo
export async function garantirLoginAnonimo() {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  try {
    const result = await signInAnonymously(auth);
    console.log("Login anônimo realizado:", result.user.uid);
    return result.user;
  } catch (error) {
    console.error("Erro no login anônimo:", error);
    throw error;
  }
}

// Opcional: escuta mudanças de autenticação (útil para sincronização futura)
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuário autenticado (anônimo):", user.uid);
  } else {
    console.log("Usuário deslogado");
  }
});
