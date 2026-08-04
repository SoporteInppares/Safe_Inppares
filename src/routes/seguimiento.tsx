import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, ShieldCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { buscarDenuncia, type Denuncia } from "@/lib/denuncias-store";

export const Route = createFileRoute("/seguimiento")({
  head: () => ({
    meta: [
      { title: "Seguimiento de mi denuncia | INPPARES SafeReport" },
      {
        name: "description",
        content:
          "Ingrese su Clave de notificación y su Contraseña para consultar el estado, leer mensajes y ampliar la información de su denuncia en INPPARES.",
      },
      { property: "og:title", content: "Seguimiento de mi denuncia | INPPARES SafeReport" },
      {
        property: "og:description",
        content: "Consulte el avance de su denuncia con su Clave de notificación y Contraseña.",
      },
    ],
  }),
  component: Seguimiento,
});

function Seguimiento() {
  const [clave, setClave] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null);

  function ingresar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!clave.trim() || !password) {
      setError("Ingrese su Clave de la notificación y su Contraseña.");
      return;
    }
    const found = buscarDenuncia(clave, password);
    if (!found) {
      setError(
        "No encontramos una denuncia con esa Clave y Contraseña en este dispositivo. Verifique los datos ingresados.",
      );
      return;
    }
    setDenuncia(found);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {!denuncia ? (
          <>
            <p className="section-label">Seguimiento</p>
            <h1 className="mt-2 text-3xl font-bold">Consulte el avance de su denuncia</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Ingrese la <strong>Clave de la notificación</strong> que recibió al enviar su reporte y
              la <strong>Contraseña</strong> que usted creó. No comparta estos datos con nadie.
            </p>

            <form
              onSubmit={ingresar}
              className="mt-8 space-y-5 rounded-2xl border bg-card p-6 shadow-card sm:p-8"
            >
              <div className="space-y-2">
                <Label>Clave de la notificación</Label>
                <Input
                  value={clave}
                  maxLength={40}
                  placeholder="INP-XXXX-XXXX"
                  onChange={(e) => setClave(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input
                  type="password"
                  value={password}
                  maxLength={64}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error ? (
                <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <Button type="submit" size="lg" className="w-full">
                <KeyRound className="size-4" /> Acceder a mi denuncia
              </Button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Nota: esta es una demostración de interfaz. Los reportes se guardan únicamente en
                este navegador y son visibles solo desde el mismo dispositivo.
              </p>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              ¿Aún no ha presentado su denuncia?{" "}
              <Link to="/denuncia" className="font-medium text-primary underline underline-offset-4">
                Complete el formulario
              </Link>
              .
            </p>
          </>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="section-label">Denuncia registrada</p>
                  <h1 className="mt-1 font-display text-2xl font-bold">{denuncia.clave}</h1>
                </div>
                <Badge className="bg-primary text-primary-foreground">{denuncia.estado}</Badge>
              </div>
              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Fecha de registro</dt>
                  <dd className="font-medium">
                    {new Date(denuncia.createdAt).toLocaleString("es-PE")}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Modalidad</dt>
                  <dd className="font-medium">
                    {denuncia.anonimo ? "Anónima" : "Con identificación"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Resumen de la preocupación</dt>
                  <dd className="mt-1 leading-relaxed whitespace-pre-wrap">{denuncia.resumen}</dd>
                </div>
                {denuncia.archivos.length > 0 ? (
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Archivos adjuntos</dt>
                    <dd className="mt-1">{denuncia.archivos.join(", ")}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
              <p className="flex items-center gap-2 font-display font-semibold">
                <MessageSquare className="size-4 text-primary" /> Mensajes del equipo investigador
              </p>
              <ul className="mt-4 space-y-3">
                {denuncia.mensajes.map((m, i) => (
                  <li key={i} className="rounded-xl border bg-secondary/40 p-4 text-sm">
                    <p className="font-medium">{m.autor}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(m.fecha).toLocaleString("es-PE")}
                    </p>
                    <p className="mt-2 leading-relaxed">{m.texto}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border bg-secondary/40 p-5 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              <p>
                El contenido de su reporte solo se comparte bajo estricta necesidad de saber, de
                acuerdo con la Política de Confidencialidad de INPPARES.
              </p>
            </div>

            <Button variant="outline" onClick={() => setDenuncia(null)}>
              Cerrar sesión
            </Button>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
