import db from './database.js';

console.log("Banco importado:", db);

// Função para exportar dados dos produtores para Excel

// remove emojis e caracteres especiais no início
function limparTexto(str) {
  return str ? str.replace(/[^\p{L}\p{N}\s]/gu, "").trim() : "";
}


document.getElementById('botao_exportar').addEventListener('click', async () => {
    const produtores = await db.cadastro.toArray();
    console.log("Produtores para exportar:", produtores);
    if (produtores.length === 0) {
        alert("Nenhum produtor cadastrado para exportar.");
        return;
    }

const dados = [
  [
    'Propriedade',
    'Produtor Rural',
    'Município',
    'Telefone Principal',
    'Telefone Contato',
    'Inscrição Estadual',
    'Área Total (ha)',
    'Área Produtiva (ha)',
    'Reserva Legal',
    'CAR',
    'Emite Nota Fiscal',
    'Rastreabilidade',
    'Cooperativa',
    'Qual Cooperativa',
    'Produção',
    'Irrigação',
    'Defensivos',
    'Maquinário',
    'Beneficiamento',
    'Políticas Públicas',
    'Observações',
    'Data Cadastro'
  ],
  ...produtores.map(p => [ // mapeia cada produtor para uma linha
    p.propriedade,
    p.produtor,
    p.municipio,
    p.telefone_principal,
    p.telefone_contato || '-',
    p.inscricao_estadual || '-',
    p.area_total,
    p.area_produtiva,
    p.reserva_legal,
    p.car,
    p.nota_fiscal,
    p.rastreabilidade,
    p.cooperativa,
    p.qual_coop || '-',
    (p.producao || []).map(limparTexto).join(', '), // limpa texto antes de juntar
    (p.irrigacao || []).map(limparTexto).join(', '),
    (p.defensivos || []).map(limparTexto).join(', '),
    (p.maquinario || []).map(limparTexto).join(', '),
    (p.beneficiamento || []).map(limparTexto).join(', '),
    [
      p.politicas_publicas?.pnae ? "PNAE" : null,
      p.politicas_publicas?.paa ? "PAA" : null,
      p.politicas_publicas?.outras ? `Outras: ${p.politicas_publicas.qual_politica}` : null
    ].filter(Boolean).join(', '),
    p.observacoes || '-',
    new Date(p.data_cadastro).toLocaleDateString()
  ])
];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(dados);
    XLSX.utils.book_append_sheet(wb, ws, 'Relatorio_Produtores');
    XLSX.writeFile(wb, 'relatorio_produtores_' + new Date().toISOString().slice(0, 10) + '.xlsx');
});

