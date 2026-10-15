# automacao-anuncios

**Estúdio de Anúncios**: gerador de anúncios dos cursos gratuitos do CESS.

O objetivo é facilitar a criação de anúncios para divulgar os cursos gratuitos
do CESS. A integração com a Meta e com IA está prevista para as próximas etapas.
Por enquanto, o projeto tem:

- **Início**: espaço reservado para o formulário de geração.
- **Cursos**: lista somente leitura dos cursos e congressos ativos cadastrados
  no Supabase do Foca (tabela `conteudos`), com filtro por tipo e busca por
  número, código ou nome.

## Tecnologias

- HTML, CSS e JavaScript puros, em arquivos separados
- Sem framework e sem etapa de build
- Publicado pelo GitHub Pages a partir da raiz da branch `main`

## Estrutura

```
.
├── index.html        # página inicial (raiz, usada pelo GitHub Pages)
├── pages/
│   └── cursos.html   # conteúdo da aba Cursos (carregado sob demanda)
├── styles/
│   └── main.css      # estilos globais
└── scripts/
    ├── main.js       # navegação por abas
    ├── cursos.js     # tabela, filtro e busca da aba Cursos
    ├── supabase.js   # leitura dos conteúdos via API REST do Supabase
    └── config.js     # URL e publishable key do Supabase
```

Todos os arquivos são referenciados por caminhos relativos (por exemplo,
`styles/main.css`, sem `/` no início). Assim o site funciona no GitHub Pages,
que serve o projeto em uma subpasta (`/automacao-anuncios/`).

## Como rodar localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/GabrieleMonteiro/automacao-anuncios.git
   cd automacao-anuncios
   ```

2. Suba um servidor local simples na pasta do projeto. Abrir o `index.html`
   direto (`file://`) não funciona, porque o navegador bloqueia módulos
   JavaScript e o carregamento das abas fora de um servidor:

   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js
   npx serve .
   ```

3. Acesse `http://localhost:8000` (ou o endereço mostrado pelo `serve`).

Não há dependências para instalar.

## Publicação

No GitHub, vá em **Settings → Pages** e escolha **Deploy from a branch**, com a
branch `main` e a pasta `/ (root)`. O site fica disponível em
`https://gabrielemonteiro.github.io/automacao-anuncios/`.

## Segurança

Este repositório é **público**. Nunca coloque chaves de API, tokens ou senhas
no código. A única chave no código é a **publishable key** do Supabase
(`scripts/config.js`), que é pública por design: o acesso é controlado pelas
políticas de RLS do banco, e a aba Cursos só faz leitura. A secret key
(`sb_secret_...`) e a `service_role` key nunca devem ser usadas aqui.
Outras configurações sensíveis devem ficar em um arquivo `.env` local, que
é ignorado pelo Git, e jamais devem ir para o código que roda no navegador.
