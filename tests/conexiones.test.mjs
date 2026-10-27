// «Traer de…»: los lectores de ACR · Ishikawa con los paquetes REALES que generan las apps hermanas
// a partir de sus propios ejemplos (si sus carpetas están al lado en el Escritorio). node tests/conexiones.test.mjs
import { createRequire } from "module";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const L = require("../logic.js");

let ok = 0, mal = 0, saltadas = 0;
const prueba = (nombre, fn) => { try { fn(); ok++; } catch (e) { mal++; console.log("✗ " + nombre + "\n   " + e.message); } };
const igual = (a, b, m = "") => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m} esperaba ${JSON.stringify(b)} y es ${JSON.stringify(a)}`); };
const si = (v, m = "") => { if (!v) throw new Error(m || "esperaba verdadero"); };
let n = 0; const genId = () => "t" + (++n);
const BASE = fileURLToPath(new URL("../../../", import.meta.url));
const hermana = (carpeta, ...archivos) => { const r = BASE + carpeta + "/"; if (!archivos.every(a => existsSync(r + a))) { saltadas++; console.log("· (sin la carpeta " + carpeta + ": se salta)"); return null; } return archivos.map(a => require(r + a)); };
// Los paquetes nunca llevan ejemplos: para probar, se quita el «ej-» de los ids
const sinEj = o => JSON.parse(JSON.stringify(o).replace(/"(id|amfeId|falloId)":"ej-/g, '"$1":"x-'));

// ---------- AMFE ----------
const amfe = hermana("AMFE/Aplicación", "logic.js", "contenido.js");
if (amfe) {
  const [LA, CA] = amfe;
  const amfes = sinEj(CA.EJEMPLOS.amfes.map(a => LA.sanearAmfe(JSON.parse(JSON.stringify(a)), genId, "2026-10-27")).filter(Boolean));
  const paquete = LA.paqueteIntercambio(amfes, "x", "2026-10-27");
  prueba("AMFE: lee el paquete real (amfe-fallos v1), prioritarios primero", () => {
    const r = L.leerFallos(paquete); si(!r.error); si(r.lista.length >= 1);
    const urg = r.lista.find(a => a.fallos.length >= 49); si(urg, "el AMFE de Urgencias con sus 49 fallos");
    si(urg.fallos[0].prioritario); igual(urg.origen, "AMFE");
  });
  prueba("AMFE: con la copia .json trae también el Ishikawa del fallo (mismas siete categorías)", () => {
    const r = L.leerFallos({ app: "amfe", amfes, intercambio: paquete });
    const f = r.lista.flatMap(a => a.fallos).find(x => x.ishikawa.length); si(f, "algún fallo con Ishikawa");
    const a = L.nuevoAnalisis("a1", "x"); const t = L.traerFallo(a, r.lista.find(x => x.fallos.includes(f)), f, genId);
    si(t.causas >= 2); si(a.causas.every(x => L.PLANTILLAS.guia.cats.some(c => c.k === x.cat))); igual(a.problema, f.fallo); si(/AMFE/.test(a.origen));
  });
  prueba("AMFE: sin la copia, la causa del fallo va a una categoría y no se duplica al traer dos veces", () => {
    const r = L.leerFallos(paquete), am = r.lista.find(a => a.fallos.length >= 49), f = am.fallos.find(x => x.causa && x.acciones.length);
    const a = L.nuevoAnalisis("a2", "x"); L.traerFallo(a, am, f, genId); const n1 = a.causas.length, x1 = a.acciones.length;
    si(n1 >= 1); si(x1 >= 1); L.traerFallo(a, am, f, genId); igual([a.causas.length, a.acciones.length], [n1, x1]);
    si(a.dato.includes("IPR"));
  });
  prueba("AMFE: versión o formato desconocidos", () => { igual(L.leerFallos(Object.assign({}, paquete, { version: 2 })).error, "version"); igual(L.leerFallos({ nada: 1 }).error, "formato"); });
}

// ---------- Mapa de Riesgos (mismo formato de fallos dentro de cada mapa) ----------
prueba("Mapa de Riesgos: paquete mapariesgos-mapas y archivo de «Llevar a Auditorías»", () => {
  const am = { formato: "amfe-fallos", version: 1, amfes: [{ id: "m1", titulo: "Mapa Urgencias", unidad: "U", fallos: [{ id: "f1", num: 1, fallo: "Omisión de constantes", causa: "Sin termómetro", g: 7, o: 7, d: 7, ipr: 343, prioritario: true, acciones: [] }] }] };
  const p = { formato: "mapariesgos-mapas", version: 1, mapas: [{ id: "m1", titulo: "Mapa Urgencias", amfe: am.amfes[0] }] };
  const r = L.leerFallos(p); igual(r.lista[0].origen, "Mapa de Riesgos"); igual(r.lista[0].fallos[0].ipr, 343);
  igual(L.leerFallos({ app: "mapariesgos", intercambio: am }).lista[0].origen, "Mapa de Riesgos");
});

// ---------- Rondas de Seguridad ----------
const rondas = hermana("Auditorías/Rondas de Seguridad/Aplicación", "logic.js", "contenido.js");
if (rondas) {
  const [LR, CR] = rondas;
  const uds = sinEj(CR.EJEMPLOS.unidades.map(u => LR.sanearUnidad(JSON.parse(JSON.stringify(u)), genId, "2026-10-27")).filter(Boolean));
  prueba("Rondas: lee los puntos calientes del paquete real y crea el problema", () => {
    const r = L.leerRondas(LR.paqueteIntercambio(uds, "x", "2026-10-27")); si(!r.error); si(r.lista.length >= 1, "alguna unidad con puntos calientes");
    const u = r.lista[0], p = u.calientes[0], a = L.nuevoAnalisis("a3", "x"); L.traerCaliente(a, u, p);
    si(a.problema.includes(p.texto.replace(/[.;]$/, ""))); si(/Rondas/.test(a.origen)); si(L.lleno(a.dato));
    igual(L.tipoProblema(a.problema), "");
  });
  prueba("Rondas: formato y versión", () => { igual(L.leerRondas({ formato: "otro" }).error, "formato"); igual(L.leerRondas({ formato: "rondas-seguridad", version: 9, unidades: [] }).error, "version"); });
}

// ---------- Flujograma ----------
const flujo = hermana("Flujograma/Aplicación", "logic.js", "contenido.js");
if (flujo) {
  const [LF, CF] = flujo;
  const flujos = sinEj(CF.EJEMPLOS.flujos.map(f => LF.sanearFlujo(JSON.parse(JSON.stringify(f)), genId, "2026-10-27")).filter(Boolean));
  prueba("Flujograma: los pasos del proceso pasan a «lo que debería haber pasado», sin repetir", () => {
    const r = L.leerFlujos(LF.paqueteIntercambio(flujos, "x", "2026-10-27")); si(!r.error); si(r.lista.length >= 5);
    const f = r.lista[0], a = L.nuevoAnalisis("a4", "x", "acr"); const k = L.traerFlujo(a, f, genId);
    si(k >= 5); si(a.cronologia.every(h => L.lleno(h.debia) && !L.lleno(h.hecho))); igual(L.traerFlujo(a, f, genId), 0);
  });
}

// ---------- Indicadores ----------
prueba("Indicadores: nombre, numerador, denominador y estándar con su sentido", () => {
  const r = L.leerIndicadores({ indicadores: [{ id: "i1", nombre: "% triajes completos", numerador: "Completos", denominador: "Todos", estandar: "95", sentido: "mas" }, { id: "i2", nombre: "Caídas", estandar: "2", sentido: "menos" }, { id: "ej-x", nombre: "Ejemplo" }] });
  igual(r.lista.map(x => x.esperado), ["≥ 95 %", "≤ 2 %"]); igual(L.leerIndicadores({}).error, "formato");
});

// ---------- Lectura Crítica ----------
const lc = hermana("LecturaCritica/Aplicación", "logic.js", "contenido.js");
if (lc) {
  const [LL, CL] = lc;
  const lects = sinEj(CL.EJEMPLOS.lecturas.map(x => LL.sanearLectura(JSON.parse(JSON.stringify(x)), genId, "2026-10-27")).filter(Boolean));
  prueba("Lectura Crítica: el texto de evidencia de una lectura real", () => {
    const r = L.lecturasDe(LL.paqueteIntercambio(lects, "x", "2026-10-27")); si(!r.error); si(r.lista.length >= 3);
    const t = L.textoEvidenciaLC(r.lista[0]); si(/^Evidencia: /.test(t));
  });
}

console.log(`\n${ok} pruebas bien, ${mal} mal${saltadas ? `, ${saltadas} apps hermanas no encontradas` : ""}`);
if (mal) process.exit(1);
