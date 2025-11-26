// Configuración de la aplicación
window.CONFIG = {
    // URL del Google Apps Script
    GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyYl0y6IWNU8nUbdWK6zSzkBLlmnoNlW_O7KYL-ncm6t3Si8NlvRDadxuIz5rJEgaHh/exec",
    
    // Modo de sincronización
    SYNC_MODE: "google_sheets", // Opciones: "localStorage", "google_sheets"
    
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
    }
};
