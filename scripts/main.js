const ABA_PADRAO = "inicio";

const abas = [...document.querySelectorAll(".aba")];

function abrirAba(nome, { focar = false } = {}) {
  const alvo = abas.find((aba) => aba.dataset.aba === nome) ?? abas.find((aba) => aba.dataset.aba === ABA_PADRAO);

  for (const aba of abas) {
    const ativa = aba === alvo;
    aba.setAttribute("aria-selected", String(ativa));
    aba.tabIndex = ativa ? 0 : -1;
    document.getElementById(aba.getAttribute("aria-controls")).hidden = !ativa;
  }

  if (focar) alvo.focus();
}

function abaDoEndereco() {
  return location.hash.slice(1) || ABA_PADRAO;
}

for (const aba of abas) {
  aba.addEventListener("click", () => {
    history.replaceState(null, "", `#${aba.dataset.aba}`);
    abrirAba(aba.dataset.aba);
  });

  // Navegação pelo teclado entre as abas (setas, Home e End).
  aba.addEventListener("keydown", (evento) => {
    const atual = abas.indexOf(aba);
    const destinos = {
      ArrowRight: (atual + 1) % abas.length,
      ArrowLeft: (atual - 1 + abas.length) % abas.length,
      Home: 0,
      End: abas.length - 1,
    };
    if (!(evento.key in destinos)) return;
    evento.preventDefault();
    abas[destinos[evento.key]].click();
    abas[destinos[evento.key]].focus();
  });
}

window.addEventListener("hashchange", () => abrirAba(abaDoEndereco()));
abrirAba(abaDoEndereco());
