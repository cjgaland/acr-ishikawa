# CLAUDE.md — ACR · Ishikawa

> Documento común a todas las apps (lista, carpetas, identidad visual e intercambio de datos): `/Users/Trabajo/Desktop/Calidad&Seguridad/Ecosistema Calidad/ECOSISTEMA.md`.

Guía de referencia para el desarrollo asistido por IA. Léela antes de proponer cambios. Responder siempre en español y en lenguaje claro (el autor no es programador). El diseño completo, las fuentes verificadas, las decisiones del autor y el plan por entregas están en `/Users/Trabajo/Desktop/Calidad&Seguridad/Ecosistema Calidad/ACR Ishikawa/Diseño/DISEÑO_ACR_ISHIKAWA.md` (léelo también al empezar una sesión). Rigor en las fuentes: nunca inventar una referencia. Confirmar antes de borrar.

## 1. Descripción
PWA estática (sin build, sin dependencias, sin CDN) para buscar **las causas de fondo** de un problema (diagrama de **Ishikawa**, espina de pescado) o de un incidente (**análisis causa raíz**, ACR), paso a paso y sin buscar culpables. Al final, el usuario se lleva su informe (Word, PDF, Excel) y su espina (copiar como imagen, PNG, SVG). Acompaña al capítulo 8 de la Guía de Calidad y Seguridad («Buscar las causas: Ishikawa y análisis causa raíz») y sigue su método, sus términos y su caso (Urgencias, ficticio). Es la parte **reactiva** de la seguridad del paciente, frente a AMFE y Mapa de Riesgos (proactivas). Herramienta docente y de apoyo.

Repositorio previsto `cjgaland/acr-ishikawa` → https://cjgaland.github.io/acr-ishikawa/ · prefijo de datos `acrishikawa-`. **Antes de la primera publicación, pedir confirmación al autor** (decisión expresa para esta app).

Autoría (idéntica en el pie de index.html, «Acerca de», `informePie()` en app.js y el README; orden alfabético): Carlos J. Galán Doval (Médico de Familia · Técnico en Calidad y Seguridad del Paciente) y Rafael J. Romero de Castilla Gil (Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente), Área de Gestión Sanitaria Sur de Córdoba · Andalucía.

## 2. Arquitectura
Base copiada de AMFE (mismos patrones). Archivos:
- `index.html` — esqueleto, cabecera, nav, franja de ejemplo, modales (bienvenida, Acerca de con fuentes, novedades, confirmar). Script inline que fija `data-tema`.
- `styles.css` — copiado de AMFE con el **acento terracota** (la variable sigue llamándose `--cyan`: claro `#b4442b`, oscuro `#f4917b`, texto sobre acento en oscuro `#2a0f08`, impreso `#8f3322`; contraste AA comprobado en todos los fondos). Bloque final «Componentes propios de ACR · Ishikawa».
- `logic.js` — funciones PURAS (`window.Logica` / `module.exports`): `PLANTILLAS` de categorías (`guia` = las 7 del capítulo 8 y de AMFE, por defecto; `vincent` = los 7 niveles de Vincent 1998 con los nombres que usa la guía; `londres` = 8 niveles del Protocolo de Londres 2024; `seips` = 6 elementos; `m6`; `propia` con hasta 8), cada categoría con `eq` (idea común) para `equivalencia`/`propuestaCambio`/`cambiarPlantilla`; fábricas (`nuevoAnalisis` con TODO el modelo, también los campos del ACR de entregas futuras); causas (`causaFondo` = último porqué, `ranking` por votos, `numerosElegidas`); **fuerza** (`JERARQUIA` del RCA² figura 3: 6 fuertes, 9 intermedias, 4 débiles; `categoriaSugerida` por el texto; `fuerzaAccion`); `responsableGrupo`; `cuentaIncidentes`; **matriz SAC del SiNASP** (`MATRIZ_SAC` hospital y primaria, `sac`, `NIVELES_SAC`: 1 = extremo); privacidad (`pareceDatoPaciente`, `hayDatoPersonal`); avisos (`avisosProblema`, `avisosCausa`, `avisosEspina`, `avisosElegir`, `avisosAcciones`, `avisoPrivacidad`); `PASOS` (ishikawa: 4; acr: 8, cada uno con su entrega) y `progreso`; `datosDibujo`; **intercambio** (`paqueteIntercambio`, `leerIntercambio`); `documentoFicha` (bloques; `{t:"espina"}` en pantalla o `{t:"imagen"}` en Word); `hojasExcel`; saneado por esquema (`ESQ`, `sanearAnalisis`, `sanearDatos`) y `fusionar`.
- `dibujo.js` — la espina, PURA (`window.Dibujo`): `colocar(datos, {titulo, pie})` calcula la geometría sin solapes de texto; `svg(geometría)` da un SVG autónomo (colores fijos, fondo blanco, `width`/`height` en px); `cajas` (para los tests); `plantillaVacia`. Lo mismo sirve para pantalla, PNG, Word y PDF.
- `contenido.js` — solo datos (`window.Contenido`): `TEMAS` (Aprende), `GLOSARIO`, `TEST` y `TEMAS_TEST`, `EJEMPLOS` (`ej-ish-sala`: el Ishikawa de la sala de espera con las 13 causas de la figura del capítulo 8).
- `app.js` — UI: datos, enrutado, inicio con dos puertas, lista, asistente (`RENDER` por clave de paso; los pasos aún no construidos muestran `pasoProximo`), exportar (`pngDe` a 3×, `copiarImagen` con `ClipboardItem` y promesa, `plantillaBlanco`), ficha (`renderFicha`, `descargarWord` con la imagen, `exportarExcel`), PDF en iOS, copias, tema, modales, SW. `ENTREGA` = pasos disponibles.
- `docx.js` (copiado de Flujograma, admite imágenes PNG; color `8F3322`), `xlsx.js` (de AMFE), `sw.js` (network-first; borra solo cachés `acrishikawa-`).
- `tests/logic.test.mjs` — `node tests/logic.test.mjs`: lógica, ejemplo del capítulo 8, intercambio, saneado, Word y Excel reales, y **sin solapes** en la espina.

### Rutas (hash)
`#/` inicio · `#/nuevo/ishikawa` · `#/nuevo/acr` (crean un borrador y redirigen) · `#/analisis` · `#/analisis/<id>` (primer paso pendiente) · `#/analisis/<id>/<n>` (`?informe=1` = ficha imprimible) · `#/ejemplos` · `#/aprende[/n]` · `#/prueba` · `#/glosario`.

### Datos
- `localStorage["acrishikawa-datos"]` = `{ app: "acrishikawa", v, ultimaCopia, analisis: [] }`. Otras claves: `acrishikawa-intercambio`, `-tema`, `-bienvenida-vista`, `-version-vista`, `-facil-abierto`, `-vista` (ver porqués / solo elegidas).
- Al cargar e importar, SIEMPRE por `sanearDatos`. **Campo nuevo**: añadirlo a la fábrica y a `ESQ` (si no, el saneado lo borra).
- Enlaces en la UI: campos del análisis `data-k`; causas `data-ca` + `data-f` (`texto`, `porques.N`, `comprobacion`); acciones `data-ac` + `data-f` (también `indicador.*`), `data-acpick` (estado), `data-acc` + `data-c` (causa que ataca). Al escribir se refresca sin perder el foco (`refrescar`: avisos, pasos, `[data-zesp]` espina con 120 ms de retardo); los cambios de estructura repintan conservando el scroll.
- Ejemplos en memoria (ids `ej-…`); «Copiar a mis datos» cambia todos los ids.
- **Intercambio** (Diseño 7.3): en cada guardado, `localStorage["acrishikawa-intercambio"]` = `{ formato: "acrishikawa-analisis", version: 1, app: "acrishikawa", appVersion, generado, analisis: [{ id, tipo, titulo, unidad, ambito, fecha, sac, problema, dato, plantilla, categorias, causas: [{ id, categoria, texto, causaFondo, elegida, estadoPrueba, votos }], afirmaciones, acciones: [{ id, que, fuerza, categoria, responsable, plazo, estado, causas, indicador }], cerrado }] }`. También en la copia `.json` (clave `intercambio`). Solo datos del usuario. Añadir campos no sube la versión; quitar o cambiar el significado, sí.

## 3. Decisiones del autor (2026-10-27)
- Diseño aprobado con todas las mejoras (A a M) y el plan de 5 entregas.
- Categorías por defecto: **las 7 de la guía**; alternativas Londres 2024, SEIPS, 6M y propia.
- Acento **terracota/coral**. **Dos puertas**: Ishikawa rápido y ACR completo.
- Doble versión desde el principio (edición independiente con marcas).

## 4. Entorno y pruebas
- Node v26. `node tests/logic.test.mjs`.
- Servir en local desde Bash en segundo plano: `cd "/Users/Trabajo/Desktop/Calidad&Seguridad/Ecosistema Calidad/ACR Ishikawa/Aplicación" && python3 -m http.server 8777`, y abrir la vista previa `app-acrishikawa` (`../.claude/launch.json`, solo URL).
- Revisar en escritorio, en móvil (360 px, `scrollWidth === 360`) y en oscuro. La espina va siempre en «papel» blanco.
- Ver el Word o el Excel: `soffice --headless --convert-to pdf` (`/Applications/LibreOffice.app/Contents/MacOS/soffice`).
- Icono: `icon-512.svg` → `qlmanage -t -s 512` y `sips -z`.

## 5. Versiones
`APP_VERSION` y `NOVEDADES` al principio de `app.js` (AAAA.NN, la más reciente arriba). Pasos por versión: copia de seguridad; NOVEDADES + `APP_VERSION`; mismos `?v=` en index.html; subir `CACHE_NAME` en sw.js; tests; commit en español terminado en `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; push solo con permiso del autor; después del push, `node actualizar.mjs acr-ishikawa` (edición independiente).

## 6. Copias de seguridad locales
`bash ~/.claude/skills/app-copia_seguridad/scripts/copia_seguridad.sh --root "/Users/Trabajo/Desktop/Calidad&Seguridad/Ecosistema Calidad/ACR Ishikawa" --name ACR_Ishikawa --exclude "Edici*" --exclude "*.docx" --exclude .claude` (copia `Aplicación/` y `Diseño/`). Hacer una antes de cada publicación.

## 7. Edición independiente
Versión para regalar sola: `../Edición independiente/` (repositorio git propio; se publicará en `herramientas-calidad/acr-ishikawa`). **No se edita a mano**: la fabrica `node generar.mjs acr-ishikawa` desde `../../Ediciones independientes/` (ficha `apps/acr-ishikawa.json`, README `apps/acr-ishikawa.README.md`).
- **Marcas** (comentarios): `[eco]`…`[/eco]` = solo ecosistema; `[ind]`…`[/ind]` = solo edición. En línea propia o dentro de una línea (`/*[eco]*/…/*[/eco]*/`, `<!--[eco]-->…<!--[/eco]-->`; dentro de un texto HTML de app.js, la forma `<!-- -->`).
- Al añadir un enlace a otra app, un «Traer de…», una mención a la Guía o al capítulo, o NOVEDADES del ecosistema: rodearlo con `[eco]`. Clave nueva de `localStorage` → a `claves` de la ficha. La ficha cambia «Las siete de la guía» por «Las siete habituales en sanidad» (`sustituciones`).
- Prefijo en la edición: `ei-acrishikawa-`.

## 8. Estado y pendiente
- **Entrega 1 (hecha, 2026-10-27, v2026.01, sin publicar)**: estructura e identidad (icono de espina), datos y copias, portada con dos puertas, **Ishikawa rápido completo** (problema con avisos de opinión/solución/dato, espina con categorías, porqués hasta 5, cambio de plantilla con propuesta de reparto, votos, causas de fondo con comprobación, acciones con jerarquía, responsable, plazo e indicador), exportar la espina (copiar, PNG 3×, SVG, plantilla en blanco), ficha en Word/PDF/Excel, ejemplo de la sala de espera, Aprende (3 temas), glosario (27), test (5 del capítulo 8). En el ACR ya funcionan los pasos 2, 5 y 7; el resto muestra «próximamente». 40 tests. Edición independiente fabricada y verificada (sin publicar).
- Siguientes (Diseño, sección 15): entrega 2 (ACR pasos 1, 3, 4: SAC, equipo y plazos, cronología de doble fila, problemas en la atención, espinas por problema, preguntas desencadenantes); entrega 3 (afirmaciones con las cinco reglas, medidas, informar y apoyar, informe del ACR, ejemplo de la sepsis); entrega 4 (conexiones «Traer de…», didáctica completa, minicasos, modo reunión); entrega 5 (pulido y publicación con permiso; integración en portal, hermanas, ECOSISTEMA.md, cartel; avisos a la guía y a la hoja de ruta).
