    // version 4.2.0
    import { Dexie } from './lib/dexie.mjs';

    //teste de importação
    console.log(Dexie);

    const db = new Dexie("visitasDB");
   
    db.version(2).stores({ // Definindo a versão do banco de dados e as tabelas 
    cadastro: "++id, propriedade, produtor, telefone_principal, inscricao_estadual" // Índices para busca
    });

     db.open().then(() => {
        console.log("Banco de dados aberto com sucesso");
    }).catch((error) => {
        console.error("Erro ao abrir o banco de dados:", error);
    });

    export default db;


    export async function addCadastro(cadastro) {
        try {
            
            if (!cadastro || Object.keys(cadastro).length === 0) {
                throw new Error("Objeto de cadastro inválidos");
            }
            await db.cadastro.add(cadastro);
            return true; // sucesso
        } catch (error) {
            console.error("Erro ao adicionar cadastro:", error);
            return false; //falha
        }
    }

    export async function getCadastro() {
        try {
            return await db.cadastro.toArray();
        } catch (error) {
            console.error("Erro ao obter cadastros:", error);
            return [];
        }
    }
