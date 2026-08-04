/**
 * Frontend-only storage for the INPPARES safe reporting channel.
 * Reports are kept in the browser (localStorage) — no backend involved.
 */

export type Denuncia = {
  clave: string;
  password: string;
  createdAt: string;
  estado: "Recibida" | "En evaluación" | "En investigación" | "Cerrada";
  anonimo: boolean;
  resumen: string;
  data: Record<string, unknown>;
  archivos: string[];
  mensajes: { autor: string; fecha: string; texto: string }[];
};

const KEY = "inppares_denuncias_v1";

function readAll(): Denuncia[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Denuncia[];
  } catch {
    return [];
  }
}

function writeAll(list: Denuncia[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function generarClave(): string {
  const bloque = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `INP-${bloque()}-${bloque()}`;
}

export function guardarDenuncia(d: Denuncia) {
  const list = readAll();
  list.unshift(d);
  writeAll(list);
}

export function buscarDenuncia(clave: string, password: string): Denuncia | null {
  const normalizada = clave.trim().toUpperCase();
  return (
    readAll().find((d) => d.clave.toUpperCase() === normalizada && d.password === password) ?? null
  );
}
