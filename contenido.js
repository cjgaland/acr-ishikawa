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
        "En sanidad se usan categorías adaptadas: <b>personal, procedimiento, organización, comunicación, equipamiento, entorno y paciente</b>. Hay otras: las del Protocolo de Londres, las de SEIPS o las 6M de la industria.",
        "Se hace <b>en equipo</b>, con una lluvia de ideas, y termina eligiendo las causas de fondo y <b>comprobándolas con datos</b>: una causa probable no es una causa demostrada."
      ],
      secciones: [
        { t: "Paso a paso", h: "<ol><li>Escribid el <b>problema</b> como un hecho concreto y medible (no «la sala de espera es un caos», sino «en 7 de los 25 episodios revisados con esperas de más de 90 minutos no consta la reevaluación»).</li><li>Dibujad la espina central y las <b>categorías</b>.</li><li>Con una lluvia de ideas (mejor primero en silencio, cada uno en sus tarjetas), apuntad las <b>causas posibles</b> en su categoría.</li><li>En cada causa, preguntad <b>«¿por qué?»</b> hasta llegar a algo que se pueda cambiar y medir.</li><li><b>Elegid</b> las causas más importantes (votad si hace falta) y decidid <b>cómo comprobarlas con datos</b>.</li></ol>" },
        { t: "Las categorías", h: "<p>La app trae cuatro juegos, y uno propio:</p><ul><li><b>Las siete de la guía</b> (por defecto): personal, procedimiento, organización, comunicación, equipamiento, entorno y paciente. Son las de los cursos de los autores y de la app AMFE.</li><li><b>Protocolo de Londres 2024</b>: paciente, profesional, tarea, equipo, entorno de trabajo, información y tecnología, organización y cultura, y contexto institucional. Para analizar un incidente clínico.</li><li><b>SEIPS</b>: persona(s), tareas, herramientas y tecnología, entorno interno, organización y entorno externo. El modelo de factores humanos que usa el NHS.</li><li><b>Las 6M</b>: mano de obra, métodos, máquinas, materiales, medición y medio ambiente. Para procesos no clínicos.</li></ul><p>Puedes cambiar de juego cuando quieras: la app propone a qué categoría va cada causa.</p>" },
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

  // ---------- Ejemplos ----------
  // Ishikawa de la sala de espera: las causas son las de la figura del libro de los autores;
  // los votos, la comprobación y la acción, las de ese mismo caso. Caso ficticio.
  const causa = (id, cat, texto, o = {}) => Object.assign({ id, cat, texto, porques: ["", "", "", "", ""], votos: 0, elegida: false, comprobacion: "", prueba: "" }, o, o.porques ? { porques: [...o.porques, "", "", "", "", ""].slice(0, 5) } : {});
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
  const EJEMPLOS = {
    analisis: [ISH_SALA],
    fichas: [
      { t: "1. El problema", s: "Un hecho concreto y medible, con su dato", href: "#/analisis/ej-ish-sala/1" },
      { t: "2. La espina", s: "Trece causas en siete categorías", href: "#/analisis/ej-ish-sala/2" },
      { t: "3. Elegir y comprobar", s: "Votos, causas de fondo y datos", href: "#/analisis/ej-ish-sala/3" },
      { t: "4. Acciones y exportar", s: "La acción, su indicador y la espina para pegar", href: "#/analisis/ej-ish-sala/4" }
    ]
  };

  const api = { TEMAS, GLOSARIO, TEMAS_TEST, TEST, EJEMPLOS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.Contenido = api;
})(typeof window !== "undefined" ? window : globalThis);
