// ============================================================
//  logic.js — Lógica PURA (sin DOM) · ACR · Ishikawa
//  Modelo de un análisis (Ishikawa rápido o análisis causa raíz), plantillas
//  de categorías de la espina (guía, Protocolo de Londres 2024, SEIPS, 6M,
//  propia) y paso de una a otra, causas con sus «¿por qué?», votos y
//  comprobación con datos, acciones con la jerarquía de fuerza del RCA²,
//  indicador de cada acción, matriz SAC del SiNASP, avisos didácticos por
//  paso, progreso, paquete de intercambio «acrishikawa-analisis», documentos
//  (lista de bloques para Word y PDF), hojas de Excel, saneado y fusión.
//  Fuentes en Diseño/DISEÑO_ACR_ISHIKAWA.md (sección 3).
//  window.Logica en navegador y module.exports en Node (tests).
// ============================================================
(function (raiz) {
  "use strict";

  const VERSION_DATOS = 1;
  // [eco]
  const URL_AUD = "https://cjgaland.github.io/auditorias/";
  const URL_IND = "https://cjgaland.github.io/indicadores-calidad/";
  const URL_TM = "https://cjgaland.github.io/tamano-muestral/";
  const URL_AMFE = "https://cjgaland.github.io/amfe/";
  const URL_FLUJO = "https://cjgaland.github.io/flujograma/";
  const URL_DAFO = "https://cjgaland.github.io/dafo/";
  const URL_MAPA = "https://cjgaland.github.io/mapa-riesgos/";
  const URL_RONDAS = "https://cjgaland.github.io/rondas-seguridad/";
  const URL_LC = "https://cjgaland.github.io/lectura-critica/";
  const URL_ANON = "https://cjgaland.github.io/anonimizador-rgpd-web/";
  // [/eco]

  // ---------- Utilidades ----------
  const lleno = v => v != null && String(v).trim() !== "";
  const sinTildes = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const num = v => { if (typeof v === "number") return v; const s = String(v == null ? "" : v).trim().replace(/\s/g, "").replace(",", "."); return s === "" || isNaN(s) ? NaN : Number(s); };
  const corto = (s, n = 60) => { s = String(s || "").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s || "sin nombre"; };
  const normal = s => sinTildes(s).replace(/[^a-z0-9ñ ]/g, " ").replace(/\s+/g, " ").trim();
  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
  const listaY = l => l.length > 1 ? l.slice(0, -1).join(", ") + " y " + l[l.length - 1] : l.join("");
  const fmtFecha = v => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v || "").trim()); return m ? `${m[3]}/${m[2]}/${m[1]}` : String(v || ""); };
  const limpia = t => String(t || "").trim().replace(/[.;]$/, "");

  // ---------- Plantillas de categorías de la espina ----------
  // «eq» = idea común, para pasar las causas de una plantilla a otra (ver equivalencia)
  const PLANTILLAS = {
    guia: { nom: "Las siete de la guía", corto: "Guía", que: "Las de los cursos de los autores y de la app AMFE. Sirven para casi cualquier problema sanitario.",
      cats: [
        { k: "personal", nom: "Personal", eq: "persona", que: "¿Formación, experiencia, carga de trabajo, cansancio, rotación?" },
        { k: "procedimiento", nom: "Procedimiento", eq: "tarea", que: "¿Hay protocolo? ¿Está claro, actualizado, se conoce, es aplicable?" },
        { k: "organizacion", nom: "Organización", eq: "organizacion", que: "¿Quién es responsable? ¿Cómo se reparten las tareas y los turnos?" },
        { k: "comunicacion", nom: "Comunicación", eq: "equipo", que: "¿Cómo pasa la información entre personas, turnos y servicios?" },
        { k: "equipamiento", nom: "Equipamiento", eq: "tecnologia", que: "¿Funcionan los equipos y el programa informático? ¿Ayudan o estorban?" },
        { k: "entorno", nom: "Entorno", eq: "entorno", que: "¿Espacio, ruido, luz, distancias, interrupciones?" },
        { k: "paciente", nom: "Paciente", eq: "paciente", que: "¿Edad, gravedad, capacidad de comunicarse, acompañamiento?" }
      ] },
    vincent: { nom: "Vincent y Protocolo de Londres (7 niveles)", corto: "Vincent", que: "Los siete niveles de factores contribuyentes de Vincent y colaboradores (BMJ, 1998), base del Protocolo de Londres de 2004. Para analizar un incidente clínico mirando todo el sistema.",
      cats: [
        { k: "paciente", nom: "Paciente", eq: "paciente", que: "Estado (complejidad y gravedad), idioma y comunicación, personalidad y factores sociales." },
        { k: "tarea", nom: "Tarea", eq: "tarea", que: "Diseño de la tarea y claridad de su estructura, protocolos disponibles y usados, pruebas disponibles y fiables." },
        { k: "profesional", nom: "Profesional", eq: "persona", que: "Conocimientos y habilidades, motivación, salud física y mental." },
        { k: "equipo", nom: "Equipo", eq: "equipo", que: "Comunicación oral y escrita, supervisión y pedir ayuda, estructura del equipo." },
        { k: "entorno", nom: "Entorno de trabajo", eq: "entorno", que: "Plantilla y combinación de perfiles, carga y turnos, equipos (diseño, disponibilidad, mantenimiento), apoyo administrativo y de gestión." },
        { k: "organizacion", nom: "Organización y gestión", eq: "organizacion", que: "Recursos y límites económicos, estructura de la organización, políticas, normas y objetivos, cultura de seguridad y prioridades." },
        { k: "contexto", nom: "Contexto institucional", eq: "contexto", que: "Contexto económico y normativo, servicio de salud, relación con otras organizaciones." }
      ] },
    londres: { nom: "Protocolo de Londres 2024 (8 niveles)", corto: "Londres 2024", que: "Los ocho niveles de la edición de 2024 del Protocolo de Londres: los siete de Vincent, con la información y la tecnología aparte y la cultura junto a la organización.",
      cats: [
        { k: "paciente", nom: "Paciente", eq: "paciente", que: "Enfermedad (complejidad y gravedad), idioma y comunicación, personalidad y factores sociales." },
        { k: "profesional", nom: "Profesional", eq: "persona", que: "Conocimientos y habilidades, competencia, salud física y mental, valores y conducta profesional." },
        { k: "tarea", nom: "Tarea", eq: "tarea", que: "Diseño de la tarea y claridad de su estructura, protocolos disponibles y usados, pruebas disponibles y fiables." },
        { k: "equipo", nom: "Equipo", eq: "equipo", que: "Comunicación oral y escrita, supervisión y pedir ayuda, estructura del equipo, conciencia de la situación compartida, apoyo mutuo." },
        { k: "entorno", nom: "Entorno de trabajo", eq: "entorno", que: "Plantilla y combinación de perfiles, carga y turnos, equipos (diseño, disponibilidad, mantenimiento), apoyo administrativo, entorno físico, demoras." },
        { k: "tecnologia", nom: "Información y tecnología", eq: "tecnologia", que: "Sistemas de información electrónica: aparatos y programas, ayudas a la decisión, interfaz persona-máquina, integración en el trabajo, protección de datos." },
        { k: "organizacion", nom: "Organización y cultura", eq: "organizacion", que: "Recursos y límites económicos, estructura de la organización, formación, políticas y objetivos, cultura de seguridad y prioridades." },
        { k: "contexto", nom: "Contexto institucional", eq: "contexto", que: "Contexto económico y normativo, política sanitaria, entorno político, relación con otras organizaciones." }
      ] },
    seips: { nom: "SEIPS (sistema de trabajo)", corto: "SEIPS", que: "Los seis elementos del sistema de trabajo del modelo SEIPS, el que usa el NHS (PSIRF). La persona en el centro.",
      cats: [
        { k: "persona", nom: "Persona(s)", eq: "persona", que: "Quien hace el trabajo (profesionales, paciente, familia): capacidades, formación, experiencia, cansancio, salud." },
        { k: "tareas", nom: "Tareas", eq: "tarea", que: "Qué hay que hacer: dificultad, complejidad, variedad, tiempo, interrupciones." },
        { k: "herramientas", nom: "Herramientas y tecnología", eq: "tecnologia", que: "Aparatos, programas, material: ¿están, funcionan, son fáciles de usar?" },
        { k: "entornoInt", nom: "Entorno físico", eq: "entorno", que: "Espacio, distribución, luz, ruido, temperatura." },
        { k: "organizacion", nom: "Condiciones de la organización", eq: "organizacion", que: "Turnos, plantilla, trabajo en equipo, cultura, supervisión, formación." },
        { k: "entornoExt", nom: "Entorno externo", eq: "contexto", que: "Normas, financiación, presión social y política, otras organizaciones." }
      ] },
    m6: { nom: "Las 6M (procesos no clínicos)", corto: "6M", que: "Las seis M clásicas de la industria. Para procesos de soporte: almacén, lavandería, citación, mantenimiento.",
      cats: [
        { k: "manoObra", nom: "Mano de obra", eq: "persona", que: "¿Quién lo hace? ¿Formación, experiencia, carga, cansancio?" },
        { k: "metodos", nom: "Métodos", eq: "tarea", que: "¿Cómo se hace? ¿Hay procedimiento? ¿Es claro y se sigue?" },
        { k: "maquinas", nom: "Máquinas", eq: "tecnologia", que: "¿Funcionan los equipos y el programa? ¿Mantenimiento?" },
        { k: "materiales", nom: "Materiales", eq: "material", que: "¿Llega a tiempo, en cantidad y en buen estado lo que se usa?" },
        { k: "medicion", nom: "Medición", eq: "medicion", que: "¿Cómo se comprueba? ¿El dato es fiable? ¿Se mide lo que importa?" },
        { k: "medio", nom: "Medio ambiente", eq: "entorno", que: "¿Espacio, ruido, temperatura, interrupciones?" }
      ] },
    propia: { nom: "Propia", corto: "Propia", que: "Hasta ocho categorías con el nombre que elija el equipo.", cats: [] }
  };
  // Si en la plantilla de destino no hay una categoría con la misma idea, se prueba con estas
  const EQ_ALTERNATIVA = { paciente: ["persona"], persona: ["paciente"], equipo: ["organizacion", "persona"], tecnologia: ["material", "entorno"], material: ["tecnologia"], medicion: ["tarea"], contexto: ["organizacion", "entorno"], organizacion: ["tarea"], tarea: ["organizacion"], entorno: ["organizacion"] };
  const MAX_PROPIAS = 8;
  function categorias(a) {
    if (a.plantilla === "propia") return a.categoriasPropias.map((n, i) => ({ k: "p" + i, nom: n, eq: "", que: "" })).filter(c => lleno(c.nom));
    return (PLANTILLAS[a.plantilla] || PLANTILLAS.guia).cats;
  }
  const categoria = (a, k) => categorias(a).find(c => c.k === k) || null;
  const nombreCat = (a, k) => { const c = categoria(a, k); return c ? c.nom : "Sin categoría"; };
  // A qué categoría de la plantilla «destino» iría una causa de la categoría «k» de la plantilla «origen»
  function equivalencia(origen, k, destino, propiasDestino) {
    if (origen === destino) return k;
    if (destino === "propia") { const P = (propiasDestino || []).map((n, i) => lleno(n) ? "p" + i : "").filter(Boolean); const i = (PLANTILLAS[origen] ? PLANTILLAS[origen].cats.findIndex(c => c.k === k) : Number(String(k).slice(1))); return P[Math.max(0, i)] || P[0] || ""; }
    const D = PLANTILLAS[destino].cats, c = PLANTILLAS[origen] ? PLANTILLAS[origen].cats.find(x => x.k === k) : null;
    if (!c) return D[0].k;
    for (const eq of [c.eq, ...(EQ_ALTERNATIVA[c.eq] || [])]) { const d = D.find(x => x.eq === eq); if (d) return d.k; }
    return D[0].k;
  }
  // Propuesta de reparto al cambiar de plantilla: [{ causaId, de, a }]
  function propuestaCambio(a, destino, propiasDestino) {
    return a.causas.map(x => ({ causaId: x.id, de: x.cat, a: equivalencia(a.plantilla, x.cat, destino, propiasDestino) }));
  }
  function cambiarPlantilla(a, destino, propiasDestino, reparto) {
    const R = new Map((reparto || propuestaCambio(a, destino, propiasDestino)).map(r => [r.causaId, r.a]));
    if (destino === "propia" && propiasDestino) a.categoriasPropias = Array.from({ length: MAX_PROPIAS }, (_, i) => propiasDestino[i] || "");
    a.plantilla = destino;
    const validas = new Set(categorias(a).map(c => c.k));
    a.causas.forEach(x => { const n = R.get(x.id); x.cat = validas.has(n) ? n : (categorias(a)[0] || { k: "" }).k; });
    return a;
  }

  // ---------- Fábricas ----------
  const TIPOS = { ishikawa: { nom: "Ishikawa", que: "Buscar las causas de un problema" }, acr: { nom: "Análisis causa raíz", que: "Analizar un incidente" } };
  const MAX_PORQUES = 5;
  function nuevoAnalisis(id, fecha, tipo = "ishikawa") {
    return {
      id, tipo: TIPOS[tipo] ? tipo : "ishikawa", titulo: "", unidad: "", ambito: "hospital", fecha: "", responsable: "",
      // ACR, paso 1
      incidente: { clase: "", fecha: "", fechaDecision: "", gravedad: "", frecuencia: "", conducta: "", inmediata: { atendido: false, seguro: false, apartado: false, informado: false }, nota: "" },
      // Problema
      descripcion: "", problema: "", dato: "", fuenteDato: "",
      // Equipo y plazos (ACR)
      equipo: [], entrevistas: [], reuniones: [],
      // Cronología (ACR)
      cronologia: [], problemasAtencion: [],
      // Espina
      plantilla: "guia", categoriasPropias: Array(MAX_PROPIAS).fill(""), causas: [], efectoPrincipal: "", preguntas: [],
      // Afirmaciones, acciones e información (ACR)
      afirmaciones: [], acciones: [],
      informacion: { profesionales: "", paciente: "", direccion: "", comision: "", nota: "" }, apoyo: { paciente: false, profesionales: false, nota: "" }, verificacion: [],
      conclusiones: "", proxRevision: "", notas: "", origen: "",
      creado: fecha, modificado: fecha
    };
  }
  function nuevaCausa(id, cat = "", espina = "") { return { id, cat, espina, texto: "", porques: Array(MAX_PORQUES).fill(""), votos: 0, elegida: false, comprobacion: "", prueba: "" }; }
  const nuevoIndicador = () => ({ nombre: "", numerador: "", denominador: "", esperado: "", fecha: "", tipo: "", resultado: "", alcanzado: "" });
  function nuevaAccion(id) { return { id, que: "", categoria: "", causas: [], responsable: "", plazo: "", estado: "pendiente", indicador: nuevoIndicador(), nota: "", controla: "", direccion: "", motivoDireccion: "" }; }
  const nuevoMiembro = id => ({ id, perfil: "", servicio: "", papel: "miembro", implicado: false });
  const nuevaEntrevista = id => ({ id, perfil: "", fecha: "", hecha: false, nota: "" });
  const nuevaReunion = id => ({ id, fecha: "", duracion: "", nota: "" });
  const nuevoHecho = id => ({ id, hora: "", hecho: "", fuente: "", debia: "", desajuste: false, bien: false });
  const nuevoProblemaAt = id => ({ id, texto: "", hechoId: "" });
  const nuevaAfirmacion = id => ({ id, causaId: "", texto: "", deber: "", pruebas: "" });

  // ---------- Las causas ----------
  // La causa de fondo de una causa: el último «¿por qué?» contestado (o la propia causa)
  const causaFondo = x => [...x.porques].reverse().find(lleno) || x.texto;
  const causasCon = a => a.causas.filter(x => lleno(x.texto));
  // Las causas de una categoría en una espina ("" = la principal; si no, el id de un problema en la atención)
  const causasDe = (a, k, espina) => a.causas.filter(x => x.cat === k && (espina === undefined || (x.espina || "") === espina));
  const elegidas = a => causasCon(a).filter(x => x.elegida);
  const ESTADOS_PRUEBA = { "": "Sin comprobar", probable: "Probable", comprobada: "Comprobada con datos", descartada: "Descartada" };
  // Ranking por votos (a igual número de votos, primero las elegidas y luego por orden de escritura)
  function ranking(a) {
    const C = causasCon(a), pos = new Map(C.map((x, i) => [x.id, i]));
    return C.slice().sort((p, q) => (q.votos || 0) - (p.votos || 0) || (q.elegida - p.elegida) || pos.get(p.id) - pos.get(q.id));
  }
  // Número de cada causa elegida en el dibujo (1, 2, 3… en el orden del ranking)
  function numerosElegidas(a) { const r = {}; ranking(a).filter(x => x.elegida).forEach((x, i) => { r[x.id] = i + 1; }); return r; }

  // ---------- Fuerza de las acciones (jerarquía del RCA², figura 3; Joint Commission, tabla A-2) ----------
  const FUERZAS = {
    fuerte: { nom: "Fuerte", que: "Cambia el sistema y depende poco de que alguien se acuerde." },
    intermedia: { nom: "Intermedia", que: "Ayuda a hacerlo bien, pero aún depende en parte de las personas." },
    debil: { nom: "Débil", que: "Depende de que alguien se acuerde de hacerlo. Útil como complemento, no sola." }
  };
  const JERARQUIA = {
    espacio: { f: "fuerte", nom: "Cambio en el espacio físico", ej: "Cambiar una puerta giratoria por una corredera para evitar caídas." },
    dispositivo: { f: "fuerte", nom: "Nuevo aparato probado en su uso real", ej: "Elegir el glucómetro tras probar con usuarios cuál se maneja mejor." },
    forzada: { f: "fuerte", nom: "Función forzada o barrera técnica", ej: "Que el programa no deje cerrar el triaje sin las constantes; conexiones que solo encajan de la forma correcta." },
    simplificar: { f: "fuerte", nom: "Simplificar el proceso", ej: "Quitar pasos que no aportan." },
    estandarizar: { f: "fuerte", nom: "Estandarizar equipos o procesos", ej: "Un solo modelo de bomba de perfusión en todo el hospital; código de barras en la administración." },
    direccion: { f: "fuerte", nom: "Implicación tangible de la dirección", ej: "Comprar el equipo necesario; equilibrar plantilla y carga de trabajo." },
    redundancia: { f: "intermedia", nom: "Redundancia", ej: "Dos enfermeras calculan por separado la dosis de un medicamento de alto riesgo." },
    plantilla: { f: "intermedia", nom: "Más personal o menos carga", ej: "Personal de refuerzo en las horas punta." },
    programa: { f: "intermedia", nom: "Mejoras del programa informático", ej: "Alertas de interacciones; aviso automático a los 90 minutos de espera." },
    distracciones: { f: "intermedia", nom: "Quitar distracciones", ej: "Una zona tranquila para preparar la medicación." },
    simulacion: { f: "intermedia", nom: "Formación con simulación y repasos periódicos", ej: "Practicar el traspaso de pacientes en simulación, con análisis posterior." },
    lista: { f: "intermedia", nom: "Lista de verificación o ayuda cognitiva", ej: "Lista de verificación quirúrgica; lista para reprocesar endoscopios." },
    parecidos: { f: "intermedia", nom: "Separar lo que se parece o suena igual", ej: "No guardar juntos medicamentos de envase parecido." },
    comunicacion: { f: "intermedia", nom: "Comunicación estandarizada", ej: "Repetir en voz alta los valores críticos; traspaso con formato fijo." },
    documentacion: { f: "intermedia", nom: "Mejor documentación o rotulado", ej: "Resaltar el nombre y la dosis en la bolsa de suero." },
    doblechequeo: { f: "debil", nom: "Doble comprobación", ej: "Una persona calcula la dosis y otra revisa el cálculo." },
    avisos: { f: "debil", nom: "Avisos, carteles y alarmas", ej: "Un cartel de precaución; una alarma sonora." },
    norma: { f: "debil", nom: "Nuevo procedimiento, norma o recordatorio", ej: "«Recordad revisar las vías cada 2 horas»." },
    formacion: { f: "debil", nom: "Formación", ej: "Una sesión sobre el uso de un aparato difícil." }
  };
  // Cuando no se elige la categoría, se intenta adivinar por el texto (como fuerzaMedida de Auditorías)
  const PISTAS = [
    ["forzada", /no (se )?(puede|deja|permit)|campo obligatori|obligatori[oa] (para|en el programa)|bloque(a|e|o)|impid|funcion forzad|forzad|conexion(es)? que solo/],
    ["espacio", /obra|reform|mampar|puerta|ventan|redistribu|espacio fisico|visibilidad desde|camara|mover el (control|puesto)/],
    ["estandarizar", /estandariz|codigo de barras|mismo modelo|unific|kit|carro (unico|estandar)|cita (de \w+ )?obligatori|paso obligatorio en el circuito/],
    ["simplificar", /simplific|eliminar (el )?paso|quitar (el )?paso|suprimir/],
    ["dispositivo", /nuevo (aparato|dispositivo|equipo)|comprar|adquiri|sustituir el (aparato|equipo)|termometros? fijos?/],
    ["direccion", /la direccion|gerencia|presupuesto|dotar|contratar/],
    ["programa", /alerta|aviso (automatico|en (la )?pantalla)|en pantalla|programa informatico|software|historia (clinica )?electronica|automatic/],
    ["plantilla", /refuerzo|mas personal|reforzar (la )?plantilla|carga de trabajo|ratio/],
    ["redundancia", /redundan|dos (personas|enfermer|profesionales) (por separado|independiente)/],
    ["simulacion", /simulaci/],
    ["lista", /checklist|lista de (verificacion|comprobacion|control)|ayuda cognitiva/],
    ["comunicacion", /sbar|traspaso (estructurado|con formato)|repetir en voz alta|read.?back|comunicacion estandar/],
    ["parecidos", /se parece|suena(n)? igual|separar (los )?(medicamentos|envases)/],
    ["distracciones", /distracci|interrupci|zona (tranquila|libre)/],
    ["documentacion", /rotul|etiquet|señaliz|senaliz|registro|hoja de|documentaci|identificar en el triaje|marca(r|dos)? en (la )?pantalla|cribado/],
    ["doblechequeo", /doble (chequeo|comprobacion|verificacion|control)/],
    ["avisos", /cartel|poster|alarma sonora|aviso de precaucion/],
    ["norma", /procedimiento|protocolo|norma|circular|recordatori|recordar|instruccion|insistir/],
    ["formacion", /formacion|formar|sesion|curso|charla|sensibiliz|concienci|informar al personal|difundir/],
    ["responsable", /responsable (fijo|asignad|designad)|asignar (la|el|a)|designar/]
  ];
  function categoriaSugerida(texto) {
    const t = sinTildes(texto); if (!t) return "";
    for (const [k, re] of PISTAS) if (re.test(t)) return k === "responsable" ? "plantilla" : k;
    return "";
  }
  // Fuerza de una acción: la de su categoría elegida o, si no hay, la adivinada
  function fuerzaAccion(x) { const k = x.categoria || categoriaSugerida(x.que); return k && JERARQUIA[k] ? JERARQUIA[k].f : ""; }
  const RESP_GRUPO = /^(todos|todo el (personal|equipo|servicio)|el equipo|equipo|el personal|personal|la unidad|el servicio|los profesionales|profesionales|enfermeria|medicos|la direccion|direccion|la comision|comision|el comite|comite|grupo de trabajo|el grupo)$/;
  const responsableGrupo = r => RESP_GRUPO.test(normal(r));
  const ESTADOS_ACCION = { pendiente: "Pendiente", curso: "En marcha", hecha: "Hecha", verificada: "Hecha y medida" };
  const cuentaIncidentes = t => /notificac|incidentes? notificad|numero de (incidentes|eventos|notificaciones)|n.? de (incidentes|eventos)/.test(sinTildes(t));

  // ---------- Matriz SAC del SiNASP (manual del notificante, enero de 2024) ----------
  // SAC 1 = riesgo extremo … SAC 4 = bajo (en el SiNASP, al revés que en el RCA²)
  const FRECUENCIAS = ["Frecuente", "Probable", "Ocasional", "Poco frecuente", "Muy infrecuente"];
  const GRAVEDADES = {
    hospital: ["El incidente contribuyó o causó la muerte del paciente", "Comprometió la vida del paciente y se precisó intervención para mantenerla", "Contribuyó o causó daño permanente", "Contribuyó o causó daño temporal y precisó o prolongó la hospitalización", "Contribuyó o causó daño temporal y precisó intervención", "Llegó al paciente sin daño, pero precisó monitorización o intervención para comprobarlo", "Llegó al paciente, pero no le causó daño"],
    primaria: ["Catastrófico: muerte, amenaza para la vida o daño serio permanente", "Crítico: daño temporal importante o menor permanente, o que necesita ingreso", "Moderado: daño temporal menor o tratamiento adicional sin ingreso, o conflicto con el paciente", "Menor: retraso en el tratamiento, tratamiento adicional al necesario, irritación", "Mínimo: llegó al paciente, pero no le causó daño"]
  };
  const E = "extremo", A = "alto", M = "moderado", B = "bajo";
  const MATRIZ_SAC = {
    hospital: [[E, E, E, E, A], [E, E, A, A, M], [E, E, A, A, M], [A, A, A, M, M], [A, A, A, M, M], [M, M, M, B, B], [M, B, B, B, B]],
    primaria: [[E, E, E, E, A], [E, E, A, A, M], [A, A, A, M, M], [M, M, M, B, B], [M, B, B, B, B]]
  };
  const NIVELES_SAC = {
    extremo: { n: 1, nom: "SAC 1 · Riesgo extremo", que: "Análisis causa raíz (ACR)." },
    alto: { n: 2, nom: "SAC 2 · Riesgo alto", que: "ACR simplificado o método parecido." },
    moderado: { n: 3, nom: "SAC 3 · Riesgo medio", que: "Análisis agregado con otros incidentes parecidos." },
    bajo: { n: 4, nom: "SAC 4 · Riesgo bajo", que: "Análisis agregado con otros incidentes parecidos." }
  };
  // gravedad y frecuencia: índices (texto o número) desde 1; devuelve la clave del nivel o ""
  function sac(ambito, gravedad, frecuencia) {
    const Mz = MATRIZ_SAC[ambito] || MATRIZ_SAC.hospital, g = num(gravedad), f = num(frecuencia);
    if (!Number.isInteger(g) || !Number.isInteger(f) || g < 1 || f < 1 || g > Mz.length || f > 5) return "";
    return Mz[g - 1][f - 1];
  }

  // ---------- Privacidad: ¿parece un dato que identifica a alguien? (de Lectura Crítica, ampliado) ----------
  const pareceDatoPaciente = s => {
    s = String(s || "");
    return /\b(Dr|Dra|Sr|Sra|Don|Doña|Dña)\.?\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+/.test(s) || /\b(NHC|NUHSA|DNI|NIF|NIE|CIP|NUSS)\b/i.test(s) || /\b\d{6,}\b/.test(s)
      || /historia\s*(cl[ií]nica)?\s*(n[ºo°.]*)?\s*\d{4,}/i.test(s) || /\b\d{8}[A-Z]\b/.test(s) || /\b[6-9]\d{2}\s?\d{3}\s?\d{3}\b/.test(s)
      || /naci(da|do|miento)\s*(el\s*)?\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/i.test(s);
  };
  const textosLibres = a => [a.titulo, a.descripcion, a.problema, a.dato, a.fuenteDato, a.notas, a.conclusiones, a.incidente.nota,
    ...a.causas.flatMap(x => [x.texto, ...x.porques, x.comprobacion]), ...a.acciones.flatMap(x => [x.que, x.responsable, x.nota, x.indicador.nombre]),
    ...a.cronologia.flatMap(h => [h.hecho, h.debia, h.fuente]), ...a.equipo.map(m => m.perfil), ...a.entrevistas.map(e => e.perfil), ...a.afirmaciones.map(f => f.texto)];
  const hayDatoPersonal = a => textosLibres(a).some(pareceDatoPaciente);

  // ---------- Avisos didácticos ----------
  // Palabras que culpan o juzgan (lista de Auditorías ampliada con las del RCA²)
  const PALABRAS_NO_NEUTRAS = ["culpa", "negligen", "dejadez", "desidia", "vago", "incompeten", "irresponsab", "descuid", "despiste", "despistad", "torpe", "pasota", "horrible", "lamentable", "vergonz", "desastr", "caos", "fatal", "no se molesta", "pasan de"];
  function palabrasNoNeutras(texto) {
    const t = " " + sinTildes(texto).replace(/[^a-zñ ]/g, " ") + " ";
    return PALABRAS_NO_NEUTRAS.filter(p => p.includes(" ") ? t.includes(" " + p + " ") : new RegExp(`\\b${p}`).test(t));
  }
  // ¿El problema está escrito como un hecho? Opinión, solución o vaguedad
  function tipoProblema(t) {
    const s = sinTildes(t);
    if (!s) return "";
    if (/^(hay que|habria que|se debe|se deberia|tenemos que|necesitamos|contratar|comprar|poner|implantar|crear|hacer)\b/.test(s)) return "solucion";
    if (/^(falta(n)?|no hay|escasez|carencia|insuficiente)\b/.test(s)) return "falta";
    if (/\b(caos|desastre|fatal|horrible|lamentable|un lio|todo mal|muy mal|nadie hace|mala gestion)\b/.test(s)) return "opinion";
    return "";
  }
  // Causas que no son el final del camino si no se pregunta «¿por qué?»
  const GENERICA = /^(la |el |una? )?(falta|escasez|poca|escasa|carencia|ausencia)?( de)?\s*(formacion|personal|tiempo|recursos|medios|comunicacion|coordinacion|motivacion|concienciacion|compromiso|interes|experiencia|protocolos?|organizacion)( insuficiente)?$/;
  const esGenerica = t => { const s = normal(t); return !!s && (GENERICA.test(s) || /^(formacion|personal|recursos) insuficientes?$/.test(s)); };
  const ERROR_HUMANO = /error humano|despiste|descuid|olvid|no se dio cuenta|equivoc|no presto atencion|falta de atencion|distraid/;
  const SALTO_NORMA = /no (siguio|cumplio|respeto|aplico) (el|la|los|las)? ?(protocolo|procedimiento|norma)|se salto|incumpli|no se sigue el protocolo|no se cumple el protocolo/;

  function avisosProblema(a) {
    const A = [], tp = tipoProblema(a.problema);
    if (!lleno(a.problema)) { A.push({ nivel: "nota", texto: "Escribe el problema en una frase: un hecho concreto y medible." }); return A; }
    if (tp === "solucion") A.push({ nivel: "warn", texto: "Parece una solución, no un problema. Escribe qué está pasando (el hecho), no qué hay que hacer: si empiezas por la solución, el análisis ya no busca causas." });
    if (tp === "falta") A.push({ nivel: "warn", texto: "«Falta…» suele ser una causa o una solución disfrazada, no el problema. ¿Qué se ve que pasa? Por ejemplo: «En 7 de 25 episodios no consta la reevaluación»." });
    if (tp === "opinion") A.push({ nivel: "warn", texto: "Parece una opinión. Describe el hecho que se puede comprobar, sin adjetivos." });
    if (a.problema.trim().length < 25 && !tp) A.push({ nivel: "nota", texto: "Muy corto. Di qué pasa, a quién, dónde o cuándo, y cuánto." });
    if (!/\d/.test(a.problema + " " + a.dato)) A.push({ nivel: "nota", texto: "Añade el dato que lo demuestra (cuántos casos, de cuántos, en qué periodo). Así sabréis luego si ha mejorado." });
    const p = palabrasNoNeutras(a.problema); if (p.length) A.push({ nivel: "warn", texto: `Revisa la redacción («${p.join("», «")}»): describe hechos, sin juicios ni culpables.` });
    return A;
  }
  function avisosCausa(a, x) {
    const A = [], t = sinTildes(x.texto), conPq = x.porques.some(lleno);
    if (!lleno(x.texto)) return A;
    if (esGenerica(x.texto) && !conPq) A.push({ nivel: "warn", causa: x.id, texto: `«${corto(x.texto, 40)}» no es el final: pregunta «¿por qué?». ¿Falta formación porque no hay plan de acogida? ¿Falta personal en un momento concreto porque dos puestos los cubre la misma persona?` });
    if (ERROR_HUMANO.test(t) && !conPq) A.push({ nivel: "warn", causa: x.id, texto: "Un error humano siempre tiene una causa previa: pregunta qué lo hizo posible (regla 3 de la causalidad)." });
    if (SALTO_NORMA.test(t) && !conPq) A.push({ nivel: "warn", causa: x.id, texto: "Saltarse un protocolo no es una causa de fondo: pregunta por qué no se siguió (regla 4)." });
    const p = palabrasNoNeutras([x.texto, ...x.porques].join(" ")); if (p.length) A.push({ nivel: "warn", causa: x.id, texto: `Revisa la redacción («${p.join("», «")}»): busca causas del sistema, no culpables.` });
    if (x.elegida && x.comprobacion === "" && x.prueba !== "comprobada" && x.prueba !== "descartada") A.push({ nivel: "nota", causa: x.id, texto: "Elegida: decide cómo la vais a comprobar con datos (paso 3)." });
    return A;
  }
  function avisosEspina(a) {
    const A = [], C = causasCon(a), cats = categorias(a);
    if (!C.length) { A.push({ nivel: "nota", texto: "Escribe las causas posibles en su categoría. No hace falta rellenarlas todas." }); return A; }
    const vacias = cats.filter(c => !causasDe(a, c.k).some(x => lleno(x.texto)));
    if (vacias.length && vacias.length < cats.length && C.length >= 4) A.push({ nivel: "nota", texto: `Sin causas en ${listaY(vacias.map(c => c.nom.toLowerCase()))}. ¿Seguro que ahí no hay nada? Usa las preguntas de cada categoría.` });
    if (C.length >= 5 && !C.some(x => x.porques.some(lleno))) A.push({ nivel: "warn", texto: "Ninguna causa tiene «¿por qué?». Pregunta en las más repetidas hasta llegar a algo que se pueda cambiar y medir." });
    C.forEach(x => A.push(...avisosCausa(a, Object.assign({}, x, { elegida: false }))));
    return A;
  }
  function avisosElegir(a) {
    const A = [], C = causasCon(a), E = elegidas(a);
    if (!C.length) { A.push({ nivel: "nota", texto: "Primero escribe las causas en la espina (paso 2)." }); return A; }
    if (!E.length) A.push({ nivel: "nota", texto: "Marca las dos o tres causas de fondo que el equipo considera más importantes (si hace falta, votad)." });
    if (E.length > 5) A.push({ nivel: "warn", texto: `Has elegido ${E.length} causas. Con muchas a la vez es difícil comprobarlas y actuar: quedaos con las dos o tres más importantes.` });
    E.forEach(x => {
      if (!lleno(x.comprobacion) && !x.prueba) A.push({ nivel: "warn", causa: x.id, texto: `«${corto(x.texto, 50)}»: una causa probable no es una causa demostrada. Decide cómo comprobarla con datos.` });
      if (x.prueba === "descartada") A.push({ nivel: "nota", causa: x.id, texto: `«${corto(x.texto, 50)}» está descartada por los datos: quítala de las elegidas si no vais a actuar sobre ella.` });
      if (esGenerica(x.texto) && !x.porques.some(lleno)) A.push({ nivel: "warn", causa: x.id, texto: `«${corto(x.texto, 50)}» es demasiado general para actuar: pregunta «¿por qué?».` });
    });
    return A;
  }
  function avisosAcciones(a) {
    const A = [], X = a.acciones.filter(x => lleno(x.que)), E = elegidas(a).filter(x => x.prueba !== "descartada");
    if (!X.length) { A.push({ nivel: "nota", texto: E.length ? "Escribe al menos una acción para cada causa de fondo elegida." : "Elige antes las causas de fondo (paso 3) y escribe una acción para cada una." }); return A; }
    const F = X.map(fuerzaAccion);
    if (!F.some(f => f === "fuerte" || f === "intermedia")) A.push({ nivel: "warn", texto: "Todas las acciones son débiles o están sin clasificar. Buscad al menos una fuerte o intermedia: las que cambian el sistema y no dependen de que alguien se acuerde." });
    E.forEach(c => { if (!X.some(x => x.causas.includes(c.id))) A.push({ nivel: "nota", texto: `Ninguna acción ataca la causa «${corto(c.texto, 50)}».` }); });
    X.forEach((x, i) => {
      const n = `Acción ${i + 1}`;
      if (lleno(x.responsable) && responsableGrupo(x.responsable)) A.push({ nivel: "warn", accion: x.id, texto: `${n}: el responsable debe ser una persona con autoridad para hacerlo (un puesto concreto), no un grupo o un comité.` });
      if (!lleno(x.responsable)) A.push({ nivel: "nota", accion: x.id, texto: `${n}: falta el responsable.` });
      if (!lleno(x.plazo)) A.push({ nivel: "nota", accion: x.id, texto: `${n}: falta el plazo.` });
      if (!lleno(x.indicador.nombre)) A.push({ nivel: "nota", accion: x.id, texto: `${n}: falta el indicador para saber si funciona.` });
      else {
        if (cuentaIncidentes(x.indicador.nombre + " " + x.indicador.numerador)) A.push({ nivel: "warn", accion: x.id, texto: `${n}: contar incidentes notificados no mide si la acción funciona (si se notifica más, parece que va peor). Mide lo que cambia: lo que se hace, en cuántos casos de cuántos.` });
        if (!lleno(x.indicador.esperado)) A.push({ nivel: "nota", accion: x.id, texto: `${n}: di qué nivel esperáis alcanzar (por ejemplo, ≥ 90 %).` });
      }
      const f = fuerzaAccion(x); if (f === "debil" && X.length === 1) A.push({ nivel: "warn", accion: x.id, texto: `${n} es débil y es la única. Las débiles (formación, recordatorios, un procedimiento nuevo) a menudo hacen falta, pero solas rara vez bastan.` });
      const p = palabrasNoNeutras(x.que); if (p.length) A.push({ nivel: "warn", accion: x.id, texto: `${n}: revisa la redacción («${p.join("», «")}»).` });
    });
    return A;
  }
  const avisoPrivacidad = a => hayDatoPersonal(a) ? [{ nivel: "warn", texto: "Parece que has escrito un nombre, un número de historia u otro dato que identifica a alguien. Un análisis no los necesita: usa perfiles («enfermera de triaje») y bórralo." }] : [];

  // ---------- Análisis causa raíz: decidir, equipo, cronología, espinas por problema ----------
  const CLASES = { ea: "Evento adverso (con daño)", casi: "Casi incidente (no llegó al paciente)", sindano: "Incidente sin daño", situacion: "Situación con riesgo" };
  const PAPELES = { miembro: "Miembro", coordina: "Coordina", experto: "Experto en el proceso", otroNivel: "De otro nivel de la organización", calidad: "Calidad o seguridad", paciente: "Representante de los pacientes" };
  const PERFILES_ACR = [
    { perfil: "Responsable de seguridad del paciente", papel: "coordina" }, { perfil: "Técnico o técnica de calidad", papel: "calidad" },
    { perfil: "Profesional del proceso de otra unidad", papel: "experto" }, { perfil: "Supervisión de otra unidad", papel: "otroNivel" },
    { perfil: "Médico o médica de otro servicio", papel: "experto" }, { perfil: "Representante de los pacientes, ajeno al caso", papel: "paciente" }
  ];
  const FUENTES = { historia: "Historia clínica", registro: "Registro o sistema", entrevista: "Entrevista", observacion: "Visita u observación", otra: "Otra" };
  // Suma días a una fecha AAAA-MM-DD
  const masDias = (iso, d) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || "")); if (!m) return ""; const t = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + d)); return t.toISOString().slice(0, 10); };
  // Plazos del RCA²: empezar en 72 horas desde que se decide que hace falta; terminar en 30–45 días
  function plazos(a, hoy) {
    const base = a.incidente.fechaDecision || a.incidente.fecha; if (!/^\d{4}-\d{2}-\d{2}$/.test(base || "")) return null;
    const empezar = masDias(base, 3), fin30 = masDias(base, 30), fin45 = masDias(base, 45);
    const primera = a.reuniones.map(r => r.fecha).filter(f => /^\d{4}-\d{2}-\d{2}$/.test(f)).sort()[0] || "";
    const h = hoy || "";
    return { base, empezar, fin30, fin45, primera, tarde: primera ? primera > empezar : (h && h > empezar), dias: h ? Math.round((Date.parse(h) - Date.parse(base)) / 864e5) : null, pasado45: h && h > fin45 };
  }
  const nivelSAC = a => a.ambito === "otro" ? "" : sac(a.ambito, a.incidente.gravedad, a.incidente.frecuencia);
  function avisosDecidir(a, hoy) {
    const A = [], I = a.incidente, n = nivelSAC(a);
    if (!I.clase) A.push({ nivel: "nota", texto: "Elige qué tipo de incidente es." });
    if (I.clase === "casi") A.push({ nivel: "nota", texto: "En un casi incidente, puntúa la gravedad pensando en lo peor que razonablemente podría haber pasado." });
    if (a.ambito === "otro") A.push({ nivel: "nota", texto: "La matriz SAC del SiNASP tiene una versión para hospital y otra para atención primaria: elige la que más se parezca." });
    else if (!n && (lleno(I.gravedad) || lleno(I.frecuencia))) A.push({ nivel: "nota", texto: "Elige la gravedad y la frecuencia para calcular el nivel de riesgo (SAC)." });
    if (n === "moderado" || n === "bajo") A.push({ nivel: "warn", texto: "Con este nivel de riesgo, el SiNASP propone analizarlo junto con otros incidentes parecidos, no con un ACR completo. Puedes seguir si el equipo lo cree útil, o usar un Ishikawa." });
    if (I.conducta === "si") A.push({ nivel: "warn", texto: "Si hubo un acto delictivo, consumo de sustancias o algo hecho a propósito para causar daño, no es para un ACR: se trata por la vía que haya definido tu organización. El ACR busca causas del sistema." });
    if (!I.conducta) A.push({ nivel: "nota", texto: "Responde a la pregunta de cultura justa antes de seguir." });
    if (!lleno(I.fecha)) A.push({ nivel: "nota", texto: "Escribe la fecha del incidente." });
    if (I.fecha && I.fechaDecision && I.fechaDecision < I.fecha) A.push({ nivel: "warn", texto: "La fecha de la decisión es anterior a la del incidente." });
    const P = plazos(a, hoy);
    if (P && P.tarde) A.push({ nivel: "warn", texto: P.primera ? `La primera reunión (${fmtFecha(P.primera)}) fue después de las 72 horas recomendadas (${fmtFecha(P.empezar)}). Anótalo como aprendizaje para el próximo.` : `Han pasado más de 72 horas desde la decisión (el ${fmtFecha(P.empezar)}) y aún no hay ninguna reunión anotada.` });
    if (I.clase === "ea" && !I.inmediata.atendido) A.push({ nivel: "nota", texto: "Lo primero, antes del análisis: atender al paciente y dejar la situación segura." });
    return A;
  }
  function avisosEquipo(a) {
    const A = [], E = a.equipo.filter(m => lleno(m.perfil)), n = E.length;
    if (!n) { A.push({ nivel: "nota", texto: "Forma el equipo: de 4 a 6 personas, por su perfil, no por su nombre." }); return A; }
    if (n < 4) A.push({ nivel: "nota", texto: `El equipo tiene ${n}. El informe RCA² recomienda de 4 a 6 personas.` });
    if (n > 6) A.push({ nivel: "warn", texto: `El equipo tiene ${n}. Con más de 6 cuesta reunirse y avanzar: el resto puede colaborar con entrevistas o revisando el borrador.` });
    E.filter(m => m.implicado).forEach(m => A.push({ nivel: "warn", miembro: m.id, texto: `«${corto(m.perfil, 40)}» estuvo implicado en el incidente: se le entrevista, pero no debe formar parte del equipo.` }));
    if (!E.some(m => m.papel === "coordina")) A.push({ nivel: "nota", texto: "Nombra a quien coordina el análisis." });
    if (!E.some(m => m.papel === "experto")) A.push({ nivel: "nota", texto: "Incluye a alguien que conozca bien el proceso (de otra unidad, si es posible)." });
    if (!E.some(m => m.papel === "otroNivel")) A.push({ nivel: "nota", texto: "Incluye a alguien de otro nivel de la organización (otra unidad, otra categoría profesional)." });
    if (!E.some(m => m.papel === "paciente")) A.push({ nivel: "nota", texto: "Valora incluir a un representante de los pacientes ajeno al caso." });
    if (!a.entrevistas.some(e => /paciente|familia/i.test(sinTildes(e.perfil)))) A.push({ nivel: "nota", texto: "Entrevista también al paciente o a su familia, si pueden y quieren: ven cosas que nadie más ve." });
    return A;
  }
  function avisosCronologia(a) {
    const A = [], H = a.cronologia.filter(h => lleno(h.hecho));
    if (H.length < 3) A.push({ nivel: "nota", texto: "Reconstruye lo que pasó, hecho a hecho y con su hora, con la historia clínica, los registros y las entrevistas." });
    H.forEach((h, i) => {
      if (!h.fuente) A.push({ nivel: "nota", hecho: h.id, texto: `Hecho ${i + 1}: ¿de dónde sale? Indica la fuente.` });
      if (h.desajuste && !lleno(h.debia)) A.push({ nivel: "nota", hecho: h.id, texto: `Hecho ${i + 1}: escribe qué debería haber pasado.` });
    });
    const D = H.filter(h => h.desajuste), conProblema = new Set(a.problemasAtencion.map(p => p.hechoId));
    if (D.some(h => !conProblema.has(h.id))) A.push({ nivel: "nota", texto: "Hay desajustes sin convertir en «problema en la atención». Conviértelos, o junta varios en uno." });
    if (H.length >= 3 && !H.some(h => h.bien)) A.push({ nivel: "nota", texto: "Marca también lo que salió bien: el Protocolo de Londres de 2024 pide reconocerlo, y ayuda a entender qué protege." });
    return A;
  }
  // Las espinas del análisis: la principal (el problema) y una por problema en la atención
  const espinasDe = a => [{ id: "", texto: a.problema || "El problema" }, ...a.problemasAtencion.filter(p => lleno(p.texto)).map(p => ({ id: p.id, texto: p.texto }))];
  // Categoría de la plantilla actual para una idea común (para las preguntas desencadenantes)
  function categoriaPorEq(a, eq) {
    const C = categorias(a); if (!C.length) return "";
    for (const e of [eq, ...(EQ_ALTERNATIVA[eq] || [])]) { const c = C.find(x => x.eq === e); if (c) return c.k; }
    return C[0].k;
  }
  const respuesta = (a, id) => (a.preguntas.find(q => q.id === id) || { r: "" }).r;
  function responder(a, id, r) { a.preguntas = a.preguntas.filter(q => q.id !== id); if (r) a.preguntas.push({ id, r }); }

  // ---------- Afirmaciones causales (RCA², apéndice 6: las cinco reglas de la causalidad) ----------
  const REGLAS = [
    { n: 1, nom: "Mostrar la relación causa-efecto", que: "Decir cómo la causa produjo el efecto, y qué pasó por ello." },
    { n: 2, nom: "Descripciones precisas, no negativas ni vagas", que: "Nada de «mal», «inadecuado», «deficiente», «descuidado»." },
    { n: 3, nom: "Todo error humano tiene una causa previa", que: "Explicar qué hizo posible el error." },
    { n: 4, nom: "Saltarse un procedimiento no es una causa raíz", que: "Explicar por qué no se siguió." },
    { n: 5, nom: "No actuar solo es causa si había obligación de actuar", que: "Decir dónde está escrito ese deber." }
  ];
  const VAGAS = ["mal", "malo", "mala", "deficiente", "inadecuado", "inadecuada", "incorrecto", "incorrecta", "pobre", "insuficiente", "descuidado", "descuidada", "negligente", "fallo", "fallaron", "fallo", "erroneo", "erronea", "pesimo", "pesima"];
  const palabrasVagas = t => { const w = sinTildes(t).replace(/[^a-zñ ]/g, " ").split(/\s+/); return VAGAS.filter(v => w.includes(v)); };
  const CONECTOR = /\b(como|porque|ya que|dado que|al no|debido a|a causa de|lo que|por lo que|de modo que|y por eso|asi que|hizo que|llevo a|aumento la probabilidad|permitio|provoco|facilito)\b/;
  const OMISION = /\bno (se )?(comprob|avis|revis|reevalu|regist|llam|hizo|hicieron|actu|detect|vigil|mir|tom)/;
  // Avisos de una afirmación causal (sin bloquear). Cada aviso lleva la regla que toca.
  function avisosAfirmacion(f) {
    const A = [], t = sinTildes(f.texto);
    if (!lleno(f.texto)) return A;
    if (!CONECTOR.test(t)) A.push({ regla: 1, texto: "No se ve la relación causa-efecto. Prueba con «Como [causa], [efecto], lo que aumentó la probabilidad de [lo que pasó]»." });
    if (t.length < 50) A.push({ regla: 1, texto: "Muy corta: di la causa, el efecto y lo que pasó por ello." });
    const v = palabrasVagas(f.texto); if (v.length) A.push({ regla: 2, texto: `Palabras vagas o negativas («${v.join("», «")}»): sustitúyelas por una descripción concreta de lo que había o faltaba.` });
    const p = palabrasNoNeutras(f.texto); if (p.length) A.push({ regla: 2, texto: `Juicios o culpa («${p.join("», «")}»): describe hechos del sistema.` });
    if (ERROR_HUMANO.test(t) && !/\b(como|porque|ya que|dado que|debido a|a causa de)\b[^.]{10,}\b(olvid|despist|equivoc|descuid|error)/.test(t) && t.indexOf("error humano") >= 0) A.push({ regla: 3, texto: "«Error humano» no es la causa: explica qué lo hizo posible." });
    else if (ERROR_HUMANO.test(t) && t.search(CONECTOR) > t.search(ERROR_HUMANO)) A.push({ regla: 3, texto: "El error de la persona aparece como causa. Empieza por lo que lo hizo posible (el sistema) y deja el error como efecto." });
    if (SALTO_NORMA.test(t) && t.search(CONECTOR) > t.search(SALTO_NORMA)) A.push({ regla: 4, texto: "Saltarse el protocolo no es la causa de fondo: di por qué no se siguió (carga, diseño, falta de asignación…)." });
    if (OMISION.test(t) && !lleno(f.deber)) A.push({ regla: 5, texto: "Habla de algo que no se hizo: indica dónde está escrito ese deber (protocolo, apartado). Si no lo había, la causa es que no estaba definido." });
    if (/\b(enfermer[ao]|medic[ao]|celador|auxiliar|tcae|residente|supervisor[a]?)\b/.test(t) && /\b(no (quiso|supo)|se nego|ignor)/.test(t)) A.push({ regla: 2, texto: "Apunta a una persona: describe las condiciones, no la actitud." });
    return A;
  }
  // Propuesta de afirmación a partir de una causa de fondo y el problema
  function afirmacionSugerida(a, x) {
    const fondo = limpia(causaFondo(x)).replace(/^./, m => m.toLowerCase()), causa = limpia(x.texto).replace(/^./, m => m.toLowerCase());
    const pa = a.problemasAtencion.find(p => p.id === x.espina), efecto = pa ? limpia(pa.texto).replace(/^./, m => m.toLowerCase()) : "";
    const evento = limpia(a.problema || "lo ocurrido").replace(/^./, m => m.toLowerCase());
    return `Como ${fondo}${fondo !== causa ? ` (${causa})` : ""}, ${efecto || "[efecto]"}, lo que aumentó la probabilidad de que ${evento}.`;
  }
  const cumpleReglas = f => lleno(f.texto) && !avisosAfirmacion(f).length;
  function avisosAfirmaciones(a) {
    const A = [], E = elegidas(a).filter(x => x.prueba !== "descartada"), F = a.afirmaciones.filter(f => lleno(f.texto));
    if (!E.length) { A.push({ nivel: "nota", texto: "Primero elige las causas de fondo en la espina (paso 5)." }); return A; }
    E.forEach(x => { if (!a.afirmaciones.some(f => f.causaId === x.id && lleno(f.texto))) A.push({ nivel: "nota", texto: `Falta la afirmación causal de «${corto(x.texto, 50)}».` }); });
    F.forEach((f, i) => avisosAfirmacion(f).forEach(r => A.push({ nivel: "warn", afirmacion: f.id, texto: `Regla ${r.regla}: ${r.texto}` })));
    F.forEach(f => { if (!lleno(f.pruebas)) A.push({ nivel: "nota", afirmacion: f.id, texto: "Anota qué pruebas o datos la sostienen (el informe debe decir por qué se eligió este factor)." }); });
    return A;
  }

  // ---------- Medidas y cierre (RCA², apéndice 7; guía de acciones del NHS) ----------
  const TIPOS_MEDIDA = { existe: "Está implantada", sehace: "Se hace como se previó", funciona: "Funciona (el resultado cambia)" };
  const CONTROLA = { persona: "Una persona", equipo: "El equipo o la unidad", servicio: "El servicio o la dirección de área", organizacion: "La organización" };
  // Lista de verificación del cierre (adaptada de las recomendaciones del Ministerio de Sanidad, 2021, y del RCA²)
  const VERIFICACION = [
    { id: "v-equipo", t: "El equipo no incluyó a los implicados; se les entrevistó." },
    { id: "v-72", t: "El análisis empezó en las 72 horas siguientes a la decisión." },
    { id: "v-hechos", t: "La cronología se apoya en la historia, los registros y las entrevistas, no en recuerdos." },
    { id: "v-reglas", t: "Las afirmaciones causales cumplen las cinco reglas." },
    { id: "v-fuerte", t: "Hay al menos una acción fuerte o intermedia." },
    { id: "v-medida", t: "Cada acción tiene responsable, plazo e indicador con fecha de medida." },
    { id: "v-direccion", t: "La dirección ha dado su acuerdo a las acciones (o ha dicho por qué no)." },
    { id: "v-familia", t: "Se ha informado al paciente o a la familia de lo ocurrido y de lo que se cambia." },
    { id: "v-prof", t: "Se ha informado a los profesionales implicados y a la unidad." },
    { id: "v-apoyo", t: "Se ha ofrecido apoyo al paciente, a la familia y a los profesionales (segundas víctimas)." },
    { id: "v-anon", t: "El informe no lleva nombres ni datos que identifiquen al paciente ni a los profesionales." },
    { id: "v-seguimiento", t: "Hay fecha para revisar si las acciones funcionan (comisión o unidad de seguridad)." }
  ];
  function avisosCerrar(a, hoy) {
    const A = [], I = a.informacion, X = a.acciones.filter(x => lleno(x.que));
    if (!lleno(I.profesionales)) A.push({ nivel: "nota", texto: "Anota cuándo y quién informó a los profesionales implicados." });
    if (!lleno(I.paciente)) A.push({ nivel: "warn", texto: "Falta la información al paciente o a la familia: el informe RCA² y el Protocolo de Londres 2024 la consideran parte del análisis, no un trámite." });
    if (!a.apoyo.profesionales) A.push({ nivel: "nota", texto: "¿Se ha ofrecido apoyo a los profesionales implicados? Son también víctimas del incidente." });
    if (X.some(x => x.direccion === "no" && !lleno(x.motivoDireccion))) A.push({ nivel: "nota", texto: "Alguna acción no tiene el acuerdo de la dirección: anota el motivo y si se propone otra." });
    if (X.length && !X.some(x => x.direccion === "si")) A.push({ nivel: "nota", texto: "Ninguna acción tiene todavía el acuerdo de la dirección. Solo la dirección puede aceptar el riesgo de no hacerla." });
    if (!lleno(a.conclusiones)) A.push({ nivel: "nota", texto: "Escribe las conclusiones (puedes pedir una propuesta)." });
    const P = plazos(a, hoy); if (P && P.pasado45 && !lleno(a.conclusiones)) A.push({ nivel: "warn", texto: `Han pasado más de 45 días desde la decisión (${fmtFecha(P.base)}). Cierra el análisis: lo importante es poner en marcha las acciones.` });
    if (!lleno(a.proxRevision)) A.push({ nivel: "nota", texto: "Pon una fecha para revisar si las acciones funcionan." });
    return A;
  }
  function conclusionesSugeridas(a) {
    const E = elegidas(a).filter(x => x.prueba !== "descartada"), X = a.acciones.filter(x => lleno(x.que)), F = X.map(fuerzaAccion);
    const nF = F.filter(f => f === "fuerte").length, nI = F.filter(f => f === "intermedia").length, nD = F.filter(f => f === "debil").length;
    const pa = a.problemasAtencion.filter(p => lleno(p.texto));
    const t = [];
    t.push(`El análisis de ${a.incidente.clase === "casi" ? "este casi incidente" : "este incidente"} no encontró un culpable, sino ${plural(E.length, "factor del sistema", "factores del sistema")} que lo hicieron posible${pa.length ? `, en torno a ${plural(pa.length, "problema en la atención", "problemas en la atención")}: ${listaY(pa.map(p => limpia(p.texto).replace(/^./, m => m.toLowerCase())))}` : ""}.`);
    if (E.length) t.push(`Las causas de fondo: ${listaY(E.map(x => limpia(causaFondo(x)).replace(/^./, m => m.toLowerCase())))}.`);
    if (X.length) t.push(`Se proponen ${plural(X.length, "acción", "acciones")}${nF || nI ? ` (${[nF ? plural(nF, "fuerte", "fuertes") : "", nI ? plural(nI, "intermedia", "intermedias") : "", nD ? plural(nD, "débil", "débiles") : ""].filter(Boolean).join(", ")})` : ""}, cada una con responsable, plazo e indicador. ${nF ? "La más fuerte cambia el sistema para que el error no dependa de la memoria de nadie." : "Conviene buscar al menos una acción fuerte que cambie el sistema."}`);
    t.push("Las conclusiones se han compartido con los profesionales implicados y con el paciente o su familia, y las acciones se revisarán en la fecha prevista.");
    return t.join(" ");
  }
  const accionesDe = (a, causaId) => a.acciones.filter(x => lleno(x.que) && x.causas.includes(causaId));

  // ---------- Informe del ACR (lista de bloques) ----------
  function documentoInforme(a, fecha, imagenes) {
    const B = [], I = a.incidente, n = nivelSAC(a), E = ranking(a).filter(x => x.elegida), X = a.acciones.filter(x => lleno(x.que)), F = a.afirmaciones.filter(f => lleno(f.texto));
    const img = (k, pie) => { const im = imagenes && imagenes[k]; return im ? Object.assign({ t: "imagen", maxAlto: 13, pie }, im) : { t: "espina", espina: k }; };
    B.push({ t: "portada", titulo: "Análisis causa raíz", sub: a.titulo || corto(a.problema, 120), extra: [[a.unidad, fecha].filter(lleno).join(" · "), "Informe para aprender y mejorar el sistema, no para señalar personas. Sin datos que identifiquen al paciente ni a los profesionales."] });
    B.push({ t: "h1", texto: "1. El incidente y la decisión de analizarlo" });
    B.push({ t: "p", runs: [{ texto: a.problema || "Sin escribir.", negrita: true }] });
    if (lleno(a.descripcion)) B.push({ t: "p", texto: a.descripcion });
    B.push({ t: "tabla", cab: ["Dato", "Valor"], filas: [["Tipo", CLASES[I.clase] || "Sin indicar"], ["Fecha del incidente", fmtFecha(I.fecha)], ["Decisión de analizarlo", fmtFecha(I.fechaDecision)], ["Nivel de riesgo (SAC del SiNASP)", n ? `${NIVELES_SAC[n].nom}: ${NIVELES_SAC[n].que}` : "Sin calcular"], ["Gravedad", lleno(I.gravedad) ? GRAVEDADES[a.ambito === "primaria" ? "primaria" : "hospital"][Number(I.gravedad) - 1] || "" : ""], ["Frecuencia", lleno(I.frecuencia) ? FRECUENCIAS[Number(I.frecuencia) - 1] || "" : ""], ["Cultura justa", I.conducta === "no" ? "No hubo conducta que deba tratarse por otra vía" : I.conducta === "si" ? "Hay una conducta que se trata por otra vía" : ""]].filter(f => lleno(f[1])), anchos: [30, 70], fuente: 9 });
    if (lleno(I.nota)) B.push({ t: "p", estilo: "nota", texto: I.nota });
    B.push({ t: "h1", texto: "2. Equipo y método" });
    const P = plazos(a, null);
    if (a.equipo.length) B.push({ t: "tabla", cab: ["Perfil", "Servicio", "Papel"], filas: a.equipo.map(m => [m.perfil, m.servicio, PAPELES[m.papel]]), anchos: [45, 30, 25], fuente: 9 });
    B.push({ t: "p", texto: `${plural(a.reuniones.length, "reunión", "reuniones")} del equipo${P && P.primera ? `; la primera el ${fmtFecha(P.primera)}${P.tarde ? " (fuera de las 72 horas recomendadas)" : " (dentro de las 72 horas)"}` : ""}. ${plural(a.entrevistas.length, "entrevista", "entrevistas")}${a.entrevistas.length ? ": " + listaY(a.entrevistas.map(e => e.perfil).filter(lleno)) : ""}. Método: cronología y comparación con lo que debería haber pasado, problemas en la atención, factores contribuyentes con un diagrama de Ishikawa por problema, afirmaciones causales con las cinco reglas de la causalidad y acciones según su fuerza (informe RCA², Protocolo de Londres).` });
    B.push({ t: "h1", texto: "3. Qué pasó: la cronología" });
    if (a.cronologia.length) B.push({ t: "tabla", cab: ["Hora", "Lo que pasó", "Fuente", "Lo que debería haber pasado"], filas: a.cronologia.map(h => [h.hora, { texto: (h.desajuste ? "⚠ " : h.bien ? "✓ " : "") + h.hecho, negrita: h.desajuste }, FUENTES[h.fuente] || "", h.debia]), anchos: [9, 38, 14, 39], fuente: 8.5 });
    const bien = a.cronologia.filter(h => h.bien && lleno(h.hecho)); if (bien.length) B.push({ t: "p", texto: "Lo que salió bien: " + listaY(bien.map(h => limpia(h.hecho).replace(/^./, m => m.toLowerCase()))) + "." });
    B.push({ t: "h1", texto: "4. Problemas en la atención" });
    const pa = a.problemasAtencion.filter(p => lleno(p.texto));
    if (pa.length) B.push({ t: "lista", items: pa.map(p => p.texto) }); else B.push({ t: "p", estilo: "nota", texto: "No se han definido." });
    B.push({ t: "h1", texto: "5. Factores contribuyentes" });
    espinasDe(a).forEach((e, i) => {
      const C = causasCon(a).filter(x => (x.espina || "") === e.id); if (!C.length && e.id) return;
      B.push({ t: "h2", texto: e.id ? `Espina ${i}: ${e.texto}` : "Espina principal: el problema" });
      B.push(img(e.id, "En color, las causas de fondo elegidas."));
      if (C.length) B.push({ t: "tabla", cab: ["Categoría", "Factor", "¿Por qué?", "De fondo"], filas: categorias(a).flatMap(c => C.filter(x => x.cat === c.k).map((x, j) => [j ? "" : { texto: c.nom, negrita: true }, x.texto, x.porques.filter(lleno).join(" → "), { texto: x.elegida ? "✓" : "", centro: true }])), anchos: [16, 36, 40, 8], fuente: 8.5 });
    });
    B.push({ t: "h1", texto: "6. Afirmaciones causales" });
    if (F.length) B.push({ t: "tabla", cab: ["Nº", "Afirmación causal", "Deber previo", "Pruebas o datos"], filas: F.map((f, i) => [{ texto: String(i + 1), centro: true }, f.texto, f.deber, f.pruebas]), anchos: [5, 50, 20, 25], fuente: 8.5 });
    else B.push({ t: "p", estilo: "nota", texto: "Sin afirmaciones causales." });
    B.push({ t: "h1", texto: "7. Plan de acción y medida" });
    if (X.length) B.push({ t: "tabla", cab: ["Acción", "Causa que ataca", "Fuerza", "Responsable", "Plazo", "Indicador y medida", "Dirección"], filas: X.map(x => [x.que, x.causas.map(id => { const c = a.causas.find(y => y.id === id); return c ? c.texto : ""; }).filter(lleno).join("; "), fz(x), [x.responsable, x.controla ? "(" + CONTROLA[x.controla].toLowerCase() + ")" : ""].filter(lleno).join(" "), fmtFecha(x.plazo), [TIPOS_MEDIDA[x.indicador.tipo] ? TIPOS_MEDIDA[x.indicador.tipo] + ": " : "", textoIndicador(x.indicador), lleno(x.indicador.resultado) ? "Resultado: " + x.indicador.resultado + (x.indicador.alcanzado ? (x.indicador.alcanzado === "si" ? " (alcanzado)" : " (no alcanzado)") : "") : ""].filter(lleno).join(" "), x.direccion === "si" ? "De acuerdo" : x.direccion === "no" ? "No: " + x.motivoDireccion : ""]), anchos: [24, 15, 10, 13, 8, 20, 10], fuente: 8 });
    else B.push({ t: "p", estilo: "nota", texto: "Sin acciones." });
    const r = resumen(a); if (X.length) B.push({ t: "p", estilo: "nota", texto: `${plural(r.acciones, "acción", "acciones")}: ${r.fuertes} fuertes, ${r.intermedias} intermedias y ${r.debiles} débiles (jerarquía del informe RCA²).` });
    B.push({ t: "h1", texto: "8. Información y apoyo" });
    const inf = a.informacion;
    B.push({ t: "tabla", cab: ["A quién", "Cuándo y quién"], filas: [["Profesionales implicados y unidad", inf.profesionales], ["Paciente o familia", inf.paciente], ["Dirección", inf.direccion], ["Comisión de seguridad", inf.comision]].filter(f => lleno(f[1])), anchos: [35, 65], fuente: 9 });
    B.push({ t: "p", texto: `Apoyo ofrecido: ${[a.apoyo.paciente ? "al paciente y a la familia" : "", a.apoyo.profesionales ? "a los profesionales implicados" : ""].filter(Boolean).join(" y ") || "sin anotar"}.${lleno(a.apoyo.nota) ? " " + a.apoyo.nota : ""}` });
    B.push({ t: "h1", texto: "9. Conclusiones" });
    B.push({ t: "p", texto: a.conclusiones || conclusionesSugeridas(a) });
    if (lleno(a.proxRevision)) B.push({ t: "p", texto: "Revisión de las acciones: " + fmtFecha(a.proxRevision) + "." });
    const V = VERIFICACION.filter(v => a.verificacion.includes(v.id)); if (V.length) { B.push({ t: "h2", texto: "Lista de verificación" }); B.push({ t: "lista", items: V.map(v => v.t) }); }
    if (lleno(a.notas)) { B.push({ t: "h1", texto: "Notas" }); B.push({ t: "p", texto: a.notas }); }
    B.push({ t: "p", estilo: "nota", texto: "Método: National Patient Safety Foundation, RCA² (2016); Taylor-Adams y Vincent, Protocolo de Londres (2004 y 2024); Ministerio de Sanidad, Recomendaciones para el análisis de los incidentes de seguridad del paciente con daño (2021); SiNASP, matriz SAC (2024)." });
    return { titulo: "ACR · " + (a.titulo || corto(a.problema, 60)), bloques: B };
  }

  // ---------- Pasos ----------
  const PASOS = {
    ishikawa: [
      { n: 1, k: "problema", corto: "Problema", titulo: "El problema", que: "Una frase concreta y medible: el efecto que va en la cabeza del pez.", entrega: 1 },
      { n: 2, k: "espina", corto: "Espina", titulo: "La espina de pescado", que: "Las causas posibles, ordenadas por categorías, con sus «¿por qué?».", entrega: 1 },
      { n: 3, k: "elegir", corto: "Elegir", titulo: "Elegir y comprobar", que: "Las causas de fondo más importantes y cómo comprobarlas con datos.", entrega: 1 },
      { n: 4, k: "acciones", corto: "Acciones", titulo: "Acciones y exportar", que: "Una acción para cada causa, con su fuerza, responsable, plazo e indicador. Y la espina, lista para pegar.", entrega: 1 }
    ],
    acr: [
      { n: 1, k: "decidir", corto: "¿Hace falta?", titulo: "¿Hace falta un ACR?", que: "Gravedad y frecuencia (matriz SAC), cultura justa y plazos.", entrega: 2 },
      { n: 2, k: "problema", corto: "Problema", titulo: "El problema", que: "Qué pasó, sin datos que identifiquen a nadie, y el problema en una frase.", entrega: 1 },
      { n: 3, k: "equipo", corto: "Equipo", titulo: "Equipo y plazos", que: "De 4 a 6 personas, sin los implicados; entrevistas y reuniones.", entrega: 2 },
      { n: 4, k: "cronologia", corto: "Qué pasó", titulo: "Qué pasó: la cronología", que: "Lo que pasó frente a lo que debería haber pasado, y lo que salió bien.", entrega: 2 },
      { n: 5, k: "espina", corto: "Por qué", titulo: "Por qué pasó: el Ishikawa", que: "Los factores que contribuyeron, en la espina, con sus «¿por qué?», y las causas de fondo.", entrega: 1 },
      { n: 6, k: "afirmaciones", corto: "Causas", titulo: "Afirmaciones causales", que: "Cada causa de fondo, escrita con las cinco reglas de la causalidad.", entrega: 3 },
      { n: 7, k: "acciones", corto: "Acciones", titulo: "Acciones y medida", que: "Acciones fuertes, responsable, plazo e indicador.", entrega: 1 },
      { n: 8, k: "cerrar", corto: "Informar", titulo: "Informar, apoyar y cerrar", que: "Información a profesionales, paciente y familia; apoyo; informe.", entrega: 3 }
    ]
  };
  const pasosDe = a => PASOS[a.tipo] || PASOS.ishikawa;
  function progreso(a) {
    const r = {}, X = a.acciones.filter(x => lleno(x.que));
    const hecho = {
      problema: lleno(a.problema) && !["solucion", "opinion"].includes(tipoProblema(a.problema)),
      espina: causasCon(a).length >= 3,
      elegir: elegidas(a).length > 0 && elegidas(a).every(x => lleno(x.comprobacion) || x.prueba),
      acciones: X.length > 0 && X.every(x => lleno(x.responsable) && lleno(x.plazo) && lleno(x.indicador.nombre)),
      decidir: !!nivelSAC(a) && lleno(a.incidente.fecha) && !!a.incidente.clase && a.incidente.conducta === "no",
      equipo: a.equipo.filter(m => lleno(m.perfil) && !m.implicado).length >= 4, cronologia: a.cronologia.filter(h => lleno(h.hecho)).length >= 3 && (!a.cronologia.some(h => h.desajuste) || a.problemasAtencion.some(p => lleno(p.texto))),
      afirmaciones: elegidas(a).filter(x => x.prueba !== "descartada").length > 0 && elegidas(a).filter(x => x.prueba !== "descartada").every(x => a.afirmaciones.some(f => f.causaId === x.id && cumpleReglas(f))),
      cerrar: lleno(a.informacion.profesionales) && lleno(a.informacion.paciente) && lleno(a.conclusiones)
    };
    pasosDe(a).forEach(p => { r[p.n] = !!hecho[p.k]; });
    if (a.tipo === "acr") r[5] = hecho.espina && elegidas(a).length > 0;
    return r;
  }
  function pasoPendiente(a, entrega) { const g = progreso(a); return pasosDe(a).find(p => p.entrega <= entrega && !g[p.n]) || null; }
  const nombreAnalisis = a => a.titulo || a.problema || "";
  function siguientePaso(d, entrega) {
    const L = d.analisis.slice().sort((x, y) => String(y.modificado).localeCompare(String(x.modificado)));
    const a = L.find(x => pasoPendiente(x, entrega));
    if (!d.analisis.length) return { texto: "Empieza por el problema que quieres entender, o mira antes el ejemplo de la sala de espera de Urgencias.", href: "#/nuevo/ishikawa", btn: "Buscar las causas de un problema" };
    if (!a) return { texto: "Tus análisis tienen todos los pasos hechos. Mide las acciones y revisa los indicadores en su fecha.", href: "#/analisis", btn: "Ver mis análisis" };
    const p = pasoPendiente(a, entrega);
    return { texto: `«${corto(nombreAnalisis(a) || "Análisis sin nombre", 70)}»: ${p.que.charAt(0).toLowerCase() + p.que.slice(1)}`, href: `#/analisis/${a.id}/${p.n}`, btn: `Paso ${p.n}: ${p.titulo}` };
  }
  function resumen(a) {
    const C = causasCon(a), X = a.acciones.filter(x => lleno(x.que)), F = X.map(fuerzaAccion);
    return { causas: C.length, elegidas: elegidas(a).length, comprobadas: elegidas(a).filter(x => x.prueba === "comprobada").length, acciones: X.length,
      fuertes: F.filter(f => f === "fuerte").length, intermedias: F.filter(f => f === "intermedia").length, debiles: F.filter(f => f === "debil").length };
  }

  // ---------- El dibujo: datos para dibujo.js ----------
  function datosDibujo(a, o = {}) {
    const N = numerosElegidas(a), esp = o.espina || "", pa = a.problemasAtencion.find(p => p.id === esp);
    return {
      problema: pa ? pa.texto : (a.problema || a.efectoPrincipal || ""), titulo: o.titulo || "",
      categorias: categorias(a).map(c => ({ nom: c.nom, causas: causasDe(a, c.k, esp).filter(x => lleno(x.texto) && (!o.soloElegidas || x.elegida))
        .map(x => ({ texto: limpia(x.texto), porques: o.porques ? x.porques.filter(lleno).map(limpia) : [], elegida: x.elegida, n: N[x.id] || 0, prueba: x.prueba })) }))
    };
  }

  // ---------- Intercambio (paquete «acrishikawa-analisis» v1) ----------
  const FORMATO = "acrishikawa-analisis", VERSION_INTERCAMBIO = 1;
  const hoyIsoDe = f => String(f || "").slice(0, 10);
  function paqueteIntercambio(lista, appVersion, generado) {
    return {
      formato: FORMATO, version: VERSION_INTERCAMBIO, app: "acrishikawa", appVersion, generado,
      analisis: lista.map(a => ({
        id: a.id, tipo: a.tipo, titulo: a.titulo, unidad: a.unidad, ambito: a.ambito, fecha: a.fecha || a.incidente.fecha || hoyIsoDe(a.creado),
        sac: a.tipo === "acr" ? (NIVELES_SAC[nivelSAC(a)] || { n: null }).n : null,
        problemasAtencion: a.problemasAtencion.filter(p => lleno(p.texto)).map(p => p.texto),
        problema: a.problema, dato: a.dato, plantilla: a.plantilla, categorias: categorias(a).map(c => c.nom),
        causas: causasCon(a).map(x => ({ id: x.id, categoria: nombreCat(a, x.cat), espina: x.espina ? (a.problemasAtencion.find(p => p.id === x.espina) || { texto: "" }).texto : null, texto: x.texto, causaFondo: causaFondo(x), elegida: x.elegida, estadoPrueba: x.prueba || null, votos: x.votos || 0 })),
        afirmaciones: a.afirmaciones.filter(f => lleno(f.texto)).map(f => ({ id: f.id, texto: f.texto })),
        acciones: a.acciones.filter(x => lleno(x.que)).map(x => ({ id: x.id, que: x.que, fuerza: fuerzaAccion(x) || null, categoria: x.categoria ? JERARQUIA[x.categoria].nom : null, responsable: x.responsable, plazo: x.plazo, estado: x.estado,
          causas: x.causas.map(id => { const c = a.causas.find(y => y.id === id); return c ? c.texto : ""; }).filter(lleno),
          indicador: lleno(x.indicador.nombre) ? Object.assign({}, x.indicador) : null })),
        informado: a.tipo === "acr" ? { profesionales: lleno(a.informacion.profesionales), paciente: lleno(a.informacion.paciente) } : null,
        cerrado: a.tipo === "acr" ? lleno(a.informacion.profesionales) && lleno(a.informacion.paciente) && lleno(a.conclusiones) : false
      }))
    };
  }
  // Para otras apps: valida un paquete (o una copia .json que lo lleve en «intercambio»)
  function leerIntercambio(o) {
    if (o && typeof o === "object" && !o.formato && o.intercambio && typeof o.intercambio === "object") o = o.intercambio;
    if (!o || typeof o !== "object" || o.formato !== FORMATO || !Array.isArray(o.analisis)) return { error: "formato" };
    if (o.version !== VERSION_INTERCAMBIO) return { error: "version" };
    return { analisis: o.analisis.filter(x => x && typeof x === "object" && typeof x.id === "string") };
  }

  // ---------- Documentos (lista de bloques: vista previa, PDF y Word) ----------
  const fz = x => { const f = fuerzaAccion(x); return f ? FUERZAS[f].nom + (x.categoria ? ` (${JERARQUIA[x.categoria].nom.toLowerCase()})` : "") : "Sin clasificar"; };
  const textoIndicador = i => [i.nombre, lleno(i.numerador) || lleno(i.denominador) ? `${i.numerador || "…"} / ${i.denominador || "…"}` : "", lleno(i.esperado) ? "Nivel esperado: " + i.esperado : "", lleno(i.fecha) ? "Medir: " + fmtFecha(i.fecha) : ""].filter(lleno).join(". ");
  // imagen: { png, w, h } de la espina (o null: en la vista previa la pone la app)
  function documentoFicha(a, fecha, imagen) {
    const B = [], E = ranking(a).filter(x => x.elegida), X = a.acciones.filter(x => lleno(x.que));
    B.push({ t: "portada", titulo: a.tipo === "acr" ? "Análisis causa raíz" : "Diagrama de Ishikawa", sub: a.titulo || corto(a.problema, 120), extra: [[a.unidad, fecha].filter(lleno).join(" · ")] });
    B.push({ t: "h1", texto: "El problema" });
    B.push({ t: "p", runs: [{ texto: a.problema || "Sin escribir.", negrita: true }] });
    if (lleno(a.dato)) B.push({ t: "p", texto: "Dato: " + a.dato + (lleno(a.fuenteDato) ? ` (fuente: ${a.fuenteDato})` : "") });
    B.push({ t: "h1", texto: "La espina de pescado" });
    B.push(imagen ? Object.assign({ t: "imagen", maxAlto: 15, pie: `Categorías: ${PLANTILLAS[a.plantilla] ? PLANTILLAS[a.plantilla].nom.toLowerCase() : "propias"}. En color, las causas de fondo elegidas.` }, imagen) : { t: "espina" });
    const filas = categorias(a).flatMap(c => causasDe(a, c.k).filter(x => lleno(x.texto)).map((x, i) => [i ? "" : { texto: c.nom, negrita: true }, x.texto, x.porques.filter(lleno).join(" → "), { texto: x.votos ? String(x.votos) : "", centro: true }, { texto: x.elegida ? "✓" : "", centro: true }]));
    if (filas.length) B.push({ t: "tabla", cab: ["Categoría", "Causa", "¿Por qué?", "Votos", "De fondo"], filas, anchos: [16, 30, 38, 8, 8], fuente: 9 });
    B.push({ t: "h1", texto: "Causas de fondo y cómo se comprueban" });
    if (E.length) B.push({ t: "tabla", cab: ["Nº", "Causa de fondo", "Cómo se comprueba", "Estado"], filas: E.map((x, i) => [{ texto: String(i + 1), centro: true }, causaFondo(x) !== x.texto ? `${x.texto} (de fondo: ${limpia(causaFondo(x)).replace(/^./, m => m.toLowerCase())})` : x.texto, x.comprobacion, ESTADOS_PRUEBA[x.prueba || ""]]), anchos: [6, 44, 34, 16], fuente: 9 });
    else B.push({ t: "p", estilo: "nota", texto: "Todavía no se ha elegido ninguna causa de fondo." });
    B.push({ t: "h1", texto: "Acciones" });
    if (X.length) B.push({ t: "tabla", cab: ["Acción", "Causa que ataca", "Fuerza", "Responsable", "Plazo", "Indicador"], filas: X.map(x => [x.que, x.causas.map(id => { const c = a.causas.find(y => y.id === id); return c ? c.texto : ""; }).filter(lleno).join("; "), fz(x), x.responsable, fmtFecha(x.plazo), textoIndicador(x.indicador)]), anchos: [26, 18, 13, 13, 9, 21], fuente: 8.5 });
    else B.push({ t: "p", estilo: "nota", texto: "Todavía no hay acciones." });
    const r = resumen(a);
    if (X.length) B.push({ t: "p", estilo: "nota", texto: `${plural(r.acciones, "acción", "acciones")}: ${r.fuertes} fuertes, ${r.intermedias} intermedias y ${r.debiles} débiles. Fuerza según la jerarquía de acciones del informe RCA² (National Patient Safety Foundation, 2016).` });
    if (lleno(a.notas)) { B.push({ t: "h1", texto: "Notas" }); B.push({ t: "p", texto: a.notas }); }
    return { titulo: (a.tipo === "acr" ? "ACR · " : "Ishikawa · ") + (a.titulo || corto(a.problema, 60)), bloques: B };
  }

  // ---------- Excel ----------
  const ESTILOS_XLSX = {
    titulo: { negrita: true, tamano: 14, colorTexto: "FFFFFF", colorFondo: "8F3322", borde: false },
    sub: { cursiva: true, colorTexto: "444444", borde: false },
    cab: { negrita: true, colorTexto: "FFFFFF", colorFondo: "0D1B2A", alineacion: "center", ajustarTexto: true },
    celda: { ajustarTexto: true, vertical: "top" },
    negrita: { negrita: true, ajustarTexto: true, vertical: "top" },
    centro: { alineacion: "center", vertical: "top", ajustarTexto: true },
    fuerte: { negrita: true, alineacion: "center", vertical: "top", colorFondo: "DCFCE7", colorTexto: "14532D" },
    intermedia: { negrita: true, alineacion: "center", vertical: "top", colorFondo: "DBEAFE", colorTexto: "1E3A8A" },
    debil: { negrita: true, alineacion: "center", vertical: "top", colorFondo: "FEF3C7", colorTexto: "92400E" }
  };
  function hojasExcel(a, fecha) {
    const T = (texto, estilo = "celda") => ({ texto: texto == null ? "" : String(texto), estilo });
    const nom = a.titulo || corto(a.problema, 80) || "Análisis";
    const cabecera = (titulo, cols) => { const f = [[T(titulo, "titulo")], [T([a.unidad, "Exportado de la app ACR · Ishikawa · " + fecha].filter(lleno).join(" · "), "sub")], cols.map(x => T(x, "cab"))]; f[0][0].combinar = cols.length; return f; };
    const C = causasCon(a), X = a.acciones.filter(x => lleno(x.que)), N = numerosElegidas(a);
    const h1 = cabecera((a.tipo === "acr" ? "Análisis causa raíz · " : "Ishikawa · ") + nom, ["Campo", "Valor"]);
    [["Problema", a.problema], ["Dato", a.dato], ["Fuente del dato", a.fuenteDato], ["Unidad", a.unidad], ["Categorías de la espina", PLANTILLAS[a.plantilla].nom], ["Causas escritas", C.length], ["Causas de fondo elegidas", elegidas(a).length], ["Acciones", X.length], ["Notas", a.notas]]
      .forEach(([k, v]) => h1.push([T(k, "negrita"), T(v)]));
    const h2 = cabecera("Causas · " + nom, ["Categoría", "Causa", "¿Por qué? 1", "¿Por qué? 2", "¿Por qué? 3", "¿Por qué? 4", "¿Por qué? 5", "Causa de fondo", "Votos", "Elegida (nº)", "Cómo se comprueba", "Estado"]);
    categorias(a).forEach(c => causasDe(a, c.k).filter(x => lleno(x.texto)).forEach(x => h2.push([T(c.nom, "negrita"), T(x.texto), ...x.porques.map(p => T(p)), T(causaFondo(x)), { numero: x.votos || 0, estilo: "centro" }, T(x.elegida ? "Sí (" + N[x.id] + ")" : "", "centro"), T(x.comprobacion), T(ESTADOS_PRUEBA[x.prueba || ""], "centro")])));
    const h3 = cabecera("Acciones · " + nom, ["Nº", "Acción", "Causa que ataca", "Fuerza", "Tipo de acción", "Responsable", "Plazo", "Estado", "Indicador", "Numerador", "Denominador", "Nivel esperado", "Fecha de medida"]);
    X.forEach((x, i) => { const f = fuerzaAccion(x); h3.push([T(i + 1, "centro"), T(x.que, "negrita"), T(x.causas.map(id => { const c = a.causas.find(y => y.id === id); return c ? c.texto : ""; }).filter(lleno).join("; ")), T(f ? FUERZAS[f].nom : "", f || "centro"), T(x.categoria ? JERARQUIA[x.categoria].nom : ""), T(x.responsable), T(fmtFecha(x.plazo), "centro"), T(ESTADOS_ACCION[x.estado], "centro"), T(x.indicador.nombre), T(x.indicador.numerador), T(x.indicador.denominador), T(x.indicador.esperado, "centro"), T(fmtFecha(x.indicador.fecha), "centro")]); });
    return { estilos: ESTILOS_XLSX, hojas: [
      { nombre: "Análisis", filas: h1, opciones: { anchoColumnas: [26, 90], altoFilas: { 1: 24 }, primera: true } },
      { nombre: "Causas", filas: h2, opciones: { anchoColumnas: [18, 36, 28, 28, 28, 28, 28, 34, 8, 11, 34, 18], congelar: { filas: 3, columnas: 0 } } },
      { nombre: "Acciones", filas: h3, opciones: { anchoColumnas: [5, 40, 32, 12, 28, 22, 11, 12, 34, 26, 26, 12, 12], congelar: { filas: 3, columnas: 0 } } }
    ] };
  }

  // ---------- Saneado por esquema (lo que se carga o se importa nunca se usa sin pasar por aquí) ----------
  // [max] = texto; "b" = sí/no; "id" = id propio; "ref" = id de otro objeto; "ent" = entero ≥ 0; {en} = enumerado;
  // {lista: max, max} = lista de textos; {lista, keepEmpty: n} = lista de longitud fija; {de: esquema, max} = lista de objetos; {obj: esquema} = objeto anidado
  const idValido = v => typeof v === "string" && /^[a-z0-9-]{1,40}$/i.test(v);
  const txt = (v, max) => (typeof v === "string" || typeof v === "number") ? String(v).slice(0, max) : "";
  const TODAS_CATS = [...new Set(Object.values(PLANTILLAS).flatMap(p => p.cats.map(c => c.k)).concat(Array.from({ length: MAX_PROPIAS }, (_, i) => "p" + i)))];
  const ESQ = {
    causa: { id: "id", cat: { en: ["", ...TODAS_CATS] }, espina: "ref", texto: [500], porques: { lista: 500, keepEmpty: MAX_PORQUES }, votos: "ent", elegida: "b", comprobacion: [1000], prueba: { en: Object.keys(ESTADOS_PRUEBA) } },
    indicador: { nombre: [500], numerador: [500], denominador: [500], esperado: [60], fecha: [20], tipo: { en: ["", ...Object.keys(TIPOS_MEDIDA)] }, resultado: [100], alcanzado: { en: ["", "si", "no"] } },
    accion: { id: "id", que: [1500], categoria: { en: ["", ...Object.keys(JERARQUIA)] }, causas: { lista: "ref", max: 40 }, responsable: [300], plazo: [20], estado: { en: Object.keys(ESTADOS_ACCION) }, indicador: { obj: "indicador" }, nota: [1000], controla: { en: ["", ...Object.keys(CONTROLA)] }, direccion: { en: ["", "si", "no"] }, motivoDireccion: [1000] },
    miembro: { id: "id", perfil: [200], servicio: [200], papel: { en: Object.keys(PAPELES) }, implicado: "b" },
    respuesta: { id: [20], r: { en: ["", "si", "no", "na"] } },
    entrevista: { id: "id", perfil: [200], fecha: [20], hecha: "b", nota: [1000] },
    reunion: { id: "id", fecha: [20], duracion: [40], nota: [1000] },
    hecho: { id: "id", hora: [40], hecho: [1000], fuente: { en: ["", ...Object.keys(FUENTES)] }, debia: [1000], desajuste: "b", bien: "b" },
    problemaAt: { id: "id", texto: [500], hechoId: "ref" },
    afirmacion: { id: "id", causaId: "ref", texto: [2000], deber: [500], pruebas: [1000] },
    inmediata: { atendido: "b", seguro: "b", apartado: "b", informado: "b" },
    incidente: { clase: { en: ["", "ea", "casi", "sindano", "situacion"] }, fecha: [20], fechaDecision: [20], gravedad: [2], frecuencia: [2], conducta: { en: ["", "no", "si"] }, inmediata: { obj: "inmediata" }, nota: [1000] },
    informacion: { profesionales: [500], paciente: [500], direccion: [500], comision: [500], nota: [1000] },
    apoyo: { paciente: "b", profesionales: "b", nota: [1000] },
    analisis: { id: "id", tipo: { en: Object.keys(TIPOS) }, titulo: [200], unidad: [200], ambito: { en: ["hospital", "primaria", "otro"] }, fecha: [20], responsable: [200],
      incidente: { obj: "incidente" }, descripcion: [4000], problema: [600], dato: [500], fuenteDato: [300],
      equipo: { de: "miembro", max: 20 }, entrevistas: { de: "entrevista", max: 40 }, reuniones: { de: "reunion", max: 40 }, cronologia: { de: "hecho", max: 200 }, problemasAtencion: { de: "problemaAt", max: 30 },
      plantilla: { en: Object.keys(PLANTILLAS) }, categoriasPropias: { lista: 60, keepEmpty: MAX_PROPIAS }, causas: { de: "causa", max: 300 }, efectoPrincipal: [600], preguntas: { de: "respuesta", max: 120 },
      afirmaciones: { de: "afirmacion", max: 60 }, acciones: { de: "accion", max: 60 }, informacion: { obj: "informacion" }, apoyo: { obj: "apoyo" }, verificacion: { lista: 20, max: 20 },
      conclusiones: [5000], proxRevision: [20], notas: [3000], origen: [300], creado: [40], modificado: [40] }
  };
  const FABRICA = { respuesta: () => ({ id: "", r: "" }), causa: id => nuevaCausa(id), indicador: nuevoIndicador, accion: nuevaAccion, miembro: nuevoMiembro, entrevista: nuevaEntrevista, reunion: nuevaReunion, hecho: nuevoHecho, problemaAt: nuevoProblemaAt, afirmacion: nuevaAfirmacion,
    inmediata: () => nuevoAnalisis("x", "").incidente.inmediata, incidente: () => nuevoAnalisis("x", "").incidente, informacion: () => nuevoAnalisis("x", "").informacion, apoyo: () => nuevoAnalisis("x", "").apoyo, analisis: id => nuevoAnalisis(id, "") };
  function sanear(esq, o, genId) {
    if (!o || typeof o !== "object" || Array.isArray(o)) return null;
    const S = ESQ[esq], r = FABRICA[esq](genId());
    Object.keys(S).forEach(k => {
      const regla = S[k], v = o[k];
      if (regla === "id") r[k] = idValido(v) ? v : r[k];
      else if (regla === "ref") r[k] = idValido(v) ? v : "";
      else if (regla === "b") r[k] = v === true;
      else if (regla === "ent") { const n = num(v); r[k] = Number.isInteger(n) && n >= 0 && n < 1e6 ? n : 0; }
      else if (Array.isArray(regla)) { if (v !== undefined) r[k] = txt(v, regla[0]); }
      else if (regla.en && !regla.lista) r[k] = regla.en.includes(v) ? v : r[k];
      else if (regla.keepEmpty) r[k] = Array.from({ length: regla.keepEmpty }, (_, j) => Array.isArray(v) && typeof v[j] === "string" ? txt(v[j], regla.lista) : r[k][j]);
      else if (regla.lista) r[k] = Array.isArray(v) ? [...new Set(v.slice(0, regla.max * 2).map(x => regla.lista === "ref" ? (idValido(x) ? x : "") : txt(x, regla.lista)).filter(x => x))].slice(0, regla.max) : [];
      else if (regla.de) r[k] = Array.isArray(v) ? v.slice(0, regla.max).map(x => sanear(regla.de, x, genId)).filter(Boolean) : [];
      else if (regla.obj) r[k] = sanear(regla.obj, v, genId) || r[k];
    });
    return r;
  }
  function sanearAnalisis(o, genId, fecha) {
    const a = sanear("analisis", o, genId); if (!a) return null;
    if (!a.creado) a.creado = fecha; if (!a.modificado) a.modificado = a.creado;
    // Cada causa, en una categoría de la plantilla actual; referencias rotas fuera
    const validas = new Set(categorias(a).map(c => c.k)), primera = (categorias(a)[0] || { k: "" }).k;
    a.causas.forEach(x => { if (!validas.has(x.cat)) x.cat = primera; });
    const causas = new Set(a.causas.map(x => x.id)), hechos = new Set(a.cronologia.map(h => h.id));
    a.acciones.forEach(x => { x.causas = x.causas.filter(id => causas.has(id)); });
    a.afirmaciones.forEach(f => { if (!causas.has(f.causaId)) f.causaId = ""; });
    a.problemasAtencion.forEach(p => { if (!hechos.has(p.hechoId)) p.hechoId = ""; });
    const problemas = new Set(a.problemasAtencion.map(p => p.id));
    a.causas.forEach(x => { if (!problemas.has(x.espina)) x.espina = ""; });
    a.preguntas = a.preguntas.filter(q => lleno(q.id) && q.r);
    return a;
  }
  function sanearDatos(o, genId, fecha) {
    if (!o || typeof o !== "object" || !Array.isArray(o.analisis)) return null;
    return { analisis: o.analisis.slice(0, 300).map(x => sanearAnalisis(x, genId, fecha)).filter(Boolean) };
  }
  // Fusiona sin duplicar: si un id ya existe se conserva el más reciente
  function fusionar(actual, nuevo) {
    const m = new Map(actual.analisis.map(x => [x.id, x]));
    nuevo.analisis.forEach(x => { const y = m.get(x.id); if (!y || String(x.modificado) > String(y.modificado)) m.set(x.id, x); });
    return { analisis: Array.from(m.values()) };
  }

  const api = {
    VERSION_DATOS,
    // [eco]
    URL_AUD, URL_IND, URL_TM, URL_AMFE, URL_FLUJO, URL_DAFO, URL_MAPA, URL_RONDAS, URL_LC, URL_ANON,
    // [/eco]
    lleno, sinTildes, num, corto, normal, plural, listaY, fmtFecha, limpia,
    PLANTILLAS, EQ_ALTERNATIVA, MAX_PROPIAS, categorias, categoria, nombreCat, equivalencia, propuestaCambio, cambiarPlantilla,
    TIPOS, MAX_PORQUES, nuevoAnalisis, nuevaCausa, nuevoIndicador, nuevaAccion, nuevoMiembro, nuevaEntrevista, nuevaReunion, nuevoHecho, nuevoProblemaAt, nuevaAfirmacion,
    causaFondo, causasCon, causasDe, elegidas, ESTADOS_PRUEBA, ranking, numerosElegidas,
    FUERZAS, JERARQUIA, categoriaSugerida, fuerzaAccion, responsableGrupo, ESTADOS_ACCION, cuentaIncidentes,
    FRECUENCIAS, GRAVEDADES, MATRIZ_SAC, NIVELES_SAC, sac, nivelSAC,
    CLASES, PAPELES, PERFILES_ACR, FUENTES, masDias, plazos, avisosDecidir, avisosEquipo, avisosCronologia, espinasDe, categoriaPorEq, respuesta, responder,
    pareceDatoPaciente, hayDatoPersonal, palabrasNoNeutras, tipoProblema, esGenerica,
    avisosProblema, avisosCausa, avisosEspina, avisosElegir, avisosAcciones, avisoPrivacidad,
    PASOS, pasosDe, progreso, pasoPendiente, nombreAnalisis, siguientePaso, resumen, datosDibujo,
    REGLAS, palabrasVagas, avisosAfirmacion, afirmacionSugerida, cumpleReglas, avisosAfirmaciones, TIPOS_MEDIDA, CONTROLA, VERIFICACION, avisosCerrar, conclusionesSugeridas, accionesDe, documentoInforme,
    FORMATO, VERSION_INTERCAMBIO, paqueteIntercambio, leerIntercambio,
    documentoFicha, textoIndicador, hojasExcel,
    ESQ, sanear, sanearAnalisis, sanearDatos, fusionar
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.Logica = api;
})(typeof window !== "undefined" ? window : globalThis);
