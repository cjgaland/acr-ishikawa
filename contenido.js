// ============================================================
//  contenido.js — Solo datos · ACR · Ishikawa
//  Aprende (temas), glosario, «Ponte a prueba» y ejemplos. HTML de confianza
//  escrito a mano. El ejemplo es el caso ficticio de Urgencias del libro de los
//  autores (Ishikawa de la sala de espera). Fuentes: Diseño, sección 3.
//  window.Contenido en navegador y module.exports en Node (tests).
// ============================================================
(function (raiz) {
  "use strict";

  // ---------- Aprende ----------
  // c = color del tema (P/H/V/A, solo como color)
  const TEMAS = [
    { n: 1, c: "P", titulo: "Por qué no buscamos culpables", sub: "El error humano nunca es la causa final",
      minuto: [
        "Cuando algo sale mal, lo primero que sale es buscar a quién se equivocó. Es humano, pero <b>no sirve</b>: el sistema que facilitó el error sigue ahí, esperando al siguiente profesional.",
        "El informe <b>RCA²</b> lo dice claro: el error humano es inevitable; si un profesional bien formado y con buena intención se equivoca en su entorno habitual, <b>hay factores del sistema que lo facilitaron</b>. Por eso «error humano» nunca es una causa raíz aceptable.",
        "James Reason lo explicó con el <b>queso suizo</b>: cada barrera tiene agujeros que se abren y se cierran; el daño llega cuando se alinean.",
        "Lo delictivo, el consumo de sustancias o lo hecho a propósito para causar daño <b>no va a un análisis causa raíz</b>: la organización lo define de antemano y lo trata por otra vía."
      ],
      secciones: [
        { t: "La primera pregunta lo decide todo", h: "<p>Si tras un incidente la primera pregunta es «¿quién estaba de triaje esa noche?», la persona implicada se encierra, el resto aprende a callar y el análisis acaba en «extremar la precaución». Si la pregunta es «<b>¿qué hizo posible que pasara?</b>», salen el termómetro que se iba con los pacientes, la reevaluación que no tenía responsable y el programa que dejaba cerrar el triaje sin datos. Con la primera se encuentra un nombre; con la segunda, los agujeros que hay que cerrar.</p>" },
        { t: "Sancionar o reentrenar no basta", h: "<p>Si se sanciona o se vuelve a formar a quien se equivocó, quizá esa persona no repita el error, pero <b>no cambia la probabilidad de que le pase a otra</b> en las mismas circunstancias. Formar a todos tampoco: la plantilla rota y lo que hoy impresiona se olvida mañana. Por eso las acciones que atacan a las personas (formación, recordatorios, normas nuevas) son las más débiles, y las que cambian el sistema, las más fuertes.</p>" },
        { t: "Cultura justa", h: "<p>Buscar causas del sistema no es lo mismo que «nadie es responsable». La organización define de antemano qué conductas quedan fuera del análisis (los actos delictivos o deliberadamente inseguros) y van por otra vía. Todo lo demás se analiza para <b>aprender</b>. Si los análisis buscan culpables, los profesionales dejan de notificar; si buscan el sistema, notifican y colaboran.</p>" }
      ],
      minicaso: "<p>Una enfermera administra 10 veces la dosis de un medicamento. Primera reacción: «Ha sido un despiste». Preguntando «¿qué lo hizo posible?», el equipo encuentra que el programa muestra las dosis muy juntas en la pantalla y que dos presentaciones del mismo fármaco tienen el envase casi igual. Ni la sanción ni el «tened más cuidado» habrían cambiado nada de eso.</p>",
      practica: { href: "#/nuevo/ishikawa", texto: "Buscar las causas de un problema" } },
    { n: 2, c: "H", titulo: "El diagrama de Ishikawa", sub: "Ordenar las causas posibles en una espina de pescado",
      minuto: [
        "El <b>diagrama de causa-efecto</b> se llama también de <b>Ishikawa</b>, por Kaoru Ishikawa, y de <b>espina de pescado</b>, por su forma. Es una de las siete herramientas básicas de la calidad.",
        "El <b>problema</b> (el efecto) va en la <b>cabeza</b> del pez. Las <b>causas posibles</b> se agrupan en <b>espinas</b> por categorías; si una causa tiene a su vez causas, se dibujan espinas más pequeñas.",
        "En sanidad se usan categorías adaptadas: <b>personal, procedimiento, organización, comunicación, equipamiento, entorno y paciente</b>. Hay otras: los siete niveles de Vincent y del Protocolo de Londres, los de SEIPS o las 6M de la industria.",
        "Se hace <b>en equipo</b>, con una lluvia de ideas, y termina eligiendo las causas de fondo y <b>comprobándolas con datos</b>: una causa probable no es una causa demostrada."
      ],
      secciones: [
        { t: "Paso a paso", h: "<ol><li>Escribid el <b>problema</b> como un hecho concreto y medible (no «la sala de espera es un caos», sino «en 7 de los 25 episodios revisados con esperas de más de 90 minutos no consta la reevaluación»).</li><li>Dibujad la espina central y las <b>categorías</b>.</li><li>Con una lluvia de ideas (mejor primero en silencio, cada uno en sus tarjetas), apuntad las <b>causas posibles</b> en su categoría.</li><li>En cada causa, preguntad <b>«¿por qué?»</b> hasta llegar a algo que se pueda cambiar y medir.</li><li><b>Elegid</b> las causas más importantes (votad si hace falta) y decidid <b>cómo comprobarlas con datos</b>.</li></ol>" },
        { t: "Las categorías", h: "<p>La app trae cinco juegos, y uno propio:</p><ul><li><b>Las siete de la guía</b> (por defecto): personal, procedimiento, organización, comunicación, equipamiento, entorno y paciente. Son las de los cursos de los autores y de la app AMFE.</li><li><b>Vincent y Protocolo de Londres</b>: los siete niveles de Vincent (1998), base del Protocolo de Londres: paciente, tarea, profesional, equipo, entorno de trabajo, organización y gestión, y contexto institucional. Para analizar un incidente clínico mirando todo el sistema.</li><li><b>Protocolo de Londres 2024</b>: la edición nueva separa la información y la tecnología y une la cultura a la organización (ocho niveles).</li><li><b>SEIPS</b>: persona(s), tareas, herramientas y tecnología, entorno físico, condiciones de la organización y entorno externo. El modelo de factores humanos que usa el NHS.</li><li><b>Las 6M</b>: mano de obra, métodos, máquinas, materiales, medición y medio ambiente. Para procesos no clínicos.</li></ul><p>Puedes cambiar de juego cuando quieras: la app propone a qué categoría va cada causa.</p>" },
        { t: "«Falta de formación» y «falta de personal» no son el final", h: "<p>Son las dos causas que más se escriben y las que menos ayudan si se quedan ahí. Preguntad por qué: ¿falta formación porque no hay plan de acogida para los eventuales? ¿Falta personal en un momento concreto porque la sala y los boxes los cubre la misma persona? La causa de fondo suele estar en <b>cómo se organiza el trabajo</b>.</p>" }
      ],
      minicaso: "<p>En la sala de espera de Urgencias, el equipo escribe trece causas en una hora. La espina de la organización da la clave: <i>la reevaluación no está asignada a ningún puesto; de noche, la misma enfermera cubre la sala y los boxes, y los boxes siempre ganan</i>. Los datos de la auditoría lo confirman: cinco de los siete incumplimientos son de noche.</p>",
      practica: { href: "#/analisis/ej-ish-sala/2", texto: "Ver la espina del ejemplo" } },
    { n: 3, c: "V", titulo: "Los cinco porqués", sub: "De la causa aparente a la causa de fondo",
      minuto: [
        "Tomar una causa y preguntar <b>«¿por qué?»</b> varias veces seguidas.",
        "El número cinco es <b>orientativo</b>: se para cuando se llega a algo que el equipo <b>puede cambiar y medir</b>. A veces bastan tres o cuatro.",
        "Funciona muy bien <b>dentro de cada espina</b> del Ishikawa.",
        "La respuesta casi nunca es «recordar que hay que hacerlo», sino un cambio en el sistema."
      ],
      secciones: [
        { t: "El coche que no arranca", h: "<p>La causa aparente es «la batería está descargada». ¿Por qué? Porque las luces se quedaron encendidas toda la noche. ¿Por qué? Porque el coche no avisa si las dejas puestas. ¿Por qué? Porque el aviso se estropeó y nadie lo ha arreglado. La solución no es «tener más cuidado»: es <b>arreglar el aviso</b>.</p>" },
        { t: "Un ejemplo sanitario", h: "<p><i>En el triaje falta a menudo la temperatura.</i></p><ol><li>¿Por qué falta? Porque la enfermera no tiene termómetro en ese momento.</li><li>¿Por qué no lo tiene? Porque solo hay uno en el triaje y se va con el paciente al box.</li><li>¿Por qué solo hay uno? Porque los demás se estropearon y nadie pidió reponerlos.</li><li>¿Por qué nadie los pidió? Porque no hay una revisión periódica del material del triaje.</li></ol><p>La respuesta: <b>dos termómetros fijos en el puesto y una revisión semanal del material</b>, junto con el campo obligatorio en el programa. Han bastado cuatro porqués.</p>" },
        { t: "Trampas", h: "<ul><li>Parar en una persona («porque se le olvidó»): todo error humano tiene una causa previa.</li><li>Parar en «no se siguió el protocolo»: pregunta por qué no se siguió.</li><li>Saltar a la solución («porque no hay protocolo» suele esconder «hay que hacer un protocolo»).</li></ul>" }
      ],
      minicaso: "<p>«Se olvidaron de pautar la profilaxis.» ¿Por qué? Porque la orden médica no la incluye por defecto. ¿Por qué? Porque la plantilla de ingreso del programa no tiene ese apartado. Acción fuerte: añadirlo a la plantilla, con la pregunta obligatoria.</p>",
      practica: { href: "#/analisis/ej-ish-sala/2", texto: "Ver los porqués del ejemplo" } }
  ];

  // ---------- Glosario ----------
  const GLOSARIO = [
    ["Acción débil", "La que depende de que alguien se acuerde de hacerla: formación, recordatorios, carteles, un procedimiento nuevo. Útil como complemento, pero sola rara vez basta."],
    ["Acción fuerte", "La que cambia el sistema y depende poco de la memoria de las personas: una función forzada en el programa, simplificar el proceso, estandarizar, cambiar el espacio."],
    ["Acción intermedia", "La que ayuda a hacerlo bien pero aún depende en parte de las personas: una lista de verificación, una alerta en el programa, más personal en las horas punta."],
    ["Afirmación causal", "Frase que une una causa con su efecto y con el incidente: «Como [causa], [efecto], lo que aumentó la probabilidad de [evento]». Se escribe con las cinco reglas de la causalidad."],
    ["Análisis causa raíz (ACR)", "Método estructurado para estudiar un incidente grave (un evento adverso o un casi incidente) y encontrar las causas del sistema que lo hicieron posible, para que no se repita."],
    ["APEA", "Análisis en profundidad de un evento adverso: nombre que usa el Ministerio de Sanidad para el ACR, el Protocolo de Londres y métodos parecidos."],
    ["Casi incidente", "Incidente que no llegó al paciente, por suerte o porque alguien lo detectó a tiempo. Se analiza como si hubiera pasado lo peor razonable."],
    ["Causa aparente", "La primera que se ve («se olvidaron», «no siguieron el protocolo»). Casi nunca es la de fondo."],
    ["Causa de fondo", "La causa del sistema a la que se llega preguntando «¿por qué?»: algo que se puede cambiar y medir. También se llama causa raíz."],
    ["Cinco porqués", "Preguntar «¿por qué?» varias veces seguidas hasta llegar a la causa de fondo. El cinco es orientativo."],
    ["Cinco reglas de la causalidad", "Reglas para escribir afirmaciones causales sin culpar: mostrar la relación causa-efecto; usar descripciones precisas, sin palabras vagas ni negativas; todo error humano tiene una causa previa; saltarse un procedimiento no es causa raíz; no actuar solo es causa si había obligación de actuar."],
    ["Condición latente", "Fallo del sistema que espera escondido (un diseño, una norma, una carga de trabajo) hasta que coincide con otros y causa daño."],
    ["Cultura justa", "Forma de tratar los errores que busca las causas del sistema y no castiga los errores honestos, pero deja fuera los actos delictivos o deliberadamente inseguros."],
    ["Diagrama de Ishikawa", "Diagrama de causa-efecto en forma de espina de pescado: el problema en la cabeza y las causas posibles agrupadas en espinas por categorías."],
    ["Error activo", "El error de la persona que está en contacto con el paciente. Es la última loncha del queso, no la causa."],
    ["Espina", "Cada una de las líneas del diagrama de Ishikawa que agrupa las causas de una categoría."],
    ["Evento adverso", "Incidente que causa daño al paciente."],
    ["Factor contribuyente", "Circunstancia del paciente, de las personas, de la tarea, del equipo, del entorno o de la organización que influyó en que el incidente ocurriera."],
    ["Función forzada", "Diseño que impide hacerlo mal: que el programa no deje seguir sin un dato, o una conexión que solo encaja de la forma correcta. Es una acción fuerte."],
    ["Indicador", "Medida que dice si una acción funciona: qué se mide (numerador), sobre qué total (denominador), qué nivel se espera y cuándo se mide."],
    ["Protocolo de Londres", "Método de análisis de incidentes clínicos de Taylor-Adams y Vincent (2004), con una edición nueva en 2024 que da más peso a pacientes, familias y apoyo tras el incidente."],
    ["Queso suizo", "Modelo de James Reason: cada barrera tiene agujeros que se abren y se cierran; el daño llega cuando se alinean."],
    ["RCA²", "«Root Cause Analysis and Action»: informe de la National Patient Safety Foundation (2015, versión 2 de 2016) para que los análisis causa raíz terminen en acciones eficaces."],
    ["SAC", "Código de evaluación de la seguridad: nivel de riesgo de un incidente según su gravedad y su frecuencia. En el SiNASP, SAC 1 es riesgo extremo y SAC 4, bajo."],
    ["SEIPS", "Modelo de factores humanos que describe el sistema de trabajo: persona(s), tareas, herramientas y tecnología, entorno interno, organización y entorno externo."],
    ["Segunda víctima", "Profesional afectado emocionalmente tras un evento adverso en el que ha participado. Necesita apoyo."],
    ["SiNASP", "Sistema de Notificación y Aprendizaje para la Seguridad del Paciente del Ministerio de Sanidad."]
  ];

  // ---------- Ponte a prueba (las cinco del capítulo 8; las demás llegan en la entrega 4) ----------
  const TEMAS_TEST = { 1: { nom: "Ishikawa", aprende: 2 }, 2: { nom: "Análisis causa raíz", aprende: 1 } };
  const TEST = [
    { t: 1, q: "¿Cuál de estos es un problema bien definido para un Ishikawa?", o: ["«La sala de espera es un desastre».", "«Falta personal».", "«En 7 de 25 episodios con esperas de más de 90 minutos no consta la reevaluación».", "«Hay que contratar a una enfermera»."], ok: 2, e: "Un hecho concreto y medible. Las demás son opiniones o soluciones." },
    { t: 2, q: "«La enfermera se olvidó de reevaluar». Según las reglas de la causalidad, ¿qué falta?", o: ["Nada.", "La causa previa del olvido: el error humano tiene que tener una causa.", "El nombre de la enfermera.", "La sanción."], ok: 1, e: "Hay que explicar qué hizo posible el olvido (por ejemplo, que la tarea no estaba asignada)." },
    { t: 2, q: "¿Quién no debe formar parte del equipo de un análisis causa raíz?", o: ["Un experto en el proceso.", "Alguien de otro nivel de la organización.", "Los profesionales implicados en el incidente.", "Un representante de los pacientes ajeno al caso."], ok: 2, e: "Los implicados se entrevistan, pero no forman parte del equipo." },
    { t: 2, q: "¿Cuál es la acción más fuerte tras un incidente por constantes incompletas en el triaje?", o: ["Una sesión formativa.", "Un cartel.", "Que el programa no deje cerrar el triaje sin las constantes.", "Un recordatorio por correo."], ok: 2, e: "Una función forzada en el programa no depende de la memoria." },
    { t: 2, q: "¿Cuándo recomienda el informe RCA² empezar un análisis?", o: ["En el plazo de un año.", "En las 72 horas siguientes a decidir que hace falta.", "Cuando lo pida un juez.", "Solo si hay fallecimiento."], ok: 1, e: "En las 72 horas siguientes a reconocer que hace falta, y terminarlo en 30 a 45 días." }
  ];


  // ---------- Preguntas desencadenantes (propias, a partir del RCA² apéndice 2, la Joint Commission y el Protocolo de Londres) ----------
  // eq = idea común de la categoría a la que apunta (ver PLANTILLAS en logic.js). Una respuesta «no» propone una causa.
  const PREGUNTAS = [
    { id: "q-com1", eq: "equipo", q: "¿Se identificó correctamente al paciente en cada paso?", causa: "Fallo en la identificación del paciente" },
    { id: "q-com2", eq: "equipo", q: "¿La información pasó bien entre profesionales, turnos y servicios (traspasos, avisos, resultados)?", causa: "La información no llegó o se entendió mal entre profesionales o turnos" },
    { id: "q-com3", eq: "equipo", q: "¿Había una forma clara de pedir ayuda o avisar de un empeoramiento, y se usó?", causa: "No había una forma clara de pedir ayuda o de avisar" },
    { id: "q-com4", eq: "paciente", q: "¿El paciente o la familia podían comunicarse y avisar, y se les escuchó?", causa: "El paciente o la familia no podían avisar, o no se les escuchó" },
    { id: "q-for1", eq: "persona", q: "¿Quienes intervinieron tenían la formación y la experiencia que la tarea exigía?", causa: "Formación o experiencia insuficientes para la tarea" },
    { id: "q-for2", eq: "organizacion", q: "¿Hay acogida y formación para el personal nuevo o eventual en ese puesto?", causa: "Sin acogida ni formación para el personal nuevo o eventual" },
    { id: "q-fat1", eq: "organizacion", q: "¿La carga de trabajo y los turnos eran razonables (sin acumulación de tareas, fatiga o puestos sin cubrir)?", causa: "Carga de trabajo excesiva, fatiga o puestos sin cubrir" },
    { id: "q-fat2", eq: "entorno", q: "¿Se pudo trabajar sin interrupciones ni distracciones en los momentos críticos?", causa: "Interrupciones y distracciones en un momento crítico" },
    { id: "q-ent1", eq: "entorno", q: "¿El espacio, la luz, el ruido y la distribución ayudaban a hacer la tarea y a vigilar a los pacientes?", causa: "El espacio o la distribución dificultaban la tarea o la vigilancia" },
    { id: "q-equ1", eq: "tecnologia", q: "¿Los equipos y el material estaban, funcionaban y eran fáciles de usar?", causa: "Equipo o material que faltaba, fallaba o era difícil de usar" },
    { id: "q-equ2", eq: "tecnologia", q: "¿El programa informático ayudaba (alertas, campos obligatorios, información visible) en vez de estorbar?", causa: "El programa informático no avisaba o permitía seguir con datos incompletos" },
    { id: "q-equ3", eq: "tecnologia", q: "¿Hay mantenimiento y revisión periódica de los equipos y del material del puesto?", causa: "Sin revisión periódica del material o de los equipos" },
    { id: "q-nor1", eq: "tarea", q: "¿Existía un protocolo o procedimiento para esa situación, y era claro, actualizado y conocido?", causa: "Protocolo inexistente, poco claro, desactualizado o desconocido" },
    { id: "q-nor2", eq: "tarea", q: "¿El protocolo era aplicable en la práctica, con los medios y el personal reales?", causa: "El protocolo no se podía aplicar con los medios y el personal reales" },
    { id: "q-nor3", eq: "organizacion", q: "¿Estaba claro quién era responsable de cada tarea en cada turno?", causa: "La tarea no estaba asignada a ningún puesto" },
    { id: "q-nor4", eq: "tarea", q: "¿Los resultados y la información clínica necesarios estaban disponibles y eran fiables?", causa: "Resultados o información clínica no disponibles o poco fiables" },
    { id: "q-bar1", eq: "tarea", q: "¿Había barreras que detuvieran el error (comprobaciones, alertas, funciones forzadas) y funcionaron?", causa: "Las barreras no existían o no funcionaron" },
    { id: "q-bar2", eq: "organizacion", q: "¿Se había detectado antes este riesgo (notificaciones, auditorías, mapa de riesgos) y se actuó?", causa: "El riesgo ya se conocía y no se había actuado" },
    { id: "q-pac1", eq: "paciente", q: "¿Se tuvo en cuenta la situación del paciente (gravedad, edad, fragilidad, idioma, acompañamiento)?", causa: "No se tuvo en cuenta la situación especial del paciente" },
    { id: "q-org1", eq: "organizacion", q: "¿La cultura de la unidad facilita hablar de los riesgos y detener una actividad insegura?", causa: "Cuesta hablar de los riesgos o detener una actividad insegura" },
    { id: "q-org2", eq: "contexto", q: "¿La dirección conocía las necesidades de personal y de equipos de la unidad y las atendió?", causa: "Necesidades de personal o equipos conocidas y no atendidas" }
  ];

  // ---------- Ejemplos ----------
  // Ishikawa de la sala de espera: las causas son las de la figura del libro de los autores;
  // los votos, la comprobación y la acción, las de ese mismo caso. Caso ficticio.
  const causa = (id, cat, texto, o = {}) => Object.assign({ id, cat, espina: "", texto, porques: ["", "", "", "", ""], votos: 0, elegida: false, comprobacion: "", prueba: "" }, o, o.porques ? { porques: [...o.porques, "", "", "", "", ""].slice(0, 5) } : {});
  const ISH_SALA = {
    id: "ej-ish-sala", tipo: "ishikawa", titulo: "Reevaluación en la sala de espera", unidad: "Servicio de Urgencias (caso ficticio)", ambito: "hospital", fecha: "2027-02-10", responsable: "",
    problema: "En 7 de los 25 episodios revisados de pacientes con esperas superiores a 90 minutos no consta la reevaluación.",
    dato: "7 de 25 episodios (28 %); 5 de los 7, en el turno de noche", fuenteDato: "Auditoría de historias de enero",
    plantilla: "guia",
    causas: [
      causa("ej-c01", "personal", "Una enfermera menos de noche", { votos: 3 }),
      causa("ej-c02", "personal", "Eventuales sin formación en la sala", { votos: 2, porques: ["No hay plan de acogida para el personal eventual en la sala de espera"] }),
      causa("ej-c03", "procedimiento", "El protocolo no dice quién reevalúa", { votos: 8, elegida: true, comprobacion: "Leer el protocolo de sala de espera (apartado 3) y preguntar en dos noches a quién le toca.", prueba: "comprobada", porques: ["El protocolo se escribió cuando había una enfermera solo para la sala"] }),
      causa("ej-c04", "procedimiento", "No fija cada cuánto", { votos: 1 }),
      causa("ej-c05", "organizacion", "Sala y boxes con la misma enfermera", { votos: 11, elegida: true, comprobacion: "Auditoría de enero por turnos y observación directa de dos noches.", prueba: "comprobada", porques: ["La reevaluación no está asignada a ningún puesto", "De noche, la misma enfermera cubre la sala y los boxes, y los boxes siempre ganan"] }),
      causa("ej-c06", "organizacion", "Sin refuerzo en picos de gripe", { votos: 2 }),
      causa("ej-c07", "comunicacion", "El triaje no avisa del riesgo", { votos: 4 }),
      causa("ej-c08", "comunicacion", "Sin traspaso al cambio de turno", { votos: 2 }),
      causa("ej-c09", "equipamiento", "Sin aviso de tiempo de espera en pantalla", { votos: 6, elegida: true, comprobacion: "Revisar con informática qué muestra la pantalla de la sala.", prueba: "comprobada" }),
      causa("ej-c10", "entorno", "Sala sin visión desde el control", { votos: 3 }),
      causa("ej-c11", "entorno", "Ruido: no se oye la llamada", { votos: 1 }),
      causa("ej-c12", "paciente", "Mayores que no avisan si empeoran", { votos: 4 }),
      causa("ej-c13", "paciente", "Sin acompañante", { votos: 2 })
    ],
    acciones: [
      { id: "ej-a01", que: "Responsable fijo de la reevaluación de la sala de espera en cada turno, también de noche, con un aviso en la pantalla de la sala a los 90 minutos de espera.", categoria: "programa", causas: ["ej-c05", "ej-c03", "ej-c09"], responsable: "Supervisión de enfermería de Urgencias", plazo: "2027-03-01", estado: "curso",
        indicador: { nombre: "% de pacientes en espera reevaluados dentro de los 90 minutos", numerador: "Pacientes con espera de más de 90 minutos y reevaluación registrada en plazo", denominador: "Pacientes con espera de más de 90 minutos (muestra de 25 historias)", esperado: "≥ 90 %", fecha: "2027-05-15" }, nota: "Elegida por el equipo con el Modelo Horizonte." },
      { id: "ej-a02", que: "Actualizar el protocolo de sala de espera: quién reevalúa en cada turno y cada cuánto.", categoria: "norma", causas: ["ej-c03"], responsable: "Supervisión de enfermería de Urgencias", plazo: "2027-03-01", estado: "pendiente",
        indicador: { nombre: "Protocolo actualizado y difundido", numerador: "", denominador: "", esperado: "Sí", fecha: "2027-03-15" }, nota: "Débil por sí sola: acompaña a la primera." }
    ],
    notas: "Sesión de una hora con la técnica de grupo nominal. Caso ficticio.",
    creado: "2027-02-10T10:00:00.000Z", modificado: "2027-02-10T11:00:00.000Z"
  };

  // ACR de la paciente de la sala de espera con sepsis (caso ficticio del libro de los autores). Pasos 1 a 5;
  // las afirmaciones causales, las acciones y la información llegan con la entrega 3.
  const h = (id, hora, hecho, fuente, debia, o = {}) => Object.assign({ id, hora, hecho, fuente, debia, desajuste: false, bien: false }, o);
  const ACR_SEPSIS = {
    id: "ej-acr-sepsis", tipo: "acr", titulo: "Sepsis no detectada en la sala de espera", unidad: "Servicio de Urgencias (caso ficticio)", ambito: "hospital", fecha: "2027-01-14", responsable: "",
    incidente: { clase: "ea", fecha: "2027-01-12", fechaDecision: "2027-01-13", gravedad: "2", frecuencia: "2", conducta: "no", inmediata: { atendido: true, seguro: true, apartado: false, informado: true }, nota: "Notificado al sistema de notificación del centro la misma noche. Frecuencia «probable»: en la auditoría de enero, 7 de 25 pacientes esperaron más de 90 minutos sin reevaluación. El jefe de servicio habló con la familia al día siguiente." },
    descripcion: "Una paciente de 82 años, que acudió sola, fue triada con prioridad 3 hacia las ocho de la tarde de un martes de enero. En el triaje no se registró la temperatura y la alerta de sepsis no se activó. Permaneció casi tres horas en la sala de espera sin reevaluación. Cuando la llamaron a consulta tenía una sepsis grave e ingresó en la UCI.",
    problema: "Una paciente de 82 años, triada con prioridad 3, empeoró en la sala de espera sin que nadie la reevaluara durante casi tres horas y llegó a la consulta con una sepsis grave.",
    dato: "Tres horas sin reevaluación; triaje sin temperatura; alerta de sepsis no activada", fuenteDato: "Historia clínica y entrevistas",
    equipo: [
      { id: "ej-m1", perfil: "Responsable de seguridad del paciente", servicio: "Unidad de Calidad", papel: "coordina", implicado: false },
      { id: "ej-m2", perfil: "Médico de Medicina Interna", servicio: "Medicina Interna", papel: "experto", implicado: false },
      { id: "ej-m3", perfil: "Supervisora de otra unidad", servicio: "Hospitalización", papel: "otroNivel", implicado: false },
      { id: "ej-m4", perfil: "Técnica de calidad", servicio: "Unidad de Calidad", papel: "calidad", implicado: false },
      { id: "ej-m5", perfil: "Enfermera de triaje de otro hospital del área", servicio: "Urgencias (otro hospital)", papel: "experto", implicado: false }
    ],
    entrevistas: [
      { id: "ej-e1", perfil: "Enfermera de triaje de aquella noche", fecha: "2027-01-15", hecha: true, nota: "Seis boxes y la sala a la vez; el termómetro se había ido con otro paciente al box." },
      { id: "ej-e2", perfil: "Enfermera de sala de espera y boxes (turno de noche)", fecha: "2027-01-15", hecha: true, nota: "Nadie tiene asignada la reevaluación de noche; los boxes siempre ganan." },
      { id: "ej-e3", perfil: "Médico que atendió a la paciente en consulta", fecha: "2027-01-16", hecha: true, nota: "Al verla, cumplía criterios de sepsis grave; no había ningún aviso previo." },
      { id: "ej-e4", perfil: "Celador de la sala de espera", fecha: "2027-01-16", hecha: true, nota: "La paciente estaba sola y callada; no llamó a nadie." },
      { id: "ej-e5", perfil: "Familia de la paciente", fecha: "2027-01-19", hecha: true, nota: "Llegaron cuando ya estaba en la UCI. Agradecen que se les explique." }
    ],
    reuniones: [
      { id: "ej-r1", fecha: "2027-01-15", duracion: "1,5 h", nota: "Constituir el equipo, repartir entrevistas, primera cronología con la historia." },
      { id: "ej-r2", fecha: "2027-01-22", duracion: "2 h", nota: "Cronología definitiva, problemas en la atención, espinas." },
      { id: "ej-r3", fecha: "2027-02-05", duracion: "2 h", nota: "Afirmaciones causales y acciones." }
    ],
    cronologia: [
      h("ej-h1", "19:50", "La paciente llega sola a admisión y se registra.", "registro", "Registro y paso a triaje."),
      h("ej-h2", "20:05", "Triaje: prioridad 3. Se registran tensión, frecuencia cardiaca y saturación. No se registra la temperatura.", "historia", "Triaje con las cuatro constantes; con la temperatura, la alerta de sepsis se habría activado.", { desajuste: true }),
      h("ej-h3", "20:05", "El programa permite cerrar el triaje sin la temperatura. La alerta de sepsis no se activa.", "registro", "El programa no debería dejar cerrar el triaje con constantes incompletas.", { desajuste: true }),
      h("ej-h4", "20:10", "La paciente pasa a la sala de espera. Veinte pacientes esperando.", "entrevista", "Espera con reevaluación cada 90 minutos según el protocolo de sala de espera."),
      h("ej-h5", "21:35", "Cumplidos 90 minutos: no consta reevaluación.", "historia", "Reevaluación a los 90 minutos (protocolo, apartado 3).", { desajuste: true }),
      h("ej-h6", "22:30", "La enfermera de sala atiende los seis boxes; nadie mira la sala.", "entrevista", "Una persona con la reevaluación de la sala asignada."),
      h("ej-h7", "23:00", "La paciente sigue en la sala, más confusa. No avisa a nadie; está sola.", "entrevista", "Un acompañante o el personal habrían detectado el empeoramiento."),
      h("ej-h8", "23:05", "La llaman a consulta: fiebre alta, hipotensión, confusión. Criterios de sepsis grave.", "historia", "", { bien: true }),
      h("ej-h9", "23:20", "Se activa el protocolo de sepsis: cultivos, antibiótico y fluidos en los primeros 30 minutos.", "historia", "Protocolo de sepsis en la primera hora.", { bien: true }),
      h("ej-h10", "00:40", "Ingreso en la UCI.", "historia", "")
    ],
    problemasAtencion: [
      { id: "ej-p1", texto: "El triaje se cerró sin la temperatura y la alerta de sepsis no se activó", hechoId: "ej-h2" },
      { id: "ej-p2", texto: "La paciente no fue reevaluada durante casi tres horas", hechoId: "ej-h5" }
    ],
    plantilla: "guia",
    causas: [
      causa("ej-s01", "equipamiento", "El programa permite cerrar el triaje sin la temperatura", { espina: "ej-p1", votos: 9, elegida: true, prueba: "comprobada", comprobacion: "Comprobado con informática: ningún campo del triaje es obligatorio.", porques: ["No se definió ningún campo obligatorio al implantar el programa"] }),
      causa("ej-s02", "equipamiento", "Solo hay un termómetro en el triaje y se va con el paciente al box", { espina: "ej-p1", votos: 5, porques: ["Los demás se estropearon y nadie pidió reponerlos", "No hay una revisión periódica del material del triaje"] }),
      causa("ej-s03", "personal", "Presión asistencial: seis boxes y la sala a la vez", { espina: "ej-p1", votos: 4 }),
      causa("ej-s04", "comunicacion", "La alerta de sepsis depende de que las constantes estén completas", { espina: "ej-p1", votos: 3 }),
      causa("ej-s05", "organizacion", "La reevaluación de la sala de espera no está asignada a ningún puesto de noche", { espina: "ej-p2", votos: 11, elegida: true, prueba: "comprobada", comprobacion: "Auditoría de enero (5 de 7 incumplimientos de noche) y observación de dos noches.", porques: ["De noche, la misma enfermera cubre la sala y los boxes, y los boxes siempre ganan"] }),
      causa("ej-s06", "procedimiento", "El protocolo de sala de espera no dice quién reevalúa", { espina: "ej-p2", votos: 6, porques: ["Se escribió cuando había una enfermera solo para la sala"] }),
      causa("ej-s07", "equipamiento", "La pantalla de la sala no avisa del tiempo de espera", { espina: "ej-p2", votos: 5 }),
      causa("ej-s08", "paciente", "Paciente mayor, sola, que no podía avisar por sí misma", { espina: "ej-p2", votos: 7, elegida: true, prueba: "comprobada", comprobacion: "Entrevistas al celador y a la familia.", porques: ["Nadie sabe qué pacientes mayores esperan solos: el triaje no lo registra"] }),
      causa("ej-s09", "entorno", "La sala de espera no se ve desde el control", { espina: "ej-p2", votos: 3 }),
      causa("ej-s10", "organizacion", "Dos puestos (sala y boxes) los cubre la misma persona de noche", { espina: "", votos: 8, elegida: false, porques: [] }),
      causa("ej-s11", "comunicacion", "El triaje no avisa a la sala de los pacientes de riesgo", { espina: "", votos: 4 })
    ],
    preguntas: [{ id: "q-equ2", r: "no" }, { id: "q-nor3", r: "no" }, { id: "q-equ3", r: "no" }, { id: "q-pac1", r: "no" }, { id: "q-com1", r: "si" }, { id: "q-bar1", r: "no" }, { id: "q-fat1", r: "no" }, { id: "q-ent1", r: "no" }],
    acciones: [],
    notas: "Caso ficticio. Equipo formado en las primeras 72 horas; ninguno estaba de guardia aquella noche.",
    creado: "2027-01-13T10:00:00.000Z", modificado: "2027-02-05T12:00:00.000Z"
  };
  const EJEMPLOS = {
    analisis: [ISH_SALA, ACR_SEPSIS],
    fichas: [
      { t: "1. El problema", s: "Un hecho concreto y medible, con su dato", href: "#/analisis/ej-ish-sala/1" },
      { t: "2. La espina", s: "Trece causas en siete categorías", href: "#/analisis/ej-ish-sala/2" },
      { t: "3. Elegir y comprobar", s: "Votos, causas de fondo y datos", href: "#/analisis/ej-ish-sala/3" },
      { t: "4. Acciones y exportar", s: "La acción, su indicador y la espina para pegar", href: "#/analisis/ej-ish-sala/4" }
    ],
    fichasAcr: [
      { t: "1. ¿Hace falta un ACR?", s: "Evento adverso, SAC 1, cultura justa y plazos", href: "#/analisis/ej-acr-sepsis/1" },
      { t: "2. El problema", s: "Qué pasó, en una frase", href: "#/analisis/ej-acr-sepsis/2" },
      { t: "3. Equipo y plazos", s: "Cinco perfiles, cinco entrevistas, tres reuniones", href: "#/analisis/ej-acr-sepsis/3" },
      { t: "4. La cronología", s: "Lo que pasó frente a lo que debía pasar", href: "#/analisis/ej-acr-sepsis/4" },
      { t: "5. Las espinas", s: "Una por cada problema en la atención", href: "#/analisis/ej-acr-sepsis/5" }
    ]
  };

  const api = { TEMAS, GLOSARIO, TEMAS_TEST, TEST, PREGUNTAS, EJEMPLOS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.Contenido = api;
})(typeof window !== "undefined" ? window : globalThis);
