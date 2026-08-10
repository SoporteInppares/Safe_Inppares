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
    titulo: "Malas prácticas administrativas o financieras",
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
    detalle: "Sustracción de equipos o medicamentos, alteración en la facturación, contratos paralelos, etc.",
  },
];

function Inicio() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="bg-hero-gradient text-primary-foreground">
          <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_0.9fr] lg:gap-12 lg:py-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                <ShieldCheck className="size-4" /> INPPARES SafeReport
              </p>
              <h1 className="mt-5 text-3xl leading-tight font-bold sm:text-5xl">
                Canal de Denuncias Seguras de INPPARES
              </h1>
              <p className="mt-5 text-[0.8125rem] leading-[1.7] text-justify opacity-90 sm:text-[0.875rem] sm:leading-[1.75]">
                INPPARES SafeReport es nuestro servicio de denuncia independiente y confidencial. Este canal está diseñado para reportar irregularidades, faltas éticas o actos de corrupción que no constituyan una emergencia inminente. Si le preocupa que algo haya sucedido, no necesita ser un(a) experto(a) sobre el tema; solo necesita reportar su preocupación. <strong>En INPPARES predicamos con el ejemplo y fomentamos una cultura de integridad y valentía, no de cobardía ni silencio cómplice.</strong> Por ello, <strong>no aceptamos denuncias remitidas a través de correos electrónicos anónimos,</strong> ya que estas no permiten un adecuado seguimiento, ni garantizan la protección del denunciante, y en lugar de fortalecer la institución, pueden afectar negativamente el clima laboral y la confianza entre las personas. Te invitamos a utilizar este canal seguro, donde tu identidad será protegida con estricta confidencialidad por el Comité de Ética, y donde podrás optar por el anonimato dentro del sistema, siempre que proporciones elementos suficientes para una investigación seria.
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
                Este sistema <strong>NO es un servicio de emergencia.</strong> Si usted o alguna persona se encuentra en peligro inminente o riesgo grave para la vida, la integridad física, la seguridad o la propiedad, comuníquese de inmediato con las autoridades locales
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
                corrupción en la institución que no constituyan una emergencia inminente.
              </p>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Accordion type="single" collapsible className="rounded-2xl border bg-card text-card-foreground shadow-card">
            <AccordionItem value="codigo-etica" className="px-5">
              <AccordionTrigger className="text-left font-display text-sm font-semibold">
                Antes de realizar su denuncia, le invitamos a consultar nuestro Código de Ética
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                {/* <p className="mb-4 text-sm">
                  Disponible en:{" "}
                  <a
                    href="#codigo-de-etica"
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    [INSERTAR AQUÍ EL ENLACE AL CÓDIGO DE ÉTICA DE INPPARES]
                  </a>
                </p> */}
                <ol className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                    <div>
                      <strong className="text-foreground">Respeto irrestricto por los derechos humanos, sexuales y reproductivos.</strong>{" "}
                      Reconocemos y defendemos el derecho de todas las personas, sin distinción, a decidir libremente sobre su vida sexual y reproductiva, y a disfrutar del más alto nivel posible de bienestar físico, psicológico y emocional.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                    <div>
                      <strong className="text-foreground">Atención con calidad, calidez y excelencia.</strong>{" "}
                      Brindamos servicios integrales e innovadores que cumplen con los más altos estándares de calidad, asegurando la satisfacción de nuestros usuarios y usuarias a través de un trato amable, ágil y profesional.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
                    <div>
                      <strong className="text-foreground">Confidencialidad y privacidad absoluta.</strong>{" "}
                      Resguardamos celosamente toda la información personal y clínica de quienes nos confían su salud, garantizando espacios adecuados para la atención y no divulgando datos a terceros sin autorización legal.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</span>
                    <div>
                      <strong className="text-foreground">Equidad e inclusión sin discriminación.</strong>{" "}
                      Actuamos sin discriminación por género, orientación sexual, edad, raza, condición socioeconómica, religión o ideología, promoviendo la equidad y la inclusión en todos nuestros servicios y relaciones laborales.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">5</span>
                    <div>
                      <strong className="text-foreground">Probidad, honestidad y transparencia.</strong>{" "}
                      Mantenemos una conducta moralmente intachable, con reglas claras y conocidas, anteponiendo siempre el interés institucional y el bien común sobre cualquier interés particular.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">6</span>
                    <div>
                      <strong className="text-foreground">Compromiso con la mejora continua y la sostenibilidad.</strong>{" "}
                      Orientamos nuestra gestión a la mejora constante de la calidad, la eficiencia y la eficacia, buscando la sostenibilidad social, técnica y económica de la institución.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">7</span>
                    <div>
                      <strong className="text-foreground">Rendición de cuentas y comunicación veraz.</strong>{" "}
                      Cuidamos y gestionamos adecuadamente nuestro patrimonio y recursos. Informamos de manera transparente y oportuna sobre nuestras acciones y decisiones a todos nuestros grupos de interés, utilizando canales formales y asegurando la veracidad de la información.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">8</span>
                    <div>
                      <strong className="text-foreground">Independencia y neutralidad institucional.</strong>{" "}
                      Actuamos con total independencia política, filosófica y religiosa, sin buscar proselitismo ni favorecer intereses particulares, manteniendo nuestra misión social por encima de cualquier otra consideración.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">9</span>
                    <div>
                      <strong className="text-foreground">Responsabilidad y seguridad en la atención.</strong>{" "}
                      Nos comprometemos a prevenir y manejar con responsabilidad cualquier evento adverso, manteniendo protocolos actualizados y personal capacitado para garantizar la seguridad de nuestros usuarios y usuarias.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">10</span>
                    <div>
                      <strong className="text-foreground">Participación y respeto en el entorno laboral.</strong>{" "}
                      Fomentamos un clima laboral basado en el respeto, la equidad y la comunicación abierta, protegiendo los derechos de nuestros colaboradores y promoviendo su desarrollo profesional y bienestar.
                    </div>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="mt-10 section-label">Presentación y bienvenida</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Un entorno seguro, libre de daños y positivo
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
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
            <p>
              INPPARES está comprometido y es proactivo en la protección de sus finanzas y activos
              relacionados y, para tal fin, tiene una respuesta de tolerancia cero ante las malas
              prácticas financieras o administrativas. INPPARES cuenta con una Política Antifraude que brinda
              claridad sobre este tema especializado.
            </p>
            <p>
              A pesar de la existencia de un Código de Conducta claro, un compromiso
              organizacional de tolerancia cero, la existencia de diversas políticas y
              procedimientos relevantes y las mejores intenciones de todos, a veces las cosas
              pueden salir mal.
            </p>
          </div>

          <h3 className="mt-12 text-lg font-semibold">
            Por ejemplo, es posible que haya experimentado personalmente,
            haya escuchado o haya sido testigo de cualquiera de los siguientes problemas (lista no
            exhaustiva, son ejemplos):
          </h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {temas.map((t) => (
              <li key={t.titulo} className="rounded-2xl border bg-card p-5 shadow-card">
                <p className="font-display font-semibold">{t.titulo}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t.detalle}</p>
              </li>
            ))}
          </ul>

          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="nota-servicios" className="rounded-2xl border-l-4 border border-warning/50 bg-warning-surface px-5 shadow-card">
              <AccordionTrigger className="text-left font-display text-sm font-semibold text-warning-foreground sm:text-base">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="size-4 shrink-0 text-warning" />
                  Distinción entre el Libro de Reclamaciones y el Canal de Denuncias Seguras
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-5 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Es fundamental diferenciar dos mecanismos que, aunque pueden parecer similares, tienen propósitos, alcances y marcos legales completamente distintos. Por un lado, el Libro de Reclamaciones es un instrumento obligatorio para la protección de los consumidores, regulado por el Código de Protección y Defensa del Consumidor (Ley N° 29571). Por otro lado, el Canal de Denuncias Seguras de INPPARES es un mecanismo interno de gobernanza ética, diseñado para proteger la integridad de la organización, su personal y las personas que se relacionan con ella, frente a conductas contrarias a los valores institucionales y a la ley.
                </p>
                <p>
                  El Libro de Reclamaciones es un registro físico o virtual de acceso obligatorio para todos los establecimientos comerciales y plataformas de comercio electrónico. Su finalidad es que los consumidores o usuarios puedan expresar su disconformidad con la calidad del producto o servicio adquirido, o con la atención recibida durante la transacción comercial. En este libro se registran, por ejemplo, quejas por cobros indebidos, incumplimiento de plazos de entrega, productos defectuosos, atención deficiente o cualquier otra situación que afecte la relación de consumo. Este mecanismo está respaldado por la Ley N° 29571, el Decreto Supremo N° 011-2011-PCM y es fiscalizado por el Indecopi, que vela por su correcta implementación y sanciona su ausencia o negativa de uso.
                </p>
                <p>
                  El Canal de Denuncias Seguras es un instrumento de ética y cumplimiento normativo, dirigido a cualquier persona con vínculo con INPPARES (empleados, voluntarios, directivos, proveedores, usuarios, etc.). Su objetivo es reportar conductas individuales o prácticas que atenten contra la integridad de las personas, la transparencia institucional o el cumplimiento de las políticas internas y la ley. A través de este canal se pueden denunciar, entre otros, casos de acoso laboral, hostigamiento sexual, discriminación, conflicto de interés, fraude, corrupción, fuga de información confidencial, alteración de documentos, incumplimiento del Código de Ética o cualquier otra falta administrativa o ética. En el ámbito específico de los servicios que brinda INPPARES, también se pueden reportar, por ejemplo: uso de insumos o productos inadecuados o vencidos en la atención a usuarios; sustracción o desvío de medicamentos, materiales o equipos; intentos de establecer contratos paralelos o acuerdos informales con proveedores sin la debida autorización; cobros indebidos o no registrados en el sistema; derivación inapropiada de pacientes a servicios externos por beneficio personal; omisión o falsificación de registros médicos o de atenciones; y cualquier otra práctica que comprometa la calidad, seguridad o transparencia en la prestación de servicios. Este canal no reemplaza las vías legales ordinarias ni el Libro de Reclamaciones, sino que complementa el sistema de control interno de la organización, garantizando la confidencialidad y protección del denunciante.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
                  "Puede impedir que se conozcan sus datos personales. Si los brinda, se tratan según la Ley N° 29733.",
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
