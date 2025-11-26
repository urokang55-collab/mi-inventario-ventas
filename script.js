// 📱 Aplicación de Gestión de Inventario y Ventas v2.0
// Con soporte híbrido: Local Storage + Google Sheets (con manejo de errores CORS)
// 
// CONFIGURACIÓN: Ver config.js

// Cargar configuración
const CONFIG = window.CONFIG || {
    GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyYl0y6IWNU8nUbdWK6zSzkBLlmnoNlW_O7KYL-ncm6t3Si8NlvRDadxuIz5rJEgaHh/exec",
    SYNC_MODE: "google_sheets"
};

// Clase para manejo de sincronización con Google Sheets
class GoogleSheetsSync {
    constructor() {
        this.url = CONFIG.GOOGLE_SCRIPT_URL;
        this.isOnline = navigator.onLine;
        this.isSyncing = false;
        this.lastSyncTime = null;
        this.corsErrorShown = false; // Evitar mostrar el mismo error múltiples veces
        
        // Escuchar cambios de conectividad
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showToast('Sin conexión a internet', 'warning');
        });
    }

    // Realizar petición al Google Apps Script con mejor manejo de errores
    async request(action, data = {}) {
        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action,
                    ...data
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || result.message || 'Error desconocido');
            }

            return result.data;
        } catch (error) {
            console.error('Error en petición Google Sheets:', error);
            
            // Detectar errores CORS específicos
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                if (!this.corsErrorShown) {
                    this.showCorsError();
                    this.corsErrorShown = true;
                }
            } else {
                this.showToast('Error de conexión: ' + error.message, 'error');
            }
            
            throw error;
        }
    }

    // Mostrar error CORS específico
    showCorsError() {
        const errorMessage = `
⚠️ Error de CORS detectado

Tu aplicación está intentando conectarse a Google Apps Script desde GitHub Pages.

SOLUCIONES:
1. Usar modo LOCAL (desactivar sincronización)
2. Permitir acceso anónimo en tu Google Apps Script

ACTUALMENTE: Funcionando en modo local únicamente.
`;
        
        this.showToast('Error CORS - Ver configuración', 'error');
        console.warn(errorMessage);
    }

    // Obtener productos desde Google Sheets
    async getProducts() {
        try {
            return await this.request('getProducts');
        } catch (error) {
            console.error('Error obteniendo productos:', error);
            return this.loadFromLocalStorage('products') || [];
        }
    }

    // Agregar producto a Google Sheets
    async addProduct(product) {
        try {
            return await this.request('addProduct', { product });
        } catch (error) {
            console.error('Error agregando producto:', error);
            // Guardar localmente como fallback
            this.saveToLocalStorage('products', [...this.getLocalProducts(), product]);
            this.showToast('Producto guardado localmente (sin sincronización)', 'warning');
            throw error;
        }
    }

    // Actualizar producto en Google Sheets
    async updateProduct(product) {
        try {
            return await this.request('updateProduct', { product });
        } catch (error) {
            console.error('Error actualizando producto:', error);
            throw error;
        }
    }

    // Eliminar producto de Google Sheets
    async deleteProduct(index) {
        try {
            return await this.request('deleteProduct', { index });
        } catch (error) {
            console.error('Error eliminando producto:', error);
            throw error;
        }
    }

    // Obtener ventas desde Google Sheets
    async getSales() {
        try {
            return await this.request('getSales');
        } catch (error) {
            console.error('Error obteniendo ventas:', error);
            return this.loadFromLocalStorage('sales') || [];
        }
    }

    // Agregar venta a Google Sheets
    async addSale(sale) {
        try {
            return await this.request('addSale', { sale });
        } catch (error) {
            console.error('Error agregando venta:', error);
            // Guardar localmente como fallback
            this.saveToLocalStorage('sales', [...this.getLocalSales(), sale]);
            this.showToast('Venta guardada localmente (sin sincronización)', 'warning');
            throw error;
        }
    }

    // Métodos de almacenamiento local como fallback
    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    getLocalProducts() {
        return this.loadFromLocalStorage('products') || [];
    }

    getLocalSales() {
        return this.loadFromLocalStorage('sales') || [];
    }

    // Sincronizar datos (con modo fallback)
    async syncData() {
        if (this.isSyncing || !this.isOnline || CONFIG.SYNC_MODE !== 'google_sheets') {
            return;
        }

        this.isSyncing = true;
        this.updateSyncStatus('Sincronizando...', 'syncing');

        try {
            // Intentar sincronizar con Google Sheets
            const cloudProducts = await this.getProducts();
            const cloudSales = await this.getSales();

            if (cloudProducts && cloudProducts.length > 0) {
                this.saveToLocalStorage('cloud_products', cloudProducts);
            }

            if (cloudSales && cloudSales.length > 0) {
                this.saveToLocalStorage('cloud_sales', cloudSales);
            }

            this.lastSyncTime = new Date();
            this.updateSyncStatus('Sincronizado', 'success');
            
            // Actualizar la aplicación
            if (appState) {
                await appState.loadFromCloud();
            }
            
        } catch (error) {
            console.error('Error sincronizando:', error);
            this.updateSyncStatus('Error de sincronización', 'error');
            
            // Fallback a datos locales
            if (appState) {
                appState.loadFromLocal();
            }
        } finally {
            this.isSyncing = false;
            setTimeout(() => this.updateSyncStatus('', 'hidden'), 3000);
        }
    }

    // Actualizar estado de sincronización en UI
    updateSyncStatus(message, type) {
        const statusElement = document.getElementById('sync-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `sync-status ${type}`;
            
            if (type === 'hidden') {
                statusElement.style.display = 'none';
            } else {
                statusElement.style.display = 'block';
            }
        }
    }

    // Mostrar notificación
    showToast(message, type = 'info') {
        // Crear elemento toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Estilos inline para el toast
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            zIndex: '10000',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        // Colores según tipo
        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        toast.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(toast);

        // Mostrar
        setTimeout(() => toast.style.opacity = '1', 100);

        // Ocultar después de 4 segundos para errores
        const duration = type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
}

// ================================
// ESTADO DE LA APLICACIÓN
// ================================

class AppState {
    constructor() {
        this.products = [];
        this.sales = [];
        this.currentTab = 'inventario';
        this.currentSale = {
            products: [],
            customer: '',
            paymentMethod: 'efectivo',
            total: 0,
            isCredit: false
        };
        this.editingProductId = null;
        
        // Inicializar sincronización
        this.sync = new GoogleSheetsSync();
        
        // Auto-sync cada 30 segundos
        setInterval(() => this.syncData(), 30000);
    }

    // Sincronizar datos desde la nube
    async syncData() {
        if (CONFIG.SYNC_MODE === 'google_sheets') {
            await this.sync.syncData();
        }
    }

    // Cargar datos desde la nube
    async loadFromCloud() {
        try {
            if (CONFIG.SYNC_MODE === 'google_sheets') {
                // Cargar productos
                const cloudProducts = this.sync.loadFromLocalStorage('cloud_products');
                if (cloudProducts) {
                    this.products = cloudProducts;
                }

                // Cargar ventas
                const cloudSales = this.sync.loadFromLocalStorage('cloud_sales');
                if (cloudSales) {
                    this.sales = cloudSales;
                }

                // Actualizar UI
                this.renderProducts();
                this.renderSalesHistory();
                this.updateReports();
            }
        } catch (error) {
            console.error('Error cargando datos de la nube:', error);
            this.loadFromLocal(); // Fallback a local
        }
    }

    // Cargar datos desde almacenamiento local
    loadFromLocal() {
        try {
            // Cargar productos
            const localProducts = this.sync.loadFromLocalStorage('products');
            if (localProducts) {
                this.products = localProducts;
            }

            // Cargar ventas
            const localSales = this.sync.loadFromLocalStorage('sales');
            if (localSales) {
                this.sales = localSales;
            }

            // Actualizar UI
            this.renderProducts();
            this.renderSalesHistory();
            this.updateReports();

            if (CONFIG.SYNC_MODE === 'google_sheets') {
                this.sync.showToast('Usando datos locales (sin sincronización)', 'warning');
            }
        } catch (error) {
            console.error('Error cargando datos locales:', error);
        }
    }

    // Métodos para productos (con sincronización híbrida)
    async addProduct(product) {
        const newProduct = {
            id: this.generateId(),
            ...product,
            createdAt: new Date().toISOString()
        };

        this.products.push(newProduct);
        
        // Guardar localmente siempre
        this.sync.saveToLocalStorage('products', this.products);
        
        // Intentar sincronizar si está habilitado
        if (CONFIG.SYNC_MODE === 'google_sheets') {
            try {
                await this.sync.addProduct(newProduct);
                this.sync.showToast('Producto guardado y sincronizado', 'success');
            } catch (error) {
                this.sync.showToast('Producto guardado localmente (sin sincronización)', 'warning');
            }
        } else {
            this.sync.showToast('Producto agregado exitosamente', 'success');
        }

        this.renderProducts();
        this.updateReports();
        return newProduct;
    }

    async updateProduct(id, updates) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            const updatedProduct = {
                ...this.products[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            
            this.products[index] = updatedProduct;
            
            // Guardar localmente siempre
            this.sync.saveToLocalStorage('products', this.products);
            
            // Intentar sincronizar si está habilitado
            if (CONFIG.SYNC_MODE === 'google_sheets') {
                try {
                    await this.sync.updateProduct(updatedProduct);
                    this.sync.showToast('Producto actualizado y sincronizado', 'success');
                } catch (error) {
                    this.sync.showToast('Producto actualizado localmente (sin sincronización)', 'warning');
                }
            } else {
                this.sync.showToast('Producto actualizado exitosamente', 'success');
            }

            this.renderProducts();
            this.updateReports();
        }
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            
            // Guardar localmente siempre
            this.sync.saveToLocalStorage('products', this.products);
            
            // Intentar sincronizar si está habilitado
            if (CONFIG.SYNC_MODE === 'google_sheets') {
                try {
                    await this.sync.deleteProduct(index);
                    this.sync.showToast('Producto eliminado y sincronizado', 'success');
                } catch (error) {
                    this.sync.showToast('Producto eliminado localmente (sin sincronización)', 'warning');
                }
            } else {
                this.sync.showToast('Producto eliminado exitosamente', 'success');
            }

            this.renderProducts();
            this.updateReports();
        }
    }

    getProduct(id) {
        return this.products.find(p => p.id === id);
    }

    updateStock(id, quantitySold) {
        const product = this.getProduct(id);
        if (product) {
            product.stock = Math.max(0, product.stock - quantitySold);
            this.sync.saveToLocalStorage('products', this.products);
        }
    }

    // Métodos para ventas (con sincronización híbrida)
    async addSale(sale) {
        const id = this.generateId();
        const newSale = {
            id,
            ...sale,
            date: new Date().toISOString(),
            isPaid: sale.paymentMethod === 'credito' ? false : true,
            profit: this.calculateSaleProfit(sale)
        };

        this.sales.push(newSale);
        
        // Actualizar stock de productos
        sale.products.forEach(saleProduct => {
            this.updateStock(saleProduct.id, saleProduct.quantity);
        });
        
        // Guardar localmente siempre
        this.sync.saveToLocalStorage('sales', this.sales);
        
        // Intentar sincronizar si está habilitado
        if (CONFIG.SYNC_MODE === 'google_sheets') {
            try {
                await this.sync.addSale(newSale);
                this.sync.showToast('Venta guardada y sincronizada', 'success');
            } catch (error) {
                this.sync.showToast('Venta guardada localmente (sin sincronización)', 'warning');
            }
        } else {
            this.sync.showToast('Venta registrada exitosamente', 'success');
        }

        this.renderSalesHistory();
        this.updateReports();
        return newSale;
    }

    markSaleAsPaid(saleId) {
        const sale = this.sales.find(s => s.id === saleId);
        if (sale && sale.paymentMethod === 'credito') {
            sale.isPaid = true;
            this.sync.saveToLocalStorage('sales', this.sales);
            this.renderSalesHistory();
            this.updateReports();
            this.sync.showToast('Crédito marcado como pagado', 'success');
        }
    }

    calculateSaleProfit(sale) {
        return sale.products.reduce((total, product) => {
            const productData = this.getProduct(product.id);
            if (productData) {
                const profitPerUnit = productData.salePrice - productData.purchasePrice;
                return total + (profitPerUnit * product.quantity);
            }
            return total;
        }, 0);
    }

    // Métodos utilitarios
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Métodos de renderizado (actualizados)
    renderProducts() {
        const productList = document.getElementById('product-list');
        if (!productList) return;

        const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';
        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );

        if (filteredProducts.length === 0) {
            productList.innerHTML = `
                <div class="empty-state">
                    <h3>No hay productos</h3>
                    <p>${CONFIG.SYNC_MODE === 'google_sheets' ? 'Los productos se sincronizarán automáticamente' : 'Agrega tu primer producto para comenzar'}</p>
                    <button class="primary-button" onclick="appState.showModal('product-modal')">
                        Agregar Producto
                    </button>
                </div>
            `;
            return;
        }

        productList.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>Compra: $${product.purchasePrice} | Venta: $${product.salePrice}</p>
                    <p class="stock ${product.stock <= 5 ? 'low-stock' : ''}">
                        Stock: ${product.stock} ${product.stock <= 5 ? '⚠️' : ''}
                    </p>
                </div>
                <div class="product-actions">
                    <button onclick="appState.editProduct('${product.id}')" class="btn-secondary">✏️</button>
                    <button onclick="appState.deleteProduct('${product.id}')" class="btn-danger">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    renderSalesHistory() {
        const historyList = document.getElementById('sales-history');
        if (!historyList) return;

        const filterValue = document.getElementById('sales-filter')?.value || 'all';
        const filteredSales = this.getFilteredSales(filterValue);

        if (filteredSales.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <h3>No hay ventas</h3>
                    <p>Las ventas registradas aparecerán aquí</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = filteredSales.map(sale => `
            <div class="sale-card">
                <div class="sale-info">
                    <h3>${sale.customerName}</h3>
                    <p>Fecha: ${new Date(sale.date).toLocaleDateString()}</p>
                    <p>Total: $${sale.total}</p>
                    <p>Método: ${sale.paymentMethod}</p>
                    ${sale.paymentMethod === 'credito' ? `
                        <p>Estado: ${sale.isPaid ? '✅ Pagado' : '⏳ Pendiente'}</p>
                        ${!sale.isPaid ? `<button onclick="appState.markSaleAsPaid('${sale.id}')" class="btn-success">Marcar Pagada</button>` : ''}
                    ` : ''}
                </div>
                <div class="sale-products">
                    ${sale.products.map(p => `${p.name} x${p.quantity}`).join(', ')}
                </div>
            </div>
        `).join('');
    }

    getFilteredSales(filter) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.sales.filter(sale => {
            const saleDate = new Date(sale.date);
            saleDate.setHours(0, 0, 0, 0);

            switch (filter) {
                case 'today':
                    return saleDate.getTime() === today.getTime();
                case 'week':
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return saleDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return saleDate >= monthAgo;
                case 'credit':
                    return sale.paymentMethod === 'credito' && !sale.isPaid;
                case 'credit-paid':
                    return sale.paymentMethod === 'credito' && sale.isPaid;
                default:
                    return true;
            }
        });
    }

    updateReports() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Ventas del día (solo pagadas)
        const todaySales = this.sales.filter(sale => {
            const saleDate = new Date(sale.date);
            saleDate.setHours(0, 0, 0, 0);
            return saleDate.getTime() === today.getTime() && sale.isPaid;
        });

        const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
        const todayProfit = todaySales.reduce((sum, sale) => sum + (sale.profit || 0), 0);

        // Total de productos
        const totalProducts = this.products.length;

        // Créditos pendientes
        const pendingCredits = this.sales.filter(sale => 
            sale.paymentMethod === 'credito' && !sale.isPaid
        );
        const pendingCreditsTotal = pendingCredits.reduce((sum, sale) => sum + sale.total, 0);

        // Créditos pagados
        const paidCredits = this.sales.filter(sale => 
            sale.paymentMethod === 'credito' && sale.isPaid
        );
        const paidCreditsTotal = paidCredits.reduce((sum, sale) => sum + sale.total, 0);

        // Ganancia total
        const totalProfit = this.sales
            .filter(sale => sale.isPaid)
            .reduce((sum, sale) => sum + (sale.profit || 0), 0);

        // Productos con stock bajo
        const lowStockProducts = this.products.filter(product => product.stock <= 5);

        // Actualizar elementos en el DOM
        const elements = {
            'today-sales': todayTotal,
            'products-count': totalProducts,
            'pending-credit': pendingCreditsTotal,
            'paid-credit-sales': paidCreditsTotal,
            'today-profit': todayProfit,
            'total-profit': totalProfit,
            'low-stock-count': lowStockProducts.length
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = typeof value === 'number' && (id.includes('sales') || id.includes('credit') || id.includes('profit')) 
                    ? `$${value.toLocaleString()}`
                    : value.toString();
            }
        });
    }

    // Métodos de edición
    editProduct(id) {
        const product = this.getProduct(id);
        if (product) {
            this.editingProductId = id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-purchase').value = product.purchasePrice;
            document.getElementById('product-sale').value = product.salePrice;
            document.getElementById('product-stock').value = product.stock;
            this.showModal('product-modal');
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            if (modalId === 'product-modal') {
                this.editingProductId = null;
                this.clearProductForm();
            }
        }
    }

    clearProductForm() {
        const form = document.getElementById('product-form');
        if (form) form.reset();
    }
}

// ================================
// INICIALIZACIÓN
// ================================

// Instancia global de la aplicación
let appState;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Inicializando aplicación híbrida (Local + Google Sheets)');
    
    // Inicializar estado de la aplicación
    appState = new AppState();
    
    // Cargar datos (prioridad: nube, fallback: local)
    await appState.loadFromCloud();
    if (appState.products.length === 0) {
        appState.loadFromLocal();
    }
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('✅ Aplicación inicializada');
});

// Configurar event listeners
function setupEventListeners() {
    // Navegación por pestañas
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });

    // Botón flotante para agregar producto
    const fabButton = document.getElementById('fab-add-product');
    if (fabButton) {
        fabButton.addEventListener('click', () => appState.showModal('product-modal'));
    }

    // Botón principal para agregar producto
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => appState.showModal('product-modal'));
    }

    // Búsqueda de productos
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => appState.renderProducts());
    }

    // Filtros de historial
    const filterSelect = document.getElementById('sales-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => appState.renderSalesHistory());
    }

    // Formularios
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }

    const saleForm = document.getElementById('sale-form');
    if (saleForm) {
        saleForm.addEventListener('submit', handleSaleSubmit);
    }

    // Configuración
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => appState.showModal('settings-modal'));
    }
}

// Cambiar pestaña activa
function switchTab(tabId) {
    // Actualizar botones
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Mostrar contenido
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');

    // Actualizar estado
    appState.currentTab = tabId;

    // Actualizar reportes si es necesario
    if (tabId === 'reportes') {
        appState.updateReports();
    }
}

// Manejar envío de formulario de producto
async function handleProductSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('product-name').value.trim();
    const purchasePrice = parseFloat(document.getElementById('product-purchase').value);
    const salePrice = parseFloat(document.getElementById('product-sale').value);
    const stock = parseInt(document.getElementById('product-stock').value);

    if (!name || isNaN(purchasePrice) || isNaN(salePrice) || isNaN(stock)) {
        appState.sync?.showToast('Por favor completa todos los campos', 'error');
        return;
    }

    if (purchasePrice >= salePrice) {
        appState.sync?.showToast('El precio de venta debe ser mayor al de compra', 'error');
        return;
    }

    const productData = { name, purchasePrice, salePrice, stock };

    if (appState.editingProductId) {
        await appState.updateProduct(appState.editingProductId, productData);
    } else {
        await appState.addProduct(productData);
    }

    appState.hideModal('product-modal');
}

// Manejar envío de formulario de venta
async function handleSaleSubmit(e) {
    e.preventDefault();
    
    if (appState.currentSale.products.length === 0) {
        appState.sync?.showToast('Agrega al menos un producto', 'error');
        return;
    }

    const customerName = document.getElementById('customer-name').value.trim();
    const paymentMethod = document.getElementById('payment-method').value;

    if (!customerName) {
        appState.sync?.showToast('Ingresa el nombre del cliente', 'error');
        return;
    }

    const saleData = {
        customerName,
        paymentMethod,
        products: appState.currentSale.products,
        total: appState.currentSale.total
    };

    await appState.addSale(saleData);
    
    // Resetear formulario
    appState.currentSale = {
        products: [],
        customer: '',
        paymentMethod: 'efectivo',
        total: 0,
        isCredit: false
    };
    
    document.getElementById('sale-form').reset();
    appState.hideModal('sale-modal');
}