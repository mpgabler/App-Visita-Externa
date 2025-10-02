import { addCadastro, getCadastro } from "./database.js";


//adiciona ouvinte de evento ao formulário
document
  .getElementById("formulario")
  .addEventListener("submit", async (event) => {
    // prevenir o recarregamento da página
    event.preventDefault(); // Evita o envio padrão do formulário


    //capturar os valores dos inputs na tela_cadastro.html
    const cadastro = {
      // Identificação da Propriedade
      propriedade: document.getElementById("propriedade").value,
      produtor: document.getElementById("produtor").value,
      municipio: document.getElementById("municipio").value,
      telefone_principal: document.getElementById("telefone_principal").value,
      telefone_contato: document.getElementById("telefone_contato").value || null,
      inscricao_estadual: document.getElementById("inscricao_estadual").value || null,

      // Características da Área
      area_total: parseFloat(document.getElementById("area_total").value) || 0,
      area_produtiva: parseFloat(document.getElementById("area_produtiva").value) || 0,
      reserva_legal: document.querySelector('input[name="reserva"]:checked')?.value || "nao",
      car: document.querySelector('input[name="car"]:checked')?.value || "nao",

      // Comerciais
      nota_fiscal: document.querySelector('input[name="nota_fiscal"]:checked')?.value || "nao",
      rastreabilidade: document.querySelector('input[name="rastreabilidade"]:checked') ?.value || "nao",
      cooperativa: document.querySelector('input[name="cooperativa"]:checked')?.value || "nao",
      qual_coop: document.getElementById("textarea_afiliado").value || null,

      // Produção e Manejo (pegando tags já adicionadas nos containers)
      producao: Array.from(document.querySelectorAll("#tagContainerCulturas .tag")).map((tag) => tag.textContent.trim()), 
      irrigacao: Array.from(document.querySelectorAll("#tagContainerIrrigacao .tag")).map((tag) => tag.textContent.trim()),
      defensivos: Array.from(document.querySelectorAll("#tagContainerDefensivo .tag")).map((tag) => tag.textContent.trim()),
      maquinario: Array.from(document.querySelectorAll("#tagContainerMaquinario .tag")).map((tag) => tag.textContent.trim()),
      beneficiamento: Array.from(document.querySelectorAll("#tagContainerBeneficiamento .tag")).map((tag) => tag.textContent.trim()),

      // Políticas Públicas
      politicas_publicas: {
        pnae: document.getElementById("politica_pnae").checked,
        paa: document.getElementById("politica_paa").checked,
        outras: document.getElementById("outras_politicas").checked,
        qual_politica: document.getElementById("textarea_politicas").value || null,
      },

      // Observações
      observacoes: document.getElementById("textAreaObservacoes").value || null,

      // Metadados
      data_cadastro: new Date().toISOString(),
    };

    // Validação simples dos campos obrigatórios (refatorar conforme necessário)
    if (!cadastro.produtor || !cadastro.propriedade || !cadastro.municipio || !cadastro.telefone_principal) {
      alert(
        "Por favor, preencha os campos obrigatórios: "
      );
      return;
    }

    // Salvar no banco de dados
    const sucesso = await addCadastro(cadastro);
    if (sucesso) {
      console.log("Cadastro adicionado com sucesso");
      // limpar o formulário
      event.target.reset();

      console.log("Cadastro salvo!");
    } else {
      console.error("Erro ao salvar o cadastro");
    }
  });
