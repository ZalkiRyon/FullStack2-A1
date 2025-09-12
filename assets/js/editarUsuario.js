// Edición de usuario en el panel de administración
import { obtenerTodosLosUsuarios } from './modules/usuarios.js';

let usuarioActual = null;
let modoSoloLectura = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Iniciando sistema de edición de usuarios...');
    
    // Obtener datos del usuario desde URL params
    cargarDatosUsuario();
    
    // Configurar validaciones y eventos
    configurarFormulario();
    
    console.log('✅ Sistema de edición de usuarios listo');
});

function cargarDatosUsuario() {
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('email');
    const modo = urlParams.get('modo') || 'editar'; // 'editar' o 'mostrar'
    
    console.log('🔍 Parámetros de URL recibidos:');
    console.log('- Email:', userEmail);
    console.log('- Modo:', modo);
    console.log('- URL completa:', window.location.href);
    
    modoSoloLectura = modo === 'mostrar';
    
    if (!userEmail) {
        console.error('❌ No se encontró el parámetro email en la URL');
        alert('No se especificó el usuario a editar.');
        window.location.href = 'listarUsuarios.html';
        return;
    }
    
    // Buscar usuario
    const todosLosUsuarios = obtenerTodosLosUsuarios();
    console.log('📊 Total de usuarios disponibles:', todosLosUsuarios.length);
    console.log('🔍 Buscando usuario con email:', userEmail);
    
    usuarioActual = todosLosUsuarios.find(user => user.email === userEmail);
    
    console.log('✅ Usuario encontrado:', usuarioActual ? 'Sí' : 'No');
    if (usuarioActual) {
        console.log('👤 Datos del usuario encontrado:', usuarioActual);
    }
    
    if (!usuarioActual) {
        console.error('❌ Usuario no encontrado con email:', userEmail);
        alert('Usuario no encontrado.');
        window.location.href = 'listarUsuarios.html';
        return;
    }
    
    // Verificar si es usuario del sistema (solo lectura para usuarios predefinidos)
    const esUsuarioSistema = usuarioActual.id <= 10;
    
    if (esUsuarioSistema && modo === 'editar') {
        alert('Los usuarios del sistema solo pueden visualizarse, no editarse. Cambiando a modo visualización.');
        modoSoloLectura = true;
    }
    
    // Actualizar título según modo
    const titulo = document.querySelector('.page-title');
    if (titulo) {
        titulo.textContent = modoSoloLectura ? 'VISUALIZAR USUARIO' : 'EDITAR USUARIO';
    }
    
    // Llenar formulario con datos del usuario
    llenarFormulario();
    
    // Configurar modo de solo lectura si es necesario
    if (modoSoloLectura) {
        configurarModoSoloLectura();
    }
    
    console.log('👤 Usuario cargado:', usuarioActual);
}

function llenarFormulario() {
    if (!usuarioActual) return;
    
    // Campos básicos
    document.getElementById('nombre').value = usuarioActual.nombre || '';
    document.getElementById('apellido').value = usuarioActual.apellido || '';
    document.getElementById('run').value = usuarioActual.run || '';
    document.getElementById('correo').value = usuarioActual.email || '';
    document.getElementById('telefono').value = usuarioActual.telefono || '';
    document.getElementById('tipoUsuario').value = usuarioActual.role || '';
    
    // Dirección
    document.getElementById('direccion').value = usuarioActual.direccion || '';
    
    // Región y comuna
    cargarRegiones();
    setTimeout(() => {
        if (usuarioActual.region) {
            document.getElementById('direccionRegion').value = usuarioActual.region;
            cargarComunas(usuarioActual.region);
            setTimeout(() => {
                if (usuarioActual.comuna) {
                    document.getElementById('direccionComuna').value = usuarioActual.comuna;
                }
            }, 100);
        }
    }, 100);
    
    // Comentario
    document.getElementById('comentario').value = usuarioActual.comentario || '';
    
    // Manejar campos de contraseña
    manejarCamposContrasena();
}

function manejarCamposContrasena() {
    const passwordField = document.getElementById('contrasena');
    const confirmPasswordField = document.getElementById('confirmarContrasena');
    
    if (!passwordField || !confirmPasswordField) return;
    
    // Para modo edición: llenar con placeholder visual (asteriscos)
    // Para modo solo lectura: deshabilitar
    if (modoSoloLectura) {
        passwordField.placeholder = 'Contraseña oculta';
        confirmPasswordField.placeholder = 'Contraseña oculta';
    } else {
        // Llenar con asteriscos para indicar que hay contraseña
        const placeholderPassword = '••••••••'; // 8 asteriscos como placeholder visual
        
        passwordField.value = placeholderPassword;
        confirmPasswordField.value = placeholderPassword;
        
        passwordField.placeholder = 'Dejar sin cambios para mantener contraseña actual';
        confirmPasswordField.placeholder = 'Debe coincidir con la contraseña';
        
        passwordField.required = false;
        confirmPasswordField.required = false;
        
        // Agregar event listeners para validación y limpieza
        configurarValidacionContrasenas();
    }
}

function configurarValidacionContrasenas() {
    const passwordField = document.getElementById('contrasena');
    const confirmPasswordField = document.getElementById('confirmarContrasena');
    
    // Flag para saber si el usuario quiere cambiar la contraseña
    let cambiarContrasena = false;
    
    // Limpiar campos cuando el usuario comience a escribir
    passwordField.addEventListener('focus', function() {
        if (this.value === '••••••••') {
            this.value = '';
            confirmPasswordField.value = '';
            cambiarContrasena = true;
            this.required = true;
            confirmPasswordField.required = true;
        }
    });
    
    confirmPasswordField.addEventListener('focus', function() {
        if (passwordField.value === '••••••••') {
            passwordField.value = '';
            this.value = '';
            cambiarContrasena = true;
            passwordField.required = true;
            this.required = true;
        }
    });
    
    // Validar que las contraseñas coincidan
    function validarCoincidencia() {
        if (cambiarContrasena || (passwordField.value !== '••••••••' && passwordField.value.length > 0)) {
            if (passwordField.value !== confirmPasswordField.value) {
                confirmPasswordField.setCustomValidity('Las contraseñas no coinciden');
                confirmPasswordField.classList.add('password-match-error');
                confirmPasswordField.classList.remove('password-match-success');
            } else if (passwordField.value.length > 0) {
                confirmPasswordField.setCustomValidity('');
                confirmPasswordField.classList.add('password-match-success');
                confirmPasswordField.classList.remove('password-match-error');
            } else {
                confirmPasswordField.setCustomValidity('');
                confirmPasswordField.classList.remove('password-match-error', 'password-match-success');
            }
        } else {
            confirmPasswordField.setCustomValidity('');
            confirmPasswordField.classList.remove('password-match-error', 'password-match-success');
        }
    }
    
    passwordField.addEventListener('input', validarCoincidencia);
    confirmPasswordField.addEventListener('input', validarCoincidencia);
    
    // Guardar estado para usar en el envío del formulario
    window.cambiarContrasena = () => cambiarContrasena || passwordField.value !== '••••••••';
}

function configurarModoSoloLectura() {
    // Deshabilitar todos los campos
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.disabled = true;
        input.style.backgroundColor = '#f8f9fa';
        input.style.cursor = 'not-allowed';
    });
    
    // Cambiar botón
    const btnSubmit = document.querySelector('.btn-registrar');
    if (btnSubmit) {
        btnSubmit.textContent = 'VOLVER A LISTA';
        btnSubmit.disabled = false;
        btnSubmit.style.backgroundColor = '#6c757d';
        btnSubmit.onclick = function(e) {
            e.preventDefault();
            window.location.href = 'listarUsuarios.html';
        };
    }
}

function configurarFormulario() {
    const form = document.querySelector('.usuario-form') || document.querySelector('#nuevoUsuarioForm') || document.querySelector('.formRegistro');
    if (!form) {
        console.error('❌ No se encontró el formulario');
        return;
    }
    
    console.log('✅ Formulario encontrado:', form);
    
    // Cargar regiones
    cargarRegiones();
    
    // Event listener para cambio de región
    const regionSelect = document.getElementById('direccionRegion');
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            cargarComunas(this.value);
        });
    }
    
    // Event listener para envío del formulario
    if (!modoSoloLectura) {
        console.log('🔧 Configurando event listener para submit');
        form.addEventListener('submit', manejarActualizacion);
        
        // También prevenir con onsubmit como respaldo
        form.onsubmit = function(e) {
            console.log('🔄 onsubmit ejecutado como respaldo');
            e.preventDefault();
            manejarActualizacion(e);
            return false;
        };
    }
}

function manejarActualizacion(e) {
    console.log('🔄 Manejando actualización del formulario...');
    
    // Prevenir el envío del formulario inmediatamente
    if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('✅ preventDefault() + stopPropagation() ejecutados');
    }
    
    if (!usuarioActual) {
        console.error('❌ No hay usuario cargado');
        alert('Error: No hay usuario cargado para actualizar.');
        return false;
    }
    
    console.log('👤 Usuario actual:', usuarioActual);
    
    // Verificar si es usuario del sistema
    const esUsuarioSistema = usuarioActual.id <= 10;
    
    if (esUsuarioSistema) {
        alert('No se pueden editar los usuarios del sistema.');
        return;
    }
    
    // Recopilar datos del formulario
    const formData = new FormData(e.target);
    const datosActualizados = Object.fromEntries(formData.entries());
    
    // Validaciones básicas
    if (!datosActualizados.nombre || !datosActualizados.apellido || !datosActualizados.correo) {
        alert('Los campos nombre, apellido y correo son obligatorios.');
        return;
    }
    
    try {
        // Obtener usuarios de localStorage
        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        
        // Buscar el usuario a actualizar
        const indiceUsuario = usuariosRegistrados.findIndex(user => user.correo === usuarioActual.email);
        
        if (indiceUsuario === -1) {
            alert('Usuario no encontrado en localStorage.');
            return;
        }
        
        // Actualizar datos (mantener ID y fecha de registro originales)
        const usuarioActualizado = {
            ...usuariosRegistrados[indiceUsuario], // Mantener datos originales
            nombre: datosActualizados.nombre,
            apellido: datosActualizados.apellido,
            correo: datosActualizados.correo,
            run: datosActualizados.run,
            telefono: datosActualizados.telefono,
            direccion: datosActualizados.direccion,
            direccionRegion: datosActualizados.direccionRegion,
            direccionComuna: datosActualizados.direccionComuna,
            comentario: datosActualizados.comentario,
            role: datosActualizados.tipoUsuario,
            fechaModificacion: new Date().toISOString()
        };
        
        // Actualizar contraseña solo si el usuario decidió cambiarla
        const debeActualizarContrasena = window.cambiarContrasena && window.cambiarContrasena();
        if (debeActualizarContrasena && datosActualizados.contrasena && datosActualizados.contrasena.trim() !== '' && datosActualizados.contrasena !== '••••••••') {
            // Validar que las contraseñas coincidan
            if (datosActualizados.contrasena !== datosActualizados.confirmarContrasena) {
                alert('Las contraseñas no coinciden. Por favor, verifícalas.');
                return;
            }
            usuarioActualizado.contrasena = datosActualizados.contrasena;
        }
        
        // Verificar si el correo ya existe en otro usuario
        const correoExiste = usuariosRegistrados.some((user, index) => 
            index !== indiceUsuario && user.correo === datosActualizados.correo
        );
        
        if (correoExiste) {
            alert('Ya existe otro usuario con este correo electrónico.');
            return;
        }
        
        // Actualizar el array
        usuariosRegistrados[indiceUsuario] = usuarioActualizado;
        
        // Guardar en localStorage
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
        
        console.log('✅ Usuario actualizado:', usuarioActualizado);
        
        alert('Usuario actualizado correctamente.');
        
        // Regresar a la lista después de un breve delay
        console.log('🔄 Redirigiendo a listarUsuarios.html');
        setTimeout(() => {
            window.location.href = 'listarUsuarios.html';
        }, 100);
        
        return false;
        
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        alert('Error al actualizar el usuario. Por favor, inténtalo de nuevo.');
        return false;
    }
    
    return false;
}

// Funciones de regiones y comunas (copiadas de nuevoUsuario.js)
const regionesComunas = {
    'region-metropolitana': {
        nombre: 'Región Metropolitana',
        comunas: [
            { value: 'santiago', text: 'Santiago' },
            { value: 'las-condes', text: 'Las Condes' },
            { value: 'maipu', text: 'Maipú' },
            { value: 'providencia', text: 'Providencia' },
            { value: 'vitacura', text: 'Vitacura' }
        ]
    },
    'region-valparaiso': {
        nombre: 'Región de Valparaíso',
        comunas: [
            { value: 'valparaiso', text: 'Valparaíso' },
            { value: 'vina-del-mar', text: 'Viña del Mar' },
            { value: 'quilpue', text: 'Quilpué' },
            { value: 'villa-alemana', text: 'Villa Alemana' }
        ]
    },
    'region-biobio': {
        nombre: 'Región del Biobío',
        comunas: [
            { value: 'concepcion', text: 'Concepción' },
            { value: 'talcahuano', text: 'Talcahuano' },
            { value: 'chiguayante', text: 'Chiguayante' },
            { value: 'san-pedro', text: 'San Pedro de la Paz' }
        ]
    },
    'region-maule': {
        nombre: 'Región del Maule',
        comunas: [
            { value: 'talca', text: 'Talca' },
            { value: 'curico', text: 'Curicó' },
            { value: 'linares', text: 'Linares' },
            { value: 'molina', text: 'Molina' }
        ]
    },
    'region-ohiggins': {
        nombre: 'Región de O\'Higgins',
        comunas: [
            { value: 'rancagua', text: 'Rancagua' },
            { value: 'san-fernando', text: 'San Fernando' },
            { value: 'rengo', text: 'Rengo' },
            { value: 'machali', text: 'Machalí' }
        ]
    },
    'region-araucania': {
        nombre: 'Región de La Araucanía',
        comunas: [
            { value: 'temuco', text: 'Temuco' },
            { value: 'angol', text: 'Angol' },
            { value: 'villarrica', text: 'Villarrica' },
            { value: 'pucon', text: 'Pucón' }
        ]
    }
};

function cargarRegiones() {
    const selectRegion = document.getElementById('direccionRegion');
    const selectComuna = document.getElementById('direccionComuna');
    
    if (!selectRegion) return;
    
    // Limpiar opciones existentes (excepto la primera)
    selectRegion.innerHTML = '<option value="">Seleccionar región...</option>';
    
    // Cargar regiones dinámicamente
    Object.keys(regionesComunas).forEach(regionKey => {
        const option = document.createElement('option');
        option.value = regionKey;
        option.textContent = regionesComunas[regionKey].nombre;
        selectRegion.appendChild(option);
    });
    
    // Limpiar comunas cuando no hay región seleccionada
    if (selectComuna) {
        selectComuna.innerHTML = '<option value="">Seleccionar comuna...</option>';
        selectComuna.disabled = true;
    }
}

function cargarComunas(regionKey) {
    const selectComuna = document.getElementById('direccionComuna');
    
    if (!selectComuna) return;
    
    // Limpiar opciones existentes
    selectComuna.innerHTML = '<option value="">Seleccionar comuna...</option>';
    
    if (regionKey && regionesComunas[regionKey]) {
        // Habilitar el select de comunas
        selectComuna.disabled = false;
        
        // Cargar comunas de la región seleccionada
        regionesComunas[regionKey].comunas.forEach(comuna => {
            const option = document.createElement('option');
            option.value = comuna.value;
            option.textContent = comuna.text;
            selectComuna.appendChild(option);
        });
    } else {
        selectComuna.disabled = true;
    }
}