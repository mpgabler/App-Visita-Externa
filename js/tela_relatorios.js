import db from './database.js';

console.log("Banco importado:", db);

// Função para exportar dados dos produtores para Excel


document.getElementById('botao_exportar').addEventListener('click', async () => {
    const produtores = await db.cadastro.toArray();
    console.log("Produtores para exportar:", produtores);
    if (produtores.length === 0) {
        alert("Nenhum produtor cadastrado para exportar.");
        return;
    }

    const dados = [
        ['Nome Completo', 'Endereço', 'Cidade/Estado', 'Telefone', 'Itens Produtos', 'Usa Defensivo?', 'Itens Defensivos', 'Emite Nota?', 'Data Cadastro'],
        ...produtores.map(p => [
            `${p.nome} ${p.sobrenome}`,
            `${p.endereco}, ${p.numero} - ${p.bairro}`,
            `${p.cidade} - ${p.estado}`,
            p.telefone,
            p.itens_produtos.join(', '),
            p.grupo_radio_defensivo,
            p.itens_defensivos.join(', '),
            p.grupo_radio_emissao_nota,
            new Date(p.data_cadastro).toLocaleDateString()
        ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(dados);
    XLSX.utils.book_append_sheet(wb, ws, 'Relatorio_Produtores');
    XLSX.writeFile(wb, 'relatorio_produtores_' + new Date().toISOString().slice(0, 10) + '.xlsx');
});

