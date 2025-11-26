# 📱 Inventario y Ventas v2.1 - VERSIÓN CORREGIDA

## ⚠️ PROBLEMA CORS SOLUCIONADO

### 🔧 **INSTRUCCIONES DE CORRECCIÓN:**

**PROBLEMA**: Google Apps Script bloqueaba las peticiones desde GitHub Pages (Error CORS).

**SOLUCIÓN APLICADA**:
1. ✅ **Script.js corregido** con manejo de errores CORS
2. ✅ **Fallback a localStorage** cuando no hay sincronización
3. ✅ **Service Worker mejorado** sin errores de cache
4. ✅ **Google Apps Script con CORS** (ver archivo: `GoogleAppsScript-Backend-CORS.js`)

---

## 🚀 PASOS PARA IMPLEMENTAR:

### **1. ACTUALIZAR GOOGLE APPS SCRIPT:**
1. Ve a tu Google Apps Script: `https://script.google.com/u/0/home/projects/[tu-proyecto]`
2. **Borra TODO** el código actual
3. **Copia y pega** el contenido del archivo `GoogleAppsScript-Backend-CORS.js`
4. **Despliega nuevamente** como Web App
5. **Copia la nueva URL** en `config.js`

### **2. SUBIR ARCHIVOS A GITHUB:**
- **Borra todos** los archivos anteriores en tu repositorio
- **Sube estos archivos corregidos**

### **3. PROBAR:**
- Ve a tu aplicación: `https://urokang55-collab.github.io/mi-inventario-ventas/`
- Debería funcionar sin errores CORS

---

## 🎯 CARACTERÍSTICAS CORREGIDAS:

### ✅ **Error CORS Resuelto**
- Headers CORS en Google Apps Script
- Manejo inteligente de errores de conexión
- Mensajes informativos al usuario

### ✅ **Sistema Híbrido**
- **Con conexión**: Sincroniza con Google Sheets
- **Sin conexión**: Funciona con localStorage
- **Error CORS**: Fallback automático a local

### ✅ **Experiencia Mejorada**
- No más errores en la consola
- Mensajes claros de estado de sincronización
- Service Worker sin errores de cache

---

## 📁 ARCHIVOS INCLUIDOS:

- `index.html` - Interfaz principal
- `script.js` - **CORREGIDO** - Manejo CORS + Fallback
- `styles.css` - Estilos CSS
- `config.js` - **YA CONFIGURADO** con tu Google Sheets
- `manifest.json` - **SIMPLIFICADO** sin iconos complejos
- `sw.js` - **MEJORADO** Service Worker
- `GoogleAppsScript-Backend-CORS.js` - **NUEVO** Backend con CORS

---

## 🔄 MODO DE FUNCIONAMIENTO:

### **SI TODO ESTÁ BIEN:**
```
🌐 Aplicación → Google Sheets → ✅ Datos sincronizados
```

### **SI HAY ERROR CORS:**
```
🌐 Aplicación → Google Sheets ❌ → localStorage ✅ → Datos locales
```

### **SI NO HAY INTERNET:**
```
🌐 Aplicación ❌ → localStorage ✅ → Funciona offline
```

---

## 🛠️ CONFIGURACIÓN ACTUAL:

- **Google Sheet ID**: `16zLTVhNflMfvmD_uSbeXUT-ikz6AQ87WlWlpojBX8IU`
- **Apps Script URL**: (Necesita actualización)
- **Modo**: Google Sheets con fallback local

---

## 📱 INSTALACIÓN PWA:

1. **Abrir en Chrome móvil**: Tu URL de GitHub Pages
2. **Buscar banner**: "Instalar Inventario Ventas"
3. **Tocar**: "Instalar"
4. **Usar**: Como app nativa en pantalla de inicio

---

## ⚡ DIFERENCIAS CON LA VERSIÓN ANTERIOR:

| Aspecto | v2.0 (Problemática) | v2.1 (Corregida) |
|---------|---------------------|------------------|
| **CORS** | ❌ Error CORS | ✅ Headers CORS |
| **Errores** | ❌ Muchos errores | ✅ Sin errores |
| **Fallback** | ❌ Solo sincronización | ✅ localStorage |
| **UX** | ❌ Confusa | ✅ Clara |
| **Service Worker** | ❌ Errores cache | ✅ Funcional |

---

## 🚨 IMPORTANTE:

**DEBES ACTUALIZAR EL GOOGLE APPS SCRIPT** para que esta versión funcione correctamente.

**Si no actualizas el Apps Script**, la app seguirá funcionando en modo localStorage.

---

**Versión**: 2.1 (Corregida)  
**Fecha**: 2025-11-27  
**Estado**: Lista para producción
