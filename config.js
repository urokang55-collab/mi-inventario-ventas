// Configuración para Google Sheets Integration
// ¡COMPLETA ESTA URL CON LA DE TU GOOGLE APPS SCRIPT!
window.CONFIG = {
  // Reemplaza esta URL con la URL de tu Google Apps Script
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyYl0y6IWNU8nUbdWK6zSzkBLlmnoNlW_O7KYL-ncm6t3Si8NlvRDadxuIz5rJEgaHh/exec",
  
  // Modo de sincronización
  SYNC_MODE: "google_sheets", // "localStorage" para modo local, "google_sheets" para sincronización
  
  // Configuración de la aplicación
  APP_NAME: "Mi Inventario y Ventas",
  VERSION: "2.0",
  
  // Configuración de Google Sheets
  WORKSHEET_NAMES: {
    PRODUCTS: "Productos",
    SALES: "Ventas"
  },
  
  // Configuración de UI
  UI: {
    SHOW_SYNC_STATUS: true,
    AUTO_REFRESH: true,
    REFRESH_INTERVAL: 30000 // 30 segundos
  }
};

// Verificación de configuración
if (CONFIG.GOOGLE_SCRIPT_URL.includes("XXXXXXXXXXXXXXXX")) {
  console.warn("⚠️ CONFIGURACIÓN REQUERIDA: Completa la URL del Google Apps Script en config.js");
}