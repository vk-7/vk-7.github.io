// Experiencia: vacía = sección oculta. Formato: { cuando, que, donde, nota }
const EXPERIENCIA = [];

// Crea un elemento con texto seguro (nunca innerHTML con datos externos)
function el(etiqueta, clase, texto) {
  const e = document.createElement(etiqueta);
  if (clase) e.className = clase;
  if (texto != null) e.textContent = texto;
  return e;
}

function fecha(iso) {
  return new Date(iso).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });
}

// Código de barras decorativo, siempre igual para el mismo nombre
function barras(nombre) {
  const caja = el("div", "barras");
  caja.setAttribute("aria-hidden", "true");
  let h = 0;
  for (const c of nombre) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  for (let i = 0; i < 38; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const b = document.createElement("i");
    b.style.width = 1 + ((h >>> 28) % 4) + "px";
    b.style.opacity = (h >>> 20) % 5 ? 1 : 0;
    caja.append(b);
  }
  return caja;
}

function etiqueta(p) {
  const e = el(p.url ? "a" : "div", "etiqueta");
  if (p.url) e.href = p.url;
  e.append(
    el("h3", null, p.nombre),
    el("span", "estado", p.privado ? "Privado" : "Público"),
    el("p", p.descripcion ? "desc" : "desc sin", p.descripcion || "Sin descripción."),
  );
  const campos = el("dl", "campos");
  campos.append(
    el("dt", null, "Lenguaje"), el("dt", null, "Actualizado"),
    el("dd", null, p.lenguaje || "Varios"), el("dd", null, fecha(p.actualizado)),
  );
  e.append(campos, barras(p.nombre));
  return e;
}

async function proyectos() {
  const rejilla = document.getElementById("rejilla");
  let lista = [];
  try {
    const r = await fetch("proyectos.json", { cache: "no-cache" });
    if (r.ok) lista = (await r.json()).proyectos || [];
  } catch { /* sin datos: queda el mensaje vacío */ }
  lista.forEach((p) => rejilla.append(etiqueta(p)));
  document.getElementById("vacio").hidden = lista.length > 0;
}

function experiencia() {
  if (!EXPERIENCIA.length) return;
  const ul = document.getElementById("exp");
  for (const x of EXPERIENCIA) {
    const li = el("li");
    li.append(el("p", "cuando", x.cuando), el("h3", null, x.que), el("p", "donde", x.donde), el("p", null, x.nota));
    ul.append(li);
  }
  document.getElementById("experiencia").hidden = false;
}

proyectos();
experiencia();
