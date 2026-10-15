import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";

/**
 * Busca os cursos e congressos ativos na tabela "conteudos" (somente leitura).
 * @returns {Promise<Array<{tipo: string, nome: string, codigo: string, numero: number}>>}
 */
export async function buscarConteudos() {
  const params = new URLSearchParams({
    select: "tipo,nome,codigo,numero",
    ativo: "eq.true",
    tipo: "in.(curso,congresso)",
    order: "numero.asc,nome.asc",
  });

  const resposta = await fetch(`${SUPABASE_URL}/rest/v1/conteudos?${params}`, {
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Accept: "application/json",
    },
  });

  if (!resposta.ok) {
    throw new Error(`Falha ao buscar conteúdos (HTTP ${resposta.status}).`);
  }

  return resposta.json();
}
