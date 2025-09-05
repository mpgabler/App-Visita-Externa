import { getCadastro } from "./database.js";

export async function renderCadastros(){
    const cadastros = await getCadastro();
    const list = document.getElementById("cadastro-list");
    list.innerHTML = "";
    cadastros.forEach(c => {
        const li = document.createElement("li");
        //li.textContent = Object.values(c).join(" - ");
        li.textContent = `ID: ${c.id} | Nome: ${c.nome} | Sobrenome: ${c.sobrenome} 
        | CPF: ${c.cpf} | CNPJ: ${c.cnpj} | Nome Fantasia: ${c.nome_fantasia} 
        | Endereço: ${c.endereco}, Nº: ${c.numero}, Bairro: ${c.bairro}, 
        Cidade: ${c.cidade}, Estado: ${c.estado} | Telefone: ${c.telefone} 
        | Itens/Produtos: ${c.itens_produtos.join(", ")} 
        | Usa defensivos?: ${c.grupo_radio_defensivo} - ${c.itens_defensivos.join(", ")}
        | Emite Nota Fiscal?: ${c.grupo_radio_emissao_nota}`;  
        list.appendChild(li);
    });

    console.log("Tabela renderizada:", cadastros);
}