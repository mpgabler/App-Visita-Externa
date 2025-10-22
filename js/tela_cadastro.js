import { getCadastro } from "./database.js";

// Função auxiliar pra setar radio baseado em valor salvo
function setRadioChecked(name, savedValue) {
  const radios = document.querySelectorAll(`input[name="${name}"]`);
  radios.forEach((radio) => {
    radio.checked = radio.value === savedValue;
  });
}

// Função auxiliar para preencher tags (definida globalmente)
function preencherTags(containerId, tagsArray) {
  try {
    const container = document.querySelector(containerId);
    if (!container) {
      console.warn("Container não encontrado:", containerId);
      return;
    }
    container.innerHTML = ""; // Limpa container
    (tagsArray || []).forEach((tagText) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = tagText.trim();
      // Opcional: Adicione botão remover se precisar
      // const removerBtn = document.createElement('button');
      // removerBtn.textContent = '×';
      // removerBtn.onclick = () => tag.remove();
      // tag.appendChild(removerBtn);
      container.appendChild(tag);
    });
    console.log(`Tags preenchidas em ${containerId}:`, tagsArray.length);
  } catch (tagError) {
    console.error("Erro ao preencher tags:", tagError, containerId);
  }
}

// Função auxiliar: Aplica modo view
function aplicarModoView() {
  const campos = [
    "propriedade",
    "produtor",
    "municipio",
    "telefone_principal",
    "telefone_contato",
    "inscricao_estadual",
    "area_total",
    "area_produtiva",
    "textarea_afiliado",
    "textarea_politicas",
    "textAreaObservacoes",
  ];
  campos.forEach((id) => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.readOnly = true;
      campo.style.backgroundColor = "#f5f5f5"; // Visual bloqueado
    }
  });
  // Checkboxes usam disabled
  ["politica_pnae", "politica_paa", "outras_politicas"].forEach((id) => {
    const cb = document.getElementById(id);
    if (cb) cb.disabled = true;
  });
}

// Remove modo view
function removerModoView() {
  const campos = [
    "propriedade",
    "produtor",
    "municipio",
    "telefone_principal",
    "telefone_contato",
    "inscricao_estadual",
    "area_total",
    "area_produtiva",
    "textarea_afiliado",
    "textarea_politicas",
    "textAreaObservacoes",
  ];
  campos.forEach((id) => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.readOnly = false;
      campo.style.backgroundColor = "";
    }
  });
  // Checkboxes voltam ao normal
  ["politica_pnae", "politica_paa", "outras_politicas"].forEach((id) => {
    const cb = document.getElementById(id);
    if (cb) cb.disabled = false;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Tela cadastro carregada!"); // Debug: Confirma load

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const mode = urlParams.get("mode") || "edit";

  console.log("ID buscado:", id, "Mode:", mode); // Debug

  if (!id) {
    console.log("Novo cadastro (sem ID)");
    return;
  }

  try {
    console.log("Buscando dados...");
    const cadastro = await getCadastro();
    console.log("Dados carregados:", cadastro.length, "itens");

    const produtor = cadastro.find((p) => p.id == id); // == não estrito

    document.getElementById("telefone_principal").value = formatDigits(
      produtor.telefone_principal || ""
    );
    document.getElementById("telefone_contato").value = formatDigits(
      produtor.telefone_contato || ""
    );

    if (!produtor) {
      console.error(
        "Produtor não encontrado! IDs disponíveis:",
        cadastro.map((p) => p.id)
      );
      alert("Produtor não encontrado.");
      window.history.back();
      return;
    }

    console.log("Produtor achado:", produtor); // Debug: Veja os dados

    // Preenche campos simples
    document.getElementById("propriedade").value = produtor.propriedade || "";
    document.getElementById("produtor").value = produtor.produtor || "";
    document.getElementById("municipio").value = produtor.municipio || "";
    document.getElementById("telefone_principal").value = formatDigits(
      produtor.telefone_principal || ""
    );
    document.getElementById("telefone_contato").value = formatDigits(
      produtor.telefone_contato || ""
    );
    document.getElementById("inscricao_estadual").value =
      produtor.inscricao_estadual || "";
    document.getElementById("area_total").value = produtor.area_total || "";
    document.getElementById("area_produtiva").value =
      produtor.area_produtiva || "";
    document.getElementById("textarea_afiliado").value =
      produtor.qual_coop || "";

    setRadioChecked("reserva", produtor.reserva_legal || "nao");
    setRadioChecked("car", produtor.car || "nao");
    setRadioChecked("nota_fiscal", produtor.nota_fiscal || "nao");
    setRadioChecked("rastreabilidade", produtor.rastreabilidade || "nao");
    setRadioChecked("cooperativa", produtor.cooperativa || "nao");

    // Preenche tags
    preencherTags("#tagContainerCulturas", produtor.producao || []);
    preencherTags("#tagContainerIrrigacao", produtor.irrigacao || []);
    preencherTags("#tagContainerDefensivo", produtor.defensivos || []);
    preencherTags("#tagContainerMaquinario", produtor.maquinario || []);
    preencherTags("#tagContainerBeneficiamento", produtor.beneficiamento || []);

    // Preenche políticas e observações
    document.getElementById("politica_pnae").checked =
      produtor.politicas_publicas?.pnae || false;
    document.getElementById("politica_paa").checked =
      produtor.politicas_publicas?.paa || false;
    document.getElementById("outras_politicas").checked =
      produtor.politicas_publicas?.outras || false;
    document.getElementById("textarea_politicas").value =
      produtor.politicas_publicas?.qual_politica || "";
    document.getElementById("textAreaObservacoes").value =
      produtor.observacoes || "";

    console.log("Preenchimento concluído!"); // Debug: Sucesso

    if (mode === "view") {
      aplicarModoView(); // Inicial: Bloqueia campos
    }

    // Botão alternar: Sempre configura (funciona em view ou edit)
    const btnAlternar = document.getElementById("btnAlternar");
    if (btnAlternar) {
      // Função toggle reutilizável (chamada a cada clique)
      const toggleHandler = (e) => {
        e.preventDefault(); // Bloqueia qualquer submit acidental
        e.stopPropagation(); // Evita bubbling

        const currentMode = urlParams.get("mode") || "edit"; // Estado atual da URL

        if (currentMode === "view") {
          // De view pra edit
          removerModoView(); // Libera campos
          btnAlternar.textContent = "Cancelar Edição";
          urlParams.set("mode", "edit");
        } else {
          // De edit pra view
          aplicarModoView(); // Bloqueia campos
          btnAlternar.textContent = "Editar";
          urlParams.set("mode", "view");
        }

        // Atualiza URL sem reload
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${urlParams}`
        );
      };

      // Define o handler (uma vez só – toggle roda sempre)
      btnAlternar.onclick = toggleHandler;

      // Config inicial baseada no mode
      if (mode === "view") {
        btnAlternar.textContent = "Editar";
        btnAlternar.style.display = "block";
      } else {
        // Se carregar em edit (ex: direto na URL), mostra "Cancelar"
        btnAlternar.textContent = "Cancelar Edição";
        btnAlternar.style.display = "block";
      }
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    alert(`Erro ao carregar dados do produtor: ${error.message}`);
  }
});

// Função só pra formatar dígitos em string (sem cursor)
function formatDigits(value) {
  const digits = value.replace(/\D/g, ""); // Limpa sempre
  if (digits.length === 0) return ""; // ← FIX: Apagou tudo? Limpa total, sem máscara
  if (digits.length > 11) digits = digits.slice(0, 11);
  let formatted = "";
  if (digits.length >= 2) {
    formatted = `(${digits.slice(0, 2)}) `;
    let rest = digits.slice(2);
    if (rest.length > 0 && rest[0] === "9") {
      formatted += "9 ";
      rest = rest.slice(1);
      if (rest.length >= 4) {
        formatted += rest.slice(0, 4) + "-" + rest.slice(4);
      } else {
        formatted += rest;
      }
    } else {
      if (rest.length >= 4) {
        formatted += rest.slice(0, 4) + "-" + rest.slice(4);
      } else {
        formatted += rest;
      }
    }
  } else {
    formatted = digits;
  }
  return formatted;
}

// Listener pro principal (com fix de cursor)
const inputPrincipal = document.getElementById("telefone_principal");
inputPrincipal.addEventListener("input", (e) => {
  const currentValue = e.target.value; // Valor após tecla/apagar (misto)
  const cursorPos = e.target.selectionStart; // Posição no currentValue

  const formatted = formatDigits(currentValue); // ← Chama direto (função limpa internamente)

  e.target.value = formatted;

  // Conta dígitos antes do cursor no currentValue (ignora símbolos)
  let digitsBefore = 0;
  for (let i = 0; i < cursorPos; i++) {
    if (/\d/.test(currentValue[i])) digitsBefore++;
  }

  // Encontra a posição no formatted após o digitsBefore-ésimo dígito
  let newPos = formatted.length; // Default: final
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      count++;
      if (count === digitsBefore) {
        newPos = i + 1; // Após esse dígito
        break;
      }
    }
  }

  e.target.setSelectionRange(newPos, newPos); // Reposiciona
});

// Mesmo pro contato
const inputContato = document.getElementById("telefone_contato");
inputContato.addEventListener("input", (e) => {
  const currentValue = e.target.value;
  const cursorPos = e.target.selectionStart;

  const formatted = formatDigits(currentValue); // ← Chama direto (função limpa internamente)

  e.target.value = formatted;

  let digitsBefore = 0;
  for (let i = 0; i < cursorPos; i++) {
    if (/\d/.test(currentValue[i])) digitsBefore++;
  }

  let newPos = formatted.length;
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      count++;
      if (count === digitsBefore) {
        newPos = i + 1;
        break;
      }
    }
  }

  e.target.setSelectionRange(newPos, newPos);
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
