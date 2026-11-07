(() => {
  "use strict";

  // ================= Utilidades =================
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem("pdv:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("pdv:" + k, JSON.stringify(v)); } catch {} },
  };
  const sess = {
    get(k) { try { return sessionStorage.getItem("pdv:" + k); } catch { return null; } },
    set(k, v) { try { v == null ? sessionStorage.removeItem("pdv:" + k) : sessionStorage.setItem("pdv:" + k, v); } catch {} },
  };
  const todayISO = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
  const parseD = (s) => (s ? new Date(s.length <= 10 ? s + "T00:00:00" : s) : null);
  const monthKey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
  const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const MESL = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const fmtDate = (s) => { const d = parseD(s); return d ? `${d.getDate()} ${MES[d.getMonth()]} ${d.getFullYear()}` : ""; };
  const hms = (s) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
  const hm = (s) => `${Math.floor(s / 3600)}h ${Math.floor(s / 60) % 60}m`;

  const I = (name) => {
    const p = {
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
      wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>',
      list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
      users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
      coins: '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7M15 10.2c3 .3 6 1.5 6 2.8v5c0 1.7-2.7 3-6 3-2 0-3.7-.5-4.8-1.2"/>',
      heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
      check: '<path d="M5 12l5 5L20 7"/>',
      flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
      cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      trend: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      play: '<path d="M7 5l12 7-12 7z"/>',
      pause: '<path d="M8 5v14M16 5v14"/>',
      reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/>',
      edit: '<path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/>',
      trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
      x: '<path d="M6 6l12 12M18 6L6 18"/>',
      refresh: '<path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3M4 4v4h4M20 20v-4h-4"/>',
      lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
      target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
      repeat: '<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
      chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
      bag: '<path d="M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
      camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
      image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
      chevl: '<path d="M15 6l-6 6 6 6"/>',
      chevr: '<path d="M9 6l6 6-6 6"/>',
    }[name] || "";
    return `<svg class="i" viewBox="0 0 24 24">${p}</svg>`;
  };

  // ================= Estado =================
  const CFG = window.PANEL_CONFIG || {};
  const S = {
    data: { pedidos: [], cuentas: [], funpay: [], tareas: [], rutina: [], ventas: [], clientes: [] },
    cur: store.get("cur", "USD"),
    rates: store.get("rates", { EUR: 0.92, RUB: 81, ts: 0 }),
    robux: store.get("robuxRate", 0.0035),
    tab: store.get("tab", "hoy"),
    period: store.get("period", "mes"),
    goal: store.get("goal", 1000),
    timers: store.get("timers", {}),
    comView: store.get("comView", "galeria"),
    demo: !CFG.workerUrl,
    pin: sess.get("pin") || store.get("pinRemember", null),
    loaded: false,
  };

  // ================= API =================
  async function api(method, path, body) {
    if (S.demo) return demoApi(method, path, body);
    setSync("busy");
    try {
      const res = await fetch(CFG.workerUrl.replace(/\/$/, "") + "/api/" + path, {
        method,
        headers: { "Content-Type": "application/json", "X-PIN": S.pin || "" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { lockOut(); throw new Error("PIN incorrecto"); }
      if (!res.ok) throw new Error(data.error || "Error " + res.status);
      setSync("ok");
      return data;
    } catch (e) {
      setSync("err");
      throw e;
    }
  }
  function demoApi(method, path, body) {
    const [db, id] = path.split("/");
    const D = window.DEMO_DATA;
    if (db === "all") return Promise.resolve(JSON.parse(JSON.stringify(D)));
    if (method === "POST") { const r = { id: "demo-" + Math.random().toString(36).slice(2), creado: new Date().toISOString(), ...body }; D[db].push(r); return Promise.resolve(r); }
    const row = D[db].find((r) => r.id === id);
    if (method === "PATCH" && row) Object.assign(row, body);
    if (method === "DELETE") D[db] = D[db].filter((r) => r.id !== id);
    return Promise.resolve(row || { ok: true });
  }
  function setSync(st) {
    const el = $("#sync");
    if (!el) return;
    el.className = "sync" + (st === "busy" ? " busy" : st === "err" ? " err" : "");
    el.lastChild.textContent = S.demo ? "Demo" : st === "busy" ? "Guardando…" : st === "err" ? "Sin conexión" : "Notion";
  }

  async function loadAll() {
    const d = await api("GET", "all");
    S.data = { pedidos: [], cuentas: [], funpay: [], tareas: [], rutina: [], ventas: [], clientes: [], ...d };
    S.loaded = true;
  }

  // Cambios optimistas: actualiza en pantalla y luego en Notion.
  async function patch(db, id, changes) {
    const row = S.data[db].find((r) => r.id === id);
    const before = row ? { ...row } : null;
    if (row) Object.assign(row, changes);
    render();
    if (detailOpen && detailOpen.id === id) detailOpen.draw();
    try { await api("PATCH", `${db}/${id}`, changes); }
    catch (e) { if (row && before) Object.assign(row, before); render(); toast("No se pudo guardar: " + e.message, true); }
  }
  async function create(db, values) {
    const tmp = { id: "tmp-" + Date.now(), ...values };
    S.data[db].push(tmp);
    render();
    try { const r = await api("POST", db, values); Object.assign(tmp, r); render(); return tmp; }
    catch (e) { S.data[db] = S.data[db].filter((x) => x !== tmp); render(); toast("No se pudo crear: " + e.message, true); }
  }
  async function remove(db, id, el) {
    if (el) { el.classList.add("leaving"); await new Promise((r) => setTimeout(r, 350)); }
    const row = S.data[db].find((r) => r.id === id);
    S.data[db] = S.data[db].filter((r) => r.id !== id);
    render();
    try { await api("DELETE", `${db}/${id}`); toast("Movido a la papelera de Notion"); }
    catch (e) { if (row) S.data[db].push(row); render(); toast("No se pudo borrar: " + e.message, true); }
  }

  // ================= Monedas =================
  const SYM = { USD: "$", EUR: "€", RUB: "₽" };
  // Cambio oficial del día: rublo del Banco Central de Rusia, euro del BCE.
  // Con el Worker queda guardado en Notion (base "Cambio"), igual que lo lee el Panel de Vida.
  async function fetchRatesDirect() {
    const [cbr, ecb] = await Promise.all([
      fetch("https://www.cbr-xml-daily.ru/daily_json.js").then((r) => r.json()),
      fetch("https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR").then((r) => r.json()),
    ]);
    const d = String(cbr.Date).slice(0, 10);
    return { rubUsd: cbr.Valute.USD.Value / cbr.Valute.USD.Nominal, eurUsd: ecb.rates.EUR, dia: d,
      fuente: `Banco Central de Rusia (${fmtDate(d)}) · BCE (${fmtDate(ecb.date)})`, actualizado: new Date().toISOString() };
  }
  let ratesBusy = false;
  async function loadRates(force) {
    if (ratesBusy) return;
    ratesBusy = true;
    const btn = $("#ratesBtn"); if (btn) btn.classList.add("spin");
    try {
      const r = S.demo ? await fetchRatesDirect() : await api("GET", "tipo-cambio" + (force ? "?forzar=1" : ""));
      if (r && r.rubUsd && r.eurUsd) {
        S.rates = { EUR: r.eurUsd, RUB: r.rubUsd, ts: Date.now(), dia: r.dia, fuente: r.fuente, actualizado: r.actualizado };
        store.set("rates", S.rates);
        render();
        if (r.aviso) { if (force) toast(r.aviso, true); }
        else if (force) toast(r.nota ? "Cambio actualizado (con fuente alternativa)" : "Cambio actualizado");
      }
    } catch (e) { if (force) toast("No se pudo actualizar el cambio: " + e.message, true); }
    finally { ratesBusy = false; const b = $("#ratesBtn"); if (b) b.classList.remove("spin"); }
  }
  function ago(iso) {
    if (!iso) return "";
    const m = Math.round((Date.now() - Date.parse(iso)) / 6e4);
    return m < 1 ? "ahora mismo" : m < 60 ? `hace ${m} min` : m < 1440 ? `hace ${Math.round(m / 60)} h` : `hace ${Math.round(m / 1440)} d`;
  }
  function ratesLine() {
    const r = S.rates;
    return `<div class="rates"><span>${I("trend")}</span>
      <span>1 $ = <b>${r.EUR.toLocaleString("es-ES", { maximumFractionDigits: 4 })} €</b> · 1 $ = <b>${r.RUB.toLocaleString("es-ES", { maximumFractionDigits: 2 })} ₽</b> · 1 € = <b>${(r.RUB / r.EUR).toLocaleString("es-ES", { maximumFractionDigits: 2 })} ₽</b></span>
      <span class="dim">${r.fuente ? esc(r.fuente) + " · " : ""}${r.actualizado ? "actualizado " + ago(r.actualizado) : "cambio aproximado"}</span>
      <button class="ib" id="ratesBtn" title="Actualizar el cambio ahora" style="width:24px;height:24px">${I("refresh")}</button></div>`;
  }
  const toUSD = (v, m) => {
    v = Number(v) || 0;
    if (m === "EUR") return v / S.rates.EUR;
    if (m === "RUB") return v / S.rates.RUB;
    if (m === "Robux") return v * S.robux;
    return v;
  };
  const fromUSD = (v) => (S.cur === "EUR" ? v * S.rates.EUR : S.cur === "RUB" ? v * S.rates.RUB : v);
  const money = (usd, opts = {}) => {
    const v = fromUSD(usd);
    const dec = opts.dec ?? (S.cur === "RUB" || Math.abs(v) >= 1000 ? 0 : Math.abs(v) % 1 ? 2 : 0);
    const n = v.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    return S.cur === "USD" ? "$" + n : n + " " + SYM[S.cur];
  };
  const raw = (v, m) => {
    v = Number(v) || 0;
    const n = v.toLocaleString("es-ES", { maximumFractionDigits: 2 });
    return m === "USD" ? "$" + n : m === "Robux" ? n + " R$" : n + " " + (SYM[m] || m || "");
  };

  // ================= Pedidos: derivados =================
  const PEND = ["Sin empezar", "En curso", "Posible comisión"];
  const splitName = (p) => {
    const t = p.Cliente || "";
    const i = t.indexOf(" — ");
    const client = (i >= 0 ? t.slice(0, i) : t).trim() || "Sin cliente";
    const title = p.Encargo || (i >= 0 ? t.slice(i + 3) : "") || client;
    return { client, title };
  };
  // Clientes: la ficha enlazada manda; si un pedido no tiene ficha, se usa el nombre del título.
  const normId = (id) => String(id || "").replace(/-/g, "");
  const clientById = (id) => S.data.clientes.find((c) => normId(c.id) === normId(id));
  const clientByName = (n) => S.data.clientes.find((c) => (c.Nombre || "").trim().toLowerCase() === String(n || "").trim().toLowerCase());
  const clientIdOf = (p) => { const r = p["Ficha de cliente"]; return Array.isArray(r) && r.length ? r[0] : null; };
  async function ensureClient(name) {
    name = String(name || "").trim();
    if (!name) return null;
    const ex = clientByName(name);
    if (ex) return ex.id;
    const c = await create("clientes", { Nombre: name, Desde: todayISO() });
    if (c) toast(`Cliente nuevo: ${name}`);
    return c ? c.id : null;
  }
  const clientOptions = () => [...S.data.clientes].sort((a, b) => (a.Nombre || "").localeCompare(b.Nombre || "")).map((c) => `<option value="${esc(c.Nombre)}">`).join("");
  const ped = () => S.data.pedidos.map((p) => {
    const sp = splitName(p);
    const ficha = clientById(clientIdOf(p));
    const client = ficha ? ficha.Nombre : sp.client;
    const title = sp.title;
    const clientId = ficha ? ficha.id : (clientByName(sp.client) || {}).id || null;
    const usd = toUSD(p.Precio, p.Moneda);
    const paidUsd = toUSD(p.Cobrado, p.Moneda);
    const paidOn = p["Fecha de pago"] || (p.Estado === "Listo" ? p["Fecha de entrega"] || p["Fecha de pedido"] : null);
    return { ...p, client, clientId, title, usd, paidUsd, paidOn };
  });
  const pending = () => ped().filter((p) => PEND.includes(p.Estado));
  const awaiting = () => ped().filter((p) => p.Estado === "En espera de revisión");
  const paid = () => ped().filter((p) => p.Estado === "Listo");
  const secondsOf = (p) => (Number(p["Segundos trabajados"]) || 0) + (S.timers[p.id] ? (Date.now() - S.timers[p.id]) / 1000 : 0);
  // Ganancia por hora = precio del pedido / tiempo invertido (en la moneda elegida arriba).
  const rateOf = (p) => { const s = secondsOf(p), u = p.usd != null ? p.usd : toUSD(p.Precio, p.Moneda); return s >= 60 && u ? u / (s / 3600) : null; };
  const rateTxt = (p) => { const r = rateOf(p); return r == null ? "" : money(r, { dec: 0 }) + "/h"; };
  // Lo que falta por cobrar = precio − upfront (Cobrado).
  const remainingUsd = (p) => Math.max(0, (p.usd || 0) - (p.paidUsd || 0));
  const upfrontOn = (p) => p["Adelanto pagado"] === true || p["Adelanto pagado"] === "__YES__" || (Number(p.Cobrado) || 0) > 0;
  const timeLine = (p) => { const s = secondsOf(p); return s >= 60 ? `${I("clock")} ${hm(s)}${rateOf(p) != null ? ` · <b class="rate">${rateTxt(p)}</b>` : ""}` : `${I("clock")} <span class="dim">sin tiempo</span>`; };

  // Editor de tiempo manual (por si se olvidó el cronómetro).
  function timeModal(id) {
    const row = S.data.pedidos.find((x) => x.id === id);
    if (!row) return;
    // Si el cronómetro estaba en marcha, se suma lo que lleva antes de editar.
    if (S.timers[id]) {
      row["Segundos trabajados"] = Math.round((Number(row["Segundos trabajados"]) || 0) + (Date.now() - S.timers[id]) / 1000);
      delete S.timers[id]; store.set("timers", S.timers);
    }
    const p0 = ped().find((x) => x.id === id);
    let secs = Math.round(Number(row["Segundos trabajados"]) || 0);
    const m = modal(`
      <h3>Tiempo trabajado <button class="ib" data-close>${I("x")}</button></h3>
      <div class="muted" style="font-size:12.5px">${esc(p0.title)} · ${esc(p0.client)} · ${money(p0.usd)}</div>
      <form class="form">
        <div class="two"><label>Horas<input class="inp" name="h" type="number" min="0" step="1" value="${Math.floor(secs / 3600)}"></label><label>Minutos<input class="inp" name="m" type="number" min="0" max="59" step="1" value="${Math.floor(secs / 60) % 60}"></label></div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">${[["+15 min", 900], ["+30 min", 1800], ["+1 h", 3600], ["+2 h", 7200], ["−15 min", -900]].map(([l, v]) => `<button type="button" class="btn ghost sm" data-add="${v}">${l}</button>`).join("")}</div>
        <div class="card stat" style="margin-top:4px"><div class="lb">Ganancia por hora con este tiempo</div><div class="v" id="ratePrev">—</div><div class="s" id="ratePrevSub"></div></div>
        <div class="acts"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn">${I("check")} Guardar tiempo</button></div>
      </form>`);
    const f = $("form", m.el);
    const read = () => Math.max(0, (Number(f.h.value) || 0) * 3600 + (Number(f.m.value) || 0) * 60);
    const write = (s) => { s = Math.max(0, s); f.h.value = Math.floor(s / 3600); f.m.value = Math.floor(s / 60) % 60; prev(); };
    const prev = () => {
      const s = read();
      $("#ratePrev", m.el).textContent = s >= 60 && p0.usd ? money(p0.usd / (s / 3600), { dec: 0 }) + " / h" : "—";
      $("#ratePrevSub", m.el).textContent = s ? `${hm(s)} para ${money(p0.usd)}` : "Pon cuánto tardaste";
    };
    f.addEventListener("input", prev);
    $$("[data-add]", m.el).forEach((b) => b.addEventListener("click", () => write(read() + Number(b.dataset.add))));
    f.addEventListener("submit", (e) => { e.preventDefault(); m.close(); patch("pedidos", id, { "Segundos trabajados": read() }); toast("Tiempo guardado"); });
    prev();
  }

  const colorFor = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  const avatar = (name, big) => { const h = colorFor(name); return `<div class="av" style="background:hsl(${h} 60% 18%);color:hsl(${h} 90% 72%)${big ? ";width:36px;height:36px;border-radius:11px;display:grid;place-items:center;font-weight:700;flex:none" : ""}">${esc((name[0] || "?").toUpperCase())}</div>`; };

  function dueInfo(dateStr) {
    if (!dateStr) return null;
    const due = parseD(dateStr); due.setHours(23, 59, 59);
    let ms = due - Date.now();
    const late = ms < 0; ms = Math.abs(ms);
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24;
    const span = d ? `${d}d ${h}h` : `${h}h`;
    return { late, text: late ? `Vencido ${span}` : `${span} restantes`, soon: !late && d < 2 };
  }

  // ================= Render principal =================
  const TABS = [
    ["hoy", "Hoy", "sun"], ["resumen", "Resumen", "grid"], ["comisiones", "Comisiones", "wallet"],
    ["pendientes", "Pendientes", "list"], ["clientes", "Clientes", "users"], ["dinero", "Dinero", "coins"], ["vida", "Vida", "heart"],
  ];
  const VIEWS = {};
  let lastTab = null;

  function shell() {
    $("#app").innerHTML = `
      <header class="top">
        <div class="brand"><span class="dot"></span>Panel de Vida</div>
        <nav class="nav" id="nav"><span class="pill"></span>${TABS.map(([k, l, i]) => `<button data-tab="${k}">${I(i)}${l}</button>`).join("")}</nav>
        <div class="tools">
          <span class="sync" id="sync"><span class="d"></span><span>${S.demo ? "Demo" : "Notion"}</span></span>
          <div class="cur" id="cur">${["USD", "EUR", "RUB"].map((c) => `<button data-cur="${c}">${SYM[c]}</button>`).join("")}</div>
          <button class="iconbtn" id="reload" title="Recargar desde Notion">${I("refresh")}</button>
          ${S.demo ? "" : `<button class="iconbtn" id="lockbtn" title="Bloquear">${I("lock")}</button>`}
        </div>
      </header>
      <main id="main"></main>`;
    $("#nav").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) go(b.dataset.tab); });
    $("#cur").addEventListener("click", (e) => { const b = e.target.closest("[data-cur]"); if (b) { S.cur = b.dataset.cur; store.set("cur", S.cur); render(); } });
    $("#reload").addEventListener("click", async () => { $("#reload").style.transform = "rotate(-360deg)"; await refresh(); setTimeout(() => ($("#reload").style.transform = ""), 400); });
    const lb = $("#lockbtn"); if (lb) lb.addEventListener("click", () => { store.set("pinRemember", null); lockOut(); });
    window.addEventListener("resize", movePill);
  }
  function movePill() {
    const on = $("#nav button.on"), pill = $("#nav .pill");
    if (on && pill) { pill.style.left = on.offsetLeft + "px"; pill.style.width = on.offsetWidth + "px"; }
  }
  function go(tab) { S.tab = tab; store.set("tab", tab); render(); window.scrollTo({ top: 0, behavior: "smooth" }); }

  function render() {
    if (!$("#main")) return;
    $$("#nav button").forEach((b) => b.classList.toggle("on", b.dataset.tab === S.tab));
    $$("#cur button").forEach((b) => b.classList.toggle("on", b.dataset.cur === S.cur));
    movePill();
    const fresh = lastTab !== S.tab;
    lastTab = S.tab;
    const html = S.loaded ? (VIEWS[S.tab] || VIEWS.hoy)() : skeleton();
    $("#main").innerHTML = `<div class="${fresh ? "view" : ""}">${html}</div>`;
    if (!fresh) $$(".stagger", $("#main")).forEach((s) => s.classList.remove("stagger"));
    $$("#main .item").forEach((el) => { if (!fresh) el.style.animation = "none"; });
    afterRender(fresh);
  }
  function skeleton() {
    return `<div class="h-date">&nbsp;</div><div class="skel" style="height:34px;width:220px;margin-bottom:20px"></div>
      <div class="grid g4">${'<div class="skel" style="height:118px"></div>'.repeat(4)}</div>
      <div class="skel" style="height:110px;margin-top:12px"></div>
      <div class="grid g2" style="margin-top:12px"><div class="skel" style="height:220px"></div><div class="skel" style="height:220px"></div></div>`;
  }

  // Animaciones tras pintar: números que suben, barras, anillos, brillo del ratón.
  function afterRender(fresh) {
    $$("[data-count]").forEach((el) => {
      const target = el.textContent;
      if (!fresh) return;
      const m = target.match(/-?[\d.,]+/);
      if (!m) return;
      const num = parseFloat(m[0].replace(/\./g, "").replace(",", "."));
      if (!isFinite(num) || num === 0) return;
      const dec = (m[0].split(",")[1] || "").length;
      const t0 = performance.now(), dur = 900;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = target.replace(m[0], (num * e).toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec }));
        if (k < 1) requestAnimationFrame(step); else el.textContent = target;
      };
      requestAnimationFrame(step);
    });
    requestAnimationFrame(() => {
      $$(".progress > div[data-w]").forEach((b) => (b.style.width = b.dataset.w));
      $$(".ring .fg[data-off]").forEach((c) => (c.style.strokeDashoffset = c.dataset.off));
    });
    $$(".card").forEach((c) => c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    }));
    $$(".chart .line").forEach((p) => p.style.setProperty("--len", Math.ceil(p.getTotalLength ? p.getTotalLength() : 2000)));
    if (!fresh) $$(".chart .line").forEach((p) => (p.style.animation = "none", p.style.strokeDashoffset = 0));
    if (!fresh) $$(".chart .area, .chart .growbar").forEach((p) => (p.style.animation = "none", p.style.opacity = 1));
    bindTips();
    const rb = $("#ratesBtn"); if (rb) rb.addEventListener("click", () => loadRates(true));
    (BIND[S.tab] || (() => {}))();
  }

  // ================= Tooltips de gráficos =================
  function bindTips() {
    const tip = $("#tip");
    $$("[data-tip]").forEach((el) => {
      el.addEventListener("pointerenter", () => { tip.textContent = el.dataset.tip; tip.style.opacity = 1; });
      el.addEventListener("pointermove", (e) => {
        const w = tip.offsetWidth;
        tip.style.left = Math.min(window.innerWidth - w - 8, Math.max(8, e.clientX - w / 2)) + "px";
        tip.style.top = e.clientY - 38 + "px";
      });
      el.addEventListener("pointerleave", () => (tip.style.opacity = 0));
    });
  }

  // ================= Gráficos SVG =================
  const DEFS = `<defs>
    <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a9dff"/><stop offset="1" stop-color="#1c5fb8" stop-opacity=".55"/></linearGradient>
    <linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6060"/><stop offset="1" stop-color="#9d2323" stop-opacity=".55"/></linearGradient>
    <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f8cff" stop-opacity=".28"/><stop offset="1" stop-color="#2f8cff" stop-opacity="0"/></linearGradient></defs>`;
  const niceMax = (m) => { if (m <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(m))); return Math.ceil(m / p * 1.15) * p; };
  const axisLabel = (v) => (v >= 1000 ? (v / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 }) + "k" : Math.round(v).toLocaleString("es-ES"));

  function barChart(items, { h = 170, goal = null, red = false } = {}) {
    const W = 520, pad = { l: 34, r: 8, t: 10, b: 22 };
    if (!items.length) return `<div class="empty">Sin datos en este periodo</div>`;
    const max = niceMax(Math.max(goal || 0, ...items.map((d) => d.v)));
    const iw = W - pad.l - pad.r, ih = h - pad.t - pad.b;
    const bw = Math.min(46, iw / items.length * 0.62);
    const ticks = [0, .25, .5, .75, 1].map((k) => k * max);
    let s = `<svg class="chart" viewBox="0 0 ${W} ${h}" width="100%">${DEFS}<g class="grid">`;
    ticks.forEach((t) => { const y = pad.t + ih - (t / max) * ih; s += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}"/><text x="${pad.l - 6}" y="${y + 3}" text-anchor="end">${axisLabel(fromUSD(t))}</text>`; });
    s += `</g>`;
    items.forEach((d, i) => {
      const cx = pad.l + iw * (i + .5) / items.length, bh = Math.max(2, (d.v / max) * ih);
      s += `<rect class="bar growbar ${red || d.red ? "red" : ""}" style="animation-delay:${i * 40}ms" x="${cx - bw / 2}" y="${pad.t + ih - bh}" width="${bw}" height="${bh}" rx="${Math.min(8, bw / 2)}" data-tip="${esc(d.tip || d.label + " · " + money(d.v))}"/>`;
      if (items.length <= 14) s += `<text x="${cx}" y="${h - 6}" text-anchor="middle">${esc(d.label.length > 9 ? d.label.slice(0, 8) + "…" : d.label)}</text>`;
    });
    if (goal) { const y = pad.t + ih - (goal / max) * ih; s += `<line class="goal" x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}"/>`; }
    return s + `</svg>`;
  }

  function lineChart(items, { h = 170, money: isMoney = false } = {}) {
    const W = 520, pad = { l: 34, r: 10, t: 12, b: 22 };
    if (!items.length) return `<div class="empty">Sin datos</div>`;
    const max = niceMax(Math.max(...items.map((d) => d.v), isMoney ? 1 : 4));
    const iw = W - pad.l - pad.r, ih = h - pad.t - pad.b;
    const X = (i) => pad.l + (items.length === 1 ? iw / 2 : (iw * i) / (items.length - 1));
    const Y = (v) => pad.t + ih - (v / max) * ih;
    let s = `<svg class="chart" viewBox="0 0 ${W} ${h}" width="100%">${DEFS}<g class="grid">`;
    [0, .25, .5, .75, 1].forEach((k) => { const v = k * max, y = Y(v); s += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}"/><text x="${pad.l - 6}" y="${y + 3}" text-anchor="end">${isMoney ? axisLabel(fromUSD(v)) : axisLabel(v)}</text>`; });
    s += `</g>`;
    const pts = items.map((d, i) => [X(i), Y(d.v)]);
    const path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    s += `<path class="area" d="${path} L${X(items.length - 1)} ${pad.t + ih} L${X(0)} ${pad.t + ih} Z"/><path class="line" d="${path}"/>`;
    items.forEach((d, i) => {
      s += `<circle class="dot" cx="${pts[i][0]}" cy="${pts[i][1]}" r="3.5" data-tip="${esc(d.label + " · " + (isMoney ? money(d.v) : d.v))}"/>`;
      s += `<text x="${pts[i][0]}" y="${h - 6}" text-anchor="middle">${esc(d.label)}</text>`;
    });
    return s + `</svg>`;
  }

  const ring = (k) => { const r = 14, c = 2 * Math.PI * r; return `<svg class="ring" width="36" height="36" viewBox="0 0 36 36"><circle class="bg" cx="18" cy="18" r="${r}"/><circle class="fg" cx="18" cy="18" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-off="${c * (1 - Math.min(1, k))}"/></svg>`; };
  const stat = (icon, label, value, sub, cls = "", extra = "") => `<div class="card hov stat">${extra}<span class="ic">${I(icon)}</span><div class="lb">${label}</div><div class="v ${cls}" data-count>${value}</div><div class="s">${sub}</div></div>`;

  // ================= Vista: Hoy =================
  const FRASES = [
    "Lo que haces cada día pesa más que lo que haces de vez en cuando.",
    "Un modelo terminado vale más que diez perfectos a medias.",
    "Descansar también es parte del trabajo.",
    "Pequeños avances, todos los días, sin prisa y sin pausa.",
    "Hoy no tienes que hacerlo todo; solo lo siguiente.",
    "La constancia convierte lo difícil en costumbre.",
    "Cobra lo que vale tu tiempo, y cuida el tiempo que no se cobra.",
    "Empieza por lo pequeño: el impulso hace el resto.",
  ];
  let fraseIdx = Math.floor(Date.now() / 864e5) % FRASES.length;

  function todayTasks() {
    const t = todayISO();
    return S.data.tareas.filter((x) => x.Fecha === t || (!x.Fecha && x.Estado !== "Hecha") || (!x.Fecha && x.Estado === "Hecha" && (x.editado || "").slice(0, 10) === t));
  }
  function totalWealthUSD() { return S.data.cuentas.reduce((a, c) => a + toUSD(c.Saldo, c.Moneda), 0); }
  function funpayNow() { const f = [...S.data.funpay].sort((a, b) => (a.Fecha || "").localeCompare(b.Fecha || "")); return f.length ? f[f.length - 1] : null; }
  function routineNow() {
    const r = [...S.data.rutina].sort((a, b) => (a.Orden || 0) - (b.Orden || 0));
    const now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
    let cur = null;
    r.forEach((b) => { const m = (b.Hora || "").match(/(\d{1,2}):(\d{2})/); if (m && +m[1] * 60 + +m[2] <= mins) cur = b; });
    return { list: r, cur };
  }

  VIEWS.hoy = () => {
    const now = new Date();
    const hr = now.getHours();
    const greet = hr < 6 ? "Buenas noches" : hr < 13 ? "Buenos días" : hr < 21 ? "Buenas tardes" : "Buenas noches";
    const tt = todayTasks(), done = tt.filter((t) => t.Estado === "Hecha").length;
    const mk = monthKey(now);
    const pm = paid().filter((p) => p.paidOn && monthKey(parseD(p.paidOn)) === mk);
    const pend = pending();
    const pendVal = pend.reduce((a, p) => a + Math.max(0, p.usd - p.paidUsd), 0);
    const withDue = pend.filter((p) => p["Fecha de entrega"]).sort((a, b) => a["Fecha de entrega"].localeCompare(b["Fecha de entrega"]));
    const next = withDue[0], nd = next && dueInfo(next["Fecha de entrega"]);
    const fp = funpayNow(), rn = routineNow();
    const deadlines = [...withDue, ...pend.filter((p) => !p["Fecha de entrega"])].slice(0, 6);

    return `
      <div class="h-date">${now.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</div>
      <div class="h1">${greet}</div>
      <div class="grid g4 stagger">
        ${stat("check", "Hoy", `${done}/${tt.length}`, "tareas hechas", "", ring(tt.length ? done / tt.length : 0))}
        ${stat("cal", "Este mes", money(pm.reduce((a, p) => a + p.usd, 0)), `${pm.length} ${pm.length === 1 ? "comisión" : "comisiones"}`)}
        ${stat("list", "En curso", money(pendVal), `${pend.length} pendientes`)}
        ${stat("flag", "Próxima entrega", nd ? esc(nd.text) : "—", next ? esc(next.title) : "Sin fechas", nd && nd.late ? "bad" : "")}
      </div>
      <div class="card quote" style="margin-top:12px">
        <p id="frase">“${esc(FRASES[fraseIdx])}”</p>
        <div class="by">— Panel de Vida <button class="ib" id="nextq" title="Otra frase" style="width:22px;height:22px">${I("refresh")}</button></div>
      </div>
      <div class="grid g2 stagger" style="margin-top:12px">
        <div class="card">
          <div class="card-t"><span>Hoy <span class="sub">${done}/${tt.length}</span></span></div>
          <form class="addrow" id="addTask" style="background:#0b0b0c;margin-bottom:8px;padding:4px 4px 4px 10px">
            <input class="inp grow" name="t" placeholder="Añadir tarea para hoy" style="border:0;background:none;box-shadow:none;padding:6px 0" autocomplete="off">
            <button class="ib" title="Añadir">${I("plus")}</button>
          </form>
          ${tt.length ? `<div>${tt.map((t) => `
            <div class="item ${t.Estado === "Hecha" ? "done" : ""}" data-id="${esc(t.id)}" style="padding:9px 4px;border-top-color:transparent">
              <button class="check ${t.Estado === "Hecha" ? "on" : ""}" data-act="toggle"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></button>
              <div class="main"><div class="t">${esc(t.Tarea)}</div>${t["Área"] ? `<div class="m">${esc(t["Área"])}</div>` : ""}</div>
              <button class="ib del" data-act="del">${I("trash")}</button>
            </div>`).join("")}</div>` : `<div class="empty">Un día despejado</div>`}
        </div>
        <div class="card">
          <div class="card-t"><span>Entregas</span><button class="ib" data-go="pendientes" title="Ver pendientes">${I("list")}</button></div>
          ${deadlines.length ? deadlines.map((p) => { const di = dueInfo(p["Fecha de entrega"]); return `
            <div class="item" style="padding:10px 4px;border-top-color:var(--line)">
              ${avatar(p.client)}
              <div class="main"><div class="t">${esc(p.title)}</div><div class="m">${esc(p.client)} · ${money(p.usd)}${di ? ` · <span class="${di.late ? "bad" : di.soon ? "warn" : ""}">${esc(di.text)}</span>` : ""}</div></div>
              ${di ? `<span class="tag ${di.late ? "bad" : di.soon ? "warn" : "blue"}">${di.late ? "Vencido" : di.soon ? "Pronto" : "A tiempo"}</span>` : `<span class="tag gray">Sin fecha</span>`}
            </div>`; }).join("") : `<div class="empty">Nada pendiente 🎉</div>`}
        </div>
      </div>
      <div class="grid g3 stagger" style="margin-top:12px">
        <div class="card hov click stat" data-go="dinero"><span class="ic">${I("coins")}</span><div class="lb">Patrimonio</div><div class="v" data-count>${money(totalWealthUSD())}</div><div class="s">${S.data.cuentas.length} cuentas</div></div>
        <div class="card hov click stat" data-go="dinero"><span class="ic">${I("bag")}</span><div class="lb">Saldo FunPay</div><div class="v" data-count>${fp ? money(toUSD(fp.Saldo, "RUB")) : "—"}</div><div class="s">${fp ? raw(fp.Saldo, "RUB") + " · " + fmtDate(fp.Fecha) : "Sin lecturas"}</div></div>
        <div class="card hov click stat" data-go="vida"><span class="ic">${I("clock")}</span><div class="lb">Ahora toca</div><div class="v" style="font-size:18px">${rn.cur ? esc(rn.cur.Bloque) : "—"}</div><div class="s">${rn.cur ? esc(rn.cur.Hora) : "Rutina libre"}</div></div>
      </div>
      ${ratesLine()}`;
  };

  // ================= Vista: Resumen =================
  function periodRange() {
    const n = new Date();
    if (S.period === "mes") return [new Date(n.getFullYear(), n.getMonth(), 1), "este mes"];
    if (S.period === "3m") return [new Date(n.getFullYear(), n.getMonth() - 2, 1), "los últimos 3 meses"];
    if (S.period === "año") return [new Date(n.getFullYear(), 0, 1), "este año"];
    return [new Date(2000, 0, 1), "todo el historial"];
  }
  function lastMonths(n) {
    const out = [], now = new Date();
    for (let i = n - 1; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); out.push({ key: monthKey(d), d }); }
    return out;
  }

  VIEWS.resumen = () => {
    const [from, label] = periodRange();
    const all = paid();
    const inP = all.filter((p) => p.paidOn && parseD(p.paidOn) >= from).sort((a, b) => a.paidOn.localeCompare(b.paidOn));
    const total = inP.reduce((a, p) => a + p.usd, 0);
    const secs = inP.reduce((a, p) => a + (Number(p["Segundos trabajados"]) || 0), 0);
    const now = new Date(), mk = monthKey(now), pk = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const sumM = (k) => all.filter((p) => p.paidOn && monthKey(parseD(p.paidOn)) === k).reduce((a, p) => a + p.usd, 0);
    const cm = sumM(mk), pm = sumM(pk);
    const growth = pm ? ((cm - pm) / pm) * 100 : null;
    const clientsP = [...new Set(inP.map((p) => p.client))];
    const returning = clientsP.filter((c) => all.filter((p) => p.client === c).length > 1).length;
    const months = lastMonths(7).map((m) => {
      const ps = all.filter((p) => p.paidOn && monthKey(parseD(p.paidOn)) === m.key);
      const rev = ps.reduce((a, p) => a + p.usd, 0);
      const top = ps.slice().sort((a, b) => b.usd - a.usd)[0];
      return { ...m, n: ps.length, rev, avg: ps.length ? rev / ps.length : 0, top };
    });
    const topC = Object.entries(inP.reduce((o, p) => ((o[p.client] = (o[p.client] || 0) + p.usd), o), {})).sort((a, b) => b[1] - a[1])[0];

    return `
      <div class="h-date">&nbsp;</div>
      <div class="h1">Resumen
        <div class="seg" id="period">${[["mes", "Mes"], ["3m", "3 meses"], ["año", "Año"], ["todo", "Todo"]].map(([k, l]) => `<button data-p="${k}" class="${S.period === k ? "on" : ""}">${l}</button>`).join("")}</div>
      </div>
      <div class="stagger">
        <div class="card hero">
          <div class="lb">Ingresos cobrados</div>
          <div class="row"><div><div class="big" data-count>${money(total)}</div><div class="muted" style="font-size:12px">${inP.length} ${inP.length === 1 ? "comisión pagada" : "comisiones pagadas"} en ${label}</div></div>
          <button class="btn" data-new="pedido">${I("plus")} Comisión</button></div>
        </div>
        <div class="section-t">${I("grid")} Rendimiento</div>
        <div class="grid g4 stagger">
          ${stat("wallet", "Comisiones pagadas", inP.length, "en el periodo")}
          ${stat("grid", "Valor medio", money(inP.length ? total / inP.length : 0), "por comisión")}
          ${stat("clock", "Tiempo registrado", hm(secs), "con el cronómetro")}
          ${stat("trend", "Crecimiento", growth == null ? "Nuevo" : (growth >= 0 ? "+" : "") + growth.toFixed(0) + "%", `vs ${MESL[(now.getMonth() + 11) % 12].toLowerCase()}`, growth != null && growth < 0 ? "bad" : growth > 0 ? "ok" : "")}
        </div>
        <div class="grid g3 stagger" style="margin-top:12px">
          ${stat("clock", "Ganancia por hora", secs ? money(total / (secs / 3600)) : "—", "ingreso / hora registrada")}
          ${stat("repeat", "Clientes que repiten", clientsP.length ? Math.round((returning / clientsP.length) * 100) + "%" : "0%", `${returning} de ${clientsP.length} clientes`)}
          ${stat("target", "Meta mensual", Math.round((cm / (S.goal || 1)) * 100) + "%", `${money(cm)} de ${money(S.goal)} este mes`)}
        </div>
        <div class="section-t">${I("chart")} Tendencias</div>
        <div class="grid g2 stagger">
          <div class="card hov click" data-big="bars"><div class="card-t"><span>${I("wallet")} Ingresos por comisión</span></div>${barChart(inP.slice(-14).map((p) => ({ label: p.title, v: p.usd, tip: `${p.title} · ${p.client} · ${money(p.usd)}` })))}</div>
          <div class="card hov click" data-big="line"><div class="card-t"><span>${I("grid")} Comisiones por mes</span></div>${lineChart(months.map((m) => ({ label: MES[m.d.getMonth()], v: m.n })))}</div>
        </div>
        <div class="section-t">${I("flag")} Mes a mes</div>
        <div class="grid g2 stagger">
          <div class="card"><div class="card-t"><span>${I("cal")} Vista mensual</span></div>
            <table class="tb"><thead><tr><th>Mes</th><th class="r">Nº</th><th class="r">Media</th><th class="r">Ingresos</th></tr></thead><tbody>
            ${months.slice().reverse().map((m) => `<tr><td>${MESL[m.d.getMonth()]} ${m.d.getFullYear()}</td><td class="r">${m.n}</td><td class="r">${m.n ? money(m.avg) : "–"}</td><td class="r">${money(m.rev)}</td></tr>`).join("")}
            </tbody></table>
            ${topC ? `<div class="muted" style="font-size:12px;margin-top:12px">${I("trend")} Top: <b style="color:var(--fg)">${esc(topC[0])}</b> · ${money(topC[1])}</div>` : ""}
          </div>
          <div class="card"><div class="card-t"><span>${I("target")} Ingresos vs meta</span>
            <form id="goalForm" style="display:flex;gap:6px;align-items:center"><span class="sub">Meta ($)</span><input class="inp" name="g" type="number" min="0" step="10" value="${S.goal}" style="width:90px;padding:6px 8px"><button class="btn sm">Guardar</button></form></div>
            <div class="muted" style="font-size:12px;display:flex;justify-content:space-between;margin-bottom:6px"><span>Este mes</span><b style="color:var(--fg)">${money(cm)} / ${money(S.goal)}</b></div>
            <div class="progress"><div data-w="${Math.min(100, (cm / (S.goal || 1)) * 100)}%"></div></div>
            <div style="margin-top:14px">${barChart(months.map((m) => ({ label: MES[m.d.getMonth()], v: m.rev })), { goal: S.goal })}</div>
            <div class="legend"><span><i style="background:var(--accent)"></i>Ingresos</span><span><i style="background:var(--muted)"></i>Línea discontinua = meta</span></div>
          </div>
        </div>
      </div>`;
  };

  // ================= Vista: Comisiones =================
  const FEES = { Wise: (u) => 0.41 + u * 0.0371, PayPal: (u) => 0.3 + u * 0.054, Robux: (u) => u * 0.3, Transferencia: () => 0, Otro: () => 0 };
  const imgsOf = (p) => (Array.isArray(p["Imágenes"]) ? p["Imágenes"] : []).filter((u) => typeof u === "string" && u);
  const methodOf = (p) => p["Método de pago"] || (p.Moneda === "Robux" ? "Robux" : "Wise");
  const estadoTag = (s) => {
    const c = s === "Listo" ? "ok" : s === "Cancelado" ? "bad" : s === "En espera de revisión" ? "warn" : s === "Posible comisión" ? "gray" : "blue";
    const label = s === "Listo" ? "Pagado" : s === "En espera de revisión" ? "Esperando pago" : s;
    return `<span class="tag ${c}">${esc(label || "")}</span>`;
  };
  function cover(p) {
    const im = imgsOf(p);
    const h = colorFor(p.client || "?");
    return im.length
      ? `<img src="${esc(im[0])}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('noimg');this.remove()">${im.length > 1 ? `<span class="count">${im.length}</span>` : ""}`
      : `<div class="ph" style="background:radial-gradient(120% 120% at 20% 10%, hsl(${h} 50% 22%), #0d0d0f 70%)"><span style="color:hsl(${h} 90% 72%)">${esc((p.title || "?")[0].toUpperCase())}</span></div>`;
  }
  function gcard(p, size, extra = "") {
    const di = PEND.includes(p.Estado) ? dueInfo(p["Fecha de entrega"]) : null;
    return `<div class="gcard ${size}" data-id="${esc(p.id)}" data-open>
      <div class="cover">${cover(p)}<button class="cam" data-act="img" title="Añadir imagen">${I("camera")}</button></div>
      <div class="gbody">
        <div class="gt">${esc(p.title)}</div>
        <div class="gm">${esc(p.client)}${size !== "sm" && p.Moneda && p.Moneda !== S.cur && p.Precio != null ? " · " + raw(p.Precio, p.Moneda) : ""}</div>
        <div class="gp"><b>${money(p.usd)}</b>${estadoTag(p.Estado)}</div>
        ${di ? `<div class="gm ${di.late ? "bad" : di.soon ? "warn" : ""}">${esc(di.text)}</div>` : ""}
        ${size === "sm"
          ? (rateOf(p) != null ? `<div class="gm"><b class="rate">${rateTxt(p)}</b> · ${hm(secondsOf(p))}</div>` : "")
          : `<button class="gtime" data-act="time" title="Editar el tiempo a mano">${timeLine(p)} <span class="gedit">${I("edit")}</span></button>`}
        ${extra}
      </div></div>`;
  }

  VIEWS.comisiones = () => {
    if (S.comView === "lista") return VIEWS.comisionesLista();
    const act = pending().sort((a, b) => (a.Estado === "Posible comisión") - (b.Estado === "Posible comisión") || (a["Fecha de entrega"] || "9").localeCompare(b["Fecha de entrega"] || "9"));
    const aw = awaiting(), pd = paid().sort((a, b) => (b.paidOn || "").localeCompare(a.paidOn || "")), cn = ped().filter((p) => p.Estado === "Cancelado");
    // Media de ganancia por hora: suma de precios / suma de horas, solo pedidos con tiempo registrado.
    const avgRate = (list) => { const t = list.filter((p) => secondsOf(p) >= 60 && p.usd); const h = t.reduce((a, p) => a + secondsOf(p) / 3600, 0); return h ? { r: t.reduce((a, p) => a + p.usd, 0) / h, n: t.length, h } : null; };
    const rAll = avgRate([...pd, ...aw]), rAct = avgRate([...act, ...aw]);
    const toCollect = [...act, ...aw].reduce((a, p) => a + remainingUsd(p), 0);
    return `
      <div class="h-date">&nbsp;</div>
      <div class="h1">Comisiones <span style="display:flex;gap:8px;align-items:center">${viewSeg()}<button class="btn" data-new="pedido">${I("plus")} Añadir</button></span></div>
      <div class="grid g3 stagger" style="margin-bottom:6px">
        ${stat("clock", "Ganancia media por hora", rAll ? money(rAll.r, { dec: 0 }) + "/h" : "—", rAll ? `${rAll.n} pedidos terminados · ${hm(rAll.h * 3600)}` : "Registra el tiempo de tus pedidos")}
        ${stat("trend", "Ritmo en lo abierto", rAct ? money(rAct.r, { dec: 0 }) + "/h" : "—", rAct ? `${rAct.n} pedidos con tiempo` : "Sin tiempo registrado aún")}
        ${stat("wallet", "Falta por cobrar", money(toCollect), "en curso + esperando pago, sin upfront")}
      </div>
      <div class="group-t">En curso <span class="dim">${act.length}</span></div>
      ${act.length ? `<div class="ggrid lg">${act.map((p) => gcard(p, "lg")).join("")}</div>` : `<div class="list"><div class="empty">Nada en curso</div></div>`}
      ${aw.length ? `<div class="group-t">Esperando pago <span class="dim">${aw.length}</span></div>
      <div class="ggrid md">${aw.map((p) => { const m = methodOf(p), left = remainingUsd(p), fee = (FEES[m] || FEES.Otro)(left); return gcard(p, "md", `
        <div class="gm">Falta por cobrar: <b style="color:var(--fg)">${money(left)}</b>${p.paidUsd ? ` <span class="dim">(upfront ${money(p.paidUsd)})</span>` : ""}</div>
        <div class="gm" style="color:var(--accent-2)">${esc(m)}: neto ≈ ${money(left - fee, { dec: 2 })}</div>
        <div class="gacts"><select class="sel" data-act="method">${["Wise", "PayPal", "Robux", "Transferencia", "Otro"].map((o) => `<option ${o === m ? "selected" : ""}>${o}</option>`).join("")}</select>
        <button class="btn sm" data-act="paid">${I("check")} Pagado</button></div>`); }).join("")}</div>` : ""}
      <div class="group-t">Pagadas <span class="dim">${pd.length} · ${money(pd.reduce((a, p) => a + p.usd, 0))}</span></div>
      ${pd.length ? `<div class="ggrid sm">${pd.map((p) => gcard(p, "sm")).join("")}</div>` : `<div class="list"><div class="empty">Aún no hay comisiones pagadas</div></div>`}
      ${cn.length ? `<div class="group-t">Canceladas <span class="dim">${cn.length}</span></div><div class="ggrid sm off">${cn.map((p) => gcard(p, "sm")).join("")}</div>` : ""}`;
  };
  const viewSeg = () => `<div class="seg" id="comView"><button data-v="galeria" class="${S.comView !== "lista" ? "on" : ""}" title="Galería">${I("grid")}</button><button data-v="lista" class="${S.comView === "lista" ? "on" : ""}" title="Lista">${I("list")}</button></div>`;

  VIEWS.comisionesLista = () => {
    const aw = awaiting(), pd = paid().sort((a, b) => (b.paidOn || "").localeCompare(a.paidOn || "")), cn = ped().filter((p) => p.Estado === "Cancelado");
    const method = methodOf;
    return `
      <div class="h-date">&nbsp;</div>
      <div class="h1">Comisiones <span style="display:flex;gap:8px;align-items:center">${viewSeg()}<button class="btn" data-new="pedido">${I("plus")} Añadir</button></span></div>
      ${aw.length ? `<div class="group-t">Esperando pago <span class="dim">${aw.length} terminada${aw.length > 1 ? "s" : ""}</span></div>
      <div class="list">${aw.map((p) => { const m = method(p), fee = (FEES[m] || FEES.Otro)(p.usd); return `
        <div class="item" data-id="${esc(p.id)}">
          ${avatar(p.client)}
          <div class="main"><div class="t">${esc(p.title)}</div>
            <div class="m">${esc(p.client)} · Terminado ${fmtDate(p["Fecha de entrega"]) || ""}${p.paidUsd ? ` · adelanto ${money(p.paidUsd)}` : ""}</div>
            <div class="m" style="color:var(--accent-2)">${esc(m)} estimado: comisión ${money(fee, { dec: 2 })} · neto ${money(p.usd - fee, { dec: 2 })} (aprox.)</div></div>
          <div class="acts">
            <button class="ib" data-act="edit">${I("edit")}</button>
            <span class="amt" style="margin:0 8px">${money(p.usd)}</span>
            <select class="sel" data-act="method" style="padding:6px 26px 6px 10px">${["Wise", "PayPal", "Robux", "Transferencia", "Otro"].map((o) => `<option ${o === m ? "selected" : ""}>${o}</option>`).join("")}</select>
            <button class="btn sm" data-act="paid" style="margin-left:6px">${I("check")} Pago completado</button>
          </div>
        </div>`; }).join("")}</div>` : ""}
      <div class="group-t">Pagadas <span class="dim">${pd.length}</span></div>
      ${pd.length ? `<div class="list">${pd.map((p) => { const fee = p["Método de pago"] ? (FEES[p["Método de pago"]] || FEES.Otro)(p.usd) : 0; return `
        <div class="item" data-id="${esc(p.id)}">
          ${avatar(p.client)}
          <div class="main"><div class="t">${esc(p.title)}</div>
          <div class="m">${esc(p.client)} · ${fmtDate(p.paidOn)}${p["Segundos trabajados"] ? " · " + hm(p["Segundos trabajados"]) : ""}${p["Método de pago"] ? ` · ${esc(p["Método de pago"])} est. ${money(fee, { dec: 2 })} · neto ${money(p.usd - fee, { dec: 2 })}` : ""}${p.Moneda && p.Moneda !== "USD" ? ` · ${raw(p.Precio, p.Moneda)}` : ""}</div></div>
          <div class="acts"><span class="amt" style="margin-right:6px">${money(p.usd)}</span><button class="ib" data-act="edit">${I("edit")}</button><button class="ib del" data-act="del">${I("trash")}</button></div>
        </div>`; }).join("")}</div>` : `<div class="list"><div class="empty">Aún no hay comisiones pagadas</div></div>`}
      ${cn.length ? `<div class="group-t">Canceladas <span class="dim">${cn.length}</span></div><div class="list">${cn.map((p) => `
        <div class="item" data-id="${esc(p.id)}" style="opacity:.6">${avatar(p.client)}<div class="main"><div class="t">${esc(p.title)}</div><div class="m">${esc(p.client)} · ${fmtDate(p["Fecha de pedido"])}</div></div>
        <div class="acts"><span class="amt dim" style="margin-right:6px;text-decoration:line-through">${money(p.usd)}</span><button class="ib" data-act="edit">${I("edit")}</button><button class="ib del" data-act="del">${I("trash")}</button></div></div>`).join("")}</div>` : ""}`;
  };

  // ================= Vista: Pendientes =================
  VIEWS.pendientes = () => {
    const pe = pending().sort((a, b) => (a["Fecha de entrega"] || "9").localeCompare(b["Fecha de entrega"] || "9"));
    return `
      <div class="h-date">&nbsp;</div>
      <div class="h1">Pendientes</div>
      <form class="addrow" id="addPend">
        <input class="inp grow" name="title" placeholder="Nueva comisión pendiente" required autocomplete="off">
        <input class="inp" name="client" list="clientsList" placeholder="Cliente (elige o escribe uno nuevo)" title="Elige un cliente de la lista o escribe un nombre nuevo para crearlo" style="width:200px" required autocomplete="off">
        <datalist id="clientsList">${clientOptions()}</datalist>
        <input class="inp" name="price" type="number" step="0.01" min="0" placeholder="Precio" style="width:96px">
        <select class="sel" name="cur">${["USD", "EUR", "RUB", "Robux"].map((c) => `<option ${c === "USD" ? "selected" : ""}>${c}</option>`).join("")}</select>
        <input class="inp" name="due" type="date" title="Fecha de entrega" style="width:150px">
        <button class="btn" title="Añadir" style="width:36px;height:36px;padding:0;justify-content:center">${I("plus")}</button>
      </form>
      ${pe.length ? `<div class="list">${pe.map((p) => { const di = dueInfo(p["Fecha de entrega"]); const run = !!S.timers[p.id]; return `
        <div class="item" data-id="${esc(p.id)}">
          ${avatar(p.client)}
          <div class="main"><div class="t">${esc(p.title)} ${p.Estado === "Posible comisión" ? `<span class="tag gray">Posible</span>` : p.Estado === "En curso" ? `<span class="tag blue">En curso</span>` : ""}</div>
            <div class="m">${esc(p.client)} · ${p.Precio != null ? raw(p.Precio, p.Moneda) : "sin precio"}${p.Moneda && p.Moneda !== S.cur ? ` (${money(p.usd)})` : ""}${di ? ` · <span class="${di.late ? "bad" : di.soon ? "warn" : ""}">${esc(di.text)}</span>` : ""}${rateOf(p) != null ? ` · <b class="rate">${rateTxt(p)}</b>` : ""}</div>
            <div class="upf">
              <label class="upf-chk"><input type="checkbox" data-up ${upfrontOn(p) ? "checked" : ""}> Upfront</label>
              <span class="upf-amt" ${upfrontOn(p) ? "" : "hidden"}><input class="inp" type="number" min="0" step="0.01" data-upamt value="${esc(p.Cobrado ?? "")}" placeholder="0"> ${esc(p.Moneda === "Robux" ? "R$" : SYM[p.Moneda] || p.Moneda || "$")}</span>
              ${p.Precio != null ? `<span class="upf-left">Falta por cobrar: <b>${raw(Math.max(0, (Number(p.Precio) || 0) - (Number(p.Cobrado) || 0)), p.Moneda)}</b>${p.Moneda && p.Moneda !== S.cur ? ` <span class="dim">(${money(remainingUsd(p))})</span>` : ""}</span>` : ""}
            </div></div>
          <div class="acts">
            <button class="timer ${run ? "on" : ""}" data-act="time" data-timer="${esc(p.id)}" title="Editar el tiempo a mano">${hms(secondsOf(p))}</button>
            <button class="ib play ${run ? "running" : ""}" data-act="timer" title="${run ? "Pausar" : "Empezar"}">${I(run ? "pause" : "play")}</button>
            <button class="ib" data-act="treset" title="Reiniciar cronómetro">${I("reset")}</button>
            <button class="ib" data-act="edit" title="Editar">${I("edit")}</button>
            <button class="ib del" data-act="del" title="Borrar">${I("trash")}</button>
            <button class="btn green sm" data-act="finish" style="margin-left:6px">${I("check")} Trabajo terminado</button>
          </div>
        </div>`; }).join("")}</div>` : `<div class="list"><div class="empty">Sin trabajo pendiente</div></div>`}`;
  };

  // ================= Vista: Clientes =================
  let clientQ = "";
  // Une cada cliente de la base con sus pedidos (por la ficha enlazada o, si falta, por el nombre).
  function clientStats() {
    const by = {};
    S.data.clientes.forEach((c) => (by["id:" + normId(c.id)] = { key: "id:" + normId(c.id), id: c.id, rec: c, name: c.Nombre || "Sin nombre", paid: 0, n: 0, open: 0, last: c.Desde || "", items: [] }));
    ped().forEach((p) => {
      const key = p.clientId ? "id:" + normId(p.clientId) : "name:" + p.client;
      const c = (by[key] ||= { key, id: null, rec: null, name: p.client, paid: 0, n: 0, open: 0, last: "", items: [] });
      c.items.push(p);
      if (p.Estado === "Listo") { c.paid += p.usd; c.n++; }
      if (PEND.includes(p.Estado) || p.Estado === "En espera de revisión") c.open += Math.max(0, p.usd - p.paidUsd);
      const d = p.paidOn || p["Fecha de pedido"] || "";
      if (d > c.last) c.last = d;
    });
    return Object.values(by);
  }

  VIEWS.clientes = () => {
    const all = clientStats();
    const list = all.filter((c) => c.name.toLowerCase().includes(clientQ.toLowerCase())).sort((a, b) => b.paid - a.paid || b.items.length - a.items.length);
    const total = all.reduce((a, c) => a + c.paid, 0);
    const repeat = all.filter((c) => c.n > 1);
    const top = all.slice().sort((a, b) => b.paid - a.paid)[0];
    const sinFicha = all.filter((c) => !c.id).length;
    return `
      <div class="h-date">&nbsp;</div>
      <div class="h1">Clientes <button class="btn" data-newclient>${I("plus")} Cliente</button></div>
      <div class="grid g4 stagger">
        ${stat("users", "Clientes", all.filter((c) => c.id).length, sinFicha ? `${sinFicha} sin ficha` : "en tu base de Notion")}
        ${stat("wallet", "Cobrado en total", money(total), "pedidos pagados")}
        ${stat("trend", "Mejor cliente", top && top.paid ? esc(top.name) : "—", top && top.paid ? money(top.paid) + (total ? ` · ${Math.round((top.paid / total) * 100)}% del total` : "") : "")}
        ${stat("repeat", "Repiten", repeat.length, total ? `${Math.round((repeat.reduce((a, c) => a + c.paid, 0) / total) * 100)}% de lo cobrado` : "")}
      </div>
      <div class="addrow" style="margin-top:14px"><span class="muted" style="padding-left:6px">${I("search")}</span><input class="inp grow" id="clientQ" placeholder="Buscar cliente" value="${esc(clientQ)}" style="border:0;background:none;box-shadow:none" autocomplete="off"></div>
      <div class="grid g3 stagger">${list.map((c) => `
        <div class="card hov click" data-client="${esc(c.key)}">
          <div style="display:flex;gap:10px;align-items:center;margin-bottom:14px">${avatar(c.name, true)}
            <div style="min-width:0"><div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(c.name)}</div><div class="muted" style="font-size:12px">${c.items.length} pedido${c.items.length === 1 ? "" : "s"}${c.last ? " · " + fmtDate(c.last) : ""}${c.rec && c.rec.Canal ? " · " + esc(c.rec.Canal) : ""}</div></div></div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:8px">
            <div><div class="muted" style="font-size:11.5px">Cobrado</div><div style="font-size:20px;font-weight:700">${money(c.paid)}</div></div>
            ${!c.id ? `<span class="tag gray">Sin ficha</span>` : c.open ? `<span class="tag warn">${money(c.open)} pendiente</span>` : c.n > 1 ? `<span class="tag ok">Repite</span>` : ""}
          </div>
          ${total && c.paid ? `<div class="progress" style="margin-top:12px;height:4px"><div data-w="${(c.paid / (top.paid || 1)) * 100}%"></div></div>` : ""}
        </div>`).join("") || `<div class="empty">Sin resultados</div>`}</div>`;
  };

  // ================= Vista: Dinero =================
  VIEWS.dinero = () => {
    const total = totalWealthUSD();
    const groups = {};
    S.data.cuentas.forEach((c) => ((groups[c["País"] || "Otro"] ||= []).push(c)));
    const byType = {};
    S.data.cuentas.forEach((c) => (byType[c.Tipo || "Otro"] = (byType[c.Tipo || "Otro"] || 0) + toUSD(c.Saldo, c.Moneda)));
    const fp = [...S.data.funpay].sort((a, b) => (a.Fecha || "").localeCompare(b.Fecha || ""));
    const retir = fp.reduce((a, f) => a + (Number(f.Retirado) || 0), 0);
    const last = fp[fp.length - 1];
    return `
      <div class="h-date">&nbsp;</div>
      <div class="h1">Dinero <button class="btn" data-new="cuenta">${I("plus")} Cuenta</button></div>
      <div class="stagger">
        <div class="card hero"><div class="lb">Patrimonio total</div><div class="big" data-count>${money(total)}</div>
          <div class="legend">${Object.entries(byType).map(([t, v], i) => `<span><i style="background:${["#2f8cff", "#2fd36b", "#a77bff", "#f5b83d", "#ff6b9a"][i % 5]}"></i>${esc(t)} ${money(v)}</span>`).join("")}</div>
          <div style="display:flex;height:8px;border-radius:99px;overflow:hidden;margin-top:12px;gap:2px">${Object.values(byType).map((v, i) => `<div style="flex:${Math.max(v, 0)};background:${["#2f8cff", "#2fd36b", "#a77bff", "#f5b83d", "#ff6b9a"][i % 5]};animation:grow .9s var(--ease) both;transform-origin:left"></div>`).join("")}</div>
        </div>
        ${Object.entries(groups).map(([pais, cs]) => `
          <div class="group-t">${esc(pais)} <span class="dim">${money(cs.reduce((a, c) => a + toUSD(c.Saldo, c.Moneda), 0))}</span></div>
          <div class="list">${cs.map((c) => `
            <div class="item" data-id="${esc(c.id)}">
              ${avatar(c.Cuenta || "?")}
              <div class="main"><div class="t">${esc(c.Cuenta)}</div><div class="m">${esc(c.Tipo || "")}${c.Moneda !== S.cur ? " · " + money(toUSD(c.Saldo, c.Moneda)) : ""}</div></div>
              <div class="acts"><button class="amt" data-act="editSaldo" title="Cambiar saldo" style="padding:4px 8px;border-radius:8px">${raw(c.Saldo, c.Moneda)}</button>
              <button class="ib" data-act="edit">${I("edit")}</button><button class="ib del" data-act="del">${I("trash")}</button></div>
            </div>`).join("")}</div>`).join("")}
        <div class="section-t">${I("bag")} FunPay</div>
        <div class="grid g2">
          <div class="card"><div class="card-t"><span>Saldo por lectura</span><span class="sub">${last ? "Ahora " + raw(last.Saldo, "RUB") : ""}</span></div>
            ${barChart(fp.slice(-12).map((f) => ({ label: (parseD(f.Fecha) || new Date()).getDate() + " " + MES[(parseD(f.Fecha) || new Date()).getMonth()], v: toUSD(f.Saldo, "RUB"), tip: `${fmtDate(f.Fecha)} · ${raw(f.Saldo, "RUB")} · ${f.Nota || ""}` })))}
            <div class="legend"><span>Total retirado: <b style="color:var(--fg)">${raw(retir, "RUB")}</b> (${money(toUSD(retir, "RUB"))})</span></div>
          </div>
          <div class="card"><div class="card-t"><span>Nueva lectura</span></div>
            <form class="form" id="addFp" style="margin-top:0">
              <div class="two"><label>Saldo (₽)<input class="inp" name="saldo" type="number" step="1" required></label><label>Retirado (₽)<input class="inp" name="ret" type="number" step="1" value="0"></label></div>
              <div class="two"><label>Fecha<input class="inp" name="fecha" type="date" value="${todayISO()}"></label><label>Nota<input class="inp" name="nota" placeholder="retirada"></label></div>
              <div class="acts"><button class="btn">${I("plus")} Guardar lectura</button></div>
            </form>
            <div style="margin-top:12px">${fp.slice(-4).reverse().map((f) => `<div class="item" data-fp="${esc(f.id)}" style="padding:8px 2px"><div class="main"><div class="t" style="font-weight:500">${fmtDate(f.Fecha)} · ${esc(f.Nota || "")}</div></div><span class="amt">${raw(f.Saldo, "RUB")}</span><button class="ib del" data-act="delFp">${I("trash")}</button></div>`).join("")}</div>
          </div>
        </div>
        ${ratesLine()}
        <div class="muted" style="font-size:11.5px;margin-top:8px">Robux: 1 R$ = ${S.robux} $ (valor fijo tuyo) <button class="ib" id="robuxRate" title="Cambiar valor del Robux" style="width:22px;height:22px">${I("edit")}</button></div>
      </div>`;
  };

  // ================= Vista: Vida =================
  VIEWS.vida = () => {
    const rn = routineNow();
    const tareas = [...S.data.tareas].sort((a, b) => (a.Estado === "Hecha") - (b.Estado === "Hecha"));
    const areas = ["Cocina", "Pedidos", "Casa", "Personal", "Prueba"];
    const ventas = S.data.ventas;
    return `
      <div class="h-date">&nbsp;</div>
      <div class="h1">Vida</div>
      <div class="grid g2 stagger">
        <div class="card"><div class="card-t"><span>${I("clock")} Rutina</span><button class="ib" data-new="rutina">${I("plus")}</button></div>
          <div class="timeline">${rn.list.map((b, i) => `<div class="tl ${b === rn.cur ? "now" : ""}" data-id="${esc(b.id)}" style="animation-delay:${i * 60}ms"><div class="h">${esc(b.Hora || "")}${b.Nota ? " · " + esc(b.Nota) : ""}</div><div class="b" style="display:flex;justify-content:space-between;align-items:center">${esc(b.Bloque)}<span><button class="ib" data-act="editR" style="width:24px;height:24px">${I("edit")}</button><button class="ib del" data-act="delR" style="width:24px;height:24px">${I("trash")}</button></span></div></div>`).join("") || `<div class="empty">Sin rutina</div>`}</div>
        </div>
        <div class="card"><div class="card-t"><span>${I("check")} Tareas</span><span class="sub">${tareas.filter((t) => t.Estado !== "Hecha").length} pendientes</span></div>
          <form class="addrow" id="addTask2" style="background:#0b0b0c;padding:4px 4px 4px 10px">
            <input class="inp grow" name="t" placeholder="Nueva tarea" style="border:0;background:none;box-shadow:none;padding:6px 0" autocomplete="off" required>
            <select class="sel" name="a" style="padding:6px 26px 6px 10px">${areas.map((a) => `<option>${a}</option>`).join("")}</select>
            <input class="inp" name="f" type="date" title="Fecha (opcional)" style="padding:6px 8px">
            <button class="ib">${I("plus")}</button>
          </form>
          ${tareas.map((t) => `
            <div class="item ${t.Estado === "Hecha" ? "done" : ""}" data-id="${esc(t.id)}" style="padding:9px 4px">
              <button class="check ${t.Estado === "Hecha" ? "on" : ""}" data-act="toggle"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></button>
              <div class="main"><div class="t">${esc(t.Tarea)}</div><div class="m">${esc(t["Área"] || "")}${t.Fecha ? " · " + fmtDate(t.Fecha) : ""}</div></div>
              <button class="ib del" data-act="del">${I("trash")}</button>
            </div>`).join("") || `<div class="empty">Sin tareas</div>`}
        </div>
      </div>
      <div class="section-t">${I("bag")} Ventas y anuncios</div>
      <div class="list stagger">${ventas.length ? ventas.map((v) => `
        <div class="item" data-id="${esc(v.id)}">${avatar(v.Producto || "?")}<div class="main"><div class="t">${esc(v.Producto)}</div><div class="m">${esc(v.Tipo || "")} · ${esc(v.Canal || "")} · ${esc(v.Estado || "")}${v.Fecha ? " · " + fmtDate(v.Fecha) : ""}</div></div>
        <div class="acts">${v.Importe != null ? `<span class="amt" style="margin-right:6px">${raw(v.Importe, v.Moneda)}</span>` : ""}<button class="ib del" data-act="delV">${I("trash")}</button></div></div>`).join("") : `<div class="empty">Aún no hay anuncios ni ventas. <button class="btn sm ghost" data-new="venta" style="margin-left:6px">${I("plus")} Añadir</button></div>`}</div>`;
  };

  // ================= Modales =================
  function modal(html, wide) {
    const bg = document.createElement("div");
    bg.className = "modal-bg";
    bg.innerHTML = `<div class="modal ${wide ? "wide" : ""}">${html}</div>`;
    document.body.appendChild(bg);
    const close = () => { bg.style.transition = "opacity .2s"; bg.style.opacity = 0; setTimeout(() => bg.remove(), 200); document.removeEventListener("keydown", onKey); };
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    bg.addEventListener("click", (e) => { if (e.target === bg || e.target.closest("[data-close]")) close(); });
    const f = $("input,select", bg); if (f) setTimeout(() => f.focus(), 50);
    return { el: bg, close };
  }
  const opt = (list, v) => list.map((o) => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("");

  function pedidoModal(p, presetClient) {
    const isNew = !p;
    p = p || { Estado: "Sin empezar", Moneda: "USD", "Fecha de pedido": todayISO() };
    const nm = isNew ? { client: presetClient || "", title: "" } : splitName(p);
    if (!isNew) { const f = clientById(clientIdOf(p)); if (f) nm.client = f.Nombre; }
    const m = modal(`
      <h3>${isNew ? "Nueva comisión" : "Editar comisión"} <button class="ib" data-close>${I("x")}</button></h3>
      <form class="form">
        <div class="two"><label>Cliente <span class="dim" id="cliHint"></span><input class="inp" name="client" list="clientsListM" value="${esc(nm.client)}" placeholder="Elige o escribe uno nuevo" required autocomplete="off"><datalist id="clientsListM">${clientOptions()}</datalist></label><label>Encargo<input class="inp" name="title" value="${esc(p.Encargo || nm.title)}"></label></div>
        <div class="two"><label>Precio<input class="inp" name="Precio" type="number" step="0.01" value="${esc(p.Precio ?? "")}"></label><label>Moneda<select class="sel" name="Moneda">${opt(["USD", "EUR", "RUB", "Robux"], p.Moneda)}</select></label></div>
        <div class="two"><label>Estado<select class="sel" name="Estado">${opt(["Sin empezar", "En curso", "Posible comisión", "En espera de revisión", "Listo", "Cancelado"], p.Estado)}</select></label><label>Upfront / cobrado<input class="inp" name="Cobrado" type="number" step="0.01" min="0" value="${esc(p.Cobrado ?? "")}"></label></div>
        <div class="two"><label>Fecha de pedido<input class="inp" name="Fecha de pedido" type="date" value="${esc(p["Fecha de pedido"] || "")}"></label><label>Fecha de entrega<input class="inp" name="Fecha de entrega" type="date" value="${esc(p["Fecha de entrega"] || "")}"></label></div>
        <div class="two"><label>Método de pago<select class="sel" name="Método de pago"><option></option>${opt(["Wise", "PayPal", "Robux", "Transferencia", "Otro"], p["Método de pago"])}</select></label><label>Fecha de pago<input class="inp" name="Fecha de pago" type="date" value="${esc(p["Fecha de pago"] || "")}"></label></div>
        <label>Canal<select class="sel" name="Canal"><option></option>${opt(["Fiverr", "Comisiones - Ghoustly", "Redes sociales", "Web ghoustly3d.com", "Otro"], p.Canal)}</select></label>
        <div class="acts"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn">${isNew ? "Crear" : "Guardar"}</button></div>
      </form>`);
    const cin = $("input[name=client]", m.el), hint = $("#cliHint", m.el);
    const showHint = () => { const v = cin.value.trim(); hint.textContent = !v ? "" : clientByName(v) ? "· cliente existente" : "· se creará como cliente nuevo"; };
    cin.addEventListener("input", showHint); showHint();
    $("form", m.el).addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target));
      m.close();
      const cid = await ensureClient(fd.client);
      fd.client = (clientById(cid) || {}).Nombre || fd.client.trim();
      const v = {
        "Ficha de cliente": cid ? [cid] : [],
        Cliente: fd.title && fd.title !== fd.client ? `${fd.client.trim()} — ${fd.title.trim()}` : fd.client.trim(),
        Encargo: fd.title.trim(),
        Precio: fd.Precio === "" ? null : Number(fd.Precio),
        Moneda: fd.Moneda, Estado: fd.Estado,
        Cobrado: fd.Cobrado === "" ? null : Number(fd.Cobrado),
        // En pedidos ya pagados no se toca la casilla, para no perder el historial de upfronts.
        ...(fd.Estado !== "Listo" && fd.Estado !== "Cancelado" ? { "Adelanto pagado": Number(fd.Cobrado) > 0 } : {}),
        "Fecha de pedido": fd["Fecha de pedido"] || null, "Fecha de entrega": fd["Fecha de entrega"] || null,
        "Método de pago": fd["Método de pago"] || null, "Fecha de pago": fd["Fecha de pago"] || null, Canal: fd.Canal || null,
      };
      isNew ? create("pedidos", v) : patch("pedidos", p.id, v);
    });
  }

  function cuentaModal(c) {
    const isNew = !c; c = c || { Moneda: "EUR", Tipo: "Banco", "País": "España" };
    const m = modal(`
      <h3>${isNew ? "Nueva cuenta" : "Editar cuenta"} <button class="ib" data-close>${I("x")}</button></h3>
      <form class="form">
        <label>Nombre<input class="inp" name="Cuenta" value="${esc(c.Cuenta || "")}" required></label>
        <div class="two"><label>Saldo<input class="inp" name="Saldo" type="number" step="0.01" value="${esc(c.Saldo ?? "")}" required></label><label>Moneda<select class="sel" name="Moneda">${opt(["EUR", "RUB", "USD"], c.Moneda)}</select></label></div>
        <div class="two"><label>Tipo<select class="sel" name="Tipo">${opt(["Banco", "Ahorro", "Tarjeta", "Prestado"], c.Tipo)}</select></label><label>País<select class="sel" name="País">${opt(["España", "Rusia"], c["País"])}</select></label></div>
        <div class="acts"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn">${isNew ? "Crear" : "Guardar"}</button></div>
      </form>`);
    $("form", m.el).addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target)); fd.Saldo = Number(fd.Saldo);
      m.close(); isNew ? create("cuentas", fd) : patch("cuentas", c.id, fd);
    });
  }

  function rutinaModal(b) {
    const isNew = !b; b = b || { Orden: S.data.rutina.length + 1 };
    const m = modal(`
      <h3>${isNew ? "Nuevo bloque" : "Editar bloque"} <button class="ib" data-close>${I("x")}</button></h3>
      <form class="form">
        <label>Bloque<input class="inp" name="Bloque" value="${esc(b.Bloque || "")}" required></label>
        <div class="two"><label>Hora<input class="inp" name="Hora" value="${esc(b.Hora || "")}" placeholder="07:00"></label><label>Orden<input class="inp" name="Orden" type="number" value="${esc(b.Orden ?? "")}"></label></div>
        <label>Nota<input class="inp" name="Nota" value="${esc(b.Nota || "")}"></label>
        <div class="acts"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn">Guardar</button></div>
      </form>`);
    $("form", m.el).addEventListener("submit", (e) => {
      e.preventDefault(); const fd = Object.fromEntries(new FormData(e.target)); fd.Orden = Number(fd.Orden) || 0;
      m.close(); isNew ? create("rutina", fd) : patch("rutina", b.id, fd);
    });
  }

  function ventaModal() {
    const m = modal(`
      <h3>Nuevo anuncio o venta <button class="ib" data-close>${I("x")}</button></h3>
      <form class="form">
        <label>Producto<input class="inp" name="Producto" required></label>
        <div class="two"><label>Tipo<select class="sel" name="Tipo">${opt(["Anuncio", "Venta"], "Anuncio")}</select></label><label>Canal<select class="sel" name="Canal">${opt(["FunPay", "Otro"], "FunPay")}</select></label></div>
        <div class="two"><label>Estado<select class="sel" name="Estado">${opt(["Activo", "Pausado", "Vendido"], "Activo")}</select></label><label>Fecha<input class="inp" name="Fecha" type="date" value="${todayISO()}"></label></div>
        <div class="two"><label>Importe<input class="inp" name="Importe" type="number" step="0.01"></label><label>Moneda<select class="sel" name="Moneda">${opt(["RUB", "USD", "EUR"], "RUB")}</select></label></div>
        <div class="acts"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn">Crear</button></div>
      </form>`);
    $("form", m.el).addEventListener("submit", (e) => {
      e.preventDefault(); const fd = Object.fromEntries(new FormData(e.target)); fd.Importe = fd.Importe === "" ? null : Number(fd.Importe);
      m.close(); create("ventas", fd);
    });
  }

  // ================= Imágenes de los pedidos =================
  // Reduce la imagen (máx. 1800 px, JPEG) para que suba rápido; los GIF se suben tal cual.
  function shrinkImage(file) {
    return new Promise((resolve) => {
      if (file.type === "image/gif" || !/^image\//.test(file.type)) return resolve(file);
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, 1800 / Math.max(img.width, img.height));
        if (k === 1 && file.size < 2.5e6) { URL.revokeObjectURL(url); return resolve(file); }
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        const x = c.getContext("2d");
        x.fillStyle = "#000"; x.fillRect(0, 0, c.width, c.height);
        x.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob((b) => resolve(b ? new File([b], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file), "image/jpeg", 0.86);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }
  async function uploadImages(id, files) {
    files = [...files].filter((f) => /^image\/(jpeg|png|webp|gif)$/.test(f.type));
    if (!files.length) { toast("Elige una imagen JPG, PNG, WEBP o GIF", true); return; }
    const row = S.data.pedidos.find((x) => x.id === id);
    if (!row) return;
    for (const f0 of files) {
      const f = await shrinkImage(f0);
      toast(`Subiendo ${f.name}…`);
      if (S.demo) {
        row["Imágenes"] = [...imgsOf(row), URL.createObjectURL(f)];
        render(); refreshDetail(id); continue;
      }
      setSync("busy");
      try {
        const res = await fetch(CFG.workerUrl.replace(/\/$/, "") + `/api/pedidos/${id}/imagen`, {
          method: "POST",
          headers: { "Content-Type": f.type, "X-PIN": S.pin || "", "X-Filename": encodeURIComponent(f.name).slice(0, 80) },
          body: f,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Error " + res.status);
        if (data.pedido) Object.assign(row, data.pedido);
        setSync("ok");
        toast(data.aviso || "Imagen guardada en Notion", !!data.aviso);
        render(); refreshDetail(id);
      } catch (e) { setSync("err"); toast("No se pudo subir la imagen: " + e.message, true); }
    }
  }
  function pickImages(id) {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/png,image/jpeg,image/webp,image/gif"; inp.multiple = true;
    inp.onchange = () => uploadImages(id, inp.files);
    inp.click();
  }

  let detailOpen = null;
  function refreshDetail(id) { if (detailOpen && detailOpen.id === id) detailOpen.draw(); }
  function detailModal(id) {
    let idx = 0;
    const m = modal(`<div id="det"></div>`, true);
    const box = $("#det", m.el);
    const draw = () => {
      const p = ped().find((x) => x.id === id);
      if (!p) { m.close(); return; }
      const im = imgsOf(p);
      idx = Math.min(idx, Math.max(0, im.length - 1));
      const left = remainingUsd(p);
      const fee = (FEES[methodOf(p)] || FEES.Otro)(left);
      box.innerHTML = `
        <h3><span>${esc(p.title)}</span><button class="ib" data-close>${I("x")}</button></h3>
        <div class="muted" style="font-size:12.5px;margin-bottom:14px">${esc(p.client)} · ${estadoTag(p.Estado)}</div>
        <div class="viewer" id="drop">
          ${im.length ? `<img src="${esc(im[idx])}" alt="" referrerpolicy="no-referrer">
            ${im.length > 1 ? `<button class="nav-l ib" data-nav="-1">${I("chevl")}</button><button class="nav-r ib" data-nav="1">${I("chevr")}</button>` : ""}`
          : `<div class="dropmsg">${I("image")}<div>Arrastra aquí una imagen, pégala con Ctrl+V o pulsa “Añadir imagen”</div></div>`}
        </div>
        ${im.length > 1 ? `<div class="thumbs">${im.map((u, i) => `<img src="${esc(u)}" data-th="${i}" class="${i === idx ? "on" : ""}" alt="" referrerpolicy="no-referrer">`).join("")}</div>` : ""}
        <div class="grid g4" style="margin-top:14px">
          <div class="card stat"><div class="lb">Precio</div><div class="v" style="font-size:18px">${money(p.usd)}</div><div class="s">${p.Precio != null ? raw(p.Precio, p.Moneda) : ""}</div></div>
          ${p.Estado === "Listo"
            ? `<div class="card stat"><div class="lb">Cobrado</div><div class="v" style="font-size:18px">${money(p.usd)}</div><div class="s">${esc(p["Método de pago"] || "")}</div></div>`
            : `<div class="card stat"><div class="lb">Falta por cobrar</div><div class="v" style="font-size:18px">${money(left)}</div><div class="s">${p.paidUsd ? "upfront " + money(p.paidUsd) : "sin upfront"}</div></div>`}
          <button class="card stat hov click" data-d="time" title="Editar el tiempo a mano" style="text-align:left;font:inherit;color:inherit"><div class="lb">Tiempo ${I("edit")}</div><div class="v" style="font-size:18px">${hm(secondsOf(p))}</div><div class="s">${rateOf(p) != null ? `<b class="rate">${rateTxt(p)}</b>` : "Pulsa para añadirlo"}</div></button>
          <div class="card stat"><div class="lb">${p.Estado === "Listo" ? "Pagado" : "Entrega"}</div><div class="v" style="font-size:16px">${fmtDate(p.Estado === "Listo" ? p.paidOn : p["Fecha de entrega"]) || "—"}</div><div class="s">Pedido ${fmtDate(p["Fecha de pedido"])}</div></div>
        </div>
        ${p.Estado === "En espera de revisión" ? `<div class="muted" style="font-size:12px;margin-top:10px">${esc(methodOf(p))}: comisión ≈ ${money(fee, { dec: 2 })} · neto ≈ ${money(left - fee, { dec: 2 })} de lo que falta por cobrar</div>` : ""}
        ${p.Estado !== "Listo" && p.Estado !== "Cancelado" ? `<div class="upf" style="margin-top:12px">
          <label class="upf-chk"><input type="checkbox" data-up ${upfrontOn(p) ? "checked" : ""}> Upfront</label>
          <span class="upf-amt" ${upfrontOn(p) ? "" : "hidden"}><input class="inp" type="number" min="0" step="0.01" data-upamt value="${esc(p.Cobrado ?? "")}" placeholder="0"> ${esc(p.Moneda === "Robux" ? "R$" : SYM[p.Moneda] || p.Moneda || "$")}</span>
        </div>` : ""}
        <div class="form"><div class="acts" style="justify-content:space-between">
          <button type="button" class="btn ghost" data-d="del">${I("trash")} Borrar</button>
          <span style="display:flex;gap:8px"><button type="button" class="btn ghost" data-d="img">${I("camera")} Añadir imagen</button><button type="button" class="btn" data-d="edit">${I("edit")} Editar</button></span>
        </div></div>`;
      $$("[data-nav]", box).forEach((b) => b.addEventListener("click", () => { idx = (idx + Number(b.dataset.nav) + im.length) % im.length; draw(); }));
      $$("[data-th]", box).forEach((t) => t.addEventListener("click", () => { idx = Number(t.dataset.th); draw(); }));
      $("[data-d=img]", box).addEventListener("click", () => pickImages(id));
      $("[data-d=time]", box).addEventListener("click", () => timeModal(id));
      bindUpfront(box);
      $("[data-d=edit]", box).addEventListener("click", () => { m.close(); pedidoModal(S.data.pedidos.find((x) => x.id === id)); });
      $("[data-d=del]", box).addEventListener("click", () => { if (confirm(`¿Mover "${p.title}" a la papelera de Notion?`)) { m.close(); remove("pedidos", id); } });
      $("[data-close]", box).addEventListener("click", () => {});
      const drop = $("#drop", box);
      drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
      drop.addEventListener("dragleave", () => drop.classList.remove("over"));
      drop.addEventListener("drop", (e) => { e.preventDefault(); drop.classList.remove("over"); uploadImages(id, e.dataTransfer.files); });
    };
    const onPaste = (e) => {
      const files = [...(e.clipboardData || {}).items || []].filter((it) => it.kind === "file").map((it) => it.getAsFile()).filter(Boolean);
      if (files.length) { e.preventDefault(); uploadImages(id, files); }
    };
    document.addEventListener("paste", onPaste);
    const obs = new MutationObserver(() => { if (!document.body.contains(m.el)) { document.removeEventListener("paste", onPaste); detailOpen = null; obs.disconnect(); } });
    obs.observe(document.body, { childList: true });
    detailOpen = { id, draw };
    draw();
  }

  const CANALES = ["Fiverr", "Comisiones - Ghoustly", "Redes sociales", "Web ghoustly3d.com", "Discord", "Otro"];

  function clientModal(key) {
    const c = clientStats().find((x) => x.key === key);
    if (!c) return;
    const items = c.items.slice().sort((a, b) => (b["Fecha de pedido"] || "").localeCompare(a["Fecha de pedido"] || ""));
    const valid = items.filter((p) => p.Estado !== "Cancelado");
    const tag = (s) => s === "Listo" ? "ok" : s === "Cancelado" ? "bad" : s === "En espera de revisión" ? "warn" : "blue";
    const r = c.rec || {};
    const m = modal(`
      <h3><span style="display:flex;gap:10px;align-items:center">${avatar(c.name, true)}${esc(c.name)}</span><button class="ib" data-close>${I("x")}</button></h3>
      <div class="grid g4" style="margin:16px 0">
        <div class="card stat"><div class="lb">Cobrado</div><div class="v">${money(c.paid)}</div></div>
        <div class="card stat"><div class="lb">Pendiente</div><div class="v">${money(c.open)}</div></div>
        <div class="card stat"><div class="lb">Pedidos</div><div class="v">${items.length}</div></div>
        <div class="card stat"><div class="lb">Valor medio</div><div class="v">${money(valid.length ? valid.reduce((a, p) => a + p.usd, 0) / valid.length : 0)}</div></div>
      </div>
      ${c.id ? `
      <form class="form" id="cliForm" style="margin-top:0">
        <div class="two"><label>Nombre<input class="inp" name="Nombre" value="${esc(r.Nombre || "")}" required></label><label>Canal<select class="sel" name="Canal"><option></option>${opt(CANALES, r.Canal)}</select></label></div>
        <div class="two"><label>Contacto<input class="inp" name="Contacto" value="${esc(r.Contacto || "")}" placeholder="Discord, email…"></label><label>Cliente desde<input class="inp" name="Desde" type="date" value="${esc(r.Desde || "")}"></label></div>
        <label>Notas<input class="inp" name="Notas" value="${esc(r.Notas || "")}"></label>
        <div class="acts"><button type="button" class="btn ghost" data-delcli>${I("trash")} Borrar</button><button type="button" class="btn ghost" data-newfor>${I("plus")} Comisión</button><button class="btn">Guardar</button></div>
      </form>` : `
      <div class="muted" style="font-size:12.5px;margin-bottom:12px">Este nombre aparece en pedidos pero no tiene ficha en tu base de Clientes.
        <button class="btn sm" data-mkficha style="margin-left:6px">${I("plus")} Crear ficha y enlazar sus pedidos</button></div>`}
      <div class="group-t">Pedidos</div>
      <div class="list">${items.map((p) => `<div class="item"><div class="main"><div class="t">${esc(p.title)}</div><div class="m">${fmtDate(p["Fecha de pedido"])}${p.Moneda && p.Moneda !== "USD" && p.Precio != null ? " · " + raw(p.Precio, p.Moneda) : ""}</div></div><span class="tag ${tag(p.Estado)}">${esc(p.Estado)}</span><span class="amt" style="margin-left:8px">${money(p.usd)}</span></div>`).join("") || `<div class="empty">Aún no tiene pedidos</div>`}</div>`, true);

    const f = $("#cliForm", m.el);
    if (f) {
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = Object.fromEntries(new FormData(f));
        m.close();
        patch("clientes", c.id, { Nombre: fd.Nombre.trim(), Canal: fd.Canal || null, Contacto: fd.Contacto, Notas: fd.Notas, Desde: fd.Desde || null });
      });
      $("[data-newfor]", m.el).addEventListener("click", () => { m.close(); pedidoModal(null, c.name); });
      $("[data-delcli]", m.el).addEventListener("click", () => {
        if (confirm(`¿Mover la ficha de "${c.name}" a la papelera de Notion? Sus pedidos no se borran.`)) { m.close(); remove("clientes", c.id); }
      });
    }
    const mk = $("[data-mkficha]", m.el);
    if (mk) mk.addEventListener("click", async () => {
      m.close();
      const id = await ensureClient(c.name);
      if (id) for (const p of c.items) await patch("pedidos", p.id, { "Ficha de cliente": [id] });
    });
  }

  function newClientModal() {
    const m = modal(`
      <h3>Nuevo cliente <button class="ib" data-close>${I("x")}</button></h3>
      <form class="form">
        <div class="two"><label>Nombre<input class="inp" name="Nombre" required></label><label>Canal<select class="sel" name="Canal"><option></option>${opt(CANALES, "")}</select></label></div>
        <div class="two"><label>Contacto<input class="inp" name="Contacto" placeholder="Discord, email…"></label><label>Cliente desde<input class="inp" name="Desde" type="date" value="${todayISO()}"></label></div>
        <label>Notas<input class="inp" name="Notas"></label>
        <div class="acts"><button type="button" class="btn ghost" data-close>Cancelar</button><button class="btn">Crear</button></div>
      </form>`);
    $("form", m.el).addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target));
      if (clientByName(fd.Nombre)) { toast("Ya existe un cliente con ese nombre", true); return; }
      m.close();
      create("clientes", { Nombre: fd.Nombre.trim(), Canal: fd.Canal || null, Contacto: fd.Contacto, Notas: fd.Notas, Desde: fd.Desde || null });
    });
  }

  function bigChart(kind) {
    const all = paid();
    const months = lastMonths(12).map((m) => { const ps = all.filter((p) => p.paidOn && monthKey(parseD(p.paidOn)) === m.key); return { ...m, n: ps.length, rev: ps.reduce((a, p) => a + p.usd, 0) }; });
    const nz = months.filter((m) => m.n);
    const busiest = months.slice().sort((a, b) => b.n - a.n)[0];
    const avgPrice = all.length ? all.reduce((a, p) => a + p.usd, 0) / all.length : 0;
    const m = modal(`
      <h3>${kind === "line" ? "Comisiones por mes" : "Ingresos por mes"} <button class="ib" data-close>${I("x")}</button></h3>
      <div class="muted" style="font-size:12px">Últimos 12 meses</div>
      <div class="grid g4" style="margin:16px 0">
        <div class="card stat"><div class="lb">12 meses</div><div class="v">${months.reduce((a, x) => a + x.n, 0)}</div></div>
        <div class="card stat"><div class="lb">Mes con más</div><div class="v" style="font-size:17px">${busiest && busiest.n ? MES[busiest.d.getMonth()] + " · " + busiest.n : "—"}</div></div>
        <div class="card stat"><div class="lb">Media / mes</div><div class="v">${(nz.length ? months.reduce((a, x) => a + x.n, 0) / 12 : 0).toFixed(1)}</div></div>
        <div class="card stat"><div class="lb">Precio medio</div><div class="v">${money(avgPrice)}</div></div>
      </div>
      <div class="card">${kind === "line" ? lineChart(months.map((x) => ({ label: MES[x.d.getMonth()], v: x.n })), { h: 260 }) : barChart(months.map((x) => ({ label: MES[x.d.getMonth()], v: x.rev })), { h: 260, goal: S.goal })}</div>`, true);
    $$(".chart .line", m.el).forEach((p) => p.style.setProperty("--len", Math.ceil(p.getTotalLength())));
    bindTips();
  }

  // ================= Eventos por vista =================
  const rowId = (e) => { const it = e.target.closest("[data-id]"); return it ? it.dataset.id : null; };
  const BIND = {};
  function bindCommon() {
    $$("[data-go]").forEach((el) => el.addEventListener("click", () => go(el.dataset.go)));
    $$("[data-new]").forEach((el) => el.addEventListener("click", () => ({ pedido: () => pedidoModal(), cuenta: () => cuentaModal(), rutina: () => rutinaModal(), venta: () => ventaModal() })[el.dataset.new]()));
  }
  function bindTasks(formSel) {
    const f = $(formSel);
    if (f) f.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(f));
      if (!fd.t.trim()) return;
      create("tareas", { Tarea: fd.t.trim(), Estado: "Pendiente", "Área": fd.a || "Personal", Fecha: fd.f || (formSel === "#addTask" ? todayISO() : null) });
    });
    $$("#main .item [data-act]").forEach((b) => b.addEventListener("click", (e) => {
      const id = rowId(e), t = S.data.tareas.find((x) => x.id === id);
      if (!t) return;
      if (b.dataset.act === "toggle") patch("tareas", id, { Estado: t.Estado === "Hecha" ? "Pendiente" : "Hecha" });
      if (b.dataset.act === "del") remove("tareas", id, b.closest(".item"));
    }));
  }

  BIND.hoy = () => {
    bindCommon();
    bindTasks("#addTask");
    $("#nextq").addEventListener("click", () => {
      const p = $("#frase"); p.classList.add("out");
      setTimeout(() => { fraseIdx = (fraseIdx + 1) % FRASES.length; p.textContent = `“${FRASES[fraseIdx]}”`; p.classList.remove("out"); }, 300);
    });
  };
  BIND.resumen = () => {
    bindCommon();
    $("#period").addEventListener("click", (e) => { const b = e.target.closest("[data-p]"); if (b) { S.period = b.dataset.p; store.set("period", S.period); lastTab = null; render(); } });
    $("#goalForm").addEventListener("submit", (e) => { e.preventDefault(); S.goal = Number(new FormData(e.target).get("g")) || 0; store.set("goal", S.goal); toast("Meta guardada"); render(); });
    $$("[data-big]").forEach((c) => c.addEventListener("click", () => bigChart(c.dataset.big)));
  };
  BIND.comisiones = () => {
    bindCommon();
    const cv = $("#comView");
    if (cv) cv.addEventListener("click", (e) => { const b = e.target.closest("[data-v]"); if (b) { S.comView = b.dataset.v; store.set("comView", S.comView); lastTab = null; render(); } });
    $$("#main [data-open]").forEach((c) => c.addEventListener("click", (e) => {
      if (e.target.closest("[data-act],select,button,input")) return;
      detailModal(c.dataset.id);
    }));
    $$("#main [data-act]").forEach((b) => {
      const ev = b.tagName === "SELECT" ? "change" : "click";
      b.addEventListener(ev, (e) => {
        e.stopPropagation();
        const id = rowId(e), p = ped().find((x) => x.id === id);
        if (!p) return;
        const a = b.dataset.act;
        if (a === "img") pickImages(id);
        if (a === "time") timeModal(id);
        if (a === "edit") pedidoModal(S.data.pedidos.find((x) => x.id === id));
        if (a === "del") { if (confirm(`¿Mover "${p.title}" a la papelera de Notion?`)) remove("pedidos", id, b.closest(".item")); }
        if (a === "method") patch("pedidos", id, { "Método de pago": b.value });
        if (a === "paid") {
          const sel = b.closest("[data-id]").querySelector("select");
          patch("pedidos", id, { Estado: "Listo", "Fecha de pago": todayISO(), Cobrado: p.Precio, "Método de pago": sel ? sel.value : p["Método de pago"] });
          confetti(b);
          toast("¡Pago registrado! 🎉");
        }
      });
    });
  };
  BIND.pendientes = () => {
    bindCommon();
    $("#addPend").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const fd = Object.fromEntries(new FormData(form));
      form.reset();
      const cid = await ensureClient(fd.client);
      const name = (clientById(cid) || {}).Nombre || fd.client.trim();
      create("pedidos", {
        Cliente: `${name} — ${fd.title.trim()}`, Encargo: fd.title.trim(), Estado: "Sin empezar",
        Precio: fd.price === "" ? null : Number(fd.price), Moneda: fd.cur, Cobrado: 0, "Segundos trabajados": 0,
        "Fecha de pedido": todayISO(), "Fecha de entrega": fd.due || null,
        "Ficha de cliente": cid ? [cid] : [],
      });
    });
    $$("#main .item [data-act]").forEach((b) => b.addEventListener("click", (e) => {
      const id = rowId(e), p = S.data.pedidos.find((x) => x.id === id);
      if (!p) return;
      const a = b.dataset.act;
      if (a === "timer") {
        if (S.timers[id]) {
          const add = (Date.now() - S.timers[id]) / 1000;
          delete S.timers[id]; store.set("timers", S.timers);
          patch("pedidos", id, { "Segundos trabajados": Math.round((Number(p["Segundos trabajados"]) || 0) + add) });
        } else {
          S.timers[id] = Date.now(); store.set("timers", S.timers);
          if (p.Estado !== "En curso") patch("pedidos", id, { Estado: "En curso" }); else render();
        }
      }
      if (a === "treset") { if (confirm("¿Poner el cronómetro a cero?")) { delete S.timers[id]; store.set("timers", S.timers); patch("pedidos", id, { "Segundos trabajados": 0 }); } }
      if (a === "time") timeModal(id);
      if (a === "edit") pedidoModal(p);
      if (a === "del") { if (confirm("¿Mover este pedido a la papelera de Notion?")) remove("pedidos", id, b.closest(".item")); }
      if (a === "finish") {
        const ch = { Estado: "En espera de revisión", "Fecha de entrega": todayISO() };
        if (S.timers[id]) { ch["Segundos trabajados"] = Math.round((Number(p["Segundos trabajados"]) || 0) + (Date.now() - S.timers[id]) / 1000); delete S.timers[id]; store.set("timers", S.timers); }
        confetti(b);
        b.closest(".item").classList.add("leaving");
        setTimeout(() => { patch("pedidos", id, ch); toast("Movido a Comisiones → esperando pago"); }, 380);
      }
    }));
    bindUpfront();
  };

  // Casilla de upfront + importe: se guarda en "Adelanto pagado" y "Cobrado" del pedido en Notion.
  function bindUpfront(root = document) {
    $$("[data-up]", root).forEach((chk) => chk.addEventListener("change", (e) => {
      const id = rowId(e);
      const zone = chk.closest(".upf"), amt = $(".upf-amt", zone);
      // Al marcarla solo aparece el campo; se guarda cuando escribes el importe.
      if (chk.checked) { amt.hidden = false; $("input", amt).focus(); }
      else { amt.hidden = true; patch("pedidos", id, { "Adelanto pagado": false, Cobrado: 0 }); }
    }));
    $$("[data-upamt]", root).forEach((inp) => {
      const save = (e) => {
        const id = rowId(e), row = S.data.pedidos.find((x) => x.id === id);
        if (!row) return;
        const v = inp.value === "" ? 0 : Math.max(0, Number(inp.value));
        if (row.Precio != null && v > Number(row.Precio)) { toast("El upfront no puede ser mayor que el precio", true); inp.value = row.Cobrado ?? ""; return; }
        if (v !== (Number(row.Cobrado) || 0)) { patch("pedidos", id, { "Adelanto pagado": v > 0, Cobrado: v }); toast(v ? "Upfront guardado" : "Upfront quitado"); }
      };
      inp.addEventListener("change", save);
      inp.addEventListener("keydown", (k) => { if (k.key === "Enter") inp.blur(); });
    });
  }
  BIND.clientes = () => {
    bindCommon();
    const q = $("#clientQ");
    q.addEventListener("input", () => { clientQ = q.value; const pos = q.selectionStart; render(); const n = $("#clientQ"); n.focus(); n.setSelectionRange(pos, pos); });
    $$("[data-client]").forEach((c) => c.addEventListener("click", () => clientModal(c.dataset.client)));
    const nb = $("[data-newclient]"); if (nb) nb.addEventListener("click", newClientModal);
  };
  BIND.dinero = () => {
    bindCommon();
    $$("#main .item[data-id] [data-act]").forEach((b) => b.addEventListener("click", (e) => {
      const id = rowId(e), c = S.data.cuentas.find((x) => x.id === id);
      if (!c) return;
      if (b.dataset.act === "edit") cuentaModal(c);
      if (b.dataset.act === "del") { if (confirm(`¿Mover "${c.Cuenta}" a la papelera de Notion?`)) remove("cuentas", id, b.closest(".item")); }
      if (b.dataset.act === "editSaldo") {
        const inp = document.createElement("input");
        inp.className = "inp"; inp.type = "number"; inp.step = "0.01"; inp.value = c.Saldo; inp.style.width = "120px";
        b.replaceWith(inp); inp.focus(); inp.select();
        const save = () => { const v = Number(inp.value); if (inp.value !== "" && v !== c.Saldo) patch("cuentas", id, { Saldo: v }); else render(); };
        inp.addEventListener("keydown", (k) => { if (k.key === "Enter") inp.blur(); if (k.key === "Escape") { inp.value = c.Saldo; inp.blur(); } });
        inp.addEventListener("blur", save);
      }
    }));
    $$("[data-fp] [data-act=delFp]").forEach((b) => b.addEventListener("click", () => { if (confirm("¿Borrar esta lectura?")) remove("funpay", b.closest("[data-fp]").dataset.fp, b.closest(".item")); }));
    $("#addFp").addEventListener("submit", (e) => {
      e.preventDefault(); const fd = Object.fromEntries(new FormData(e.target));
      create("funpay", { Saldo: Number(fd.saldo), Retirado: Number(fd.ret) || 0, Fecha: fd.fecha || todayISO(), Nota: fd.nota || "lectura" });
    });
    $("#robuxRate").addEventListener("click", () => {
      const v = prompt("¿Cuántos dólares vale 1 Robux para ti?", S.robux);
      if (v && isFinite(+v.replace(",", "."))) { S.robux = +v.replace(",", "."); store.set("robuxRate", S.robux); render(); }
    });
  };
  BIND.vida = () => {
    bindCommon();
    bindTasks("#addTask2");
    $$(".tl [data-act]").forEach((b) => b.addEventListener("click", (e) => {
      const id = rowId(e), r = S.data.rutina.find((x) => x.id === id);
      if (b.dataset.act === "editR") rutinaModal(r);
      if (b.dataset.act === "delR" && confirm("¿Borrar este bloque?")) remove("rutina", id);
    }));
    $$("[data-act=delV]").forEach((b) => b.addEventListener("click", (e) => { if (confirm("¿Borrar?")) remove("ventas", rowId(e), b.closest(".item")); }));
  };

  // ================= Efectos =================
  function confetti(anchor) {
    const r = anchor.getBoundingClientRect();
    const colors = ["#2f8cff", "#2fd36b", "#f5b83d", "#ff6b9a", "#a77bff"];
    for (let i = 0; i < 26; i++) {
      const p = document.createElement("i");
      const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 90;
      p.style.cssText = `position:fixed;z-index:80;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;width:6px;height:${4 + Math.random() * 6}px;border-radius:2px;background:${colors[i % 5]};pointer-events:none;transition:transform .9s cubic-bezier(.2,.8,.2,1),opacity .9s`;
      document.body.appendChild(p);
      requestAnimationFrame(() => { p.style.transform = `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 40}px) rotate(${Math.random() * 720}deg)`; p.style.opacity = 0; });
      setTimeout(() => p.remove(), 1000);
    }
  }
  let toastT;
  function toast(msg, bad) {
    const t = $("#toast");
    t.innerHTML = `<span style="color:${bad ? "var(--bad)" : "var(--ok)"}">●</span>${esc(msg)}`;
    t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2600);
  }

  // Cronómetros en vivo
  setInterval(() => {
    $$("[data-timer]").forEach((el) => {
      const p = S.data.pedidos.find((x) => x.id === el.dataset.timer);
      if (p && S.timers[p.id]) el.textContent = hms(secondsOf(p));
    });
  }, 1000);

  // ================= Bloqueo con PIN =================
  function lockScreen(msg) {
    let pin = "";
    $("#app").innerHTML = `
      <div class="lock"><div class="box">
        <div class="brand" style="justify-content:center"><span class="dot"></span>Panel de Vida</div>
        <h1>Introduce tu PIN</h1><p>${esc(msg || "Tus datos se cargan desde Notion solo con el PIN correcto.")}</p>
        <div class="pins" id="pins">${"<span></span>".repeat(6)}</div>
        <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "✓"].map((k) => `<button data-k="${k}">${k}</button>`).join("")}</div>
        <label style="display:flex;gap:8px;justify-content:center;align-items:center;margin-top:18px;color:var(--muted);font-size:12px"><input type="checkbox" id="remember"> Recordar en este dispositivo</label>
        <div class="note">El PIN nunca se guarda en GitHub: lo comprueba tu Worker de Cloudflare.</div>
      </div></div>`;
    const paint = () => $$("#pins span").forEach((s, i) => s.classList.toggle("f", i < pin.length));
    const submit = async () => {
      if (pin.length < 4) return shake();
      S.pin = pin;
      try {
        await loadAll();
        sess.set("pin", pin);
        if ($("#remember").checked) store.set("pinRemember", pin);
        start();
      } catch (e) { S.pin = null; pin = ""; paint(); shake(); toast(e.message, true); }
    };
    const shake = () => { const p = $("#pins"); p.classList.remove("shake"); void p.offsetWidth; p.classList.add("shake"); };
    const key = (k) => { if (k === "⌫") pin = pin.slice(0, -1); else if (k === "✓") return submit(); else if (pin.length < 6) pin += k; paint(); if (pin.length === 6) submit(); };
    $(".pad").addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (b) key(b.dataset.k); });
    document.onkeydown = (e) => { if (!$(".pad")) return; if (/^\d$/.test(e.key)) key(e.key); if (e.key === "Backspace") key("⌫"); if (e.key === "Enter") key("✓"); };
  }
  function lockOut() { S.pin = null; S.loaded = false; sess.set("pin", null); lockScreen(); }

  async function refresh() {
    try { await loadAll(); render(); toast(S.demo ? "Datos de demo recargados" : "Actualizado desde Notion"); }
    catch (e) { toast(e.message, true); }
  }

  function start() {
    document.onkeydown = null;
    shell(); lastTab = null; render(); loadRates();
    // Se actualiza solo cada 2 minutos cuando la pestaña está visible.
    setInterval(() => { if (document.visibilityState === "visible" && !$(".modal-bg") && !document.activeElement.matches("input,select")) loadAll().then(render).catch(() => {}); }, 120000);
    setInterval(() => { if (document.visibilityState === "visible") loadRates(); }, 30 * 60000);
  }

  async function boot() {
    if (S.demo) { await loadAll(); start(); toast("Modo demo: datos inventados"); return; }
    if (!S.pin) return lockScreen();
    try { await loadAll(); start(); } catch { lockScreen("Vuelve a introducir tu PIN."); }
  }
  boot();
})();
