import { addCadastro, getCadastro } from "./database.js";

// Limpa erros ao focar (adicione uma vez no script, após DOM load)
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado!"); // Para teste

  document.querySelectorAll("input, textarea, select").forEach((el) => {
    el.addEventListener("focus", () => el.classList.remove("error"));
  });
});

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
      telefone_contato:
        document.getElementById("telefone_contato").value || null,
      inscricao_estadual:
        document.getElementById("inscricao_estadual").value || null,

      // Características da Área
      area_total: parseFloat(document.getElementById("area_total").value) || 0,
      area_produtiva:
        parseFloat(document.getElementById("area_produtiva").value) || 0,
      reserva_legal:
        document.querySelector('input[name="reserva"]:checked')?.value || "nao",
      car: document.querySelector('input[name="car"]:checked')?.value || "nao",

      // Comerciais
      nota_fiscal:
        document.querySelector('input[name="nota_fiscal"]:checked')?.value ||
        "nao",
      rastreabilidade:
        document.querySelector('input[name="rastreabilidade"]:checked')
          ?.value || "nao",
      cooperativa:
        document.querySelector('input[name="cooperativa"]:checked')?.value ||
        "nao",
      qual_coop: document.getElementById("textarea_afiliado").value || null,

      // Produção e Manejo (pegando tags já adicionadas nos containers)
      producao: Array.from(
        document.querySelectorAll("#tagContainerCulturas .tag")
      ).map((tag) => tag.textContent.trim()),
      irrigacao: Array.from(
        document.querySelectorAll("#tagContainerIrrigacao .tag")
      ).map((tag) => tag.textContent.trim()),
      defensivos: Array.from(
        document.querySelectorAll("#tagContainerDefensivo .tag")
      ).map((tag) => tag.textContent.trim()),
      maquinario: Array.from(
        document.querySelectorAll("#tagContainerMaquinario .tag")
      ).map((tag) => tag.textContent.trim()),
      beneficiamento: Array.from(
        document.querySelectorAll("#tagContainerBeneficiamento .tag")
      ).map((tag) => tag.textContent.trim()),

      // Políticas Públicas
      politicas_publicas: {
        pnae: document.getElementById("politica_pnae").checked,
        paa: document.getElementById("politica_paa").checked,
        outras: document.getElementById("outras_politicas").checked,
        qual_politica:
          document.getElementById("textarea_politicas").value || null,
      },

      // Observações
      observacoes: document.getElementById("textAreaObservacoes").value || null,

      // Metadados
      data_cadastro: new Date().toISOString(),
    };

    // Função auxiliar para sinalizar erro (com log)
    function sinalizarErro(elemento, nomeCampo) {
      console.log(`Tentando sinalizar ${nomeCampo}:`, elemento); // Debug: vê se elemento é null
      if (elemento) {
        elemento.classList.add("error");
        console.log(`Classe 'error' adicionada a ${nomeCampo}`); // Confirma adição
      } else {
        console.error(`Elemento NULL para ${nomeCampo}! Verifique ID no HTML.`);
      }
    }

    // Validação com sinalização e debug
    let temErro = false;

    // Produtor
    if (!cadastro.produtor) {
      sinalizarErro(document.getElementById("produtor"), "Produtor");
      temErro = true;
    }

    // Propriedade
    if (!cadastro.propriedade) {
      sinalizarErro(document.getElementById("propriedade"), "Propriedade");
      temErro = true;
    }

    // Município
    if (!cadastro.municipio) {
      sinalizarErro(document.getElementById("municipio"), "Município");
      temErro = true;
    }

    // Telefone Principal
    if (!cadastro.telefone_principal) {
      sinalizarErro(
        document.getElementById("telefone_principal"),
        "Telefone Principal"
      );
      temErro = true;
    }

    // Área Total
    if (!cadastro.area_total) {
      sinalizarErro(document.getElementById("area_total"), "Área Total");
      temErro = true;
    }

    // Área Produtiva
    if (!cadastro.area_produtiva) {
      sinalizarErro(
        document.getElementById("area_produtiva"),
        "Área Produtiva"
      );
      temErro = true;
    }

    // Produção (verifica container se vazio)
    if (!cadastro.producao.length) {
      sinalizarErro(
        document.getElementById("tagContainerCulturas"),
        "Produção"
      );
      temErro = true;
    }

    // Irrigação
    if (!cadastro.irrigacao.length) {
      sinalizarErro(
        document.getElementById("tagContainerIrrigacao"),
        "Irrigação"
      );
      temErro = true;
    }

    // Defensivos
    if (!cadastro.defensivos.length) {
      sinalizarErro(
        document.getElementById("tagContainerDefensivo"),
        "Defensivos"
      );
      temErro = true;
    }

    // // Beneficiamento
    // if (!cadastro.beneficiamento.length) {
    //   sinalizarErro(
    //     document.getElementById("tagContainerBeneficiamento"),
    //     "Beneficiamento"
    //   );
    //   temErro = true;
    // }

    // Maquinário
    if (!cadastro.maquinario.length) {
      sinalizarErro(
        document.getElementById("tagContainerMaquinario"),
        "Maquinário"
      );
      temErro = true;
    }

    // Reserva Legal (radio)
    const reservaContainer = document
      .querySelector('input[name="reserva"]')
      .closest(".apresentacao__itens__radio");
    if (
      !reservaContainer ||
      !document.querySelector('input[name="reserva"]:checked')
    ) {
      sinalizarErro(reservaContainer, "Reserva Legal");
      temErro = true;
    }

    // Nota Fiscal (radio)
    const notaFiscalContainer = document
      .querySelector('input[name="nota_fiscal"]')
      .closest(".apresentacao__itens__radio");
    if (
      !notaFiscalContainer ||
      !document.querySelector('input[name="nota_fiscal"]:checked')
    ) {
      sinalizarErro(notaFiscalContainer, "Nota Fiscal");
      temErro = true;
    }

    // CAR (radio)
    const carContainer = document
      .querySelector('input[name="car"]')
      .closest(".apresentacao__itens__radio");
    if (!carContainer || !document.querySelector('input[name="car"]:checked')) {
      sinalizarErro(carContainer, "Cadastro Ambiental Rural");
      temErro = true;
    }

    // Rastreabilidade (radio)
    const rastreabilidadeContainer = document
      .querySelector('input[name="rastreabilidade"]')
      .closest(".apresentacao__itens__radio");
    if (
      !rastreabilidadeContainer ||
      !document.querySelector('input[name="rastreabilidade"]:checked')
    ) {
      sinalizarErro(rastreabilidadeContainer, "Rastreabilidade");
      temErro = true;
    }

    // Cooperativa (radio)
    const cooperativaContainer = document
      .querySelector('input[name="cooperativa"]')
      .closest(".apresentacao__itens__radio");
    if (
      !cooperativaContainer ||
      !document.querySelector('input[name="cooperativa"]:checked')
    ) {
      sinalizarErro(cooperativaContainer, "Cooperativa");
      temErro = true;
    }

    // Qual Coop (condicional: se "sim", deve ser preenchido)
    if (cadastro.cooperativa === "sim" && !cadastro.qual_coop) {
      sinalizarErro(document.getElementById("textarea_afiliado"), "Qual Coop");
      temErro = true;
    }

    // Obrigatoriedade no preenchimento da seção 'Políticas Públicas'
    // // Políticas Públicas (se nenhum checkbox marcado)
    // const pnaeCheckbox = document.getElementById("politica_pnae");
    // const paaCheckbox = document.getElementById("politica_paa");
    // const outrasCheckbox = document.getElementById("outras_politicas");

    // if (
    //   !pnaeCheckbox.checked &&
    //   !paaCheckbox.checked &&
    //   !outrasCheckbox.checked
    // ) {
    //   const container = document.querySelector(
    //     ".apresentacao__itens__checkbox"
    //   );
    //   sinalizarErro(container, "Políticas Públicas");
    //   temErro = true;
    // }

    console.log("Tem erros totais?", temErro); // Debug final

    if (temErro) {
      const modal = document.getElementById("modalErro");
      const mensagem = document.getElementById("mensagemModal");
      mensagem.textContent =
        "Por favor, preencha os campos obrigatórios sinalizados em laranja.";
      modal.style.display = "flex";

      // Fechar modal ao clicar no X ou no botão
      document.querySelector(".fechar").onclick = () =>
        (modal.style.display = "none");
      document.getElementById("btnFecharModal").onclick = () =>
        (modal.style.display = "none");

      // Fechar ao clicar fora do modal
      window.onclick = (event) => {
        if (event.target === modal) modal.style.display = "none";
      };

      return;
    }

    // Salvar no banco de dados e impressão
    const sucesso = await addCadastro(cadastro);
    if (sucesso) {
      console.log("Cadastro adicionado com sucesso");

      // --- INÍCIO DA LÓGICA DE IMPRESSÃO ---

      // 1. Preenche o cabeçalho invisível do PDF (conforme configuramos antes)
      const dataCampo = document.getElementById("data-emissao");
      const protocoloCampo = document.getElementById("protocolo-id");
      if (dataCampo) dataCampo.textContent = new Date().toLocaleString("pt-BR");
      if (protocoloCampo) protocoloCampo.textContent = "VIS-" + Date.now();

      // 2. Dispara a impressão
      // O timeout de 500ms é uma "boa prática" para garantir que o browser
      // renderizou o cabeçalho e as tags antes de abrir a caixa de diálogo.
      setTimeout(() => {
        window.print();

        // --- LÓGICA DE PÓS-IMPRESSÃO ---
        console.log("Cadastro salvo e PDF gerado!");

        // Exibe o alerta de sucesso
        const alerta = document.getElementById("alerta"); // Certifique-se de que a var 'alerta' existe
        alerta.classList.add("mostrar");

        // Limpar o formulário
        event.target.reset();

        // Aguarda 2 segundos e redireciona
        setTimeout(() => {
          alerta.classList.remove("mostrar");
          window.location.href = "index.html";
        }, 2000);
      }, 500);

      // --- FIM DA LÓGICA DE IMPRESSÃO ---
    } else {
      console.error("Erro ao salvar o cadastro");
    }
  });
