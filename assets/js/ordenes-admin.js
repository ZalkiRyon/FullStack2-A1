// Script para manejar la página de órdenes del admin
import { obtenerOrdenes, filtrarOrdenesPorEstado, obtenerOrdenesPaginadas } from './modules/ordenes.js';

// Variables globales para la paginación
let paginaActual = 1;
const ordenesPorPagina = 10;
let ordenesActuales = [];

// Cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    cargarOrdenes();
    configurarEventos();
});

// Función para cargar y mostrar las órdenes
function cargarOrdenes() {
    // Mostrar indicador de carga
    const tbody = document.getElementById('orders-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 loading">
                    Cargando órdenes
                </td>
            </tr>
        `;
    }
    
    try {
        // Simular una pequeña demora para mostrar el loading
        setTimeout(() => {
            // Obtener todas las órdenes
            const todasLasOrdenes = obtenerOrdenes();
            ordenesActuales = todasLasOrdenes;
            
            // Mostrar las órdenes en la tabla
            mostrarOrdenes(ordenesActuales);
            
            // Configurar la paginación
            configurarPaginacion();
            
            console.log('Órdenes cargadas exitosamente:', todasLasOrdenes.length);
        }, 500);
        
    } catch (error) {
        console.error('Error cargando las órdenes:', error);
        mostrarError('Error al cargar las órdenes');
    }
}

// Función para mostrar las órdenes en la tabla
function mostrarOrdenes(ordenes) {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Obtener órdenes para la página actual
    const inicio = (paginaActual - 1) * ordenesPorPagina;
    const fin = inicio + ordenesPorPagina;
    const ordenesPagina = ordenes.slice(inicio, fin);
    
    // Si no hay órdenes, mostrar mensaje
    if (ordenesPagina.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <em>No se encontraron órdenes</em>
                </td>
            </tr>
        `;
        return;
    }
    
    // Crear filas para cada orden
    ordenesPagina.forEach(orden => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${formatearFecha(orden.fecha)}</td>
            <td>${orden.numeroOrden}</td>
            <td>${orden.cliente}</td>
            <td><span class="badge ${obtenerClaseEstado(orden.estado)}">${orden.estado}</span></td>
            <td>$${orden.monto.toLocaleString('es-CL', { minimumFractionDigits: 2 })}</td>
        `;
        tbody.appendChild(fila);
    });
}

// Función para formatear la fecha
function formatearFecha(fecha) {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Función para obtener la clase CSS del estado
function obtenerClaseEstado(estado) {
    const clases = {
        'Enviado': 'badge-success',
        'Pendiente': 'badge-warning',
        'Cancelado': 'badge-danger',
        'Procesando': 'badge-info'
    };
    return clases[estado] || 'badge-secondary';
}

// Función para configurar eventos
function configurarEventos() {
    // Configurar filtro de estado (aunque dijiste que no es necesario ahora, lo dejo preparado)
    const filtroEstado = document.getElementById('status-filter');
    if (filtroEstado) {
        filtroEstado.addEventListener('change', function() {
            const estadoSeleccionado = this.value;
            if (estadoSeleccionado === 'all') {
                ordenesActuales = obtenerOrdenes();
            } else {
                ordenesActuales = filtrarOrdenesPorEstado(estadoSeleccionado);
            }
            paginaActual = 1; // Resetear a la primera página
            mostrarOrdenes(ordenesActuales);
            configurarPaginacion();
        });
    }
    
    // Configurar botones de paginación
    configurarBotonesPaginacion();
}

// Función para configurar la paginación
function configurarPaginacion() {
    const totalPaginas = Math.ceil(ordenesActuales.length / ordenesPorPagina);
    const botonesPagina = document.querySelectorAll('.page-number');
    
    // Actualizar botones de página
    botonesPagina.forEach((boton, index) => {
        const numeroPagina = index + 1;
        if (numeroPagina <= totalPaginas) {
            boton.style.display = 'inline-block';
            boton.classList.toggle('active', numeroPagina === paginaActual);
        } else {
            boton.style.display = 'none';
        }
    });
    
    // Habilitar/deshabilitar botones de navegación
    const btnAnterior = document.querySelector('[data-page="anterior"]');
    const btnSiguiente = document.querySelector('[data-page="siguiente"]');
    const btnPrimera = document.querySelector('[data-page="primera"]');
    const btnUltima = document.querySelector('[data-page="ultima"]');
    
    if (btnAnterior) btnAnterior.disabled = paginaActual === 1;
    if (btnPrimera) btnPrimera.disabled = paginaActual === 1;
    if (btnSiguiente) btnSiguiente.disabled = paginaActual === totalPaginas;
    if (btnUltima) btnUltima.disabled = paginaActual === totalPaginas;
}

// Función para configurar eventos de botones de paginación
function configurarBotonesPaginacion() {
    const botonesPagina = document.querySelectorAll('.page-btn');
    
    botonesPagina.forEach(boton => {
        boton.addEventListener('click', function() {
            const accion = this.getAttribute('data-page');
            const totalPaginas = Math.ceil(ordenesActuales.length / ordenesPorPagina);
            
            switch(accion) {
                case 'primera':
                    paginaActual = 1;
                    break;
                case 'anterior':
                    if (paginaActual > 1) paginaActual--;
                    break;
                case 'siguiente':
                    if (paginaActual < totalPaginas) paginaActual++;
                    break;
                case 'ultima':
                    paginaActual = totalPaginas;
                    break;
                default:
                    // Es un número de página
                    const numeroPagina = parseInt(accion);
                    if (numeroPagina && numeroPagina <= totalPaginas) {
                        paginaActual = numeroPagina;
                    }
            }
            
            mostrarOrdenes(ordenesActuales);
            configurarPaginacion();
        });
    });
}

// Función para mostrar errores
function mostrarError(mensaje) {
    const tbody = document.getElementById('orders-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-danger">
                    <strong>Error:</strong> ${mensaje}
                </td>
            </tr>
        `;
    }
}

// Agregar estilos CSS adicionales para los badges de estado
const estilosAdicionales = `
<style>
.badge {
    padding: 0.5em 0.75em;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.badge-success {
    background-color: #198754;
    color: white;
}

.badge-warning {
    background-color: #ffc107;
    color: #212529;
}

.badge-danger {
    background-color: #dc3545;
    color: white;
}

.badge-info {
    background-color: #0dcaf0;
    color: #212529;
}

.badge-secondary {
    background-color: #6c757d;
    color: white;
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-btn.active {
    background-color: #0d6efd;
    color: white;
    border-color: #0d6efd;
}
</style>
`;

// Inyectar estilos en el head
document.head.insertAdjacentHTML('beforeend', estilosAdicionales);
