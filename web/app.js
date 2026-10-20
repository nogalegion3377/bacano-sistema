/* ================= SISTEMA BACANO · app.js =================
   Pantalla del sistema. Los datos están en Supabase.
   Si corre dentro del programa de escritorio, window.bacanoApp imprime directo. */

/* ================= CONFIGURACIÓN ================= */
const SUPABASE_URL = "https://elrzxkvprbbqpjuqubbb.supabase.co";
const SUPABASE_KEY = "sb_publishable_y8LrA-4RDmF3l9x0YdAkyA_cRu1pPEk";
const NEGOCIO = {nombre: "PIZZA BACANO", tel: "11 3848-4570", dir: "Calle 808 N° 2113 e/ 891 y 892 · B° La Paz"};
const LOGO = "logo.webp";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ================= UTILIDADES ================= */
const AR = "America/Argentina/Buenos_Aires";
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const N = v => Number(v) || 0;
const peso = n => (N(n) < 0 ? "− " : "") + "$ " + Math.round(Math.abs(N(n))).toLocaleString("es-AR");
const cant = n => (+N(n).toFixed(2)).toLocaleString("es-AR");
const hoyYMD = () => new Intl.DateTimeFormat("en-CA", {timeZone: AR}).format(new Date());
const addDays = (ymd, n) => { const d = new Date(ymd + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const ini = ymd => ymd + "T00:00:00-03:00";
const inicioMes = () => hoyYMD().slice(0, 8) + "01";
const hora = f => new Date(f).toLocaleTimeString("es-AR", {timeZone: AR, hour: "2-digit", minute: "2-digit", hourCycle: "h23"});
const dia = f => new Date(f).toLocaleDateString("es-AR", {timeZone: AR, day: "2-digit", month: "2-digit"});
const diaYMD = ymd => { const [y, m, d] = ymd.split("-"); return `${d}/${m}`; };
const diaLargo = ymd => { const s = new Date(ymd + "T12:00:00Z").toLocaleDateString("es-AR", {timeZone: "UTC", weekday: "long", day: "numeric", month: "long"}); return s[0].toUpperCase() + s.slice(1); };
const soloNum = v => N(String(v).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", "."));
const soloDec = v => N(String(v).replace(",", ".").replace(/[^\d.]/g, ""));
function toast(t, bad) { const d = document.createElement("div"); d.className = "toast" + (bad ? " bad" : ""); d.textContent = t; document.body.append(d); setTimeout(() => d.remove(), bad ? 4500 : 2400); }
function fail(e) { console.error(e); toast(traducir(e?.message) || "Algo salió mal. Probá de nuevo.", true); }
function traducir(m = "") {
  if (/Failed to fetch|NetworkError|network/i.test(m)) return "No hay conexión a internet. Revisá el wifi y probá de nuevo.";
  if (/JWT|session|expired/i.test(m)) return "Se venció la sesión. Volvé a entrar.";
  if (/duplicate key|unique/i.test(m)) return "Ya existe uno con ese nombre.";
  if (/permission denied|row-level security/i.test(m)) return "Tu usuario no tiene permiso para hacer eso.";
  return m;
}
async function q(p) { const {data, error} = await p; if (error) throw error; return data; }
function bajar(nombre, filas) {
  const csv = "﻿" + filas.map(r => r.map(v => { const s = String(v ?? ""); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(";")).join("\r\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], {type: "text/csv;charset=utf-8"})); a.download = nombre; document.body.append(a); a.click(); a.remove();
}
const pl = (n, w) => `${n} ${w}${n == 1 ? "" : "s"}`;
const numXL = n => String(Math.round(N(n))).replace(".", ",");

const ICON = {
  inicio:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></svg>',
  comanda:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  comandas:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg>',
  merca:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 8h16l-1.5 12h-13z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3 21 20Q12 23 3 20Z"/><circle cx="11" cy="13" r="1.3" fill="currentColor"/><circle cx="14" cy="17" r="1.3" fill="currentColor"/></svg>',
  clientes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14c2.6.2 4.3 2 5 5"/></svg>',
  reportes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  caja:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="7" width="18" height="12" rx="2"/><circle cx="12" cy="13" r="2.5"/><path d="M7 4h10"/></svg>',
  historial:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>'
};

/* ================= ESTADO ================= */
const S = {user: null, rol: "general", tab: "inicio", data: null, extra: {}, saving: false,
  qc: "", qcmd: "", fcmd: "todas", diaCmd: null, qmenu: "", verOff: false,
  per: "semana", desde: null, hasta: null, htab: "", hdesde: null};
let D;
function newDraft() { D = {editId: null, editNro: null, q: {}, sab: {}, cli: null, nombre: "", dir: "", tel: "", tipo: "delivery", pago: "efectivo", extra: [], desc: 0, nota: "", busca: "", qprod: ""}; }
newDraft();
const esAdmin = () => S.rol === "admin";
const tieneSab = p => p && Array.isArray(p.sabores) && p.sabores.length > 0;
const sabTxt = o => Object.entries(o || {}).filter(([, v]) => v > 0).map(([k, v]) => `${v} ${k}`).join(" · ");
function faltan(id) { const p = pr(id); if (!tieneSab(p)) return 0; const tot = Object.values(D.sab[id] || {}).reduce((a, v) => a + v, 0); return (D.q[id] || 0) * (p.unidades || 1) - tot; }
const vivos = c => (c.comanda_items || []).filter(i => !i.reemplazado);

/* ================= DATOS ================= */
async function cargarBase() {
  const hoy = hoyYMD();
  const [productos, costos, insumos, clientes, comandas, resumen, perdidas, cierre, consumo, recetas] = await Promise.all([
    q(sb.from("productos").select("*").order("orden").order("id")),
    q(sb.from("v_productos_costo").select("*")),
    q(sb.from("insumos").select("*, presentaciones(*)").order("nombre")),
    q(sb.from("clientes").select("*, cliente_comentarios(id,texto,fecha,autor)").eq("activo", true).order("nombre")),
    q(sb.from("comandas").select("*, comanda_items(*)").gte("fecha", ini(hoy)).order("fecha", {ascending: false})),
    q(sb.rpc("resumen_dia")),
    q(sb.from("perdidas").select("*").gte("fecha", ini(inicioMes())).order("fecha", {ascending: false}).limit(8)),
    q(sb.from("cierres_caja").select("*").eq("fecha", hoy).maybeSingle()),
    q(sb.rpc("consumo_insumos")),
    q(sb.from("recetas").select("producto_id,insumo_id"))
  ]);
  const cons = Object.fromEntries((consumo || []).map(c => [c.insumo_id, N(c.por_dia)]));
  insumos.forEach(i => { i.por_dia = cons[i.id] || 0; i.presentaciones.sort((a, b) => N(b.cantidad) - N(a.cantidad)); });
  clientes.forEach(c => (c.cliente_comentarios || []).sort((a, b) => b.fecha.localeCompare(a.fecha)));
  S.data = {productos, costos, insumos, clientes, comandas, resumen, perdidas, cierre, recetas};
}
async function cargarExtra() {
  const t = S.tab;
  if (t === "comandas") {
    const d = S.diaCmd || hoyYMD();
    S.extra.comandas = await q(sb.from("comandas").select("*, comanda_items(*)").gte("fecha", ini(d)).lt("fecha", ini(addDays(d, 1))).order("fecha", {ascending: false}));
  }
  if (t === "merca") S.extra.compras = await q(sb.from("compras").select("*, insumos(nombre,unidad)").order("fecha", {ascending: false}).limit(15));
  if (t === "caja") S.extra.cierres = await q(sb.from("cierres_caja").select("*").order("fecha", {ascending: false}).limit(10));
  if (t === "reportes") {
    const [d, h] = periodo(), len = (new Date(h) - new Date(d)) / 864e5 + 1;
    const [act, ant] = await Promise.all([q(sb.rpc("reporte", {p_desde: d, p_hasta: h})), q(sb.rpc("reporte", {p_desde: addDays(d, -len), p_hasta: addDays(d, -1)}))]);
    S.extra.rep = act; S.extra.ant = ant;
    S.extra.sab = await q(sb.rpc("sabores_vendidos", {p_desde: d, p_hasta: h}));
  }
  if (t === "historial" && esAdmin()) {
    let qq = sb.from("auditoria").select("*").order("fecha", {ascending: false}).limit(200);
    if (S.htab) qq = qq.eq("tabla", S.htab);
    if (S.hdesde) qq = qq.gte("fecha", ini(S.hdesde)).lt("fecha", ini(addDays(S.hdesde, 1)));
    S.extra.log = await q(qq);
  }
}
const pr = id => S.data.productos.find(p => p.id == id);
const cl = id => S.data.clientes.find(c => c.id == id);
const ins = id => S.data.insumos.find(i => i.id == id);
const activos = arr => arr.filter(x => x.activo !== false);
function stIng(i) { const s = N(i.stock), m = N(i.minimo); if (i.por_dia > 0 && s / i.por_dia < 1) return "falta"; return s <= m * .5 ? "falta" : s <= m ? "poco" : "ok"; }
const ST = {ok: "Alcanza", poco: "Queda poco", falta: "Hay que comprar"};
function alcanza(i) { if (!i.por_dia) return ""; const d = N(i.stock) / i.por_dia; return d < 1 ? "No llega a 1 día" : d < 15 ? `Alcanza para ${Math.floor(d)} día${Math.floor(d) === 1 ? "" : "s"}` : "Alcanza para 2 semanas o más"; }

/* ================= LOGIN ================= */
function vLogin(msg = "") {
  $("#root").innerHTML = `<div class="login"><form id="flogin">
    <img src="${LOGO}" alt="Pizza Bacano">
    <h1>Sistema de la pizzería</h1><p>Entrá con tu usuario</p>
    <label class="field">Email<input class="inp" id="lemail" type="email" autocomplete="username" required></label>
    <label class="field">Contraseña<input class="inp" id="lpass" type="password" autocomplete="current-password" required></label>
    <button class="btn btn-p btn-big" id="lbtn">Entrar</button>
    <div class="err" id="lerr">${esc(msg)}</div></form></div>`;
  $("#flogin").onsubmit = async e => {
    e.preventDefault(); $("#lbtn").disabled = true; $("#lerr").textContent = "";
    const {error} = await sb.auth.signInWithPassword({email: $("#lemail").value.trim(), password: $("#lpass").value});
    if (error) { $("#lbtn").disabled = false; $("#lerr").textContent = /Invalid/i.test(error.message) ? "Email o contraseña incorrectos" : traducir(error.message); }
  };
}

/* ================= MARCO ================= */
function marco(html) {
  const faltan = activos(S.data.insumos).filter(i => stIng(i) === "falta").length;
  const deben = S.data.clientes.filter(c => N(c.deuda) > 0).length;
  const T = [["inicio","Inicio",0],["comanda", D.editId ? "Editando #" + D.editNro : "Nueva comanda",0],["comandas","Comandas",0],null,
    ["merca","Mercadería",faltan],["menu","Menú y precios",0],["clientes","Clientes",deben],null,["reportes","Reportes",0],["caja","Cierre de caja",0]];
  if (esAdmin()) T.push(["historial","Historial de cambios",0]);
  $("#root").innerHTML = `<div class="app">
    <nav class="side" aria-label="Menú"><div class="brand"><img src="${LOGO}" alt="Pizza Bacano"></div>
      ${T.map(t => t ? `<button class="tab" data-tab="${t[0]}" aria-current="${S.tab === t[0]}">${ICON[t[0]]}<span>${t[1]}</span>${t[2] ? `<span class="badge">${t[2]}</span>` : ""}</button>` : `<div class="navsep"></div>`).join("")}
      <div class="who"><b>${esAdmin() ? "Administración" : "General"}</b>${esc(S.user.email)}<br>${window.bacanoApp ? `<button data-act="config">🖨️ Impresora</button><br>` : ""}<button data-act="salir">Cerrar sesión</button></div>
    </nav><main id="main">${html}</main></div>`;
}
const VISTAS = {};
async function render(recargar = true) {
  try {
    if (recargar || !S.data) { await cargarBase(); await cargarExtra(); }
    marco(VISTAS[S.tab]()); bind();
  } catch (e) { fail(e); }
}
async function ir(tab) { S.tab = tab; $("#main") && ($("#main").style.opacity = .5); await render(); scrollTo(0, 0); }

/* ================= INICIO ================= */
function filaComanda(c, full) {
  const its = vivos(c), an = c.estado === "anulada";
  return `<div class="li cmdrow ${an ? "anulada" : ""}"><span class="num" style="font-weight:800;min-width:38px">#${c.nro}</span>
    <div class="grow"><b>${its.map(i => `${i.cantidad} ${esc(i.nombre)}${i.sabores ? ` (${esc(sabTxt(i.sabores))})` : ""}`).join(", ") || "—"}</b>
      <span>${hora(c.fecha)} hs · ${c.tipo === "delivery" ? "Delivery" : "Mostrador"}${c.cliente_nombre ? " · " + esc(c.cliente_nombre) : ""}${full && c.direccion ? " · " + esc(c.direccion) : ""}</span>
      ${an ? `<span style="color:var(--bad);font-weight:700;display:block">Eliminada: ${esc(c.motivo_anulacion || "")}</span>` : ""}
      ${full && c.nota ? `<span style="display:block">Nota: ${esc(c.nota)}</span>` : ""}</div>
    ${c.editada && !an ? `<span class="tag warn">Corregida</span>` : ""}
    <div style="text-align:right"><b class="money">${peso(c.total)}</b><br><span class="stt ${c.pago === "fiado" ? "falta" : "ok"}">${c.pago === "fiado" ? "FIADO" : c.pago === "efectivo" ? "Efectivo" : "Transf."}</span></div>
    <span class="acts" style="flex-wrap:nowrap"><button class="ib" data-reimp="${c.id}" title="Volver a imprimir" aria-label="Volver a imprimir">🖨️</button>
    ${!an ? `<button class="ib" data-editcmd="${c.id}" title="Editar" aria-label="Editar">✎</button><button class="ib del" data-delcmd="${c.id}" title="Eliminar" aria-label="Eliminar">🗑</button>` : ""}</span></div>`;
}
VISTAS.inicio = () => {
  const {resumen: r, comandas, insumos, clientes, perdidas} = S.data;
  const comprar = activos(insumos).filter(i => stIng(i) !== "ok").sort((a, b) => (stIng(a) === "falta" ? 0 : 1) - (stIng(b) === "falta" ? 0 : 1));
  const deben = clientes.filter(c => N(c.deuda) > 0).sort((a, b) => N(b.deuda) - N(a.deuda));
  const pizzas = comandas.filter(c => c.estado === "activa").reduce((a, c) => a + vivos(c).filter(i => pr(i.producto_id)?.categoria === "Pizzas").reduce((x, i) => x + i.cantidad, 0), 0);
  return `<div class="top"><div><h1>Hola, <em>Bacano</em></h1><p>${diaLargo(hoyYMD())}</p></div>
    <div class="acts"><button class="btn" data-act="recargar">↻ Actualizar</button><button class="btn btn-p" data-act="nueva">＋ Nueva comanda</button></div></div>
  <div class="stack">
  <div class="hero">
    <div class="gain"><span class="l">Ganancia de hoy</span><span class="v money">${peso(r.ganancia)}</span>
      <span class="s money">Vendiste ${peso(r.vendido)} · ${pl(r.comandas, "comanda")} · ${pl(pizzas, "pizza")} · La mercadería costó ${peso(r.costo_mercaderia)}</span></div>
    <div class="kpis">
      <div class="kpi"><span class="l">Efectivo</span><span class="v money">${peso(r.efectivo)}</span></div>
      <div class="kpi"><span class="l">Transferencia</span><span class="v money">${peso(r.transferencia)}</span></div>
      <div class="kpi warn"><span class="l">Te deben (fiado)</span><span class="v money">${peso(r.por_cobrar)}</span></div>
      <div class="kpi bad"><span class="l">Perdido este mes</span><span class="v money">${peso(r.perdido_mes)}</span></div>
    </div>
  </div>
  <div class="grid2">
    <section class="panel"><h2 class="panel-h">Últimas comandas <small>${comandas.length} hoy</small></h2>
      <div class="list">${comandas.length ? comandas.slice(0, 10).map(c => filaComanda(c)).join("") : `<div class="empty">Todavía no hay comandas hoy.</div>`}</div>
      ${comandas.length > 10 ? `<button class="more" data-go="comandas">Ver las ${comandas.length} comandas de hoy →</button>` : ""}
    </section>
    <div class="stack">
      <section class="panel"><h2 class="panel-h">Hay que comprar <button class="btn btn-sm" data-go="merca">Ver todo</button></h2>
        <div class="list">${comprar.length ? comprar.map(i => `<div class="li ${stIng(i)}"><span class="dot"></span><div class="grow"><b>${esc(i.nombre)}</b><span>Quedan ${cant(i.stock)} ${esc(i.unidad)}${i.por_dia ? " · " + alcanza(i).toLowerCase() : ""}</span></div><span class="stt">${ST[stIng(i)]}</span></div>`).join("") : `<div class="empty">Hay de todo 👍</div>`}</div>
      </section>
      <section class="panel"><h2 class="panel-h">Te deben <button class="btn btn-sm" data-go="clientes">Clientes</button></h2>
        <div class="list">${deben.length ? deben.slice(0, 6).map(c => `<div class="li falta"><span class="dot"></span><div class="grow"><b>${esc(c.nombre)}</b><span>${esc(c.telefono || "")}</span></div><b class="money">${peso(c.deuda)}</b><button class="btn btn-sm" data-cobrar="${c.id}">Cobrar</button></div>`).join("") : `<div class="empty">Nadie debe nada 👍</div>`}</div>
      </section>
      <section class="panel"><h2 class="panel-h">Plata perdida <button class="btn btn-sm" data-act="tiro">＋ Se tiró algo</button></h2>
        <div class="list">${perdidas.length ? perdidas.slice(0, 5).map(p => `<div class="li"><span class="num" style="color:var(--muted);font-weight:700">${dia(p.fecha)}</span><div class="grow"><b>${esc(p.descripcion)}</b></div><b class="money" style="color:var(--bad)">${peso(p.monto)}</b></div>`).join("") : `<div class="empty">Sin pérdidas este mes.</div>`}</div>
      </section>
    </div>
  </div></div>`;
};

/* ================= NUEVA / EDITAR COMANDA ================= */
function totals() {
  const its = Object.entries(D.q).map(([id, c]) => ({id, c, p: pr(id)})).filter(x => x.p);
  const sub = its.reduce((a, i) => a + N(i.p.precio) * i.c, 0) + D.extra.reduce((a, e) => a + e.p, 0);
  return {its, sub, total: Math.max(0, sub - N(D.desc))};
}
VISTAS.comanda = () => {
  const t = D.qprod.trim().toLowerCase();
  const prods = S.data.productos.filter(p => (p.activo || D.q[p.id]) && (!t || p.nombre.toLowerCase().includes(t)));
  const groups = [...new Set(prods.map(p => p.categoria))];
  const {its, total} = totals(), c = D.cli ? cl(D.cli) : null;
  const notas = c ? [c.notas, ...(c.cliente_comentarios || []).slice(0, 2).map(x => x.texto)].filter(Boolean) : [];
  return `${D.editId ? `<div class="editbar"><span>✎ Estás corrigiendo la comanda #${D.editNro}. Al guardar se ajustan solos la mercadería y la deuda.</span><button class="btn btn-sm" data-act="canceledit">Cancelar</button></div>` : ""}
  <div class="top"><div><h1>${D.editId ? "Editar comanda #" + D.editNro : "Nueva comanda"}</h1><p>Tildá lo que pide. Para promos o regalos usá "Algo a mano".</p></div></div>
  <div class="cmd">
    <section class="panel"><h2 class="panel-h">1 · ¿Qué pide? <input class="inp" id="qprod" placeholder="Buscar en la carta…" value="${esc(D.qprod)}" style="max-width:240px;padding:7px 10px;font-size:.95rem"></h2><div>
      ${groups.length ? groups.map(g => `<h3 class="grp">${esc(g)}</h3>${prods.filter(p => p.categoria === g).map(p => { const n = D.q[p.id] || 0;
        return `<div class="prod ${n ? "on" : ""}" data-p="${p.id}" role="checkbox" aria-checked="${!!n}" tabindex="0"><span class="box">✓</span><span class="pn">${esc(p.nombre)}</span><span class="pp money">${peso(p.precio)}</span>
        ${n ? `<span class="stp"><button data-qd="-1" aria-label="Uno menos">−</button><output>${n}</output><button data-qd="1" aria-label="Uno más">＋</button></span>` : "<span></span>"}</div>${n && tieneSab(p) ? sabHTML(p) : ""}`; }).join("")}`).join("") : `<div class="empty">No hay nada con ese nombre en la carta.</div>`}
    </div></section>
    <aside class="cmd-side">
      <section class="panel"><h2 class="panel-h">2 · Cliente</h2>
        ${c ? `<div class="chosen"><span>${esc(c.nombre)}</span><button class="btn btn-sm" data-act="quitarcli">Cambiar</button></div>
             ${N(c.deuda) > 0 ? `<div class="owe" style="margin-top:8px">${esc(c.nombre.split(" ")[0])} debe ${peso(c.deuda)}. ¡Cobrale!</div>` : ""}
             ${notas.length ? `<div class="notebox" style="margin-top:8px"><b>Tener en cuenta</b>${notas.map(n => `<span>• ${esc(n)}</span>`).join("")}</div>` : ""}`
          : `<input class="inp" id="busca" placeholder="Buscar por nombre o teléfono" value="${esc(D.busca)}" autocomplete="off"><div class="sug" id="sug">${sugHTML()}</div>`}
        <div class="stack" style="gap:8px;margin-top:10px">
          ${c ? "" : `<label class="field">Nombre (si es nuevo se guarda solo)<input class="inp" id="f-nombre" value="${esc(D.nombre)}"></label>`}
          <label class="field">Dirección<input class="inp" id="f-dir" value="${esc(D.dir)}"></label>
          <div class="two"><label class="field">Teléfono<input class="inp" id="f-tel" value="${esc(D.tel)}" inputmode="tel"></label><label class="field">Nota de la comanda<input class="inp" id="f-nota" value="${esc(D.nota)}" placeholder="Sin ajo, etc."></label></div>
        </div>
        <div class="seg" style="margin-top:10px"><button data-tipo="delivery" aria-pressed="${D.tipo === "delivery"}"><span class="ic">🛵</span>Delivery</button><button data-tipo="mostrador" aria-pressed="${D.tipo === "mostrador"}"><span class="ic">🏪</span>Mostrador</button></div>
      </section>
      <section class="panel"><h2 class="panel-h">3 · Algo a mano <small>promo, regalo, extra</small></h2>
        <div class="two"><input class="inp" id="xn" placeholder="Qué es"><input class="inp" id="xp" placeholder="Precio $" inputmode="numeric"></div>
        <div class="two" style="margin-top:8px"><button class="btn" data-act="extra">＋ Agregar</button><label class="field" style="flex-direction:row;align-items:center;gap:6px">Descuento $<input class="inp" id="f-desc" value="${D.desc || ""}" inputmode="numeric" placeholder="0" style="padding:8px"></label></div>
      </section>
      <section class="panel"><h2 class="panel-h">4 · Cobro</h2>
        <div class="lines">${its.length || D.extra.length ? its.map(i => `<div><span>${i.c} × ${esc(i.p.nombre)}${tieneSab(i.p) && sabTxt(D.sab[i.id]) ? `<br><small style="color:var(--muted)">${esc(sabTxt(D.sab[i.id]))}</small>` : ""}</span><span class="money">${peso(N(i.p.precio) * i.c)}</span></div>`).join("") + D.extra.map((e, k) => `<div><span>✎ ${esc(e.n)} <button data-delx="${k}" aria-label="Quitar" style="color:var(--bad);font-weight:800">✕</button></span><span class="money">${peso(e.p)}</span></div>`).join("") + (D.desc > 0 ? `<div><span>Descuento</span><span class="money">${peso(-D.desc)}</span></div>` : "") : `<div class="x">Todavía no tildaste nada</div>`}</div>
        <div class="total"><span style="font-weight:800">Total</span><b class="money">${peso(total)}</b></div>
        <div class="seg" style="margin:10px 0"><button data-pago="efectivo" aria-pressed="${D.pago === "efectivo"}"><span class="ic">💵</span>Efectivo</button><button data-pago="transferencia" aria-pressed="${D.pago === "transferencia"}"><span class="ic">📱</span>Transfer.</button><button class="fiado" data-pago="fiado" aria-pressed="${D.pago === "fiado"}"><span class="ic">📒</span>Fiado</button></div>
        ${D.pago === "fiado" && !c && !D.nombre.trim() ? `<div class="warnbox" style="margin-bottom:10px">Para fiar, elegí un cliente o escribí su nombre.</div>` : ""}
        <button class="btn btn-p btn-big" data-act="guardar" ${S.saving ? "disabled" : ""}>${S.saving ? "Guardando…" : D.editId ? "Guardar cambios e imprimir" : "Guardar e imprimir"}</button>
      </section>
    </aside>
  </div>`;
};
function sabHTML(p) {
  const f = faltan(p.id), tot = (D.q[p.id] || 0) * (p.unidades || 1), o = D.sab[p.id] || {};
  return `<div class="sabs"><span class="sabst ${f === 0 ? "ok" : "falta"}">${f === 0 ? `✓ Sabores listos (${tot})` : f > 0 ? `Elegí los sabores: faltan ${f} de ${tot}` : `Te pasaste por ${-f}: tienen que ser ${tot}`}</span>
    ${p.sabores.map(sb => `<span class="sab ${o[sb] ? "on" : ""}"><span>${esc(sb)}</span><span class="stp"><button data-sab="${p.id}" data-sb="${esc(sb)}" data-sd="-1" aria-label="Uno menos de ${esc(sb)}">−</button><output>${o[sb] || 0}</output><button data-sab="${p.id}" data-sb="${esc(sb)}" data-sd="1" aria-label="Uno más de ${esc(sb)}">＋</button></span></span>`).join("")}
    ${f > 0 ? `<span class="sabq">${p.sabores.map(sb => `<button class="chip" data-saball="${p.id}" data-sb="${esc(sb)}">Completar con ${esc(sb)}</button>`).join("")}</span>` : ""}</div>`;
}
function sugHTML() {
  const t = D.busca.trim().toLowerCase(); if (t.length < 2) return "";
  const dig = t.replace(/\D/g, "");
  const r = S.data.clientes.filter(c => c.nombre.toLowerCase().includes(t) || (dig.length >= 3 && (c.telefono || "").replace(/\D/g, "").includes(dig)));
  return r.length ? r.slice(0, 5).map(c => `<button data-cli="${c.id}"><b>${esc(c.nombre)}</b><span>${esc(c.direccion || "")}${N(c.deuda) > 0 ? ` · <span style="color:var(--bad);font-weight:800">debe ${peso(c.deuda)}</span>` : ""}</span></button>`).join("")
    : `<span style="color:var(--muted)">No está cargado. Escribí sus datos abajo y queda guardado.</span>`;
}
function editarComanda(c) {
  newDraft();
  Object.assign(D, {editId: c.id, editNro: c.nro, cli: c.cliente_id && cl(c.cliente_id) ? c.cliente_id : null, nombre: c.cliente_nombre || "", dir: c.direccion || "", tel: c.telefono || "",
    tipo: c.tipo, pago: c.pago, desc: N(c.descuento), nota: c.nota || ""});
  vivos(c).forEach(i => { if (i.manual) D.extra.push({n: i.nombre, p: N(i.precio_unit)}); else if (i.producto_id) { D.q[i.producto_id] = (D.q[i.producto_id] || 0) + i.cantidad;
    if (i.sabores) { const o = D.sab[i.producto_id] = D.sab[i.producto_id] || {}; for (const [k, v] of Object.entries(i.sabores)) o[k] = (o[k] || 0) + N(v); } } });
  S.tab = "comanda"; render(false); scrollTo(0, 0);
}
async function guardar() {
  const {its} = totals();
  if (!its.length && !D.extra.length) return toast("Tildá al menos un producto", true);
  if (D.pago === "fiado" && !D.cli && !D.nombre.trim()) return toast("Para fiar, elegí un cliente o escribí su nombre", true);
  const mal = its.find(i => tieneSab(i.p) && faltan(i.id) !== 0);
  if (mal) { const f = faltan(mal.id); return toast(f > 0 ? `Faltan elegir ${f} sabores de ${mal.p.nombre}` : `Sobran ${-f} sabores en ${mal.p.nombre}`, true); }
  const p = {cliente_id: D.cli, cliente_nombre: D.cli ? null : D.nombre, direccion: D.dir, telefono: D.tel, nota: D.nota,
    tipo: D.tipo, pago: D.pago, descuento: N(D.desc), items: its.map(i => ({producto_id: +i.id, cantidad: i.c, ...(tieneSab(i.p) ? {sabores: D.sab[i.id] || {}} : {})})), extras: D.extra.map(e => ({nombre: e.n, precio: e.p}))};
  S.saving = true; render(false);
  try {
    const edit = D.editId;
    const c = edit ? await q(sb.rpc("editar_comanda", {p_id: edit, p})) : await q(sb.rpc("crear_comanda", {p}));
    const items = await q(sb.from("comanda_items").select("*").eq("comanda_id", c.id).eq("reemplazado", false).order("id"));
    newDraft(); S.saving = false; S.tab = "inicio"; await render();
    imprimir({...c, comanda_items: items});
    toast(edit ? `Comanda #${c.nro} corregida` : `Comanda #${c.nro} guardada`);
  } catch (e) { S.saving = false; render(false); fail(e); }
}

/* ================= TICKET ================= */
function ticketHTML(c) {
  return `<div class="ticket"><img src="${LOGO}" alt=""><div class="c big">${NEGOCIO.nombre}</div><div class="c">WhatsApp ${NEGOCIO.tel}</div><div class="c">${NEGOCIO.dir}</div><hr>
  <div class="row"><b>COMANDA #${c.nro}</b><span>${dia(c.fecha)} ${hora(c.fecha)}</span></div><div><b>${c.tipo === "delivery" ? "DELIVERY" : "MOSTRADOR"}</b>${c.estado === "anulada" ? " · ELIMINADA" : c.editada ? " · CORREGIDA" : ""}</div><hr>
  ${vivos(c).map(i => `<div class="row"><span>${i.manual ? "* " : i.cantidad + " x "}${esc(i.nombre)}</span><span>${peso(N(i.precio_unit) * i.cantidad)}</span></div>${i.sabores ? Object.entries(i.sabores).filter(([, v]) => v > 0).map(([k, v]) => `<div class="sabt">&nbsp;&nbsp;${v} ${esc(k)}</div>`).join("") : ""}`).join("")}
  ${N(c.descuento) ? `<div class="row"><span>Descuento</span><span>${peso(-c.descuento)}</span></div>` : ""}<hr>
  <div class="row big"><span>TOTAL</span><span>${peso(c.total)}</span></div><div>Pago: ${c.pago.toUpperCase()}</div>
  ${c.cliente_nombre || c.direccion ? `<hr>${c.cliente_nombre ? `<div><b>${esc(c.cliente_nombre)}</b></div>` : ""}${c.direccion ? `<div>${esc(c.direccion)}</div>` : ""}${c.telefono ? `<div>Tel: ${esc(c.telefono)}</div>` : ""}` : ""}
  ${c.nota ? `<hr><div><b>NOTA:</b> ${esc(c.nota)}</div>` : ""}<hr><div class="c">¡Gracias por elegirnos!</div></div>`;
}
function imprimir(c) {
  $("#print").innerHTML = ticketHTML(c);
  const img = $("#print img");
  const go = () => setTimeout(async () => {
    if (window.bacanoApp) {            // dentro del programa de escritorio: imprime directo en la comandera
      try { const r = await window.bacanoApp.imprimir(); if (r && r.error) toast("No se pudo imprimir: " + r.error, true); }
      catch (e) { toast("No se pudo imprimir. Revisá que la impresora esté prendida.", true); }
    } else window.print();             // en el navegador: abre el cuadro de imprimir
  }, 60);
  if (img && !img.complete) { img.onload = go; img.onerror = go; } else go();
}

/* ================= COMANDAS (historial por día) ================= */
VISTAS.comandas = () => {
  const d = S.diaCmd || hoyYMD(), all = S.extra.comandas || [];
  const t = S.qcmd.trim().toLowerCase();
  const list = all.filter(c => (S.fcmd === "todas" || (S.fcmd === "eliminadas" ? c.estado === "anulada" : c.estado === "activa" && c.pago === S.fcmd))
    && (!t || [c.nro, c.cliente_nombre, c.direccion, c.telefono, ...vivos(c).map(i => i.nombre)].join(" ").toLowerCase().includes(t)));
  const act = all.filter(c => c.estado === "activa"), tot = act.reduce((a, c) => a + N(c.total), 0);
  return `<div class="top"><div><h1>Comandas</h1><p>${diaLargo(d)} · ${pl(act.length, "comanda")} · ${peso(tot)}</p></div>
    <div class="acts"><button class="btn" data-diacmd="-1">◀ Día anterior</button><input class="inp" type="date" id="diacmd" value="${d}" max="${hoyYMD()}" style="width:auto"><button class="btn" data-diacmd="1" ${d >= hoyYMD() ? "disabled" : ""}>Día siguiente ▶</button><button class="btn" data-act="xlsdia">⬇ Excel</button></div></div>
  <section class="panel">
    <div class="acts" style="margin-bottom:10px;justify-content:space-between">
      <div class="chips">${[["todas","Todas"],["efectivo","Efectivo"],["transferencia","Transferencia"],["fiado","Fiado"],["eliminadas","Eliminadas"]].map(([k, l]) => `<button class="chip" data-fcmd="${k}" aria-pressed="${S.fcmd === k}">${l}</button>`).join("")}</div>
      <input class="inp" id="qcmd" placeholder="Buscar por número, cliente, dirección o pizza" value="${esc(S.qcmd)}" style="max-width:340px">
    </div>
    <div class="list">${list.length ? list.map(c => filaComanda(c, true)).join("") : `<div class="empty">No hay comandas ${all.length ? "con ese filtro" : "ese día"}.</div>`}</div>
    ${d !== hoyYMD() && !esAdmin() ? `<p style="color:var(--muted);font-size:.88rem;margin:10px 0 0">Las comandas de días anteriores solo las puede corregir o eliminar administración.</p>` : ""}
  </section>`;
};

/* ================= MERCADERÍA ================= */
VISTAS.merca = () => {
  const lista = activos(S.data.insumos), compras = S.extra.compras || [];
  return `<div class="top"><div><h1>Mercadería</h1><p>Cada vez que compren, anoten cuánto pagaron. Con lo que se vende cada día, el sistema calcula para cuántos días alcanza.</p></div>
    <div class="acts"><button class="btn" data-act="tiro">＋ Se tiró algo</button><button class="btn" data-act="nuevoins">＋ Nueva mercadería</button><button class="btn btn-p" data-act="compra">＋ Anotar compra</button></div></div>
  <div class="stack">
    <section class="panel"><h2 class="panel-h">Lo que hay en la cocina <small>${lista.length} productos</small></h2>
      ${lista.map(i => { const s = stIng(i); return `<div class="ing ${s}"><span class="dot"></span>
        <div style="min-width:0"><b>${esc(i.nombre)}</b><br><span class="stt">${ST[s]}</span> <span style="color:var(--muted);font-size:.86rem">· ${peso(i.precio_actual)} por ${esc(i.unidad)}${i.por_dia ? ` · usan ${cant(i.por_dia)} ${esc(i.unidad)} por día` : ""}</span></div>
        <span class="q num">${cant(i.stock)} ${esc(i.unidad)}${i.por_dia ? `<small>${alcanza(i)}</small>` : ""}</span>
        <span class="acts">${i.presentaciones.map(p => `<button class="btn btn-sm" data-pack="${i.id}:${p.id}">＋ ${esc(p.nombre)}</button>`).join("")}
          <button class="ib" data-editins="${i.id}" title="Editar" aria-label="Editar">✎</button><button class="ib del" data-delins="${i.id}" title="Eliminar" aria-label="Eliminar">🗑</button></span></div>`; }).join("") || `<div class="empty">No hay mercadería cargada.</div>`}
    </section>
    <section class="panel"><h2 class="panel-h">Últimas compras</h2>
      <div class="list">${compras.length ? compras.map(c => `<div class="li"><span class="num" style="color:var(--muted);font-weight:700">${dia(c.fecha)}</span>
        <div class="grow"><b>${esc(c.insumos?.nombre || "")}${c.presentacion ? ` · ${cant(c.cantidad)} × ${esc(c.presentacion)}` : ` · ${cant(c.unidades)} ${esc(c.insumos?.unidad || "")}`}</b><span>${peso(c.precio_unit)} por ${esc(c.insumos?.unidad || "")}${c.emergencia ? ` · <b style="display:inline;color:var(--bad)">emergencia${N(c.sobreprecio) ? ", " + peso(c.sobreprecio) + " de más" : ""}</b>` : ""}</span></div>
        <b class="money">${peso(c.total_pagado)}</b></div>`).join("") : `<div class="empty">Todavía no anotaron compras.</div>`}</div>
    </section>
  </div>`;
};

/* ================= MENÚ Y PRECIOS ================= */
VISTAS.menu = () => {
  const t = S.qmenu.trim().toLowerCase();
  const costos = Object.fromEntries(S.data.costos.map(c => [c.id, c]));
  const lista = S.data.productos.filter(p => (S.verOff ? !p.activo : p.activo) && (!t || p.nombre.toLowerCase().includes(t)));
  const cats = [...new Set(lista.map(p => p.categoria))];
  const maxM = Math.max(1, ...lista.map(p => N(costos[p.id]?.margen)));
  return `<div class="top"><div><h1>Menú y precios</h1><p>Cambiá el precio y apretá Enter. El costo se calcula con la receta y el último precio de la mercadería.</p></div>
    <div class="acts"><button class="btn" data-act="veroff">${S.verOff ? "← Volver al menú" : "Ver eliminados"}</button><button class="btn btn-p" data-act="nuevoprod">＋ Nuevo producto</button></div></div>
  <section class="panel">
    <input class="inp" id="qmenu" placeholder="Buscar producto" value="${esc(S.qmenu)}" style="max-width:320px;margin-bottom:8px">
    <div class="tblw"><table><thead><tr><th>Producto</th><th class="r">Se vende a</th><th class="r">Mercadería</th><th class="r">Te queda</th><th style="min-width:90px"></th><th></th></tr></thead><tbody>
    ${cats.map(g => `<tr><td colspan="6" style="background:transparent;border:0;padding-top:16px"><span class="grp">${esc(g)}</span></td></tr>` + lista.filter(p => p.categoria === g).map(p => { const k = costos[p.id] || {};
      return `<tr class="${p.activo ? "" : "off"}"><td><b>${esc(p.nombre)}</b>${k.tiene_receta ? "" : `<br><span style="color:var(--muted);font-size:.8rem">sin receta · costo fijo</span>`}</td>
      <td class="r"><input class="pin money" data-precio="${p.id}" value="${Math.round(N(p.precio))}" inputmode="numeric" aria-label="Precio de ${esc(p.nombre)}" ${p.activo ? "" : "disabled"}></td>
      <td class="r money">${peso(k.costo)}</td><td class="r money"><b>${peso(k.margen)}</b><br><span style="color:var(--muted);font-size:.8rem">${N(k.margen_pct)}%</span></td>
      <td><div class="mbar"><i style="width:${Math.max(4, N(k.margen) / maxM * 100)}%;${N(k.margen_pct) < 55 ? "background:var(--warn)" : ""}"></i></div></td>
      <td class="acts-c">${p.activo ? `<button class="ib" data-editprod="${p.id}" title="Editar" aria-label="Editar">✎</button> <button class="ib del" data-delprod="${p.id}" title="Eliminar" aria-label="Eliminar">🗑</button>` : `<button class="btn btn-sm" data-restprod="${p.id}">Volver a la carta</button>`}</td></tr>`; }).join("")).join("") || `<tr><td colspan="6" class="empty">${S.verOff ? "No hay productos eliminados." : "No hay productos."}</td></tr>`}
    </tbody></table></div>
  </section>`;
};

/* ================= CLIENTES ================= */
VISTAS.clientes = () => {
  const t = S.qc.toLowerCase();
  const list = S.data.clientes.filter(c => (c.nombre + " " + (c.telefono || "") + " " + (c.direccion || "")).toLowerCase().includes(t)).sort((a, b) => N(b.deuda) - N(a.deuda) || a.nombre.localeCompare(b.nombre));
  return `<div class="top"><div><h1>Clientes</h1><p>Los que deben aparecen primero. Tocá "Ver" para la ficha, los comentarios y el historial.</p></div>
    <div class="acts"><button class="btn" data-act="xlscli">⬇ Excel</button><button class="btn btn-p" data-act="nuevocli">＋ Nuevo cliente</button></div></div>
  <section class="panel"><h2 class="panel-h">Lista de clientes <small>${S.data.clientes.length} cargados</small></h2>
    <input class="inp" id="qc" placeholder="Buscar por nombre, teléfono o dirección" value="${esc(S.qc)}">
    <div class="list" style="margin-top:8px">${list.length ? list.map(c => { const ult = (c.cliente_comentarios || [])[0];
      return `<div class="li ${N(c.deuda) > 0 ? "falta" : "ok"}"><span class="dot"></span>
      <div class="grow"><b>${esc(c.nombre)}</b><span>${esc([c.telefono, c.direccion].filter(Boolean).join(" · ") || "Sin datos")}</span>
        ${ult ? `<span style="display:block">💬 ${esc(ult.texto)}${c.cliente_comentarios.length > 1 ? ` <b style="display:inline;color:var(--muted)">(+${c.cliente_comentarios.length - 1})</b>` : ""}</span>` : ""}</div>
      ${N(c.deuda) > 0 ? `<span class="tag money">Debe ${peso(c.deuda)}</span><button class="btn btn-sm" data-cobrar="${c.id}">Cobrar</button>` : N(c.deuda) < 0 ? `<span class="tag good money">A favor ${peso(-c.deuda)}</span>` : `<span class="tag good">Al día</span>`}
      <button class="btn btn-sm" data-vercli="${c.id}">Ver</button><button class="ib del" data-delcli="${c.id}" title="Eliminar" aria-label="Eliminar">🗑</button></div>`; }).join("") : `<div class="empty">No hay clientes con ese nombre.</div>`}</div>
  </section>`;
};

/* ================= REPORTES ================= */
function periodo() {
  const h = hoyYMD(), dow = (new Date(h + "T12:00:00Z").getUTCDay() + 6) % 7, m0 = h.slice(0, 8) + "01";
  switch (S.per) {
    case "hoy": return [h, h];
    case "ayer": return [addDays(h, -1), addDays(h, -1)];
    case "semana": return [addDays(h, -dow), h];
    case "7d": return [addDays(h, -6), h];
    case "mes": return [m0, h];
    case "mespas": { const f = addDays(m0, -1); return [f.slice(0, 8) + "01", f]; }
    default: return [S.desde || m0, S.hasta || h];
  }
}
function cmpTag(a, b, inv) {
  a = N(a); b = N(b);
  if (!b) return a ? `<span class="cmp eq">sin datos para comparar</span>` : "";
  const p = Math.round((a - b) / Math.abs(b) * 100);
  return `<span class="cmp ${p > 0 ? "up" : p < 0 ? "down" : "eq"} ${inv ? "inv" : ""}">${p > 0 ? "▲" : p < 0 ? "▼" : "="} ${Math.abs(p)}% vs. período anterior</span>`;
}
function grafico(dias) {
  if (!dias.length) return "";
  const W = 820, H = 260, L = 64, B = 30, T = 12, R = 10, w = (W - L - R) / dias.length;
  const max = Math.max(1, ...dias.map(d => N(d.vendido)));
  const pot = Math.pow(10, Math.floor(Math.log10(max))), paso = [1, 2, 2.5, 5, 10].map(x => x * pot).find(s => max / s <= 5) || pot * 10;
  const top = Math.ceil(max / paso) * paso, y = v => T + (H - T - B) * (1 - v / top);
  const ticks = []; for (let v = 0; v <= top + 1e-9; v += paso) ticks.push(v);
  const cada = Math.ceil(dias.length / 16);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ventas y ganancia por día">
    ${ticks.map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#e8e4e0"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#77706b">${v >= 1000 ? Math.round(v / 1000) + "k" : v}</text>`).join("")}
    ${dias.map((d, i) => { const x = L + i * w, bw = Math.max(2, w * .62), bx = x + (w - bw) / 2, v = N(d.vendido), g = Math.max(0, N(d.ganancia));
      return `<g><title>${diaYMD(d.fecha)}: vendido ${peso(v)} · ganancia ${peso(d.ganancia)} · ${d.pizzas} pizzas</title>
        <rect x="${bx}" y="${y(v)}" width="${bw}" height="${Math.max(0, y(0) - y(v))}" rx="3" fill="#f2c9bf"/>
        <rect x="${bx}" y="${y(g)}" width="${bw}" height="${Math.max(0, y(0) - y(g))}" rx="3" fill="#e2462b"/>
        ${i % cada === 0 ? `<text x="${x + w / 2}" y="${H - 10}" text-anchor="middle" font-size="11" fill="#77706b">${diaYMD(d.fecha)}</text>` : ""}</g>`; }).join("")}
    <line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" stroke="#77706b"/></svg>
    <div class="legend"><span><i style="background:#f2c9bf"></i>Vendido</span><span><i style="background:#e2462b"></i>Ganancia (vendido − mercadería)</span></div>`;
}
VISTAS.reportes = () => {
  const r = S.extra.rep, a = S.extra.ant, [d, h] = periodo();
  const tk = N(r.comandas) ? N(r.vendido) / N(r.comandas) : 0, tka = N(a.comandas) ? N(a.vendido) / N(a.comandas) : 0;
  const pagos = [["Efectivo", r.efectivo], ["Transferencia", r.transferencia], ["Fiado", r.fiado]], pmax = Math.max(1, ...pagos.map(p => N(p[1])));
  const dias = r.por_dia || [], conVentas = dias.filter(x => N(x.vendido) > 0);
  const mejor = conVentas.slice().sort((x, y) => N(y.vendido) - N(x.vendido))[0];
  return `<div class="top"><div><h1>Reportes</h1><p>${d === h ? diaLargo(d) : `Del ${diaYMD(d)} al ${diaYMD(h)}`} · comparado con el período anterior de la misma cantidad de días</p></div>
    <div class="acts"><button class="btn" data-act="xlsper">⬇ Excel del período</button></div></div>
  <div class="acts" style="margin-bottom:18px">
    <div class="chips">${[["hoy","Hoy"],["ayer","Ayer"],["semana","Esta semana"],["7d","Últimos 7 días"],["mes","Este mes"],["mespas","Mes pasado"],["elegir","Elegir fechas"]].map(([k, l]) => `<button class="chip" data-per="${k}" aria-pressed="${S.per === k}">${l}</button>`).join("")}</div>
    ${S.per === "elegir" ? `<input class="inp" type="date" id="pdesde" value="${d}" max="${hoyYMD()}" style="width:auto"> a <input class="inp" type="date" id="phasta" value="${h}" max="${hoyYMD()}" style="width:auto">` : ""}
  </div>
  <div class="stack">
    <div class="kpis six">
      <div class="kpi brand"><span class="l">Ganancia</span><span class="v money">${peso(r.ganancia)}</span>${cmpTag(r.ganancia, a.ganancia)}</div>
      <div class="kpi"><span class="l">Vendido</span><span class="v money">${peso(r.vendido)}</span>${cmpTag(r.vendido, a.vendido)}</div>
      <div class="kpi"><span class="l">Pizzas vendidas</span><span class="v">${N(r.pizzas)}</span>${cmpTag(r.pizzas, a.pizzas)}</div>
      <div class="kpi"><span class="l">Comandas</span><span class="v">${N(r.comandas)}</span>${cmpTag(r.comandas, a.comandas)}</div>
      <div class="kpi"><span class="l">Ticket promedio</span><span class="v money">${peso(tk)}</span>${cmpTag(tk, tka)}</div>
      <div class="kpi bad"><span class="l">Plata perdida</span><span class="v money">${peso(r.perdidas)}</span>${cmpTag(r.perdidas, a.perdidas, true)}</div>
    </div>
    ${dias.length > 1 ? `<section class="panel chart"><h2 class="panel-h">Día por día <small>${mejor ? `Mejor día: ${diaYMD(mejor.fecha)} con ${peso(mejor.vendido)}` : ""}</small></h2>${grafico(dias)}</section>` : ""}
    <div class="grid2 even">
      <section class="panel"><h2 class="panel-h">Lo más vendido</h2>
        <div class="tblw"><table><thead><tr><th>Producto</th><th class="r">Cantidad</th><th class="r">Vendido</th><th class="r">Ganancia</th></tr></thead><tbody>
        ${(r.top || []).map(p => `<tr><td><b>${esc(p.nombre)}</b></td><td class="r num">${N(p.cantidad)}</td><td class="r money">${peso(p.vendido)}</td><td class="r money">${peso(p.ganancia)}</td></tr>`).join("") || `<tr><td colspan="4" class="empty">Sin ventas en este período.</td></tr>`}
        </tbody></table></div>
      </section>
      <div class="stack">
        <section class="panel"><h2 class="panel-h">Cómo pagaron</h2>
          ${pagos.map(([l, v]) => `<div class="hbar"><span style="font-weight:700">${l}</span><span class="track"><i style="width:${N(v) / pmax * 100}%;${l === "Fiado" ? "background:var(--bad)" : ""}"></i></span><b class="money">${peso(v)}</b></div>`).join("")}
          <p style="margin:10px 0 0;color:var(--muted);font-size:.9rem">Además cobraron ${peso(r.cobrado_deudas)} de deudas viejas.</p>
        </section>
        ${(S.extra.sab || []).length ? `<section class="panel"><h2 class="panel-h">Empanadas por sabor <small>${(S.extra.sab || []).reduce((a, x) => a + N(x.cantidad), 0)} empanadas</small></h2>
          ${(() => { const m = Math.max(1, ...S.extra.sab.map(x => N(x.cantidad))); return S.extra.sab.map(x => `<div class="hbar"><span style="font-weight:700">${esc(x.sabor)}</span><span class="track"><i style="width:${N(x.cantidad) / m * 100}%"></i></span><b>${N(x.cantidad)}</b></div>`).join(""); })()}</section>` : ""}
        <section class="panel"><h2 class="panel-h">Delivery y mostrador</h2>
          <div class="lines" style="font-size:1rem;gap:6px"><div><span>🛵 Delivery</span><b>${N(r.delivery)} comandas</b></div><div><span>🏪 Mostrador</span><b>${N(r.mostrador)} comandas</b></div>
          <div style="border-top:1px solid var(--line);padding-top:6px"><span>Mercadería usada</span><b class="money">${peso(r.costo)}</b></div></div>
        </section>
      </div>
    </div>
  </div>`;
};

/* ================= CIERRE DE CAJA ================= */
VISTAS.caja = () => {
  const {resumen: r, cierre} = S.data, prev = S.extra.cierres || [];
  return `<div class="top"><div><h1>Cierre de caja</h1><p>Al final del día, cuenten el efectivo y anótenlo acá.</p></div></div>
  <div class="grid2">
    <section class="panel"><h2 class="panel-h">Hoy</h2>
      <div class="lines" style="font-size:1.05rem;gap:8px">
        <div><span>Comandas</span><b>${r.comandas}</b></div>
        <div><span>Total vendido</span><b class="money">${peso(r.vendido)}</b></div>
        <div><span>Cobrado por transferencia</span><b class="money">${peso(r.transferencia)}</b></div>
        <div><span>Quedó fiado hoy</span><b class="money" style="color:var(--bad)">${peso(r.fiado_hoy)}</b></div>
        <div style="border-top:1px solid var(--line);padding-top:8px"><span><b>Tendría que haber en efectivo</b></span><b class="money" style="font-size:1.4rem">${peso(r.efectivo)}</b></div>
      </div>
    </section>
    <section class="panel"><h2 class="panel-h">Contar la plata</h2>
      ${cierre ? `<div class="${Math.abs(N(cierre.diferencia)) < 1 ? "okbox" : "warnbox"}" style="margin-bottom:12px">Caja cerrada a las ${hora(cierre.creado)}: contaron ${peso(cierre.efectivo_contado)}. ${Math.abs(N(cierre.diferencia)) < 1 ? "Está justo ✅" : N(cierre.diferencia) < 0 ? `Faltan ${peso(-cierre.diferencia)}` : `Sobran ${peso(cierre.diferencia)}`}</div>` : ""}
      <label class="field">¿Cuánto efectivo hay en la caja?<input class="inp" id="contado" inputmode="numeric" placeholder="$" style="font-size:1.4rem;padding:14px"></label>
      <label class="field" style="margin-top:8px">Nota (opcional)<input class="inp" id="cnota"></label>
      <button class="btn btn-p btn-big" style="margin-top:12px" data-act="cerrar">${cierre ? "Volver a cerrar" : "Cerrar caja"}</button>
    </section>
  </div>
  <section class="panel" style="margin-top:20px"><h2 class="panel-h">Cierres anteriores</h2>
    <div class="tblw"><table><thead><tr><th>Día</th><th class="r">Tendría que haber</th><th class="r">Contaron</th><th class="r">Diferencia</th><th class="r">Transferencias</th><th>Nota</th></tr></thead><tbody>
    ${prev.map(c => `<tr><td><b>${diaYMD(c.fecha)}</b></td><td class="r money">${peso(c.efectivo_esperado)}</td><td class="r money">${peso(c.efectivo_contado)}</td>
      <td class="r money" style="font-weight:800;color:${Math.abs(N(c.diferencia)) < 1 ? "var(--good)" : "var(--bad)"}">${Math.abs(N(c.diferencia)) < 1 ? "Justo" : peso(c.diferencia)}</td><td class="r money">${peso(c.transferencias)}</td><td>${esc(c.nota || "")}</td></tr>`).join("") || `<tr><td colspan="6" class="empty">Todavía no cerraron ninguna caja.</td></tr>`}
    </tbody></table></div>
  </section>`;
};

/* ================= HISTORIAL DE CAMBIOS (admin) ================= */
const TAB = {productos: "producto", insumos: "mercadería", presentaciones: "presentación", recetas: "receta", clientes: "cliente", comandas: "comanda", compras: "compra",
  perdidas: "pérdida", movimientos_deuda: "deuda", cierres_caja: "cierre de caja", cliente_comentarios: "comentario"};
const ACC = {INSERT: "Agregó", UPDATE: "Modificó", DELETE: "Borró", CORRECCION: "Corrigió a mano"};
const OCULTAR = new Set(["id", "creado", "editada", "fecha", "subtotal", "costo", "costo_unit", "deuda", "orden"]);
function fmtV(k, v) { if (v === null || v === undefined || v === "") return "—"; if (typeof v === "boolean") return v ? "sí" : "no"; if (/precio|total|monto|deuda|descuento|costo|efectivo|diferencia|transfer|sobreprecio/.test(k) && !isNaN(v)) return peso(v); return String(v); }
function nombreDe(l) {
  const x = {...(l.antes || {}), ...(l.despues || {})};
  if (l.tabla === "comandas" && x.nro) return "#" + x.nro;
  if (l.tabla === "recetas") return pr(x.producto_id)?.nombre || "";
  if (l.tabla === "presentaciones" || l.tabla === "compras") return (x.nombre || "") + " " + (ins(x.insumo_id)?.nombre || "");
  if (l.tabla === "movimientos_deuda" || l.tabla === "cliente_comentarios") return cl(x.cliente_id)?.nombre || "";
  return x.nombre || x.descripcion || (l.tabla === "productos" && pr(l.registro)?.nombre) || (l.tabla === "insumos" && ins(l.registro)?.nombre) || (l.tabla === "clientes" && cl(l.registro)?.nombre) || "";
}
function detalleLog(l) {
  if (l.accion === "UPDATE" || l.accion === "CORRECCION") {
    if (l.tabla === "comandas" && l.despues?.estado === "anulada") return `La eliminó. Motivo: ${esc(l.despues.motivo_anulacion || "")}`;
    if (l.tabla === "productos" && l.despues?.activo === false) return "La sacó de la carta";
    if ((l.tabla === "insumos" || l.tabla === "clientes") && l.despues?.activo === false) return "Lo eliminó";
    return Object.keys(l.despues || {}).filter(k => !OCULTAR.has(k) && k !== "nombre" || (k === "nombre" && l.antes?.nombre)).map(k => `${esc(k.replace(/_/g, " "))}: ${esc(fmtV(k, l.antes?.[k]))} → <b>${esc(fmtV(k, l.despues[k]))}</b>`).join(" · ");
  }
  const x = l.despues || l.antes || {};
  if (l.tabla === "comandas") return `${fmtV("total", x.total)} · ${x.pago} · ${x.tipo}${x.cliente_nombre ? " · " + esc(x.cliente_nombre) : ""}`;
  if (l.tabla === "movimientos_deuda") return `${N(x.monto) > 0 ? "Fió" : "Pagó"} ${peso(Math.abs(N(x.monto)))}${x.nota ? " · " + esc(x.nota) : ""}`;
  if (l.tabla === "compras") return `${peso(x.total_pagado)}${x.emergencia ? " · emergencia" : ""}`;
  if (l.tabla === "perdidas") return peso(x.monto);
  if (l.tabla === "cliente_comentarios") return `"${esc(x.texto)}"`;
  if (l.tabla === "recetas") return `${esc(ins(x.insumo_id)?.nombre || "")}: ${cant(x.cantidad)}`;
  if (l.tabla === "productos") return `${esc(x.categoria || "")} · ${fmtV("precio", x.precio)}`;
  if (l.tabla === "cierres_caja") return `contaron ${peso(x.efectivo_contado)} · diferencia ${peso(x.diferencia)}`;
  return "";
}
VISTAS.historial = () => {
  if (!esAdmin()) return `<div class="empty">Solo administración puede ver el historial.</div>`;
  const log = S.extra.log || [];
  return `<div class="top"><div><h1>Historial de cambios</h1><p>Todo lo que se cargó, se cambió o se eliminó, con quién y cuándo. Solo lo ve administración.</p></div>
    <div class="acts"><select class="inp" id="htab" style="width:auto"><option value="">Todo</option>${Object.entries(TAB).map(([k, v]) => `<option value="${k}" ${S.htab === k ? "selected" : ""}>${v[0].toUpperCase() + v.slice(1)}</option>`).join("")}</select>
    <input class="inp" type="date" id="hdesde" value="${S.hdesde || ""}" max="${hoyYMD()}" style="width:auto">${S.hdesde ? `<button class="btn btn-sm" data-act="hlimpiar">Todos los días</button>` : ""}</div></div>
  <section class="panel log"><div class="list">${log.length ? log.map(l => `<div class="li"><span class="num" style="color:var(--muted);font-weight:700;min-width:92px">${dia(l.fecha)} ${hora(l.fecha)}</span>
    <div class="grow"><b>${ACC[l.accion] || l.accion} ${TAB[l.tabla] || l.tabla} ${esc(nombreDe(l))}</b><span class="ch">${detalleLog(l)}</span></div>
    <span class="tag gray">${esc((l.usuario || "").split("@")[0])}</span></div>`).join("") : `<div class="empty">No hay cambios registrados con ese filtro.</div>`}</div>
    ${log.length === 200 ? `<p style="color:var(--muted);font-size:.88rem">Se muestran los últimos 200. Elegí un día para ver más.</p>` : ""}</section>`;
};

/* ================= EVENTOS ================= */
function bind() {
  const b = $("#busca");
  if (b) b.oninput = e => { D.busca = e.target.value; $("#sug").innerHTML = sugHTML(); if (!/\d{3}/.test(D.busca)) { D.nombre = D.busca; const n = $("#f-nombre"); if (n) n.value = D.busca; } };
  [["f-nombre","nombre"],["f-dir","dir"],["f-tel","tel"],["f-nota","nota"]].forEach(([id, k]) => { const el = $("#" + id); if (el) el.oninput = e => D[k] = e.target.value; });
  const d = $("#f-desc"); if (d) d.onchange = e => { D.desc = soloNum(e.target.value); render(false); };
  $$("[data-precio]").forEach(el => el.onchange = async e => {
    const v = soloNum(e.target.value); if (!v) return render(false);
    try { await q(sb.rpc("cambiar_precio", {p_producto: +el.dataset.precio, p_precio: v})); toast("Precio actualizado"); render(); } catch (er) { fail(er); }
  });
  vivo("#qc", v => S.qc = v); vivo("#qcmd", v => S.qcmd = v); vivo("#qmenu", v => S.qmenu = v); vivo("#qprod", v => D.qprod = v);
  const dc = $("#diacmd"); if (dc) dc.onchange = e => { if (e.target.value) { S.diaCmd = e.target.value; ir("comandas"); } };
  const pd = $("#pdesde"), ph = $("#phasta");
  if (pd) pd.onchange = ph.onchange = () => { if (pd.value && ph.value) { if (ph.value < pd.value) return toast("La fecha final tiene que ser después de la inicial", true); S.desde = pd.value; S.hasta = ph.value; ir("reportes"); } };
  const ht = $("#htab"); if (ht) ht.onchange = e => { S.htab = e.target.value; ir("historial"); };
  const hd = $("#hdesde"); if (hd) hd.onchange = e => { S.hdesde = e.target.value || null; ir("historial"); };
}
function vivo(sel, set) {
  const el = $(sel); if (!el) return;
  el.oninput = e => { set(e.target.value); const pos = e.target.selectionStart; marco(VISTAS[S.tab]()); bind(); const n = $(sel); n.focus(); n.setSelectionRange(pos, pos); };
}
document.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && e.target.matches?.(".prod")) { e.preventDefault(); e.target.click(); } });
document.addEventListener("click", async e => {
  if (e.target.closest("#modal")) return;
  const t = e.target.closest("button,.prod"); if (!t || !$("#root").contains(t)) return;
  const ds = t.dataset, cmdDe = id => [...(S.extra.comandas || []), ...S.data.comandas].find(x => x.id == id);
  if (ds.tab) { if (ds.tab === "comandas") S.diaCmd = S.diaCmd || hoyYMD(); return ir(ds.tab); }
  if (ds.go) return ir(ds.go);
  if (ds.act === "salir") return sb.auth.signOut();
  if (ds.act === "config") return window.bacanoApp?.abrirConfiguracion();
  if (ds.act === "recargar") { await render(); return toast("Actualizado"); }
  if (ds.act === "nueva") { if (!D.editId) return ir("comanda"); newDraft(); return ir("comanda"); }
  if (ds.act === "canceledit") { newDraft(); return ir("comandas"); }
  if (ds.qd) { const id = t.closest(".prod").dataset.p; D.q[id] = (D.q[id] || 0) + +ds.qd; if (D.q[id] <= 0) { delete D.q[id]; delete D.sab[id]; } return render(false); }
  if (ds.p) { if (D.q[ds.p]) { delete D.q[ds.p]; delete D.sab[ds.p]; } else D.q[ds.p] = 1; return render(false); }
  if (ds.sab) { const o = D.sab[ds.sab] = D.sab[ds.sab] || {}; o[ds.sb] = Math.max(0, (o[ds.sb] || 0) + +ds.sd); return render(false); }
  if (ds.saball) { const o = D.sab[ds.saball] = D.sab[ds.saball] || {}, f = faltan(ds.saball); if (f > 0) o[ds.sb] = (o[ds.sb] || 0) + f; return render(false); }
  if (ds.cli) { const c = cl(ds.cli); Object.assign(D, {cli: c.id, nombre: c.nombre, dir: c.direccion || "", tel: c.telefono || "", busca: ""}); return render(false); }
  if (ds.act === "quitarcli") { Object.assign(D, {cli: null, nombre: "", dir: "", tel: ""}); return render(false); }
  if (ds.tipo) { D.tipo = ds.tipo; return render(false); }
  if (ds.pago) { D.pago = ds.pago; return render(false); }
  if (ds.delx) { D.extra.splice(+ds.delx, 1); return render(false); }
  if (ds.act === "extra") { const n = $("#xn").value.trim(), p = soloNum($("#xp").value); if (!n) return toast("Escribí qué es", true); D.extra.push({n, p}); return render(false); }
  if (ds.act === "guardar") return guardar();
  if (ds.reimp) { const c = cmdDe(ds.reimp); if (c) imprimir(c); return; }
  if (ds.editcmd) { const c = cmdDe(ds.editcmd); if (c) editarComanda(c); return; }
  if (ds.delcmd) return delCmdModal(cmdDe(ds.delcmd));
  if (ds.diacmd) { S.diaCmd = addDays(S.diaCmd || hoyYMD(), +ds.diacmd); return ir("comandas"); }
  if (ds.fcmd) { S.fcmd = ds.fcmd; return render(false); }
  if (ds.act === "xlsdia") return xlsComandas(S.extra.comandas || [], `comandas-${S.diaCmd || hoyYMD()}.csv`);
  if (ds.act === "xlsper") { const [d, h] = periodo(); try { const c = await q(sb.from("comandas").select("*, comanda_items(*)").gte("fecha", ini(d)).lt("fecha", ini(addDays(h, 1))).order("fecha")); xlsComandas(c, `bacano-${d}-al-${h}.csv`); } catch (er) { fail(er); } return; }
  if (ds.act === "xlscli") return bajar("clientes-bacano.csv", [["Nombre","Teléfono","Dirección","Debe","Notas","Comentarios"], ...S.data.clientes.map(c => [c.nombre, c.telefono, c.direccion, numXL(c.deuda), c.notas, (c.cliente_comentarios || []).map(x => x.texto).join(" | ")])]);
  if (ds.per) { S.per = ds.per; return ir("reportes"); }
  if (ds.pack) { const [i, p] = ds.pack.split(":"); return compraModal(+i, +p); }
  if (ds.act === "compra") return compraModal(activos(S.data.insumos)[0]?.id, null);
  if (ds.act === "tiro") return tiroModal();
  if (ds.act === "nuevoins") return insumoModal(null);
  if (ds.editins) return insumoModal(+ds.editins);
  if (ds.delins) return confirmar(`¿Eliminar ${esc(ins(ds.delins).nombre)}?`, "Deja de aparecer en la cocina. Las compras viejas quedan guardadas." + (enRecetas(+ds.delins) ? `<br><b style="color:var(--bad)">Ojo: lo usan ${enRecetas(+ds.delins)} recetas. Las pizzas lo van a seguir descontando hasta que cambies la receta.</b>` : ""), "Eliminar", () => q(sb.from("insumos").update({activo: false}).eq("id", +ds.delins)), "Mercadería eliminada");
  if (ds.cobrar) return cobrarModal(+ds.cobrar);
  if (ds.act === "nuevocli") return clienteModal(null);
  if (ds.vercli) return clienteModal(+ds.vercli);
  if (ds.delcli) { const c = cl(ds.delcli); if (N(c.deuda) > 0) return toast(`No se puede eliminar: ${c.nombre} debe ${peso(c.deuda)}`, true);
    return confirmar(`¿Eliminar a ${esc(c.nombre)}?`, "Deja de aparecer en la lista. Sus comandas viejas quedan guardadas.", "Eliminar", () => q(sb.rpc("eliminar_cliente", {p_id: c.id})), "Cliente eliminado"); }
  if (ds.act === "nuevoprod") return productoModal(null);
  if (ds.editprod) return productoModal(+ds.editprod);
  if (ds.delprod) return confirmar(`¿Sacar ${esc(pr(ds.delprod).nombre)} de la carta?`, "Deja de aparecer para tomar comandas. Las ventas viejas quedan guardadas y lo podés volver a poner desde \"Ver eliminados\".", "Sacar de la carta", () => q(sb.from("productos").update({activo: false}).eq("id", +ds.delprod)), "Producto eliminado");
  if (ds.restprod) { try { await q(sb.from("productos").update({activo: true}).eq("id", +ds.restprod)); toast("Volvió a la carta"); render(); } catch (er) { fail(er); } return; }
  if (ds.act === "veroff") { S.verOff = !S.verOff; return render(false); }
  if (ds.act === "hlimpiar") { S.hdesde = null; return ir("historial"); }
  if (ds.act === "cerrar") {
    const v = $("#contado").value.trim(); if (v === "") return toast("Escribí cuánto efectivo hay", true);
    try { await q(sb.rpc("cerrar_caja", {p_contado: soloNum(v), p_nota: $("#cnota").value || null})); toast("Caja cerrada"); render(); } catch (er) { fail(er); }
  }
});
const enRecetas = insId => S.data.recetas.filter(r => r.insumo_id == insId && pr(r.producto_id)?.activo).length;
function xlsComandas(lista, nombre) {
  bajar(nombre, [["Fecha","Hora","Comanda","Estado","Cliente","Dirección","Teléfono","Tipo","Pago","Detalle","Descuento","Total","Mercadería","Ganancia","Nota"],
    ...lista.map(c => [dia(c.fecha), hora(c.fecha), c.nro, c.estado === "anulada" ? "Eliminada: " + (c.motivo_anulacion || "") : c.editada ? "Corregida" : "OK", c.cliente_nombre, c.direccion, c.telefono, c.tipo, c.pago,
      vivos(c).map(i => `${i.cantidad} ${i.nombre}${i.sabores ? " (" + sabTxt(i.sabores) + ")" : ""}`).join(", "), numXL(c.descuento), numXL(c.total), numXL(c.costo), numXL(N(c.total) - N(c.costo)), c.nota])]);
  toast("Se descargó el archivo para Excel");
}

/* ================= VENTANAS ================= */
function openModal(html, bindFn, wide) {
  $("#modal").innerHTML = `<div class="modal"><div class="sheet ${wide ? "wide" : ""}" role="dialog" aria-modal="true">${html}</div></div>`;
  $("#modal .modal").onclick = e => { if (e.target.classList.contains("modal") || e.target.closest("[data-close]")) closeModal(); };
  bindFn && bindFn();
  $("#modal input:not([type=hidden]), #modal select, #modal textarea")?.focus();
}
function closeModal() { $("#modal").innerHTML = ""; }
async function accion(btn, fn, okMsg, cerrar = true) {
  btn.disabled = true;
  try { await fn(); if (cerrar) closeModal(); if (okMsg) toast(okMsg); await render(); return true; } catch (e) { btn.disabled = false; fail(e); return false; }
}
function confirmar(titulo, texto, boton, fn, okMsg) {
  openModal(`<h3>${titulo}</h3><p style="margin:0">${texto}</p><div class="two"><button class="btn" data-close>No</button><button class="btn btn-bad" id="cf-ok">${boton}</button></div>`,
    () => { $("#cf-ok").onclick = e => accion(e.currentTarget, fn, okMsg); });
}
function delCmdModal(c) {
  if (!c) return;
  openModal(`<h3>¿Eliminar la comanda #${c.nro}?</h3><p style="margin:0">Se devuelve la mercadería a la cocina${c.pago === "fiado" ? " y se le descuenta la deuda al cliente" : ""}. Queda guardada como eliminada.</p>
  <label class="field">¿Por qué se elimina?<input class="inp" id="dm-m" placeholder="Se canceló, se cargó dos veces…"></label>
  <div class="chips">${["Cancelaron el pedido", "Se cargó dos veces", "Error al cargar"].map(m => `<button class="chip" data-mot="${m}">${m}</button>`).join("")}</div>
  <div class="two"><button class="btn" data-close>No</button><button class="btn btn-bad" id="dm-ok">Eliminar comanda</button></div>`, () => {
    $$("#modal [data-mot]").forEach(b => b.onclick = () => { $("#dm-m").value = b.dataset.mot; });
    $("#dm-ok").onclick = e => { const m = $("#dm-m").value.trim(); if (!m) return toast("Escribí por qué se elimina", true);
      accion(e.currentTarget, async () => { await q(sb.rpc("eliminar_comanda", {p_id: c.id, p_motivo: m})); if (D.editId === c.id) newDraft(); }, `Comanda #${c.nro} eliminada`); };
  });
}

function compraModal(insId, presId) {
  const lista = activos(S.data.insumos);
  openModal(`<h3>Anotar compra</h3>
  <label class="field">¿Qué compraron?<select class="inp" id="m-ing">${lista.map(i => `<option value="${i.id}" ${i.id == insId ? "selected" : ""}>${esc(i.nombre)}</option>`).join("")}</select></label>
  <label class="field">¿En qué presentación?<select class="inp" id="m-pack"></select></label>
  <div class="two"><label class="field">¿Cuántas?<input class="inp" id="m-cant" value="1" inputmode="decimal"></label><label class="field">¿Cuánto pagaron en total?<input class="inp" id="m-tot" inputmode="numeric" placeholder="$"></label></div>
  <div id="m-info" class="lines"></div>
  <div class="seg"><button id="m-emer" aria-pressed="false" class="fiado"><span class="ic">🚨</span>Fue de emergencia</button></div>
  <p style="margin:0;color:var(--muted);font-size:.88rem">Marcalo si compraron apurados y más caro de lo normal. Esa diferencia se suma a "Plata perdida".</p>
  <div class="two"><button class="btn" data-close>Cancelar</button><button class="btn btn-p" id="m-ok">Guardar compra</button></div>`, () => {
    const sel = $("#m-ing"), pk = $("#m-pack"), cn = $("#m-cant"), tot = $("#m-tot"), info = $("#m-info"); let emer = false;
    const unidades = () => { const i = ins(sel.value), p = i.presentaciones.find(x => x.id == pk.value); return (p ? N(p.cantidad) : 1) * soloDec(cn.value); };
    const calc = () => { const i = ins(sel.value), u = unidades(), pago = soloNum(tot.value), normal = N(i.precio_referencia) * u;
      info.innerHTML = `<div><span>Suma a la cocina</span><b>${cant(u)} ${esc(i.unidad)}</b></div><div><span>Precio normal</span><span class="money">${peso(normal)}</span></div>` +
        (pago && emer && pago > normal ? `<div style="color:var(--bad);font-weight:800"><span>Pagaron de más</span><span class="money">${peso(pago - normal)}</span></div>` : "") +
        (pago && !emer && normal && pago > normal * 1.02 ? `<div style="color:var(--warn);font-weight:700"><span>Aumentó ${Math.round((pago / normal - 1) * 100)}%. Se actualiza el costo de las pizzas.</span></div>` : ""); };
    const fill = sid => { const i = ins(sel.value); pk.innerHTML = i.presentaciones.map(p => `<option value="${p.id}" ${p.id == sid ? "selected" : ""}>${esc(p.nombre)}</option>`).join("") + `<option value="" ${!i.presentaciones.length ? "selected" : ""}>Suelto (en ${esc(i.unidad)})</option>`; calc(); };
    sel.onchange = () => fill(null); pk.onchange = calc; cn.oninput = calc; tot.oninput = calc;
    $("#m-emer").onclick = e => { emer = !emer; e.currentTarget.setAttribute("aria-pressed", emer); calc(); };
    $("#m-ok").onclick = e => { const c = soloDec(cn.value), p = soloNum(tot.value); if (!c || !p) return toast("Completá cantidad y precio", true);
      accion(e.currentTarget, () => q(sb.rpc("registrar_compra", {p_insumo: +sel.value, p_presentacion: pk.value ? +pk.value : null, p_cantidad: c, p_total: p, p_emergencia: emer})), "Compra anotada"); };
    fill(presId);
  });
}
function tiroModal() {
  const prods = S.data.productos.filter(p => p.activo), lista = activos(S.data.insumos);
  openModal(`<h3>Se tiró o se perdió algo</h3>
  <label class="field">¿Qué fue?<select class="inp" id="t-q"><optgroup label="Productos">${prods.map(p => `<option value="p:${p.id}">${esc(p.nombre)}</option>`).join("")}</optgroup><optgroup label="Mercadería">${lista.map(i => `<option value="i:${i.id}">${esc(i.nombre)} (${esc(i.unidad)})</option>`).join("")}</optgroup></select></label>
  <div class="two"><label class="field">¿Cuánto?<input class="inp" id="t-c" value="1" inputmode="decimal"></label><label class="field">¿Por qué? (opcional)<input class="inp" id="t-n" placeholder="Se quemó, venció…"></label></div>
  <div class="two"><button class="btn" data-close>Cancelar</button><button class="btn btn-bad" id="t-ok">Anotar pérdida</button></div>`, () => {
    $("#t-ok").onclick = e => { const [k, id] = $("#t-q").value.split(":"), c = soloDec($("#t-c").value); if (!c) return toast("Poné una cantidad", true);
      accion(e.currentTarget, () => q(sb.rpc("registrar_perdida", {p_producto: k === "p" ? +id : null, p_insumo: k === "i" ? +id : null, p_cantidad: c, p_nota: $("#t-n").value || null})), "Pérdida anotada"); };
  });
}
function cobrarModal(id) {
  const c = cl(id);
  openModal(`<h3>Cobrar a ${esc(c.nombre)}</h3><div class="warnbox">Debe ${peso(c.deuda)}</div>
  <label class="field">¿Cuánto pagó?<input class="inp" id="c-m" value="${Math.round(N(c.deuda))}" inputmode="numeric"></label>
  <div class="seg"><button data-m="efectivo" aria-pressed="true"><span class="ic">💵</span>Efectivo</button><button data-m="transferencia" aria-pressed="false"><span class="ic">📱</span>Transferencia</button></div>
  <div class="two"><button class="btn" data-close>Cancelar</button><button class="btn btn-p" id="c-ok">Cobrar</button></div>`, () => {
    let medio = "efectivo";
    $$("#modal [data-m]").forEach(b => b.onclick = () => { medio = b.dataset.m; $$("#modal [data-m]").forEach(x => x.setAttribute("aria-pressed", x === b)); });
    $("#c-ok").onclick = e => { const m = soloNum($("#c-m").value); if (!m) return toast("Escribí cuánto pagó", true);
      accion(e.currentTarget, () => q(sb.rpc("cobrar_deuda", {p_cliente: id, p_monto: m, p_medio: medio})), m >= N(c.deuda) ? `${c.nombre.split(" ")[0]} quedó al día ✅` : `Le quedan ${peso(N(c.deuda) - m)}`); };
  });
}
async function clienteModal(id) {
  const c = id ? cl(id) : {nombre: "", telefono: "", direccion: "", notas: "", cliente_comentarios: []};
  let movs = [], cmds = [];
  if (id) { try { [movs, cmds] = await Promise.all([
    q(sb.from("movimientos_deuda").select("*").eq("cliente_id", id).order("fecha", {ascending: false}).limit(15)),
    q(sb.from("comandas").select("*, comanda_items(*)").eq("cliente_id", id).order("fecha", {ascending: false}).limit(15))]); } catch (e) { fail(e); } }
  const act = cmds.filter(x => x.estado === "activa"), gastado = act.reduce((a, x) => a + N(x.total), 0);
  openModal(`<div class="acts" style="justify-content:space-between"><h3>${id ? esc(c.nombre) : "Nuevo cliente"}</h3>${id ? `<span class="acts">${N(c.deuda) > 0 ? `<span class="tag money">Debe ${peso(c.deuda)}</span>` : `<span class="tag good">Al día</span>`}</span>` : ""}</div>
  <div class="sec">
    <label class="field">Nombre<input class="inp" id="k-n" value="${esc(c.nombre)}"></label>
    <div class="two"><label class="field">Teléfono<input class="inp" id="k-t" value="${esc(c.telefono || "")}" inputmode="tel"></label><label class="field">Dirección<input class="inp" id="k-d" value="${esc(c.direccion || "")}"></label></div>
    <label class="field">Dato fijo (aparece al tomar la comanda)<input class="inp" id="k-o" value="${esc(c.notas || "")}" placeholder="Timbre B, entre calles, perro…"></label>
    <div class="acts" style="justify-content:flex-end">${id ? `${N(c.deuda) > 0 ? `<button class="btn" id="k-cob">Cobrar deuda</button>` : ""}<button class="btn" id="k-del" style="color:var(--bad)">Eliminar cliente</button>` : `<button class="btn" data-close>Cancelar</button>`}<button class="btn btn-p" id="k-ok">Guardar datos</button></div>
  </div>
  ${id ? `
  <h4>Comentarios</h4>
  <div class="two" style="grid-template-columns:1fr auto"><input class="inp" id="k-cm" placeholder="Ej: siempre pide sin aceitunas, paga con billete grande…"><button class="btn btn-p" id="k-cma">Agregar</button></div>
  <div class="cm">${(c.cliente_comentarios || []).map(x => `<div class="cmi"><div class="grow">${esc(x.texto)}<small>${dia(x.fecha)} ${hora(x.fecha)} · ${esc((x.autor || "").split("@")[0])}</small></div><button class="ib del" data-delcm="${x.id}" aria-label="Borrar comentario">🗑</button></div>`).join("") || `<div class="empty" style="padding:4px 0">Sin comentarios todavía.</div>`}</div>
  <h4>Pedidos <small style="color:var(--muted);font-weight:600">${pl(act.length, "pedido")} · ${peso(gastado)} en total (últimos 15)</small></h4>
  <div class="lines">${cmds.length ? cmds.map(x => `<div><span>${dia(x.fecha)} · #${x.nro} · ${vivos(x).map(i => `${i.cantidad} ${esc(i.nombre)}`).join(", ")}${x.estado === "anulada" ? " <b style='color:var(--bad)'>(eliminada)</b>" : ""}</span><span class="money" style="white-space:nowrap">${peso(x.total)}${x.pago === "fiado" ? " · fiado" : ""}</span></div>`).join("") : `<div class="x">Sin pedidos</div>`}</div>
  <h4>Movimientos de deuda</h4>
  <div class="lines">${movs.length ? movs.map(m => `<div><span>${dia(m.fecha)} · ${esc(m.nota || "")}${m.medio ? " (" + m.medio + ")" : ""}</span><span class="money" style="color:${N(m.monto) > 0 ? "var(--bad)" : "var(--good)"}">${N(m.monto) > 0 ? "+" : ""}${peso(m.monto)}</span></div>`).join("") : `<div class="x">Nunca fió</div>`}</div>` : ""}`, () => {
    $("#k-ok").onclick = e => { const v = {nombre: $("#k-n").value.trim(), telefono: $("#k-t").value.trim() || null, direccion: $("#k-d").value.trim() || null, notas: $("#k-o").value.trim() || null};
      if (!v.nombre) return toast("Escribí el nombre", true);
      accion(e.currentTarget, () => q(id ? sb.from("clientes").update(v).eq("id", id) : sb.from("clientes").insert(v)), "Cliente guardado"); };
    if (!id) return;
    $("#k-cma").onclick = async e => { const tx = $("#k-cm").value.trim(); if (!tx) return toast("Escribí el comentario", true);
      if (await accion(e.currentTarget, () => q(sb.from("cliente_comentarios").insert({cliente_id: id, texto: tx})), "Comentario guardado", false)) clienteModal(id); };
    $$("#modal [data-delcm]").forEach(b => b.onclick = async () => { if (await accion(b, () => q(sb.from("cliente_comentarios").delete().eq("id", +b.dataset.delcm)), "Comentario borrado", false)) clienteModal(id); });
    $("#k-cm").onkeydown = e => { if (e.key === "Enter") $("#k-cma").click(); };
    const cob = $("#k-cob"); if (cob) cob.onclick = () => cobrarModal(id);
    $("#k-del").onclick = () => { if (N(c.deuda) > 0) return toast(`No se puede eliminar: debe ${peso(c.deuda)}`, true);
      confirmar(`¿Eliminar a ${esc(c.nombre)}?`, "Deja de aparecer en la lista. Sus comandas viejas quedan guardadas.", "Eliminar", () => q(sb.rpc("eliminar_cliente", {p_id: id})), "Cliente eliminado"); };
  }, true);
}
function insumoModal(id) {
  const i = id ? ins(id) : {nombre: "", unidad: "kg", minimo: 0, stock: 0, precio_actual: 0, presentaciones: []};
  let pres = i.presentaciones.map(p => ({id: p.id, nombre: p.nombre, cantidad: N(p.cantidad)}));
  const presHTML = () => pres.map((p, k) => `<div class="rrow" style="grid-template-columns:minmax(0,1fr) 110px 34px"><input class="inp" data-pn="${k}" value="${esc(p.nombre)}" placeholder="Ej: Bolsa 25 kg"><input class="inp" data-pc="${k}" value="${p.cantidad ? cant(p.cantidad) : ""}" placeholder="Cuánto trae" inputmode="decimal"><button class="ib del" data-pdel="${k}" aria-label="Quitar">✕</button></div>`).join("");
  openModal(`<h3>${id ? "Editar " + esc(i.nombre) : "Nueva mercadería"}</h3>
  <div class="sec">
    <div class="two"><label class="field">Nombre<input class="inp" id="i-n" value="${esc(i.nombre)}" placeholder="Ej: Orégano"></label><label class="field">Se mide en<input class="inp" id="i-u" value="${esc(i.unidad)}" list="unidades"><datalist id="unidades"><option>kg</option><option>unid.</option><option>latas</option><option>frascos</option><option>litros</option><option>paquetes</option></datalist></label></div>
    <label class="field">Avisar cuando queden menos de…<input class="inp" id="i-m" value="${cant(i.minimo)}" inputmode="decimal"></label>
    ${id ? "" : `<div class="two"><label class="field">Cuánto hay ahora<input class="inp" id="i-s" value="0" inputmode="decimal"></label><label class="field">Precio por unidad ($)<input class="inp" id="i-p" inputmode="numeric" placeholder="Ej: 900 por kg"></label></div>`}
  </div>
  <h4>Cómo lo compran <small style="color:var(--muted);font-weight:600">aparecen como botones rápidos</small></h4>
  <div class="stack" style="gap:6px" id="i-pres">${presHTML()}</div>
  <button class="btn btn-sm" id="i-padd" style="align-self:flex-start">＋ Agregar presentación</button>
  ${id ? `<h4>Corregir a mano</h4><div class="sec"><p style="margin:0;color:var(--muted);font-size:.88rem">Solo para arreglar errores. Para compras usá "Anotar compra". Queda registrado en el historial.</p>
    <div class="two"><label class="field">Cantidad real (${esc(i.unidad)})<input class="inp" id="i-s" value="${cant(i.stock)}" inputmode="decimal"></label><label class="field">Precio por ${esc(i.unidad)} ($)<input class="inp" id="i-p" value="${Math.round(N(i.precio_actual))}" inputmode="numeric"></label></div></div>` : ""}
  <div class="two"><button class="btn" data-close>Cancelar</button><button class="btn btn-p" id="i-ok">Guardar</button></div>`, () => {
    const leer = () => $$("#i-pres .rrow").forEach((r, k) => { pres[k].nombre = r.querySelector("[data-pn]").value; pres[k].cantidad = soloDec(r.querySelector("[data-pc]").value); });
    const pintar = () => { $("#i-pres").innerHTML = presHTML(); $$("#modal [data-pdel]").forEach(b => b.onclick = () => { leer(); pres.splice(+b.dataset.pdel, 1); pintar(); }); };
    pintar();
    $("#i-padd").onclick = () => { leer(); pres.push({nombre: "", cantidad: 0}); pintar(); $$("#i-pres [data-pn]").pop().focus(); };
    $("#i-ok").onclick = e => { leer();
      const v = {nombre: $("#i-n").value.trim(), unidad: $("#i-u").value.trim() || "unid.", minimo: soloDec($("#i-m").value)};
      if (!v.nombre) return toast("Escribí el nombre", true);
      const pv = pres.filter(p => p.nombre.trim() && p.cantidad > 0), stock = soloDec($("#i-s").value), precio = soloNum($("#i-p").value);
      accion(e.currentTarget, async () => {
        let iid = id;
        if (id) {
          await q(sb.from("insumos").update(v).eq("id", id));
          if (stock !== N(i.stock) || precio !== Math.round(N(i.precio_actual))) await q(sb.rpc("ajustar_insumo", {p_id: id, p_stock: stock, p_precio: precio || null}));
        } else {
          const r = await q(sb.from("insumos").insert({...v, stock, precio_actual: precio, precio_referencia: precio}).select().single()); iid = r.id;
        }
        const viejas = i.presentaciones.map(p => p.id), quedan = pv.filter(p => p.id).map(p => p.id);
        const borrar = viejas.filter(x => !quedan.includes(x));
        if (borrar.length) await q(sb.from("presentaciones").delete().in("id", borrar));
        for (const p of pv) {
          const o = i.presentaciones.find(x => x.id === p.id);
          if (!p.id) await q(sb.from("presentaciones").insert({insumo_id: iid, nombre: p.nombre.trim(), cantidad: p.cantidad}));
          else if (o && (o.nombre !== p.nombre.trim() || N(o.cantidad) !== p.cantidad)) await q(sb.from("presentaciones").update({nombre: p.nombre.trim(), cantidad: p.cantidad}).eq("id", p.id));
        }
      }, id ? "Mercadería actualizada" : "Mercadería agregada"); };
  }, true);
}
async function productoModal(id) {
  const p = id ? pr(id) : {nombre: "", categoria: "Pizzas", precio: "", costo_fijo: null, sabores: null, unidades: 1};
  let rec = [];
  if (id) { try { rec = (await q(sb.from("recetas").select("*").eq("producto_id", id))).map(r => ({insumo_id: r.insumo_id, cantidad: N(r.cantidad)})); } catch (e) { return fail(e); } }
  const cats = [...new Set(S.data.productos.map(x => x.categoria))], lista = activos(S.data.insumos);
  const costo = () => rec.reduce((a, r) => a + N(ins(r.insumo_id)?.precio_actual) * N(r.cantidad), 0);
  const recHTML = () => rec.map((r, k) => `<div class="rrow"><select class="inp" data-ri="${k}">${lista.map(i => `<option value="${i.id}" ${i.id == r.insumo_id ? "selected" : ""}>${esc(i.nombre)}</option>`).join("")}</select>
    <input class="inp" data-rc="${k}" value="${r.cantidad ? cant(r.cantidad) : ""}" inputmode="decimal" placeholder="Cantidad"><span style="color:var(--muted);font-size:.85rem">${esc(ins(r.insumo_id)?.unidad || "")}</span><button class="ib del" data-rdel="${k}" aria-label="Quitar">✕</button></div>`).join("");
  openModal(`<h3>${id ? "Editar " + esc(p.nombre) : "Nuevo producto"}</h3>
  <div class="sec">
    <label class="field">Nombre<input class="inp" id="p-n" value="${esc(p.nombre)}" placeholder="Ej: Coca-Cola 1,5 L"></label>
    <div class="two"><label class="field">Categoría<input class="inp" id="p-c" value="${esc(p.categoria)}" list="cats"><datalist id="cats">${cats.map(c => `<option>${esc(c)}</option>`).join("")}<option>Bebidas</option></datalist></label>
    <label class="field">Precio de venta ($)<input class="inp" id="p-p" value="${p.precio ? Math.round(N(p.precio)) : ""}" inputmode="numeric"></label></div>
  </div>
  <div class="sec"><label class="field">Sabores para elegir (separados por coma) · dejalo vacío si no tiene<input class="inp" id="p-s" value="${esc((p.sabores || []).join(", "))}" placeholder="Ej: Carne, Pollo, Verdura, Jamón y queso"></label>
    <label class="field">¿Cuántas unidades trae cada uno?<input class="inp" id="p-u" value="${p.unidades || 1}" inputmode="numeric" placeholder="Docena = 12"></label></div>
  <h4>Receta <small style="color:var(--muted);font-weight:600">qué mercadería usa cada unidad · se descuenta sola al vender</small></h4>
  <div class="stack" style="gap:6px" id="p-rec">${recHTML()}</div>
  <div class="acts" style="justify-content:space-between"><button class="btn btn-sm" id="p-radd">＋ Agregar ingrediente</button><span id="p-cost" style="font-weight:800"></span></div>
  <div class="sec" id="p-fijo-w"><label class="field">Si no tiene receta: ¿cuánto te cuesta cada uno? ($)<input class="inp" id="p-f" value="${p.costo_fijo != null ? Math.round(N(p.costo_fijo)) : ""}" inputmode="numeric" placeholder="Ej: lo que pagás la gaseosa"></label></div>
  <div class="two"><button class="btn" data-close>Cancelar</button><button class="btn btn-p" id="p-ok">Guardar</button></div>`, () => {
    const leer = () => $$("#p-rec .rrow").forEach((r, k) => { rec[k].insumo_id = +r.querySelector("[data-ri]").value; rec[k].cantidad = soloDec(r.querySelector("[data-rc]").value); });
    const pintar = () => { $("#p-rec").innerHTML = recHTML(); $("#p-cost").textContent = rec.length ? "Costo de mercadería: " + peso(costo()) : "";
      $("#p-fijo-w").hidden = rec.length > 0;
      $$("#modal [data-rdel]").forEach(b => b.onclick = () => { leer(); rec.splice(+b.dataset.rdel, 1); pintar(); });
      $$("#p-rec select, #p-rec input").forEach(x => x.onchange = () => { leer(); pintar(); }); };
    pintar();
    $("#p-radd").onclick = () => { leer(); rec.push({insumo_id: lista[0]?.id, cantidad: 0}); pintar(); };
    $("#p-ok").onclick = e => { leer();
      const sbs = $("#p-s").value.split(",").map(x => x.trim()).filter(Boolean);
      const v = {nombre: $("#p-n").value.trim(), categoria: $("#p-c").value.trim() || "Otros", precio: soloNum($("#p-p").value), costo_fijo: soloNum($("#p-f").value) || null,
        sabores: sbs.length ? [...new Set(sbs)] : null, unidades: Math.max(1, Math.round(soloNum($("#p-u").value)) || 1)};
      if (!v.nombre) return toast("Escribí el nombre", true);
      if (!v.precio) return toast("Poné el precio de venta", true);
      const rv = rec.filter(r => r.insumo_id && r.cantidad > 0), dup = rv.map(r => r.insumo_id).filter((x, k, a) => a.indexOf(x) !== k);
      if (dup.length) return toast(`${ins(dup[0]).nombre} está dos veces en la receta`, true);
      accion(e.currentTarget, async () => {
        let pid = id;
        if (id) {
          const {precio, ...resto} = v; await q(sb.from("productos").update(resto).eq("id", id));
          if (precio !== Math.round(N(p.precio))) await q(sb.rpc("cambiar_precio", {p_producto: id, p_precio: precio}));
          await q(sb.from("recetas").delete().eq("producto_id", id));
        } else {
          const orden = Math.max(0, ...S.data.productos.filter(x => x.categoria === v.categoria).map(x => x.orden)) + 1;
          pid = (await q(sb.from("productos").insert({...v, orden}).select().single())).id;
        }
        if (rv.length) await q(sb.from("recetas").insert(rv.map(r => ({producto_id: pid, insumo_id: r.insumo_id, cantidad: r.cantidad}))));
      }, id ? "Producto actualizado" : "Producto agregado a la carta"); };
  }, true);
}
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#modal").innerHTML) closeModal(); });

/* ================= ARRANQUE ================= */
async function entrar(session) {
  if (!session) { S.user = null; S.data = null; return vLogin(); }
  if (S.user?.id === session.user.id && S.data) return;
  S.user = session.user;
  try { const p = await q(sb.from("perfiles").select("rol").eq("user_id", S.user.id).maybeSingle()); S.rol = p?.rol || "general"; } catch (e) { S.rol = "general"; }
  $("#root").innerHTML = `<div class="loading">Cargando…</div>`;
  await render();
}
sb.auth.onAuthStateChange((_ev, session) => { setTimeout(() => entrar(session), 0); });
setInterval(() => { if (S.user && S.tab === "inicio" && !$("#modal").innerHTML) render(); }, 60000);
