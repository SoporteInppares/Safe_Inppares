import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems: { to: string; label: string; exact?: boolean }[] = [
  { to: "/", label: "Información", exact: true },
  { to: "/denuncia", label: "Denunciar" },
  { to: "/seguimiento", label: "Seguimiento" },
];

const linkClass =
  "shrink-0 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-sm font-semibold">
              INPPARES SafeReport
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              Canal de Denuncias Seguras
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={linkClass}
              activeProps={{ className: "text-foreground bg-secondary" }}
              {...(item.exact ? { activeOptions: { exact: true } } : {})}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 sm:hidden" aria-label="Abrir menú">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(20rem,85vw)]">
            <SheetTitle className="font-display text-base">Menú</SheetTitle>
            <nav className="mt-6 flex flex-col gap-1 text-base font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "text-foreground bg-secondary" }}
                  {...(item.exact ? { activeOptions: { exact: true } } : {})}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-secondary/40">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-10 text-sm text-muted-foreground sm:px-6">
        <p className="font-display text-base font-semibold text-foreground">
          INPPARES · Canal de Denuncias Seguras
        </p>
        <p>
          Disponible 24 horas, 7 días a la semana, 365 días al año. Este canal no reemplaza las vías
          legales ordinarias (Policía Nacional, Ministerio Público) y no es un servicio de
          emergencia.
        </p>
        <p>Emergencias: PNP 105 · Línea 100 · SAE 911</p>
      </div>
    </footer>
  );
}
