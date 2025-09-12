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
        console.log('🔄 Iniciando carga de usuarios...');
        todosLosUsuarios = obtenerTodosLosUsuarios();
        usuariosFiltrados = [...todosLosUsuarios];
        
        console.log(`📊 Usuarios cargados: ${todosLosUsuarios.length}`);
        console.log('📝 Primer usuario (estructura):', todosLosUsuarios[0] || 'No hay usuarios');
        console.log('Usuarios por rol:', contarUsuariosPorRol());
        
        // Actualizar contador en la interfaz
        actualizarContadorTotal();
        
        if (todosLosUsuarios.length === 0) {
            console.warn('⚠️ No se cargaron usuarios. Verificar localStorage y usuarios.js');
        }
        
    } catch (error) {
        console.error('❌ Error al cargar usuarios:', error);
        alert('Error al cargar la lista de usuarios: ' + error.message);
    }
}

function contarUsuariosPorRol() {
    const conteo = {};
    todosLosUsuarios.forEach(user => {
        conteo[user.role] = (conteo[user.role] || 0) + 1;
    });
    return conteo;
}

function actualizarContadorTotal() {
    const totalElement = document.getElementById('total-users');
    if (totalElement) {
        totalElement.textContent = usuariosFiltrados.length;
    }
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
    
    // Botones de acción
    const btnMostrar = document.getElementById('show-user-btn');
    const btnEditar = document.getElementById('edit-user-btn');
    const btnEliminar = document.getElementById('delete-user-btn');
    
    if (btnMostrar) {
        btnMostrar.addEventListener('click', mostrarUsuarioSeleccionado);
    }
    
    if (btnEditar) {
        btnEditar.addEventListener('click', editarUsuarioSeleccionado);
    }
    
    if (btnEliminar) {
        btnEliminar.addEventListener('click', eliminarUsuarioSeleccionado);
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
        console.error('No se encontró el elemento users-tbody');
        return;
    }
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Calcular usuarios para la página actual
    const inicio = (paginaActual - 1) * usuariosPorPagina;
    const fin = inicio + usuariosPorPagina;
    const usuariosPagina = usuariosFiltrados.slice(inicio, fin);
    
    console.log(`📄 Renderizando página ${paginaActual}: ${usuariosPagina.length} usuarios`);
    
    // Crear filas
    usuariosPagina.forEach(user => {
        const fila = crearFilaUsuario(user);
        tbody.appendChild(fila);
    });
    
    // Actualizar paginación
    actualizarPaginacion();
    
    // Si no hay usuarios, mostrar mensaje
    if (usuariosPagina.length === 0) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td colspan="8" class="text-center" style="padding: 40px;">
                <div style="color: #6c757d;">
                    <i style="font-size: 48px;">👥</i>
                    <p style="margin-top: 15px; font-size: 16px;">No se encontraron usuarios</p>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    }
}

function crearFilaUsuario(user) {
    const fila = document.createElement('tr');
    fila.className = 'user-row';
    fila.dataset.userId = user.id;
    
    // Formatear datos
    const nombreCompleto = formatearNombreCompleto(user);
    const rolFormateado = formatearRol(user.role);
    const fechaFormateada = formatearFecha(user.fechaRegistro);
    
    fila.innerHTML = `
        <td>
            <input type="checkbox" class="user-checkbox" value="${user.id}">
        </td>
        <td class="user-name">${nombreCompleto}</td>
        <td class="user-email">${user.email}</td>
        <td class="user-run">${user.run || 'N/A'}</td>
        <td class="user-phone">${user.telefono || 'N/A'}</td>
        <td>
            <span class="role-badge role-${user.role}">${rolFormateado}</span>
        </td>
        <td class="user-date">${fechaFormateada}</td>
        <td class="user-actions">
            <button class="btn-view-user" onclick="verDetallesUsuario(${user.id})" title="Ver detalles">
                👁️
            </button>
        </td>
    `;
    
    // Event listener para selección
    fila.addEventListener('click', function(e) {
        // No seleccionar si se hizo clic en checkbox o botón
        if (e.target.type === 'checkbox' || e.target.tagName === 'BUTTON') {
            return;
        }
        
        seleccionarUsuario(user);
    });
    
    // Event listener para checkbox
    const checkbox = fila.querySelector('.user-checkbox');
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            seleccionarUsuario(user);
        } else {
            usuarioSeleccionado = null;
            actualizarBotonesAccion();
            cerrarDetallesUsuario();
        }
    });
    
    return fila;
}

function seleccionarUsuario(user) {
    console.log('👤 Usuario seleccionado:', user);
    console.log('📧 Email del usuario:', user.email);
    console.log('🆔 ID del usuario:', user.id);
    
    // Actualizar selección global
    usuarioSeleccionado = user;
    
    // Actualizar interfaz visual
    document.querySelectorAll('.user-row').forEach(row => {
        row.classList.remove('selected');
    });
    
    document.querySelectorAll('.user-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Marcar fila actual como seleccionada
    const filaActual = document.querySelector(`[data-user-id="${user.id}"]`);
    if (filaActual) {
        filaActual.classList.add('selected');
        const checkbox = filaActual.querySelector('.user-checkbox');
        if (checkbox) {
            checkbox.checked = true;
        }
    }
    
    // Actualizar botones de acción
    actualizarBotonesAccion();
    
    // Mostrar detalles del usuario
    mostrarDetallesUsuario(user);
}

function formatearNombreCompleto(user) {
    if (!user) {
        return 'Usuario desconocido';
    }
    const nombre = user.nombre || '';
    const apellido = user.apellido || '';
    return `${nombre} ${apellido}`.trim() || 'Sin nombre';
}

function formatearRol(role) {
    const roles = {
        'admin': 'Administrador',
        'cliente': 'Cliente', 
        'vendedor': 'Vendedor'
    };
    return roles[role] || role;
}

function formatearFecha(fechaString) {
    if (!fechaString) return 'N/A';
    
    try {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
}

function cambiarPagina(nuevaPagina) {
    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
    
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) {
        return;
    }
    
    paginaActual = nuevaPagina;
    usuarioSeleccionado = null;
    
    renderizarTablaUsuarios();
    actualizarBotonesAccion();
    cerrarDetallesUsuario();
    
    console.log(`📄 Cambiado a página: ${paginaActual}/${totalPaginas}`);
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
    const btnMostrar = document.getElementById('show-user-btn');
    const btnEditar = document.getElementById('edit-user-btn');
    const btnEliminar = document.getElementById('delete-user-btn');
    
    const haySeleccion = usuarioSeleccionado !== null;
    
    if (btnMostrar) {
        btnMostrar.disabled = !haySeleccion;
    }
    
    if (btnEditar) {
        btnEditar.disabled = !haySeleccion;
    }
    
    if (btnEliminar) {
        btnEliminar.disabled = !haySeleccion;
    }
}

function eliminarUsuarioSeleccionado() {
    if (!usuarioSeleccionado) {
        alert('Por favor, selecciona un usuario para eliminar.');
        return;
    }
    
    // Verificar si es un usuario del sistema (admin predefinido)
    const esUsuarioSistema = usuarioSeleccionado.id <= 10; // Los primeros 10 son usuarios predefinidos
    
    if (esUsuarioSistema) {
        alert('No se pueden eliminar los usuarios del sistema (administradores, clientes y vendedores predefinidos).');
        return;
    }
    
    // Confirmar eliminación
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar al usuario "${formatearNombreCompleto(usuarioSeleccionado)}"?\n\nEsta acción no se puede deshacer.`);
    
    if (!confirmacion) {
        return;
    }
    
    try {
        // Obtener usuarios de localStorage
        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        
        // Buscar el usuario a eliminar por email (más confiable que por ID)
        const indiceUsuario = usuariosRegistrados.findIndex(user => user.correo === usuarioSeleccionado.email);
        
        if (indiceUsuario === -1) {
            alert('Usuario no encontrado en localStorage. Puede que ya haya sido eliminado.');
            return;
        }
        
        // Eliminar usuario del array
        usuariosRegistrados.splice(indiceUsuario, 1);
        
        // Guardar cambios en localStorage
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
        
        console.log(`🗑️ Usuario eliminado: ${usuarioSeleccionado.email}`);
        console.log(`📊 Usuarios restantes en localStorage: ${usuariosRegistrados.length}`);
        
        // Guardar el nombre del usuario antes de cerrar detalles
        const nombreUsuarioEliminado = formatearNombreCompleto(usuarioSeleccionado);
        
        // Actualizar la interfaz
        cargarUsuarios();
        renderizarTablaUsuarios();
        cerrarDetallesUsuario(); // Cerrar panel de detalles
        
        alert(`Usuario "${nombreUsuarioEliminado}" eliminado correctamente.`);
        
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario. Por favor, inténtalo de nuevo.');
    }
}

function mostrarUsuarioSeleccionado() {
    if (!usuarioSeleccionado) {
        alert('Por favor, selecciona un usuario para mostrar.');
        return;
    }
    
    // Redirigir a página de edición en modo mostrar
    const url = `editarUsuario.html?email=${encodeURIComponent(usuarioSeleccionado.email)}&modo=mostrar`;
    window.location.href = url;
}

function editarUsuarioSeleccionado() {
    console.log('🔧 Intentando editar usuario...');
    console.log('Usuario seleccionado:', usuarioSeleccionado);
    
    if (!usuarioSeleccionado) {
        alert('Por favor, selecciona un usuario para editar.');
        return;
    }
    
    console.log('Email del usuario:', usuarioSeleccionado.email);
    
    // Verificar si es un usuario del sistema (solo se pueden editar usuarios de localStorage)
    const esUsuarioSistema = usuarioSeleccionado.id <= 10;
    
    if (esUsuarioSistema) {
        console.log('Usuario del sistema detectado, redirigiendo a modo solo lectura');
        // Redirigir en modo solo lectura
        const url = `editarUsuario.html?email=${encodeURIComponent(usuarioSeleccionado.email)}&modo=mostrar`;
        console.log('URL de redirección:', url);
        window.location.href = url;
        return;
    }
    
    console.log('Usuario de localStorage detectado, redirigiendo a modo edición');
    // Redirigir a página de edición en modo editar
    const url = `editarUsuario.html?email=${encodeURIComponent(usuarioSeleccionado.email)}&modo=editar`;
    console.log('URL de redirección:', url);
    window.location.href = url;
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

// Hacer funciones globales para llamadas desde HTML
window.mostrarUsuarioSeleccionado = mostrarUsuarioSeleccionado;
window.editarUsuarioSeleccionado = editarUsuarioSeleccionado;