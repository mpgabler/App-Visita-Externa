 import { getCadastro } from './database.js';

// Função para buscar pessoas por nome, sobrenome ou CPF na tela de busca
document.getElementById('botaoBusca').addEventListener('click', async () => {
  const termo = document.getElementById('busca').value.trim().toLowerCase();
  const resultadosDiv = document.getElementById('resultados');
  const botaoCadastro = document.getElementById('botaoCadastro');

  if (!termo) {
    resultadosDiv.innerHTML = '<p>Por favor, digite um termo para buscar.</p>';
    botaoCadastro.style.display = 'none';
    botaoCadastro.setAttribute('aria-hidden', 'true');
    return;
  }

  try {
    const cadastro = await getCadastro();
    const resultados = cadastro.filter(pessoa =>
      pessoa.nome.toLowerCase().includes(termo) ||
      pessoa.sobrenome.toLowerCase().includes(termo) ||
      pessoa.cpf.includes(termo)
    );

    if (resultados.length > 0) {
      resultadosDiv.innerHTML = resultados
        .map(pessoa => `
          <div class="resultado-item">
            <p><strong>Nome:</strong> ${pessoa.nome} ${pessoa.sobrenome}</p>
            <p><strong>CPF:</strong> ${pessoa.cpf}</p>
          </div>
        `)
        .join('');
      botaoCadastro.style.display = 'none';
      botaoCadastro.setAttribute('aria-hidden', 'true');
    } else {
      resultadosDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
      botaoCadastro.style.display = 'block';
      botaoCadastro.setAttribute('aria-hidden', 'false');
    }
  } catch (error) {
    console.error('Erro ao buscar cadastro:', error);
    resultadosDiv.innerHTML = '<p>Erro ao realizar a busca. Tente novamente.</p>';
    botaoCadastro.style.display = 'none';
    botaoCadastro.setAttribute('aria-hidden', 'true');
  }
});

document.getElementById('botaoCadastro').addEventListener('click', () => {
  window.location.href = './index.html';
});