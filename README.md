# 📱 Inventario y Ventas v2.0

## ✨ Características

- **📊 Gestión de Inventario**: Agrega, edita y elimina productos con precios de compra y venta
- **🛒 Sistema de Ventas**: Registro completo de ventas con información del cliente
- **📈 Reportes y Analytics**: Visualiza ganancias, ventas del día y créditos pendientes
- **☁️ Sincronización Automática**: Datos sincronizados entre dispositivos usando Google Sheets
- **📱 PWA Instalable**: Funciona como app nativa en móviles
- **💳 Gestión de Créditos**: Marca créditos como pagados
- **🔍 Búsqueda y Filtros**: Encuentra productos y ventas rápidamente

## 🚀 Instalación

1. **Subir a GitHub**: Sube todos estos archivos a tu repositorio GitHub
2. **Activar GitHub Pages**: Ve a Settings → Pages y activa el sitio
3. **Instalar en Móvil**: Abre la URL en Chrome y selecciona "Agregar a pantalla de inicio"

## 📋 Archivos Incluidos

- `index.html` - Interfaz principal
- `script.js` - Lógica de la aplicación con sincronización
- `styles.css` - Estilos CSS
- `config.js` - Configuración (ya configurado con tu Google Sheets)
- `manifest.json` - Configuración PWA
- `sw.js` - Service Worker para funcionamiento offline

## 🔧 Configuración Google Sheets

Tu aplicación ya está configurada con:
- **Google Sheet ID**: `16zLTVhNflMfvmD_uSbeXUT-ikz6AQ87WlWlpojBX8IU`
- **Apps Script URL**: `https://script.google.com/macros/s/AKfycbyYl0y6IWNU8nUbdWK6zSzkBLlmnoNlW_O7KYL-ncm6t3Si8NlvRDadxuIz5rJEgaHh/exec`

## 📱 Uso en Dispositivos

1. **Dispositivo 1**: Instala la aplicación desde GitHub Pages
2. **Dispositivo 2**: Instala la misma aplicación
3. **Sincronización**: Los datos se sincronizan automáticamente cada 30 segundos

## ⚡ Funciones Principales

### Inventario
- Agregar productos con precio de compra y venta
- Control de stock automático
- Alertas de stock bajo

### Ventas
- Seleccionar productos del inventario
- Registrar cliente y método de pago
- Soporte para ventas a crédito
- Cálculo automático de ganancias

### Reportes
- Ventas del día
- Productos en stock
- Créditos pendientes
- Ganancias totales

## 🆘 Soporte

- **Sincronización**: Si no se sincroniza, verifica tu conexión a internet
- **Offline**: La app funciona sin internet, sincroniza al reconectarse
- **Google Sheets**: Asegúrate de que tu Google Sheet esté accesible

## 📝 Notas Técnicas

- La aplicación usa Google Sheets como base de datos en la nube
- Funciona completamente offline y sincroniza automáticamente
- Los datos se almacenan localmente y en Google Sheets
- Compatible con PWA para instalación en dispositivos móviles

---

**Versión**: 2.0  
**Última actualización**: $(date)  
**Autor**: MiniMax Agent
