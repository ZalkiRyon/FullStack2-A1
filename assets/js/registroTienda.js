// Registro de clientes desde la tienda
import { obtenerTodosLosUsuarios } from './modules/usuarios.js';
import { 
    ValidadorRun, 
    validarCorreo, 
    validarContrasena, 
    validarTelefono,
    cargarRegiones, 
    cargarComunas, 
    configurarEventosFormulario 
} from './modules/validaciones.js';

// Inicialización del DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Registro de tienda cargado');
    
    // Cargar regiones usando el módulo compartido
    const selectRegion = document.getElementById('direccionRegion');
    cargarRegiones(selectRegion);
    
    // Configurar eventos estándar del formulario
    configurarEventosFormulario({
        regionSelectId: 'direccionRegion',
        comunaSelectId: 'direccionComuna',
        runInputId: 'run',
        telefonoInputId: 'telefono'
    });
    
    // Configurar validación del formulario específica para tienda
    configurarValidacionFormulario();
});

function configurarValidacionFormulario() {
    const form = document.getElementById('registroTiendaForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        manejarRegistro();
    });
}

async function manejarRegistro() {
    console.log('🔄 Procesando registro de cliente...');
    
    // Obtener datos del formulario
    const datosFormulario = obtenerDatosFormulario();
    
    // Validar datos
    const validacion = validarDatosRegistro(datosFormulario);
    if (!validacion.valido) {
        alert(`Error de validación: ${validacion.mensaje}`);
        return;
    }
    
    // Verificar que no exista usuario con mismo correo o RUN
    if (await verificarUsuarioExistente(datosFormulario.correo, datosFormulario.run)) {
        alert('Ya existe un usuario registrado con este correo o RUN.');
        return;
    }
    
    // Crear objeto usuario para cliente
    const nuevoCliente = crearObjetoCliente(datosFormulario);
    
    // Guardar en localStorage
    if (guardarNuevoCliente(nuevoCliente)) {
        alert('¡Cliente registrado exitosamente! Ya puedes iniciar sesión.');
        limpiarFormulario();
        // Redirigir a inicio de sesión
        setTimeout(() => {
            window.location.href = 'inicioSesion.html';
        }, 1000);
    } else {
        alert('Error al guardar el cliente. Por favor, inténtalo de nuevo.');
    }
}

function obtenerDatosFormulario() {
    return {
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        run: document.getElementById('run').value.trim(),
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        correo: document.getElementById('correo').value.trim().toLowerCase(),
        telefono: document.getElementById('telefono').value.trim(),
        contrasena: document.getElementById('contrasena').value,
        confirmarContrasena: document.getElementById('confirmarContrasena').value,
        direccionRegion: document.getElementById('direccionRegion').value,
        direccionComuna: document.getElementById('direccionComuna').value,
        direccion: document.getElementById('direccion').value.trim()
    };
}

function validarDatosRegistro(datos) {
    // Validar campos obligatorios
    if (!datos.nombre || !datos.apellido || !datos.run || !datos.correo || 
        !datos.contrasena || !datos.confirmarContrasena || !datos.direccionRegion || 
        !datos.direccionComuna || !datos.direccion) {
        return { valido: false, mensaje: 'Todos los campos obligatorios deben estar completos.' };
    }
    
    // Validar RUN
    if (!ValidadorRun.validar(datos.run)) {
        return { valido: false, mensaje: 'El RUN ingresado no es válido.' };
    }
    
    // Validar correo
    if (!validarCorreo(datos.correo)) {
        return { valido: false, mensaje: 'Solo se permiten correos con dominios @duoc.cl, @profesor.duoc.cl o @gmail.com' };
    }
    
    // Validar contraseña
    if (!validarContrasena(datos.contrasena)) {
        return { valido: false, mensaje: 'La contraseña debe tener entre 4 y 10 caracteres.' };
    }
    
    // Validar confirmación de contraseña
    if (datos.contrasena !== datos.confirmarContrasena) {
        return { valido: false, mensaje: 'Las contraseñas no coinciden.' };
    }
    
    // Validar teléfono si se proporciona
    if (datos.telefono && !validarTelefono(datos.telefono)) {
        return { valido: false, mensaje: 'El teléfono debe contener solo números y máximo 10 dígitos.' };
    }
    
    return { valido: true };
}

async function verificarUsuarioExistente(correo, run) {
    try {
        const todosLosUsuarios = await obtenerTodosLosUsuarios();
        return todosLosUsuarios.some(usuario => 
            usuario.correo.toLowerCase() === correo.toLowerCase() || 
            ValidadorRun.limpiarRun(usuario.run) === ValidadorRun.limpiarRun(run)
        );
    } catch (error) {
        console.error('Error al verificar usuario existente:', error);
        return false;
    }
}

function crearObjetoCliente(datos) {
    // Obtener el próximo ID
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    let proximoId = 11; // Empezar después de los usuarios del sistema (1-10)
    
    if (usuariosRegistrados.length > 0) {
        const maxId = Math.max(...usuariosRegistrados.map(u => u.id || 0));
        proximoId = Math.max(proximoId, maxId + 1);
    }
    
    return {
        id: proximoId,
        nombre: datos.nombre,
        apellido: datos.apellido,
        run: ValidadorRun.formatear(datos.run),
        fechaNacimiento: datos.fechaNacimiento || null,
        tipoUsuario: 'cliente', // Asignado automáticamente
        correo: datos.correo,
        telefono: datos.telefono || null,
        contrasena: datos.contrasena,
        direccionRegion: datos.direccionRegion,
        direccionComuna: datos.direccionComuna,
        direccion: datos.direccion,
        comentario: 'Cliente sin comentario', // Asignado automáticamente
        fechaRegistro: new Date().toISOString()
    };
}

function guardarNuevoCliente(cliente) {
    try {
        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        usuariosRegistrados.push(cliente);
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
        
        console.log('✅ Cliente guardado:', cliente);
        return true;
    } catch (error) {
        console.error('❌ Error al guardar cliente:', error);
        return false;
    }
}

function limpiarFormulario() {
    const form = document.getElementById('registroTiendaForm');
    if (form) {
        form.reset();
        // Resetear select de comunas
        const selectComuna = document.getElementById('direccionComuna');
        if (selectComuna) {
            selectComuna.innerHTML = '<option value="">Seleccionar comuna...</option>';
        }
    }
}