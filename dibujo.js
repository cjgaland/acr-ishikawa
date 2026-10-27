// ============================================================
//  dibujo.js — La espina de pescado (diagrama de Ishikawa) · ACR · Ishikawa
//  Funciones PURAS: colocar(datos) calcula la geometría (sin solapes de texto)
//  y svg(colocacion) la convierte en un SVG autónomo (colores fijos, fondo
//  blanco), el mismo para la pantalla, el PNG, el Word y el PDF.
//  Entrada (L.datosDibujo): { problema, titulo, categorias: [{ nom, causas:
//  [{ texto, porques: [], elegida, n, prueba }] }] }
//  window.Dibujo en navegador y module.exports en Node (tests).
// ============================================================
(function (raiz) {
  "use strict";

  const COLOR = { acento: "#b4442b", acentoOsc: "#8f3322", tinta: "#0d1b2a", gris: "#475569", grisClaro: "#94a3b8", linea: "#334155", fondoCab: "#fbf0ed", verde: "#15803d", papel: "#ffffff" };
  const FUENTE = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  // Medidas (px del SVG)
  const T = { cat: 15, causa: 13, pq: 11.5, cab: 16, titulo: 18, pie: 10.5 };
  const LH = { causa: 16, pq: 14, cab: 21 };
  const ANCHO_CAUSA = 270;     // ancho máximo del texto de una causa
  const PENDIENTE = 0.42;      // inclinación de las espinas (x por cada y)
  const HUECO = 34;            // entre columnas
  const MARGEN = 24;

  // Ancho aproximado de un texto (sin DOM; un poco por exceso para no solapar)
  const anchoTexto = (s, tam, negrita) => String(s).length * tam * (negrita ? 0.6 : 0.56);
  // Parte un texto en líneas que no pasen de «ancho» px (las palabras muy largas se cortan)
  function lineas(s, tam, ancho, negrita) {
    const max = Math.max(4, Math.floor(ancho / (tam * (negrita ? 0.6 : 0.56)))), r = [];
    String(s || "").trim().split(/\s+/).filter(Boolean).forEach(p => {
      while (p.length > max) { r.push(p.slice(0, max - 1) + "-"); p = p.slice(max - 1); }
      const u = r.length ? r[r.length - 1] : null;
      if (u !== null && (u + " " + p).length <= max && !u.endsWith("-")) r[r.length - 1] = u + " " + p; else r.push(p);
    });
    return r.length ? r : [""];
  }
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Un bloque de causa: líneas de la causa y, debajo, sus «¿por qué?»
  function bloqueCausa(c) {
    const L1 = lineas(c.texto, T.causa, ANCHO_CAUSA, c.elegida);
    const P = (c.porques || []).map(p => lineas("← " + p, T.pq, ANCHO_CAUSA - 14, false));
    const ancho = Math.max(...L1.map(l => anchoTexto(l, T.causa, c.elegida)), ...P.flat().map(l => anchoTexto(l, T.pq) + 14), 30) + (c.n ? 26 : 0);
    const alto = L1.length * LH.causa + P.reduce((s, l) => s + l.length * LH.pq, 0) + 10;
    return { c, L1, P, ancho, alto };
  }

  // Geometría completa
  function colocar(d, o = {}) {
    const cats = d.categorias || [], nArriba = Math.ceil(cats.length / 2);
    const arriba = cats.slice(0, nArriba), abajo = cats.slice(nArriba);
    const B = cats.map(cat => ({ cat, bloques: cat.causas.map(bloqueCausa) }));
    const altoLado = lista => Math.max(110, ...lista.map(b => b.bloques.reduce((s, x) => s + x.alto, 0) + 46));
    const hA = altoLado(B.slice(0, nArriba)), hB = abajo.length ? altoLado(B.slice(nArriba)) : 70;
    const yTitulo = o.titulo || d.titulo ? MARGEN + T.titulo : 0;
    const Y = yTitulo + MARGEN + 30 + hA;                    // espina central
    // Ancho de cada columna (la causa más ancha de arriba o de abajo, o la etiqueta)
    const anchoCol = j => Math.max(120, ...[B[j], B[j + nArriba]].filter(Boolean).flatMap(b => [anchoTexto(b.cat.nom, T.cat, true) + 24, ...b.bloques.map(x => x.ancho + 12 + x.alto * PENDIENTE)]));
    const cols = Array.from({ length: nArriba }, (_, j) => anchoCol(j));
    const desp = Math.max(hA, hB) * PENDIENTE;              // lo que se desplaza a la izquierda la punta de una espina
    // Punto de cada espina sobre la central: el texto de una columna nunca invade la anterior
    let x = MARGEN + desp;
    const xs = cols.map(w => { x += w; const r = x; x += HUECO; return r; });
    const xFin = (xs.length ? xs[xs.length - 1] : MARGEN + 200) + 30;
    // Cabeza (el problema)
    const cabL = lineas(d.problema || "Problema sin escribir", T.cab, 230, true), cabW = Math.max(150, Math.min(260, Math.max(...cabL.map(l => anchoTexto(l, T.cab, true))) + 30));
    const cabH = Math.max(84, cabL.length * LH.cab + 26);
    const cab = { x: xFin + 16, y: Y - cabH / 2, w: cabW, h: cabH, lineas: cabL };
    const W = Math.ceil(cab.x + cab.w + MARGEN);
    const H = Math.ceil(Math.max(Y + hB + 30, cab.y + cab.h + 20) + (o.pie ? 26 : 0));
    // Espinas, etiquetas y causas
    const espinas = [], textos = [];
    B.forEach((b, i) => {
      const up = i < nArriba, j = up ? i : i - nArriba, h = up ? hA : hB, dy = up ? -1 : 1;
      const x0 = xs[j], y1 = Y + dy * (h - 26), x1 = x0 - (h - 26) * PENDIENTE;
      const et = { x: x1, y: y1 + dy * 4, w: anchoTexto(b.cat.nom, T.cat, true) + 20, h: 26, texto: b.cat.nom };
      et.x0 = et.x - et.w / 2; et.y0 = up ? et.y - et.h : et.y;
      espinas.push({ x0, y0: Y, x1, y1, etiqueta: et });
      // Causas desde la espina central hacia fuera (la primera, cerca del centro)
      let yy = Y + dy * 18;
      b.bloques.forEach(bl => {
        const yLinea = up ? yy - 6 : yy + bl.alto - 6;     // la raya horizontal bajo el texto de la causa
        const xAncla = x0 - Math.abs(yLinea - Y) * PENDIENTE;
        const yTexto0 = up ? yy - bl.alto + 4 : yy + 4;     // borde superior del bloque
        // Arriba, la espina se va a la izquierda según sube: el texto se alinea con su punto más alto
        const xTexto = up ? x0 - Math.abs(yTexto0 - Y) * PENDIENTE - 8 : xAncla - 8;
        textos.push({ bl, xAncla, xTexto, yLinea, x0: xTexto - bl.ancho, y0: yTexto0, w: bl.ancho, h: bl.alto - 8 });
        yy += dy * bl.alto;
      });
    });
    return { W, H, Y, xIni: MARGEN, xFin, cab, espinas, textos, titulo: o.titulo || d.titulo || "", pie: o.pie || "" };
  }

  // Cajas de texto (para comprobar en los tests que no se solapan)
  function cajas(g) {
    return [...g.textos.map(t => ({ x: t.x0, y: t.y0, w: t.w, h: t.h, que: "causa" })), ...g.espinas.map(e => ({ x: e.etiqueta.x0, y: e.etiqueta.y0, w: e.etiqueta.w, h: e.etiqueta.h, que: "categoria" })), { x: g.cab.x, y: g.cab.y, w: g.cab.w, h: g.cab.h, que: "cabeza" }];
  }

  function svg(g, o = {}) {
    const P = [];
    const tx = (x, y, s, tam, o2 = {}) => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${tam}"${o2.peso ? ` font-weight="${o2.peso}"` : ""} fill="${o2.color || COLOR.tinta}"${o2.ancla ? ` text-anchor="${o2.ancla}"` : ""}${o2.cursiva ? ' font-style="italic"' : ""}${o2.tachado ? ' text-decoration="line-through"' : ""}>${esc(s)}</text>`;
    P.push(`<rect width="${g.W}" height="${g.H}" fill="${COLOR.papel}"/>`);
    if (g.titulo) P.push(tx(MARGEN, MARGEN + T.titulo - 2, g.titulo, T.titulo, { peso: 800 }));
    // Espina central con punta de flecha
    P.push(`<line x1="${g.xIni}" y1="${g.Y}" x2="${g.cab.x - 4}" y2="${g.Y}" stroke="${COLOR.tinta}" stroke-width="4" stroke-linecap="round"/>`);
    P.push(`<path d="M${g.cab.x - 18} ${g.Y - 9} L${g.cab.x - 3} ${g.Y} L${g.cab.x - 18} ${g.Y + 9}" fill="none" stroke="${COLOR.tinta}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`);
    // Espinas y etiquetas de categoría
    g.espinas.forEach(e => {
      P.push(`<line x1="${e.x0.toFixed(1)}" y1="${e.y0}" x2="${e.x1.toFixed(1)}" y2="${e.y1.toFixed(1)}" stroke="${COLOR.linea}" stroke-width="2.5" stroke-linecap="round"/>`);
      const t = e.etiqueta;
      P.push(`<rect x="${t.x0.toFixed(1)}" y="${t.y0.toFixed(1)}" width="${t.w.toFixed(1)}" height="${t.h}" rx="13" fill="${COLOR.acento}"/>`);
      P.push(tx(t.x, t.y0 + 18, t.texto.toUpperCase(), T.cat - 2, { peso: 800, color: "#fff", ancla: "middle" }));
    });
    // Causas
    g.textos.forEach(t => {
      const c = t.bl.c, el = c.elegida, desc = c.prueba === "descartada";
      const color = desc ? COLOR.grisClaro : el ? COLOR.acentoOsc : COLOR.tinta;
      P.push(`<line x1="${(t.xTexto - t.bl.ancho).toFixed(1)}" y1="${t.yLinea.toFixed(1)}" x2="${t.xAncla.toFixed(1)}" y2="${t.yLinea.toFixed(1)}" stroke="${el ? COLOR.acento : COLOR.grisClaro}" stroke-width="${el ? 2.5 : 1.3}"/>`);
      let y = t.yLinea - 4 - (t.bl.L1.length - 1) * LH.causa - t.bl.P.reduce((s, l) => s + l.length * LH.pq, 0);
      const xd = t.xTexto;
      t.bl.L1.forEach((l, i) => {
        P.push(tx(xd - (c.n ? 24 : 0), y, l, T.causa, { peso: el ? 700 : 400, color, ancla: "end", tachado: desc }));
        if (i === 0 && c.n) {
          P.push(`<circle cx="${(xd - 9).toFixed(1)}" cy="${(y - 4.5).toFixed(1)}" r="9" fill="${COLOR.acento}"/>`);
          P.push(tx(xd - 9, y, String(c.n), 11, { peso: 800, color: "#fff", ancla: "middle" }));
        }
        y += LH.causa;
      });
      t.bl.P.forEach(pl => pl.forEach(l => { P.push(tx(xd, y - 1, l, T.pq, { color: COLOR.gris, ancla: "end", cursiva: true })); y += LH.pq; }));
      if (c.prueba === "comprobada") P.push(tx(t.xAncla + 2, t.yLinea - 4, "✓", 13, { peso: 800, color: COLOR.verde }));
    });
    // Cabeza
    const k = g.cab;
    P.push(`<rect x="${k.x}" y="${k.y.toFixed(1)}" width="${k.w}" height="${k.h.toFixed(1)}" rx="16" fill="${COLOR.fondoCab}" stroke="${COLOR.acento}" stroke-width="3"/>`);
    k.lineas.forEach((l, i) => P.push(tx(k.x + k.w / 2, g.Y - (k.lineas.length - 1) * LH.cab / 2 + i * LH.cab + 5, l, T.cab, { peso: 800, ancla: "middle" })));
    if (g.pie) P.push(tx(g.W - MARGEN, g.H - 12, g.pie, T.pie, { color: COLOR.gris, ancla: "end" }));
    const titulo = o.titulo || g.titulo || "Diagrama de Ishikawa";
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${g.W}" height="${g.H}" viewBox="0 0 ${g.W} ${g.H}" font-family="${esc(FUENTE)}" role="img" aria-labelledby="ish-t"><title id="ish-t">${esc(titulo)}</title>${P.join("")}</svg>`;
  }

  // Plantilla en blanco (A3 apaisado) para la reunión con pósits: solo espinas y categorías
  function plantillaVacia(nombresCategorias, problema, titulo) {
    const d = { problema: problema || "", categorias: nombresCategorias.map(n => ({ nom: n, causas: [1, 2, 3, 4].map(() => ({ texto: "                    ", porques: [] })) })) };
    return svg(colocar(d, { titulo: titulo || "Diagrama de Ishikawa", pie: "Plantilla en blanco · ACR · Ishikawa" }));
  }

  const api = { colocar, cajas, svg, lineas, anchoTexto, plantillaVacia, COLOR };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.Dibujo = api;
})(typeof window !== "undefined" ? window : globalThis);
