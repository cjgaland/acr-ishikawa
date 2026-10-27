// Tests de la lógica pura de ACR · Ishikawa: node tests/logic.test.mjs
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const L = require("../logic.js"), C = require("../contenido.js"), D = require("../dibujo.js");
const X = require("../xlsx.js"), W = require("../docx.js");

let ok = 0, mal = 0;
const prueba = (nombre, fn) => { try { fn(); ok++; } catch (e) { mal++; console.log("✗ " + nombre + "\n   " + e.message); } };
const igual = (a, b, m = "") => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m} esperaba ${JSON.stringify(b)} y es ${JSON.stringify(a)}`); };
const si = (v, m = "") => { if (!v) throw new Error(m || "esperaba verdadero"); };
let n = 0; const genId = () => "id" + (++n);
const nuevo = (o = {}) => Object.assign(L.nuevoAnalisis(genId(), "2026-10-27T10:00:00Z"), o);
const conCausas = (lista, o = {}) => { const a = nuevo(o); lista.forEach(([cat, texto, x]) => a.causas.push(Object.assign(L.nuevaCausa(genId(), cat), { texto }, x || {}))); return a; };

// ---------- Plantillas ----------
prueba("las siete de la guía son las del capítulo 8", () => igual(L.PLANTILLAS.guia.cats.map(c => c.nom), ["Personal", "Procedimiento", "Organización", "Comunicación", "Equipamiento", "Entorno", "Paciente"]));
prueba("Vincent: los siete niveles con los nombres de la guía", () => igual(L.PLANTILLAS.vincent.cats.map(c => c.nom), ["Paciente", "Tarea", "Profesional", "Equipo", "Entorno de trabajo", "Organización y gestión", "Contexto institucional"]));
prueba("Londres 2024 tiene ocho niveles", () => igual(L.PLANTILLAS.londres.cats.length, 8));
prueba("SEIPS seis elementos y 6M seis", () => { igual(L.PLANTILLAS.seips.cats.length, 6); igual(L.PLANTILLAS.m6.cats.length, 6); });
prueba("cada categoría tiene una idea común conocida", () => Object.values(L.PLANTILLAS).forEach(p => p.cats.forEach(c => si(["persona", "paciente", "tarea", "equipo", "entorno", "tecnologia", "organizacion", "contexto", "material", "medicion"].includes(c.eq), c.k))));
prueba("equivalencias guía → Vincent", () => { igual(L.equivalencia("guia", "personal", "vincent"), "profesional"); igual(L.equivalencia("guia", "equipamiento", "vincent"), "entorno"); igual(L.equivalencia("vincent", "contexto", "londres"), "contexto"); });
prueba("equivalencias guía → Londres", () => {
  igual(L.equivalencia("guia", "personal", "londres"), "profesional");
  igual(L.equivalencia("guia", "procedimiento", "londres"), "tarea");
  igual(L.equivalencia("guia", "comunicacion", "londres"), "equipo");
  igual(L.equivalencia("guia", "equipamiento", "londres"), "tecnologia");
  igual(L.equivalencia("guia", "paciente", "londres"), "paciente");
});
prueba("equivalencias con alternativa (paciente → persona en SEIPS; equipo → organización)", () => {
  igual(L.equivalencia("guia", "paciente", "seips"), "persona");
  igual(L.equivalencia("guia", "comunicacion", "seips"), "organizacion");
  igual(L.equivalencia("londres", "contexto", "guia"), "organizacion");
  igual(L.equivalencia("guia", "paciente", "m6"), "manoObra");
});
prueba("cambiar de plantilla conserva las causas y las coloca", () => {
  const a = conCausas([["personal", "Eventuales sin formación"], ["entorno", "Ruido"], ["paciente", "Sin acompañante"]]);
  L.cambiarPlantilla(a, "londres");
  igual(a.plantilla, "londres"); igual(a.causas.map(x => x.cat), ["profesional", "entorno", "paciente"]);
  L.cambiarPlantilla(a, "guia"); igual(a.causas.map(x => x.cat), ["personal", "entorno", "paciente"]);
});
prueba("cambiar a propia con un reparto dado", () => {
  const a = conCausas([["personal", "A"], ["entorno", "B"]]);
  L.cambiarPlantilla(a, "propia", ["Gente", "Sitio"], [{ causaId: a.causas[0].id, a: "p0" }, { causaId: a.causas[1].id, a: "p1" }]);
  igual(L.categorias(a).map(c => c.nom), ["Gente", "Sitio"]); igual(a.causas.map(x => x.cat), ["p0", "p1"]);
});

// ---------- Causas ----------
prueba("la causa de fondo es el último «¿por qué?» contestado", () => {
  const x = Object.assign(L.nuevaCausa("c", "organizacion"), { texto: "Sala y boxes con la misma enfermera", porques: ["No asignada", "", "Los boxes ganan", "", ""] });
  igual(L.causaFondo(x), "Los boxes ganan");
  igual(L.causaFondo(Object.assign(L.nuevaCausa("d"), { texto: "Sola" })), "Sola");
});
prueba("ranking por votos y números de las elegidas", () => {
  const a = conCausas([["personal", "A", { votos: 2 }], ["entorno", "B", { votos: 5, elegida: true }], ["paciente", "C", { votos: 5 }], ["paciente", "D", { votos: 1, elegida: true }]]);
  igual(L.ranking(a).map(x => x.texto), ["B", "C", "A", "D"]);
  const N = L.numerosElegidas(a); igual([N[a.causas[1].id], N[a.causas[3].id]], [1, 2]);
});

// ---------- El problema ----------
prueba("problema como solución, falta u opinión", () => {
  igual(L.tipoProblema("Hay que contratar a una enfermera"), "solucion");
  igual(L.tipoProblema("Falta personal en la sala de espera"), "falta");
  igual(L.tipoProblema("La sala de espera es un caos"), "opinion");
  igual(L.tipoProblema("En 7 de los 25 episodios revisados no consta la reevaluación"), "");
});
prueba("avisos del problema: pide el dato si no hay número", () => {
  si(L.avisosProblema(nuevo({ problema: "No se reevalúa a los pacientes en la sala de espera" })).some(x => /dato/.test(x.texto)));
  si(!L.avisosProblema(nuevo({ problema: "En 7 de los 25 episodios revisados no consta la reevaluación" })).length);
});

// ---------- Avisos de la espina ----------
prueba("«falta de formación» sin porqués no es el final", () => {
  si(L.esGenerica("Falta de formación")); si(L.esGenerica("personal insuficiente")); si(!L.esGenerica("Eventuales sin formación en la sala"));
  const a = conCausas([["personal", "Falta de formación"]]);
  si(L.avisosEspina(a).some(x => /no es el final/.test(x.texto)));
  a.causas[0].porques[0] = "No hay plan de acogida"; si(!L.avisosEspina(a).some(x => /no es el final/.test(x.texto)));
});
prueba("error humano y saltarse el protocolo piden un porqué", () => {
  const a = conCausas([["personal", "Despiste de la enfermera"], ["procedimiento", "No siguió el protocolo de sepsis"]]);
  const A = L.avisosEspina(a); si(A.some(x => /regla 3/.test(x.texto))); si(A.some(x => /regla 4/.test(x.texto)));
});
prueba("palabras que culpan", () => igual(L.palabrasNoNeutras("Enfermera negligente y despistada"), ["negligen", "despistad"]));
prueba("elegir: avisa si no se comprueba y si hay demasiadas", () => {
  const a = conCausas([["personal", "A", { elegida: true }]]);
  si(L.avisosElegir(a).some(x => /probable no es una causa demostrada/.test(x.texto)));
  const b = conCausas("ABCDEF".split("").map(t => ["entorno", t, { elegida: true, prueba: "comprobada" }]));
  si(L.avisosElegir(b).some(x => /Has elegido 6/.test(x.texto)));
});

// ---------- Acciones ----------
prueba("jerarquía: 6 fuertes, 9 intermedias, 4 débiles (RCA², figura 3)", () => {
  const J = Object.values(L.JERARQUIA); igual([J.filter(j => j.f === "fuerte").length, J.filter(j => j.f === "intermedia").length, J.filter(j => j.f === "debil").length], [6, 9, 4]);
});
prueba("fuerza sugerida por el texto", () => {
  igual(L.categoriaSugerida("El triaje no se puede cerrar sin las cuatro constantes"), "forzada");
  igual(L.fuerzaAccion({ que: "Sesión de formación sobre reevaluación", categoria: "" }), "debil");
  igual(L.fuerzaAccion({ que: "Aviso en pantalla a los 90 minutos", categoria: "" }), "intermedia");
  igual(L.fuerzaAccion({ que: "Lo que sea", categoria: "simplificar" }), "fuerte");
});
prueba("avisos de acciones: todas débiles, responsable grupal, indicador que cuenta notificaciones", () => {
  const a = conCausas([["personal", "A", { elegida: true }]]);
  a.acciones.push(Object.assign(L.nuevaAccion("x1"), { que: "Sesión de formación", responsable: "El equipo", plazo: "2027-01-01", indicador: Object.assign(L.nuevoIndicador(), { nombre: "Número de incidentes notificados" }) }));
  const A = L.avisosAcciones(a).map(x => x.texto).join(" | ");
  si(/al menos una fuerte o intermedia/.test(A)); si(/no un grupo/.test(A)); si(/contar incidentes notificados/.test(A)); si(/Ninguna acción ataca/.test(A));
  si(L.responsableGrupo("la comisión")); si(!L.responsableGrupo("Supervisión de enfermería de Urgencias"));
});

// ---------- SAC ----------
prueba("matriz SAC del SiNASP (hospital)", () => {
  igual(L.sac("hospital", 1, 4), "extremo"); igual(L.sac("hospital", 1, 5), "alto");
  igual(L.sac("hospital", 2, 3), "alto"); igual(L.sac("hospital", 4, 4), "moderado");
  igual(L.sac("hospital", 7, 1), "moderado"); igual(L.sac("hospital", 7, 2), "bajo"); igual(L.sac("hospital", 8, 1), "");
});
prueba("matriz SAC del SiNASP (atención primaria)", () => {
  igual(L.sac("primaria", 2, 3), "alto"); igual(L.sac("primaria", 3, 1), "alto"); igual(L.sac("primaria", 4, 4), "bajo"); igual(L.sac("primaria", 6, 1), "");
  igual(L.MATRIZ_SAC.hospital.length, L.GRAVEDADES.hospital.length); igual(L.MATRIZ_SAC.primaria.length, L.GRAVEDADES.primaria.length);
});

// ---------- Privacidad ----------
prueba("detecta datos que identifican", () => {
  ["NHC 1234567", "La Sra. García esperó", "DNI 12345678Z", "nacida el 3/4/1944", "llamar al 612 345 678"].forEach(t => si(L.pareceDatoPaciente(t), t));
  ["Paciente de 82 años sin acompañante", "En 7 de 25 episodios", "Enfermera de triaje"].forEach(t => si(!L.pareceDatoPaciente(t), t));
});

// ---------- Ejemplo de la sala de espera (capítulo 8) ----------
const ej = L.sanearAnalisis(JSON.parse(JSON.stringify(C.EJEMPLOS.analisis[0])), genId, "x");
prueba("el ejemplo reproduce la figura del capítulo 8: 13 causas en 7 categorías", () => {
  igual(L.causasCon(ej).length, 13);
  igual(L.PLANTILLAS.guia.cats.map(c => L.causasDe(ej, c.k).length), [2, 2, 2, 2, 1, 2, 2]);
  igual(ej.problema, "En 7 de los 25 episodios revisados de pacientes con esperas superiores a 90 minutos no consta la reevaluación.");
});
prueba("el ejemplo: causa de fondo de la organización y acción del capítulo", () => {
  const x = ej.causas.find(c => c.texto === "Sala y boxes con la misma enfermera");
  igual(L.causaFondo(x), "De noche, la misma enfermera cubre la sala y los boxes, y los boxes siempre ganan"); igual(x.prueba, "comprobada");
  igual(L.ranking(ej)[0].id, x.id);
  igual(L.fuerzaAccion(ej.acciones[0]), "intermedia");
  igual(ej.acciones[0].indicador.esperado, "≥ 90 %");
});
prueba("el ejemplo tiene todos sus pasos hechos y sin avisos de privacidad", () => { igual(L.progreso(ej), { 1: true, 2: true, 3: true, 4: true }); si(!L.hayDatoPersonal(ej)); });

// ---------- Pasos ----------
prueba("pasos: 4 en el Ishikawa y 8 en el ACR", () => { igual(L.pasosDe(nuevo()).length, 4); igual(L.pasosDe(nuevo({ tipo: "acr" })).length, 8); });
prueba("siguiente paso de un análisis nuevo: el problema", () => { const d = { analisis: [nuevo({ problema: "" })] }; si(/Paso 1/.test(L.siguientePaso(d, 1).btn)); });

// ---------- Intercambio ----------
prueba("paquete de intercambio acrishikawa-analisis v1", () => {
  const p = L.paqueteIntercambio([ej], "2026.01", "2026-10-27T10:00:00Z");
  igual([p.formato, p.version, p.app], ["acrishikawa-analisis", 1, "acrishikawa"]);
  const x = p.analisis[0]; igual(x.causas.length, 13); igual(x.categorias.length, 7);
  igual(x.acciones[0].fuerza, "intermedia"); igual(x.acciones[0].causas.length, 3); si(x.acciones[0].indicador.nombre);
  igual(L.leerIntercambio(p).analisis.length, 1);
  igual(L.leerIntercambio({ intercambio: p }).analisis.length, 1);
  igual(L.leerIntercambio({ formato: "otro" }).error, "formato");
  igual(L.leerIntercambio(Object.assign({}, p, { version: 2 })).error, "version");
});

// ---------- Saneado y fusión ----------
prueba("saneado: categorías inválidas a la primera, referencias rotas fuera, longitudes", () => {
  const s = L.sanearAnalisis({ id: "a1", plantilla: "guia", causas: [{ id: "c1", cat: "inventada", texto: "x".repeat(900), porques: ["a", 3, null] }], acciones: [{ id: "x1", causas: ["c1", "noexiste"], categoria: "magia" }] }, genId, "f");
  igual(s.causas[0].cat, "personal"); igual(s.causas[0].texto.length, 500); igual(s.causas[0].porques, ["a", "", "", "", ""]);
  igual(s.acciones[0].causas, ["c1"]); igual(s.acciones[0].categoria, "");
  igual(L.sanearDatos({ nada: 1 }, genId, "f"), null);
});
prueba("fusión: se queda el más reciente", () => {
  const A = { analisis: [{ id: "a", modificado: "2026-01-01", titulo: "viejo" }] }, B = { analisis: [{ id: "a", modificado: "2026-02-01", titulo: "nuevo" }, { id: "b", modificado: "x" }] };
  igual(L.fusionar(A, B).analisis.map(x => x.titulo || x.id), ["nuevo", "b"]);
});

// ---------- Documentos ----------
prueba("ficha: bloques con la espina, las causas y las acciones", () => {
  const d = L.documentoFicha(ej, "27/10/2026", null);
  si(d.bloques.some(b => b.t === "espina")); si(d.bloques.filter(b => b.t === "tabla").length >= 3);
  const d2 = L.documentoFicha(ej, "27/10/2026", { png: new Uint8Array([1, 2, 3]), w: 100, h: 50 }); si(d2.bloques.some(b => b.t === "imagen"));
});
prueba("Word real con la imagen de la espina", () => {
  const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const bytes = W.construirDocx(Object.assign({ pie: "x", horizontal: true }, L.documentoFicha(ej, "27/10/2026", { png, w: 1200, h: 400 })));
  si(bytes.length > 3000); igual([bytes[0], bytes[1]], [0x50, 0x4b]);
});
prueba("Excel real de tres hojas", () => {
  const h = L.hojasExcel(ej, "27/10/2026"); igual(h.hojas.map(x => x.nombre), ["Análisis", "Causas", "Acciones"]);
  igual(h.hojas[1].filas.length, 3 + 13);
  const bytes = X.construirLibroXlsx(h); si(bytes.length > 3000); igual([bytes[0], bytes[1]], [0x50, 0x4b]);
});

// ---------- Dibujo ----------
const solapes = g => { const B = D.cajas(g), r = []; for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) { const a = B[i], b = B[j]; if (a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5) r.push([a.que, b.que]); } return r; };
prueba("la espina del ejemplo no tiene textos solapados (con y sin porqués)", () => {
  [true, false].forEach(pq => { const g = D.colocar(L.datosDibujo(ej, { porques: pq }), { titulo: "t", pie: "p" }); igual(solapes(g), [], "porques " + pq); si(g.W > 600 && g.H > 300); });
});
prueba("la espina no solapa con muchas causas largas y ocho categorías", () => {
  const a = nuevo({ plantilla: "londres", problema: "Un problema con un texto bastante largo para ver cómo se parte en varias líneas dentro de la cabeza del pez" });
  L.categorias(a).forEach((c, i) => { for (let k = 0; k < (i % 4) + 2; k++) a.causas.push(Object.assign(L.nuevaCausa(genId(), c.k), { texto: "Causa con un texto largo número " + k + " de la categoría " + c.nom + " que obliga a partir", porques: k % 2 ? ["Porque sí, y además un porqué largo que también se parte", "Y otro"] : ["", "", "", "", ""], elegida: k === 0 })); });
  const g = D.colocar(L.datosDibujo(a, { porques: true }), {}); igual(solapes(g), []);
  const s = D.svg(g); si(/^<svg[^>]+width="\d+" height="\d+"/.test(s)); si(!/undefined|NaN/.test(s));
});
prueba("espina vacía y plantilla en blanco", () => {
  const s = D.svg(D.colocar(L.datosDibujo(nuevo(), {}))); si(s.includes("Problema sin escribir"));
  const b = D.plantillaVacia(["Personal", "Entorno"], "", ""); si(b.includes("PERSONAL") && !/NaN/.test(b));
});
prueba("el texto del SVG va escapado", () => { const a = conCausas([["personal", "<script>&"]]); si(D.svg(D.colocar(L.datosDibujo(a))).includes("&lt;script&gt;&amp;")); });
prueba("lineas: no pasa del ancho y corta palabras muy largas", () => {
  const l = D.lineas("palabra ".repeat(20) + "x".repeat(80), 13, 200); si(l.every(s => s.length <= Math.floor(200 / (13 * 0.56))));
});


// ---------- ACR: decidir, plazos, equipo, cronología, espinas ----------
prueba("plazos del RCA²: 72 h y 30–45 días desde la decisión", () => {
  const a = nuevo({ tipo: "acr" }); a.incidente.fecha = "2027-01-12"; a.incidente.fechaDecision = "2027-01-13";
  const P = L.plazos(a, "2027-01-14"); igual([P.empezar, P.fin30, P.fin45, P.tarde], ["2027-01-16", "2027-02-12", "2027-02-27", false]);
  a.reuniones.push(Object.assign(L.nuevaReunion("r"), { fecha: "2027-01-20" })); si(L.plazos(a, "2027-01-14").tarde);
  igual(L.plazos(nuevo(), "x"), null); igual(L.masDias("2027-01-31", 1), "2027-02-01");
});
prueba("avisos al decidir: riesgo bajo, conducta culpable, fechas", () => {
  const a = nuevo({ tipo: "acr" }); Object.assign(a.incidente, { clase: "sindano", fecha: "2027-01-12", fechaDecision: "2027-01-10", gravedad: "7", frecuencia: "5", conducta: "si" });
  const T = L.avisosDecidir(a, "2027-01-12").map(x => x.texto).join(" | ");
  si(/no con un ACR completo/.test(T)); si(/no es para un ACR/.test(T)); si(/anterior a la del incidente/.test(T));
  igual(L.nivelSAC(nuevo({ ambito: "otro" })), "");
});
prueba("avisos del equipo: tamaño, implicados y papeles", () => {
  const a = nuevo({ tipo: "acr" }); a.equipo.push(Object.assign(L.nuevoMiembro("m1"), { perfil: "Enfermera de triaje", implicado: true }));
  const T = L.avisosEquipo(a).map(x => x.texto).join(" | ");
  si(/recomienda de 4 a 6/.test(T)); si(/estuvo implicado/.test(T)); si(/coordina/.test(T)); si(/representante de los pacientes/.test(T));
  for (let i = 0; i < 7; i++) a.equipo.push(Object.assign(L.nuevoMiembro("x" + i), { perfil: "P" + i }));
  si(L.avisosEquipo(a).some(x => /Con más de 6/.test(x.texto)));
});
prueba("cronología: desajustes sin problema, fuente y lo que salió bien", () => {
  const a = nuevo({ tipo: "acr" }); ["a", "b", "c"].forEach(t => a.cronologia.push(Object.assign(L.nuevoHecho("h" + t), { hecho: t, desajuste: t === "b" })));
  const T = L.avisosCronologia(a).map(x => x.texto).join(" | ");
  si(/sin convertir/.test(T)); si(/Indica la fuente/.test(T)); si(/salió bien/.test(T));
});
prueba("espinas por problema en la atención y causas por espina", () => {
  const a = nuevo({ tipo: "acr", problema: "P" }); a.problemasAtencion.push(Object.assign(L.nuevoProblemaAt("pa1"), { texto: "Problema 1" }));
  a.causas.push(Object.assign(L.nuevaCausa("c1", "personal", "pa1"), { texto: "en la secundaria" }), Object.assign(L.nuevaCausa("c2", "personal", ""), { texto: "en la principal" }));
  igual(L.espinasDe(a).map(e => e.id), ["", "pa1"]);
  igual(L.causasDe(a, "personal", "").map(x => x.texto), ["en la principal"]); igual(L.causasDe(a, "personal", "pa1").length, 1); igual(L.causasDe(a, "personal").length, 2);
  igual(L.datosDibujo(a, { espina: "pa1" }).problema, "Problema 1"); igual(L.datosDibujo(a, {}).categorias[0].causas.length, 1);
  const s = L.sanearAnalisis(JSON.parse(JSON.stringify(a)), genId, "f"); igual(s.causas[0].espina, "pa1");
  s.problemasAtencion = []; igual(L.sanearAnalisis(s, genId, "f").causas[0].espina, "");
});
prueba("preguntas desencadenantes: responder y categoría por idea común", () => {
  const a = nuevo(); L.responder(a, "q-equ2", "no"); igual(L.respuesta(a, "q-equ2"), "no"); L.responder(a, "q-equ2", ""); igual(a.preguntas.length, 0);
  igual(L.categoriaPorEq(a, "tecnologia"), "equipamiento"); igual(L.categoriaPorEq(a, "contexto"), "organizacion");
  igual(L.categoriaPorEq(nuevo({ plantilla: "m6" }), "paciente"), "manoObra");
  C.PREGUNTAS.forEach(q => si(L.categoriaPorEq(a, q.eq), q.id));
});
const ejAcr = L.sanearAnalisis(JSON.parse(JSON.stringify(C.EJEMPLOS.analisis[1])), genId, "x");
prueba("el ejemplo del ACR de la sepsis: SAC 1, equipo en 72 h, cronología coherente con «tres horas»", () => {
  igual(L.nivelSAC(ejAcr), "extremo"); igual(ejAcr.equipo.length, 5); si(ejAcr.equipo.every(m => !m.implicado));
  const P = L.plazos(ejAcr, "2027-01-14"); igual(P.tarde, false); igual(P.primera, "2027-01-15");
  igual(ejAcr.cronologia.length, 10); igual(ejAcr.cronologia.filter(h => h.desajuste).length, 3); igual(ejAcr.cronologia.filter(h => h.bien).length, 2);
  igual(ejAcr.problemasAtencion.length, 2); igual(L.espinasDe(ejAcr).length, 3);
  igual(L.causasDe(ejAcr, "organizacion", "ej-p2").length, 1); igual(L.elegidas(ejAcr).length, 3);
  igual(L.progreso(ejAcr)[1], true); igual(L.progreso(ejAcr)[3], true); igual(L.progreso(ejAcr)[4], true); igual(L.progreso(ejAcr)[5], true);
  si(!L.hayDatoPersonal(ejAcr)); si(!L.avisosDecidir(ejAcr, "2027-01-14").some(x => x.nivel === "warn"));
  const p = L.paqueteIntercambio([ejAcr], "2026.02", "x").analisis[0]; igual(p.sac, 1); igual(p.problemasAtencion.length, 2); si(p.causas.some(c => c.espina));
  [ "", "ej-p1", "ej-p2" ].forEach(e => igual(solapes(D.colocar(L.datosDibujo(ejAcr, { porques: true, espina: e }), {})), [], "espina " + e));
});


// ---------- ACR: afirmaciones, medidas, cierre e informe ----------
prueba("cinco reglas: la afirmación del capítulo cumple; las malas, no", () => {
  igual(L.avisosAfirmacion({ texto: "Como la reevaluación de la sala de espera no estaba asignada a ningún puesto en el turno de noche, el deterioro de la paciente no se detectó durante tres horas.", deber: "Protocolo, ap. 3" }), []);
  const r = f => L.avisosAfirmacion({ texto: f, deber: "" }).map(x => x.regla);
  si(r("La enfermera fue descuidada y no reevaluó a la paciente.").includes(2)); si(r("La enfermera fue descuidada y no reevaluó a la paciente.").includes(5));
  si(r("El manual está mal escrito.").includes(2)); si(r("Un residente cansado.").includes(1));
  si(r("La enfermera se olvidó de reevaluar, lo que llevó a que la paciente empeorara sin que nadie lo viera durante tres horas.").includes(3));
  si(r("La enfermera no siguió el protocolo de sala de espera, lo que llevó a que la paciente no fuera reevaluada en tres horas.").includes(4));
  igual(L.avisosAfirmacion({ texto: "", deber: "" }), []);
});
prueba("afirmación sugerida desde la causa de fondo", () => {
  const t = L.afirmacionSugerida(ejAcr, ejAcr.causas.find(x => x.id === "ej-s05"));
  si(/^Como de noche, la misma enfermera cubre la sala/.test(t)); si(/la paciente no fue reevaluada/.test(t)); si(/aumentó la probabilidad/.test(t));
});
prueba("avisos de afirmaciones: causas sin afirmación y pruebas", () => {
  const a = conCausas([["personal", "A", { elegida: true }]]); si(L.avisosAfirmaciones(a).some(x => /Falta la afirmación/.test(x.texto)));
  a.afirmaciones.push(Object.assign(L.nuevaAfirmacion("f"), { causaId: a.causas[0].id, texto: "Como A no estaba definida, pasó B, lo que aumentó la probabilidad de C." }));
  const T = L.avisosAfirmaciones(a).map(x => x.texto).join("|"); si(!/Falta la afirmación/.test(T)); si(/pruebas o datos/.test(T));
});
prueba("cierre: avisos y conclusiones propuestas", () => {
  const a = nuevo({ tipo: "acr" }); const T = L.avisosCerrar(a, "2027-01-01").map(x => x.texto).join("|"); si(/paciente o a la familia/.test(T)); si(/conclusiones/.test(T));
  igual(L.avisosCerrar(ejAcr, "2027-02-10").filter(x => x.nivel === "warn"), []);
  const c = L.conclusionesSugeridas(ejAcr); si(/3 factores del sistema/.test(c)); si(/1 fuerte, 2 intermedias/.test(c));
});
prueba("el ejemplo del ACR, completo: progreso 8/8, acciones y paquete", () => {
  igual(Object.values(L.progreso(ejAcr)).every(Boolean), true);
  igual(ejAcr.acciones.map(L.fuerzaAccion), ["fuerte", "intermedia", "intermedia"]);
  si(ejAcr.afirmaciones.every(L.cumpleReglas));
  const p = L.paqueteIntercambio([ejAcr], "2026.03", "x").analisis[0]; igual(p.cerrado, true); igual(p.afirmaciones.length, 3); igual(p.acciones[0].fuerza, "fuerte");
  const s = L.sanearAnalisis(JSON.parse(JSON.stringify(ejAcr)), genId, "f"); igual(s.verificacion.length, 12); igual(s.acciones[0].controla, "servicio"); igual(s.acciones[1].indicador.tipo, "funciona");
});
prueba("informe del ACR: bloques, tres espinas y Word con imágenes", () => {
  const d = L.documentoInforme(ejAcr, "27/10/2026", null);
  igual(d.bloques.filter(b => b.t === "espina").length, 3); igual(d.bloques.filter(b => b.t === "h1" && /^\d\. /.test(b.texto)).length, 9); si(d.bloques.some(b => b.t === "lista"));
  const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), im = { png, w: 1200, h: 400 };
  const d2 = L.documentoInforme(ejAcr, "27/10/2026", { "": im, "ej-p1": im, "ej-p2": im }); igual(d2.bloques.filter(b => b.t === "imagen").length, 3);
  const bytes = W.construirDocx(Object.assign({ pie: "x", horizontal: true }, d2)); si(bytes.length > 5000); igual([bytes[0], bytes[1]], [0x50, 0x4b]);
  si(X.construirLibroXlsx(L.hojasExcel(ejAcr, "x")).length > 3000);
});

// ---------- Contenido ----------
prueba("test: cinco preguntas del capítulo 8 con respuesta válida", () => { igual(C.TEST.length, 5); C.TEST.forEach(q => si(q.ok >= 0 && q.ok < q.o.length && C.TEMAS_TEST[q.t])); });
prueba("glosario sin duplicados", () => { const k = C.GLOSARIO.map(g => g[0]); igual(new Set(k).size, k.length); });

console.log(`\n${ok} pruebas bien, ${mal} mal`);
if (mal) process.exit(1);
