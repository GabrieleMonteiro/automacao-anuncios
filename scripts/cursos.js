import { buscarConteudos } from "./supabase.js";

const ROTULOS_TIPO = { curso: "Curso", congresso: "Congresso" };

// Remove acentos e diferenças de maiúsculas para a busca.
function normalizar(texto) {
  return String(texto ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function plural(quantidade, singular, pluralizado) {
  return `${quantidade} ${quantidade === 1 ? singular : pluralizado}`;
}

function criarLinha(item) {
  const linha = document.createElement("tr");
  for (const valor of [ROTULOS_TIPO[item.tipo] ?? item.tipo, item.numero, item.codigo, item.nome]) {
    const celula = document.createElement("td");
    celula.textContent = valor ?? "";
    linha.append(celula);
  }
  linha.cells[0].className = `tipo tipo-${item.tipo}`;
  return linha;
}

/**
 * Carrega o HTML da aba Cursos em `painel`, busca os dados e liga filtros e busca.
 * @param {HTMLElement} painel
 */
export async function iniciarCursos(painel) {
  try {
    const resposta = await fetch("pages/cursos.html");
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    painel.innerHTML = await resposta.text();
  } catch {
    painel.innerHTML = '<h2>Cursos</h2><p class="aviso erro" role="alert">Não foi possível carregar esta aba. Recarregue a página.</p>';
    return;
  }

  const status = painel.querySelector("#status-cursos");
  const contador = painel.querySelector("#contador-cursos");
  const containerTabela = painel.querySelector(".tabela-container");
  const corpo = painel.querySelector("#corpo-cursos");
  const campoBusca = painel.querySelector("#busca-cursos");
  const botoesTipo = [...painel.querySelectorAll(".filtro-botao")];

  let conteudos = [];
  let tipoSelecionado = "todos";

  function renderizar() {
    const termo = normalizar(campoBusca.value);
    const visiveis = conteudos.filter(
      (item) =>
        (tipoSelecionado === "todos" || item.tipo === tipoSelecionado) &&
        (!termo || item.busca.includes(termo)),
    );

    const cursos = visiveis.filter((item) => item.tipo === "curso").length;
    const congressos = visiveis.length - cursos;
    contador.textContent = `${plural(cursos, "curso", "cursos")} · ${plural(congressos, "congresso", "congressos")}`;

    corpo.replaceChildren(...visiveis.map(criarLinha));
    containerTabela.hidden = visiveis.length === 0;
    status.hidden = visiveis.length > 0;
    status.classList.remove("erro");
    status.textContent = "Nenhum resultado para os filtros escolhidos.";
  }

  for (const botao of botoesTipo) {
    botao.addEventListener("click", () => {
      tipoSelecionado = botao.dataset.tipo;
      for (const outro of botoesTipo) outro.setAttribute("aria-pressed", String(outro === botao));
      renderizar();
    });
  }
  campoBusca.addEventListener("input", renderizar);

  try {
    const dados = await buscarConteudos();
    conteudos = dados.map((item) => ({
      ...item,
      busca: normalizar(`${item.numero} ${item.codigo} ${item.nome}`),
    }));
    renderizar();
  } catch (erro) {
    console.error(erro);
    status.classList.add("erro");
    status.setAttribute("role", "alert");
    status.textContent = "Não foi possível carregar os cursos. Verifique sua conexão e recarregue a página.";
  }
}
