import { getCadastro } from "./database.js";

// Função para buscar pessoas por nome, sobrenome
document.getElementById("botaoBusca").addEventListener("click", async () => {
  const termo = document.getElementById("busca").value.trim().toLowerCase();
  const resultadosDiv = document.getElementById("resultados");
  const botaoCadastro = document.getElementById("botaoCadastro");

  if (!termo) {
    resultadosDiv.innerHTML = "<p>Por favor, digite um termo para buscar.</p>";
    botaoCadastro.style.display = "none";
    botaoCadastro.setAttribute("aria-hidden", "true");
    return;
  }

  try {
    const cadastro = await getCadastro();
    const resultados = cadastro.filter((pessoa) =>
      (pessoa.produtor || "").toLowerCase().includes(termo)
    );

    if (resultados.length > 0) {
      resultadosDiv.style.display = "block";

      resultadosDiv.innerHTML = resultados
        .map(
          (pessoa) => `
          <div class="resultado-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
              <p style="margin: 0; font-family: "Roboto", sans-serif; color: #6b4e31; font-weight: bold;">${pessoa.produtor}</p>
               <button onclick="visualizarCadastro('${pessoa.id}')" 
              style="background: #2f855a; font-size: 2.5rem; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
              🔍 Visualizar
             </button>
          </div>
        `)
        .join("");
      botaoCadastro.style.display = "none";
      botaoCadastro.setAttribute("aria-hidden", "true");
    } else {
      resultadosDiv.style.display = "block";

      resultadosDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      botaoCadastro.style.display = "block";
      botaoCadastro.setAttribute("aria-hidden", "false");
    }
  } catch (error) {
    console.error("Erro ao buscar cadastro:", error);
    resultadosDiv.innerHTML =
      "<p>Erro ao realizar a busca. Tente novamente.</p>";
    botaoCadastro.style.display = "none";
    botaoCadastro.setAttribute("aria-hidden", "true");
  }
});

document.getElementById("botaoCadastro").addEventListener("click", () => {
  window.location.href = "./tela_cadastro.html";
});
