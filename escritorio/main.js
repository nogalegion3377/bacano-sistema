// Pizza Bacano · programa de escritorio
// Abre el sistema (alojado en Vercel) en una ventana propia e imprime directo en la comandera.
const { app, BrowserWindow, ipcMain, shell, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

// Link del sistema en Vercel. Se puede cambiar desde la pantalla de configuración (Ctrl + ,).
const LINK_POR_DEFECTO = "https://bacano-sistema.vercel.app";

const archivoConfig = () => path.join(app.getPath("userData"), "configuracion.json");
function leerConfig() {
  try { return { link: LINK_POR_DEFECTO, impresora: "", copias: 1, ...JSON.parse(fs.readFileSync(archivoConfig(), "utf8")) }; }
  catch { return { link: LINK_POR_DEFECTO, impresora: "", copias: 1 }; }
}
function guardarConfig(c) { fs.mkdirSync(path.dirname(archivoConfig()), { recursive: true }); fs.writeFileSync(archivoConfig(), JSON.stringify(c, null, 2)); }

let ventana = null, reintento = null;
const pantalla = nombre => path.join(__dirname, "pantallas", nombre);
const origen = u => { try { return new URL(u).origin; } catch { return ""; } };

function abrirSistema() {
  clearTimeout(reintento);
  const { link } = leerConfig();
  if (!link) return ventana.loadFile(pantalla("configuracion.html"));
  ventana.loadURL(link);
}

function crearVentana() {
  ventana = new BrowserWindow({
    width: 1366, height: 860, minWidth: 900, minHeight: 600,
    title: "Pizza Bacano", icon: path.join(__dirname, "build", "icon.png"),
    backgroundColor: "#ffffff", show: false, autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  ventana.once("ready-to-show", () => { ventana.maximize(); ventana.show(); });

  // Sin internet: mostrar aviso y reintentar solo
  ventana.webContents.on("did-fail-load", (_e, codigo, _desc, url, esPrincipal) => {
    if (!esPrincipal || codigo === -3) return; // -3 = carga cancelada
    if (url && url.startsWith("file:")) return;
    ventana.loadFile(pantalla("sin-conexion.html"));
    reintento = setTimeout(abrirSistema, 10000);
  });

  // Solo se navega dentro del sistema; cualquier otro link se abre en el navegador
  const permitido = u => u.startsWith("file:") || (leerConfig().link && origen(u) === origen(leerConfig().link));
  ventana.webContents.on("will-navigate", (e, u) => { if (!permitido(u)) { e.preventDefault(); shell.openExternal(u); } });
  ventana.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: "deny" }; });

  // Atajos: F5 recargar, Ctrl+, configuración, F11 pantalla completa
  ventana.webContents.on("before-input-event", (e, input) => {
    if (input.type !== "keyDown") return;
    if (input.key === "F5") { e.preventDefault(); abrirSistema(); }
    if (input.key === "," && input.control) { e.preventDefault(); ventana.loadFile(pantalla("configuracion.html")); }
    if (input.key === "F11") { e.preventDefault(); ventana.setFullScreen(!ventana.isFullScreen()); }
  });

  abrirSistema();
}

// ===== Comunicación con la pantalla =====
ipcMain.handle("imprimir", () => new Promise(resolve => {
  const c = leerConfig();
  const opciones = { silent: !!c.impresora, printBackground: false, copies: Math.max(1, +c.copias || 1), margins: { marginType: "none" } };
  if (c.impresora) opciones.deviceName = c.impresora;
  ventana.webContents.print(opciones, (ok, error) => resolve(ok ? { ok: true } : { error: error === "cancelled" ? "" : (error || "error desconocido") }));
}));
ipcMain.handle("impresoras", async () => (await ventana.webContents.getPrintersAsync()).map(p => ({ nombre: p.name, visible: p.displayName || p.name, predeterminada: p.isDefault })));
ipcMain.handle("leer-config", () => leerConfig());
ipcMain.handle("guardar-config", (_e, nueva) => {
  const c = { ...leerConfig(), ...nueva };
  c.link = String(c.link || "").trim().replace(/\/+$/, "");
  if (c.link && !/^https:\/\//.test(c.link)) return { error: "El link tiene que empezar con https://" };
  guardarConfig(c);
  return { ok: true };
});
ipcMain.handle("abrir-sistema", () => abrirSistema());
ipcMain.handle("abrir-configuracion", () => ventana.loadFile(pantalla("configuracion.html")));
ipcMain.handle("version", () => app.getVersion());

// Una sola ventana abierta a la vez
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on("second-instance", () => { if (ventana) { if (ventana.isMinimized()) ventana.restore(); ventana.focus(); } });
  app.whenReady().then(() => { Menu.setApplicationMenu(null); crearVentana(); });
  app.on("window-all-closed", () => app.quit());
}
