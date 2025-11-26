// Datos de ejemplo para probar la aplicación
// Ejecutar en la consola del navegador para cargar datos de prueba

console.log("Cargando datos de ejemplo...");

// Agregar productos de ejemplo
const productosEjemplo = [
    {
        name: "Smartphone Samsung Galaxy A54",
        purchasePrice: 8500,
        salePrice: 12000,
        stock: 15
    },
    {
        name: "Auriculares Bluetooth",
        purchasePrice: 350,
        salePrice: 650,
        stock: 25
    },
    {
        name: "Funda para Móvil",
        purchasePrice: 80,
        salePrice: 150,
        stock: 8
    },
    {
        name: "Cable USB-C",
        purchasePrice: 45,
        salePrice: 89,
        stock: 12
    },
    {
        name: "Cargador Inalámbrico",
        purchasePrice: 280,
        salePrice: 450,
        stock: 6
    },
    {
        name: "Power Bank 10000mAh",
        purchasePrice: 320,
        salePrice: 580,
        stock: 18
    },
    {
        name: "Protector de Pantalla",
        purchasePrice: 25,
        salePrice: 59,
        stock: 30
    },
    {
        name: "Smartwatch Básico",
        purchasePrice: 1200,
        salePrice: 1850,
        stock: 4
    }
];

// Función para agregar productos de ejemplo
function cargarProductosEjemplo() {
    productosEjemplo.forEach(producto => {
        app.addProduct(producto);
    });
    console.log("Productos de ejemplo agregados exitosamente");
    app.renderProducts();
}

// Función para agregar ventas de ejemplo
function cargarVentasEjemplo() {
    // Simular algunas ventas
    const ventasEjemplo = [
        {
            products: [
                { product: app.getProduct(0), quantity: 1 },
                { product: app.getProduct(1), quantity: 2 }
            ],
            customer: "Juan Pérez",
            paymentMethod: "efectivo",
            total: 13400,
            isCredit: false,
            creditNote: ""
        },
        {
            products: [
                { product: app.getProduct(2), quantity: 3 },
                { product: app.getProduct(3), quantity: 1 }
            ],
            customer: "María García",
            paymentMethod: "tarjeta",
            total: 599,
            isCredit: false,
            creditNote: ""
        },
        {
            products: [
                { product: app.getProduct(4), quantity: 1 },
                { product: app.getProduct(5), quantity: 2 }
            ],
            customer: "Carlos López",
            paymentMethod: "credito",
            total: 1610,
            isCredit: true,
            creditNote: "Pago a 30 días"
        }
    ];

    // Solo agregar si hay productos
    if (app.products.length > 0) {
        ventasEjemplo.forEach(venta => {
            app.addSale(venta);
        });
        console.log("Ventas de ejemplo agregadas");
        app.renderSales();
    } else {
        console.log("Primero agrega productos de ejemplo");
    }
}

// Función para limpiar todos los datos
function limpiarDatos() {
    if (confirm("¿Estás seguro de que quieres eliminar todos los datos?")) {
        localStorage.removeItem('products');
        localStorage.removeItem('sales');
        app.products = [];
        app.sales = [];
        app.renderProducts();
        app.renderSales();
        app.updateReports();
        console.log("Todos los datos han sido eliminados");
    }
}

// Función para marcar algunas ventas a crédito como pagadas (para testing)
function marcarCreditosPagados() {
    const creditosPendientes = app.sales.filter(sale => sale.isCredit && !sale.isCreditPaid);
    if (creditosPendientes.length === 0) {
        console.log("No hay ventas a crédito pendientes");
        return;
    }
    
    // Marcar la primera venta a crédito como pagada
    const primeraVenta = creditosPendientes[0];
    app.markCreditSalePaid(primeraVenta.id);
    
    console.log(`Venta a crédito marcada como pagada: ${primeraVenta.customer}`);
    app.renderSales();
    app.updateReports();
}

// Función para mostrar estadísticas
function mostrarEstadisticas() {
    console.log("=== ESTADÍSTICAS DETALLADAS ===");
    console.log(`Productos registrados: ${app.products.length}`);
    console.log(`Ventas realizadas: ${app.sales.length}`);
    
    const ventasHoy = app.getFilteredSales('today');
    console.log(`Ventas de hoy: ${ventasHoy.length}`);
    
    const ventasCreditoPendientes = app.getFilteredSales('credit');
    const ventasCreditoPagadas = app.getFilteredSales('credit-paid');
    console.log(`Ventas a crédito pendientes: ${ventasCreditoPendientes.length}`);
    console.log(`Ventas a crédito pagadas: ${ventasCreditoPagadas.length}`);
    
    const stockBajo = app.products.filter(p => p.stock <= 5);
    console.log(`Productos con stock bajo: ${stockBajo.length}`);
    
    const totalVentas = app.sales.reduce((sum, venta) => sum + venta.total, 0);
    console.log(`Total de ventas: ${app.formatCurrency(totalVentas)}`);
    
    // Calcular ganancias
    const totalGanancias = app.sales
        .filter(sale => !sale.isCredit || sale.isCreditPaid)
        .reduce((sum, sale) => sum + app.calculateSaleProfit(sale), 0);
    
    const gananciasHoy = ventasHoy.reduce((sum, venta) => sum + app.calculateSaleProfit(venta), 0);
    
    console.log(`Ganancias totales: ${app.formatCurrency(totalGanancias)}`);
    console.log(`Ganancias de hoy: ${app.formatCurrency(gananciasHoy)}`);
    
    const productosMasVendidos = {};
    app.sales.forEach(venta => {
        venta.products.forEach(item => {
            const nombre = item.product.name;
            if (!productosMasVendidos[nombre]) {
                productosMasVendidos[nombre] = { cantidad: 0, ganancia: 0 };
            }
            productosMasVendidos[nombre].cantidad += item.quantity;
            const gananciaUnit = item.product.salePrice - item.product.purchasePrice;
            productosMasVendidos[nombre].ganancia += gananciaUnit * item.quantity;
        });
    });
    
    console.log("Productos más vendidos por ganancia:");
    Object.entries(productosMasVendidos)
        .sort((a, b) => b[1].ganancia - a[1].ganancia)
        .slice(0, 5)
        .forEach(([nombre, datos]) => {
            console.log(`  ${nombre}: ${datos.cantidad} unidades, Ganancia: ${app.formatCurrency(datos.ganancia)}`);
        });
    
    console.log("Productos más vendidos por cantidad:");
    Object.entries(productosMasVendidos)
        .sort((a, b) => b[1].cantidad - a[1].cantidad)
        .slice(0, 5)
        .forEach(([nombre, datos]) => {
            console.log(`  ${nombre}: ${datos.cantidad} unidades`);
        });
}

// Exportar funciones para uso global
window.cargarProductosEjemplo = cargarProductosEjemplo;
window.cargarVentasEjemplo = cargarVentasEjemplo;
window.limpiarDatos = limpiarDatos;
window.mostrarEstadisticas = mostrarEstadisticas;
window.marcarCreditosPagados = marcarCreditosPagados;

// Mensaje de bienvenida
console.log(`
🎉 ¡Datos de ejemplo listos con nuevas funcionalidades!

Para cargar datos de prueba, ejecuta en la consola:

• cargarProductosEjemplo()     - Cargar 8 productos de ejemplo
• cargarVentasEjemplo()        - Cargar 3 ventas de ejemplo
• mostrarEstadisticas()        - Ver estadísticas detalladas con ganancias
• marcarCreditosPagados()      - Marcar una venta a crédito como pagada
• limpiarDatos()               - Eliminar todos los datos

NUEVAS FUNCIONALIDADES AGREGADAS:
📊 Reportes de Ganancias:
  - Ganancia del día calculada automáticamente
  - Ganancia total acumulada
  - Separación entre crédito pendiente y pagado

💰 Sistema de Crédito Mejorado:
  - Marcar ventas a crédito como pagadas
  - Filtros separados para crédito pendiente y pagado
  - Historial actualizado con estados

📈 Análisis Avanzado:
  - Productos más vendidos por ganancia
  - Productos más vendidos por cantidad
  - Estadísticas detalladas en consola

Nota: Ejecuta primero cargarProductosEjemplo() antes que cargarVentasEjemplo()
`);