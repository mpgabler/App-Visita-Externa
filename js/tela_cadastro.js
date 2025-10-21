import { getCadastro } from "./database.js";

// Função reutilizável pra formatar telefone
// JS com debug e DOM ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM carregado! Iniciando formatação.");

  // Função corrigida (testada)
  function formatPhone(value) {
    let digits = value.replace(/\D/g, ""); // Só dígitos
    if (digits.length > 11) digits = digits.slice(0, 11); // Limita

    let formatted = "";
    if (digits.length >= 2) {
      formatted = `(${digits.slice(0, 2)}) `; // (DD)
      let rest = digits.slice(2);

      if (rest.length > 0 && rest[0] === "9") {
        // Móvel: 9 XXXX-XXXX
        formatted += "9 ";
        rest = rest.slice(1);
        if (rest.length >= 4) {
          formatted += rest.slice(0, 4) + "-" + rest.slice(4); 
        } else {
          formatted += rest;
        }
      } else {
        // Fixo: XXXX-XXXX
        if (rest.length >= 4) {
          formatted += rest.slice(0, 4) + "-" + rest.slice(4);
        } else {
          formatted += rest;
        }
      }
    } else {
      formatted = digits;
    }

    console.log("Dígitos:", digits, "→ Formato:", formatted); // DEBUG: Veja no console
    return formatted;
  }

  // Input principal
  const inputPrincipal = document.getElementById("telefone_principal");
  if (inputPrincipal) {
    console.log("Input principal encontrado!");
    inputPrincipal.addEventListener("input", (e) => {
      console.log("Input no principal:", e.target.value); // DEBUG
      e.target.value = formatPhone(e.target.value);
    });
  } else {
    console.error("ERRO: Input #telefone_principal não encontrado!");
  }

  // Input contato
  const inputContato = document.getElementById("telefone_contato");
  if (inputContato) {
    console.log("Input contato encontrado!");
    inputContato.addEventListener("input", (e) => {
      console.log("Input no contato:", e.target.value); // DEBUG
      e.target.value = formatPhone(e.target.value);
    });
  } else {
    console.error("ERRO: Input #telefone_contato não encontrado!");
  }
});

// Faz a lógica para mostrar/ocultar os checkboxes de defensivos agrícolas
const simRadio = document.getElementById("Sim_defensivo");
const naoRadio = document.getElementById("Nao_defensivo");
const defensivosDiv = document.getElementById(
  "apresentacao__itens__checkbox__defensivos"
);

if (defensivosDiv) {
  defensivosDiv.style.display = "none"; // Inicialmente escondido

  simRadio.addEventListener("change", () => {
    defensivosDiv.style.display = "block";
  });

  naoRadio.addEventListener("change", () => {
    defensivosDiv.style.display = "none";
  });
}

// ---------- INÍCIO DA LOGICA DO FIELDSET DE PRODUCAO E MANEJO ----------
// Função para autocompletar inputs com tags selecionáveis

// Lista base de culturas (pode vir de JSON/IndexedDB depois)
const culturas = [
  // 🥬 Folhosas / Temperos
  "🥬 Agrião",
  "🌿 Alecrim",
  "🥬 Alface Americana",
  "🥬 Alface Crespa",
  "🥬 Alface Lisa",
  "🧄 Alho-poró",
  "🥬 Almeirão",
  "🥦 Brócolis Comum",
  "🥦 Brócolis Ninja",
  "🌿 Cebolinha",
  "🥬 Chicória",
  "🌿 Coentro",
  "🥬 Couve",
  "🥬 Couve Chinesa",
  "🥦 Couve-flor Branca Graúda",
  "🥬 Espinafre Primeira",
  "🌿 Hortelã",
  "🌿 Manjericão",
  "🥬 Mostarda",
  "🥬 Rúcula",
  "🌿 Salsa",
  "🥬 Serralha",
  "🥬 Taioba",
  "🥬 Repolho Comum Verde",
  "🥬 Repolho Roxo",
  "🥬 Repolho Crespo",

  // 🎃 Abóboras e Abobrinhas
  "🎃 Abóbora Jacaré Madura",
  "🎃 Abóbora Jacaré Verde",
  "🎃 Abóbora Maranhão",
  "🎃 Abóbora Japonesa",
  "🥒 Abobrinha Princesa",
  "🥒 Abobrinha Italiana Extra",

  // 🍆 Frutos / Hortaliças
  "🍆 Berinjela Extra",
  "🥒 Chuchu Extra",
  "🍏 Jiló Comprido Extra",
  "🍏 Jiló Redondo Extra",
  "🌽 Milho Verde com Palha",
  "🌽 Milho Verde sem Palha",
  "🥒 Pepino Japonês",
  "🥒 Pepino Comum Extra A",
  "🫑 Pimentão Amarelo",
  "🫑 Pimentão Vermelho",
  "🫑 Pimentão Verde Extra A",
  "🫛 Quiabo Extra",
  "🍅 Tomate Cereja",
  "🍅 Tomate Italiano",
  "🍅 Tomate Longa Vida Extra AA",
  "🍅 Tomate Longa Vida Extra A",
  "🫛 Vagem Rasteira",
  "🫛 Vagem Macarrão Extra",

  // 🥔 Raízes / Bulbos / Tubérculos
  "🥔 Aipim Extra",
  "🧄 Alho Brasileiro N.5/6",
  "🧄 Alho Importado Branco Chinês",
  "🥔 Batata Baroa",
  "🥔 Batata Lisa Ágatha Esp",
  "🥔 Batata Lisa Ágatha Prim",
  "🍠 Batata Doce Extra",
  "🍠 Batata Doce Especial",
  "🥔 Batata Lisa Asterix Esp",
  "🥕 Beterraba Extra",
  "🥕 Beterraba Especial",
  "🥔 Cará Extra",
  "🧅 Cebola Amarela C2",
  "🧅 Cebola Amarela C3",
  "🧅 Cebola Amarela C4",
  "🧅 Cebola Roxa C3",
  "🥕 Cenoura Extra A",
  "🥕 Cenoura Extra",
  "🌱 Gengibre Extra",
  "🥔 Inhame Dedo Extra",

  // 🍍 Frutas Tropicais
  "🥑 Abacate Comum Extra",
  "🍍 Abacaxi Pérola Graúdo",
  "🍍 Abacaxi Pérola Miúdo",
  "🍍 Abacaxi Pérola Médio",
  "🍏 Atemóia",
  "🍌 Banana Figo Clim Extra",
  "🍌 Banana Maçã Clim Extra",
  "🍌 Banana Maçã Clim Primeira",
  "🍌 Banana Nanica Clim Extra",
  "🍌 Banana Nanica Clim Primeira",
  "🍌 Banana Nanica Clim Segunda",
  "🍌 Banana Ouro Clim Extra",
  "🍌 Banana Ouro Clim Primeira",
  "🍌 Banana Prata Clim Extra",
  "🍌 Banana Prata Clim Primeira",
  "🍌 Banana Prata Clim Segunda",
  "🍌 Banana Terra Clim Extra",
  "🍌 Banana Terra Clim Primeira",
  "🍌 Banana Terra Clim Segunda",
  "🥥 Coco Seco",
  "🥥 Coco Verde Grande",
  "🍓 Goiaba Vermelha Extra",
  "🍊 Laranja Baía T 84-120",
  "🍊 Laranja Lima",
  "🍊 Laranja Pera T.96-140",
  "🍊 Laranja Pera T.64-88",
  "🍊 Laranja Pera T.150-216",
  "🍋 Lima da Pérsia",
  "🍋 Limão Siciliano",
  "🍋 Limão Tahiti T.256-324",
  "🍎 Maçã Fuji Cat.1 T.110-120",
  "🍎 Maçã Fuji Cat.1 T.135-150",
  "🍎 Maçã Gala Cat.1 T.110-120",
  "🍎 Maçã Gala Cat.1 T.135-150",
  "🍈 Mamão Formosa",
  "🍈 Mamão Havaí T.21",
  "🍈 Mamão Havaí T.18",
  "🥭 Manga Palmer Extra",
  "🥭 Manga Tommy Extra",
  "🥭 Maracujá Azedo Extra AAA",
  "🥭 Maracujá Azedo Extra AA",
  "🍉 Melancia Baby",
  "🍉 Melancia Redonda Graúda",
  "🍈 Melão Orange",
  "🍈 Melão Pele de Sapo",
  "🍈 Melão Amarelo Extra",
  "🍈 Melão Amarelo Primeira",
  "🍈 Melão Amarelo Segunda",
  "🍓 Morango Graúdo",
  "🍊 Tangerina Murcott Graúda",
  "🍇 Uva Red Globe",
  "🍇 Uva Itália Extra",
  "🍇 Uva Niágara Extra",

  // 🍏 Frutas Importadas
  "🍑 Ameixa",
  "🥝 Kiwi",
  "🍏 Maçã Grand Smith Extra",
  "🍎 Maçã Red Delicious Extra",
  "🍑 Nectarina",
  "🍐 Pera DAnjou",
  "🍐 Pera Portuguesa",
  "🍐 Pera Pack Triumph",
  "🍐 Pera Williams",
  "🍑 Pêssego Importado",

  // 🥚 Ovos
  "🥚 Ovos Codorna",
  "🥚 Ovos Granja Branco Extra",
  "🥚 Ovos Granja Branco Grande",
  "🥚 Ovos Granja Vermelho Extra",
  "🥚 Ovos Granja Vermelho Grande",

  // 🌾 Grãos / Secos
  "🥜 Amendoim com Casca",
  "🫘 Feijão Carioca",
  "🫘 Feijão Preto",
  "🫘 Feijão Vermelho",
  "🌽 Milho Seco",
  "🌾 Farinha de Mandioca",
];

// lista de irrigacoes

const irrigacoes = [
  "💦 Irrigação por Aspersão",
  "🚿 Irrigação por Pivô Central",
  "🌀 Irrigação por Carretel Enrolador",
  "🌊 Irrigação por Superfície (Sulcos / Inundação)",
  "💧 Irrigação Localizada (Microaspersão)",
  "🌱 Irrigação por Gotejamento",
  "🪣 Irrigação Manual (balde / regador)",
  "⚡ Irrigação Automatizada (sensores e controle eletrônico)",
  "🌧️ Irrigação com Água de Chuva Armazenada",
  "🏞️ Irrigação por Gravidade",
];

// lista de defensivos agrícolas
const defensivos = [
  // Herbicidas 🌿
  "🌿 Glifosato",
  "🌿 2,4-D",
  "🌿 Atrazina",
  "🌿 Paraquate",
  "🌿 Dicamba",
  "🌿 Metolacloro",

  // Inseticidas 🐛
  "🐛 Imidacloprido",
  "🐛 Tiametoxam",
  "🐛 Clorpirifós",
  "🐛 Lambda-Cialotrina",
  "🐛 Cipermetrina",
  "🐛 Fipronil",
  "🐛 Espinosade",
  "🐛 Bacillus thuringiensis (Bt)",

  // Fungicidas 🍄
  "🍄 Mancozebe",
  "🍄 Clorotalonil",
  "🍄 Tebuconazol",
  "🍄 Trifloxistrobina",
  "🍄 Azoxistrobina",
  "🍄 Ciproconazol",
  "🍄 Metalaxil",
  "🍄 Cobre (oxicloreto, hidróxido)",

  // Outros ⚡
  "🐀 Bromadiolona (raticida)",
  "🦠 Estreptomicina (bactericida)",
  "🌱 Óleo mineral / vegetal (ação inseticida e fungicida)",
  "🧪 Enxofre (acaricida/fungicida)",
  "🧪 Calda bordalesa (fungicida tradicional)",
];

const maquinarios = [
  // 🚜 Tratores
  "🚜 Trator Agrícola de Pneus",
  "🚜 Trator de Esteira",
  "🚜 Trator Compacto",
  "🚜 Trator Articulado",
  "🚜 Microtrator (motocultivador)",

  // 🌾 Implementos de Preparo do Solo
  "🌾 Arado de Discos",
  "🌾 Arado de Aivecas",
  "🌾 Grade Aradora",
  "🌾 Grade Niveladora",
  "🌾 Subsolador",
  "🌾 Escarificador",
  "🌾 Cultivador",

  // 🌱 Plantio e Semeadura
  "🌱 Plantadeira de Grãos",
  "🌱 Semeadora Manual",
  "🌱 Semeadora de Precisão",
  "🌱 Adubadora",

  // 🌽 Colheita
  "🌽 Colheitadeira de Grãos",
  "🥔 Colheitadeira de Batata",
  "🥕 Colheitadeira de Cenoura",
  "🍇 Colheitadeira de Uva",
  "🍊 Colheitadeira de Frutas",
  "🍃 Enfardadeira de Feno",

  // 🚛 Transporte
  "🚛 Carreta Agrícola",
  "🚛 Reboque Basculante",

  // 🏭 Pós-colheita e Beneficiamento
  "🏭 Secador de Grãos",
  "🏭 Classificadora de Grãos",
  "🏭 Ensacadora",
  "🏭 Triturador Forrageiro",
  "🏭 Misturador de Ração",

  // 🐄 Pecuária
  "🐄 Ordenhadeira Mecânica",
  "🐄 Vagão Forrageiro",
  "🐄 Misturador de Silagem",
  "🐄 Picador de Forragem",
];

// lista de beneficiamentos
const beneficiamentos = [
  // 🍯 Conservas e Doces
  "🍯 Geleia",
  "🥫 Doce em Calda",
  "🥭 Doce em Pasta",
  "🍬 Rapadura",
  "🍯 Melado de Cana",

  // 🧴 Molhos, Cremes e Pastas
  "🥫 Molho de Tomate",
  "🥫 Antepasto",
  "🥒 Conserva de Pepino",
  "🧄 Pasta de Alho",
  "🌶️ Molho de Pimenta",

  // 🧀 Laticínios
  "🧀 Queijo Frescal",
  "🧀 Queijo Curado",
  "🥛 Iogurte",
  "🥛 Coalhada",
  "🥛 Kefir",
  "🧀 Requeijão",
  "🧈 Manteiga Artesanal",
  "🥛 Leite Pasteurizado",
  "🍦 Sorvete Artesanal",

  // 🍷 Bebidas e Fermentados
  "🍷 Vinho de Uva",
  "🍇 Vinho de Jabuticaba",
  "🍶 Licores Artesanais",
  "🍋 Limoncello",
  "🍺 Cerveja Artesanal",
  "🥂 Sidra",

  // 🍞 Panificados e Massas
  "🍞 Brot (Pão Caseiro)",
  "🥖 Pão Artesanal",
  "🥟 Massa Fresca",
  "🍪 Biscoitos Artesanais",

  // 🥓 Embutidos e Defumados
  "🥓 Socol",
  "🥩 Carne Defumada",
  "🥩 Linguiça Artesanal",
  "🥩 Charque",

  // 🌽 Outros Processados
  "🌽 Farinha de Mandioca",
  "🌽 Polvilho",
  "🥜 Pasta de Amendoim",
  "🫘 Café Torrado e Moído",

  // 🎨 Artesanato e Derivados
  "🎨 Artesanato",
  "🧵 Produtos Têxteis Artesanais",
  "🕯️ Velas Artesanais",
  "🧼 Sabonetes Artesanais",
  "🪔 Cosméticos Naturais",
  "🪵 Móveis Rústicos",
  "🪵 Utensílios de Madeira",
  "🧸 Brinquedos Artesanais",
];

function initAutoComplete(inputId, containerId, suggestionsId, dataList) {
  const input = document.getElementById(inputId);
  const tagContainer = document.getElementById(containerId);
  const suggestionsBox = document.getElementById(suggestionsId);

  let selecionados = [];

  function renderTags() {
    [...tagContainer.querySelectorAll(".tag")].forEach((tag) => tag.remove());

    selecionados.forEach((item) => {
      const tagEl = document.createElement("div");
      tagEl.classList.add("tag");

      // texto separado do botão
      const span = document.createElement("span");
      span.textContent = item;

      const btn = document.createElement("button");
      btn.classList.add("remove");
      btn.textContent = "❌";
      btn.onclick = () => {
        selecionados = selecionados.filter((i) => i !== item);
        renderTags();
      };

      tagEl.appendChild(span);
      tagEl.appendChild(btn);
      tagContainer.appendChild(tagEl);
    });
  }

  function showSuggestions(value) {
    suggestionsBox.innerHTML = "";
    if (!value) {
      suggestionsBox.style.display = "none";
      return;
    }

    const filtrados = dataList.filter(
      (c) =>
        c.toLowerCase().includes(value.toLowerCase()) &&
        !selecionados.includes(c)
    );

    if (filtrados.length > 0) {
      suggestionsBox.style.display = "block";
      filtrados.forEach((c) => {
        const div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.textContent = c;
        div.onclick = () => {
          selecionados.push(c);
          input.value = "";
          renderTags();
          suggestionsBox.style.display = "none";
        };
        suggestionsBox.appendChild(div);
      });
    } else {
      suggestionsBox.style.display = "block"; // mostrar a opção de cadastrar
      const div = document.createElement("div");
      div.classList.add("suggestion-item", "new-item");
      div.textContent = `➕ Cadastrar "${input.value}"`;
      div.onclick = () => {
        const novoItem = input.value.trim();
        if (novoItem && !selecionados.includes(novoItem)) {
          culturas.push(novoItem); // adiciona à lista principal
          selecionados.push(novoItem); // já marca como selecionado
          renderTags();
        }
        input.value = "";
        suggestionsBox.style.display = "none";
      };
      suggestionsBox.appendChild(div);
    }
  }

  // Ouvinte de evento para o input
  input.addEventListener("input", (e) => showSuggestions(e.target.value));

  // Ouvinte de evento para clicar fora e fechar sugestões
  document.addEventListener("click", (e) => {
    if (!tagContainer.contains(e.target)) {
      suggestionsBox.style.display = "none";
    }
  });
}

// Função para selecionar itens ao digitar no input e clicar no item sugerido
// ---------- INICIALIZAÇÃO ----------
initAutoComplete(
  "inputProducao",
  "tagContainerCulturas",
  "suggestionsProducao",
  culturas
);
initAutoComplete(
  "inputIrrigacao",
  "tagContainerIrrigacao",
  "suggestionsIrrigacao",
  irrigacoes
);
initAutoComplete(
  "inputDefensivo",
  "tagContainerDefensivo",
  "suggestionsDefensivo",
  defensivos
);
initAutoComplete(
  "inputMaquinario",
  "tagContainerMaquinario",
  "suggestionsMaquinario",
  maquinarios
);
initAutoComplete(
  "inputBeneficiamento",
  "tagContainerBeneficiamento",
  "suggestionsBeneficiamento",
  beneficiamentos
);

// ---------- FIM DA LOGICA DO FIELDSET DE PRODUCAO E MANEJO ----------

// ---------- INÍCIO DA LOGICA DO TEXTAREA DE AFILIADO A COOPERATIVA ----------
// Faz a lógica para mostrar/ocultar textearea após selecionar "Sim" em Afiliado a cooperativa?
const sim_afiliado = document.getElementById("sim_afiliado");
const nao_afiliado = document.getElementById("nao_afiliado");
const textearea_afiliado = document.getElementById("textarea_afiliado");

if (textearea_afiliado) {
  textearea_afiliado.style.display = "none"; // Inicialmente escondido

  sim_afiliado.addEventListener("change", () => {
    textearea_afiliado.style.display = "block";
  });

  nao_afiliado.addEventListener("change", () => {
    textearea_afiliado.style.display = "none";
  });
}
// ---------- FIM DA LOGICA DO TEXTAREA DE AFILIADO A COOPERATIVA ----------

// ---------- INÍCIO DA LOGICA DO FIELDSET DE POLÍTICAS PÚBLICAS ----------
// Faz a lógica para mostrar/ocultar textearea após selecionar checkbox "Outras políticas públicas"
const outras_politicas = document.getElementById("outras_politicas");
const textarea_politicas = document.getElementById("textarea_politicas");

if (textarea_politicas && outras_politicas) {
  textarea_politicas.style.display = "none"; // Inicialmente escondido

  outras_politicas.addEventListener("change", () => {
    if (outras_politicas.checked) {
      // se já estiver marcado ao carregar a página, mostra o textarea
      textarea_politicas.style.display = "block";
    } else {
      textarea_politicas.style.display = "none";
      textarea_politicas.value = ""; // limpa o valor do textarea se estiver escondido
    }
  });
}
// ---------- FIM DA LOGICA DO TEXTAREA DE AFILIADO A COOPERATIVA ----------
