/** Cliente HTTP de la API Python; las reglas y la persistencia viven en el backend. */
export type DenunciaConsulta = {
  clave: string;
  createdAt: string;
  estado: "Recibida" | "En evaluación" | "En investigación" | "Cerrada";
  anonimo: boolean;
  resumen: string;
  archivos: string[];
  mensajes: { autor: string; fecha: string; texto: string }[];
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

async function request<T>(ruta: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${ruta}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  if (!response.ok) throw new Error("No fue posible comunicarse con el canal de denuncias.");
  return (await response.json()) as T;
}

export function registrarDenuncia(datos: Record<string, unknown>): Promise<{ clave: string }> {
  return request("/denuncias", { method: "POST", body: JSON.stringify(datos) });
}

export function consultarDenuncia(clave: string, password: string): Promise<DenunciaConsulta> {
  return request(`/denuncias/${encodeURIComponent(clave)}/seguimiento`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}
