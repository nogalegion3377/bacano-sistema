# Sistema Pizza Bacano

Sistema de gestión de la pizzería: comandas con impresión, clientes con fiado y comentarios, mercadería con recetas y compras de emergencia, reportes, cierre de caja e historial de cambios.

## Partes

| Carpeta | Qué es | Dónde corre |
|---|---|---|
| `web/` | La pantalla del sistema (HTML, CSS, JS) | **Vercel** (se actualiza solo con cada cambio que se sube acá) |
| `escritorio/` | Programa de Windows (Electron) que abre la web e imprime directo en la comandera | La PC de la pizzería |
| Base de datos | Tablas, cálculos automáticos y permisos | **Supabase** |

## Vercel

Importar este repositorio en Vercel con **Root Directory = `web`**. No necesita build: es HTML estático.

## Programa de escritorio

```bash
cd escritorio
npm install
npm start            # probarlo
npm run instalador   # crea dist/Instalar-Pizza-Bacano.exe
```

La primera vez pide el link de Vercel y la impresora. Atajos: **F5** recargar · **Ctrl + ,** configuración · **F11** pantalla completa.

## Cómo hacer cambios

- **Precios, productos, recetas, mercadería, clientes:** desde el mismo sistema, sin tocar código.
- **Pantalla:** editar `web/app.js` (lógica) o `web/estilos.css` (diseño), subir el cambio y Vercel lo publica en un minuto. En la pizzería se ve al apretar F5.
- **Base de datos:** desde Supabase. Con cuidado: son los datos reales del negocio.

> No subir cambios en horario pico (viernes y sábado a la noche). Probar siempre antes.
