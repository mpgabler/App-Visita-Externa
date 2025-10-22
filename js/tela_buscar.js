import { getCadastro } from "./database.js";

// Função para buscar pessoas por nome, sobrenome
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado na página de busca!"); // Log 1: Confirma load

  // Listener da busca (sem mudança)
  document.getElementById("botaoBusca").addEventListener("click", async () => {
    console.log("Clicou em botaoBusca!"); // Log 2
    const termo = document.getElementById("busca").value.trim().toLowerCase();
    const resultadosDiv = document.getElementById("resultados");
    const botaoCadastro = document.getElementById("botaoCadastro");

    if (!termo) {
      console.log("Termo vazio, mostrando erro"); // Log 3
      resultadosDiv.innerHTML =
        "<p>Por favor, digite um termo para buscar.</p>";
      botaoCadastro.style.display = "none";
      botaoCadastro.setAttribute("aria-hidden", "true");
      return;
    }

    try {
      console.log("Buscando dados..."); // Log 4
      const cadastro = await getCadastro();
      const resultados = cadastro.filter((pessoa) =>
        (pessoa.produtor || "").toLowerCase().includes(termo)
      );

      if (resultados.length > 0) {
        console.log(`Encontrados ${resultados.length} resultados`); // Log 5
        resultadosDiv.style.display = "block";

        resultadosDiv.innerHTML = resultados
          .map(
            (pessoa) => `
            <div class="resultado-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;" data-id="${pessoa.id}">
                <p style="margin: 0; font-family: 'Roboto', sans-serif; color: #6b4e31; font-weight: bold;">${pessoa.produtor}</p>
                <button class="btn-visualizar" 
                style="background: #2f855a; font-size: 2.5rem; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                🔍 Visualizar
               </button>
            </div>
          `
          )
          .join("");
        botaoCadastro.style.display = "none";
        botaoCadastro.setAttribute("aria-hidden", "true");
      } else {
        console.log("Nenhum resultado"); // Log 6
        resultadosDiv.style.display = "block";
        resultadosDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        botaoCadastro.style.display = "block";
        botaoCadastro.setAttribute("aria-hidden", "false");
      }
    } catch (error) {
      console.error("Erro ao buscar cadastro:", error); // Log 7
      resultadosDiv.innerHTML =
        "<p>Erro ao realizar a busca. Tente novamente.</p>";
      botaoCadastro.style.display = "none";
      botaoCadastro.setAttribute("aria-hidden", "true");
    }
  });

  // Listener do botão cadastro (sem mudança)
  document.getElementById("botaoCadastro").addEventListener("click", () => {
    console.log("Clicou em botaoCadastro, redirecionando..."); // Log 8
    window.location.href = "tela_cadastro.html"; // Absoluto, sem ./
  });

  // Event delegation com logs (anexado aqui, após DOM)
  const resultadosDiv = document.getElementById("resultados");
  if (resultadosDiv) {
    console.log("Container #resultados encontrado, anexando listener"); // Log 9
    resultadosDiv.addEventListener("click", (e) => {
      console.log("Clique detectado no #resultados! Target:", e.target); // Log 10
      e.preventDefault(); // ← FIX: Impede submit/reload do form
      e.stopPropagation(); // ← Opcional: Para bubbling se houver handlers pais

      if (e.target.classList.contains("btn-visualizar")) {
        const item = e.target.closest(".resultado-item");
        const id = item.dataset.id;
        console.log("ID extraído:", id); // Log 11 – Agora deve aparecer!
        if (id) {
          console.log(
            "Redirecionando pra tela_cadastro.html?id=" + id + "&mode=view"
          ); // Log 12
          window.location.href = `tela_cadastro.html?id=${id}&mode=view`; // Executa agora
        } else {
          console.error("ID não encontrado no item"); // Log 13
        }
      }
    });
  } else {
    console.error("ERRO: #resultados não encontrado! Cheque o ID no HTML."); // Log 14
  }
});
