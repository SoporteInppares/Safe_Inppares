import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Copy, Info, Plus, Send, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  CampoTexto,
  CampoTextarea,
  FormSection,
  OpcionesMultiples,
  OpcionesUnicas,
  Pregunta,
} from "@/components/denuncia/fields";
import { registrarDenuncia } from "@/lib/denuncias-api";

export const Route = createFileRoute("/denuncia")({
  head: () => ({
    meta: [
      { title: "Formulario de Denuncia Segura | INPPARES SafeReport" },
      {
        name: "description",
        content:
          "Complete el formulario oficial de INPPARES para reportar presuntas faltas éticas, administrativas, actos de corrupción o conductas contrarias a los valores institucionales.",
      },
      { property: "og:title", content: "Formulario de Denuncia Segura | INPPARES SafeReport" },
      {
        property: "og:description",
        content:
          "Canal oficial para reportar irregularidades en cualquiera de las sedes de INPPARES a nivel nacional.",
      },
    ],
  }),
  component: FormularioDenuncia,
});

type Persona = { nombre: string; dni: string; correo: string; telefono: string };
type Involucrado = { nombre: string; cargo: string; dni: string };

const SI_NO = ["Sí", "No"];
const SI_NO_NOSE = ["Sí", "No", "No sé", "No deseo decirlo"];

const GENEROS = [
  "Femenino",
  "Masculino",
  "No binario / Género fluido",
  "Prefiero no decirlo",
  "Otro (especifique)",
];
const EDADES = [
  "Menos de 18 años",
  "18 a 24 años",
  "25 a 34 años",
  "35 a 44 años",
  "45 a 54 años",
  "55 años o más",
  "Prefiero no decirlo",
];
const ETNIAS = [
  "Quechua",
  "Aymara",
  "Asháninka / Amazónica",
  "Afroperuana",
  "Mestiza",
  "Blanca",
  "Prefiero no decirlo",
  "Otro (especifique)",
];
const RELACIONES = [
  "Empleado(a) / Trabajador(a)",
  "Ex empleado(a)",
  "Directivo(a) / Miembro de Junta Directiva",
  "Voluntario(a)",
  "Proveedor(a) / Servicios generales",
  "Contratista",
  "Cliente / Usuario(a) de los servicios",
  "Consultor(a) externo(a)",
  "Donante",
  "No deseo decirlo",
  "Otro (especifique)",
];
const TIPOS = [
  "Conflicto de interés.",
  "Acoso laboral (vertical, horizontal o mixto).",
  "Hostigamiento en cualquiera de sus formas (sexual, psicológico, verbal, cibernético, etc.).",
  "Fuga de información confidencial o vulneración de datos personales.",
  "Alteración, falsificación o destrucción de registros, documentos o informes.",
  "Incumplimiento de normativa legal, del Reglamento Interno de Trabajo o de políticas internas.",
  "Faltas administrativas o financieras en el trámite de procedimientos internos a cargo de autoridades o personal de INPPARES.",
  "Discriminación por razones de género, raza, origen, orientación sexual, identidad de género, discapacidad, condición social, entre otras.",
  "Otros actos contrarios al Código de Ética de INPPARES.",
  "Otro (especifique)",
];
const MODALIDAD = [
  "Individual (solo yo soy el/la denunciante)",
  "Grupal (varias personas somos denunciantes). (Si marca \"Grupal\", aparecerá un apartado adicional al final de esta sección para agregar los datos de los demás integrantes del grupo).",
];
const VINCULOS = [
  "Es mi superior(a) jerárquico(a) directo(a)",
  "Es mi subordinado(a) directo(a)",
  "Es un(a) compañero(a) del mismo nivel jerárquico",
  "Pertenece a otra área o sede distinta a la mía",
  "No tengo relación laboral directa (ej. proveedor, usuario, consultor, donante)",
  "No deseo decirlo",
  "Otro (especifique)",
];
const DURACION = [
  "Menos de 1 semana",
  "Entre 1 semana y 1 mes",
  "Entre 1 y 3 meses",
  "Entre 3 y 6 meses",
  "Entre 6 meses y 1 año",
  "Más de 1 año",
  "No sé / No estoy seguro(a)",
];
const CONOCIMIENTO = [
  "Lo presencié directamente (yo fui testigo ocular)",
  "Me lo contó un(a) testigo presencial",
  "Me enteré a través de rumores o comentarios internos",
  "Lo descubrí revisando información, documentos o registros",
  "Me lo confesó la persona involucrada",
  "Otro (especifique)",
];
const CERTEZA = [
  "Sé que está sucediendo (certeza absoluta)",
  "Tengo una fuerte sospecha de que está sucediendo",
  "Tengo una leve sospecha de que está sucediendo",
];
const PRUEBAS = [
  "Documentos físicos (copias de contratos, correos impresos, informes, etc.)",
  "Correos electrónicos (puede adjuntarlos)",
  "Grabaciones de audio o video (siempre que hayan sido obtenidas de manera lícita)",
  "Capturas de pantalla de chats (WhatsApp, Teams, Slack, etc.)",
  "Declaración de testigos (se contactará a las personas que indicó en la pregunta anterior)",
  "Pericias o informes técnicos",
  "No cuento con pruebas, pero los hechos son de conocimiento público dentro de la sede",
  "Otro medio probatorio idóneo (especifique)",
];
const PROTECCION = [
  "No, no necesito medidas de protección en este momento.",
  "Sí, solicito reserva de mi identidad (su nombre no será revelado en el proceso interno; solo lo sabrá el equipo investigador a cargo).",
  "Sí, solicito medidas de protección laboral:",
];
const PROTECCION_LABORAL = [
  "Traslado temporal a otra área o sede (del denunciante o del denunciado).",
  "Modificación temporal de horarios o turnos para evitar el contacto.",
  "Restricción de comunicaciones directas entre las partes cuando sea necesario.",
  "Licencia con goce de haber mientras dure la investigación (si su presencia en el centro de labores genera un riesgo cierto e inminente).",
  "Otorgamiento de trabajo híbrido o remoto.",
  "Derivación a atención médica, psicológica o asesoría legal cuando sea requerida.",
  "Otra medida de protección laboral (especifique)",
];
const SUGERENCIAS = [
  "Sanción disciplinaria para la(s) persona(s) involucrada(s) (acorde al Reglamento Interno de Trabajo o Código de Ética de INPPARES).",
  "Medidas correctivas para evitar que la situación se repita (ej. cambios en la supervisión, reasignación de funciones, separación de equipos).",
  "Capacitación obligatoria en ética, acoso laboral, hostigamiento o clima laboral para el equipo, área o sede involucrada.",
  "Mejora o revisión de procedimientos internos (ej. actualizar directrices, canales de comunicación, registros, políticas).",
  "Mediación o conciliación entre las partes involucradas (diálogo asistido para resolver el conflicto de manera restaurativa).",
  "Reparación del daño hacia las personas afectadas (ej. disculpas públicas, restitución de derechos, compensación si aplica).",
  "No tengo una sugerencia específica, solo solicito que se investigue a fondo y se actúe conforme a la normativa interna.",
  "Otra (especifique en el campo de texto siguiente).",
];
const NOTIFICACIONES = [
  "Por correo electrónico (a la dirección que consignó en la Sección 1)",
  "Por teléfono / WhatsApp (al número que consignó en la Sección 1)",
  "Solo a través del sistema con mi Clave y Contraseña (no deseo ser contactado por ningún otro medio)",
];

const personaVacia: Persona = { nombre: "", dni: "", correo: "", telefono: "" };
const involucradoVacio: Involucrado = { nombre: "", cargo: "", dni: "" };

function FormularioDenuncia() {
  // Sección 1
  const [anonimo, setAnonimo] = useState("");
  const [nombres, setNombres] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  // Sección 2
  const [relacion, setRelacion] = useState("");
  const [relacionOtro, setRelacionOtro] = useState("");
  const [genero, setGenero] = useState("");
  const [generoOtro, setGeneroOtro] = useState("");
  const [edad, setEdad] = useState("");
  const [discapacidad, setDiscapacidad] = useState("");
  const [etnia, setEtnia] = useState("");
  const [etniaOtro, setEtniaOtro] = useState("");
  const [tipos, setTipos] = useState<string[]>([]);
  const [tipoOtro, setTipoOtro] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [grupo, setGrupo] = useState<Persona[]>([{ ...personaVacia }]);
  const [vinculo, setVinculo] = useState("");
  const [vinculoOtro, setVinculoOtro] = useState("");

  // Sección 4
  const [sede, setSede] = useState("");
  const [distrito, setDistrito] = useState("");
  const [provincia, setProvincia] = useState("");
  const [region, setRegion] = useState("");
  const [resumen, setResumen] = useState("");
  const [tipoFecha, setTipoFecha] = useState("Fecha exacta");
  const [fechaExacta, setFechaExacta] = useState("");
  const [fechaAprox, setFechaAprox] = useState("");
  const [duracion, setDuracion] = useState("");
  const [conocimiento, setConocimiento] = useState("");
  const [conocimientoOtro, setConocimientoOtro] = useState("");
  const [certeza, setCerteza] = useState("");

  // Sección 5
  const [involucrados, setInvolucrados] = useState<Involucrado[]>([{ ...involucradoVacio }]);
  const [supervisor, setSupervisor] = useState("");
  const [supervisorDetalle, setSupervisorDetalle] = useState("");
  const [encubrimiento, setEncubrimiento] = useState("");
  const [encubrimientoDetalle, setEncubrimientoDetalle] = useState("");
  const [testigos, setTestigos] = useState("");
  const [testigosDetalle, setTestigosDetalle] = useState("");

  // Sección 6
  const [pruebas, setPruebas] = useState<string[]>([]);
  const [pruebaOtro, setPruebaOtro] = useState("");
  const [archivos, setArchivos] = useState<{ nombre: string; peso: string }[]>([]);

  // Sección 7
  const [denunciaPrevia, setDenunciaPrevia] = useState("");
  const [denunciaPreviaDetalle, setDenunciaPreviaDetalle] = useState("");
  const [medidas, setMedidas] = useState<string[]>([]);
  const [medidasLaborales, setMedidasLaborales] = useState<string[]>([]);
  const [medidaLaboralOtra, setMedidaLaboralOtra] = useState("");
  const [justificacionMedidas, setJustificacionMedidas] = useState("");

  // Sección 8
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [sugerenciaOtra, setSugerenciaOtra] = useState("");
  const [detalleSugerencia, setDetalleSugerencia] = useState("");

  // Sección 9 y 10
  const [notificacion, setNotificacion] = useState("");
  const [declaracion, setDeclaracion] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [errores, setErrores] = useState<string[]>([]);
  const [claveGenerada, setClaveGenerada] = useState<string | null>(null);

  const esAnonimo = anonimo === "Sí";
  const esGrupal = modalidad.startsWith("Grupal");
  const solicitaMedidaProteccion = medidas.some((medida) => medida !== PROTECCION[0]);

  const toggle = (setter: (fn: (v: string[]) => string[]) => void) => (op: string) =>
    setter((prev) => (prev.includes(op) ? prev.filter((x) => x !== op) : [...prev, op]));

  function toggleMedidaProteccion(opcion: string) {
    if (opcion === PROTECCION[0]) {
      setMedidasLaborales([]);
      setMedidaLaboralOtra("");
      setJustificacionMedidas("");
      setMedidas((prev) => (prev.includes(opcion) ? [] : [opcion]));
      return;
    }
    setMedidas((prev) => {
      const sinOpcionNo = prev.filter((medida) => medida !== PROTECCION[0]);
      return sinOpcionNo.includes(opcion)
        ? sinOpcionNo.filter((medida) => medida !== opcion)
        : [...sinOpcionNo, opcion];
    });
  }

  function onArchivos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const validos = files.filter((f) => f.size <= 20 * 1024 * 1024);
    if (validos.length !== files.length) {
      toast.error("Algunos archivos superan el máximo de 20 MB y no fueron adjuntados.");
    }
    setArchivos((prev) => [
      ...prev,
      ...validos.map((f) => ({ nombre: f.name, peso: `${(f.size / 1024 / 1024).toFixed(2)} MB` })),
    ]);
    e.target.value = "";
  }

  function validar(): string[] {
    const errs: string[] = [];
    if (!anonimo)
      errs.push(
        "Sección 1: indique si desea que sus datos se manejen en estricta confidencialidad.",
      );
    if (anonimo === "No") {
      if (!nombres.trim()) errs.push("Sección 1: ingrese sus nombres y apellidos completos.");
      if (!correo.trim()) errs.push("Sección 1: ingrese su correo electrónico.");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()))
        errs.push("Sección 1: el correo electrónico no tiene un formato válido.");
    }
    if (!relacion) errs.push("Sección 2: indique su relación con INPPARES.");
    if (tipos.length === 0) errs.push("Sección 2: seleccione al menos un tipo de irregularidad.");
    if (!modalidad) errs.push("Sección 2: indique si la denuncia es individual o grupal.");
    if (!sede.trim()) errs.push("Sección 4: indique la sede donde ocurrieron los hechos.");
    if (resumen.trim().length < 30)
      errs.push("Sección 4: describa los hechos con al menos 30 caracteres.");
    if (!certeza) errs.push("Sección 4: indique su grado de certeza sobre los hechos.");
    if (!involucrados.some((i) => i.nombre.trim()))
      errs.push("Sección 5: indique al menos una persona involucrada (o escriba 'Desconozco').");
    if (!notificacion) errs.push("Sección 9: elija cómo prefiere recibir las notificaciones.");
    if (!declaracion) errs.push("Sección 9: debe aceptar la declaración jurada para continuar.");
    if (password.length < 4) errs.push("Sección 10: la contraseña debe tener mínimo 4 caracteres.");
    if (password !== password2) errs.push("Sección 10: las contraseñas no coinciden.");
    return errs;
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const errs = validar();
    setErrores(errs);
    if (errs.length) {
      toast.error("Revise los campos pendientes antes de enviar.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    try {
      const respuesta = await registrarDenuncia({
      password,
      anonimo: esAnonimo,
      resumen: resumen.trim(),
      data: {
        anonimo,
        nombres,
        telefono,
        correo,
        relacion,
        relacionOtro,
        genero,
        generoOtro,
        edad,
        discapacidad,
        etnia,
        etniaOtro,
        tipos,
        tipoOtro,
        modalidad,
        grupo: esGrupal ? grupo : [],
        vinculo,
        vinculoOtro,
        sede,
        distrito,
        provincia,
        region,
        tipoFecha,
        fechaExacta,
        fechaAprox,
        duracion,
        conocimiento,
        conocimientoOtro,
        certeza,
        involucrados,
        supervisor,
        supervisorDetalle,
        encubrimiento,
        encubrimientoDetalle,
        testigos,
        testigosDetalle,
        pruebas,
        pruebaOtro,
        denunciaPrevia,
        denunciaPreviaDetalle,
        medidas,
        medidasLaborales,
        medidaLaboralOtra,
        justificacionMedidas,
        sugerencias,
        sugerenciaOtra,
        detalleSugerencia,
        notificacion,
      },
      });
      setClaveGenerada(respuesta.clave);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("No fue posible registrar la denuncia. Intente nuevamente.");
    }
  }

  if (claveGenerada) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border bg-card p-8 text-center shadow-elevated">
            <CheckCircle2 className="mx-auto size-12 text-success" />
            <h1 className="mt-4 text-2xl font-bold">Su denuncia ha sido registrada</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Guarde su Clave de la notificación y su Contraseña en un lugar seguro y no las
              comparta con nadie. Las necesitará para consultar el avance de su denuncia.
            </p>
            <div className="mt-6 rounded-2xl border bg-secondary/50 p-6">
              <p className="section-label">Clave de la notificación</p>
              <p className="mt-2 font-display text-3xl font-bold tracking-wider">{claveGenerada}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  void navigator.clipboard.writeText(claveGenerada);
                  toast.success("Clave copiada");
                }}
              >
                <Copy className="size-4" /> Copiar clave
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/seguimiento">Ir al seguimiento</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Volver al inicio</Link>
              </Button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="section-label">Formulario</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">FORMULARIO DE DENUNCIA SEGURA - INPPARES</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Canal oficial para reportar presuntas faltas éticas, administrativas, actos de corrupción
          o cualquier conducta contraria a los valores institucionales, ocurridas en cualquiera de
          las sedes de INPPARES a nivel nacional.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning-surface p-5 text-sm leading-relaxed text-warning-foreground">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <p>
            Este sistema <strong>no es un servicio de emergencia</strong>. Si hay peligro inminente,
            contacte a las autoridades locales.
          </p>
        </div>

        {errores.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive">
            <p className="font-semibold">Corrija lo siguiente antes de enviar:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errores.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <form onSubmit={enviar} className="mt-8 space-y-8">
          {/* SECCIÓN 1 */}
          <FormSection numero="1" titulo="DATOS DEL DENUNCIANTE">
            <Pregunta
              titulo="¿Desea que sus datos se manejen en estricta CONFIDENCIALIDAD para este informe?"
              obligatorio
            >
              <OpcionesUnicas
                opciones={SI_NO}
                value={anonimo}
                onChange={setAnonimo}
              />
            </Pregunta>

            {anonimo === "No" ? (
              <div className="space-y-4 rounded-xl border bg-secondary/30 p-5">
                <p className="font-display text-sm font-semibold">DATOS PERSONALES</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <CampoTexto
                    label="Nombres y Apellidos completos"
                    value={nombres}
                    onChange={setNombres}
                    required
                    maxLength={120}
                  />
                  <CampoTexto
                    label="Teléfono / Celular (incluir código de país)"
                    value={telefono}
                    onChange={setTelefono}
                    placeholder="+51 999 999 999"
                    maxLength={30}
                  />
                  <CampoTexto
                    label="Correo electrónico"
                    value={correo}
                    onChange={setCorreo}
                    type="email"
                    required
                    maxLength={255}
                  />
                </div>
              </div>
            ) : null}
          </FormSection>

          {/* SECCIÓN 2 */}
          <FormSection numero="2" titulo="TIPO DE DENUNCIA Y RELACIONES">
            <Pregunta titulo="A. ¿Cuál es su relación actual o anterior con INPPARES?" obligatorio>
              <OpcionesUnicas
                opciones={RELACIONES}
                value={relacion}
                onChange={setRelacion}
                columnas={2}
              />
              {relacion === "Otro (especifique)" ? (
                <Input
                  value={relacionOtro}
                  maxLength={120}
                  placeholder="Especifique"
                  onChange={(e) => setRelacionOtro(e.target.value)}
                />
              ) : null}
            </Pregunta>

            <div className="flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning-surface p-5 text-sm leading-relaxed text-warning-foreground">
              <Info className="mt-0.5 size-5 shrink-0" />
              <p>
                A continuación, se señalan algunas características que <strong>no son obligatorias de contestar</strong>, pero que nos ayudarían a identificar casos adicionales de discriminación
              </p>
            </div>

            <Pregunta titulo="Género con el que se identifica:">
              <OpcionesUnicas
                opciones={GENEROS}
                value={genero}
                onChange={setGenero}
                columnas={2}
              />
              {genero === "Otro (especifique)" ? (
                <Input
                  value={generoOtro}
                  maxLength={80}
                  placeholder="Especifique"
                  onChange={(e) => setGeneroOtro(e.target.value)}
                />
              ) : null}
            </Pregunta>

            <Pregunta titulo="Rango de edad:">
              <OpcionesUnicas opciones={EDADES} value={edad} onChange={setEdad} columnas={2} />
            </Pregunta>

            <Pregunta titulo="¿Se considera una persona con discapacidad?:">
              <OpcionesUnicas
                opciones={["Sí", "No", "Prefiero no decirlo"]}
                value={discapacidad}
                onChange={setDiscapacidad}
                columnas={2}
              />
            </Pregunta>

            <Pregunta titulo="Autoidentificación étnica:">
              <OpcionesUnicas
                opciones={ETNIAS}
                value={etnia}
                onChange={setEtnia}
                columnas={2}
              />
              {etnia === "Otro (especifique)" ? (
                <Input
                  value={etniaOtro}
                  maxLength={80}
                  placeholder="Especifique"
                  onChange={(e) => setEtniaOtro(e.target.value)}
                />
              ) : null}
            </Pregunta>

            <Pregunta
              titulo="B. ¿Cuál es el tipo de irregularidad, falta o conducta que desea denunciar?"
              ayuda="Puede marcar una o varias opciones."
              obligatorio
            >
              <OpcionesMultiples
                opciones={TIPOS}
                values={tipos}
                onToggle={toggle(setTipos as never)}
              />
              {tipos.includes("Otro (especifique)") ? (
                <Input
                  value={tipoOtro}
                  maxLength={200}
                  placeholder="Especifique"
                  onChange={(e) => setTipoOtro(e.target.value)}
                />
              ) : null}
            </Pregunta>

            <Pregunta titulo="C. Esta denuncia es presentada de forma:" obligatorio>
              <OpcionesUnicas opciones={MODALIDAD} value={modalidad} onChange={setModalidad} />
            </Pregunta>

            {esGrupal ? (
              <Pregunta
                titulo="Indique los datos de los demás denunciantes que se suman a esta denuncia:"
                ayuda="Opcional. Agregue una fila por cada integrante del grupo."
              >
                <div className="space-y-4">
                  {grupo.map((p, i) => (
                    <div key={i} className="rounded-xl border bg-secondary/30 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-display text-sm font-semibold">
                          Denunciante {i + 1}
                        </span>
                        {grupo.length > 1 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setGrupo(grupo.filter((_, idx) => idx !== i))}
                          >
                            <Trash2 className="size-4" /> Quitar
                          </Button>
                        ) : null}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <CampoTexto
                          label="Nombres y Apellidos"
                          value={p.nombre}
                          onChange={(v) =>
                            setGrupo(
                              grupo.map((g, idx) => (idx === i ? { ...g, nombre: v } : g)),
                            )
                          }
                        />
                        <CampoTexto
                          label="DNI"
                          value={p.dni}
                          onChange={(v) =>
                            setGrupo(
                              grupo.map((g, idx) => (idx === i ? { ...g, dni: v } : g)),
                            )
                          }
                        />
                        <CampoTexto
                          label="Correo electrónico"
                          value={p.correo}
                          onChange={(v) =>
                            setGrupo(
                              grupo.map((g, idx) => (idx === i ? { ...g, correo: v } : g)),
                            )
                          }
                        />
                        <CampoTexto
                          label="Teléfono"
                          value={p.telefono}
                          onChange={(v) =>
                            setGrupo(
                              grupo.map((g, idx) => (idx === i ? { ...g, telefono: v } : g)),
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setGrupo([...grupo, { ...personaVacia }])}
                  >
                    <Plus className="size-4" /> Agregar denunciante
                  </Button>
                </div>
              </Pregunta>
            ) : null}

            <Pregunta titulo="D. ¿Cuál es su vínculo con la(s) persona(s) denunciada(s)?">
              <OpcionesUnicas opciones={VINCULOS} value={vinculo} onChange={setVinculo} />
              {vinculo === "Otro (especifique)" ? (
                <Input
                  value={vinculoOtro}
                  maxLength={120}
                  placeholder="Especifique"
                  onChange={(e) => setVinculoOtro(e.target.value)}
                />
              ) : null}
            </Pregunta>
          </FormSection>

          {/* SECCIÓN 4 */}
          <FormSection numero="4" titulo="DETALLE DE LOS HECHOS Y LUGAR">
            <Pregunta
              titulo="1. Indique la sede, distrito, provincia y región donde ocurrieron o están ocurriendo los hechos (Este dato es clave para la investigación interna)."
              obligatorio
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <CampoTexto
                  label="Sede de INPPARES donde ocurrieron los hechos"
                  placeholder="ej. Lima-Jesús María, Chiclayo, Arequipa, etc."
                  value={sede}
                  onChange={setSede}
                  required
                />
                <CampoTexto label="Distrito" value={distrito} onChange={setDistrito} />
                <CampoTexto label="Provincia" value={provincia} onChange={setProvincia} />
                <CampoTexto label="Región" value={region} onChange={setRegion} />
              </div>
            </Pregunta>

            <Pregunta
              titulo="2. Resumen de la preocupación:"
              ayuda="Describa de manera clara, detallada y coherente lo sucedido, indicando fechas aproximadas, lugares específicos dentro de la sede, personas involucradas (si las conoce) y cualquier otro dato relevante que ayude a comprender los hechos."
              obligatorio
            >
              <CampoTextarea value={resumen} onChange={setResumen} rows={10} maxLength={5000} />
            </Pregunta>

            <Pregunta titulo="3. Fecha en que ocurrieron los hechos por primera vez:">
              <OpcionesUnicas
                opciones={["Fecha exacta", "Fecha aproximada (mes y año)"]}
                value={tipoFecha}
                onChange={setTipoFecha}
                columnas={2}
              />
              {tipoFecha === "Fecha exacta" ? (
                <Input
                  type="date"
                  value={fechaExacta}
                  onChange={(e) => setFechaExacta(e.target.value)}
                  className="max-w-xs"
                />
              ) : (
                <Input
                  value={fechaAprox}
                  maxLength={40}
                  placeholder="ej. Marzo 2025"
                  onChange={(e) => setFechaAprox(e.target.value)}
                  className="max-w-xs"
                />
              )}
            </Pregunta>

            <Pregunta titulo="4. ¿Cuánto tiempo cree que lleva ocurriendo esta situación?">
              <OpcionesUnicas
                opciones={DURACION}
                value={duracion}
                onChange={setDuracion}
                columnas={2}
              />
            </Pregunta>

            <Pregunta titulo="5. ¿Cómo se enteró de la situación o situaciones que está notificando?">
              <OpcionesUnicas
                opciones={CONOCIMIENTO}
                value={conocimiento}
                onChange={setConocimiento}
              />
              {conocimiento === "Otro (especifique)" ? (
                <Input
                  value={conocimientoOtro}
                  maxLength={200}
                  placeholder="Especifique"
                  onChange={(e) => setConocimientoOtro(e.target.value)}
                />
              ) : null}
            </Pregunta>

            <Pregunta
              titulo="6. ¿En qué medida tiene la certeza de que lo que está notificando realmente sucedió o está sucediendo?"
              obligatorio
            >
              <OpcionesUnicas opciones={CERTEZA} value={certeza} onChange={setCerteza} />
            </Pregunta>
          </FormSection>

          {/* SECCIÓN 5 */}
          <FormSection numero="5" titulo="PERSONAS INVOLUCRADAS (DENUNCIADOS/AS Y TESTIGOS)">
            <Pregunta
              titulo="7. Indique los datos de la(s) persona(s) involucradas en los hechos (presuntos autores o partícipes)."
              ayuda='Si no conoce algún dato, escriba "N/A" (No Aplica) o "Desconozco".'
              obligatorio
            >
              <div className="space-y-4">
                {involucrados.map((p, i) => (
                  <div key={i} className="rounded-xl border bg-secondary/30 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-display text-sm font-semibold">Persona {i + 1}</span>
                      {involucrados.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setInvolucrados(involucrados.filter((_, x) => x !== i))}
                        >
                          <Trash2 className="size-4" /> Quitar
                        </Button>
                      ) : null}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <CampoTexto
                        label="Nombres y Apellidos (Obligatorio)"
                        required
                        value={p.nombre}
                        onChange={(v) =>
                          setInvolucrados(
                            involucrados.map((g, x) => (x === i ? { ...g, nombre: v } : g)),
                          )
                        }
                      />
                      <CampoTexto
                        label="Cargo / Área / Sede"
                        value={p.cargo}
                        onChange={(v) =>
                          setInvolucrados(
                            involucrados.map((g, x) => (x === i ? { ...g, cargo: v } : g)),
                          )
                        }
                      />
                      <CampoTexto
                        label="DNI (si lo conoce)"
                        value={p.dni}
                        onChange={(v) =>
                          setInvolucrados(
                            involucrados.map((g, x) => (x === i ? { ...g, dni: v } : g)),
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInvolucrados([...involucrados, { ...involucradoVacio }])}
                >
                  <Plus className="size-4" /> Agregar persona
                </Button>
              </div>
            </Pregunta>

            <Pregunta titulo="8. ¿Cree que algún(a) supervisor(a) o encargado(a) está involucrado(a) en los hechos o está encubriéndolos?">
              <OpcionesUnicas
                opciones={SI_NO}
                value={supervisor}
                onChange={setSupervisor}
                columnas={2}
              />
              {supervisor === "Sí" ? (
                <CampoTextarea
                  label="Si respondió 'Sí', indique los datos del supervisor o encargado involucrado:"
                  value={supervisorDetalle}
                  onChange={setSupervisorDetalle}
                  rows={3}
                  maxLength={1000}
                />
              ) : null}
            </Pregunta>

            <Pregunta titulo="9. ¿Alguien ha intentado ocultar o encubrir estos hechos?">
              <OpcionesUnicas
                opciones={SI_NO_NOSE}
                value={encubrimiento}
                onChange={setEncubrimiento}
                columnas={2}
              />
              {encubrimiento === "Sí" ? (
                <CampoTextarea
                  label="Si respondió 'Sí', describa brevemente qué se hizo para ocultar o encubrir la situación:"
                  value={encubrimientoDetalle}
                  onChange={setEncubrimientoDetalle}
                  rows={3}
                  maxLength={1000}
                />
              ) : null}
            </Pregunta>

            <Pregunta titulo="10. ¿Existen testigos de la situación que está denunciando?">
              <OpcionesUnicas
                opciones={SI_NO_NOSE}
                value={testigos}
                onChange={setTestigos}
                columnas={2}
              />
              {testigos === "Sí" ? (
                <CampoTextarea
                  label="Si respondió 'Sí', proporcione nombres, cargos y cómo contactarlos (si los conoce):"
                  value={testigosDetalle}
                  onChange={setTestigosDetalle}
                  rows={3}
                  maxLength={1000}
                />
              ) : null}
            </Pregunta>
          </FormSection>

          {/* SECCIÓN 6 */}
          <FormSection numero="6" titulo="MEDIOS PROBATORIOS (EVIDENCIAS)">
            <Pregunta
              titulo="11. ¿Cuenta con algún medio probatorio que respalde su denuncia? (Puede marcar varias opciones)"
            >
              <OpcionesMultiples
                opciones={PRUEBAS}
                values={pruebas}
                onToggle={toggle(setPruebas as never)}
              />
              {pruebas.includes("Otro medio probatorio idóneo (especifique)") ? (
                <Input
                  value={pruebaOtro}
                  maxLength={200}
                  placeholder="Especifique"
                  onChange={(e) => setPruebaOtro(e.target.value)}
                />
              ) : null}
            </Pregunta>

            <Pregunta
              titulo="12. Cargue aquí los archivos (opcional):"
              ayuda="Se pueden cargar la mayoría de los tipos comunes de archivos: imágenes (JPG, PNG), PDF, documentos de Word, Excel, etc."
            >
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-secondary/30 p-8 text-center transition-colors hover:bg-secondary/60">
                <Upload className="size-6 text-primary" />
                <span className="text-sm font-medium">Haga clic aquí para cargar archivos</span>
                <span className="text-xs text-muted-foreground">(Máximo 20 MB por archivo / varios archivos permitidos)</span>
                <input type="file" multiple className="hidden" onChange={onArchivos} />
              </label>
              {archivos.length > 0 ? (
                <ul className="space-y-2">
                  {archivos.map((a, i) => (
                    <li
                      key={`${a.nombre}-${i}`}
                      className="flex items-center justify-between rounded-xl border bg-background px-3 py-2 text-sm"
                    >
                      <span className="truncate">
                        {a.nombre} <span className="text-muted-foreground">({a.peso})</span>
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setArchivos(archivos.filter((_, x) => x !== i))}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Pregunta>
          </FormSection>

          {/* SECCIÓN 7 */}
          <FormSection numero="7" titulo="ACCIONES PREVIAS Y MEDIDAS DE PROTECCIÓN">
            <Pregunta titulo="13. ¿Ya había denunciado estos hechos ante alguna otra instancia (dentro o fuera de INPPARES)?">
              <OpcionesUnicas
                opciones={SI_NO}
                value={denunciaPrevia}
                onChange={setDenunciaPrevia}
                columnas={2}
              />
              {denunciaPrevia === "Sí" ? (
                <CampoTextarea
                  label="Si respondió 'Sí', indique ante quién, cuándo y qué medidas se tomaron (si es que se tomaron):"
                  value={denunciaPreviaDetalle}
                  onChange={setDenunciaPreviaDetalle}
                  rows={3}
                  maxLength={1500}
                />
              ) : null}
            </Pregunta>

            <Pregunta
              titulo="14. MEDIDAS DE PROTECCIÓN"
              ayuda="Ante el riesgo que pueda correr por presentar esta denuncia, INPPARES pone a su disposición las siguientes medidas de protección. ¿Desea acogerse a alguna?"
            >
              <OpcionesMultiples
                opciones={PROTECCION}
                values={medidas}
                onToggle={toggleMedidaProteccion}
              />
              {medidas.includes("Sí, solicito medidas de protección laboral:") ? (
                <div className="ml-0 space-y-3 rounded-xl border bg-secondary/30 p-4 sm:ml-6">
                  <p className="text-sm font-medium">Seleccione las medidas laborales:</p>
                  <OpcionesMultiples
                    opciones={PROTECCION_LABORAL}
                    values={medidasLaborales}
                    onToggle={toggle(setMedidasLaborales as never)}
                  />
                  {medidasLaborales.includes("Otra medida de protección laboral (especifique)") ? (
                    <Input
                      value={medidaLaboralOtra}
                      maxLength={200}
                      placeholder="Especifique"
                      onChange={(e) => setMedidaLaboralOtra(e.target.value)}
                    />
                  ) : null}
                </div>
              ) : null}
              {solicitaMedidaProteccion ? (
                <CampoTextarea
                  label="Si marcó alguna medida de protección, justifique brevemente su solicitud:"
                  value={justificacionMedidas}
                  onChange={setJustificacionMedidas}
                  rows={3}
                  maxLength={1500}
                />
              ) : null}
              <p className="rounded-xl border bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground">
                “Cuando la denuncia corresponda a hechos de hostigamiento sexual en el ámbito laboral, las medidas de protección se adoptarán de conformidad con la Ley N.° 27942 y su Reglamento. En los demás casos de salvaguarda, INPPARES podrá adoptar las medidas preventivas necesarias para proteger a las personas afectadas, prevenir represalias y evitar la reiteración de los hechos, de acuerdo con la evaluación de riesgos de cada caso”
              </p>
            </Pregunta>
          </FormSection>

          {/* SECCIÓN 8 */}
          <FormSection
            numero="8"
            titulo="SUGERENCIAS DE SOLUCIÓN O ACCIONES CORRECTIVAS"
            descripcion="INPPARES valora su perspectiva. Esto ayudará a la entidad a tomar decisiones más efectivas y alineadas con la reparación del daño, si lo hubiera."
          >
            <Pregunta titulo="15. ¿Cuál(es) de las siguientes acciones correctivas o soluciones sugiere para atender los hechos denunciados?">
              <OpcionesMultiples
                opciones={SUGERENCIAS}
                values={sugerencias}
                onToggle={toggle(setSugerencias as never)}
              />
              {sugerencias.includes("Otra (especifique en el campo de texto siguiente).") ? (
                <Input
                  value={sugerenciaOtra}
                  maxLength={200}
                  placeholder="Especifique"
                  onChange={(e) => setSugerenciaOtra(e.target.value)}
                />
              ) : null}
            </Pregunta>
            <Pregunta
              titulo="16. Detalle adicional sobre su sugerencia de solución (Opcional, pero muy valioso para el equipo investigador)"
            >
              <CampoTextarea
                value={detalleSugerencia}
                onChange={setDetalleSugerencia}
                rows={6}
                maxLength={3000}
              />
            </Pregunta>
          </FormSection>

          {/* SECCIÓN 9 */}
          <FormSection numero="9" titulo="NOTIFICACIONES Y DECLARACIÓN FINAL">
            <Pregunta
              titulo="17. ¿Cómo prefiere recibir las notificaciones sobre el avance de su denuncia?"
              obligatorio
            >
              <OpcionesUnicas
                opciones={NOTIFICACIONES}
                value={notificacion}
                onChange={setNotificacion}
              />
            </Pregunta>

            <Pregunta
              titulo="18. DECLARACIÓN JURADA DE BUENA FE Y AUTORIZACIÓN DE DATOS PERSONALES"
              obligatorio
            >
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-secondary/30 p-4 text-sm leading-relaxed">
                <Checkbox
                  checked={declaracion}
                  onCheckedChange={(v) => setDeclaracion(v === true)}
                  className="mt-1"
                />
                <span>
                  <strong>Acepto y declaro lo siguiente:</strong> "Declaro bajo juramento que la
                  información proporcionada en este formulario se ajusta a la verdad y que los
                  documentos o archivos adjuntos son auténticos o copias fieles de los originales.
                  Autorizo a INPPARES a tratar mis datos personales (nombre, DNI, domicilio,
                  teléfono, correo electrónico) única y exclusivamente para la gestión,
                  investigación y resolución de la presente denuncia, bajo el marco de la Ley N°
                  29733 (Ley de Protección de Datos Personales), su reglamento y el Reglamento
                  Interno de INPPARES. Asumo el compromiso de mantenerme a disposición del equipo
                  investigador para brindar aclaraciones si fuera requerido."
                </span>
              </label>
            </Pregunta>
          </FormSection>

          {/* SECCIÓN 10 */}
          <FormSection
            numero="10"
            titulo="CLAVE Y CONTRASEÑA (para seguimiento)"
            descripcion="Una vez enviada la denuncia, recibirá una Clave de notificación automática. Con ella y la Contraseña que usted cree a continuación, podrá dar seguimiento al estado de su denuncia en cualquier momento."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Clave de la notificación</Label>
                <Input value="(Se genera automáticamente al enviar)" disabled readOnly />
              </div>
              <CampoTexto
                label="Cree una Contraseña (mínimo 4 caracteres)"
                type="password"
                value={password}
                onChange={setPassword}
                required
                maxLength={64}
              />
              <CampoTexto
                label="Repita la Contraseña"
                type="password"
                value={password2}
                onChange={setPassword2}
                required
                maxLength={64}
              />
            </div>
          </FormSection>

          <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
            <Button type="submit" size="lg" className="w-full text-base">
              <Send className="size-4" /> ENVIAR DENUNCIA
            </Button>
            <Separator className="my-6" />
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p className="font-display font-semibold text-foreground">
                NOTAS IMPORTANTES PARA EL DENUNCIANTE
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Guarde su Clave y Contraseña en un lugar seguro. Sin ellas no podrá consultar el
                  avance de su denuncia.
                </li>
                <li>
                  Las medidas de protección solicitadas serán evaluadas por el Comité de Ética de
                  INPPARES, quien determinará su procedencia según la gravedad de los hechos y la
                  normativa interna.
                </li>
                <li>
                  Este canal no reemplaza las vías legales ordinarias (denuncias ante la Policía,
                  Ministerio Público, etc.), sino que es un mecanismo interno complementario.
                </li>
                <li>
                  Recuerde: Este sistema no es un servicio de emergencia. Si hay peligro inminente,
                  contacte a las autoridades locales.
                </li>
              </ul>
              <p className="pt-3">
                Gracias por tu valentía, honestidad y confianza al presentar este reporte. Tu
                decisión de comunicar una situación de preocupación contribuye a fortalecer una
                cultura de respeto, integridad y protección en INPPARES.
              </p>
              <p>
                La información proporcionada será tratada con estricta confidencialidad y utilizada
                para evaluar el caso, adoptar las medidas de protección que correspondan y realizar
                las acciones de investigación, seguimiento y mejora institucional necesarias.
                Asimismo, cuando sea pertinente, los aprendizajes derivados de los reportes servirán
                para fortalecer nuestras políticas, procedimientos, acciones de prevención y la
                calidad de nuestros servicios, promoviendo entornos cada vez más seguros para todas
                las personas.
              </p>
            </div>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
