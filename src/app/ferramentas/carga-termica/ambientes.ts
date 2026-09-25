import type { EntradaCargaTermica } from "./cargatermica";

export type AmbienteSalvo = {
  id: string;
  nome: string;
  criadoEm: number;
  atualizadoEm: number;
  entrada: EntradaCargaTermica;
};

const CHAVE_STORAGE = "hedut:carga-termica:ambientes";

export function gerarId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function carregarAmbientes(): AmbienteSalvo[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE_STORAGE);
    if (!bruto) return [];
    const dados = JSON.parse(bruto);
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

export function salvarAmbientesStorage(ambientes: AmbienteSalvo[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE_STORAGE, JSON.stringify(ambientes));
  } catch {
    // localStorage indisponível (modo privado, quota excedida etc.) — ignora.
  }
}
