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
      practica: { href: "#/analisis/ej-ish-sala/2", texto: "Ver los porqués del ejemplo" } },
    { n: 4, c: "A", titulo: "¿Cuándo hace falta un ACR?", sub: "Gravedad, frecuencia y una respuesta proporcionada",
      minuto: [
        "No todos los incidentes necesitan un análisis causa raíz: conviene un <b>criterio explícito</b>, según la gravedad y el riesgo de que se repita.",
        "El SiNASP usa la <b>matriz SAC</b>: cruza la gravedad (real o, en un casi incidente, la peor razonable) con la frecuencia, y da un nivel del 1 (riesgo extremo) al 4 (bajo).",
        "Riesgo extremo: <b>ACR</b>. Riesgo alto: <b>ACR simplificado</b> o algo parecido. Riesgo medio o bajo: <b>análisis agregado</b> con otros incidentes parecidos.",
        "El PSIRF del NHS insiste en lo mismo: una <b>respuesta proporcionada</b>, que va desde una revisión breve hasta una investigación completa."
      ],
      secciones: [
        { t: "La matriz SAC, paso a paso", h: "<ol><li>Gravedad: ¿qué daño causó? Si no llegó a causarlo, ¿qué es lo peor que razonablemente podría haber pasado?</li><li>Frecuencia: ¿cada cuánto puede repetirse aquí? Si hay datos (notificaciones, auditorías), úsalos; si no, la opinión de quien mejor lo conoce.</li><li>Cruza las dos en la matriz: el nivel dice qué tipo de análisis toca.</li></ol><p>Ojo: en el SiNASP el <b>1 es el más grave</b>. En el informe RCA² de Estados Unidos va al revés (3 es el más grave).</p>" },
        { t: "Antes de empezar", h: "<ul><li><b>Lo inmediato</b>: atender al paciente, dejar la situación segura, apartar los equipos implicados, informar a la familia.</li><li><b>Cultura justa</b>: lo delictivo o hecho a propósito para causar daño no va a un ACR.</li><li><b>Plazos</b>: empezar en 72 horas desde que se decide; terminar en 30 a 45 días.</li></ul>" }
      ],
      minicaso: "<p>A un paciente casi le operan de la rodilla equivocada: la enfermera lo detecta en la lista de verificación. No hubo daño, pero lo peor razonable es un daño permanente. Con una frecuencia «ocasional», la matriz da riesgo alto (SAC 2): merece al menos un ACR simplificado, aunque nadie sufriera daño.</p>",
      practica: { href: "#/analisis/ej-mini-lateralidad/1", texto: "Ver el minicaso" } },
    { n: 5, c: "P", titulo: "El análisis causa raíz, paso a paso", sub: "Del incidente a las acciones, sin buscar culpables",
      minuto: [
        "Un <b>equipo de 4 a 6 personas</b>, con expertos en el proceso y gente de distintos niveles. <b>Sin los implicados</b>: a ellos se les entrevista.",
        "<b>La cronología</b>: lo que pasó, hora a hora, frente a lo que debería haber pasado. Los desajustes son <b>problemas en la atención</b>.",
        "<b>Los factores contribuyentes</b>: un Ishikawa por problema, con las categorías de la guía, del Protocolo de Londres o de SEIPS.",
        "<b>Afirmaciones causales</b> con las cinco reglas, <b>acciones</b> según su fuerza, <b>medida</b> e <b>información</b> al paciente, la familia y los profesionales."
      ],
      secciones: [
        { t: "Los nueve pasos", h: "<ol><li>Decidir qué se analiza, con un criterio explícito.</li><li>Empezar pronto: en 72 horas.</li><li>Formar el equipo, sin los implicados.</li><li>Reconstruir lo que pasó: cronología y flujograma.</li><li>Identificar los factores que contribuyeron.</li><li>Escribir las afirmaciones causales.</li><li>Diseñar las acciones: al menos una fuerte o intermedia.</li><li>Medir si funcionan.</li><li>Informar a los profesionales y al paciente o la familia.</li></ol>" },
        { t: "Protocolo de Londres, RCA² y APEA", h: "<p>Son caminos parecidos. El <b>RCA²</b> (National Patient Safety Foundation, 2016) insiste en las acciones fuertes y su medida. El <b>Protocolo de Londres</b> (2004, nueva edición en 2024) mira todo el sistema con sus niveles de factores, separa los problemas en la atención y pide anotar también lo que salió bien. En España, el Ministerio de Sanidad llama a todos ellos <b>análisis en profundidad de eventos adversos (APEA)</b> y recomienda conservar el informe <b>anonimizado</b>.</p>" },
        { t: "Mirar todo el sistema", h: "<p>Vincent y colaboradores ordenaron los factores en siete niveles: paciente, tarea, profesional, equipo, entorno de trabajo, organización y gestión, y contexto institucional. SEIPS, el modelo de factores humanos, pone a la persona en el centro de su sistema de trabajo: tareas, herramientas y tecnología, entorno y organización. Los dos sirven para no quedarse en la persona que estaba allí.</p>" }
      ],
      minicaso: "<p>En la UGC de Atención Primaria, un paciente recibió dos veces el mismo antiagregante durante un mes: tras el alta quedaron activas la receta antigua y la nueva con otro nombre comercial. El ACR descartó enseguida el «despiste del médico»: no había ningún paso del circuito del alta en el que alguien revisara la medicación completa.</p>",
      practica: { href: "#/analisis/ej-acr-sepsis/1", texto: "Ver el ACR de la sepsis" } },
    { n: 6, c: "H", titulo: "Las cinco reglas de la causalidad", sub: "Afirmaciones causales que apuntan al sistema",
      minuto: [
        "Una <b>afirmación causal</b> une una causa con su efecto y con lo que pasó: «Como [causa], [efecto], lo que aumentó la probabilidad de [lo que pasó]».",
        "Las cinco reglas del informe RCA² (de las de los veteranos de Estados Unidos) evitan culpar y obligan a ser concretos.",
        "No es un ejercicio de gramática: una afirmación bien escrita «vende» por qué hace falta la acción."
      ],
      secciones: [
        { t: "Las cinco reglas, con ejemplos", h: "<ol><li><b>Mostrar la relación causa-efecto.</b> No: «la enfermera estaba cansada». Sí: «Como la enfermera cubría a la vez seis boxes y la sala, el deterioro de la paciente no se detectó durante tres horas».</li><li><b>Descripciones precisas, sin palabras vagas ni negativas</b> («mal», «inadecuado», «descuidado»). No: «el protocolo es deficiente». Sí: «el protocolo no dice quién reevalúa ni cada cuánto».</li><li><b>Todo error humano tiene una causa previa.</b> «La alerta de sepsis no saltó porque las constantes del triaje no estaban completas».</li><li><b>Saltarse un procedimiento no es una causa raíz</b>: explica por qué se lo saltaron. «El protocolo de reevaluación no se aplicaba porque no se había asignado a ningún puesto».</li><li><b>No actuar solo es causa si había obligación de actuar.</b> «No consta reevaluación, que el protocolo exige cada 90 minutos».</li></ol>" }
      ],
      minicaso: "<p>Primer borrador: «La enfermera fue descuidada y no reevaluó a la paciente». Incumple tres reglas (2, 1 y 5). Reescrita: «Como la reevaluación de la sala de espera no estaba asignada a ningún puesto en el turno de noche (protocolo, apartado 3), el deterioro de la paciente no se detectó durante tres horas».</p>",
      practica: { href: "#/analisis/ej-mini-culpa/6", texto: "Reescribir una afirmación" } },
    { n: 7, c: "V", titulo: "Acciones fuertes y cómo medirlas", sub: "Que el error sea difícil, no que la gente se acuerde",
      minuto: [
        "<b>Fuertes</b>: cambian el sistema y dependen poco de la memoria (función forzada en el programa, simplificar el proceso, estandarizar, cambiar el espacio).",
        "<b>Intermedias</b>: ayudan, pero aún dependen de las personas (listas de verificación, alertas, más personal en horas punta, redundancia).",
        "<b>Débiles</b>: formación, recordatorios, carteles, un procedimiento nuevo. Hacen falta a menudo, pero <b>solas rara vez bastan</b>.",
        "Cada acción con <b>un responsable</b> (una persona, no un comité), <b>plazo</b> e <b>indicador</b>: qué se mide, sobre qué total, qué nivel se espera y cuándo."
      ],
      secciones: [
        { t: "De débil a fuerte", h: "<p>La primera idea del equipo suele ser débil. Basta preguntar «¿y si cambiamos el proceso?»: «recordar que hay que tomar la temperatura» → «dos termómetros fijos en el puesto, revisión semanal del material y el campo obligatorio en el programa».</p>" },
        { t: "Medir en tres tiempos", h: "<ol><li>Que la acción <b>existe</b> (el campo obligatorio está puesto).</li><li>Que <b>se hace</b> como se previó (el 95 % de los triajes tiene las cuatro constantes).</li><li>Que <b>funciona</b>: el resultado cambia (menos sepsis detectadas tarde).</li></ol><p>No midas la eficacia contando incidentes notificados: si la gente notifica más, parecerá que va peor.</p>" },
        { t: "La dirección decide", h: "<p>El equipo propone las acciones más eficaces que se le ocurran, sin recortarse. La dirección decide si merecen la inversión, y solo ella puede aceptar el riesgo de no hacerlas.</p>" }
      ],
      minicaso: "<p>Tras dos caídas en el baño, el equipo propone una sesión de formación, un cartel y recordar a los pacientes que llamen. Las tres son débiles. Más fuerte: barras y timbre al alcance desde el inodoro, y una cama baja para los pacientes con riesgo.</p>",
      practica: { href: "#/analisis/ej-mini-caidas/4", texto: "Ver el minicaso de las caídas" } },
    { n: 8, c: "A", titulo: "Después del análisis: informar y apoyar", sub: "Devolver, acompañar y comprobar",
      minuto: [
        "Informar de las conclusiones a los <b>profesionales implicados</b> y al <b>paciente o su familia</b> forma parte del análisis, no es un trámite.",
        "El Protocolo de Londres de 2024 pide <b>implicar</b> al paciente y a la familia en la investigación y <b>apoyar</b> a todos tras el incidente.",
        "Los profesionales implicados son también víctimas (<b>segundas víctimas</b>): necesitan apoyo, no solo preguntas.",
        "Deja fecha para <b>revisar los indicadores</b>: si no funcionan, hay que buscar otra acción."
      ],
      secciones: [
        { t: "En el caso de la sepsis", h: "<p>El jefe de servicio habló con la familia al día siguiente: explicó lo que se sabía, lamentó lo ocurrido y prometió contarles las conclusiones, cosa que hizo un mes después. La supervisora apoyó a la enfermera del triaje durante el análisis.</p>" },
        { t: "Otras formas de aprender de los casos", h: "<ul><li><b>Sesiones de morbilidad y mortalidad</b>, centradas en el sistema.</li><li><b>Revisiones temáticas</b>: en lugar de un caso a fondo, muchos parecidos (todas las caídas del año) para encontrar patrones.</li></ul>" }
      ],
      minicaso: "<p>Un análisis terminado y archivado sin contárselo a nadie no cambia la cultura: la próxima vez, nadie notificará. Devolver en dos semanas qué se hizo con cada notificación es una de las formas más baratas de mejorar.</p>",
      practica: { href: "#/analisis/ej-acr-sepsis/8", texto: "Ver el cierre del caso de la sepsis" } }
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
    ["SiNASP", "Sistema de Notificación y Aprendizaje para la Seguridad del Paciente del Ministerio de Sanidad."],
    ["Barrera", "Lo que está pensado para detener un error o proteger del daño: una comprobación, una alerta, una función forzada. En el queso suizo, cada loncha."],
    ["Cronología", "Lo que pasó, hora a hora, reconstruido con la historia clínica, los registros y las entrevistas, y comparado con lo que debería haber pasado."],
    ["Desajuste", "Diferencia entre lo que pasó y lo que debería haber pasado. Es el punto de partida para buscar causas."],
    ["Entrevista", "Conversación con quien intervino o con el paciente o la familia para entender lo que pasó. Se hace con empatía, en privado y sin buscar culpables."],
    ["Evento centinela", "Evento adverso grave e inesperado (por ejemplo, una muerte evitable o una cirugía en el lado equivocado) que obliga a analizarlo a fondo."],
    ["Factores humanos", "Disciplina que estudia cómo encajan las personas con sus tareas, sus herramientas y su entorno, para diseñar sistemas en los que sea fácil hacerlo bien."],
    ["Indicador de proceso", "Mide si algo se hace (por ejemplo, el % de triajes con las cuatro constantes)."],
    ["Indicador de resultado", "Mide lo que le pasa al paciente (por ejemplo, las sepsis detectadas tarde)."],
    ["Lo que salió bien", "Lo que protegió al paciente o funcionó como debía. El Protocolo de Londres de 2024 pide anotarlo: enseña qué hay que conservar."],
    ["Preguntas desencadenantes", "Lista de preguntas que ayudan al equipo a no olvidar ninguna área (comunicación, formación, turnos, entorno y equipos, normas, barreras)."],
    ["Problema en la atención", "En el Protocolo de Londres, algo que se salió de los límites seguros en la atención y pudo influir en el resultado. Cada uno tiene sus factores."],
    ["PSIRF", "Marco de respuesta a los incidentes de seguridad del NHS de Inglaterra (2022): implicar a los afectados, mirar el sistema y responder de forma proporcionada."],
    ["Respuesta proporcionada", "Elegir el tipo de análisis según el riesgo y lo que se puede aprender: desde una revisión breve hasta un ACR completo."],
    ["Revisión temática", "Analizar juntos muchos incidentes parecidos para encontrar patrones, en lugar de uno solo a fondo."],
    ["Seis M", "Categorías clásicas del Ishikawa en la industria: mano de obra, métodos, máquinas, materiales, medición y medio ambiente."]
  ];

  // ---------- Ponte a prueba (las cinco del capítulo 8; las demás llegan en la entrega 4) ----------
  const TEMAS_TEST = { 1: { nom: "Ishikawa", aprende: 2 }, 2: { nom: "Análisis causa raíz", aprende: 5 }, 3: { nom: "Afirmaciones causales", aprende: 6 }, 4: { nom: "Acciones y medida", aprende: 7 } };
  const TEST = [
    { t: 1, q: "¿Cuál de estos es un problema bien definido para un Ishikawa?", o: ["«La sala de espera es un desastre».", "«Falta personal».", "«En 7 de 25 episodios con esperas de más de 90 minutos no consta la reevaluación».", "«Hay que contratar a una enfermera»."], ok: 2, e: "Un hecho concreto y medible. Las demás son opiniones o soluciones." },
    { t: 2, q: "«La enfermera se olvidó de reevaluar». Según las reglas de la causalidad, ¿qué falta?", o: ["Nada.", "La causa previa del olvido: el error humano tiene que tener una causa.", "El nombre de la enfermera.", "La sanción."], ok: 1, e: "Hay que explicar qué hizo posible el olvido (por ejemplo, que la tarea no estaba asignada)." },
    { t: 2, q: "¿Quién no debe formar parte del equipo de un análisis causa raíz?", o: ["Un experto en el proceso.", "Alguien de otro nivel de la organización.", "Los profesionales implicados en el incidente.", "Un representante de los pacientes ajeno al caso."], ok: 2, e: "Los implicados se entrevistan, pero no forman parte del equipo." },
    { t: 2, q: "¿Cuál es la acción más fuerte tras un incidente por constantes incompletas en el triaje?", o: ["Una sesión formativa.", "Un cartel.", "Que el programa no deje cerrar el triaje sin las constantes.", "Un recordatorio por correo."], ok: 2, e: "Una función forzada en el programa no depende de la memoria." },
    { t: 2, q: "¿Cuándo recomienda el informe RCA² empezar un análisis?", o: ["En el plazo de un año.", "En las 72 horas siguientes a decidir que hace falta.", "Cuando lo pida un juez.", "Solo si hay fallecimiento."], ok: 1, e: "En las 72 horas siguientes a reconocer que hace falta, y terminarlo en 30 a 45 días." },
    { t: 1, q: "En un Ishikawa, ¿qué va en la cabeza del pez?", o: ["La solución.", "El problema: el efecto que queremos explicar.", "La causa principal.", "El nombre del responsable."], ok: 1, e: "La cabeza es el efecto. Las causas posibles van en las espinas." },
    { t: 1, q: "¿Cuándo se para de preguntar «¿por qué?»?", o: ["Siempre a la quinta vez.", "Cuando aparece una persona a la que culpar.", "Cuando se llega a algo que el equipo puede cambiar y medir.", "A la primera respuesta."], ok: 2, e: "El cinco es orientativo: se para al llegar a algo que se puede cambiar y medir." },
    { t: 1, q: "El equipo ha elegido tres causas de fondo. ¿Qué toca antes de actuar?", o: ["Nada: si el equipo lo cree, es así.", "Comprobarlas con datos: una causa probable no es una causa demostrada.", "Votar otra vez.", "Pedir a la dirección que elija una."], ok: 1, e: "Hay que comprobarlas: revisar historias, observar, entrevistar, mirar un indicador." },
    { t: 1, q: "Para un proceso de almacén o de esterilización, ¿qué categorías del Ishikawa encajan mejor?", o: ["Las seis M (mano de obra, métodos, máquinas, materiales, medición, medio ambiente).", "Solo «paciente».", "Ninguna: el Ishikawa es solo clínico.", "Las del test de cultura de seguridad."], ok: 0, e: "Para procesos no clínicos o de soporte, las 6M de la industria funcionan bien." },
    { t: 2, q: "En la matriz SAC del SiNASP, ¿qué significa SAC 1?", o: ["Riesgo bajo.", "Riesgo extremo: toca un análisis causa raíz.", "Que no llegó al paciente.", "Que es el primer incidente del año."], ok: 1, e: "En el SiNASP, SAC 1 es el riesgo extremo (al revés que en el RCA²)." },
    { t: 2, q: "En un casi incidente, ¿cómo se puntúa la gravedad?", o: ["Siempre como mínima, porque no hubo daño.", "Con lo peor que razonablemente podría haber pasado.", "No se puntúa.", "Según lo que diga el implicado."], ok: 1, e: "Se usa el peor caso razonable: así se analizan a tiempo los riesgos graves." },
    { t: 2, q: "¿Qué es un «problema en la atención» en el Protocolo de Londres?", o: ["Una queja del paciente.", "Algo que se salió de los límites seguros en la atención y pudo influir en el resultado.", "Un fallo del programa informático.", "El nombre del responsable del turno."], ok: 1, e: "Cada problema en la atención se analiza con sus propios factores contribuyentes." },
    { t: 2, q: "¿Qué pide anotar el Protocolo de Londres de 2024 además de lo que falló?", o: ["El nombre de los implicados.", "Lo que salió bien.", "El coste del incidente.", "Nada más."], ok: 1, e: "Reconocer lo que salió bien enseña qué hay que conservar." },
    { t: 3, q: "«El manual de la bomba está mal escrito». ¿Qué regla incumple?", o: ["Ninguna.", "La 2: usa una palabra vaga («mal») en vez de describir qué tiene.", "La 5.", "La 4."], ok: 1, e: "Mejor: «el manual tiene letra de 8 puntos y ninguna ilustración, así que casi nadie lo usa»." },
    { t: 3, q: "«Los técnicos no siguieron el protocolo del TAC». ¿Qué falta?", o: ["Nada.", "Explicar por qué no lo siguieron: saltarse un procedimiento no es causa raíz.", "Sus nombres.", "La sanción."], ok: 1, e: "Ruido, confusión o presión de tiempo pueden ser la causa previa (regla 4)." },
    { t: 3, q: "«Nadie comprobó las órdenes urgentes cada media hora». ¿Cuándo es eso una causa?", o: ["Siempre.", "Solo si había una obligación previa de hacerlo (escrita y asignada).", "Nunca.", "Si hubo daño."], ok: 1, e: "Regla 5: no actuar solo es causa si había deber de actuar; si no lo había, la causa es que no estaba asignado." },
    { t: 4, q: "¿Cuál es la acción más débil?", o: ["Una función forzada en el programa.", "Simplificar el proceso.", "Una sesión de formación.", "Estandarizar el material."], ok: 2, e: "La formación depende de que la gente se acuerde: es débil, aunque a menudo necesaria." },
    { t: 4, q: "¿Quién debe ser el responsable de una acción?", o: ["El equipo de análisis.", "La comisión de seguridad.", "Una persona con autoridad para hacerla.", "Todo el personal."], ok: 2, e: "Si se reparte entre muchos, nadie responde de ella (RCA²)." },
    { t: 4, q: "¿Qué indicador dice mejor si funciona «responsable de la reevaluación con aviso a los 90 minutos»?", o: ["Número de incidentes notificados.", "% de pacientes en espera reevaluados dentro de los 90 minutos.", "Número de sesiones hechas.", "Número de carteles puestos."], ok: 1, e: "Mide lo que cambia, en cuántos de cuántos. Contar notificaciones engaña: si se notifica más, parece que va peor." },
    { t: 4, q: "Según el informe RCA², ¿qué debe tener cada análisis como mínimo?", o: ["Diez acciones.", "Al menos una acción fuerte o intermedia.", "Una sanción.", "Solo acciones de formación."], ok: 1, e: "Las débiles pueden acompañar, pero no bastan solas." }
  ];
  // Ejercicios prácticos: ¿qué regla incumple? y ¿qué fuerza tiene?
  const EJERCICIOS = {
    reglas: [
      { texto: "La enfermera de triaje fue descuidada.", regla: 2, e: "Juicio sobre la persona, sin describir las condiciones." },
      { texto: "El residente estaba cansado.", regla: 1, e: "No dice qué efecto tuvo ni qué pasó por ello." },
      { texto: "El médico se equivocó de dosis y el paciente recibió el doble.", regla: 3, e: "El error humano necesita su causa previa (por ejemplo, dosis muy juntas en la pantalla)." },
      { texto: "Enfermería no siguió el protocolo de caídas, lo que llevó a la caída.", regla: 4, e: "Hay que explicar por qué no se siguió." },
      { texto: "Nadie revisó la nevera de vacunas el fin de semana.", regla: 5, e: "¿Había alguien con esa tarea asignada? Si no, la causa es que no estaba asignada." },
      { texto: "La comunicación entre turnos era deficiente.", regla: 2, e: "«Deficiente» es vago: ¿qué faltaba? ¿Un traspaso estructurado? ¿Tiempo?" }
    ],
    fuerza: [
      { texto: "Que el programa no deje cerrar el triaje sin las cuatro constantes.", f: "fuerte" },
      { texto: "Una lista de verificación antes de la cirugía.", f: "intermedia" },
      { texto: "Un cartel recordando la higiene de manos.", f: "debil" },
      { texto: "Un solo modelo de bomba de perfusión en todo el hospital.", f: "fuerte" },
      { texto: "Una alerta del programa por interacciones entre fármacos.", f: "intermedia" },
      { texto: "Una sesión de formación sobre la reevaluación.", f: "debil" },
      { texto: "Repetir en voz alta los valores críticos de laboratorio.", f: "intermedia" },
      { texto: "Nueva instrucción: «revisad las vías cada 2 horas».", f: "debil" }
    ]
  };


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
    afirmaciones: [
      { id: "ej-f1", causaId: "ej-s01", texto: "Como el programa de triaje permitía cerrar sin la temperatura, la alerta de sepsis no se activó y la paciente recibió una prioridad menor de la que correspondía.", deber: "", pruebas: "Registro del triaje sin temperatura; comprobación con informática de que ningún campo es obligatorio." },
      { id: "ej-f2", causaId: "ej-s05", texto: "Como la reevaluación de la sala de espera no estaba asignada a ningún puesto en el turno de noche, el deterioro de la paciente no se detectó durante tres horas.", deber: "Protocolo de sala de espera, apartado 3 (reevaluación cada 90 minutos)", pruebas: "Auditoría de enero (5 de 7 incumplimientos de noche); entrevistas a las dos enfermeras del turno; observación de dos noches." },
      { id: "ej-f3", causaId: "ej-s08", texto: "Como la paciente no tenía acompañante y no podía avisar por sí misma, nadie alertó del empeoramiento.", deber: "", pruebas: "Entrevistas al celador y a la familia; el triaje no registra si el paciente viene solo." }
    ],
    acciones: [
      { id: "ej-x1", que: "Hacer obligatorias las cuatro constantes para cerrar el triaje: el programa no deja cerrar sin ellas (función forzada).", categoria: "forzada", causas: ["ej-s01"], responsable: "Jefe de servicio de Urgencias, con Informática", plazo: "2027-03-15", estado: "curso", controla: "servicio", direccion: "si", motivoDireccion: "",
        indicador: { nombre: "% de triajes con las cuatro constantes registradas", numerador: "Triajes con tensión, frecuencia cardiaca, saturación y temperatura registradas", denominador: "Todos los triajes del mes (dato del sistema)", esperado: "≥ 95 %", fecha: "2027-05-15", tipo: "sehace", resultado: "", alcanzado: "" }, nota: "Es la misma acción que el AMFE había propuesto para el fallo nº 10: el análisis proactivo y el reactivo llegaron al mismo punto débil." },
      { id: "ej-x2", que: "Asignar la reevaluación de la sala de espera a un puesto en cada turno, también de noche, con aviso automático en la pantalla de la sala a los 90 minutos.", categoria: "programa", causas: ["ej-s05"], responsable: "Supervisión de enfermería de Urgencias", plazo: "2027-03-01", estado: "curso", controla: "equipo", direccion: "si", motivoDireccion: "",
        indicador: { nombre: "% de pacientes en espera reevaluados dentro de los 90 minutos", numerador: "Pacientes con espera de más de 90 minutos y reevaluación registrada en plazo", denominador: "Pacientes con espera de más de 90 minutos (muestra de 25 historias)", esperado: "≥ 90 %", fecha: "2027-05-15", tipo: "funciona", resultado: "", alcanzado: "" }, nota: "" },
      { id: "ej-x3", que: "Identificar en el triaje a los pacientes mayores sin acompañante (cribado de fragilidad) y marcarlos en la pantalla de la sala para vigilarlos más.", categoria: "documentacion", causas: ["ej-s08"], responsable: "Supervisión de enfermería de Urgencias", plazo: "2027-03-15", estado: "pendiente", controla: "equipo", direccion: "si", motivoDireccion: "",
        indicador: { nombre: "% de mayores de 75 años con cribado de fragilidad en el triaje", numerador: "Mayores de 75 con cribado registrado", denominador: "Mayores de 75 triados (muestra)", esperado: "≥ 90 %", fecha: "2027-05-15", tipo: "sehace", resultado: "", alcanzado: "" }, nota: "" }
    ],
    informacion: { profesionales: "Sesión del servicio el 10 de febrero, por la responsable de seguridad; los cinco profesionales entrevistados, antes y en privado.", paciente: "El jefe de servicio habló con la familia al día siguiente del incidente y volvió a reunirse con ellos un mes después para contarles las conclusiones y lo que se ha cambiado.", direccion: "Informe a la dirección el 8 de febrero.", comision: "Comisión de seguridad del 15 de febrero, que hace el seguimiento de las acciones.", nota: "" },
    apoyo: { paciente: true, profesionales: true, nota: "La supervisora acompañó a la enfermera del triaje durante todo el análisis." },
    conclusiones: "El análisis de este evento adverso no encontró un culpable, sino tres factores del sistema que lo hicieron posible: un programa que permitía cerrar el triaje sin la temperatura, una reevaluación de la sala de espera sin responsable en el turno de noche y una paciente mayor y sola de la que nadie sabía que esperaba sin acompañante. Se proponen tres acciones (una fuerte y dos intermedias), con responsable, plazo e indicador; la primera coincide con la que el AMFE del servicio había propuesto por su cuenta. Las conclusiones se han compartido con los profesionales implicados y con la familia, y la comisión de seguridad revisará los indicadores en mayo.",
    proxRevision: "2027-05-15", verificacion: ["v-equipo", "v-72", "v-hechos", "v-reglas", "v-fuerte", "v-medida", "v-direccion", "v-familia", "v-prof", "v-apoyo", "v-anon", "v-seguimiento"],
    notas: "Caso ficticio. Equipo formado en las primeras 72 horas; ninguno estaba de guardia aquella noche.",
    creado: "2027-01-13T10:00:00.000Z", modificado: "2027-02-05T12:00:00.000Z"
  };

  // ---------- Minicasos (inventados, cortos: cada uno practica un paso) ----------
  const mc = (id, cat, texto, o = {}) => causa(id, cat, texto, o);
  const acc = (id, que, o = {}) => Object.assign({ id, que, categoria: "", causas: [], responsable: "", plazo: "", estado: "pendiente", indicador: { nombre: "", numerador: "", denominador: "", esperado: "", fecha: "" }, nota: "" }, o);
  const base = (id, tipo, titulo, o) => Object.assign({ id, tipo, titulo, unidad: "Caso inventado", ambito: "hospital", plantilla: "guia", causas: [], acciones: [], creado: "2027-03-01T10:00:00.000Z", modificado: "2027-03-01T10:00:00.000Z" }, o);
  const MINICASOS = [
    base("ej-mini-ap", "acr", "Doble antiagregante tras el alta", { ambito: "primaria", unidad: "UGC de Atención Primaria (caso inventado)",
      incidente: { clase: "ea", fecha: "2027-02-20", fechaDecision: "2027-02-21", gravedad: "3", frecuencia: "3", conducta: "no", inmediata: { atendido: true, seguro: true, apartado: false, informado: true }, nota: "" },
      problema: "Un paciente tomó dos veces el mismo antiagregante durante un mes porque, tras un alta hospitalaria, quedaron activas en la receta electrónica la prescripción antigua y la nueva con distinto nombre comercial.",
      dato: "Un mes con doble antiagregación; hematomas, sin ingreso", fuenteDato: "Historia clínica y receta electrónica",
      causas: [mc("ej-ap1", "procedimiento", "Ningún paso del circuito del alta revisa la medicación completa", { elegida: true, prueba: "comprobada", comprobacion: "Revisión del circuito del alta con la enfermera gestora de casos.", porques: ["El circuito se diseñó para las curas, no para la medicación"] }),
        mc("ej-ap2", "equipamiento", "La receta electrónica no avisa de dos fármacos con el mismo principio activo", { votos: 4 }),
        mc("ej-ap3", "personal", "Despiste del médico de familia", { porques: [""] }),
        mc("ej-ap4", "paciente", "El paciente no reconoce el nuevo nombre comercial", { votos: 3 })],
      acciones: [acc("ej-apx", "Cita de enfermería obligatoria en la semana siguiente a cada alta, con conciliación de la receta.", { causas: ["ej-ap1"], responsable: "Coordinación de enfermería de la UGC", plazo: "2027-04-01", indicador: { nombre: "% de altas con conciliación de la receta en 7 días", numerador: "Altas con conciliación registrada en 7 días", denominador: "Altas del mes", esperado: "≥ 90 %", fecha: "2027-06-01" } })] }),
    base("ej-mini-caidas", "ishikawa", "Caídas en el baño", { problema: "En el último trimestre se notificaron 6 caídas en el baño en la unidad de Medicina Interna, 4 de ellas de noche.", dato: "6 caídas; 4 de noche", fuenteDato: "Notificaciones",
      causas: [mc("ej-cd1", "entorno", "El timbre del baño no se alcanza desde el inodoro", { elegida: true, prueba: "comprobada", comprobacion: "Visita a los 12 baños de la unidad." }), mc("ej-cd2", "paciente", "Pacientes mayores con diuréticos que se levantan de noche", { elegida: true, prueba: "probable", comprobacion: "Revisar las 6 historias." }), mc("ej-cd3", "equipamiento", "Camas altas sin posibilidad de bajarlas"), mc("ej-cd4", "personal", "Poco personal de noche")],
      acciones: [acc("ej-cdx1", "Sesión de formación sobre prevención de caídas.", { causas: ["ej-cd2"], responsable: "Supervisión de la unidad", plazo: "2027-04-15" }), acc("ej-cdx2", "Cartel en el baño: «Llame antes de levantarse».", { causas: ["ej-cd1"], responsable: "Supervisión de la unidad", plazo: "2027-04-01" }), acc("ej-cdx3", "Recordar a los pacientes que pidan ayuda por la noche.", { causas: ["ej-cd2"], responsable: "El equipo", plazo: "2027-04-01" })] }),
    base("ej-mini-lateralidad", "acr", "Casi cirugía en la rodilla equivocada", {
      incidente: { clase: "casi", fecha: "2027-03-02", fechaDecision: "", gravedad: "", frecuencia: "", conducta: "", inmediata: { atendido: false, seguro: false, apartado: false, informado: false }, nota: "La enfermera circulante lo detectó al leer la lista de verificación en voz alta." },
      problema: "Un paciente citado para artroscopia de la rodilla derecha llegó a quirófano con la izquierda marcada; se detectó en la lista de verificación antes de la incisión." }),
    base("ej-mini-culpa", "acr", "Una afirmación que culpa", { problema: "Un paciente con dolor torácico esperó 50 minutos en la sala sin electrocardiograma, que el protocolo exige en 10.",
      incidente: { clase: "sindano", fecha: "2027-02-10", fechaDecision: "2027-02-11", gravedad: "6", frecuencia: "2", conducta: "no", inmediata: { atendido: true, seguro: true, apartado: false, informado: true }, nota: "" },
      causas: [mc("ej-cu1", "organizacion", "El electrocardiograma del triaje lo hace quien esté libre", { elegida: true, prueba: "comprobada", comprobacion: "Entrevistas y revisión del protocolo.", porques: ["No está asignado a ningún puesto"] })],
      afirmaciones: [{ id: "ej-cuf", causaId: "ej-cu1", texto: "La enfermera fue descuidada y no hizo el electrocardiograma a tiempo.", deber: "", pruebas: "" }] }),
    base("ej-mini-esteril", "ishikawa", "Instrumental incompleto", { plantilla: "m6", unidad: "Central de esterilización (caso inventado)",
      problema: "En marzo, en 4 de las 120 cajas de instrumental de traumatología faltaba una pieza al abrirlas en quirófano.", dato: "4 de 120 cajas (3 %)", fuenteDato: "Registro de incidencias de quirófano",
      causas: [mc("ej-es1", "metodos", "La lista de contenido de la caja no tiene fotos"), mc("ej-es2", "materiales", "Piezas pequeñas que se quedan en la cesta de lavado", { porques: ["La cesta tiene la malla demasiado abierta"] }), mc("ej-es3", "manoObra", "Personal nuevo en el montaje de cajas"), mc("ej-es4", "medicion", "No se cuenta el instrumental al cerrar la caja")] }),
    base("ej-mini-personal", "ishikawa", "«Falta de personal»", { problema: "En el último mes, 12 de 40 pacientes de la planta no tenían registrada la valoración del dolor del turno de tarde.", dato: "12 de 40 (30 %)", fuenteDato: "Auditoría de historias",
      causas: [mc("ej-pe1", "personal", "Falta de personal"), mc("ej-pe2", "personal", "Falta de formación"), mc("ej-pe3", "procedimiento", "Falta de protocolo"), mc("ej-pe4", "comunicacion", "Mala comunicación")] })
  ];
  const FICHAS_MINI = [
    { t: "Doble antiagregante tras el alta", s: "Atención Primaria: un ACR que descarta el «despiste del médico». Paso 7: la acción fuerte.", href: "#/analisis/ej-mini-ap/7" },
    { t: "Caídas en el baño", s: "Tres acciones, las tres débiles. Mira los avisos del paso 4 y busca una más fuerte.", href: "#/analisis/ej-mini-caidas/4" },
    { t: "Casi cirugía en la rodilla equivocada", s: "Un casi incidente sin daño. Paso 1: ¿hace falta un ACR? Puntúa la gravedad por el peor caso.", href: "#/analisis/ej-mini-lateralidad/1" },
    { t: "Una afirmación que culpa", s: "«La enfermera fue descuidada…». Paso 6: reescríbela con las cinco reglas.", href: "#/analisis/ej-mini-culpa/6" },
    { t: "Instrumental incompleto", s: "Un proceso de soporte con las 6M. Paso 2: completa la espina.", href: "#/analisis/ej-mini-esteril/2" },
    { t: "«Falta de personal»", s: "Cuatro causas que no son el final. Paso 2: pregunta «¿por qué?».", href: "#/analisis/ej-mini-personal/2" }
  ];
  const EJEMPLOS = {
    analisis: [ISH_SALA, ACR_SEPSIS, ...MINICASOS], minicasos: FICHAS_MINI,
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
      { t: "5. Las espinas", s: "Una por cada problema en la atención", href: "#/analisis/ej-acr-sepsis/5" },
      { t: "6. Afirmaciones causales", s: "Las tres del caso, con las cinco reglas", href: "#/analisis/ej-acr-sepsis/6" },
      { t: "7. Acciones y medida", s: "Una fuerte y dos intermedias, con su indicador", href: "#/analisis/ej-acr-sepsis/7" },
      { t: "8. Informar y cerrar", s: "Profesionales, familia, apoyo y conclusiones", href: "#/analisis/ej-acr-sepsis/8" },
      { t: "El informe", s: "Todo en una vista imprimible", href: "#/analisis/ej-acr-sepsis/8?informe=1" }
    ]
  };

  const api = { TEMAS, GLOSARIO, TEMAS_TEST, TEST, EJERCICIOS, PREGUNTAS, EJEMPLOS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.Contenido = api;
})(typeof window !== "undefined" ? window : globalThis);
