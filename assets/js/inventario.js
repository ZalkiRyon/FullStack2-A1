// Gestión de inventario para el panel de administración
// Maneja productos del módulo base y productos creados dinámicamente en localStorage

// Importar datos base de productos
import { initializerListaProductos } from './modules/productos.js';

// Variables globales
let productos = [];
let productoSeleccionado = null;
let modalProducto, modalDetalleProducto;

// Variables para paginación
let paginaActual = 1;
let productosPorPagina = 10;
let productosFiltrados = [];

// Variables para manejo de imágenes
let currentCustomImage = null;

// Mapeo de categorías a códigos de prefijo
const PREFIJOS_CATEGORIA = {
    'Frutas frescas': 'FR',
    'Verduras organicas': 'VR', 
    'Productos organicos': 'PO',
    'Productos lacteos': 'PL',
    'Cereales': 'CE',
    'Bebidas': 'BE',
    'Condimentos': 'CO',
    'Frutos secos': 'FS',
    'Carnes': 'CA',
    'Pescados': 'PE',
    'Panadería': 'PA',
    'Snacks': 'SN'
};

// Función para generar código automático de producto
function generarCodigoProducto(categoria) {
    const prefijo = PREFIJOS_CATEGORIA[categoria] || 'PR'; // PR como prefijo por defecto
    
    // Obtener todos los productos (base + personalizados)
    const productosBase = JSON.parse(localStorage.getItem('ListaProductos')) || [];
    const productosPersonalizados = JSON.parse(localStorage.getItem('ProductosPersonalizados')) || [];
    const todosLosProductos = [...productosBase, ...productosPersonalizados];
    
    // Buscar todos los códigos que empiecen con este prefijo
    const codigosExistentes = todosLosProductos
        .map(producto => producto.nombre)
        .filter(nombre => nombre.startsWith(prefijo))
        .map(nombre => {
            const match = nombre.match(new RegExp(`^${prefijo}(\\d+)`));
            return match ? parseInt(match[1]) : 0;
        })
        .sort((a, b) => a - b);
    
    // Encontrar el siguiente número disponible
    let siguienteNumero = 1;
    for (let numero of codigosExistentes) {
        if (numero === siguienteNumero) {
            siguienteNumero++;
        } else {
            break;
        }
    }
    
    // Formatear con ceros a la izquierda (3 dígitos)
    return `${prefijo}${siguienteNumero.toString().padStart(3, '0')}`;
}

// Inicialización cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Inventario Admin cargado');
    
    // Inicializar modales
    modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'));
    modalDetalleProducto = new bootstrap.Modal(document.getElementById('modalDetalleProducto'));
    
    // Inicializar productos base si no existen
    initializerListaProductos();
    
    // Cargar productos y renderizar
    cargarProductos();
    configurarEventListeners();
    aplicarFiltrosYPaginacion();
});

// Configurar todos los event listeners
function configurarEventListeners() {
    // Botón nuevo producto
    document.getElementById('nuevoProductoBtn').addEventListener('click', abrirModalProducto);
    
    // Botón guardar producto
    document.getElementById('guardarProductoBtn').addEventListener('click', guardarProducto);
    
    // Filtros y búsqueda
    document.getElementById('buscarProducto').addEventListener('input', filtrarProductos);
    document.getElementById('filtroCategoria').addEventListener('change', filtrarProductos);
    document.getElementById('filtroStock').addEventListener('change', filtrarProductos);
    document.getElementById('limpiarFiltros').addEventListener('click', limpiarFiltros);
    
    // Event listeners para carga de imágenes
    document.getElementById('uploadImageBtn').addEventListener('click', function() {
        document.getElementById('customImageUpload').click();
    });
    
    document.getElementById('customImageUpload').addEventListener('change', handleImageUpload);
    document.getElementById('removeImageBtn').addEventListener('click', removeCustomImage);
    document.getElementById('productoImagen').addEventListener('change', handlePredefinedImageChange);
    
    // Event listeners para paginación
    document.getElementById('pageSize').addEventListener('change', function() {
        productosPorPagina = parseInt(this.value);
        paginaActual = 1;
        aplicarFiltrosYPaginacion();
    });
    
    // Botón editar desde detalle
    document.getElementById('editarDetalleBtn').addEventListener('click', function() {
        modalDetalleProducto.hide();
        setTimeout(() => {
            editarProducto(productoSeleccionado.id);
        }, 300);
    });
}

// Cargar productos desde localStorage y productos base
function cargarProductos() {
    try {
        // Obtener productos base del localStorage (inicializados por el módulo)
        const productosBase = JSON.parse(localStorage.getItem('ListaProductos')) || [];
        
        // Obtener productos personalizados creados en admin
        const productosPersonalizados = JSON.parse(localStorage.getItem('ProductosPersonalizados')) || [];
        
        // Combinar ambas listas
        productos = [...productosBase, ...productosPersonalizados];
        
        console.log(`📦 Productos cargados: ${productos.length} total`);
        return productos;
    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        productos = [];
        return [];
    }
}

// Renderizar tabla de inventario
function renderizarTablaInventario(productosAMostrar = null) {
    // Si no se especifican productos, usar los filtrados con paginación
    if (productosAMostrar === null) {
        aplicarFiltrosYPaginacion();
        return;
    }
    
    const tbody = document.getElementById('tablaInventarioBody');
    const mensajeSinProductos = document.getElementById('mensajeSinProductos');
    
    if (productosAMostrar.length === 0) {
        tbody.innerHTML = '';
        mensajeSinProductos.style.display = 'block';
        document.getElementById('paginationContainer').style.display = 'none';
        return;
    }
    
    mensajeSinProductos.style.display = 'none';
    
    tbody.innerHTML = productosAMostrar.map(producto => {
        let imagenSrc;
        if (producto.imagenCustom) {
            // Usar imagen personalizada en base64
            imagenSrc = producto.imagenCustom;
        } else if (producto.imagen && producto.imagen !== '') {
            // Usar imagen predefinida
            imagenSrc = `../../assets/images/${producto.imagen}`;
        } else {
            // Imagen por defecto
            imagenSrc = '../../assets/images/icono.png';
        }
        
        return `
            <tr data-producto-id="${producto.id}" class="producto-row">
                <td>
                    <img src="${imagenSrc}" alt="${producto.nombre}" class="product-thumb" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"
                         onerror="this.src='../../assets/images/icono.png'">
                </td>
                <td>
                    <span class="fw-bold">${producto.id}</span>
                </td>
                <td>
                    <strong>${producto.nombre}</strong>
                </td>
                <td>
                    <span class="badge bg-secondary">${producto.categoria}</span>
                </td>
                <td>
                    <strong class="text-success">$${producto.precio.toLocaleString()}</strong>
                </td>
                <td>
                    <span class="badge ${producto.stock > 10 ? 'bg-success' : producto.stock > 0 ? 'bg-warning' : 'bg-danger'}">
                        ${producto.stock}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline-primary" onclick="verDetalle(${producto.id})" title="Ver detalle">
                            👁️
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="editarProducto(${producto.id})" title="Editar">
                            ✏️
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${producto.id})" title="Eliminar">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Aplicar filtros y paginación
function aplicarFiltrosYPaginacion() {
    console.log('🔍 Aplicando filtros. Total productos disponibles:', productos.length);
    
    const busqueda = document.getElementById('buscarProducto').value.toLowerCase();
    const categoriaFiltro = document.getElementById('filtroCategoria').value;
    const stockFiltro = document.getElementById('filtroStock').value;
    
    // Aplicar filtros
    productosFiltrados = productos.filter(producto => {
        const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda) || 
                              producto.id.toString().includes(busqueda);
        
        const cumpleCategoria = !categoriaFiltro || producto.categoria === categoriaFiltro;
        
        let cumpleStock = true;
        if (stockFiltro === 'bajo') {
            cumpleStock = producto.stock < 50;
        } else if (stockFiltro === 'medio') {
            cumpleStock = producto.stock >= 50 && producto.stock <= 100;
        } else if (stockFiltro === 'alto') {
            cumpleStock = producto.stock > 100;
        }
        
        return cumpleBusqueda && cumpleCategoria && cumpleStock;
    });
    
    // Aplicar paginación
    const totalProductos = productosFiltrados.length;
    const totalPaginas = Math.ceil(totalProductos / productosPorPagina);
    
    // Ajustar página actual si es necesario
    if (paginaActual > totalPaginas && totalPaginas > 0) {
        paginaActual = totalPaginas;
    }
    if (paginaActual < 1) {
        paginaActual = 1;
    }
    
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productosFiltrados.slice(inicio, fin);
    
    // Renderizar productos de la página actual
    renderizarTablaInventario(productosPagina);
    
    // Actualizar controles de paginación
    actualizarPaginacion(totalProductos, totalPaginas);
}

// Actualizar controles de paginación
function actualizarPaginacion(totalProductos, totalPaginas) {
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationInfo = document.getElementById('paginationInfo');
    const paginationControls = document.getElementById('paginationControls');
    
    if (totalProductos === 0) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    // Actualizar información
    const inicio = (paginaActual - 1) * productosPorPagina + 1;
    const fin = Math.min(paginaActual * productosPorPagina, totalProductos);
    paginationInfo.textContent = `Mostrando ${inicio}-${fin} de ${totalProductos} productos`;
    
    // Generar controles de paginación
    let controlesHTML = '';
    
    // Botón anterior
    controlesHTML += `
        <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="${paginaActual > 1 ? `cambiarPagina(${paginaActual - 1})` : 'event.preventDefault()'}">
                Anterior
            </a>
        </li>
    `;
    
    // Números de página
    const maxBotones = 5;
    let inicioRango = Math.max(1, paginaActual - Math.floor(maxBotones / 2));
    let finRango = Math.min(totalPaginas, inicioRango + maxBotones - 1);
    
    if (finRango - inicioRango < maxBotones - 1) {
        inicioRango = Math.max(1, finRango - maxBotones + 1);
    }
    
    if (inicioRango > 1) {
        controlesHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="cambiarPagina(1)">1</a>
            </li>
        `;
        if (inicioRango > 2) {
            controlesHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    for (let i = inicioRango; i <= finRango; i++) {
        controlesHTML += `
            <li class="page-item ${i === paginaActual ? 'active' : ''}">
                <a class="page-link" href="#" onclick="cambiarPagina(${i})">${i}</a>
            </li>
        `;
    }
    
    if (finRango < totalPaginas) {
        if (finRango < totalPaginas - 1) {
            controlesHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        controlesHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="cambiarPagina(${totalPaginas})">${totalPaginas}</a>
            </li>
        `;
    }
    
    // Botón siguiente
    controlesHTML += `
        <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="${paginaActual < totalPaginas ? `cambiarPagina(${paginaActual + 1})` : 'event.preventDefault()'}">
                Siguiente
            </a>
        </li>
    `;
    
    paginationControls.innerHTML = controlesHTML;
}

// Cambiar página
function cambiarPagina(nuevaPagina) {
    event.preventDefault();
    paginaActual = nuevaPagina;
    aplicarFiltrosYPaginacion();
}

// Obtener estado del stock
// Abrir modal para nuevo producto
function abrirModalProducto(producto = null) {
    console.log('🔧 Abriendo modal para:', producto ? 'EDITAR' : 'CREAR NUEVO');
    
    const titulo = document.getElementById('modalProductoTitulo');
    const form = document.getElementById('formProducto');
    
    // Limpiar formulario y estado de imagen
    form.reset();
    form.classList.remove('was-validated');
    removeCustomImage();
    currentCustomImage = null;
    
    if (producto) {
        // Modo edición
        titulo.textContent = 'Editar Producto';
        document.getElementById('productoId').value = producto.id;
        document.getElementById('productoNombre').value = producto.nombre;
        document.getElementById('productoCategoria').value = producto.categoria;
        document.getElementById('productoPrecio').value = producto.precio;
        document.getElementById('productoStock').value = producto.stock;
        document.getElementById('productoDescripcion').value = producto.descripcion || '';
        
        console.log('📝 Producto cargado para edición:', producto);
        
        // Manejar imagen personalizada o predefinida
        if (producto.imagenCustom) {
            currentCustomImage = producto.imagenCustom;
            showImagePreview(currentCustomImage);
            document.getElementById('productoImagen').value = '';
        } else {
            document.getElementById('productoImagen').value = producto.imagen || '';
        }
    } else {
        // Modo creación
        titulo.textContent = 'Nuevo Producto';
        document.getElementById('productoId').value = ''; // Importante: limpiar explícitamente
        document.getElementById('productoImagen').value = '';
        
        console.log('✨ Modal configurado para crear nuevo producto');
    }
    
    modalProducto.show();
}

// Guardar producto (crear o editar)
function guardarProducto() {
    const form = document.getElementById('formProducto');
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    const productoId = document.getElementById('productoId').value;
    const esEdicion = productoId !== '' && productoId !== 'undefined' && productoId !== null;
    
    console.log('� Guardando producto. ID del campo:', productoId, 'Es edición:', esEdicion);
    
    const datosProducto = {
        id: esEdicion ? parseInt(productoId) : generarNuevoId(),
        nombre: document.getElementById('productoNombre').value.trim(),
        categoria: document.getElementById('productoCategoria').value,
        precio: parseInt(document.getElementById('productoPrecio').value),
        stock: parseInt(document.getElementById('productoStock').value),
        imagen: currentCustomImage ? `custom_${Date.now()}.jpg` : document.getElementById('productoImagen').value,
        imagenCustom: currentCustomImage || null, // Guardar imagen en base64
        descripcion: document.getElementById('productoDescripcion').value.trim()
    };
    
    console.log('📦 Producto preparado:', datosProducto);
    
    try {
        if (esEdicion) {
            actualizarProducto(datosProducto);
            console.log('✅ Producto actualizado');
        } else {
            crearNuevoProducto(datosProducto);
            console.log('✅ Producto creado');
        }
        
        modalProducto.hide();
        
        // Recargar productos desde localStorage para asegurar sincronización
        cargarProductos();
        
        // Aplicar filtros y paginación con la lista actualizada
        aplicarFiltrosYPaginacion();
        
        // Limpiar estado de imagen personalizada
        removeCustomImage();
        currentCustomImage = null;
        
        const mensaje = esEdicion ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente';
        mostrarNotificacion(mensaje, 'success');
        
    } catch (error) {
        console.error('❌ Error al guardar producto:', error);
        mostrarNotificacion('Error al guardar el producto', 'error');
    }
}

// Crear nuevo producto
function crearNuevoProducto(producto) {
    const productosPersonalizados = JSON.parse(localStorage.getItem('ProductosPersonalizados')) || [];
    productosPersonalizados.push(producto);
    localStorage.setItem('ProductosPersonalizados', JSON.stringify(productosPersonalizados));
    
    console.log('✅ Producto creado:', producto);
    console.log('📦 Total productos personalizados:', productosPersonalizados.length);
    console.log('📊 Lista completa de productos personalizados:', productosPersonalizados);
}

// Actualizar producto existente
function actualizarProducto(productoActualizado) {
    // Intentar actualizar en productos base
    const productosBase = JSON.parse(localStorage.getItem('ListaProductos')) || [];
    const indiceBase = productosBase.findIndex(p => p.id === productoActualizado.id);
    
    if (indiceBase !== -1) {
        productosBase[indiceBase] = productoActualizado;
        localStorage.setItem('ListaProductos', JSON.stringify(productosBase));
    } else {
        // Actualizar en productos personalizados
        const productosPersonalizados = JSON.parse(localStorage.getItem('ProductosPersonalizados')) || [];
        const indicePersonalizado = productosPersonalizados.findIndex(p => p.id === productoActualizado.id);
        
        if (indicePersonalizado !== -1) {
            productosPersonalizados[indicePersonalizado] = productoActualizado;
            localStorage.setItem('ProductosPersonalizados', JSON.stringify(productosPersonalizados));
        }
    }
    
    console.log('✅ Producto actualizado:', productoActualizado);
}

// Eliminar producto
function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
    }
    
    try {
        // Verificar si es producto base o personalizado
        const productosBase = JSON.parse(localStorage.getItem('ListaProductos')) || [];
        const esProductoBase = productosBase.some(p => p.id === id);
        
        if (esProductoBase) {
            // Eliminar de productos base
            const productosActualizados = productosBase.filter(p => p.id !== id);
            localStorage.setItem('ListaProductos', JSON.stringify(productosActualizados));
        } else {
            // Eliminar de productos personalizados
            const productosPersonalizados = JSON.parse(localStorage.getItem('ProductosPersonalizados')) || [];
            const productosActualizados = productosPersonalizados.filter(p => p.id !== id);
            localStorage.setItem('ProductosPersonalizados', JSON.stringify(productosActualizados));
        }
        
        cargarProductos();
        aplicarFiltrosYPaginacion();
        
        mostrarNotificacion('Producto eliminado exitosamente', 'success');
        
    } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        mostrarNotificacion('Error al eliminar el producto', 'error');
    }
}

// Ver detalle del producto
function verDetalle(id) {
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        mostrarNotificacion('Producto no encontrado', 'error');
        return;
    }
    
    productoSeleccionado = producto;
    
    // Llenar modal de detalle
    let imagenSrc;
    if (producto.imagenCustom) {
        imagenSrc = producto.imagenCustom;
    } else if (producto.imagen && producto.imagen !== '') {
        imagenSrc = `../../assets/images/${producto.imagen}`;
    } else {
        imagenSrc = '../../assets/images/icono.png';
    }
    
    const imagenElement = document.getElementById('detalleImagen');
    imagenElement.src = imagenSrc;
    imagenElement.onerror = function() { 
        this.src = '../../assets/images/icono.png'; 
    };
    
    document.getElementById('detalleNombre').textContent = producto.nombre;
    document.getElementById('detalleCategoria').textContent = producto.categoria;
    document.getElementById('detallePrecio').textContent = `$${producto.precio.toLocaleString()}`;
    document.getElementById('detalleStock').textContent = producto.stock;
    document.getElementById('detalleId').textContent = producto.id;
    document.getElementById('detalleDescripcion').textContent = producto.descripcion || 'Sin descripción';
    
    const estadoStock = obtenerEstadoStock(producto.stock);
    const estadoBadge = document.getElementById('detalleEstado');
    estadoBadge.textContent = estadoStock.texto;
    estadoBadge.className = `badge ${estadoStock.clase}`;
    
    modalDetalleProducto.show();
}

// Editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        mostrarNotificacion('Producto no encontrado', 'error');
        return;
    }
    
    abrirModalProducto(producto);
}

// Generar nuevo ID único
function generarNuevoId() {
    // Obtener productos base y personalizados
    const productosBase = JSON.parse(localStorage.getItem('ListaProductos')) || [];
    const productosPersonalizados = JSON.parse(localStorage.getItem('ProductosPersonalizados')) || [];
    
    // Obtener todos los IDs existentes
    const idsExistentes = [
        ...productosBase.map(p => parseInt(p.id)),
        ...productosPersonalizados.map(p => parseInt(p.id))
    ].filter(id => !isNaN(id));
    
    // Encontrar el ID más alto y sumar 1
    const maxId = idsExistentes.length > 0 ? Math.max(...idsExistentes) : 0;
    const nuevoId = maxId + 1;
    
    console.log('🆔 Generando nuevo ID:', nuevoId, 'IDs existentes:', idsExistentes);
    return nuevoId;
}

// Filtrar productos
function filtrarProductos() {
    paginaActual = 1; // Resetear a la primera página cuando se filtra
    aplicarFiltrosYPaginacion();
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('buscarProducto').value = '';
    document.getElementById('filtroCategoria').value = '';
    document.getElementById('filtroStock').value = '';
    paginaActual = 1;
    aplicarFiltrosYPaginacion();
}

// Manejar carga de imagen personalizada
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        mostrarNotificacion('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }
    
    // Validar tamaño (máx. 2MB)
    if (file.size > 2 * 1024 * 1024) {
        mostrarNotificacion('La imagen debe ser menor a 2MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentCustomImage = e.target.result;
        showImagePreview(currentCustomImage);
        
        // Limpiar selector de imágenes predefinidas
        document.getElementById('productoImagen').value = '';
    };
    reader.readAsDataURL(file);
}

// Mostrar preview de imagen
function showImagePreview(imageSrc) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    previewImg.src = imageSrc;
    preview.style.display = 'block';
}

// Quitar imagen personalizada
function removeCustomImage() {
    currentCustomImage = null;
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('customImageUpload').value = '';
    document.getElementById('previewImg').src = '';
}

// Manejar cambio en selector de imágenes predefinidas
function handlePredefinedImageChange() {
    const selectedImage = document.getElementById('productoImagen').value;
    if (selectedImage) {
        // Si se selecciona una imagen predefinida, quitar la personalizada
        removeCustomImage();
    }
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo === 'error' ? 'danger' : tipo === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
    notificacion.style.position = 'fixed';
    notificacion.style.top = '20px';
    notificacion.style.right = '20px';
    notificacion.style.zIndex = '9999';
    notificacion.style.minWidth = '300px';
    
    notificacion.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (notificacion && notificacion.parentNode) {
            notificacion.parentNode.removeChild(notificacion);
        }
    }, 5000);
}

// Exponer funciones globalmente para uso en HTML
window.verDetalle = verDetalle;
window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;
window.abrirModalProducto = abrirModalProducto;
window.cambiarPagina = cambiarPagina;

console.log('🚀 Sistema de inventario inicializado');