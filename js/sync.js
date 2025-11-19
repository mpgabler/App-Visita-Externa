if (!window.firebase) {
  console.error("Firebase ainda não carregou! Aguarde...");
  await new Promise((resolve) => {
    const check = () => (window.firebase ? resolve() : setTimeout(check, 50));
    check();
  });
}

const {
  fs,
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

// import { fs } from "./firebase.js";
// import { collection, addDoc, getDocs } from "firebase/firestore";
// import { auth } from "./auth.js";
import db, { getCadastro } from "./database.js";

export async function pushCadastros() {
  // 1. Garante que está logado
  if (!auth.currentUser) {
    console.warn("Usuário não autenticado – abortando push");
    return;
  }

  // 2. Pega só os cadastros que ainda não foram sincronizados
  const naoSincronizados = await db.cadastro
    .where("sincronizado")
    .equals(0)
    .or("sincronizado")
    .anyOf([null, undefined]) // por segurança
    .toArray();

  if (naoSincronizados.length === 0) {
    console.log("Nada para sincronizar");
    return;
  }

  const col = collection(fs, "cadastros");

  for (const c of naoSincronizados) {
    try {
      const cadastroCompleto = {
        ...c,
        tecnicoId: auth.currentUser.uid, // quem fez o cadastro
        tecnicoEmail: auth.currentUser.email || "anonimo", // caso use outro tipo de login no futuro
        sincronizadoEm: new Date().toISOString(), // data/hora que subiu pro Firebase
        offlineId: c.id, // opcional: facilita debug
      };

      const docRef = await addDoc(col, cadastroCompleto);

      // Marca como sincronizado localmente (Dexie)
      await db.cadastro.update(c.id, {
        sincronizado: 1,
        idRemote: docRef.id, // guarda o ID do Firebase
        sincronizadoEm: new Date().toISOString(),
      });

      console.log(`Cadastro ${c.id} sincronizado → ${docRef.id}`);
    } catch (error) {
      console.error("Erro ao sincronizar cadastro", c.id, error);
      // NÃO marca como sincronizado se deu erro → vai tentar novamente depois
    }
  }
}

// puxar os dados
export async function pullCadastros() {
  if (!auth.currentUser) {
    console.warn("Usuário não autenticado – pulando pull");
    return;
  }

  try {
    const snapshot = await getDocs(collection(fs, "cadastros"));

    if (snapshot.empty) {
      console.log("Nenhum cadastro no servidor ainda.");
      return;
    }

    // Transação no Dexie para garantir consistência
    await db.transaction("rw", db.cadastro, async () => {
      for (const doc of snapshot.docs) {
        const data = doc.data();
        const idRemote = doc.id;

        // 1. Busca se já existe localmente pelo idRemote (prioridade máxima)
        let localExistente = await db.cadastro
          .where("idRemote")
          .equals(idRemote)
          .first();

        // 2. Se não encontrou pelo idRemote, tenta pelo offlineId (caso tenha sido criado offline e já sincronizado)
        if (!localExistente && data.offlineId) {
          localExistente = await db.cadastro.get(data.offlineId);
        }

        if (localExistente) {
          // === JÁ EXISTE LOCALMENTE ===
          // Regra de ouro: NUNCA sobrescreva um cadastro local que ainda não foi sincronizado
          const aindaNaoSincronizado =
            localExistente.sincronizado === 0 ||
            localExistente.sincronizado == null;

          if (aindaNaoSincronizado) {
            // Preserva a versão local (a do técnico em campo é mais importante)
            console.log(
              `Preservando versão local não sincronizada: ${localExistente.propriedade}`
            );
            continue; // pula este documento do servidor
          } else {
            // Já foi sincronizado antes → atualiza com a versão do servidor (pode ter sido editado por outro técnico)
            await db.cadastro.update(localExistente.id, {
              ...data,
              idRemote: idRemote,
              sincronizado: 1,
              sincronizadoEm: new Date().toISOString(),
            });
            console.log(`Atualizado: ${data.propriedade}`);
          }
        } else {
          // === NÃO EXISTE LOCALMENTE → insere novo ===
          await db.cadastro.add({
            ...data,
            idRemote: idRemote,
            sincronizado: 1, // veio do servidor → já está sincronizado
            sincronizadoEm: data.sincronizadoEm || new Date().toISOString(),
          });
          console.log(`Novo do servidor: ${data.propriedade}`);
        }
      }
    });

    console.log(`Pull concluído: ${snapshot.size} documentos processados`);
  } catch (error) {
    console.error("Erro no pullCadastros:", error);
  }
}
