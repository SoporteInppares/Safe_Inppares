const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export type SesionAdmin = { token: string; nombre: string; nombreUsuario: string; roles: string[] };
export type CasoLista = { id: string; clave: string; estado: string; anonimo: boolean; resumen: string; creadaEn: string; tipos: string[] };
export type CasoDetalle = CasoLista & {
  respuestas: Record<string, unknown>;
  contacto: { nombres: string | null; correo: string | null; telefono: string | null } | null;
  personas: Record<string, unknown>[];
};

async function request<T>(ruta: string, init: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}/admin${ruta}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? "No fue posible completar la operación.");
  }
  return response.status === 204 ? (undefined as T) : (await response.json()) as T;
}

export const iniciarSesionAdmin = (nombreUsuario: string, password: string) => request<SesionAdmin>("/sesion", { method: "POST", body: JSON.stringify({ nombreUsuario, password }) });
export const listarCasos = (token: string) => request<CasoLista[]>("/casos", {}, token);
export const obtenerCaso = (id: string, token: string) => request<CasoDetalle>(`/casos/${id}`, {}, token);
export const actualizarEstado = (id: string, estado: string, comentario: string, token: string) => request<void>(`/casos/${id}/estado`, { method: "PATCH", body: JSON.stringify({ estado, comentario: comentario || null }) }, token);
