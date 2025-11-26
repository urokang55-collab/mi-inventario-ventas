// 📱 Aplicación de Gestión de Inventario y Ventas v2.1
// Con sincronización híbrida robusta: Google Sheets + localStorage
// ✅ Manejo mejorado de errores CORS y conectividad

// Cargar configuración
const CONFIG = window.CONFIG || {
    GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyYl0y6IWNU8nUbdWK6zSzkBLlmnoNlW_O7KYL-ncm6t3Si8NlvRDadxuIz5rJEgaHh/exec",
    SYNC_MODE: "hybrid",
    DEBUG: true
};

// Variable global para datos
let appData = {
    products: [],
    sales: [],
    lastSync: null,
    syncMode: 'localStorage' // 'googleSheets' o 'localStorage'
};

// Clase mejorada para sincronización
class GoogleSheetsSync {
    constructor() {
        this.url = CONFIG.GOOGLE_SCRIPT_URL;
        this.isOnline = navigator.onLine;
        this.isSyncing = false;
        this.syncAttempts = 0;
        this.maxAttempts = 3;
        this.lastSuccessfulSync = null;
    }

    // Verificar si la URL es válida
    isValidUrl() {
        return this.url && 
               this.url !== "TU_NUEVA_URL_DE_GOOGLE_APPS_SCRIPT_AQUI" && 
               this.url.startsWith("https://script.google.com/macros/s/");
    }

    // Realizar petición con manejo robusto de errores
    async request(action, data = {}) {
        // Verificar URL primero
        if (!this.isValidUrl()) {
            throw new Error("URL del backend no configurada correctamente");
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action,
                    ...data
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Error de conexión: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success) {
                this.lastSuccessfulSync = new Date();
                this.syncAttempts = 0; // Reset contador en éxito
                return result;
            } else {
                throw new Error(result.message || 'Error desconocido del servidor');
            }

        } catch (error) {
            this.syncAttempts++;
            
            // Determinar tipo de error
            if (error.name === 'AbortError') {
                throw new Error('Timeout: El servidor no responde');
            } else if (error.message.includes('CORS') || error.message.includes('Access to fetch')) {
                throw new Error('Error CORS: Configurar headers en Google Apps Script');
            } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_FAILED')) {
                throw new Error('No se puede conectar con el servidor');
            } else {
                throw new Error(`Error de sincronización: ${error.message}`);
            }
        }
    }

    // Sincronizar productos desde Google Sheets
    async syncProducts() {
        try {
            const result = await this.request('getProducts');
            if (result.success && result.data) {
                appData.products = result.data;
                this.saveToLocalStorage();
                return { success: true, source: 'googleSheets', count: result.data.length };
            }
            throw new Error(result.message || 'No se recibieron productos');
        } catch (error) {
            console.error('Error sincronizando productos:', error);
            return { success: false, error: error.message, source: 'googleSheets' };
        }
    }

    // Sincronizar ventas desde Google Sheets
    async syncSales() {
        try {
            const result = await this.request('getSales');
            if (result.success && result.data) {
                appData.sales = result.data;
                this.saveToLocalStorage();
                return { success: true, source: 'googleSheets', count: result.data.length };
            }
            throw new Error(result.message || 'No se recibieron ventas');
        } catch (error) {
            console.error('Error sincronizando ventas:', error);
            return { success: false, error: error.message, source: 'googleSheets' };
        }
    }

    // Sincronización completa
    async syncAll() {
        if (this.isSyncing) return { success: false, message: 'Ya hay una sincronización en proceso' };
        
        this.isSyncing = true;
        showLoading(true);

        try {
            // Intentar sincronizar productos
            const productsResult = await this.syncProducts();
            
            // Intentar sincronizar ventas
            const salesResult = await this.syncSales();

            // Verificar resultados
            const hasSuccess = productsResult.success || salesResult.success;
            
            if (hasSuccess) {
                appData.syncMode = 'googleSheets';
                appData.lastSync = new Date();
                this.updateSyncStatus('Sincronizado con Google Sheets', 'success');
                
                renderProducts();
                renderSales();
                
                return {
                    success: true,
                    products: productsResult,
                    sales: salesResult,
                    mode: 'googleSheets'
                };
            } else {
                throw new Error('No se pudo sincronizar ningún dato');
            }

        } catch (error) {
            console.error('Error en sincronización completa:', error);
            
            // Fallback a localStorage
            this.loadFromLocalStorage();
            appData.syncMode = 'localStorage';
            this.updateSyncStatus('Usando datos locales', 'warning');
            
            renderProducts();
            renderSales();
            
            return {
                success: false,
                error: error.message,
                fallback: 'localStorage',
                mode: 'localStorage'
            };
        } finally {
            this.isSyncing = false;
            showLoading(false);
        }
    }

    // Guardar en localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('inventario_products', JSON.stringify(appData.products));
            localStorage.setItem('inventario_sales', JSON.stringify(appData.sales));
            localStorage.setItem('inventario_sync_time', new Date().toISOString());
        } catch (error) {
            console.error('Error guardando en localStorage:', error);
        }
    }

    // Cargar desde localStorage
    loadFromLocalStorage() {
        try {
            const products = localStorage.getItem('inventario_products');
            const sales = localStorage.getItem('inventario_sales');
            const syncTime = localStorage.getItem('inventario_sync_time');
            
            if (products) appData.products = JSON.parse(products);
            if (sales) appData.sales = JSON.parse(sales);
            if (syncTime) appData.lastSync = new Date(syncTime);
            
            console.log('Datos cargados desde localStorage:', {
                products: appData.products.length,
                sales: appData.sales.length
            });
        } catch (error) {
            console.error('Error cargando desde localStorage:', error);
            appData.products = [];
            appData.sales = [];
        }
    }

    // Actualizar estado de sincronización
    updateSyncStatus(message, type = 'info') {
        const statusElement = document.getElementById('syncStatus');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `sync-status ${type}`;
        }
        
        console.log(`[SYNC] ${message}`);
    }
}

// Instancia global del sincronizador
const syncManager = new GoogleSheetsSync();

// Función de inicialización mejorada
async function initializeApp() {
    try {
        showLoading(true);
        
        // Verificar configuración
        if (!syncManager.isValidUrl()) {
            showToast('⚠️ Configuración incompleta. Usando datos locales.', 'warning');
            syncManager.loadFromLocalStorage();
            appData.syncMode = 'localStorage';
        } else {
            // Intentar sincronización completa
            const result = await syncManager.syncAll();
            
            if (result.fallback === 'localStorage') {
                showToast('⚠️ No se pudo conectar con el servidor. Usando datos locales.', 'warning');
            } else if (result.success) {
                showToast('✅ Sincronizado correctamente', 'success');
            }
        }
        
        renderProducts();
        renderSales();
        updateUI();
        
    } catch (error) {
        console.error('Error inicializando aplicación:', error);
        showToast('Error inicializando la aplicación', 'error');
        
        // Fallback seguro
        syncManager.loadFromLocalStorage();
        appData.syncMode = 'localStorage';
        renderProducts();
        renderSales();
        
    } finally {
        showLoading(false);
    }
}

// Función para sincronizar manualmente
async function syncData() {
    if (!syncManager.isValidUrl()) {
        showToast('⚠️ URL del backend no configurada', 'warning');
        return;
    }
    
    showToast('🔄 Sincronizando...', 'info');
    const result = await syncManager.syncAll();
    
    if (result.fallback === 'localStorage') {
        showToast('⚠️ Conectividad limitada. Usando datos locales.', 'warning');
    } else if (result.success) {
        showToast('✅ Sincronización exitosa', 'success');
    }
}

// Función para mostrar loading
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

// Función para mostrar toast notifications
function showToast(message, type = 'info') {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Estilos inline para evitar dependencias
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 16px',
        borderRadius: '4px',
        color: 'white',
        backgroundColor: type === 'success' ? '#4CAF50' : 
                        type === 'error' ? '#f44336' : 
                        type === 'warning' ? '#ff9800' : '#2196F3',
        zIndex: '1000',
        fontSize: '14px',
        maxWidth: '300px'
    });
    
    document.body.appendChild(toast);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Función para actualizar UI
function updateUI() {
    // Actualizar indicadores de estado
    const statusText = appData.syncMode === 'googleSheets' ? 
        '🟢 Conectado a Google Sheets' : 
        '🟡 Modo local';
    
    // Crear o actualizar elemento de estado
    let statusElement = document.getElementById('connectionStatus');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'connectionStatus';
        statusElement.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            background: rgba(0,0,0,0.8);
            color: white;
            z-index: 1000;
        `;
        document.body.appendChild(statusElement);
    }
    statusElement.textContent = statusText;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp);

// También inicializar si ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}