import { addCadastro, getCadastro } from "./database.js";
import { renderCadastros } from "./ui.js";

    //adiciona ouvinte de evento ao formulário
    document.getElementById("formulario").addEventListener("submit", async (event) => {
    // prevenir o recarregamento da página
    event.preventDefault();

    //capturar os valores dos inputs
    const cadastro = {
        nome: document.getElementById("nome").value,
        sobrenome: document.getElementById("sobrenome").value,
        cpf: document.getElementById("cpf").value,
        cnpj: document.getElementById("cnpj").value,
        nome_fantasia: document.getElementById("nome_fantasia").value,
        endereco: document.getElementById("endereco").value,
        numero: document.getElementById("numero").value,
        bairro: document.getElementById("bairro").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value,
        telefone: document.getElementById("telefone").value,
        itens_produtos: Array.from(document.querySelectorAll('input[name="itens_produtos"]:checked')).map(input => input.value),
        grupo_radio_defensivo: document.querySelector('input[name="grupo_radio_defensivo"]:checked')?.value || 'Nao',
        itens_defensivos: Array.from(document.querySelectorAll('input[name="itens_defensivos"]:checked')).map(input => input.value),
        grupo_radio_emissao_nota: document.querySelector('input[name="grupo_radio_emissao_nota"]:checked')?.value || 'Nao'

    };

        // Validação simples dos campos obrigatórios
    if (!cadastro.nome || !cadastro.sobrenome || !cadastro.cpf) {
        alert("Por favor, preencha os campos obrigatórios: Nome, Sobrenome e CPF.");
        return;
    }

    // Salvar no banco de dados
    const sucesso = await addCadastro(cadastro);
    if (sucesso) {
        console.log("Cadastro adicionado com sucesso");
        // limpar o formulário
        event.target.reset();

        await renderCadastros(); // Atualiza a lista de cadastros exibida
        console.log("Cadastro salvo e tabela atualizada!");
    }else {
        console.error("Erro ao salvar o cadastro");
    }

});
