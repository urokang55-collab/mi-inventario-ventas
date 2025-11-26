/**
 * Google Apps Script Backend para Inventario y Ventas v2.0
 * Con soporte CORS para GitHub Pages
 */

// Headers CORS para permitir peticiones desde GitHub Pages
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Función para respuestas OPTIONS (preflight)
function doOptions() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Función principal para manejar peticiones POST
function doPost(e) {
  try {
    // Manejar preflight OPTIONS
    if (e.method === 'OPTIONS') {
      return doOptions();
    }

    // Parsear datos de la petición
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createResponse(false, 'Error al parsear datos JSON', null);
    }

    const action = data.action;
    
    // Ejecutar la acción solicitada
    switch (action) {
      case 'getProducts':
        return handleGetProducts();
      case 'addProduct':
        return handleAddProduct(data.product);
      case 'updateProduct':
        return handleUpdateProduct(data.product);
      case 'deleteProduct':
        return handleDeleteProduct(data.index);
      case 'getSales':
        return handleGetSales();
      case 'addSale':
        return handleAddSale(data.sale);
      default:
        return createResponse(false, `Acción no reconocida: ${action}`, null);
    }

  } catch (error) {
    console.error('Error en doPost:', error);
    return createResponse(false, 'Error interno del servidor', null);
  }
}

// Función para GET (usada para pruebas)
function doGet(e) {
  return createResponse(true, 'Inventario App Backend funcionando', {
    version: '2.0',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}

// Crear respuesta estándar con headers CORS
function createResponse(success, message, data) {
  const response = {
    success: success,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Obtener productos
function handleGetProducts() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Productos');
    if (!sheet) {
      return createResponse(true, 'Hoja Productos no existe', []);
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const products = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] === '' || row[0] === null) continue; // Saltar filas vacías

      const product = {
        id: row[0] || '',
        name: row[1] || '',
        purchasePrice: parseFloat(row[2]) || 0,
        salePrice: parseFloat(row[3]) || 0,
        stock: parseInt(row[4]) || 0,
        createdAt: row[5] || new Date().toISOString(),
        updatedAt: row[6] || new Date().toISOString()
      };

      products.push(product);
    }

    return createResponse(true, 'Productos obtenidos correctamente', products);

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return createResponse(false, 'Error al obtener productos: ' + error.message, null);
  }
}

// Agregar producto
function handleAddProduct(product) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Productos');
    if (!sheet) {
      return createResponse(false, 'Hoja Productos no existe', null);
    }

    // Preparar datos
    const now = new Date().toISOString();
    const rowData = [
      product.id,
      product.name,
      product.purchasePrice,
      product.salePrice,
      product.stock,
      now,
      now
    ];

    sheet.appendRow(rowData);

    return createResponse(true, 'Producto agregado correctamente', product);

  } catch (error) {
    console.error('Error agregando producto:', error);
    return createResponse(false, 'Error al agregar producto: ' + error.message, null);
  }
}

// Actualizar producto
function handleUpdateProduct(product) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Productos');
    if (!sheet) {
      return createResponse(false, 'Hoja Productos no existe', null);
    }

    const data = sheet.getDataRange().getValues();
    const productId = product.id;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === productId) {
        sheet.getRange(i + 1, 2, 1, 5).setValues([[
          product.name,
          product.purchasePrice,
          product.salePrice,
          product.stock
        ]]);
        
        sheet.getRange(i + 1, 7).setValue(new Date().toISOString());

        return createResponse(true, 'Producto actualizado correctamente', product);
      }
    }

    return createResponse(false, 'Producto no encontrado', null);

  } catch (error) {
    console.error('Error actualizando producto:', error);
    return createResponse(false, 'Error al actualizar producto: ' + error.message, null);
  }
}

// Eliminar producto
function handleDeleteProduct(index) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Productos');
    if (!sheet) {
      return createResponse(false, 'Hoja Productos no existe', null);
    }

    // index es base 0, pero la fila es base 1, +1 para header
    const rowToDelete = index + 2;
    
    if (rowToDelete <= 1) {
      return createResponse(false, 'Índice inválido', null);
    }

    sheet.deleteRow(rowToDelete);

    return createResponse(true, 'Producto eliminado correctamente', null);

  } catch (error) {
    console.error('Error eliminando producto:', error);
    return createResponse(false, 'Error al eliminar producto: ' + error.message, null);
  }
}

// Obtener ventas
function handleGetSales() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ventas');
    if (!sheet) {
      return createResponse(true, 'Hoja Ventas no existe', []);
    }

    const data = sheet.getDataRange().getValues();
    const sales = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] === '' || row[0] === null) continue; // Saltar filas vacías

      let products = [];
      try {
        products = JSON.parse(row[2] || '[]');
      } catch (e) {
        products = [];
      }

      const sale = {
        id: row[0] || '',
        customerName: row[1] || '',
        products: products,
        total: parseFloat(row[3]) || 0,
        paymentMethod: row[4] || 'efectivo',
        isPaid: row[5] === true || row[5] === 'true',
        date: row[6] || new Date().toISOString(),
        profit: parseFloat(row[7]) || 0
      };

      sales.push(sale);
    }

    return createResponse(true, 'Ventas obtenidas correctamente', sales);

  } catch (error) {
    console.error('Error obteniendo ventas:', error);
    return createResponse(false, 'Error al obtener ventas: ' + error.message, null);
  }
}

// Agregar venta
function handleAddSale(sale) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ventas');
    if (!sheet) {
      return createResponse(false, 'Hoja Ventas no existe', null);
    }

    // Preparar datos
    const now = new Date().toISOString();
    const rowData = [
      sale.id,
      sale.customerName,
      JSON.stringify(sale.products),
      sale.total,
      sale.paymentMethod,
      sale.isPaid,
      now,
      sale.profit || 0
    ];

    sheet.appendRow(rowData);

    return createResponse(true, 'Venta agregada correctamente', sale);

  } catch (error) {
    console.error('Error agregando venta:', error);
    return createResponse(false, 'Error al agregar venta: ' + error.message, null);
  }
}

// Función de prueba para verificar conectividad
function testConnection() {
  return createResponse(true, 'Conexión exitosa', {
    timestamp: new Date().toISOString(),
    version: '2.0'
  });
}