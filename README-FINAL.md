# 📱 Mi Inventario y Ventas v2.0

Una aplicación web moderna y minimalista para gestionar inventario y ventas, optimizada para dispositivos Android con **sincronización automática entre dispositivos** usando Google Sheets.

## ✨ Características Principales v2.0

### 📦 **Gestión de Inventario**
- Agregar productos con precio de compra y precio de venta
- Control automático de stock
- Alertas de stock bajo (≤5 unidades)
- Búsqueda de productos en tiempo real
- Edición y eliminación de productos
- **NUEVO: Sincronización automática** entre dispositivos

### 💰 **Sistema de Ventas**
- Selección múltiple de productos del inventario
- Control de cantidades con validación de stock
- Cálculo automático del total
- Registro de nombre del cliente
- Métodos de pago: Efectivo, Tarjeta, Transferencia, A Crédito
- Historial completo de ventas realizadas
- **NUEVO: Mark créditos como pagados**

### 📊 **Reportes Avanzados**
- Ventas del día con totales
- **NUEVO: Ganancia del día** (precio venta - precio compra)
- **NUEVO: Ganancia total acumulada**
- Cantidad de productos en stock
- **NUEVO: Créditos pendientes vs. pagados**
- Productos con stock bajo
- **NUEVO: Filtros avanzados** (hoy, semana, mes, créditos)

### 🌐 **Sincronización en la Nube**
- **NUEVO: Google Sheets integration** para datos compartidos
- **NUEVO: Funciona en múltiples dispositivos** automáticamente
- **NUEVO: Funciona offline** y sincroniza cuando hay internet
- **NUEVO: Indicador de estado** de sincronización
- **NUEVO: Notificaciones** de éxito/error
- Respaldo automático en Google Sheets

### 🎨 **Diseño Moderno**
- Interfaz minimalista y profesional
- Optimizada para dispositivos móviles
- Navegación por pestañas intuitiva
- Animaciones suaves y responsivas
- Accesibilidad mejorada

### 🔧 **Funcionalidades Técnicas**
- Aplicación PWA (Progressive Web App)
- **NUEVO: Sincronización en tiempo real**
- Funciona completamente offline
- **NUEVO: Base de datos en la nube** (Google Sheets)
- Instalable en Android como app nativa
- **NUEVO: Respaldo automático** entre dispositivos

---

## 🚀 **INSTALACIÓN RÁPIDA CON SINCRONIZACIÓN**

### **✨ ¿Qué incluye esta versión?**
- ✅ **Datos compartidos** entre 2 dispositivos
- ✅ **100% Gratis** para siempre
- ✅ **Sincronización automática**
- ✅ **Funciona offline**

### **⏱️ Tiempo estimado: 30-45 minutos**

### **📋 Archivos necesarios:**
- `index.html` - Interfaz principal
- `script.js` - Lógica de la aplicación  
- `styles.css` - Estilos y diseño
- `config.js` - **NUEVO: Configuración Google Sheets**
- `manifest.json` - Configuración PWA
- `sw.js` - Servicio offline
- `datos-ejemplo.js` - Datos de prueba

---

## 📖 **GUÍA DE INSTALACIÓN COMPLETA**

### **Opción A: Instalación Automática (Recomendada)**
1. Sigue la guía paso a paso en: `INSTRUCCIONES_COMPLETAS.md`
2. O usa el checklist en: `CHECKLIST_INSTALACION.md`

### **Opción B: GitHub Pages + Google Sheets**
1. **Crea Google Sheet** para almacenar datos
2. **Crea Google Apps Script** como backend
3. **Configura la aplicación** con las URLs
4. **Sube a GitHub Pages** para hosting gratuito
5. **Instala en dispositivos** como PWA

---

## 💾 **CONFIGURACIÓN DE GOOGLE SHEETS**

### **Pasos básicos:**
1. **Crear Google Sheet** con columnas para productos y ventas
2. **Crear Google Apps Script** con las funciones de backend
3. **Configurar URLs** en `config.js`
4. **Desplegar como aplicación web**

### **Beneficios de la integración:**
- **Datos sincronizados** entre dispositivos
- **Respaldo automático** en Google
- **Acceso desde cualquier lugar**
- **Sin pérdida de datos** al cambiar de dispositivo

---

## 📱 **INSTALACIÓN EN DISPOSITIVOS MÓVILES**

### **Instalación como PWA**
1. Abre la URL de tu aplicación en Chrome
2. Toca el menú del navegador (⋮)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma la instalación
5. La aplicación aparecerá como un icono en tu pantalla de inicio

### **Uso Offline**
- ✅ La aplicación funciona sin internet
- ✅ Los datos se guardan localmente
- ✅ Se sincroniza automáticamente cuando vuelve la conexión

---

## 🎯 **CÓMO USAR LA APLICACIÓN**

### **Navegación Principal**
- **Inventario**: Gestionar productos y stock
- **Venta**: Crear nuevas ventas
- **Historial**: Ver ventas realizadas
- **Reportes**: Resúmenes y estadísticas

### **Agregar Producto**
1. Ve a la pestaña "Inventario"
2. Toca "Agregar Producto" o el botón flotante (+)
3. Completa los datos:
   - Nombre del producto
   - Precio de compra
   - Precio de venta
   - Cantidad inicial
4. Toca "Guardar"

### **Realizar una Venta**
1. Ve a la pestaña "Venta"
2. Busca y selecciona productos del inventario
3. Ajusta las cantidades con los botones +/- 
4. Ingresa el nombre del cliente
5. Selecciona el método de pago
6. Toca "Completar Venta"

### **Gestión de Créditos**
- Selecciona "A Crédito" como método de pago
- El sistema marcará la venta como pendiente
- Se registrará en el historial como "A Crédito"
- **NUEVO: Puedes marcar las ventas a crédito como pagadas**
- **NUEVO: Filtros separados para crédito pendiente y pagado**
- **NUEVO: Los reportes distinguen entre crédito pendiente y pagado**

### **Ver Reportes**
- Ve a la pestaña "Reportes"
- Visualiza:
  - **Total de ventas del día (pagadas)**
  - **Ganancia del día** (calculada automáticamente)
  - Número de productos en inventario
  - **Total de ventas a crédito pendientes**
  - **Total de créditos pagados**
  - **Ganancia total acumulada**
  - Productos con stock bajo

---

## 🧪 **DATOS DE PRUEBA**

Para probar las funcionalidades, ejecuta en la consola del navegador (F12):

```javascript
// Cargar productos de ejemplo
cargarProductosEjemplo()

// Cargar ventas de ejemplo  
cargarVentasEjemplo()

// Mostrar estadísticas
mostrarEstadisticas()

// Marcar créditos como pagados (para pruebas)
marcarCreditosPagados()
```

---

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **Error de sincronización**
- Verificar que la URL en `config.js` esté correcta
- Asegurarse de que el Apps Script esté desplegado como "Aplicación web"

### **No se ven los datos**
- Abrir la consola del navegador (F12) y revisar errores
- Verificar que el ID del Google Sheet sea correcto

### **La aplicación no carga**
- Asegurarse de que todos los archivos estén en GitHub
- Verificar que GitHub Pages esté activado

### **No se sincronizan entre dispositivos**
- Ambos dispositivos deben usar la misma URL
- Al menos un dispositivo debe tener internet al mismo tiempo para sincronizar
- Verificar que ambos tengan la misma versión de la aplicación

---

## 📊 **CARACTERÍSTICAS TÉCNICAS v2.0**

### **Frontend**
- HTML5, CSS3, JavaScript ES6+
- Responsive design mobile-first
- PWA (Progressive Web App)
- Service Worker para offline

### **Backend**
- Google Sheets como base de datos
- Google Apps Script como API
- Sincronización automática cada 30 segundos
- Manejo de errores y reconexión

### **Almacenamiento**
- Google Sheets para datos principales
- localStorage como caché local
- Funciona offline con sincronización posterior

### **Compatibilidad**
- Chrome, Samsung Internet, Edge
- Android 5.0+
- iOS Safari 11.1+

---

## 🚀 **ACTUALIZACIONES Y VERSIONES**

### **v2.0 (Actual)**
- ✅ Integración con Google Sheets
- ✅ Sincronización automática entre dispositivos
- ✅ Indicador de estado de sincronización
- ✅ Funciona offline con sincronización posterior
- ✅ Notificaciones de estado

### **v1.0**
- ✅ Gestión básica de inventario
- ✅ Sistema de ventas
- ✅ Reportes de ganancias
- ✅ Gestión de créditos

---

## 📞 **SOPORTE**

### **Documentación completa:**
- `INSTRUCCIONES_COMPLETAS.md` - Guía paso a paso
- `CHECKLIST_INSTALACION.md` - Lista de verificación

### **Archivos de configuración:**
- `config.js` - Configuración de Google Sheets
- `styles.css` - Estilos principales
- `sync-styles.css` - Estilos de sincronización

### **Para desarrolladores:**
- Código comentado y documentado
- Arquitectura modular y escalable
- Fácil personalización

---

## 🎉 **¡LISTO PARA USAR!**

Con esta aplicación tendrás:
- **Gestión completa** de inventario y ventas
- **Datos sincronizados** entre tus dispositivos
- **Funcionamiento offline** cuando no hay internet
- **Reportes detallados** de ganancias
- **100% Gratis** para siempre

**¡Disfruta tu nueva aplicación de gestión empresarial!** 🚀📱💰

---

*Desarrollado por MiniMax Agent - Una solución completa para pequeños negocios*