import { getCadastro } from "./database.js";

// Faz a lógica para mostrar/ocultar os checkboxes de defensivos agrícolas
const simRadio = document.getElementById("Sim_defensivo");
const naoRadio = document.getElementById("Nao_defensivo");
const defensivosDiv = document.getElementById("apresentacao__itens__checkbox__defensivos");

defensivosDiv.style.display = "none"; // Inicialmente escondido

    simRadio.addEventListener("change", () => {
    defensivosDiv.style.display = "block";
    });

    naoRadio.addEventListener("change", () => {
    defensivosDiv.style.display = "none";
});
           

 // Função para renderizar os cadastros na lista na tela de cadastro (por enquanto)  
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


