// ============================================================
//  app.js — UI y estado · ACR · Ishikawa
//  Las reglas viven en logic.js (funciones puras), el dibujo de la espina en
//  dibujo.js y los textos didácticos y ejemplos en contenido.js. Aquí: datos
//  en localStorage, enrutado por hash, inicio con dos puertas, lista de
//  análisis, asistente por pasos, exportar la espina (copiar, PNG, SVG),
//  ficha en Word/PDF/Excel, ejemplos, Aprende, glosario, copias de seguridad.
//  Base copiada de AMFE (mismos patrones: data-k, refrescar sin perder el
//  foco, repintar conservando el scroll, borradores, ejemplos en memoria).
// ============================================================
(function () {
  "use strict";
  const L = window.Logica, C = window.Contenido, D = window.Dibujo;

  // ---------- Versión y novedades ----------
  // Al publicar cambios: añadir una entrada AL PRINCIPIO de NOVEDADES, poner su versión en los ?v= de index.html, en
  // APP_VERSION y subir CACHE_NAME en sw.js. Formato de versión: AAAA.NN.
  const APP_VERSION = "2026.05";
  const NOVEDADES = [
    { version: "2026.05", fecha: "Octubre 2026", titulo: "Publicada", cambios: [
      "Primera versión publicada, con el Ishikawa y el análisis causa raíz completos.",
      "Textos repasados: la portada, la bienvenida y «Acerca de» ya describen la app entera."
    ] },
    { version: "2026.04", fecha: "Octubre 2026", titulo: "Conexiones, Aprende completo, ejercicios y minicasos", cambios: [
      /*[eco]*/"«Traer de» AMFE o Mapa de Riesgos (un fallo con su causa, sus acciones y, desde la copia de AMFE, su Ishikawa), de Rondas de Seguridad (lo que falla una y otra vez), de Flujograma (los pasos como «lo que debería haber pasado») y de Indicadores y Lectura Crítica (el indicador y la evidencia de una acción).",/*[/eco]*/
      /*[ind] "Cargar el archivo de copia de AMFE, Mapa de Riesgos, Rondas de Seguridad, Flujograma, Indicadores o Lectura Crítica para empezar desde sus datos.", [/ind]*/
      "Aprende, completo: ocho temas, del porqué de no buscar culpables a cómo informar y apoyar después.",
      "Ponte a prueba: veinte preguntas por temas y dos ejercicios (¿qué regla incumple?, ¿qué fuerza tiene?).",
      "Seis minicasos: Atención Primaria, caídas con acciones débiles, un casi incidente de lateralidad, una afirmación que culpa, esterilización con las 6M y «falta de personal».",
      "Modo reunión para proyectar la espina y la cronología. Glosario con 42 términos."
    ] },
    { version: "2026.03", fecha: "Octubre 2026", titulo: "El análisis causa raíz completo: afirmaciones causales, medida, información e informe", cambios: [
      "Paso 6: afirmaciones causales con el formato «Como [causa], [efecto], lo que aumentó la probabilidad de [lo que pasó]» y comprobación de las cinco reglas de la causalidad del informe RCA² mientras escribes; propuesta de redacción desde cada causa de fondo.",
      "Paso 7: en el ACR, cada acción dice quién puede hacerla, si la dirección está de acuerdo y qué mide su indicador (que existe, que se hace o que funciona), con el resultado medido.",
      "Paso 8: información a los profesionales, al paciente o la familia, a la dirección y a la comisión; apoyo a las segundas víctimas; conclusiones propuestas; lista de verificación antes de cerrar.",
      "Informe del ACR en Word (con el dibujo de cada espina), PDF y Excel.",
      "El ejemplo de la sepsis, completo: las tres afirmaciones causales, las tres acciones con su indicador y la información a la familia."
    ] },
    { version: "2026.02", fecha: "Octubre 2026", titulo: "El análisis causa raíz: decidir, equipo y cronología", cambios: [
      "Paso 1 del ACR: tipo de incidente, matriz de riesgo SAC del SiNASP (hospital y atención primaria) con la recomendación para cada nivel, cultura justa, lo inmediato y los plazos (72 horas para empezar, 30 a 45 días para terminar).",
      "Paso 3: el equipo por perfiles y papeles (de 4 a 6, sin los implicados), con perfiles sugeridos; entrevistas y reuniones.",
      "Paso 4: la cronología de doble fila (lo que pasó frente a lo que debería haber pasado), con desajustes, lo que salió bien y problemas en la atención.",
      "Paso 5: una espina por cada problema en la atención, además de la principal, y 21 preguntas que ayudan a no olvidar nada: un «no» propone una causa.",
      "Ejemplo: el análisis causa raíz de la paciente de la sala de espera con sepsis (pasos 1 a 5)."
    ] },
    { version: "2026.01", fecha: "Octubre 2026", titulo: "Primera versión: el Ishikawa", cambios: [
      "Buscar las causas de un problema en cuatro pasos: el problema como un hecho medible, la espina de pescado con sus «¿por qué?», elegir y comprobar las causas de fondo, y acciones con su fuerza, responsable, plazo e indicador.",
      "Cinco juegos de categorías: las siete de la guía, los siete niveles de Vincent y del Protocolo de Londres, el Protocolo de Londres 2024, SEIPS y las 6M; y uno propio. Al cambiar de juego, la app propone a qué categoría va cada causa.",
      "La espina, lista para pegar: copiarla como imagen, descargarla en PNG de alta resolución o en SVG, y una plantilla en blanco para la reunión con pósits.",
      "Ficha del análisis en Word, PDF y Excel, con la espina dentro.",
      "Ejemplo: la reevaluación en la sala de espera de Urgencias (caso ficticio). Y tres temas de Aprende, glosario y cinco preguntas para ponerte a prueba.",
      "El análisis causa raíz completo (gravedad y frecuencia, equipo, cronología, afirmaciones causales, información y apoyo) llega en las próximas versiones."
    ] }
  ];
  const ENTREGA = 3;   // pasos ya construidos (ver L.PASOS[].entrega)

  // ---------- Utilidades ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const escMl = s => esc(s).replace(/\n/g, "<br>");
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const view = $("#view");
  const hoy = () => new Date().toISOString();
  const hoyIso = () => new Date().toISOString().slice(0, 10);
  const fechaCorta = iso => { const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("es-ES"); };
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const lleno = L.lleno, plural = L.plural;
  const clon = o => JSON.parse(JSON.stringify(o));
  const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const escribir = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };

  // ---------- Datos (solo en este dispositivo) ----------
  const KEY_DATOS = "acrishikawa-datos", KEY_INTERCAMBIO = "acrishikawa-intercambio";
  let datos = { analisis: [], ultimaCopia: null };
  (function cargar() {
    const crudo = leer(KEY_DATOS); if (!crudo) return;
    try {
      const o = JSON.parse(crudo), s = L.sanearDatos(o, genId, hoy());
      if (s) datos = { analisis: s.analisis, ultimaCopia: typeof o.ultimaCopia === "string" ? o.ultimaCopia : null };
    } catch (e) { /* datos dañados: se empieza de cero sin borrar lo guardado */ }
  })();
  // Los datos del usuario son los únicos que se guardan. Los ejemplos viven aparte, en memoria
  // (ids «ej-…»): se pueden tocar, pero ni se guardan ni se mezclan con los suyos.
  const datosUsuario = datos;
  let datosEjemplo = null, modoEjemplo = false;
  const esIdEjemplo = id => /^ej-/.test(id || "");
  function ejemplos() {
    if (!datosEjemplo) datosEjemplo = { analisis: C.EJEMPLOS.analisis.map(a => L.sanearAnalisis(clon(a), genId, hoy())), ultimaCopia: null };
    return datosEjemplo;
  }
  let tGuardar = null, avisoSinEspacio = false;
  function guardar(inmediato) {
    clearTimeout(tGuardar);
    const fn = () => {
      const ok = escribir(KEY_DATOS, JSON.stringify({ app: "acrishikawa", v: L.VERSION_DATOS, ultimaCopia: datosUsuario.ultimaCopia, analisis: datosUsuario.analisis }));
      // Paquete con forma fija para que otras apps del mismo dominio lo lean; nunca leen acrishikawa-datos
      try { escribir(KEY_INTERCAMBIO, JSON.stringify(L.paqueteIntercambio(datosUsuario.analisis, APP_VERSION, hoy()))); } catch (e) { /* */ }
      if (!ok && !avisoSinEspacio) { avisoSinEspacio = true; toast("No se ha podido guardar en este navegador (¿modo privado o sin espacio?). Haz una copia de seguridad.", 6000); }
    };
    if (inmediato) fn(); else tGuardar = setTimeout(fn, 250);
  }
  window.addEventListener("pagehide", () => guardar(true));
  const buscaAnalisis = id => datos.analisis.find(x => x.id === id);
  // Un análisis recién creado no se guarda hasta que se escribe algo
  const borradores = new Map();
  const esVacio = a => !L.causasCon(a).length && !a.acciones.length && !["titulo", "unidad", "problema", "dato", "descripcion"].some(k => lleno(a[k]));

  // ---------- Textos de ayuda reutilizables ----------
  const box = (tipo, tag, html) => `<div class="box box--${tipo}"><span class="box-tag">${tag}</span>${html}</div>`;
  const idea = html => box("idea", "Idea clave", `<p>${html}</p>`);
  const trampa = html => box("trampa", "Ojo, trampa", `<p>${html}</p>`);
  const practica = html => box("practica", "En la práctica", `<p>${html}</p>`);
  const KEY_FACIL = "acrishikawa-facil-abierto";
  const facil = (html, titulo = "Explicado fácil") => `<details class="facil" data-recordar="1"${leer(KEY_FACIL) === "1" ? " open" : ""}><summary>${titulo}</summary><div class="facil-body">${html}</div></details>`;
  const avisoHtml = a => a.nivel === "nota" ? `<div class="note">ℹ ${esc(a.texto)}</div>` : a.nivel === "error" ? `<div class="aviso-error">✕ ${esc(a.texto)}</div>` : `<div class="warn">⚠ ${esc(a.texto)}</div>`;
  const anonimizador = () => /*[eco]*/` <a href="${L.URL_ANON}" target="_blank" rel="noopener">Anonimizador RGPD ↗</a>`/*[/eco]*/ /*[ind] "" [/ind]*/;

  // ---------- Campos ----------
  function getPath(o, path) { return path.split(".").reduce((a, k) => (a == null ? undefined : a[k]), o); }
  function setPath(o, path, v) {
    const ks = path.split("."), ult = ks.pop();
    let a = o; ks.forEach(k => { if (a[k] == null || typeof a[k] !== "object") a[k] = {}; a = a[k]; });
    a[ult] = v;
  }
  let nAyuda = 0;
  function ayudaBtn(help) {
    if (!help) return { btn: "", box: "" };
    const id = "h" + (++nAyuda);
    return { btn: `<button type="button" class="info-btn" data-info="${id}" aria-expanded="false" aria-label="Ayuda">i</button>`, box: `<p class="help" id="help-${id}" hidden>${help}</p>` };
  }
  function campo(obj, path, label, o = {}) {
    const v = getPath(obj, path) || "", a = ayudaBtn(o.help);
    const bind = o.bind || `data-k="${path}"`;
    const ctrl = o.area
      ? `<textarea class="txt-in" ${bind} rows="${o.rows || 2}" placeholder="${esc(o.ph || "")}">${esc(v)}</textarea>`
      : `<div class="input-wrap"><input class="txt-in" ${bind} value="${esc(v)}" placeholder="${esc(o.ph || "")}"${o.tipo ? ` type="${o.tipo}"` : ""} autocomplete="off" /></div>`;
    return `<div class="field${o.destacado ? " field--destacado" : ""}"><div class="field-head"><label class="field-label">${label}</label>${o.opt ? '<span class="field-opt">(opcional)</span>' : ""}${a.btn}</div>${a.box}${o.sub ? `<p class="field-sub">${o.sub}</p>` : ""}${ctrl}${o.extra || ""}</div>`;
  }

  // ---------- Pasos ----------
  const disponible = p => p.entrega <= ENTREGA;
  function pasosInner(a, actual, g = L.progreso(a)) {
    return L.pasosDe(a).map(p => `<li><a href="#/analisis/${a.id}/${p.n}" class="wiz-step${p.n === actual ? " actual" : g[p.n] ? " hecho" : ""}${disponible(p) ? "" : " prox"}"${p.n === actual ? ' aria-current="step"' : ""} title="${esc(p.titulo + (disponible(p) ? "" : " (próximamente)"))}"><span class="wiz-num">${g[p.n] && p.n !== actual ? "✓" : p.n}</span><span class="wiz-lbl">${p.corto}</span></a></li>`).join("");
  }
  const pasosHtml = (a, actual) => `<ol class="wiz-steps wiz-steps--${L.pasosDe(a).length} no-print" aria-label="Pasos" data-zona="pasos">${pasosInner(a, actual)}</ol>`;

  // ---------- Informe (pie al imprimir) ----------
  function informePie() {
    return `<footer class="print-foot print-only">
      <span class="autor-titulo">Aplicación desarrollada por</span>
      <span class="autor"><b>Carlos J. Galán Doval</b> · Médico de Familia · Técnico en Calidad y Seguridad del Paciente</span>
      <span class="autor"><b>Rafael J. Romero de Castilla Gil</b> · Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente</span>
      <span class="autor-area">Área de Gestión Sanitaria Sur de Córdoba · Andalucía</span>
      <span class="autor-uso">De libre uso con fines docentes y divulgativos. No sustituye el criterio profesional.</span>
      <span class="footer-version">ACR · Ishikawa · versión ${APP_VERSION}</span>
    </footer>`;
  }

  // ---------- Pequeñas piezas comunes ----------
  const volver = (href, txt) => `<a class="volver-cuadro" href="${href}">← ${txt}</a>`;
  const nombre = a => L.nombreAnalisis(a);
  const fzBadge = (f, sugerida) => f ? `<span class="fz-b fz-b--${f}" title="${esc(L.FUERZAS[f].que)}">${L.FUERZAS[f].nom}${sugerida ? " (propuesta)" : ""}</span>` : `<span class="fz-b fz-b--sin">Sin clasificar</span>`;

  // ---------- Inicio: dos puertas ----------
  function renderHome() {
    const d = datosUsuario, sig = L.siguientePaso(d, ENTREGA), n = d.analisis.length;
    const diasCopia = d.ultimaCopia ? Math.floor((Date.now() - new Date(d.ultimaCopia)) / 864e5) : null;
    const avisoCopia = n && (diasCopia === null || diasCopia > 30)
      ? `<div class="warn">⚠ ${diasCopia === null ? "Aún no has hecho ninguna copia de seguridad." : `Tu última copia de seguridad es de hace ${diasCopia} días.`} Tus datos solo están en este dispositivo: guarda una copia.</div>` : "";
    const nc = d.analisis.reduce((s, a) => s + L.causasCon(a).length, 0), nx = d.analisis.reduce((s, a) => s + a.acciones.filter(x => lleno(x.que)).length, 0);
    view.innerHTML = `
      <section class="hero">
        <h1 class="hero-t"><span>ACR · Ishikawa</span></h1>
        <p class="hero-p">Detrás de cada error hay un sistema que lo hizo posible. Encuentra las <b>causas de fondo</b> de un problema o de un incidente, <b>paso a paso</b> y sin buscar culpables, y llévate <b>tu informe y tu espina de pescado</b>.</p>
      </section>
      <h2 class="sec-t">¿Qué quieres hacer?</h2>
      <div class="puertas">
        <a class="puerta" href="#/nuevo/ishikawa"><span class="puerta-ico" aria-hidden="true">🐟</span><b>Buscar las causas de un problema</b><span>Un diagrama de Ishikawa en equipo, en una hora: el problema, la espina, los «¿por qué?», las causas de fondo y las acciones.</span><span class="puerta-ej">Ejemplo: «En 7 de 25 episodios con esperas de más de 90 minutos no consta la reevaluación».</span></a>
        <a class="puerta puerta--acr" href="#/nuevo/acr"><span class="puerta-ico" aria-hidden="true">🔎</span><b>Analizar un incidente</b><span>El análisis causa raíz de un evento adverso o de un casi incidente grave, con el método del RCA² y del Protocolo de Londres.</span><span class="puerta-ej">Ejemplo: una paciente que empeora en la sala de espera y llega a la consulta con una sepsis grave.</span></a>
      </div>
      <details class="facil cual"><summary>¿Cuál necesito?</summary><div class="facil-body">
        <p><b>¿Le ha pasado algo concreto a un paciente</b> (o ha estado a punto)? Entonces es un <b>incidente</b>. Si causó un daño grave o pudo causarlo, y es un riesgo que puede repetirse, toca un <b>análisis causa raíz</b>: el SiNASP lo propone para los de riesgo extremo (SAC 1) y una versión simplificada para los de riesgo alto (SAC 2). Los de riesgo medio o bajo se analizan juntos, con otros parecidos.</p>
        <p><b>¿Es algo que pasa a menudo</b> en la unidad (un indicador que no se cumple, una queja que se repite, una no conformidad de una auditoría)? Entonces basta un <b>Ishikawa</b>.</p>
        <p>Un Ishikawa se puede convertir después en un análisis causa raíz sin perder nada.</p></div></details>
      <div class="siguiente">
        <span class="siguiente-tag">Tu siguiente paso</span>
        <p>${esc(sig.texto)}</p>
        <a class="btn btn--primary" href="${sig.href}">${esc(sig.btn)} →</a>
      </div>
      <h2 class="sec-t">Tus datos</h2>
      <div class="card datos-card">
        <div class="datos-cifras">
          <a href="#/analisis"><b>${n}</b><span>${n === 1 ? "análisis" : "análisis"}</span></a>
          <a href="#/analisis"><b>${nc}</b><span>${nc === 1 ? "causa" : "causas"}</span></a>
          <a href="#/analisis"><b>${nx}</b><span>${nx === 1 ? "acción" : "acciones"}</span></a>
        </div>
        ${avisoCopia}
        <p class="field-sub">Se guardan <b>solo en este dispositivo</b>. Para trabajar en equipo, pasa tu copia a los demás: al importarla se junta con lo suyo sin duplicar.${d.ultimaCopia ? ` Última copia: ${fechaCorta(d.ultimaCopia)}.` : ""}</p>
        <div class="toolbar"><button class="btn" data-act="copia">⬇ Copia de seguridad</button><button class="btn" data-act="importar">⬆ Importar copia</button></div>
      </div>
      <div class="guide">
        <a class="guide-card" href="#/ejemplos"><span class="guide-num">Ej</span><div><div class="guide-q">Ejemplo</div><div class="guide-a">El Ishikawa de la <b>sala de espera de Urgencias</b>, el <b>análisis causa raíz de la paciente con sepsis</b> y seis minicasos para practicar.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card" href="#/aprende"><span class="guide-num">?</span><div><div class="guide-q">Aprende</div><div class="guide-a">${C.TEMAS.length} temas <b>explicados fácil</b>: de por qué no buscamos culpables a las acciones fuertes y cómo informar.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card" href="#/prueba"><span class="guide-num">✓</span><div><div class="guide-q">Ponte a prueba</div><div class="guide-a">${C.TEST.length} preguntas con su <b>explicación</b>, y dos ejercicios prácticos.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card" href="#/glosario"><span class="guide-num">A–Z</span><div><div class="guide-q">Glosario</div><div class="guide-a">${C.GLOSARIO.length} términos <b>en lenguaje llano</b>, con buscador.</div></div><span class="guide-go">›</span></a>
        <!-- [eco] -->
        <a class="guide-card guide-card--hermana" href="${L.URL_AMFE}" target="_blank" rel="noopener"><span class="guide-num">A</span><div><div class="guide-q">AMFE ↗</div><div class="guide-a">App hermana: busca <b>qué puede fallar</b> en un proceso antes de que pase. Lo proactivo, frente a lo reactivo de esta app.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_IND}" target="_blank" rel="noopener"><span class="guide-num">%</span><div><div class="guide-q">Indicadores ↗</div><div class="guide-a">App hermana: <b>diseña el indicador</b> con el que medirás si tus acciones funcionan.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_AUD}" target="_blank" rel="noopener"><span class="guide-num">✓</span><div><div class="guide-q">Auditorías ↗</div><div class="guide-a">App hermana: <b>comprueba con una auditoría</b> si las acciones se aplican y si el problema ha mejorado.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_FLUJO}" target="_blank" rel="noopener"><span class="guide-num">→</span><div><div class="guide-q">Flujograma ↗</div><div class="guide-a">App hermana: <b>dibuja el proceso</b> tal como debería ser, para compararlo con lo que pasó.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_MAPA}" target="_blank" rel="noopener"><span class="guide-num">◆</span><div><div class="guide-q">Mapa de Riesgos ↗</div><div class="guide-a">App hermana: el <b>mapa de riesgos</b> de un proceso, con su AMFE y su flujograma.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_RONDAS}" target="_blank" rel="noopener"><span class="guide-num">✓</span><div><div class="guide-q">Rondas de Seguridad ↗</div><div class="guide-a">App hermana: <b>rondas de seguridad</b> en tu unidad; lo que falla una y otra vez merece un Ishikawa.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_DAFO}" target="_blank" rel="noopener"><span class="guide-num">D</span><div><div class="guide-q">DAFO · CAME ↗</div><div class="guide-a">App hermana: <b>analiza tu unidad</b> y decide por dónde empezar a mejorar.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_TM}" target="_blank" rel="noopener"><span class="guide-num">n</span><div><div class="guide-q">Tamaño Muestral ↗</div><div class="guide-a">App hermana: <b>cuántos casos revisar</b> para medir tus indicadores.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_LC}" target="_blank" rel="noopener"><span class="guide-num">LC</span><div><div class="guide-q">Lectura Crítica ↗</div><div class="guide-a">App hermana: <b>lee críticamente un artículo</b> antes de adoptar una acción de mejora.</div></div><span class="guide-go">›</span></a>
        <!-- [/eco] -->
      </div>
      ${practica(`<b>Protección de datos:</b> un análisis de causas busca fallos del sistema, no personas. No escribas nombres de pacientes ni de profesionales, números de historia ni fechas de nacimiento: usa perfiles («enfermera de triaje»).${anonimizador()}`)}`;
  }

  // ---------- Lista de análisis ----------
  function renderLista() {
    const lista = datos.analisis.slice().sort((a, b) => String(b.modificado).localeCompare(String(a.modificado)));
    view.innerHTML = `
      <h1 class="page-title">Mis análisis</h1>
      <p class="page-lead">Cada análisis busca las causas de fondo de un problema (Ishikawa) o de un incidente (análisis causa raíz).</p>
      <div class="toolbar no-print"><a class="btn btn--primary" href="#/nuevo/ishikawa">+ Buscar las causas de un problema</a><a class="btn" href="#/nuevo/acr">+ Analizar un incidente</a><a class="btn" href="#/analisis/ej-ish-sala/2">Ver el ejemplo</a></div>
      ${lista.length ? `<div class="cuadro-lista">${lista.map(tarjeta).join("")}</div>`
        : `<div class="placeholder-box"><p><b>Todavía no tienes ningún análisis.</b></p><p>Crea uno nuevo, o abre antes el ejemplo de la sala de espera para ver cómo queda.</p></div>`}`;
  }
  function tarjeta(a) {
    const r = L.resumen(a), g = L.progreso(a), disp = L.pasosDe(a).filter(disponible), hechos = disp.filter(p => g[p.n]).length;
    return `<div class="item-card">
      <a class="item-main" href="#/analisis/${a.id}">
        <b class="item-t">${lleno(nombre(a)) ? esc(L.corto(nombre(a), 110)) : '<span class="vacio">Análisis sin nombre</span>'}</b>
        <span class="item-s">${esc([L.TIPOS[a.tipo].nom, a.unidad].filter(lleno).join(" · "))}</span>
        <span class="badges"><span class="badge">${plural(r.causas, "causa", "causas")}</span><span class="badge">${plural(r.elegidas, "de fondo", "de fondo")}</span><span class="badge">${plural(r.acciones, "acción", "acciones")}</span>${r.fuertes ? `<span class="fz-b fz-b--fuerte">${plural(r.fuertes, "fuerte", "fuertes")}</span>` : ""}<span class="badge badge--prog">Pasos ${hechos}/${disp.length}</span></span>
      </a>
      <div class="item-pie"><span>Modificado: ${fechaCorta(a.modificado)}</span><span><button class="link-btn" data-act="an-dup" data-id="${a.id}">Duplicar</button> · <button class="link-btn link-btn--peligro" data-act="an-del" data-id="${a.id}">Borrar</button></span></div>
    </div>`;
  }

  // ---------- Un análisis: armazón común de los pasos ----------
  let actual = null, pasoActual = 1;
  const KEY_VISTA = "acrishikawa-vista";
  const vista = (() => { try { return Object.assign({ porques: true, solo: false }, JSON.parse(leer(KEY_VISTA) || "{}")); } catch (e) { return { porques: true, solo: false }; } })();
  const avisosDe = (a, k) => ({ problema: L.avisosProblema, espina: L.avisosEspina, elegir: L.avisosElegir, acciones: L.avisosAcciones, decidir: x => L.avisosDecidir(x, hoyIso()), equipo: L.avisosEquipo, cronologia: L.avisosCronologia, afirmaciones: L.avisosAfirmaciones, cerrar: x => L.avisosCerrar(x, hoyIso()) }[k] || (() => []))(a);
  const pasoK = (a, n) => (L.pasosDe(a)[n - 1] || {}).k;
  const avisosGenerales = (a, n) => { const k = pasoK(a, n); return [...L.avisoPrivacidad(a), ...avisosDe(a, k).filter(x => !x.causa && !x.accion && !x.miembro && !x.hecho && !x.afirmacion)].map(avisoHtml).join(""); };

  function renderAnalisis(a, n) {
    actual = a; pasoActual = n; nAyuda = 0;
    if (document.body.classList.contains("ver-informe")) { renderFicha(a); return; }
    const P = L.pasosDe(a), p = P[n - 1], disp = P.filter(disponible);
    const prev = disp.filter(x => x.n < n).pop(), next = disp.find(x => x.n > n);
    const cuerpo = !disponible(p) ? pasoProximo(a, p) : RENDER[p.k](a);
    view.innerHTML = `
      <div class="wiz-top no-print">${volver(modoEjemplo ? "#/ejemplos" : "#/analisis", modoEjemplo ? "Ejemplos" : "Mis análisis")}${pasosHtml(a, n)}</div>
      <div class="wiz-titulo"><span class="wiz-paso">${esc(L.TIPOS[a.tipo].nom)} · paso ${n} de ${P.length}${lleno(nombre(a)) ? " · " + esc(L.corto(nombre(a), 60)) : ""}</span><h1 class="page-title">${p.titulo}</h1></div>
      ${cuerpo}
      <div class="wiz-nav no-print">${prev ? `<a class="btn" href="#/analisis/${a.id}/${prev.n}">← ${prev.corto}</a>` : `<span></span>`}${next ? `<a class="btn btn--primary" href="#/analisis/${a.id}/${next.n}">${next.corto} →</a>` : `<span></span>`}</div>`;
    pintarEspinas();
  }
  function pasoProximo(a, p) {
    const sig = L.pasosDe(a).filter(disponible).find(x => x.n > p.n);
    return `<p class="page-lead">${p.que}</p>
      <div class="placeholder-box"><p><b>Este paso llegará en una próxima versión.</b></p>
      <p>Lo que escribas ahora se conserva.</p>
      <div class="toolbar" style="justify-content:center"><a class="btn" href="#/aprende/1">Repasar en «Aprende»</a>${sig ? `<a class="btn btn--primary" href="#/analisis/${a.id}/${sig.n}">Ir al paso ${sig.n} →</a>` : ""}</div></div>`;
  }

  // ---------- Paso: el problema ----------
  function pasoProblema(a) {
    return `<p class="page-lead">El problema es el <b>efecto</b>: lo que va en la cabeza del pez. Escríbelo como un <b>hecho concreto y medible</b>, no como una opinión ni como una solución.</p>
      ${facil(`<p>Imagina que el coche no arranca una mañana. «La batería está descargada» es un hecho. «El coche es un desastre» es una opinión. «Hay que comprar otro coche» es una solución. Solo con el hecho se pueden buscar causas.</p>
        <ul><li>Mal: «La sala de espera es un caos».</li><li>Mal: «Falta personal en la sala de espera».</li><li>Bien: «En 7 de los 25 episodios revisados de pacientes con esperas superiores a 90 minutos no consta la reevaluación».</li></ul>`)}
      <div class="card">
        ${campo(a, "problema", "El problema, en una frase", { area: true, rows: 3, destacado: true, ph: "Qué pasa, a quién, dónde o cuándo, y cuánto", help: "Un hecho que se puede comprobar. Si lleva un número (cuántos de cuántos), mejor: así sabréis luego si ha mejorado." })}
        <div data-zona="avisos">${avisosGenerales(a, pasoActual)}</div>
        ${campo(a, "dato", "El dato que lo demuestra", { ph: "Por ejemplo: 7 de 25 episodios (28 %)", opt: true })}
        ${campo(a, "fuenteDato", "De dónde sale el dato", { ph: "Auditoría, indicador, notificaciones, reclamaciones…", opt: true })}
        ${campo(a, "titulo", "Título corto", { ph: "Por ejemplo: Reevaluación en la sala de espera", opt: true, help: "Para reconocer el análisis en tu lista. Si no lo pones, se usa el problema." })}
        ${campo(a, "unidad", "Unidad o servicio", { opt: true })}
        ${a.tipo === "acr" ? campo(a, "descripcion", "Qué pasó (resumen)", { area: true, rows: 4, opt: true, ph: "Sin nombres ni datos que identifiquen a nadie", help: "Breve: lo que se sabe al empezar. La cronología detallada llega en el paso 4." }) : ""}
      </div>
      <div class="card traer no-print"><h3 class="sub-h">¿Viene de otra app?</h3>
        <p class="field-sub">Empieza desde un fallo de un AMFE o de un Mapa de Riesgos (el fallo, su causa, sus acciones y, desde la copia de AMFE, su Ishikawa), o desde lo que falla una y otra vez en las rondas de seguridad. Se copia: luego puedes cambiarlo todo.</p>
        <div class="toolbar"><button class="btn" data-act="traer" data-f="amfe">Traer de AMFE</button><button class="btn" data-act="traer" data-f="mapa">Traer de Mapa de Riesgos</button><button class="btn" data-act="traer" data-f="rondas">Traer de Rondas de Seguridad</button></div>
        ${lleno(a.origen) ? `<p class="field-sub">Origen: ${esc(a.origen)}</p>` : ""}</div>
      ${trampa(`Sin nombres, números de historia ni fechas de nacimiento: ni del paciente ni de los profesionales.${anonimizador()}`)}`;
  }

  // ---------- Paso: la espina ----------
  const bca = (x, f) => `data-ca="${x.id}" data-f="${f}"`;
  function causaHtml(a, x) {
    const nPq = x.porques.filter(lleno).length, visibles = Math.min(L.MAX_PORQUES, Math.max(1, x.porques.map(lleno).lastIndexOf(true) + 2));
    return `<div class="cau" data-cid="${x.id}">
      <div class="cau-fila"><input class="txt-in cau-in${x.elegida ? " cau-in--el" : ""}" ${bca(x, "texto")} value="${esc(x.texto)}" placeholder="Causa posible" autocomplete="off" aria-label="Causa" />
        <button type="button" class="icon-btn" data-act="ca-del" data-id="${x.id}" aria-label="Quitar la causa" title="Quitar">✕</button></div>
      <details class="cau-pq"${nPq ? " open" : ""}><summary>¿Por qué?${nPq ? ` <span class="cau-n">${nPq}</span>` : ""}</summary>
        ${x.porques.slice(0, visibles).map((p, j) => `<div class="pq-fila"><span class="pq-n">${j + 1}</span><input class="txt-in cau-in cau-in--pq" ${bca(x, "porques." + j)} value="${esc(p)}" placeholder="${j ? "¿Y por qué?" : "¿Por qué pasa?"}" autocomplete="off" /></div>`).join("")}
        ${visibles < L.MAX_PORQUES ? "" : `<p class="field-sub">Cinco es orientativo: para cuando llegues a algo que se pueda cambiar y medir.</p>`}
      </details>
      <div data-zcau="${x.id}">${L.avisosCausa(a, Object.assign({}, x, { elegida: false })).map(avisoHtml).join("")}</div>
    </div>`;
  }
  let espinaActual = "";   // "" = la principal; si no, el id de un problema en la atención
  function espinaHtml(a, o = {}) {
    const d = L.datosDibujo(a, { porques: vista.porques, soloElegidas: vista.solo, espina: espinaActual });
    return D.svg(D.colocar(d, o), { titulo: "Diagrama de Ishikawa: " + (a.problema || "") });
  }
  // La espina en pantalla va en un «papel» blanco (igual que se exporta); en el móvil se desplaza dentro de su caja
  const espinaCaja = (a, extra = "") => `<div class="esp-graf${extra}" data-zesp="1" role="figure" aria-label="Diagrama de Ishikawa">${espinaHtml(a)}</div>`;
  const btnReunion = () => `<button type="button" class="btn btn--sm" data-act="reunion">${document.body.classList.contains("modo-reunion") ? "Salir del modo reunión" : "🖥 Modo reunión"}</button>`;
  function opcionesVista() {
    return `<div class="esp-op no-print">${btnReunion()}<label><input type="checkbox" data-act="vista-porques"${vista.porques ? " checked" : ""} /> Ver los «¿por qué?»</label><label><input type="checkbox" data-act="vista-solo"${vista.solo ? " checked" : ""} /> Solo las causas de fondo</label></div>`;
  }
  function selectorEspinas(a) {
    const E = L.espinasDe(a); if (a.tipo !== "acr") return "";
    return `<div class="card esp-sel no-print"><div class="field-head"><label class="field-label">¿Qué espina estás llenando?</label>${ayudaBtn("La principal lleva el problema en la cabeza. Si en la cronología marcaste problemas en la atención, cada uno puede tener su propia espina (como propone el Protocolo de Londres): sus factores suelen ser distintos.").btn}</div>
      <div class="chips">${E.map(e => `<button type="button" class="chip${(espinaActual || "") === e.id ? " active" : ""}" data-act="espina-sel" data-id="${e.id}">${e.id ? "" : "★ "}${esc(L.corto(e.texto, 60))} <span class="chip-n">${L.causasCon(a).filter(x => (x.espina || "") === e.id).length}</span></button>`).join("")}</div>
      ${E.length === 1 ? `<p class="field-sub">Si quieres una espina por cada problema en la atención, márcalos en el paso 4.</p>` : ""}</div>`;
  }
  function preguntasHtml(a) {
    if (a.tipo !== "acr") return "";
    const Q = C.PREGUNTAS, n = Q.filter(q => L.respuesta(a, q.id)).length;
    return `<details class="facil preg no-print"${n && n < Q.length ? " open" : ""}><summary>Preguntas que ayudan a no olvidar nada${n ? ` <span class="cau-n">${n}/${Q.length}</span>` : ""}</summary><div class="facil-body">
      <p class="field-sub">Repasadlas en equipo. Un «no» propone una causa en su categoría de esta espina; luego la ajustáis. Adaptadas de las preguntas desencadenantes del informe RCA², del marco de la Joint Commission y del Protocolo de Londres.</p>
      ${Q.map(q => { const r = L.respuesta(a, q.id), cat = L.categoriaPorEq(a, q.eq); return `<div class="preg-q"><span>${esc(q.q)}</span><span class="seg seg--sm" role="group">${[["si", "Sí"], ["no", "No"], ["na", "No aplica"]].map(([v, t]) => `<button type="button" class="${r === v ? "active" : ""}" data-act="preg" data-id="${q.id}" data-v="${v}">${t}</button>`).join("")}</span>${r === "no" ? `<button type="button" class="link-btn" data-act="preg-causa" data-id="${q.id}" data-cat="${cat}">+ «${esc(q.causa)}» en ${esc(L.nombreCat(a, cat).toLowerCase())}</button>` : ""}</div>`; }).join("")}
    </div></details>`;
  }
  function pasoEspina(a) {
    const cats = L.categorias(a), P = L.PLANTILLAS;
    if (!L.espinasDe(a).some(e => e.id === (espinaActual || ""))) espinaActual = "";
    return `<p class="page-lead">Escribe las <b>causas posibles</b> en su categoría y, en cada una, pregunta <b>«¿por qué?»</b> hasta llegar a algo que se pueda cambiar y medir. La espina se dibuja sola.</p>
      ${facil(`<p>El problema va en la cabeza del pez. Cada espina es una categoría de causas. No hace falta rellenarlas todas: sirven para que no se os escape nada.</p>
        <p><b>Cómo hacerlo en equipo</b> (60 minutos): 5 min para presentar el problema y la regla («buscamos causas del sistema, no culpables»); 10 min de ideas en silencio, cada uno en sus tarjetas; 20 min de ronda y colocación de cada tarjeta en su categoría; 15 min de «¿por qué?» en las causas más repetidas; 10 min para elegir dos o tres causas de fondo y decidir cómo comprobarlas.</p>`)}
      ${a.problema ? "" : `<div class="warn">⚠ Aún no has escrito el problema. <a href="#/analisis/${a.id}/${L.pasosDe(a).find(p => p.k === "problema").n}">Escríbelo primero</a>: es la cabeza del pez.</div>`}
      <div class="card esp-plant no-print">
        <div class="field"><div class="field-head"><label class="field-label" for="sel-plantilla">Categorías de la espina</label></div>
          <div class="input-wrap"><select class="txt-in" id="sel-plantilla" data-act-sel="plantilla">${Object.keys(P).map(k => `<option value="${k}"${a.plantilla === k ? " selected" : ""}>${esc(P[k].nom)}</option>`).join("")}</select></div>
          <p class="field-sub">${esc(P[a.plantilla].que)}</p></div>
        ${a.plantilla === "propia" ? `<div class="propias">${a.categoriasPropias.map((c, i) => `<input class="txt-in" data-k="categoriasPropias.${i}" data-repinta="1" value="${esc(c)}" placeholder="Categoría ${i + 1}${i > 1 ? " (opcional)" : ""}" autocomplete="off" />`).join("")}</div>
          <p class="field-sub">Escribe al menos dos. Al salir de cada cuadro se actualiza la espina.</p>` : ""}
      </div>
      ${selectorEspinas(a)}
      ${opcionesVista()}
      ${espinaCaja(a)}
      <div data-zona="avisos">${avisosGenerales(a, pasoActual)}</div>
      ${preguntasHtml(a)}
      ${cats.length ? cats.map(c => `<div class="card cat-b">
        <div class="cat-cab"><b>${esc(c.nom)}</b>${c.que ? `<span>${esc(c.que)}</span>` : ""}</div>
        ${L.causasDe(a, c.k, espinaActual || "").map(x => causaHtml(a, x)).join("")}
        <button type="button" class="btn btn--sm" data-act="ca-add" data-cat="${c.k}">+ Causa en ${esc(c.nom.toLowerCase())}</button>
      </div>`).join("") : `<div class="placeholder-box"><p>Escribe arriba el nombre de tus categorías.</p></div>`}
      ${a.tipo === "acr" ? pasoElegir(a, true) : ""}`;
  }

  // ---------- Paso: elegir y comprobar ----------
  function filaElegir(a, x, N) {
    return `<div class="eleg${x.elegida ? " eleg--si" : ""}" data-eid="${x.id}">
      <div class="eleg-cab">
        <label class="eleg-chk" title="Causa de fondo"><input type="checkbox" data-act="ca-elegir" data-id="${x.id}"${x.elegida ? " checked" : ""} /><span class="sr">Causa de fondo</span></label>
        <div class="eleg-t"><b>${x.elegida && N[x.id] ? `<span class="eleg-num">${N[x.id]}</span>` : ""}${esc(x.texto)}</b><span class="field-sub">${esc(L.nombreCat(a, x.cat))}${L.causaFondo(x) !== x.texto ? ` · de fondo: ${esc(L.causaFondo(x))}` : ""}</span></div>
        <div class="votos" role="group" aria-label="Votos"><button type="button" class="icon-btn" data-act="voto" data-id="${x.id}" data-v="-1" aria-label="Quitar un voto">−</button><span class="votos-n" title="Votos">${x.votos || 0}</span><button type="button" class="icon-btn" data-act="voto" data-id="${x.id}" data-v="1" aria-label="Añadir un voto">+</button></div>
      </div>
      ${x.elegida ? `<div class="eleg-det">
        ${campo(x, "comprobacion", "¿Cómo la vais a comprobar con datos?", { bind: bca(x, "comprobacion"), area: true, ph: "Revisar historias, observar, entrevistar, un indicador…" })}
        <div class="seg seg--wrap" role="group" aria-label="Estado">${Object.entries(L.ESTADOS_PRUEBA).map(([k, t]) => `<button type="button" class="${(x.prueba || "") === k ? "active" : ""}" data-act="prueba" data-id="${x.id}" data-v="${k}">${t}</button>`).join("")}</div>
      </div>` : ""}
    </div>`;
  }
  function pasoElegir(a, dentroDeEspina) {
    const R = L.ranking(a), N = L.numerosElegidas(a);
    const cuerpo = R.length ? `<div class="card">${R.map(x => filaElegir(a, x, N)).join("")}</div>` : `<div class="placeholder-box"><p>Primero escribe las causas en la espina.</p></div>`;
    if (dentroDeEspina) return `<h2 class="sec-t">Las causas de fondo</h2><p class="field-sub">Marca las más importantes y decide cómo comprobarlas con datos.</p><div data-zona="avisosElegir">${L.avisosElegir(a).filter(x => !x.causa).map(avisoHtml).join("")}</div>${cuerpo}`;
    return `<p class="page-lead">Marca las <b>dos o tres causas de fondo</b> que el equipo considera más importantes y decide <b>cómo comprobarlas</b> con datos antes de actuar.</p>
      ${facil(`<p>Si no os ponéis de acuerdo, <b>votad</b>: cada persona reparte 3 puntos (o da 3, 2 y 1 a sus tres favoritas) y apuntáis aquí el total de cada causa. La app las ordena por votos.</p>
        <p>Luego, <b>comprobad</b>: una causa probable no es una causa demostrada. En la sala de espera, el equipo pensaba que el problema era de noche; los datos de la auditoría lo confirmaron (cinco de los siete incumplimientos eran de noche).</p>`)}
      ${opcionesVista()}
      ${espinaCaja(a)}
      <div data-zona="avisos">${avisosGenerales(a, pasoActual)}</div>
      ${cuerpo}`;
  }

  // ---------- Paso: acciones y exportar ----------
  const bac = (x, f) => `data-ac="${x.id}" data-f="${f}"`;
  function selectorCategoria(x) {
    const G = { fuerte: "Más fuertes", intermedia: "Intermedias", debil: "Más débiles" }, sug = L.categoriaSugerida(x.que);
    return `<div class="field"><div class="field-head"><label class="field-label">Tipo de acción</label>${ayudaBtn("Elige el tipo de acción de la jerarquía del informe RCA²: la fuerza sale de aquí. Si no eliges, la app propone uno por el texto.").btn}</div>
      <div class="input-wrap"><select class="txt-in" ${bac(x, "categoria")}><option value="">${sug ? "Propuesto: " + esc(L.JERARQUIA[sug].nom) : "Sin elegir"}</option>${Object.keys(G).map(f => `<optgroup label="${G[f]}">${Object.entries(L.JERARQUIA).filter(([, j]) => j.f === f).map(([k, j]) => `<option value="${k}"${x.categoria === k ? " selected" : ""}>${esc(j.nom)}</option>`).join("")}</optgroup>`).join("")}</select></div>
      ${x.categoria ? `<p class="field-sub">Ejemplo: ${esc(L.JERARQUIA[x.categoria].ej)}</p>` : ""}</div>`;
  }
  function accionHtml(a, x, i) {
    const E = L.elegidas(a), f = L.fuerzaAccion(x);
    return `<div class="card acc" data-aid="${x.id}">
      <div class="acc-cab"><b>Acción ${i + 1}</b><span data-zfz="${x.id}">${fzBadge(f, !x.categoria && f)}</span><button type="button" class="icon-btn" data-act="ac-del" data-id="${x.id}" aria-label="Quitar la acción" title="Quitar">✕</button></div>
      ${campo(x, "que", "Qué se va a hacer", { bind: bac(x, "que"), area: true, ph: "Concreto: qué cambia en el sistema" })}
      ${selectorCategoria(x)}
      ${E.length ? `<div class="field"><div class="field-head"><label class="field-label">Causa de fondo que ataca</label></div><div class="chips">${E.map(c => `<button type="button" class="chip${x.causas.includes(c.id) ? " active" : ""}" data-acc="${x.id}" data-c="${c.id}">${esc(L.corto(c.texto, 50))}</button>`).join("")}</div></div>` : ""}
      <div class="grid-2">
        ${campo(x, "responsable", "Responsable", { bind: bac(x, "responsable"), ph: "Un puesto concreto", help: "Una persona con autoridad para hacerlo (un puesto, no un comité ni «el equipo»)." })}
        ${campo(x, "plazo", "Plazo", { bind: bac(x, "plazo"), tipo: "date" })}
      </div>
      <div class="field"><div class="field-head"><label class="field-label">Estado</label></div><div class="seg seg--wrap" role="group">${Object.entries(L.ESTADOS_ACCION).map(([k, t]) => `<button type="button" class="${x.estado === k ? "active" : ""}" data-acpick="${x.id}" data-f="estado" data-v="${k}">${t}</button>`).join("")}</div></div>
      ${a.tipo === "acr" ? `<div class="grid-2"><div class="field"><div class="field-head"><label class="field-label">Quién puede hacerla</label>${ayudaBtn("Clasifica cada acción según quién la controla (Protocolo de Londres): así cada una va a quien puede ponerla en marcha.").btn}</div><div class="input-wrap"><select class="txt-in" ${bac(x, "controla")}><option value="">Elige…</option>${Object.entries(L.CONTROLA).map(([k, t]) => `<option value="${k}"${x.controla === k ? " selected" : ""}>${t}</option>`).join("")}</select></div></div>
        <div class="field"><div class="field-head"><label class="field-label">¿La dirección está de acuerdo?</label>${ayudaBtn("El equipo propone las acciones más eficaces que se le ocurran, sin recortarse; la dirección decide si merecen la inversión. Solo ella puede aceptar el riesgo de no hacerla (RCA²).").btn}</div><div class="seg" role="group">${[["si", "Sí"], ["no", "No"]].map(([v, t]) => `<button type="button" class="${x.direccion === v ? "active" : ""}" data-acpick="${x.id}" data-f="direccion" data-v="${v}">${t}</button>`).join("")}</div></div></div>
      ${x.direccion === "no" ? campo(x, "motivoDireccion", "Por qué no, y qué se hace en su lugar", { bind: bac(x, "motivoDireccion"), area: true }) : ""}` : ""}
      <details class="acc-ind"${lleno(x.indicador.nombre) ? " open" : ""}><summary>Indicador: ¿cómo sabréis si funciona?</summary>
        ${a.tipo === "acr" ? `<div class="field"><div class="field-head"><label class="field-label">Qué mide</label>${ayudaBtn("Tres medidas en el tiempo (guía de acciones del NHS): que la acción existe, que se hace como se previó y, la que importa, que funciona. Empieza por la que puedas medir pronto, pero no te quedes ahí.").btn}</div><div class="seg seg--wrap" role="group">${Object.entries(L.TIPOS_MEDIDA).map(([k, t]) => `<button type="button" class="${x.indicador.tipo === k ? "active" : ""}" data-acpick="${x.id}" data-f="indicador.tipo" data-v="${k}">${t}</button>`).join("")}</div></div>` : ""}
        ${campo(x, "indicador.nombre", "Indicador", { bind: bac(x, "indicador.nombre"), ph: "Por ejemplo: % de pacientes en espera reevaluados dentro de los 90 minutos" })}
        <div class="grid-2">${campo(x, "indicador.numerador", "Numerador", { bind: bac(x, "indicador.numerador"), ph: "Los casos que cumplen", opt: true })}${campo(x, "indicador.denominador", "Denominador", { bind: bac(x, "indicador.denominador"), ph: "Todos los casos que se miran", opt: true })}</div>
        <div class="grid-2">${campo(x, "indicador.esperado", "Nivel esperado", { bind: bac(x, "indicador.esperado"), ph: "≥ 90 %" })}${campo(x, "indicador.fecha", "Cuándo se mide", { bind: bac(x, "indicador.fecha"), tipo: "date" })}</div>
        <div class="grid-2">${campo(x, "indicador.resultado", "Resultado medido", { bind: bac(x, "indicador.resultado"), ph: "Por ejemplo: 22 de 25 (88 %)", opt: true })}<div class="field"><div class="field-head"><label class="field-label">¿Se alcanzó?</label></div><div class="seg" role="group">${[["si", "Sí"], ["no", "No"]].map(([v, t]) => `<button type="button" class="${x.indicador.alcanzado === v ? "active" : ""}" data-acpick="${x.id}" data-f="indicador.alcanzado" data-v="${v}">${t}</button>`).join("")}</div></div></div>
        <div class="toolbar no-print"><button type="button" class="btn btn--sm" data-act="traer" data-f="ind" data-id="${x.id}">Traer de Indicadores</button></div>
        <p class="field-sub">Mide lo que cambia (lo que se hace, en cuántos casos de cuántos), no el número de incidentes notificados.<!--[eco]--> Para diseñarlo con calma, usa la app <a href="${L.URL_IND}" target="_blank" rel="noopener">Indicadores ↗</a>; para saber cuántos casos revisar, <a href="${L.URL_TM}" target="_blank" rel="noopener">Tamaño Muestral ↗</a>.<!--[/eco]--></p>
      </details>
      ${campo(x, "nota", "Notas y evidencia", { bind: bac(x, "nota"), area: true, opt: true, ph: "Por qué esta acción: evidencia, experiencia de otros centros…" })}
      <div class="toolbar no-print"><button type="button" class="btn btn--sm" data-act="traer" data-f="lc" data-id="${x.id}" title="Añade a las notas la evidencia de un artículo leído con la app Lectura Crítica">📄 Traer de Lectura Crítica</button></div>
      <div data-zac="${x.id}">${L.avisosAcciones(a).filter(y => y.accion === x.id).map(avisoHtml).join("")}</div>
    </div>`;
  }
  function pasoAcciones(a) {
    const X = a.acciones;
    return `<p class="page-lead">Cada causa de fondo pide una <b>acción que la ataque</b>, con responsable, plazo e <b>indicador</b>. Buscad acciones <b>fuertes</b> (cambian el sistema y dependen poco de la memoria) o intermedias; las débiles, como complemento.</p>
      ${facil(`<p>No todas las acciones protegen igual. Las que dependen de que alguien se acuerde (formar, recordar, poner un cartel, escribir un procedimiento) son <b>débiles</b>: funcionan mientras se tienen presentes. Las que cambian el sistema para que el error sea difícil o imposible son <b>fuertes</b>: que el programa no deje cerrar el triaje sin las constantes.</p>
        <p>El informe RCA² pide <b>al menos una acción fuerte o intermedia</b>. Muchas veces la primera idea es débil: pregunta «¿y si cambiamos el proceso?».</p>`)}
      <div data-zona="avisos">${avisosGenerales(a, pasoActual)}</div>
      ${X.map((x, i) => accionHtml(a, x, i)).join("")}
      <div class="toolbar no-print"><button class="btn btn--primary" data-act="ac-add">+ Acción</button></div>
      <h2 class="sec-t">Tu espina y tu informe</h2>
      <div class="card export-card">
        ${opcionesVista()}
        ${espinaCaja(a)}
        <p class="field-sub">Para pegarla en Word, PowerPoint o un correo. La imagen PNG sale a alta resolución; la SVG se amplía sin perder calidad.</p>
        <div class="toolbar"><button class="btn btn--primary" data-act="ex-copiar">📋 Copiar imagen</button><button class="btn" data-act="ex-png">⬇ PNG</button><button class="btn" data-act="ex-svg">⬇ SVG</button><button class="btn" data-act="ex-blanco" title="Plantilla de la espina vacía, con tus categorías, para imprimir en A3 y trabajar con pósits">🖨 Plantilla en blanco</button></div>
        <h3 class="sub-h">El informe</h3>
        <p class="field-sub">${a.tipo === "acr" ? "El informe completo del análisis causa raíz: incidente y decisión, equipo, cronología, problemas en la atención, espinas, afirmaciones causales, plan de acción, información y conclusiones. Se completa en el paso 8." : "El problema, la espina, la tabla de causas, las causas de fondo y cómo se comprueban, y las acciones con su indicador."}</p>
        <div class="toolbar"><button class="btn" data-act="ver-ficha">👁 Ver e imprimir (PDF)</button><button class="btn" data-act="doc-word">⬇ Word</button><button class="btn" data-act="excel">⬇ Excel</button></div>
      </div>
      ${campo(a, "notas", "Notas", { area: true, opt: true, ph: "Cómo se hizo (sesión, técnica), qué queda pendiente…" })}`;
  }

  // ---------- ACR · Paso 1: ¿Hace falta un ACR? ----------
  const segK = (a, path, opciones) => `<div class="seg seg--wrap" role="group">${opciones.map(([v, t]) => `<button type="button" class="${getPath(a, path) === v ? "active" : ""}" data-kpick="${path}" data-v="${v}">${t}</button>`).join("")}</div>`;
  function sacHtml(a) {
    const n = L.nivelSAC(a), G = L.GRAVEDADES[a.ambito === "primaria" ? "primaria" : "hospital"], M = L.MATRIZ_SAC[a.ambito === "primaria" ? "primaria" : "hospital"];
    const g = Number(a.incidente.gravedad), f = Number(a.incidente.frecuencia);
    return `<div class="sac-res">${n ? `<span class="sac-b sac-b--${n}">${L.NIVELES_SAC[n].nom}</span><span>${esc(L.NIVELES_SAC[n].que)}</span>` : `<span class="field-sub">Elige la gravedad y la frecuencia para ver el nivel de riesgo.</span>`}</div>
      <details class="facil"><summary>Ver la matriz SAC del SiNASP (${a.ambito === "primaria" ? "atención primaria" : "hospital"})</summary><div class="facil-body"><div class="table-wrap"><table class="mini sac-t"><thead><tr><th>Gravedad \\ Frecuencia</th>${L.FRECUENCIAS.map(x => `<th>${x}</th>`).join("")}</tr></thead><tbody>${M.map((fila, i) => `<tr><th>${esc(L.corto(G[i], 60))}</th>${fila.map((z, j) => `<td class="sac-c sac-c--${z}${g === i + 1 && f === j + 1 ? " sac-c--sel" : ""}">${L.NIVELES_SAC[z].n}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="field-sub">1 = riesgo extremo · 2 = alto · 3 = medio · 4 = bajo. Fuente: SiNASP, Manual para el notificante (2024).</p></div></details>`;
  }
  function pasoDecidir(a) {
    const I = a.incidente, P = L.plazos(a, hoyIso()), G = L.GRAVEDADES[a.ambito === "primaria" ? "primaria" : "hospital"];
    return `<p class="page-lead">No todos los incidentes necesitan un ACR completo. Decídelo con un criterio explícito: la <b>gravedad</b> del daño (real o posible) y la <b>frecuencia</b> con que puede repetirse.</p>
      ${facil(`<p>El SiNASP clasifica cada incidente con la <b>matriz SAC</b>: cruza la gravedad con la frecuencia y da un nivel de riesgo del 1 (extremo) al 4 (bajo). Los de riesgo extremo se analizan con un ACR; los de riesgo alto, con un ACR simplificado; los de riesgo medio o bajo, juntos con otros parecidos.</p><p>Y dos cosas antes de empezar: <b>cultura justa</b> (lo delictivo o hecho a propósito va por otra vía) y <b>plazos</b>: el informe RCA² recomienda empezar en las <b>72 horas</b> siguientes a decidir que hace falta y terminar en <b>30–45 días</b>, mientras la gente se acuerda.</p>`)}
      <div class="card">
        <div class="field"><div class="field-head"><label class="field-label">¿Qué tipo de incidente es?</label></div>${segK(a, "incidente.clase", Object.entries(L.CLASES))}</div>
        <div class="grid-2">${campo(a, "incidente.fecha", "Fecha del incidente", { tipo: "date" })}${campo(a, "incidente.fechaDecision", "Fecha en que se decidió analizarlo", { tipo: "date", help: "Desde aquí cuentan las 72 horas para empezar y los 30–45 días para terminar." })}</div>
        <div class="field"><div class="field-head"><label class="field-label">Ámbito</label></div>${segK(a, "ambito", [["hospital", "Hospital"], ["primaria", "Atención primaria"], ["otro", "Otro"]])}</div>
        <div class="field"><div class="field-head"><label class="field-label">Gravedad (real o, en un casi incidente, la peor razonable)</label></div><div class="input-wrap"><select class="txt-in" data-k="incidente.gravedad"><option value="">Elige…</option>${G.map((t, i) => `<option value="${i + 1}"${String(I.gravedad) === String(i + 1) ? " selected" : ""}>${esc(t)}</option>`).join("")}</select></div></div>
        <div class="field"><div class="field-head"><label class="field-label">Frecuencia con la que puede repetirse</label></div>${segK(a, "incidente.frecuencia", L.FRECUENCIAS.map((t, i) => [String(i + 1), t]))}</div>
        <div data-zona="sac">${sacHtml(a)}</div>
      </div>
      <div class="card">
        <h3 class="sub-h">Cultura justa</h3>
        <div class="field"><div class="field-head"><label class="field-label">¿Hubo un acto delictivo, consumo de sustancias o algo hecho a propósito para causar daño?</label></div>${segK(a, "incidente.conducta", [["no", "No"], ["si", "Sí"]])}</div>
        <h3 class="sub-h">Lo inmediato (antes del análisis)</h3>
        <div class="chips">${[["atendido", "El paciente está atendido"], ["seguro", "La situación es segura para los demás"], ["apartado", "Equipos o productos implicados, apartados"], ["informado", "Paciente o familia, informados de lo ocurrido"]].map(([k, t]) => `<button type="button" class="chip${I.inmediata[k] ? " active" : ""}" data-kchk="incidente.inmediata.${k}">${I.inmediata[k] ? "✓ " : ""}${t}</button>`).join("")}</div>
        ${campo(a, "incidente.nota", "Notas", { area: true, opt: true, ph: "Quién notificó, a qué sistema (SiNASP u otro), decisiones iniciales…" })}
      </div>
      ${P ? `<div class="card plazos"><h3 class="sub-h">Plazos</h3><div class="plazos-g"><div><span>Empezar antes del</span><b>${L.fmtFecha(P.empezar)}</b><small>72 h desde la decisión</small></div><div><span>Terminar entre el</span><b>${L.fmtFecha(P.fin30)} y el ${L.fmtFecha(P.fin45)}</b><small>30–45 días</small></div>${P.primera ? `<div><span>Primera reunión</span><b>${L.fmtFecha(P.primera)}</b><small>${P.tarde ? "fuera de plazo" : "en plazo"}</small></div>` : ""}</div></div>` : ""}
      <div data-zona="avisos">${avisosGenerales(a, pasoActual)}</div>`;
  }

  // ---------- ACR · Paso 3: equipo y plazos ----------
  const bm = (m, f) => `data-m="${m.id}" data-f="${f}"`;
  const be = (x, f) => `data-e="${x.id}" data-f="${f}"`;
  const br = (x, f) => `data-r="${x.id}" data-f="${f}"`;
  function pasoEquipo(a) {
    const A = L.avisosEquipo(a);
    return `<p class="page-lead">De <b>4 a 6 personas</b>: expertos en el proceso y gente de distintos niveles de la organización. <b>Sin los implicados</b> en el incidente: a ellos se les entrevista. Siempre por perfil, nunca por nombre.</p>
      ${facil(`<p>El equipo del caso de la sepsis: un médico de Medicina Interna, una supervisora de otra unidad, la técnica de calidad, una enfermera de triaje de otro hospital del área y la responsable de seguridad, que coordina. Ninguno estaba de guardia aquella noche.</p><p>Valora incluir a un representante de los pacientes ajeno al caso. Y pide a la dirección tiempo dentro de la jornada: varias reuniones de hora y media o dos horas, más las entrevistas.</p>`)}
      <div data-zona="avisos">${avisosGenerales(a, pasoActual)}</div>
      <h2 class="sec-t">El equipo</h2>
      <div class="chips no-print">${L.PERFILES_ACR.map((p, i) => `<button type="button" class="chip chip--accent" data-act="eq-sug" data-i="${i}">+ ${esc(p.perfil)}</button>`).join("")}</div>
      ${a.equipo.map((m, i) => `<div class="card mi${m.implicado ? " mi--impl" : ""}" data-mid="${m.id}">
        <div class="acc-cab"><b>${i + 1}</b><span class="field-sub">${esc(L.PAPELES[m.papel])}</span><button type="button" class="icon-btn" data-act="eq-del" data-id="${m.id}" aria-label="Quitar" title="Quitar">✕</button></div>
        <div class="grid-2">${campo(m, "perfil", "Perfil", { bind: bm(m, "perfil"), ph: "Por ejemplo: supervisora de otra unidad" })}${campo(m, "servicio", "Servicio o unidad", { bind: bm(m, "servicio"), opt: true })}</div>
        <div class="field"><div class="field-head"><label class="field-label">Papel</label></div><div class="seg seg--wrap" role="group">${Object.entries(L.PAPELES).map(([k, t]) => `<button type="button" class="${m.papel === k ? "active" : ""}" data-mpick="${m.id}" data-v="${k}">${t}</button>`).join("")}</div></div>
        <label class="chk"><input type="checkbox" data-act="eq-impl" data-id="${m.id}"${m.implicado ? " checked" : ""} /> Estuvo implicado en el incidente</label>
        <div data-zmi="${m.id}">${A.filter(x => x.miembro === m.id).map(avisoHtml).join("")}</div>
      </div>`).join("")}
      <div class="toolbar no-print"><button class="btn btn--primary" data-act="eq-add">+ Persona</button></div>
      <h2 class="sec-t">Entrevistas</h2>
      <p class="field-sub">A los profesionales implicados y al paciente o su familia (si pueden y quieren). Por perfil.</p>
      ${a.entrevistas.map((x, i) => `<div class="card fila-x"><div class="grid-3">${campo(x, "perfil", `Entrevista ${i + 1}: a quién`, { bind: be(x, "perfil"), ph: "Enfermera de triaje, familia de la paciente…" })}${campo(x, "fecha", "Fecha", { bind: be(x, "fecha"), tipo: "date", opt: true })}<div class="field"><div class="field-head"><label class="field-label">Hecha</label></div><button type="button" class="chip${x.hecha ? " active" : ""}" data-act="ent-hecha" data-id="${x.id}">${x.hecha ? "✓ Hecha" : "Pendiente"}</button></div></div>${campo(x, "nota", "Qué aportó", { bind: be(x, "nota"), area: true, opt: true, ph: "Sin datos identificativos" })}<button type="button" class="link-btn link-btn--peligro" data-act="ent-del" data-id="${x.id}">Quitar</button></div>`).join("")}
      <div class="toolbar no-print"><button class="btn" data-act="ent-add">+ Entrevista</button></div>
      <h2 class="sec-t">Reuniones del equipo</h2>
      ${a.reuniones.map((x, i) => `<div class="card fila-x"><div class="grid-3">${campo(x, "fecha", `Reunión ${i + 1}`, { bind: br(x, "fecha"), tipo: "date" })}${campo(x, "duracion", "Duración", { bind: br(x, "duracion"), ph: "1,5 h", opt: true })}${campo(x, "nota", "Qué se hizo", { bind: br(x, "nota"), opt: true })}</div><button type="button" class="link-btn link-btn--peligro" data-act="reu-del" data-id="${x.id}">Quitar</button></div>`).join("")}
      <div class="toolbar no-print"><button class="btn" data-act="reu-add">+ Reunión</button></div>`;
  }

  // ---------- ACR · Paso 4: la cronología ----------
  const bh = (h, f) => `data-h="${h.id}" data-f="${f}"`;
  const bp = (x, f) => `data-p="${x.id}" data-f="${f}"`;
  function hechoHtml(a, h, i) {
    const A = L.avisosCronologia(a).filter(x => x.hecho === h.id), tieneP = a.problemasAtencion.some(p => p.hechoId === h.id);
    return `<div class="hx${h.desajuste ? " hx--des" : ""}${h.bien ? " hx--bien" : ""}" data-hid="${h.id}">
      <div class="hx-cab"><span class="hx-n">${i + 1}</span><input class="txt-in hx-hora" ${bh(h, "hora")} value="${esc(h.hora)}" placeholder="Hora" autocomplete="off" aria-label="Hora" />
        <div class="seg seg--sm" role="group"><button type="button" class="${h.desajuste ? "active" : ""}" data-act="h-des" data-id="${h.id}" title="No fue como debía">Desajuste</button><button type="button" class="${h.bien ? "active" : ""}" data-act="h-bien" data-id="${h.id}" title="Salió bien o protegió al paciente">Salió bien</button></div>
        <span class="hx-mv"><button type="button" class="icon-btn" data-act="h-subir" data-id="${h.id}" aria-label="Subir">↑</button><button type="button" class="icon-btn" data-act="h-bajar" data-id="${h.id}" aria-label="Bajar">↓</button><button type="button" class="icon-btn" data-act="h-del" data-id="${h.id}" aria-label="Quitar">✕</button></span></div>
      <div class="hx-g">
        <div><label class="hx-l">Lo que pasó</label><textarea class="txt-in" ${bh(h, "hecho")} rows="2" placeholder="Un hecho, sin datos que identifiquen a nadie">${esc(h.hecho)}</textarea>
          <div class="input-wrap"><select class="txt-in" ${bh(h, "fuente")} aria-label="Fuente"><option value="">Fuente…</option>${Object.entries(L.FUENTES).map(([k, t]) => `<option value="${k}"${h.fuente === k ? " selected" : ""}>${t}</option>`).join("")}</select></div></div>
        <div><label class="hx-l">Lo que debería haber pasado</label><textarea class="txt-in" ${bh(h, "debia")} rows="2" placeholder="Según el protocolo o la buena práctica${h.desajuste ? "" : " (si fue distinto)"}">${esc(h.debia)}</textarea>
          ${h.desajuste && !tieneP ? `<button type="button" class="link-btn" data-act="h-problema" data-id="${h.id}">+ Convertir en problema en la atención</button>` : tieneP ? `<span class="field-sub">→ ya es un problema en la atención</span>` : ""}</div>
      </div>
      <div data-zh="${h.id}">${A.map(avisoHtml).join("")}</div>
    </div>`;
  }
  function pasoCronologia(a) {
    return `<p class="page-lead">Con la historia clínica, los registros y las entrevistas, reconstruye <b>lo que pasó</b>, hora a hora, y compáralo con <b>lo que debería haber pasado</b>. Los <b>desajustes</b> son el punto de partida de las causas. Marca también <b>lo que salió bien</b>.</p>
      ${facil(`<p><b>La cronología en la pared.</b> Pega una tira de papel continuo con las horas marcadas. Cada dato va en un pósit, en su hora: llegada, triaje, constantes, avisos, llamadas, consulta. Debajo, en otro color, lo que debería haber pasado según el protocolo. Los huecos y los desajustes se ven enseguida, y el equipo trabaja sobre los hechos, no sobre los recuerdos.</p><p>Cada desajuste importante se puede convertir en un <b>problema en la atención</b> (Protocolo de Londres): algo que se salió de los límites seguros y pudo influir en el resultado. En el paso 5, cada uno puede tener su propia espina.</p><!--[eco]--><p>Si el proceso está dibujado en la app <a href="${L.URL_FLUJO}" target="_blank" rel="noopener">Flujograma ↗</a>, úsalo como guion de «lo que debería haber pasado».</p><!--[/eco]-->`)}
      <div data-zona="avisos">${avisosGenerales(a, pasoActual)}</div>
      ${a.cronologia.map((h, i) => hechoHtml(a, h, i)).join("")}
      <div class="toolbar no-print"><button class="btn btn--primary" data-act="h-add">+ Hecho</button>${btnReunion()}<button class="btn" data-act="traer" data-f="flujo" title="Los pasos del proceso, como «lo que debería haber pasado»">Traer de Flujograma</button></div>
      <h2 class="sec-t">Problemas en la atención</h2>
      <p class="field-sub">Lo que se salió de los límites seguros y pudo influir en el resultado. Pocos y claros: cada uno tendrá sus factores.</p>
      ${a.problemasAtencion.map((x, i) => `<div class="card fila-x"><div class="pa-fila"><span class="hx-n">${i + 1}</span><input class="txt-in" ${bp(x, "texto")} value="${esc(x.texto)}" placeholder="Por ejemplo: la paciente no fue reevaluada durante tres horas" autocomplete="off" /><button type="button" class="icon-btn" data-act="pa-del" data-id="${x.id}" aria-label="Quitar">✕</button></div>${x.hechoId ? `<span class="field-sub">Viene del hecho ${a.cronologia.findIndex(h => h.id === x.hechoId) + 1}</span>` : ""}</div>`).join("")}
      <div class="toolbar no-print"><button class="btn" data-act="pa-add">+ Problema en la atención</button></div>
      ${trampa(`Sin nombres ni datos que identifiquen a nadie: usa perfiles y horas.${anonimizador()}`)}`;
  }

  // ---------- ACR · Paso 6: afirmaciones causales ----------
  const bf = (f, k) => `data-af="${f.id}" data-f="${k}"`;
  function afirmacionHtml(a, f, i) {
    const x = a.causas.find(c => c.id === f.causaId), A = L.avisosAfirmacion(f), ok = L.cumpleReglas(f);
    return `<div class="card af${ok ? " af--ok" : ""}" data-afid="${f.id}">
      <div class="acc-cab"><b>Afirmación ${i + 1}</b>${x ? `<span class="field-sub">· ${esc(L.corto(x.texto, 60))}</span>` : ""}${ok ? `<span class="fz-b fz-b--fuerte">Cumple las cinco reglas</span>` : ""}<button type="button" class="icon-btn" data-act="af-del" data-id="${f.id}" aria-label="Quitar" title="Quitar">✕</button></div>
      ${campo(f, "texto", "La afirmación", { bind: bf(f, "texto"), area: true, rows: 3, ph: "Como [causa], [efecto], lo que aumentó la probabilidad de [lo que pasó]." })}
      ${x ? `<button type="button" class="link-btn" data-act="af-sug" data-id="${f.id}">Proponer una redacción a partir de la causa de fondo</button>` : ""}
      <div data-zaf="${f.id}">${A.map(r => `<div class="warn">⚠ <b>Regla ${r.regla}.</b> ${esc(r.texto)}</div>`).join("")}</div>
      <div class="grid-2">${campo(f, "deber", "Deber previo (si habla de algo que no se hizo)", { bind: bf(f, "deber"), ph: "Protocolo de sala de espera, apartado 3", opt: true })}${campo(f, "pruebas", "Pruebas o datos que la sostienen", { bind: bf(f, "pruebas"), ph: "Auditoría, entrevistas, registros…" })}</div>
    </div>`;
  }
  function pasoAfirmaciones(a) {
    const E = L.elegidas(a).filter(x => x.prueba !== "descartada"), sin = E.filter(x => !a.afirmaciones.some(f => f.causaId === x.id));
    return `<p class="page-lead">Una afirmación causal une una causa con su efecto y con lo que pasó. Escríbelas con las <b>cinco reglas de la causalidad</b> del informe RCA²: la app las comprueba mientras escribes.</p>
      ${facil(`<p>El formato que ayuda: <b>«Como [causa], [efecto], lo que aumentó la probabilidad de [lo que pasó]»</b>. Por ejemplo: «Como la reevaluación de la sala de espera no estaba asignada a ningún puesto en el turno de noche, el deterioro de la paciente no se detectó durante tres horas».</p>
        <table class="mini reglas-t"><thead><tr><th>Regla</th><th>Qué significa</th></tr></thead><tbody>${L.REGLAS.map(r => `<tr><td><b>${r.n}. ${r.nom}</b></td><td>${r.que}</td></tr>`).join("")}</tbody></table>
        <p>No es un ejercicio de gramática: una afirmación bien escrita apunta al sistema y «vende» por qué hace falta la acción.</p>`)}
      <div data-zona="avisos">${avisosGenerales(a, pasoActual)}</div>
      ${sin.length ? `<div class="card"><p class="field-sub">Causas de fondo sin afirmación:</p><div class="chips">${sin.map(x => `<button type="button" class="chip chip--accent" data-act="af-add" data-id="${x.id}">+ ${esc(L.corto(x.texto, 50))}</button>`).join("")}</div></div>` : ""}
      ${a.afirmaciones.map((f, i) => afirmacionHtml(a, f, i)).join("")}
      <div class="toolbar no-print"><button class="btn" data-act="af-add">+ Afirmación suelta</button></div>`;
  }

  // ---------- ACR · Paso 8: informar, apoyar y cerrar ----------
  function pasoCerrar(a) {
    const inf = a.informacion;
    return `<p class="page-lead">El análisis no termina con el informe: hay que <b>devolver las conclusiones</b> a los profesionales implicados y al paciente o su familia, <b>apoyar</b> a quien lo necesite y dejar fecha para <b>comprobar que las acciones funcionan</b>.</p>
      ${facil(`<p>En el caso de la sepsis, el equipo explicó las conclusiones a los profesionales implicados y el jefe de servicio se reunió con la familia de la paciente para contarles qué ocurrió y qué se ha cambiado. La supervisora apoyó a la enfermera del triaje durante el análisis: los profesionales implicados son también víctimas del incidente.</p><p>El Ministerio de Sanidad recomienda que el informe final se conserve <b>anonimizado</b> (sin datos del paciente ni de los profesionales) y que el centro tenga un procedimiento para informar al paciente y a la familia.</p>`)}
      <div data-zona="avisos">${avisosGenerales(a, pasoActual)}</div>
      <div class="card"><h3 class="sub-h">Información</h3>
        ${campo(inf, "profesionales", "A los profesionales implicados y a la unidad", { bind: `data-k="informacion.profesionales"`, ph: "Cuándo y quién: sesión del servicio el 10/02, responsable de seguridad" })}
        ${campo(inf, "paciente", "Al paciente o a la familia", { bind: `data-k="informacion.paciente"`, ph: "Cuándo y quién: reunión con la familia el 12/02, jefe de servicio" })}
        <div class="grid-2">${campo(inf, "direccion", "A la dirección", { bind: `data-k="informacion.direccion"`, opt: true })}${campo(inf, "comision", "A la comisión de seguridad", { bind: `data-k="informacion.comision"`, opt: true })}</div>
      </div>
      <div class="card"><h3 class="sub-h">Apoyo</h3>
        <div class="chips">${[["paciente", "Al paciente y a la familia"], ["profesionales", "A los profesionales implicados (segundas víctimas)"]].map(([k, t]) => `<button type="button" class="chip${a.apoyo[k] ? " active" : ""}" data-kchk="apoyo.${k}">${a.apoyo[k] ? "✓ " : ""}${t}</button>`).join("")}</div>
        ${campo(a.apoyo, "nota", "Cómo", { bind: `data-k="apoyo.nota"`, area: true, opt: true, ph: "Quién acompañó, qué se ofreció" })}
      </div>
      <div class="card"><h3 class="sub-h">Conclusiones</h3>
        ${campo(a, "conclusiones", "Conclusiones del análisis", { area: true, rows: 5 })}
        <button type="button" class="link-btn" data-act="concl-sug">Proponer unas conclusiones</button>
        ${campo(a, "proxRevision", "Fecha para revisar si las acciones funcionan", { tipo: "date" })}
      </div>
      <div class="card"><h3 class="sub-h">Lista de verificación antes de cerrar</h3>
        ${L.VERIFICACION.map(v => `<label class="chk chk--lista"><input type="checkbox" data-act="verif" data-id="${v.id}"${a.verificacion.includes(v.id) ? " checked" : ""} /> ${esc(v.t)}</label>`).join("")}
      </div>
      <div class="card export-card"><h3 class="sub-h">El informe del análisis causa raíz</h3>
        <p class="field-sub">Incidente y decisión, equipo y método, cronología, problemas en la atención, espinas (con sus dibujos), afirmaciones causales, plan de acción y medida, información y apoyo, conclusiones y lista de verificación. En Word con las imágenes, en PDF y en Excel.</p>
        <div class="toolbar"><button class="btn btn--primary" data-act="ver-ficha">👁 Ver e imprimir (PDF)</button><button class="btn" data-act="doc-word">⬇ Word</button><button class="btn" data-act="excel">⬇ Excel</button></div>
      </div>`;
  }
  const RENDER = { problema: pasoProblema, espina: pasoEspina, elegir: a => pasoElegir(a, false), acciones: pasoAcciones, decidir: pasoDecidir, equipo: pasoEquipo, cronologia: pasoCronologia, afirmaciones: pasoAfirmaciones, cerrar: pasoCerrar };

  // Las espinas se pintan como texto SVG; aquí solo se recuerda la vista
  function pintarEspinas() { /* el SVG ya va dentro del HTML */ }

  // ---------- Ficha (vista imprimible, PDF y Word) ----------
  function bloquesHtml(bloques, a) {
    const celda = (c, cab) => { const o = c !== null && typeof c === "object" ? c : { texto: c }; const cl = [o.centro ? "c" : "", o.negrita ? "b" : ""].filter(Boolean).join(" "); return `<${cab ? "th" : "td"}${cl ? ` class="${cl}"` : ""}>${escMl(o.texto)}</${cab ? "th" : "td"}>`; };
    return bloques.map(b => {
      if (b.t === "portada") return `<div class="doc-portada"><h1>${esc(b.titulo)}</h1>${b.sub ? `<p class="doc-sub">${esc(b.sub)}</p>` : ""}${(b.extra || []).filter(lleno).map(x => `<p>${esc(x)}</p>`).join("")}</div>`;
      if (b.t === "h1") return `<h2 class="doc-h1">${esc(b.texto)}</h2>`;
      if (b.t === "h2") return `<h3 class="doc-h2">${esc(b.texto)}</h3>`;
      if (b.t === "lista") return `<ul class="doc-ul">${b.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`;
      if (b.t === "p") return `<p class="doc-p${b.estilo === "nota" ? " doc-nota" : ""}">${b.runs ? b.runs.map(r => r.negrita ? `<b>${escMl(r.texto)}</b>` : escMl(r.texto)).join("") : escMl(b.texto)}</p>`;
      if (b.t === "espina") { const g = espinaActual; espinaActual = b.espina || ""; const h = `<div class="esp-graf esp-graf--doc">${espinaHtml(a)}</div>`; espinaActual = g; return h; }
      if (b.t === "tabla") {
        const suma = (b.anchos || []).reduce((s, x) => s + x, 0);
        const cols = b.anchos ? `<colgroup>${b.anchos.map(w => `<col style="width:${(w / suma * 100).toFixed(1)}%">`).join("")}</colgroup>` : "";
        return `<div class="table-wrap"><table class="doc-t doc-t--peq">${cols}<thead><tr>${b.cab.map(c => celda(c, true)).join("")}</tr></thead><tbody>${b.filas.map(f => `<tr>${f.map(c => celda(c, false)).join("")}</tr>`).join("")}</tbody></table></div>`;
      }
      return "";
    }).join("");
  }
  const documentoDe = (a, imagenes) => a.tipo === "acr" ? L.documentoInforme(a, new Date().toLocaleDateString("es-ES"), imagenes) : L.documentoFicha(a, new Date().toLocaleDateString("es-ES"), imagenes ? imagenes[""] : null);
  function renderFicha(a) {
    const doc = documentoDe(a, null);
    view.innerHTML = `<div class="informe-bar informe-only"><button class="btn" data-act="volver">← Volver</button><span class="informe-acc"><button class="btn" data-act="doc-word">⬇ Word</button><button class="btn btn--primary" data-act="imprimir">Guardar / imprimir</button></span></div>
      <div class="doc-prev doc-prev--informe">${bloquesHtml(doc.bloques, a)}</div>${informePie()}`;
  }

  // ---------- Exportar la espina ----------
  const fechaArchivo = () => new Date().toLocaleDateString("es-ES").replace(/\//g, "-");
  function nombreArchivo(ext, base) {
    const b = base || ((actual && actual.tipo === "acr" ? "ACR " : "Ishikawa ") + L.corto(actual ? (actual.titulo || actual.problema) : "", 60));
    return `${b.replace(/[\\/:*?"<>|%…]/g, "").trim()} ${fechaArchivo()}.${ext}`;
  }
  const svgExport = (a, esp) => { const e = esp === undefined ? espinaActual : esp, pa = a.problemasAtencion.find(p => p.id === e); const d = L.datosDibujo(a, { porques: vista.porques, soloElegidas: vista.solo, espina: e }); return D.svg(D.colocar(d, { titulo: pa ? "Ishikawa · " + L.corto(pa.texto, 70) : a.titulo ? "Ishikawa · " + a.titulo : "Diagrama de Ishikawa", pie: "Elaborado con ACR · Ishikawa" })); };
  // SVG → PNG (3 veces el tamaño, sin pasar del lienzo máximo del móvil)
  function pngDe(s, maxPx = 16e6, k0 = 3) {
    return new Promise((ok, mal) => {
      const im = new Image(), w = Number(/width="(\d+)/.exec(s)[1]), h = Number(/height="(\d+)/.exec(s)[1]), k = Math.min(k0, Math.sqrt(maxPx / (w * h)));
      im.onload = () => {
        const cv = document.createElement("canvas"); cv.width = Math.round(w * k); cv.height = Math.round(h * k);
        const ctx = cv.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height); ctx.drawImage(im, 0, 0, cv.width, cv.height);
        cv.toBlob(b => b ? ok({ blob: b, w, h }) : mal(new Error("png")), "image/png");
      };
      im.onerror = () => mal(new Error("svg"));
      im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
    });
  }
  function exportarImagen(a, tipo) {
    const s = svgExport(a);
    if (tipo === "svg") { compartirOBajar(new Blob([s], { type: "image/svg+xml" }), nombreArchivo("svg"), "Imagen SVG descargada."); return; }
    pngDe(s).then(r => compartirOBajar(r.blob, nombreArchivo("png"), "Imagen PNG descargada.")).catch(() => toast("No se ha podido crear la imagen.", 4000));
  }
  async function copiarImagen(a) {
    const s = svgExport(a);
    if (!navigator.clipboard || !window.ClipboardItem) { toast("Este navegador no deja copiar imágenes: te la descargo en PNG.", 4000); exportarImagen(a, "png"); return; }
    try {
      // La promesa va dentro del ClipboardItem: así Safari no pierde el permiso del clic
      await navigator.clipboard.write([new window.ClipboardItem({ "image/png": pngDe(s, 12e6, 2).then(r => r.blob) })]);
      toast("Espina copiada. Pégala en Word, PowerPoint o un correo (Ctrl+V o ⌘V).", 4500);
    } catch (e) { toast("No se ha podido copiar: te la descargo en PNG.", 4000); exportarImagen(a, "png"); }
  }
  function plantillaBlanco(a) {
    const s = D.plantillaVacia(L.categorias(a).map(c => c.nom), a.problema, "Diagrama de Ishikawa");
    pngDe(s).then(r => compartirOBajar(r.blob, nombreArchivo("png", "Plantilla Ishikawa en blanco"), "Plantilla descargada: imprímela en A3 apaisado.")).catch(() => toast("No se ha podido crear la plantilla.", 4000));
  }
  async function descargarWord(a) {
    toast("Preparando el Word…");
    try {
      const imagenes = {};
      for (const e of L.espinasDe(a)) { if (e.id && !L.causasCon(a).some(x => x.espina === e.id)) continue; const r = await pngDe(svgExport(a, e.id), 12e6, 2); imagenes[e.id] = { png: new Uint8Array(await r.blob.arrayBuffer()), w: r.w, h: r.h }; }
      const doc = documentoDe(a, imagenes);
      const bytes = window.Docx.construirDocx(Object.assign({ pie: doc.titulo + " · Generado con la app ACR · Ishikawa", horizontal: true }, doc));
      compartirOBajar(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), nombreArchivo("docx"), "Word descargado. Ábrelo con Word, Pages o LibreOffice y ajústalo a tu gusto.");
    } catch (e) { toast("No se ha podido crear el Word.", 4000); }
  }
  function exportarExcel(a) {
    try {
      const bytes = window.Xlsx.construirLibroXlsx(L.hojasExcel(a, new Date().toLocaleDateString("es-ES")));
      compartirOBajar(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), nombreArchivo("xlsx"), "Excel descargado.");
    } catch (e) { toast("No se ha podido crear el Excel.", 4000); }
  }

  // ---------- Refrescar sin perder el foco ----------
  let tDibujo = null;
  function refrescar(o = {}) {
    const a = actual; if (!a) return;
    const n = pasoActual;
    $$("[data-zona='pasos']").forEach(el => { el.innerHTML = pasosInner(a, n); });
    $$("[data-zona='avisos']").forEach(el => { el.innerHTML = avisosGenerales(a, n); });
    $$("[data-zona='avisosElegir']").forEach(el => { el.innerHTML = L.avisosElegir(a).filter(x => !x.causa).map(avisoHtml).join(""); });
    if (o.causa) { const x = a.causas.find(y => y.id === o.causa), z = $(`[data-zcau="${o.causa}"]`); if (x && z) z.innerHTML = L.avisosCausa(a, Object.assign({}, x, { elegida: false })).map(avisoHtml).join(""); }
    $$("[data-zac]").forEach(el => { el.innerHTML = L.avisosAcciones(a).filter(y => y.accion === el.dataset.zac).map(avisoHtml).join(""); });
    $$("[data-zona='sac']").forEach(el => { el.innerHTML = sacHtml(a); });
    $$("[data-zaf]").forEach(el => { const f = a.afirmaciones.find(y => y.id === el.dataset.zaf); if (f) el.innerHTML = L.avisosAfirmacion(f).map(r => `<div class="warn">⚠ <b>Regla ${r.regla}.</b> ${esc(r.texto)}</div>`).join(""); });
    $$("[data-zmi]").forEach(el => { el.innerHTML = L.avisosEquipo(a).filter(x => x.miembro === el.dataset.zmi).map(avisoHtml).join(""); });
    $$("[data-zh]").forEach(el => { el.innerHTML = L.avisosCronologia(a).filter(x => x.hecho === el.dataset.zh).map(avisoHtml).join(""); });
    $$("[data-zfz]").forEach(el => { const x = a.acciones.find(y => y.id === el.dataset.zfz); if (x) el.innerHTML = fzBadge(L.fuerzaAccion(x), !x.categoria && L.fuerzaAccion(x)); });
    clearTimeout(tDibujo);
    tDibujo = setTimeout(() => { $$("[data-zesp]").forEach(el => { el.innerHTML = espinaHtml(a); }); }, 120);
  }
  function repintar() { const y = window.scrollY; renderAnalisis(actual, pasoActual); window.scrollTo(0, y); }

  // ---------- Aprende ----------
  function renderAprende(n) {
    const T = C.TEMAS, t = T.find(x => x.n === n);
    if (!t) {
      view.innerHTML = `
        <h1 class="page-title">Aprende</h1>
        <p class="page-lead">${T.length} temas, explicados fácil, para tener a mano mientras buscas las causas.</p>
        <div class="temas">${T.map(x => `<a class="tema-card pdca--${x.c}" href="#/aprende/${x.n}"><span class="tema-n">${x.n}</span><span><b>${x.titulo}</b><span>${x.sub}</span></span></a>`).join("")}</div>`;
      return;
    }
    const prev = T.find(x => x.n === n - 1), next = T.find(x => x.n === n + 1);
    view.innerHTML = `
      <div class="wiz-top no-print">${volver("#/aprende", "Aprende")}<div class="tema-pills">${T.map(x => `<a href="#/aprende/${x.n}" class="pdca--${x.c}${x.n === n ? " actual" : ""}">${x.n}</a>`).join("")}</div></div>
      <div class="wiz-titulo"><span class="wiz-paso">Tema ${n} de ${T.length}</span><h1 class="page-title">${t.titulo}</h1><p class="page-lead">${t.sub}</p></div>
      <div class="card minuto pdca--${t.c}"><h2 class="sub-h">En un minuto</h2><ul>${t.minuto.map(x => `<li>${x}</li>`).join("")}</ul></div>
      ${t.secciones.map((s, i) => `<details class="facil"${i === 0 ? " open" : ""}><summary>${s.t}</summary><div class="facil-body">${s.h}</div></details>`).join("")}
      ${box("ejemplo", "Minicaso", t.minicaso)}
      <div class="toolbar"><a class="btn" href="#/prueba">✓ Ponte a prueba</a><a class="btn btn--primary" href="${t.practica.href}">${t.practica.texto} →</a></div>
      <div class="wiz-nav no-print">${prev ? `<a class="btn" href="#/aprende/${prev.n}">← ${prev.titulo}</a>` : "<span></span>"}${next ? `<a class="btn" href="#/aprende/${next.n}">${next.titulo} →</a>` : "<span></span>"}</div>`;
  }

  // ---------- Ponte a prueba ----------
  const respuestas = {}, respReglas = {}, respFuerza = {};
  const pillsPrueba = actualP => `<div class="tema-pills prueba-pills no-print"><a href="#/prueba" class="pdca--P${!actualP ? " actual" : ""}" title="Todas las preguntas">T</a>${Object.keys(C.TEMAS_TEST).map(k => `<a href="#/prueba/${k}" class="pdca--P${String(actualP) === k ? " actual" : ""}" title="${esc(C.TEMAS_TEST[k].nom)}">${k}</a>`).join("")}<a href="#/prueba/practica" class="pdca--H${actualP === "practica" ? " actual" : ""}" title="Ejercicios prácticos">✎</a></div>`;
  const barajar = (n, semilla) => { const a = Array.from({ length: n }, (_, i) => i); let s = semilla * 9301 + 49297; for (let i = n - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function renderPrueba(tema) {
    if (tema === "practica") { renderPractica(); return; }
    const Q = C.TEST.map((q, i) => Object.assign({ i }, q)).filter(q => !tema || q.t === tema);
    view.innerHTML = `
      <h1 class="page-title">Ponte a prueba</h1>
      <p class="page-lead">${C.TEST.length} preguntas sobre el Ishikawa y el análisis causa raíz${tema ? ` (aquí, las de «${esc(C.TEMAS_TEST[tema].nom)}»)` : ""}. Toca la respuesta que creas correcta y lee la explicación. Y en ✎, dos ejercicios prácticos.</p>
      ${pillsPrueba(tema)}
      <div class="marcador" data-zona="marcador">${marcadorHtml(Q)}</div>
      <div class="card">${Q.map(q => { const ord = barajar(q.o.length, q.i + 1), r = respuestas[q.i]; return `<div class="quiz-q" data-q="${q.i}">
        <p><span class="badge">${esc(C.TEMAS_TEST[q.t].nom)}</span> <b>${esc(q.q)}</b></p>
        ${ord.map(j => `<button class="quiz-o${r != null ? (j === q.ok ? " quiz-o--ok" : j === r ? " quiz-o--mal" : "") : ""}" data-act="quiz" data-q="${q.i}" data-o="${j}">${esc(q.o[j])}</button>`).join("")}
        <p class="quiz-fb"${r == null ? " hidden" : ""}>${r != null ? `${r === q.ok ? "<b>¡Correcto!</b> " : "<b>No.</b> "}${esc(q.e)} <a href="#/aprende/${C.TEMAS_TEST[q.t].aprende}">Repasar en «Aprende»</a>` : ""}</p>
      </div>`; }).join("")}</div>
      <div class="toolbar no-print"><button class="btn" data-act="quiz-reset">Empezar de nuevo</button><a class="btn btn--primary" href="#/prueba/practica">Ejercicios prácticos →</a></div>`;
  }
  const FZ_NOM = { fuerte: "Fuerte", intermedia: "Intermedia", debil: "Débil" };
  function renderPractica() {
    const E = C.EJERCICIOS, br = E.reglas.filter((x, i) => respReglas[i] === x.regla).length, bf = E.fuerza.filter((x, i) => respFuerza[i] === x.f).length;
    view.innerHTML = `
      <h1 class="page-title">Ponte a prueba · ejercicios</h1>
      <p class="page-lead">Dos ejercicios para entrenar el ojo.</p>
      ${pillsPrueba("practica")}
      <h2 class="sec-t">1. ¿Qué regla de la causalidad incumple?</h2>
      <p class="field-sub">${Object.keys(respReglas).length ? `<b>${br} de ${Object.keys(respReglas).length}</b> bien. ` : ""}${C.TEMAS[5] ? `<a href="#/aprende/6">Repasa las cinco reglas</a>.` : ""}</p>
      <div class="card">${E.reglas.map((x, i) => { const r = respReglas[i]; return `<div class="quiz-q fec-q"><p><b>«${esc(x.texto)}»</b></p>
        <div class="seg seg--wrap" role="group">${L.REGLAS.map(g => `<button type="button" class="${r === g.n ? (g.n === x.regla ? "fec-ok" : "fec-mal") : r && g.n === x.regla ? "fec-ok" : ""}" data-act="ej-regla" data-i="${i}" data-v="${g.n}" title="${esc(g.nom)}">Regla ${g.n}</button>`).join("")}</div>
        ${r ? `<p class="quiz-fb">${r === x.regla ? "<b>¡Correcto!</b> " : `<b>No: es la regla ${x.regla}</b> (${esc(L.REGLAS[x.regla - 1].nom.toLowerCase())}). `}${esc(x.e)}</p>` : ""}</div>`; }).join("")}</div>
      <h2 class="sec-t">2. ¿Qué fuerza tiene esta acción?</h2>
      <p class="field-sub">${Object.keys(respFuerza).length ? `<b>${bf} de ${Object.keys(respFuerza).length}</b> bien. ` : ""}<a href="#/aprende/7">Repasa la jerarquía</a>.</p>
      <div class="card">${E.fuerza.map((x, i) => { const r = respFuerza[i]; return `<div class="quiz-q fec-q"><p><b>${esc(x.texto)}</b></p>
        <div class="seg seg--wrap" role="group">${Object.keys(FZ_NOM).map(k => `<button type="button" class="${r === k ? (k === x.f ? "fec-ok" : "fec-mal") : r && k === x.f ? "fec-ok" : ""}" data-act="ej-fuerza" data-i="${i}" data-v="${k}">${FZ_NOM[k]}</button>`).join("")}</div>
        ${r ? `<p class="quiz-fb">${r === x.f ? "<b>¡Correcto!</b>" : `<b>No: es ${FZ_NOM[x.f].toLowerCase()}.</b>`} ${esc(L.FUERZAS[x.f].que)}</p>` : ""}</div>`; }).join("")}</div>
      <div class="toolbar no-print"><button class="btn" data-act="practica-reset">Empezar de nuevo</button><a class="btn" href="#/prueba">← Preguntas del test</a></div>`;
  }
  function marcadorHtml(Q) {
    const hechas = Q.filter(q => q.i in respuestas), bien = hechas.filter(q => respuestas[q.i] === q.ok).length;
    if (!hechas.length) return `<span class="field-sub">Aciertos: 0 de ${Q.length}</span>`;
    const p = bien / hechas.length;
    return `<span><b>${bien}</b> aciertos de ${hechas.length} respondidas (de ${Q.length})</span>${hechas.length === Q.length ? `<span class="sem-b sem-b--${p >= 0.8 ? "verde" : p >= 0.6 ? "ambar" : "rojo"}">${p >= 0.8 ? "¡Muy bien!" : p >= 0.6 ? "Bien: repasa los fallos" : "Repasa «Aprende»"}</span>` : ""}`;
  }

  // ---------- Ejemplos ----------
  function renderEjemplos() {
    view.innerHTML = `
      <h1 class="page-title">Ejemplos</h1>
      <p class="page-lead">Para ver cómo queda cada paso antes de hacerlo tú. Están aparte: puedes tocarlos, pero <b>no se guardan ni se mezclan con tus datos</b>. Si te sirve de punto de partida, pulsa «Copiar a mis datos».</p>
      <h2 class="sec-t">Ishikawa: la reevaluación en la sala de espera</h2>
      <p class="field-sub">Tras la auditoría de enero, el equipo de Urgencias quiere entender por qué no se reevalúa a los pacientes en la sala de espera. En una sesión de una hora, con la técnica de grupo nominal, escribe trece causas en las siete categorías. Preguntando «¿por qué?» en la espina de la organización llega a la causa de fondo: <i>la reevaluación no está asignada a ningún puesto; de noche, la misma enfermera cubre la sala y los boxes, y los boxes siempre ganan</i>. Los datos de la auditoría lo confirman.<!--[eco]--> Es el caso del capítulo 8 de la guía.<!--[/eco]--></p>
      <div class="ej-grid">${C.EJEMPLOS.fichas.map(f => `<a class="ej-card" href="${f.href}"><b>${esc(f.t)}</b><span>${esc(f.s)}</span></a>`).join("")}<a class="ej-card" href="#/analisis/ej-ish-sala/4?informe=1"><b>El informe</b><span>Todo en una vista imprimible</span></a></div>
      <h2 class="sec-t">Análisis causa raíz: la paciente de la sala de espera</h2>
      <p class="field-sub">Unas semanas antes de la auditoría había ocurrido un evento adverso: una paciente de 82 años, triada con prioridad 3, empeoró en la sala de espera y, cuando la llamaron a consulta casi tres horas después, tenía una sepsis grave e ingresó en la UCI. Se notificó y la dirección decidió hacer un ACR. Los ocho pasos: la decisión, el equipo formado en 72 horas, la cronología, una espina por cada problema en la atención, las tres afirmaciones causales, las acciones con su indicador y la información a la familia.<!--[eco]--> Es el caso del capítulo 8 de la guía.<!--[/eco]--></p>
      <div class="ej-grid">${C.EJEMPLOS.fichasAcr.map(f => `<a class="ej-card" href="${f.href}"><b>${esc(f.t)}</b><span>${esc(f.s)}</span></a>`).join("")}</div>
      <h2 class="sec-t">Minicasos</h2>
      <p class="field-sub">Casos cortos e inventados. Cada uno abre en el paso que practica.</p>
      <div class="ej-grid ej-grid--mini">${C.EJEMPLOS.minicasos.map(f => `<a class="ej-card" href="${f.href}"><b>${esc(f.t)}</b><span>${esc(f.s)}</span></a>`).join("")}</div>
      ${practica("El caso de Urgencias es ficticio. Adapta siempre las causas y las acciones a tu unidad.")}`;
  }

  // ---------- Glosario ----------
  function renderGlosario() {
    view.innerHTML = `<h1 class="page-title">Glosario</h1><p class="page-lead">${C.GLOSARIO.length} términos en lenguaje llano.</p>
      <div class="input-wrap glos-buscar"><input id="glos-q" type="search" placeholder="Buscar término…" autocomplete="off" /></div>
      <dl class="glos-lista" id="glos-lista"></dl>`;
    const pinta = q => {
      const t = L.sinTildes(q);
      const l = C.GLOSARIO.filter(([a, b]) => !t || L.sinTildes(a + " " + b).includes(t)).sort((x, y) => x[0].localeCompare(y[0], "es"));
      $("#glos-lista").innerHTML = l.length ? l.map(([a, b]) => `<div class="glos-item"><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("") : `<p class="placeholder-box">Sin resultados.</p>`;
    };
    pinta(""); $("#glos-q").addEventListener("input", e => pinta(e.target.value));
  }

  // ---------- PDF en iOS (sin librerías; mismo método que AMFE y Auditorías) ----------
  // En iOS, window.print() no hace nada cuando la app está instalada en la pantalla de inicio.
  function esIOS() { return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
  function toast(msg, ms) {
    let t = $("#toast");
    if (!msg) { if (t) t.hidden = true; return; }
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toast.h);
    if (ms) toast.h = setTimeout(() => { t.hidden = true; }, ms);
  }
  function pdfDesdeJPEGs(paginas, wPt, hPt) {
    const enc = new TextEncoder(), partes = [], offs = []; let pos = 0;
    const push = x => { const b = typeof x === "string" ? enc.encode(x) : x; partes.push(b); pos += b.length; };
    const obj = (n, cuerpo) => { offs[n] = pos; push(`${n} 0 obj\n`); cuerpo(); push("\nendobj\n"); };
    push("%PDF-1.4\n"); push(new Uint8Array([37, 226, 227, 207, 211, 10]));
    const n = paginas.length;
    obj(1, () => push("<< /Type /Catalog /Pages 2 0 R >>"));
    obj(2, () => push(`<< /Type /Pages /Kids [${paginas.map((_, i) => `${3 + i * 3} 0 R`).join(" ")}] /Count ${n} >>`));
    paginas.forEach((p, i) => {
      const pg = 3 + i * 3, cont = pg + 1, img = pg + 2, flujo = `q ${wPt} 0 0 ${hPt} 0 0 cm /Im${i} Do Q`;
      obj(pg, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${wPt} ${hPt}] /Resources << /XObject << /Im${i} ${img} 0 R >> >> /Contents ${cont} 0 R >>`));
      obj(cont, () => { push(`<< /Length ${flujo.length} >>\nstream\n${flujo}\nendstream`); });
      obj(img, () => { push(`<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.bytes.length} >>\nstream\n`); push(p.bytes); push("\nendstream"); });
    });
    const total = 3 + n * 3, xref = pos;
    let x = `xref\n0 ${total}\n0000000000 65535 f \n`;
    for (let k = 1; k < total; k++) x += String(offs[k]).padStart(10, "0") + " 00000 n \n";
    push(x + `trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(partes, { type: "application/pdf" });
  }
  async function generarPDF() {
    const ANCHO = 720, K = 2;
    const A4W = 595.28, A4H = 841.89, MARGEN_PT = 34;
    const PX = (A4W - 2 * MARGEN_PT) / ANCHO;
    const PW = A4W / PX, PH = A4H / PX, M = MARGEN_PT / PX, ALTO_UTIL = PH - 2 * M;
    const hoja = document.createElement("div");
    hoja.className = "view";
    hoja.style.cssText = `position:absolute;left:-20000px;top:0;width:${ANCHO}px;max-width:none;margin:0;padding:0;box-shadow:none;`;
    hoja.innerHTML = $("#view").innerHTML;
    $$(".informe-bar, [id]", hoja).forEach(el => { if (el.classList.contains("informe-bar")) el.remove(); else el.removeAttribute("id"); });
    $$("details", hoja).forEach(d => { d.open = true; });
    document.body.appendChild(hoja);
    try {
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const R0 = hoja.getBoundingClientRect();
      const ops = [], cortes = [0], bloques = [];
      const SIN_CORTE = ".print-head, .esp-graf, tr, .box, .print-foot, h1, h2, h3, .doc-portada";
      const rel = r => ({ x: r.left - R0.left, y: r.top - R0.top, w: r.width, h: r.height });
      const hayColor = c => !!c && c !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(c);
      const LADOS = ["Top", "Right", "Bottom", "Left"];
      const texto = (n, cs) => {
        const t = n.textContent, re = /\S+/g, rg = document.createRange(); let m;
        const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        while ((m = re.exec(t))) {
          rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
          const rs = rg.getClientRects(); if (!rs.length) continue;
          ops.push({ t: "txt", s: cs.textTransform === "uppercase" ? m[0].toUpperCase() : m[0], r: rel(rs[0]), font, col: cs.color, ls: cs.letterSpacing });
        }
      };
      const recorre = el => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        const r = rel(el.getBoundingClientRect());
        if (r.h > 0) cortes.push(r.y + r.h);
        if (el.matches(SIN_CORTE)) bloques.push([r.y, r.y + r.h]);
        if (el instanceof SVGSVGElement) { ops.push({ t: "svg", el, r }); return; }
        const bordes = LADOS.map(l => [parseFloat(cs[`border${l}Width`]) || 0, cs[`border${l}Color`]]);
        if (hayColor(cs.backgroundColor) || bordes.some(b => b[0] > 0 && hayColor(b[1]))) ops.push({ t: "caja", r, bg: cs.backgroundColor, rad: parseFloat(cs.borderTopLeftRadius) || 0, bordes });
        if (el.tagName === "LI") {
          const ol = el.parentElement.tagName === "OL", idx = Array.prototype.indexOf.call(el.parentElement.children, el) + 1;
          ops.push({ t: "txt", s: ol ? idx + "." : "•", r: { x: r.x - (ol ? 20 : 14), y: r.y, w: 16, h: parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4 }, font: `normal 700 ${cs.fontSize} ${cs.fontFamily}`, col: ol ? "#8f3322" : cs.color, ls: "normal" });
        }
        for (const n of el.childNodes) {
          if (n.nodeType === 1) recorre(n);
          else if (n.nodeType === 3 && n.textContent.trim()) texto(n, cs);
        }
      };
      recorre(hoja);
      // La espina ya es un SVG autónomo (colores fijos): se dibuja tal cual
      for (const op of ops.filter(o => o.t === "svg")) {
        const cl = op.el.cloneNode(true); cl.setAttribute("width", op.r.w); cl.setAttribute("height", op.r.h);
        op.img = await new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(cl)); });
      }
      const alto = Math.ceil(R0.height);
      const parte = y => bloques.some(([a, b]) => a < y - 0.5 && y + 0.5 < b && b - a < ALTO_UTIL);
      const cands = [...new Set(cortes.map(c => Math.ceil(c)))].sort((a, b) => a - b);
      const pags = []; let y0 = 0;
      while (y0 < alto - 1) {
        const lim = y0 + ALTO_UTIL;
        if (lim >= alto) { pags.push([y0, alto]); break; }
        const y = cands.filter(c => c > y0 + 80 && c <= lim && !parte(c)).pop() || Math.floor(lim);
        pags.push([y0, y]); y0 = y;
      }
      const ponFuente = (ctx, f) => { ctx.font = "10px serif"; ctx.font = f; if (ctx.font === "10px serif") ctx.font = f.replace(/^(.*?\d+(\.\d+)?px).*$/, "$1 sans-serif"); };
      const caja = (ctx, op) => {
        const { x, y, w, h } = op.r, rad = Math.min(op.rad, w / 2, h / 2);
        const camino = () => { ctx.beginPath(); if (rad > 0 && ctx.roundRect) ctx.roundRect(x, y, w, h, rad); else ctx.rect(x, y, w, h); };
        if (hayColor(op.bg)) { ctx.fillStyle = op.bg; camino(); ctx.fill(); }
        const [t, d, b, l] = op.bordes;
        if (op.bordes.every(z => z[0] === t[0] && z[1] === t[1]) && t[0] > 0 && hayColor(t[1])) { ctx.strokeStyle = t[1]; ctx.lineWidth = t[0]; ctx.beginPath(); if (rad > 0 && ctx.roundRect) ctx.roundRect(x + t[0] / 2, y + t[0] / 2, w - t[0], h - t[0], Math.max(0, rad - t[0] / 2)); else ctx.rect(x + t[0] / 2, y + t[0] / 2, w - t[0], h - t[0]); ctx.stroke(); return; }
        const lado = (z, rx, ry, rw, rh) => { if (z[0] > 0 && hayColor(z[1])) { ctx.fillStyle = z[1]; ctx.fillRect(rx, ry, rw, rh); } };
        lado(t, x, y, w, t[0]); lado(b, x, y + h - b[0], w, b[0]); lado(l, x, y, l[0], h); lado(d, x + w - d[0], y, d[0], h);
      };
      const dibujaPaginas = conSVG => pags.map(([a, b]) => {
        const cv = document.createElement("canvas"); cv.width = Math.round(PW * K); cv.height = Math.round(PH * K);
        const ctx = cv.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.scale(K, K); ctx.translate(M, M - a);
        ctx.beginPath(); ctx.rect(-2, a, ANCHO + 4, b - a); ctx.clip();
        for (const op of ops) {
          if (op.r.y >= b || op.r.y + op.r.h <= a) continue;
          if (op.t === "caja") caja(ctx, op);
          else if (op.t === "svg") { if (conSVG && op.img) ctx.drawImage(op.img, op.r.x, op.r.y, op.r.w, op.r.h); }
          else {
            ponFuente(ctx, op.font); ctx.fillStyle = op.col; ctx.textBaseline = "alphabetic";
            if ("letterSpacing" in ctx) ctx.letterSpacing = op.ls && op.ls !== "normal" ? op.ls : "0px";
            const mt = ctx.measureText(op.s), asc = mt.fontBoundingBoxAscent || mt.actualBoundingBoxAscent || op.r.h * 0.8, desc = mt.fontBoundingBoxDescent || mt.actualBoundingBoxDescent || op.r.h * 0.2;
            ctx.fillText(op.s, op.r.x, op.r.y + (op.r.h - (asc + desc)) / 2 + asc);
          }
        }
        const url = cv.toDataURL("image/jpeg", 0.9), bin = atob(url.slice(url.indexOf(",") + 1)), bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return { bytes, w: cv.width, h: cv.height };
      });
      let paginas;
      try { paginas = dibujaPaginas(true); } catch (e) { paginas = dibujaPaginas(false); }
      return pdfDesdeJPEGs(paginas, A4W, A4H);
    } finally { hoja.remove(); }
  }
  let pdfListo = null;
  const rutaActual = () => location.hash.split("?")[0];
  function prepararPDF() {
    pdfListo = null; const r = rutaActual();
    setTimeout(() => { if (rutaActual() === r && document.body.classList.contains("ver-informe")) generarPDF().then(b => { pdfListo = { r, blob: b }; }).catch(() => {}); }, 300);
  }
  async function guardarPDF() {
    if (!document.body.classList.contains("ver-informe")) { irInforme(); toast("Preparando el PDF… pulsa de nuevo «Guardar / imprimir» en un momento.", 4000); return; }
    let blob = pdfListo && pdfListo.r === rutaActual() ? pdfListo.blob : null;
    if (!blob) { toast("Preparando el PDF…"); try { blob = await generarPDF(); pdfListo = { r: rutaActual(), blob }; } catch (e) { toast("No se ha podido crear el PDF.", 4000); return; } }
    const file = new File([blob], nombreArchivo("pdf"), { type: "application/pdf" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: file.name }); toast(""); }
      catch (e) { if (e && e.name === "AbortError") { toast(""); return; } toast("PDF listo: pulsa otra vez «Guardar / imprimir».", 4000); }
      return;
    }
    descargar(blob, file.name); toast("PDF descargado.", 3000);
  }
  function descargar(blob, nombre) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nombre;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 200);
  }
  function irInforme() { location.hash = rutaActual() + "?informe=1"; }
  function imprimir() {
    if (esIOS()) { guardarPDF(); return; }
    if (!document.body.classList.contains("ver-informe")) { irInforme(); setTimeout(() => window.print(), 400); return; }
    window.print();
  }
  function compartirOBajar(blob, nombre, msg) {
    const file = new File([blob], nombre, { type: blob.type });
    if (esIOS() && navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: nombre }).catch(() => {});
    else { descargar(blob, nombre); toast(msg, 3500); }
  }

  // ---------- Copia de seguridad e importar ----------
  async function copiaSeguridad() {
    const contenido = JSON.stringify({ app: "acrishikawa", v: L.VERSION_DATOS, exportado: hoy(), analisis: datosUsuario.analisis, intercambio: L.paqueteIntercambio(datosUsuario.analisis, APP_VERSION, hoy()) }, null, 1);
    const nombreC = `ACR Ishikawa copia ${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([contenido], { type: "application/json" });
    const file = new File([blob], nombreC, { type: "application/json" });
    if (esIOS() && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: nombreC }); } catch (e) { if (e && e.name === "AbortError") return; }
    } else descargar(blob, nombreC);
    datosUsuario.ultimaCopia = hoy(); guardar(true);
    toast("Copia guardada. Guárdala en un sitio seguro (Archivos, Drive, correo…).", 4500);
    if (rutaActual() === "#/" || rutaActual() === "") renderHome();
  }
  function importar(file) {
    const fr = new FileReader();
    fr.onload = () => {
      let s = null; try { s = L.sanearDatos(JSON.parse(fr.result), genId, hoy()); } catch (e) { /* */ }
      if (!s) { toast("Ese archivo no es una copia de ACR · Ishikawa.", 4000); return; }
      s.analisis.forEach(x => { if (esIdEjemplo(x.id)) x.id = genId(); });   // nunca se importa un id de ejemplo
      const aplicar = modo => {
        const r = modo === "sustituir" ? s : L.fusionar(datosUsuario, s);
        datosUsuario.analisis = r.analisis; guardar(true);
        toast(`Importados ${plural(s.analisis.length, "análisis", "análisis")}.`, 4000);
        location.hash = "#/"; route();
      };
      if (!datosUsuario.analisis.length) { aplicar("sustituir"); return; }
      confirmar(`<p>La copia tiene <b>${plural(s.analisis.length, "análisis", "análisis")}</b>.</p><p><b>Añadir</b> los junta con los tuyos (si uno está en los dos, se queda el más reciente): así se trabaja en equipo. Si prefieres <b>sustituir</b> todo lo tuyo por la copia, pulsa «Sustituir».</p>`, "Añadir a mis datos", () => aplicar("anadir"), { titulo: "Importar copia", peligro: false, otro: ["Sustituir", () => confirmar("<p>Se borrarán tus análisis actuales y se quedará solo lo de la copia. Esto no se puede deshacer.</p>", "Sustituir", () => aplicar("sustituir"))] });
    };
    fr.readAsText(file);
  }

  // ---------- Confirmación ----------
  function confirmar(html, siTxt, alSi, o = {}) {
    const m = $("#modal-confirmar");
    $("#conf-titulo").textContent = o.titulo || "¿Seguro?";
    $("#conf-texto").innerHTML = html;
    const si = $("#btn-conf-si"), no = $("#btn-conf-no");
    si.textContent = siTxt; si.className = "btn " + (o.peligro === false ? "btn--primary" : "btn--peligro");
    let extra = $("#btn-conf-otro"); if (extra) extra.remove();
    if (o.otro) { extra = document.createElement("button"); extra.id = "btn-conf-otro"; extra.className = "btn"; extra.textContent = o.otro[0]; no.after(extra); extra.onclick = () => { m.hidden = true; o.otro[1](); }; }
    si.onclick = () => { m.hidden = true; alSi(); };
    no.onclick = () => { m.hidden = true; if (o.alNo) o.alNo(); };
    m.hidden = false; si.focus();
  }

  // ---------- Cambiar de plantilla de categorías ----------
  function cambiarPlantilla(a, destino) {
    const C0 = L.causasCon(a);
    if (!C0.length || destino === "propia") {
      if (destino === "propia" && !a.categoriasPropias.some(lleno)) a.categoriasPropias = L.categorias(a).map(c => c.nom).concat(Array(L.MAX_PROPIAS).fill("")).slice(0, L.MAX_PROPIAS);
      const reparto = destino === "propia" ? a.causas.map(x => ({ causaId: x.id, a: "p" + Math.max(0, L.categorias(a).findIndex(c => c.k === x.cat)) })) : null;
      L.cambiarPlantilla(a, destino, a.categoriasPropias, reparto); tocado(a); repintar(); return;
    }
    const prop = L.propuestaCambio(a, destino), D2 = L.PLANTILLAS[destino].cats;
    const filas = prop.map(r => { const x = a.causas.find(y => y.id === r.causaId); if (!x || !lleno(x.texto)) return ""; return `<tr><td>${esc(L.corto(x.texto, 60))}<br><small>${esc(L.nombreCat(a, x.cat))}</small></td><td><select class="txt-in" data-rep="${x.id}">${D2.map(c => `<option value="${c.k}"${c.k === r.a ? " selected" : ""}>${esc(c.nom)}</option>`).join("")}</select></td></tr>`; }).join("");
    confirmar(`<p>Pasar a «${esc(L.PLANTILLAS[destino].nom)}». Esta es la categoría que propongo para cada causa; cámbiala si no te convence.</p><div class="table-wrap"><table class="mini rep-t"><thead><tr><th>Causa</th><th>Nueva categoría</th></tr></thead><tbody>${filas}</tbody></table></div>`, "Cambiar", () => {
      const reparto = prop.map(r => { const s = $(`[data-rep="${r.causaId}"]`); return { causaId: r.causaId, a: s ? s.value : r.a }; });
      L.cambiarPlantilla(a, destino, null, reparto); tocado(a); repintar();
    }, { titulo: "Cambiar las categorías", peligro: false, alNo: () => repintar() });
  }

  // ---------- Copiar un ejemplo a mis datos ----------
  function copiarAMisDatos() {
    if (!actual || !esIdEjemplo(actual.id)) return;
    const m = new Map();
    const c = Object.assign(clon(actual), { id: genId(), creado: hoy(), modificado: hoy() });
    c.causas.forEach(x => { const n = genId(); m.set(x.id, n); x.id = n; });
    c.acciones.forEach(x => { x.id = genId(); x.causas = x.causas.map(id => m.get(id) || ""); });
    datosUsuario.analisis.push(c); guardar(true); location.hash = `#/analisis/${c.id}/${pasoActual}`;
    toast("Copiado a tus análisis. Ya es tuyo: cámbialo a tu gusto.", 4000);
  }
  $("#banner-copiar").addEventListener("click", copiarAMisDatos);

  // ---------- Enrutado ----------
  const NAV = [["", "Inicio"], ["analisis", "Mis análisis"], ["ejemplos", "Ejemplos"], ["aprende", "Aprende"], ["prueba", "Ponte a prueba"], ["glosario", "Glosario"]];
  function buildNav() { $("#calc-nav").innerHTML = NAV.map(([r, t]) => `<a href="#/${r}" data-r="${r}">${t}</a>`).join(""); }
  function noEncontrado(que, href, txt) { view.innerHTML = `<div class="error-box">No se encuentra ${que} en este dispositivo.</div><p><a href="${href}">${txt}</a></p>`; }
  function route() {
    const [ruta, qs] = (location.hash.replace(/^#\/?/, "") || "").split("?");
    const partes = ruta.split("/"), q = new URLSearchParams(qs || "");
    const informe = q.get("informe") === "1";
    document.body.classList.toggle("ver-informe", informe);
    actual = null;
    const idR = partes[1] || "", ej = ejemplos();
    modoEjemplo = partes[0] === "ejemplos" || (esIdEjemplo(idR) && ej.analisis.some(x => x.id === idR));
    datos = modoEjemplo ? ej : datosUsuario;
    $("#banner-ejemplo").hidden = !modoEjemplo || informe || partes[0] === "ejemplos";
    let navR = partes[0];
    if (partes[0] === "nuevo") {
      const a = L.nuevoAnalisis(genId(), hoy(), partes[1] === "acr" ? "acr" : "ishikawa"); borradores.set(a.id, a);
      const p1 = L.pasosDe(a).find(p => p.k === "problema").n;
      history.replaceState(null, "", `#/analisis/${a.id}/${p1}`); renderAnalisis(a, p1); navR = "analisis";
    } else if (partes[0] === "analisis" && partes[1]) {
      const a = buscaAnalisis(partes[1]) || borradores.get(partes[1]);
      if (!a) noEncontrado("ese análisis", "#/analisis", "Ir a mis análisis");
      else {
        let n = parseInt(partes[2], 10);
        if (!(n >= 1 && n <= L.pasosDe(a).length)) { const p = L.pasoPendiente(a, ENTREGA) || L.pasosDe(a).find(disponible); n = p.n; history.replaceState(null, "", `#/analisis/${a.id}/${n}${informe ? "?informe=1" : ""}`); }
        renderAnalisis(a, n);
      }
      navR = "analisis";
    } else if (partes[0] === "analisis") renderLista();
    else if (partes[0] === "ejemplos") renderEjemplos();
    else if (partes[0] === "aprende") renderAprende(parseInt(partes[1], 10) || 0);
    else if (partes[0] === "glosario") renderGlosario();
    else if (partes[0] === "prueba") renderPrueba(partes[1] === "practica" ? "practica" : (C.TEMAS_TEST[partes[1]] ? Number(partes[1]) : 0));
    else { renderHome(); navR = ""; }
    if (modoEjemplo) navR = "ejemplos";
    if (informe) { $$("details").forEach(d => { d.open = true; }); if (esIOS()) prepararPDF(); }
    $$("#calc-nav a").forEach(x => x.classList.toggle("active", x.dataset.r === navR));
    const act = $("#calc-nav a.active"); if (act && act.scrollIntoView) act.scrollIntoView({ block: "nearest", inline: "center" });
    window.scrollTo(0, 0);
  }

  // ---------- Eventos ----------
  function tocado(a) {
    a.modificado = hoy();
    if (a === actual && !esVacio(a) && !datos.analisis.includes(a)) { datos.analisis.push(a); borradores.delete(a.id); }
    guardar();
  }
  const buscaEn = (lista, id) => lista.find(x => x.id === id);
  function autoAlto(el) { el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; }
  new MutationObserver(() => $$("textarea.txt-in", view).forEach(el => { if (!el.closest("[hidden]")) autoAlto(el); })).observe(view, { childList: true, subtree: true });

  view.addEventListener("input", e => {
    const t = e.target, a = actual;
    if (t.matches("textarea.txt-in")) autoAlto(t);
    if (!a || t.dataset.actSel || t.dataset.rep) return;
    const f = t.dataset.f;
    if (t.dataset.ca) {
      const x = buscaEn(a.causas, t.dataset.ca); if (!x) return;
      setPath(x, f, t.value); tocado(a); refrescar({ causa: x.id });
      // Al escribir el último «¿por qué?» visible aparece el siguiente (sin perder el foco)
      if (/^porques\.\d$/.test(f) && lleno(t.value)) { const j = Number(f.split(".")[1]), pq = t.closest(".cau-pq"); if (j < L.MAX_PORQUES - 1 && pq && !pq.querySelector(`[data-f="porques.${j + 1}"]`)) { const d = document.createElement("div"); d.className = "pq-fila"; d.innerHTML = `<span class="pq-n">${j + 2}</span><input class="txt-in cau-in cau-in--pq" ${bca(x, "porques." + (j + 1))} value="" placeholder="¿Y por qué?" autocomplete="off" />`; t.closest(".pq-fila").after(d); } }
      return;
    }
    if (t.dataset.ac) {
      const x = buscaEn(a.acciones, t.dataset.ac); if (!x) return;
      setPath(x, f, t.value); tocado(a);
      if (f === "categoria") { repintar(); return; }
      refrescar(); return;
    }
    if (t.dataset.af) { const x = buscaEn(a.afirmaciones, t.dataset.af); if (!x) return; setPath(x, f, t.value); tocado(a); refrescar({ afirmacion: x.id }); return; }
    const simple = [["m", a.equipo], ["e", a.entrevistas], ["r", a.reuniones], ["h", a.cronologia], ["p", a.problemasAtencion]].find(([d]) => t.dataset[d]);
    if (simple) { const x = buscaEn(simple[1], t.dataset[simple[0]]); if (!x) return; setPath(x, f, t.value); tocado(a); if (t.tagName === "SELECT") repintar(); else refrescar(); return; }
    if (t.dataset.k) { setPath(a, t.dataset.k, t.value); tocado(a); if (t.tagName === "SELECT") repintar(); else refrescar(); }
  });
  view.addEventListener("change", e => {
    const t = e.target, a = actual; if (!a) return;
    if (t.dataset.actSel === "plantilla") { cambiarPlantilla(a, t.value); return; }
    if (t.dataset.repinta) repintar();
  });
  view.addEventListener("toggle", e => {
    if (e.target.matches && e.target.matches("details[data-recordar]") && !document.body.classList.contains("ver-informe")) escribir(KEY_FACIL, e.target.open ? "1" : "0");
  }, true);

  view.addEventListener("click", e => {
    const t = e.target; let b;
    if ((b = t.closest(".info-btn"))) { const h = $("#help-" + b.dataset.info); if (!h) return; const open = h.hidden; h.hidden = !open; b.setAttribute("aria-expanded", String(open)); return; }
    const a = actual;
    if ((b = t.closest("[data-acpick]")) && a) { const x = buscaEn(a.acciones, b.dataset.acpick); if (!x) return; setPath(x, b.dataset.f, getPath(x, b.dataset.f) === b.dataset.v && b.dataset.f !== "estado" ? "" : b.dataset.v); tocado(a); repintar(); return; }
    if ((b = t.closest("[data-acc]")) && a) {
      const x = buscaEn(a.acciones, b.dataset.acc); if (!x) return;
      const i = x.causas.indexOf(b.dataset.c); if (i < 0) x.causas.push(b.dataset.c); else x.causas.splice(i, 1);
      b.classList.toggle("active", i < 0); tocado(a); refrescar(); return;
    }
    if ((b = t.closest("[data-kpick]")) && a) { setPath(a, b.dataset.kpick, b.dataset.v); tocado(a); repintar(); return; }
    if ((b = t.closest("[data-kchk]")) && a) { setPath(a, b.dataset.kchk, !getPath(a, b.dataset.kchk)); tocado(a); repintar(); return; }
    if ((b = t.closest("[data-mpick]")) && a) { const m = buscaEn(a.equipo, b.dataset.mpick); if (!m) return; m.papel = b.dataset.v; tocado(a); repintar(); return; }
    if (!(b = t.closest("[data-act]"))) return;
    const act = b.dataset.act, id = b.dataset.id;
    // --- ACR: decidir, equipo, cronología, espinas ---
    if (act === "eq-sug" && a) { const p = L.PERFILES_ACR[Number(b.dataset.i)]; if (!p) return; if (a.equipo.some(m => L.normal(m.perfil) === L.normal(p.perfil))) { toast("Ese perfil ya está en el equipo.", 2500); return; } a.equipo.push(Object.assign(L.nuevoMiembro(genId()), { perfil: p.perfil, papel: a.equipo.some(m => m.papel === "coordina") && p.papel === "coordina" ? "miembro" : p.papel })); tocado(a); repintar(); }
    else if (act === "eq-add" && a) { const m = L.nuevoMiembro(genId()); a.equipo.push(m); tocado(a); repintar(); const el = $(`[data-m="${m.id}"][data-f="perfil"]`); if (el) el.focus(); }
    else if (act === "eq-del" && a) { a.equipo = a.equipo.filter(m => m.id !== id); tocado(a); repintar(); }
    else if (act === "eq-impl" && a) { const m = buscaEn(a.equipo, id); if (!m) return; m.implicado = b.checked; tocado(a); repintar(); }
    else if (act === "ent-add" && a) { a.entrevistas.push(L.nuevaEntrevista(genId())); tocado(a); repintar(); }
    else if (act === "ent-del" && a) { a.entrevistas = a.entrevistas.filter(x => x.id !== id); tocado(a); repintar(); }
    else if (act === "ent-hecha" && a) { const x = buscaEn(a.entrevistas, id); if (!x) return; x.hecha = !x.hecha; tocado(a); repintar(); }
    else if (act === "reu-add" && a) { a.reuniones.push(L.nuevaReunion(genId())); tocado(a); repintar(); }
    else if (act === "reu-del" && a) { a.reuniones = a.reuniones.filter(x => x.id !== id); tocado(a); repintar(); }
    else if (act === "h-add" && a) { const h = L.nuevoHecho(genId()); a.cronologia.push(h); tocado(a); repintar(); const el = $(`[data-h="${h.id}"][data-f="hora"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); } }
    else if (act === "h-del" && a) { const h = buscaEn(a.cronologia, id); if (!h) return; const hacer = () => { a.cronologia = a.cronologia.filter(x => x.id !== id); a.problemasAtencion.forEach(p => { if (p.hechoId === id) p.hechoId = ""; }); tocado(a); repintar(); }; if (lleno(h.hecho)) confirmar(`<p>Se quitará el hecho «${esc(L.corto(h.hecho, 60))}».</p>`, "Quitar", hacer); else hacer(); }
    else if ((act === "h-subir" || act === "h-bajar") && a) { const i = a.cronologia.findIndex(x => x.id === id), j = act === "h-subir" ? i - 1 : i + 1; if (i < 0 || j < 0 || j >= a.cronologia.length) return; [a.cronologia[i], a.cronologia[j]] = [a.cronologia[j], a.cronologia[i]]; tocado(a); repintar(); }
    else if ((act === "h-des" || act === "h-bien") && a) { const h = buscaEn(a.cronologia, id); if (!h) return; const k = act === "h-des" ? "desajuste" : "bien"; h[k] = !h[k]; tocado(a); repintar(); }
    else if (act === "h-problema" && a) { const h = buscaEn(a.cronologia, id); if (!h) return; const x = Object.assign(L.nuevoProblemaAt(genId()), { texto: L.limpia(h.hecho), hechoId: h.id }); a.problemasAtencion.push(x); tocado(a); repintar(); const el = $(`[data-p="${x.id}"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); } }
    else if (act === "pa-add" && a) { a.problemasAtencion.push(L.nuevoProblemaAt(genId())); tocado(a); repintar(); }
    else if (act === "pa-del" && a) { const x = buscaEn(a.problemasAtencion, id); if (!x) return; const n = a.causas.filter(c => c.espina === id && lleno(c.texto)).length; const hacer = () => { a.problemasAtencion = a.problemasAtencion.filter(y => y.id !== id); a.causas.forEach(c => { if (c.espina === id) c.espina = ""; }); if (espinaActual === id) espinaActual = ""; tocado(a); repintar(); }; if (n) confirmar(`<p>Se quitará el problema «${esc(L.corto(x.texto, 60))}». Sus ${plural(n, "causa pasa", "causas pasan")} a la espina principal.</p>`, "Quitar", hacer); else hacer(); }
    else if (act === "espina-sel") { espinaActual = id || ""; repintar(); }
    else if (act === "traer" && a) traerA(a, b.dataset.f, id);
    else if (act === "reunion") ponerReunion(!document.body.classList.contains("modo-reunion"));
    else if (act === "af-add" && a) { const f = Object.assign(L.nuevaAfirmacion(genId()), { causaId: id || "" }); const x = a.causas.find(c => c.id === id); if (x) f.texto = L.afirmacionSugerida(a, x); a.afirmaciones.push(f); tocado(a); repintar(); const el = $(`[data-af="${f.id}"][data-f="texto"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); } }
    else if (act === "af-del" && a) { const f = buscaEn(a.afirmaciones, id); if (!f) return; const hacer = () => { a.afirmaciones = a.afirmaciones.filter(y => y.id !== id); tocado(a); repintar(); }; if (lleno(f.texto)) confirmar(`<p>Se quitará la afirmación «${esc(L.corto(f.texto, 70))}».</p>`, "Quitar", hacer); else hacer(); }
    else if (act === "af-sug" && a) { const f = buscaEn(a.afirmaciones, id), x = f && a.causas.find(c => c.id === f.causaId); if (!x) return; const hacer = () => { f.texto = L.afirmacionSugerida(a, x); tocado(a); repintar(); }; if (lleno(f.texto)) confirmar("<p>Se sustituirá el texto de la afirmación por la propuesta.</p>", "Sustituir", hacer, { peligro: false }); else hacer(); }
    else if (act === "concl-sug" && a) { const hacer = () => { a.conclusiones = L.conclusionesSugeridas(a); tocado(a); repintar(); }; if (lleno(a.conclusiones)) confirmar("<p>Se sustituirán las conclusiones que has escrito por la propuesta.</p>", "Sustituir", hacer, { peligro: false }); else hacer(); }
    else if (act === "verif" && a) { const i = a.verificacion.indexOf(id); if (b.checked && i < 0) a.verificacion.push(id); if (!b.checked && i >= 0) a.verificacion.splice(i, 1); tocado(a); }
    else if (act === "preg" && a) { L.responder(a, id, L.respuesta(a, id) === b.dataset.v ? "" : b.dataset.v); tocado(a); repintar(); }
    else if (act === "preg-causa" && a) { const q = C.PREGUNTAS.find(x => x.id === id); if (!q) return; const x = Object.assign(L.nuevaCausa(genId(), b.dataset.cat, espinaActual || ""), { texto: q.causa }); a.causas.push(x); tocado(a); repintar(); const el = $(`[data-ca="${x.id}"][data-f="texto"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); } }
    // --- Lista ---
    else if (act === "an-dup") {
      const o = buscaAnalisis(id); if (!o) return;
      const c = Object.assign(clon(o), { id: genId(), titulo: (o.titulo || L.corto(o.problema, 60) || "Análisis") + " (copia)", creado: hoy(), modificado: hoy() });
      datos.analisis.push(c); guardar(); renderLista(); toast("Análisis duplicado.", 2500);
    }
    else if (act === "an-del") {
      const o = buscaAnalisis(id); if (!o) return;
      confirmar(`<p>Se borrará «${esc(L.corto(nombre(o) || "Análisis sin nombre", 80))}» con sus ${plural(L.causasCon(o).length, "causa", "causas")} y ${plural(o.acciones.length, "acción", "acciones")}. Esto no se puede deshacer${datosUsuario.ultimaCopia ? "" : " (y aún no tienes ninguna copia de seguridad)"}.</p>`, "Borrar", () => {
        datos.analisis = datos.analisis.filter(x => x.id !== id); if (!modoEjemplo) datosUsuario.analisis = datos.analisis; guardar(true); renderLista();
      });
    }
    // --- Espina ---
    else if (act === "ca-add" && a) {
      const x = L.nuevaCausa(genId(), b.dataset.cat, espinaActual || ""); a.causas.push(x); tocado(a); repintar();
      const el = $(`[data-ca="${x.id}"][data-f="texto"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); }
    }
    else if (act === "ca-del" && a) {
      const x = buscaEn(a.causas, id); if (!x) return;
      const hacer = () => { a.causas = a.causas.filter(y => y.id !== id); a.acciones.forEach(y => { y.causas = y.causas.filter(c => c !== id); }); tocado(a); repintar(); };
      if (lleno(x.texto) && (x.porques.some(lleno) || x.elegida || x.votos)) confirmar(`<p>Se quitará la causa «${esc(L.corto(x.texto, 60))}» con sus «¿por qué?» y sus votos.</p>`, "Quitar", hacer); else hacer();
    }
    else if (act === "vista-porques" || act === "vista-solo") {
      vista[act === "vista-porques" ? "porques" : "solo"] = b.checked; escribir(KEY_VISTA, JSON.stringify(vista));
      $$(`[data-act="${act}"]`).forEach(el => { el.checked = b.checked; }); refrescar();
    }
    // --- Elegir ---
    else if (act === "ca-elegir" && a) { const x = buscaEn(a.causas, id); if (!x) return; x.elegida = b.checked; tocado(a); repintar(); }
    else if (act === "voto" && a) { const x = buscaEn(a.causas, id); if (!x) return; x.votos = Math.max(0, (x.votos || 0) + Number(b.dataset.v)); tocado(a); repintar(); }
    else if (act === "prueba" && a) { const x = buscaEn(a.causas, id); if (!x) return; x.prueba = b.dataset.v; tocado(a); repintar(); }
    // --- Acciones ---
    else if (act === "ac-add" && a) {
      const x = L.nuevaAccion(genId()); const E = L.elegidas(a).filter(c => !a.acciones.some(y => y.causas.includes(c.id)));
      if (E.length) x.causas = [E[0].id];
      a.acciones.push(x); tocado(a); repintar();
      const el = $(`[data-ac="${x.id}"][data-f="que"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); }
    }
    else if (act === "ac-del" && a) {
      const x = buscaEn(a.acciones, id); if (!x) return;
      const hacer = () => { a.acciones = a.acciones.filter(y => y.id !== id); tocado(a); repintar(); };
      if (lleno(x.que)) confirmar(`<p>Se quitará la acción «${esc(L.corto(x.que, 60))}».</p>`, "Quitar", hacer); else hacer();
    }
    // --- Exportar ---
    else if (act === "ex-copiar" && a) copiarImagen(a);
    else if (act === "ex-png" && a) exportarImagen(a, "png");
    else if (act === "ex-svg" && a) exportarImagen(a, "svg");
    else if (act === "ex-blanco" && a) plantillaBlanco(a);
    else if (act === "ver-ficha") irInforme();
    else if (act === "doc-word" && a) descargarWord(a);
    else if (act === "excel" && a) exportarExcel(a);
    else if (act === "imprimir") imprimir();
    else if (act === "volver") location.hash = rutaActual();
    // --- Inicio ---
    else if (act === "copia") copiaSeguridad();
    else if (act === "importar") $("#input-importar").click();
    // --- Ponte a prueba ---
    else if (act === "quiz") {
      const q = Number(b.dataset.q); if (q in respuestas) return;
      respuestas[q] = Number(b.dataset.o); const y = window.scrollY; route(); window.scrollTo(0, y);
    }
    else if (act === "quiz-reset") { Object.keys(respuestas).forEach(k => delete respuestas[k]); route(); }
    else if (act === "ej-regla" || act === "ej-fuerza") { const R0 = act === "ej-regla" ? respReglas : respFuerza, i = Number(b.dataset.i); if (i in R0) return; R0[i] = act === "ej-regla" ? Number(b.dataset.v) : b.dataset.v; const y = window.scrollY; renderPractica(); window.scrollTo(0, y); }
    else if (act === "practica-reset") { [respReglas, respFuerza].forEach(o => Object.keys(o).forEach(k => delete o[k])); renderPractica(); }
  });
  $("#input-importar").addEventListener("change", e => { const f = e.target.files && e.target.files[0]; e.target.value = ""; if (f) importar(f); });
  // Imprimir: abrir los desplegables y restaurarlos después
  let cerrados = [];
  window.addEventListener("beforeprint", () => { cerrados = $$("details").filter(d => !d.open); cerrados.forEach(d => { d.open = true; }); });
  window.addEventListener("afterprint", () => { cerrados.forEach(d => { d.open = false; }); cerrados = []; });

  // ---------- Datos de otras apps (copia saneada, sin vínculo vivo) ----------
  // Lee el paquete que la otra app deja en este navegador o, si no hay, ofrece cargar su copia .json (#input-ext).
  const FUENTES_EXT = {
    amfe: { nom: "AMFE", leer: o => L.leerFallos(o) },
    mapa: { nom: "Mapa de Riesgos", leer: o => L.leerFallos(o) },
    rondas: { nom: "Rondas de Seguridad", leer: o => L.leerRondas(o) },
    flujo: { nom: "Flujograma", leer: o => L.leerFlujos(o) },
    ind: { nom: "Indicadores", leer: o => L.leerIndicadores(o) },
    lc: { nom: "Lectura Crítica", leer: o => L.lecturasDe(o) }
  };
  // [eco]
  const CLAVES_EXT = { amfe: "amfe-intercambio", mapa: "mapariesgos-intercambio", rondas: "rondas-intercambio", flujo: "flujograma-intercambio", ind: "indicadores-datos", lc: "lecturacritica-intercambio" };
  // [/eco]
  const cargadosExt = {}; let pendienteExt = null;
  function traerExt(fuente, alElegir) {
    const F = FUENTES_EXT[fuente], titulo = "Traer de " + F.nom; pendienteExt = { fuente, alElegir, titulo };
    // [eco]
    let r = null; try { r = F.leer(JSON.parse(leer(CLAVES_EXT[fuente]) || "null")); } catch (e) { /* */ }
    const lista = cargadosExt[fuente] || (r && r.lista && r.lista.length ? r.lista : null);
    if (lista) { alElegir(lista, titulo); return; }
    confirmar(r && r.error === "version" ? `<p>Los datos de <b>${F.nom}</b> de este navegador son de una versión que esta app aún no sabe leer.</p>`
      : `<p>No hay datos de la app <b>${F.nom}</b> en este navegador${fuente === "ind" ? "" : " (o no tienen nada que traer)"}.</p><p>Si los tienes en otro dispositivo, carga su copia de seguridad (.json).</p>`,
      "Cargar una copia", () => $("#input-ext").click(), { titulo, peligro: false });
    // [/eco]
    /* [ind]
    if (cargadosExt[fuente]) { alElegir(cargadosExt[fuente], titulo); return; }
    $("#input-ext").click();
    [/ind] */
  }
  $("#input-ext").addEventListener("change", e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f || !pendienteExt) return;
    const { fuente, alElegir, titulo } = pendienteExt, F = FUENTES_EXT[fuente], fr = new FileReader();
    fr.onload = () => {
      let r = null; try { r = F.leer(JSON.parse(fr.result)); } catch (er) { /* */ }
      if (!r || r.error) { toast(r && r.error === "version" ? `Esa copia es de una versión de ${F.nom} que esta app aún no sabe leer.` : `Ese archivo no es una copia de la app ${F.nom}.`, 4500); return; }
      if (!r.lista.length) { toast(`Esa copia de ${F.nom} no tiene nada que traer.`, 4000); return; }
      cargadosExt[fuente] = r.lista; alElegir(r.lista, titulo);
    };
    fr.readAsText(f);
  });
  const cortar = (s, n) => s.length > n ? s.slice(0, n - 1) + "…" : s;
  // Ventana para elegir uno: grupos [{ titulo, items: [{ t, s }] }] → alElegir(i del grupo, j del item)
  function elegir(titulo, intro, grupos, alElegir, siTxt = "Traer") {
    let k = 0;
    const html = grupos.map((g, i) => `${grupos.length > 1 || g.titulo ? `<p class="elegir-g"><b>${esc(g.titulo)}</b></p>` : ""}${g.items.map((x, j) => `<label class="lc-op"><input type="radio" name="ext-sel" value="${i}:${j}"${k++ ? "" : " checked"} /><span><b>${esc(cortar(x.t, 140))}</b>${x.s ? `<small>${esc(x.s)}</small>` : ""}</span></label>`).join("")}`).join("");
    confirmar(`<p>${intro}</p><div class="lc-lista">${html}</div>`, siTxt, () => { const s = document.querySelector('input[name="ext-sel"]:checked'); if (!s) return; const [i, j] = s.value.split(":").map(Number); alElegir(i, j); }, { titulo, peligro: false });
  }
  function traerA(a, fuente, idAccion) {
    if (fuente === "amfe" || fuente === "mapa") traerExt(fuente, (lista, titulo) => elegir(titulo, "Elige el fallo. Los prioritarios van primero.", lista.map(am => ({ titulo: `${am.titulo}${am.unidad ? " · " + am.unidad : ""}`, items: am.fallos.map(f => ({ t: `${f.num ? "Nº " + f.num + " · " : ""}${f.fallo}`, s: [f.ipr ? "IPR " + f.ipr : "", f.prioritario ? "prioritario" : "", f.critico ? "crítico" : "", f.ishikawa.length ? `Ishikawa con ${f.ishikawa.length} causas` : ""].filter(Boolean).join(" · ") })) })), (i, j) => {
      const am = lista[i], f = am.fallos[j], hacer = () => { const r = L.traerFallo(a, am, f, genId); tocado(a); repintar(); toast(`Traído: el problema${r.causas ? `, ${plural(r.causas, "causa", "causas")}` : ""}${r.acciones ? ` y ${plural(r.acciones, "acción", "acciones")}` : ""}. Revísalo: un modo de fallo dice lo que puede pasar; el problema, lo que pasa.`, 6000); };
      if (lleno(a.problema)) confirmar("<p>El problema que ya has escrito se queda; se añadirán las causas y las acciones del fallo.</p>", "Añadir", hacer, { peligro: false }); else hacer();
    }));
    else if (fuente === "rondas") traerExt(fuente, (lista, titulo) => elegir(titulo, "Elige el punto caliente: lo que falla una y otra vez.", lista.map(u => ({ titulo: u.unidad, items: u.calientes.map(p => ({ t: p.texto, s: [p.bloque, p.por === "turno" ? "falla en el turno de " + (p.turno || "…") : "falla de forma repetida"].filter(Boolean).join(" · ") })) })), (i, j) => {
      if (lleno(a.problema)) { toast("Este análisis ya tiene un problema escrito. Créalo desde un análisis nuevo.", 4500); return; }
      L.traerCaliente(a, lista[i], lista[i].calientes[j]); tocado(a); repintar(); toast("Traído. Revisa la frase del problema y añade el dato.", 4000);
    }));
    else if (fuente === "flujo") traerExt(fuente, (lista, titulo) => elegir(titulo, "Elige el proceso. Sus pasos irán, en orden, a la fila de «lo que debería haber pasado»; tú escribes al lado lo que pasó.", [{ titulo: "", items: lista.map(f => ({ t: f.titulo, s: `${plural(f.pasos.length, "paso", "pasos")}${f.unidad ? " · " + f.unidad : ""}` })) }], (i, j) => {
      const k = L.traerFlujo(a, lista[j], genId); tocado(a); repintar(); toast(k ? `${plural(k, "paso añadido", "pasos añadidos")} a la cronología. Borra los que no vengan al caso.` : "Esos pasos ya estaban en la cronología.", 5000);
    }));
    else if (fuente === "ind") traerExt(fuente, (lista, titulo) => elegir(titulo, "Elige el indicador para esta acción.", [{ titulo: "", items: lista.map(x => ({ t: x.nombre, s: [x.esperado, x.numerador ? "con numerador y denominador" : ""].filter(Boolean).join(" · ") })) }], (i, j) => {
      const x = buscaEn(a.acciones, idAccion), y = lista[j]; if (!x) return;
      const hacer = () => { Object.assign(x.indicador, { nombre: y.nombre, numerador: y.numerador, denominador: y.denominador, esperado: y.esperado || x.indicador.esperado }); tocado(a); repintar(); toast("Indicador copiado. Pon la fecha de medida.", 3500); };
      if (lleno(x.indicador.nombre)) confirmar("<p>Se sustituirá el indicador de esta acción por el elegido.</p>", "Sustituir", hacer, { peligro: false }); else hacer();
    }));
    else if (fuente === "lc") traerExt(fuente, (lista, titulo) => elegir(titulo, "Elige la lectura cuya evidencia quieres añadir a las notas de la acción. Se copia como texto.", [{ titulo: "", items: lista.map(x => ({ t: x.titulo || L.referenciaLC(x), s: [x.tipoNombre, x.anio, x.decision ? L.DECISION_LC[x.decision] : "Sin decisión"].filter(Boolean).join(" · ") })) }], (i, j) => {
      const x = buscaEn(a.acciones, idAccion), y = lista[j]; if (!x) return;
      const hacer = () => { x.nota = [x.nota, L.textoEvidenciaLC(y)].filter(lleno).join("\n"); tocado(a); repintar(); toast("Evidencia añadida a las notas de la acción.", 3500); };
      if (y.decision === "aplicar") hacer(); else confirmar(`<p>La decisión de esta lectura fue <b>${y.decision ? L.DECISION_LC[y.decision].toLowerCase() : "ninguna todavía"}</b>: con ella sola no basta para cambiar la práctica.</p><p>¿Añadirla de todos modos?</p>`, "Añadir igualmente", hacer, { titulo, peligro: false });
    }));
  }

  // ---------- Modo reunión: letra grande y pantalla limpia para proyectar (RCA²: proyectar o usar pósits ayuda al equipo) ----------
  function ponerReunion(si) {
    document.body.classList.toggle("modo-reunion", si);
    let x = $("#salir-reunion");
    if (si && !x) { x = document.createElement("button"); x.id = "salir-reunion"; x.className = "btn salir-reunion no-print"; x.textContent = "✕ Salir del modo reunión"; x.addEventListener("click", () => ponerReunion(false)); document.body.appendChild(x); }
    if (!si && x) x.remove();
    if (actual) repintar();
  }

  // ---------- Tema ----------
  function setTema(t) {
    document.documentElement.setAttribute("data-tema", t);
    const m = $("#meta-theme-color"); if (m) m.content = t === "claro" ? "#f0f7fb" : "#0d1b2a";
  }
  setTema(document.documentElement.getAttribute("data-tema") || "claro");
  $("#btn-tema").addEventListener("click", () => {
    const t = document.documentElement.getAttribute("data-tema") === "oscuro" ? "claro" : "oscuro";
    setTema(t); escribir("acrishikawa-tema", t);
  });
  if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ev => { if (!leer("acrishikawa-tema")) setTema(ev.matches ? "oscuro" : "claro"); });

  // ---------- Modales ----------
  const KEY_BIENV = "acrishikawa-bienvenida-vista";
  const mb = $("#modal-bienvenida"), ma = $("#modal-acerca");
  const vistaB = leer(KEY_BIENV);
  if (!vistaB) mb.hidden = false;
  $("#btn-bienv-ok").addEventListener("click", () => { if ($("#modal-no-repetir").checked) escribir(KEY_BIENV, "1"); mb.hidden = true; });
  $("#btn-acerca").addEventListener("click", () => { ma.hidden = false; });
  $("#btn-acerca-cerrar").addEventListener("click", () => { ma.hidden = true; });
  ma.addEventListener("click", e => { if (e.target === ma) ma.hidden = true; });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { ma.hidden = true; $("#modal-confirmar").hidden = true; if (document.body.classList.contains("modo-reunion")) ponerReunion(false); } });

  // ---------- Versiones y novedades ----------
  const KEY_VERSION = "acrishikawa-version-vista";
  const listaCambios = n => `<div class="version-item"><div class="version-cab"><b>${esc(n.titulo)}</b><span class="version-tag">v${esc(n.version)} · ${esc(n.fecha)}</span></div><ul>${n.cambios.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>`;
  $("#historial-versiones").innerHTML = NOVEDADES.map(listaCambios).join("");
  $("#about-version").textContent = $("#footer-version").textContent = `Versión ${APP_VERSION}`;
  const mn = $("#modal-novedades");
  $("#btn-novedades-ok").addEventListener("click", () => { mn.hidden = true; escribir(KEY_VERSION, APP_VERSION); });
  (function gestionarNovedades() {
    const vistaV = leer(KEY_VERSION);
    if (vistaV === APP_VERSION) return;
    if (!vistaV && !vistaB) { escribir(KEY_VERSION, APP_VERSION); return; }
    const idx = NOVEDADES.findIndex(n => n.version === vistaV);
    const nuevas = idx > 0 ? NOVEDADES.slice(0, idx) : [NOVEDADES[0]];
    $("#novedades-sub").textContent = nuevas.length > 1 ? "Esto es lo nuevo desde tu última visita" : "Gracias por mantener la app al día";
    $("#novedades-body").innerHTML = nuevas.map(listaCambios).join("");
    if (mb.hidden) mn.hidden = false;
  })();

  // ---------- Service worker y aviso de nueva versión ----------
  let actualizando = false;
  function avisoActualizacion(reg) {
    if ($("#update-banner")) return;
    const b = document.createElement("div");
    b.id = "update-banner"; b.className = "update-banner no-print"; b.setAttribute("role", "status");
    b.innerHTML = "<span>Nueva versión disponible</span><button type=\"button\">Actualizar</button>";
    b.querySelector("button").addEventListener("click", () => { guardar(true); actualizando = true; if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" }); b.remove(); });
    document.body.appendChild(b);
  }
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").then(reg => {
      if (reg.waiting && navigator.serviceWorker.controller) avisoActualizacion(reg);
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener("statechange", () => { if (nw.state === "installed" && navigator.serviceWorker.controller) avisoActualizacion(reg); });
      });
    }).catch(() => {});
    let recargando = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (recargando || !actualizando) return; recargando = true; location.reload(); });
  }

  // ---------- Instalar como aplicación ----------
  let avisoInstalar = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); avisoInstalar = e; const b = $("#btn-instalar"); if (b) b.hidden = false; });
  $("#btn-instalar").addEventListener("click", async () => { if (!avisoInstalar) return; avisoInstalar.prompt(); try { await avisoInstalar.userChoice; } catch (e) { /* */ } avisoInstalar = null; $("#btn-instalar").hidden = true; });
  window.addEventListener("appinstalled", () => { const b = $("#btn-instalar"); if (b) b.hidden = true; });
  if (matchMedia("(display-mode: standalone)").matches || navigator.standalone) { const i = $("#instalar-bloque"); if (i) i.classList.add("instalada"); }

  window.ACR = { generarPDF, datos: () => datos };   // solo para pruebas desde la consola

  // ---------- Arranque ----------
  buildNav();
  window.addEventListener("hashchange", route);
  route();
})();
