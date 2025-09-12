// Gestión de lista de usuarios en el panel de administración
import { obtenerTodosLosUsuarios } from './modules/usuarios.js';

let todosLosUsuarios = [];
let usuariosFiltrados = [];
let usuarioSeleccionado = null;
let paginaActual = 1;
const usuariosPorPagina = 10;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Iniciando sistema de gestión de usuarios...');
    
    // Cargar usuarios al inicializar
    cargarUsuarios();
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Renderizar tabla inicial
    renderizarTablaUsuarios();
    
    console.log('✅ Sistema de gestión de usuarios listo');
});

function cargarUsuarios() {
    try {
        todosLosUsuarios = obtenerTodosLosUsuarios();
        usuariosFiltrados = [...todosLosUsuarios];
        
        console.log(`📊 Usuarios cargados: ${todosLosUsuarios.length}`);
        console.log('Usuarios por rol:', contarUsuariosPorRol());
        
        actualizarContadorTotal();
    } catch (error) {
        console.error('❌ Error cargando usuarios:', error);
        mostrarMensajeError('Error al cargar usuarios');
    }
}

function contarUsuariosPorRol() {
    return todosLosUsuarios.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {});
}

function configurarEventListeners() {
    // Filtro por rol
    const filtroRol = document.getElementById('role-filter');
    if (filtroRol) {
        filtroRol.addEventListener('change', function() {
            filtrarUsuarios(this.value);
        });
    }
    
    // Paginación
    const btnAnterior = document.getElementById('prev-page');
    const btnSiguiente = document.getElementById('next-page');
    
    if (btnAnterior) {
        btnAnterior.addEventListener('click', () => cambiarPagina(paginaActual - 1));
    }
    
    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', () => cambiarPagina(paginaActual + 1));
    }
}

function filtrarUsuarios(rolSeleccionado) {
    console.log(`🔍 Filtrando usuarios por rol: ${rolSeleccionado}`);
    
    if (rolSeleccionado === 'all') {
        usuariosFiltrados = [...todosLosUsuarios];
    } else {
        usuariosFiltrados = todosLosUsuarios.filter(user => user.role === rolSeleccionado);
    }
    
    // Resetear a la primera página
    paginaActual = 1;
    usuarioSeleccionado = null;
    
    // Actualizar la interfaz
    renderizarTablaUsuarios();
    actualizarContadorTotal();
    actualizarBotonesAccion();
    
    console.log(`📊 Usuarios filtrados: ${usuariosFiltrados.length}`);
}

function renderizarTablaUsuarios() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) {
        console.error('❌ No se encontró el tbody de la tabla');
        return;
    }
    
    const inicio = (paginaActual - 1) * usuariosPorPagina;
    const fin = inicio + usuariosPorPagina;
    const usuariosPagina = usuariosFiltrados.slice(inicio, fin);
    
    if (usuariosPagina.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #6c757d;">
                    <i style="font-size: 48px; display: block; margin-bottom: 15px;">👥</i>
                    No se encontraron usuarios
                </td>
            </tr>
        `;
        actualizarPaginacion();
        return;
    }
    
    tbody.innerHTML = usuariosPagina.map(usuario => `
        <tr class="user-row" data-user-id="${usuario.id}" onclick="seleccionarUsuario(${usuario.id})">
            <td>
                <input type="radio" name="userSelection" value="${usuario.id}" class="user-checkbox" 
                       onchange="seleccionarUsuarioPorCheckbox(${usuario.id})">
            </td>
            <td>
                <strong>${formatearNombreCompleto(usuario)}</strong>
            </td>
            <td>${usuario.email}</td>
            <td>${usuario.run || 'N/A'}</td>
            <td>
                <span class="user-role role-${usuario.role}">${formatearRol(usuario.role)}</span>
            </td>
            <td>${formatearFecha(usuario.fechaRegistro)}</td>
            <td>${usuario.telefono || 'N/A'}</td>
        </tr>
    `).join('');
    
    actualizarPaginacion();
}

function formatearNombreCompleto(usuario) {
    if (usuario.nombre && usuario.apellido) {
        return `${usuario.nombre} ${usuario.apellido}`;
    }
    return usuario.nombre || usuario.email.split('@')[0];
}

function formatearRol(role) {
    const roles = {
        'admin': 'Administrador',
        'cliente': 'Cliente',
        'vendedor': 'Vendedor'
    };
    return roles[role] || role;
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return 'N/A';
    
    try {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
}

function seleccionarUsuario(userId) {
    // Remover selección anterior
    document.querySelectorAll('.user-row').forEach(row => {
        row.classList.remove('selected');
    });
    
    // Agregar selección al usuario clickeado
    const fila = document.querySelector(`[data-user-id="${userId}"]`);
    if (fila) {
        fila.classList.add('selected');
        
        // Marcar el radio button correspondiente
        const radio = fila.querySelector('.user-checkbox');
        if (radio) {
            radio.checked = true;
        }
    }
    
    // Guardar usuario seleccionado
    usuarioSeleccionado = usuariosFiltrados.find(user => user.id == userId);
    
    // Actualizar botones de acción
    actualizarBotonesAccion();
    
    // Mostrar detalles del usuario
    mostrarDetallesUsuario(usuarioSeleccionado);
    
    console.log('👤 Usuario seleccionado:', usuarioSeleccionado);
}

function seleccionarUsuarioPorCheckbox(userId) {
    seleccionarUsuario(userId);
}

function mostrarDetallesUsuario(usuario) {
    if (!usuario) {
        cerrarDetallesUsuario();
        return;
    }
    
    const panel = document.getElementById('user-details-panel');
    if (!panel) return;
    
    // Llenar los datos
    document.getElementById('detail-nombre').textContent = formatearNombreCompleto(usuario);
    document.getElementById('detail-run').textContent = usuario.run || 'N/A';
    document.getElementById('detail-correo').textContent = usuario.email;
    document.getElementById('detail-telefono').textContent = usuario.telefono || 'N/A';
    
    const rolElement = document.getElementById('detail-rol');
    rolElement.textContent = formatearRol(usuario.role);
    rolElement.className = `role-badge role-${usuario.role}`;
    
    document.getElementById('detail-fecha').textContent = formatearFecha(usuario.fechaRegistro);
    document.getElementById('detail-direccion').textContent = usuario.direccion || 'N/A';
    document.getElementById('detail-region').textContent = formatearRegion(usuario.region);
    document.getElementById('detail-comuna').textContent = formatearComuna(usuario.comuna);
    document.getElementById('detail-comentario').textContent = usuario.comentario || 'Sin comentarios';
    
    // Mostrar el panel
    panel.style.display = 'block';
    
    // Scroll suave hacia el panel
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function cerrarDetallesUsuario() {
    const panel = document.getElementById('user-details-panel');
    if (panel) {
        panel.style.display = 'none';
    }
    
    // Limpiar selección
    usuarioSeleccionado = null;
    document.querySelectorAll('.user-row').forEach(row => {
        row.classList.remove('selected');
    });
    document.querySelectorAll('.user-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    actualizarBotonesAccion();
}

function formatearRegion(regionKey) {
    const regiones = {
        'region-metropolitana': 'Región Metropolitana',
        'region-valparaiso': 'Región de Valparaíso',
        'region-biobio': 'Región del Biobío',
        'region-maule': 'Región del Maule',
        'region-ohiggins': 'Región de O\'Higgins',
        'region-araucania': 'Región de La Araucanía'
    };
    return regiones[regionKey] || regionKey || 'N/A';
}

function formatearComuna(comunaKey) {
    const comunas = {
        'santiago': 'Santiago',
        'las-condes': 'Las Condes',
        'valparaiso': 'Valparaíso',
        'vina-del-mar': 'Viña del Mar',
        'concepcion': 'Concepción',
        'talca': 'Talca',
        'rancagua': 'Rancagua',
        'temuco': 'Temuco',
        'maipu': 'Maipú'
    };
    return comunas[comunaKey] || comunaKey || 'N/A';
}

// Función global para cerrar detalles (llamada desde HTML)
window.cerrarDetallesUsuario = cerrarDetallesUsuario;

function actualizarBotonesAccion() {
    const btnEditar = document.getElementById('edit-user-btn');
    const btnEliminar = document.getElementById('delete-user-btn');
    
    const haySeleccion = usuarioSeleccionado !== null;
    
    if (btnEditar) {
        btnEditar.disabled = !haySeleccion;
    }
    
    if (btnEliminar) {
        btnEliminar.disabled = !haySeleccion;
    }
}

function actualizarPaginacion() {
    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
    
    // Actualizar botones anterior/siguiente
    const btnAnterior = document.getElementById('prev-page');
    const btnSiguiente = document.getElementById('next-page');
    
    if (btnAnterior) {
        btnAnterior.disabled = paginaActual <= 1;
    }
    
    if (btnSiguiente) {
        btnSiguiente.disabled = paginaActual >= totalPaginas;
    }
    
    // Actualizar información de paginación
    const inicio = (paginaActual - 1) * usuariosPorPagina + 1;
    const fin = Math.min(paginaActual * usuariosPorPagina, usuariosFiltrados.length);
    
    const paginationInfo = document.getElementById('pagination-info');
    if (paginationInfo) {
        paginationInfo.textContent = `Mostrando ${inicio}-${fin} de ${usuariosFiltrados.length} usuarios`;
    }
    
    // Generar números de página
    generarNumerosPagina(totalPaginas);
}

function generarNumerosPagina(totalPaginas) {
    const pageNumbers = document.getElementById('page-numbers');
    if (!pageNumbers) return;
    
    pageNumbers.innerHTML = '';
    
    // Mostrar máximo 5 números de página
    let inicio = Math.max(1, paginaActual - 2);
    let fin = Math.min(totalPaginas, inicio + 4);
    
    // Ajustar inicio si estamos cerca del final
    if (fin - inicio < 4) {
        inicio = Math.max(1, fin - 4);
    }
    
    for (let i = inicio; i <= fin; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === paginaActual ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => cambiarPagina(i);
        pageNumbers.appendChild(pageBtn);
    }
}

function cambiarPagina(nuevaPagina) {
    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
    
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) {
        return;
    }
    
    paginaActual = nuevaPagina;
    usuarioSeleccionado = null; // Limpiar selección al cambiar de página
    
    renderizarTablaUsuarios();
    actualizarBotonesAccion();
    
    console.log(`📄 Página cambiada a: ${paginaActual}`);
}

function actualizarContadorTotal() {
    const totalElement = document.getElementById('total-users');
    if (totalElement) {
        totalElement.textContent = usuariosFiltrados.length;
    }
}

function mostrarMensajeError(mensaje) {
    const tbody = document.getElementById('users-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #e74c3c;">
                    <i style="font-size: 48px; display: block; margin-bottom: 15px;">⚠️</i>
                    ${mensaje}
                </td>
            </tr>
        `;
    }
}

// Funciones globales para los botones de acción
window.editarUsuarioSeleccionado = function() {
    if (!usuarioSeleccionado) {
        alert('Por favor, selecciona un usuario para editar.');
        return;
    }
    
    console.log('✏️ Editando usuario:', usuarioSeleccionado);
    
    // Guardar el usuario a editar en sessionStorage para la página de edición
    sessionStorage.setItem('usuarioAEditar', JSON.stringify(usuarioSeleccionado));
    
    // Redirigir a la página de edición (cuando la creemos)
    window.location.href = 'editarUsuario.html';
};

window.eliminarUsuarioSeleccionado = function() {
    if (!usuarioSeleccionado) {
        alert('Por favor, selecciona un usuario para eliminar.');
        return;
    }
    
    // No permitir eliminar administradores predefinidos
    if (usuarioSeleccionado.email === 'admin' && usuarioSeleccionado.role === 'admin') {
        alert('No se puede eliminar el usuario administrador principal.');
        return;
    }
    
    const confirmacion = confirm(`¿Estás seguro de que quieres eliminar al usuario "${formatearNombreCompleto(usuarioSeleccionado)}"?\n\nEsta acción no se puede deshacer.`);
    
    if (confirmacion) {
        try {
            // Eliminar de localStorage
            const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
            const usuariosActualizados = usuariosRegistrados.filter(user => user.id !== usuarioSeleccionado.id);
            localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosActualizados));
            
            console.log('🗑️ Usuario eliminado:', usuarioSeleccionado);
            
            // Recargar datos
            cargarUsuarios();
            renderizarTablaUsuarios();
            usuarioSeleccionado = null;
            actualizarBotonesAccion();
            
            alert('Usuario eliminado exitosamente.');
            
        } catch (error) {
            console.error('❌ Error eliminando usuario:', error);
            alert('Error al eliminar el usuario. Intenta nuevamente.');
        }
    }
};

// Función de utilidad para debugging
window.debugUsuarios = {
    verTodos: () => todosLosUsuarios,
    verFiltrados: () => usuariosFiltrados,
    verSeleccionado: () => usuarioSeleccionado,
    recargar: () => {
        cargarUsuarios();
        renderizarTablaUsuarios();
    }
};

console.log('🔧 Sistema de gestión de usuarios cargado. Usa debugUsuarios.verTodos() para debugging.');