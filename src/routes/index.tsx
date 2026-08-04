import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Phone,
  ShieldCheck,
  Lock,
  Users,
  FileSearch,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Canal de Denuncias Seguras INPPARES | SafeReport" },
      {
        name: "description",
        content:
          "Reporte de forma confidencial o anónima faltas éticas, acoso, discriminación o malas prácticas financieras en INPPARES. Disponible 24/7 en todo el Perú.",
      },
      { property: "og:title", content: "Canal de Denuncias Seguras INPPARES | SafeReport" },
      {
        property: "og:description",
        content:
          "Reporte de forma confidencial o anónima faltas éticas, acoso, discriminación o malas prácticas financieras en INPPARES. Disponible 24/7 en todo el Perú.",
      },
    ],
  }),
  component: Inicio,
});

const emergencias = [
  { nombre: "Policía Nacional del Perú (PNP)", numero: "105" },
  { nombre: "Línea 100 — violencia familiar y sexual", numero: "100" },
  { nombre: "Sistema de Atención de Emergencias (SAE)", numero: "911" },
];

const temas = [
  {
    titulo: "Igualdad, diversidad e inclusión",
    detalle: "Racismo y todas las demás formas de discriminación.",
  },
  {
    titulo: "Asuntos laborales y del lugar de trabajo",
    detalle: "Acoso no sexual, intimidación, victimización.",
  },
  {
    titulo: "Malas prácticas financieras",
    detalle: "Fraude, corrupción, extorsión.",
  },
  {
    titulo: "Salvaguarda (protección)",
    detalle: "Acoso sexual, abuso sexual, explotación, esclavitud moderna.",
  },
  {
    titulo: "Seguridad y protección física",
    detalle: "Seguridad en viajes, incidentes violentos, riesgos de seguridad.",
  },
  {
    titulo: "Información y prestación de servicios",
    detalle: "Denegación de servicios, derivación o atención de seguimiento.",
  },
];

function Inicio() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="bg-hero-gradient text-primary-foreground">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:py-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                <ShieldCheck className="size-4" /> INPPARES SafeReport
              </p>
              <h1 className="mt-5 text-3xl leading-tight font-bold sm:text-5xl">
                Canal de Denuncias Seguras de INPPARES
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed opacity-90 sm:text-lg">
                INPPARES SafeReport es nuestro servicio de denuncia independiente y confidencial.
                Las preocupaciones sobre cualquiera de los asuntos mencionados anteriormente deben
                ser reportadas. Si le preocupa que algo haya sucedido, no necesita ser un(a)
                experto(a) sobre el tema; solo necesita reportar su preocupación.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/denuncia">
                    Presentar una denuncia <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link to="/seguimiento">Consultar mi denuncia</Link>
                </Button>
              </div>
              <p className="mt-5 text-sm opacity-80">
                Disponible las 24 horas del día, los 7 días de la semana, los 365 días del año.
                Puede reportar de forma anónima.
              </p>
            </div>

            <aside className="rounded-2xl border border-primary-foreground/25 bg-primary-foreground/10 p-6 shadow-elevated">
              <p className="flex items-center gap-2 font-display text-sm font-semibold tracking-wide uppercase">
                <AlertTriangle className="size-4" /> Aviso importante
              </p>
              <p className="mt-4 text-sm leading-relaxed opacity-95">
                Este sistema <strong>NO es un servicio de emergencia</strong>. No lo utilice para
                reportar situaciones que representen una amenaza inmediata para la vida, la
                integridad física, la seguridad o la propiedad.
              </p>
              <p className="mt-3 text-sm leading-relaxed opacity-95">
                Si usted o alguna persona se encuentra en peligro inminente o riesgo grave,
                comuníquese de inmediato con las autoridades locales:
              </p>
              <ul className="mt-4 space-y-2">
                {emergencias.map((e) => (
                  <li
                    key={e.numero}
                    className="flex items-center justify-between gap-3 rounded-xl bg-primary-foreground/10 px-3 py-2.5 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="size-4 shrink-0" /> {e.nombre}
                    </span>
                    <span className="font-display text-lg font-bold">{e.numero}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed opacity-80">
                Este canal está diseñado para reportar irregularidades, faltas éticas o actos de
                corrupción que no constituyan una emergencia inminente.
              </p>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="section-label">Presentación y bienvenida</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Un entorno seguro, libre de daños y positivo
          </h2>
          <div className="mt-6 grid gap-6 text-sm leading-relaxed text-muted-foreground lg:grid-cols-2">
            <div className="space-y-4">
              <p>
                Todas las personas tienen derecho a desempeñar su trabajo o realizar actividades de
                voluntariado en INPPARES en un entorno seguro, respetuoso y libre de cualquier forma
                de violencia, abuso, explotación o daño físico, psicológico, económico o de otra
                índole, que promueva su bienestar y desarrollo. Del mismo modo, las personas
                beneficiarias y usuarias de los servicios de INPPARES tienen derecho a recibir
                atención en un entorno seguro, donde sean tratadas con dignidad, respeto y sin
                discriminación.
              </p>
              <p>
                INPPARES está comprometido con la creación de este entorno y cultura; para sus
                usuarias y usuarios, personal y cualquier otra persona que entre en contacto con la
                organización, sin importar dónde se encuentre.
              </p>
              <p>
                Para hacer realidad esta cultura, las personas que trabajan o realizan voluntariado
                en INPPARES tienen la responsabilidad de comportarse adecuadamente en el trabajo.
                Políticas como el Código de Conducta, la Política Antifraude, la Política de Respeto
                en el Trabajo y la Política de Salvaguarda (Protección de Adultos Vulnerables y
                Niños, Niñas y Adolescentes) explican claramente cómo debe ser un comportamiento
                aceptable en el entorno laboral.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border bg-card p-5 text-card-foreground shadow-card">
                <p className="font-display text-sm font-semibold">
                  Antes de realizar su denuncia, le invitamos a consultar nuestro Código de Ética
                </p>
                <p className="mt-2 text-sm">
                  Disponible en:{" "}
                  <a
                    href="#codigo-de-etica"
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    [INSERTAR AQUÍ EL ENLACE AL CÓDIGO DE ÉTICA DE INPPARES]
                  </a>
                </p>
              </div>
              <p>
                INPPARES está comprometido y es proactivo en la protección de sus finanzas y activos
                relacionados y, para tal fin, tiene una respuesta de tolerancia cero ante las malas
                prácticas financieras. INPPARES cuenta con una Política Antifraude que brinda
                claridad sobre este tema especializado.
              </p>
              <p>
                A pesar de la existencia de un Código de Conducta claro, un compromiso
                organizacional de tolerancia cero, la existencia de diversas políticas y
                procedimientos relevantes y las mejores intenciones de todos, a veces las cosas
                pueden salir mal.
              </p>
            </div>
          </div>

          <h3 className="mt-12 text-lg font-semibold">
            Por ejemplo, como miembro del personal, es posible que haya experimentado personalmente,
            haya escuchado o haya sido testigo de cualquiera de los siguientes problemas (lista no
            exhaustiva):
          </h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {temas.map((t) => (
              <li key={t.titulo} className="rounded-2xl border bg-card p-5 shadow-card">
                <p className="font-display font-semibold">{t.titulo}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t.detalle}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-y bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <p className="section-label">Preguntas frecuentes</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Cómo funciona este canal</h2>
            <Accordion type="single" collapsible className="mt-6 space-y-3">
              <AccordionItem value="a1" className="rounded-2xl border bg-card px-5">
                <AccordionTrigger className="text-left font-display text-base">
                  ¿Por qué debo reportar una preocupación?
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Reportar una preocupación contribuye a proteger los derechos, la dignidad y el
                    bienestar de las personas. Si una situación no se comunica, es posible que
                    INPPARES no la conozca y, por lo tanto, no pueda actuar para prevenir daños o
                    brindar una respuesta oportuna.
                  </p>
                  <p>
                    La protección de los derechos humanos es una responsabilidad compartida. Al
                    reportar una preocupación de buena fe, contribuyes a construir un entorno
                    seguro, respetuoso y libre de violencia. Esto incluye reportar cualquier cosa
                    que le preocupe.
                  </p>
                  <p>
                    Un mecanismo de denuncia eficaz permite a INPPARES comprender qué ha salido mal,
                    identificar y establecer un apoyo proporcional y efectivo, una respuesta formal
                    y, cuando sea necesario, acciones correctivas. INPPARES rinde cuentas a sus
                    donantes y entidades reguladoras, quienes esperan ser informados en caso existan
                    incidentes graves, incluidos fraude, abuso, explotación y acoso.
                  </p>
                  <p>
                    INPPARES cuenta con una política de "Canales Éticos" que respalda las acciones y
                    los principios rectores que cumple.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="a2" className="rounded-2xl border bg-card px-5">
                <AccordionTrigger className="text-left font-display text-base">
                  ¿Quién debe reportar?
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  Cualquier persona puede reportar una preocupación, incluidas las y los usuarios de
                  INPPARES, miembros del público y cualquier persona que trabaje o sea voluntaria en
                  las sedes de INPPARES en todo el Perú, así como proveedores, donantes, etc.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="a3" className="rounded-2xl border bg-card px-5">
                <AccordionTrigger className="text-left font-display text-base">
                  ¿Cómo reportar una preocupación?
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Las preocupaciones se pueden reportar a través del Canal de Denuncias Seguras de
                    INPPARES, disponible las 24 horas del día, los 7 días de la semana, los 365 días
                    del año.
                  </p>
                  <p>
                    Vía web o móvil: Ingrese a la página web institucional de INPPARES y acceda al
                    enlace del Sistema de Denuncias Seguras. Será guiado(a) a través de una serie de
                    preguntas. Al finalizar, haga clic en "Enviar". Habrá proporcionado los detalles
                    de su preocupación. Disponible en español.
                  </p>
                  <p>
                    Vía telefónica (opcional): [INSERTAR AQUÍ EL NÚMERO DE TELÉFONO HABILITADO, SI
                    APLICA]
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="a4" className="rounded-2xl border bg-card px-5">
                <AccordionTrigger className="text-left font-display text-base">
                  ¿Qué puedo esperar cuando reporto una preocupación?
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Cuando se reporta una preocupación, esta será evaluada y asignada al Comité de
                    Ética para su seguimiento. El contenido de su reporte solo se compartirá con
                    otras personas bajo una estricta necesidad de saber, de acuerdo con la Política
                    de Confidencialidad de INPPARES.
                  </p>
                  <p>
                    Las personas encargadas de la investigación son responsables de revisar las
                    preocupaciones y decidir la respuesta apropiada y proporcional caso por caso, de
                    manera confidencial y de acuerdo con los valores, políticas y procedimientos de
                    INPPARES.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="a5" className="rounded-2xl border bg-card px-5">
                <AccordionTrigger className="text-left font-display text-base">
                  ¿Cómo sabré qué avance se está realizando?
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Cuando reporte una preocupación, recibirá una{" "}
                    <strong>Clave de la notificación</strong> y deberá crear una{" "}
                    <strong>Contraseña</strong>. Guarde estos datos en un lugar seguro y no los
                    comparta con nadie. Los necesitará para acceder a su reporte, ver
                    actualizaciones sobre el progreso, formular más preguntas sobre la notificación,
                    cargar más información, contestar las preguntas que formulemos, entre otros.
                  </p>
                  <p>
                    Si en el momento de reportar la preocupación proporcionó un correo electrónico
                    para recibir notificaciones sobre el avance, recibirá un correo informándole que
                    hay un mensaje sobre su reporte al que debe acceder y responder.
                  </p>
                  <p>
                    Si no proporcionó una dirección de correo electrónico para recibir estas
                    notificaciones, deberá volver a iniciar sesión en el Sistema de Denuncias
                    Seguras de INPPARES ingresando la Clave de la notificación y la Contraseña que
                    recibió cuando presentó su reporte original.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: Lock,
                titulo: "Confidencial y anónimo",
                texto:
                  "Puede omitir sus datos personales. Si los brinda, se tratan según la Ley N° 29733.",
              },
              {
                icon: Users,
                titulo: "Abierto a todas las personas",
                texto:
                  "Personal, voluntariado, usuarias y usuarios, proveedores, donantes y público en general.",
              },
              {
                icon: FileSearch,
                titulo: "Con seguimiento verificable",
                texto:
                  "Reciba una clave, cree su contraseña y consulte el avance cuando lo necesite.",
              },
            ].map((c) => (
              <div key={c.titulo} className="rounded-2xl border bg-card p-6 shadow-card">
                <c.icon className="size-6 text-primary" />
                <p className="mt-4 font-display font-semibold">{c.titulo}</p>
                <p className="mt-2 text-sm text-muted-foreground">{c.texto}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border bg-hero-gradient p-8 text-primary-foreground shadow-elevated sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold sm:text-2xl">¿Listo(a) para reportar?</h2>
              <p className="mt-2 max-w-xl text-sm opacity-90">
                El formulario toma entre 10 y 20 minutos. Puede permanecer en el anonimato en
                cualquier momento.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/denuncia">Ir al formulario</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/seguimiento">
                  <KeyRound className="size-4" /> Ya tengo una clave
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
