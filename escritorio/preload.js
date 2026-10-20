// Puente entre la pantalla y el programa. Solo expone lo justo.
const { contextBridge, ipcRenderer } = require("electron");

const base = {
  esPrograma: true,
  imprimir: () => ipcRenderer.invoke("imprimir"),
  abrirConfiguracion: () => ipcRenderer.invoke("abrir-configuracion")
};

// Las pantallas propias del programa (configuración, sin conexión) pueden además tocar la configuración
const local = location.protocol === "file:" ? {
  impresoras: () => ipcRenderer.invoke("impresoras"),
  leerConfig: () => ipcRenderer.invoke("leer-config"),
  guardarConfig: c => ipcRenderer.invoke("guardar-config", c),
  abrirSistema: () => ipcRenderer.invoke("abrir-sistema"),
  version: () => ipcRenderer.invoke("version")
} : {};

contextBridge.exposeInMainWorld("bacanoApp", { ...base, ...local });
