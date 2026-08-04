import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function FormSection({
  numero,
  titulo,
  descripcion,
  children,
}: {
  numero: string;
  titulo: string;
  descripcion?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
      <header className="mb-6 border-b pb-5">
        <p className="section-label">Sección {numero}</p>
        <h2 className="mt-1 text-xl font-semibold sm:text-2xl">{titulo}</h2>
        {descripcion ? (
          <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{descripcion}</div>
        ) : null}
      </header>
      <div className="space-y-8">{children}</div>
    </section>
  );
}

export function Pregunta({
  titulo,
  ayuda,
  obligatorio,
  children,
}: {
  titulo: string;
  ayuda?: ReactNode;
  obligatorio?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold sm:text-base">
        {titulo}
        {obligatorio ? <span className="ml-1 text-destructive">*</span> : null}
      </legend>
      {ayuda ? <p className="text-sm leading-relaxed text-muted-foreground">{ayuda}</p> : null}
      {children}
    </fieldset>
  );
}

export function CampoTexto({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  maxLength = 200,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </Label>
      <Input
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function CampoTextarea({
  label,
  value,
  onChange,
  rows = 6,
  maxLength = 5000,
  placeholder,
  required,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      {label ? (
        <Label className="text-sm font-medium">
          {label}
          {required ? <span className="ml-1 text-destructive">*</span> : null}
        </Label>
      ) : null}
      <Textarea
        rows={rows}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-right text-xs text-muted-foreground">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}

export function OpcionesUnicas({
  opciones,
  value,
  onChange,
  columnas = 1,
}: {
  opciones: string[];
  value: string;
  onChange: (v: string) => void;
  columnas?: 1 | 2;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className={cn("gap-2", columnas === 2 && "sm:grid-cols-2")}
    >
      {opciones.map((op) => (
        <label
          key={op}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-xl border bg-background p-3 text-sm transition-colors hover:bg-secondary/70",
            value === op && "border-primary bg-accent/50",
          )}
        >
          <RadioGroupItem value={op} className="mt-0.5" />
          <span className="leading-snug">{op}</span>
        </label>
      ))}
    </RadioGroup>
  );
}

export function OpcionesMultiples({
  opciones,
  values,
  onToggle,
  columnas = 1,
}: {
  opciones: string[];
  values: string[];
  onToggle: (v: string) => void;
  columnas?: 1 | 2;
}) {
  return (
    <div className={cn("grid gap-2", columnas === 2 && "sm:grid-cols-2")}>
      {opciones.map((op) => {
        const activo = values.includes(op);
        return (
          <label
            key={op}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl border bg-background p-3 text-sm transition-colors hover:bg-secondary/70",
              activo && "border-primary bg-accent/50",
            )}
          >
            <Checkbox checked={activo} onCheckedChange={() => onToggle(op)} className="mt-0.5" />
            <span className="leading-snug">{op}</span>
          </label>
        );
      })}
    </div>
  );
}
