// Configuración de la aplicación
window.CONFIG = {
    // ✅ URL correcta del Google Apps Script actualizado
    GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyYl0y6IWNU8nUbdWK6zSzkBLlmnoNlW_O7KYL-ncm6t3Si8NlvRDadxuIz5rJEgaHh/exec",
    
    // Modo de sincronización - HÍBRIDO: Intenta Google Sheets, luego localStorage
    SYNC_MODE: "hybrid", // "hybrid", "google_sheets", "localStorage"
    
    // Configuración UI
    UI: {
        AUTO_REFRESH: true,
        REFRESH_INTERVAL: 30000, // 30 segundos
        NOTIFICATION_DURATION: 3000
    },
    
    // Nombres de las hojas en Google Sheets
    WORKSHEETS: {
        PRODUCTS: "Productos",
        SALES: "Ventas"
    },
    
    // Configuración de debug
    DEBUG: true
};