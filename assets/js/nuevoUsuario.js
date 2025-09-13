// Validación y funcionalidad para el formulario de nuevo usuario
import { obtenerTodosLosUsuarios } from './modules/usuarios.js';
import { 
    ValidadorRun, 
    validarCorreo, 
    validarContrasena, 
    cargarRegiones, 
    cargarComunas, 
    configurarEventosFormulario 
} from './modules/validaciones.js';

// Event listener para cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar regiones usando el módulo compartido al inicializar la página
    const regionSelect = document.getElementById('direccionRegion');
    cargarRegiones(regionSelect);
    
    const comunaSelect = document.getElementById('direccionComuna');
    const form = document.getElementById('nuevoUsuarioForm');
    
    // Configurar eventos estándar del formulario usando el módulo compartido
    configurarEventosFormulario({
        regionSelectId: 'direccionRegion',
        comunaSelectId: 'direccionComuna',
        runInputId: 'run',
        telefonoInputId: 'telefono'
    });
    
    // Obtener elementos del formulario para validaciones específicas
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const correoInput = document.getElementById('correo');
    const contrasenaInput = document.getElementById('contrasena');
    const confirmarContrasenaInput = document.getElementById('confirmarContrasena');
    const direccionInput = document.getElementById('direccion');
    const comentarioInput = document.getElementById('comentario');
    const tipoUsuarioSelect = document.getElementById('tipoUsuario');
    
    // Validación de nombre
    function validarNombre() {
        const nombre = nombreInput.value.trim();
        
        if (!nombre) {
            nombreInput.setCustomValidity('El nombre es obligatorio');
            return false;
        } else if (nombre.length > 50) {
            nombreInput.setCustomValidity('El nombre no puede tener más de 50 caracteres');
            return false;
        } else {
            nombreInput.setCustomValidity('');
            return true;
        }
    }
    
    // Validación de apellido
    function validarApellido() {
        const apellido = apellidoInput.value.trim();
        
        if (!apellido) {
            apellidoInput.setCustomValidity('El apellido es obligatorio');
            return false;
        } else if (apellido.length > 100) {
            apellidoInput.setCustomValidity('El apellido no puede tener más de 100 caracteres');
            return false;
        } else {
            apellidoInput.setCustomValidity('');
            return true;
        }
    }
    
    // Validación de RUN mejorada
    function validarRun() {
        const run = runInput.value.trim();
        
        if (!run) {
            runInput.setCustomValidity('El RUN es obligatorio');
            return false;
        }
        
        // Usar el nuevo validador
        if (!ValidadorRun.validar(run)) {
            runInput.setCustomValidity('El RUN ingresado no es válido. Formato: 12.345.678-9');
            return false;
        }
        
        // Verificar si el RUN ya está registrado usando el módulo
        const todosLosUsuarios = obtenerTodosLosUsuarios();
        const runLimpio = ValidadorRun.limpiarRun(run);
        const runExiste = todosLosUsuarios.some(user => {
            if (user.run) {
                const runUsuarioLimpio = ValidadorRun.limpiarRun(user.run);
                return runUsuarioLimpio === runLimpio;
            }
            return false;
        });
        
        if (runExiste) {
            runInput.setCustomValidity('Este RUN ya está registrado');
            return false;
        }
        
        runInput.setCustomValidity('');
        return true;
    }
    
    // Validación de tipo de usuario
    function validarTipoUsuario() {
        const tipoUsuario = tipoUsuarioSelect.value;
        
        if (!tipoUsuario) {
            tipoUsuarioSelect.setCustomValidity('Debe seleccionar un tipo de usuario');
            return false;
        } else {
            tipoUsuarioSelect.setCustomValidity('');
            return true;
        }
    }
    
    // Validación de correo usando módulo compartido
    function validarCorreoFormulario() {
        const correo = correoInput.value.trim();
        
        if (!correo) {
            correoInput.setCustomValidity('El correo es obligatorio');
            return false;
        } else if (correo.length > 100) {
            correoInput.setCustomValidity('El correo no puede tener más de 100 caracteres');
            return false;
        } else if (!validarCorreo(correo)) {
            correoInput.setCustomValidity('Solo se permiten correos con @duoc.cl, @profesor.duoc.cl o @gmail.com');
            return false;
        } else {
            // Verificar si el correo ya está registrado usando el módulo
            const todosLosUsuarios = obtenerTodosLosUsuarios();
            const correoExiste = todosLosUsuarios.some(user => user.email === correo);
            
            if (correoExiste) {
                correoInput.setCustomValidity('Este correo electrónico ya está registrado');
                return false;
            } else {
                correoInput.setCustomValidity('');
                return true;
            }
        }
    }
    
    // Validación de dirección
    function validarDireccion() {
        const direccion = direccionInput.value.trim();
        
        if (!direccion) {
            direccionInput.setCustomValidity('La dirección es obligatoria');
            return false;
        } else if (direccion.length > 300) {
            direccionInput.setCustomValidity('La dirección no puede tener más de 300 caracteres');
            return false;
        } else {
            direccionInput.setCustomValidity('');
            return true;
        }
    }
    
    // Validación de comentario
    function validarComentario() {
        const comentario = comentarioInput.value.trim();
        
        if (!comentario) {
            comentarioInput.setCustomValidity('El comentario es obligatorio');
            return false;
        } else if (comentario.length > 500) {
            comentarioInput.setCustomValidity('El comentario no puede tener más de 500 caracteres');
            return false;
        } else {
            comentarioInput.setCustomValidity('');
            return true;
        }
    }
    
    // Validación de contraseña usando módulo compartido
    function validarContrasenaFormulario() {
        const contrasena = contrasenaInput.value;
        
        if (!contrasena) {
            contrasenaInput.setCustomValidity('La contraseña es obligatoria');
            return false;
        } else if (!validarContrasena(contrasena)) {
            contrasenaInput.setCustomValidity('La contraseña debe tener entre 4 y 10 caracteres');
            return false;
        } else {
            contrasenaInput.setCustomValidity('');
            return true;
        }
    }
    
    // Validación de confirmar contraseña
    function validarConfirmarContrasena() {
        const contrasena = contrasenaInput.value;
        const confirmarContrasena = confirmarContrasenaInput.value;
        
        if (!confirmarContrasena) {
            confirmarContrasenaInput.setCustomValidity('Debe confirmar la contraseña');
            return false;
        } else if (contrasena !== confirmarContrasena) {
            confirmarContrasenaInput.setCustomValidity('Las contraseñas no coinciden');
            return false;
        } else {
            confirmarContrasenaInput.setCustomValidity('');
            return true;
        }
    }
    
    // Validación de teléfono usando módulo compartido  
    function validarTelefonoFormulario() {
        const telefono = telefonoInput.value.trim();
        
        // Si no hay valor, es válido (es opcional)
        if (!telefono) {
            telefonoInput.setCustomValidity('');
            return true;
        }
        
        // Usar validación del módulo compartido
        if (!validarTelefono(telefono)) {
            telefonoInput.setCustomValidity('El teléfono debe contener solo números y máximo 10 dígitos');
            return false;
        } else {
            telefonoInput.setCustomValidity('');
            return true;
        }
    }
    
    // Validación de región y comuna
    function validarRegionComuna() {
        const region = regionSelect.value;
        const comuna = comunaSelect.value;
        let esValido = true;
        
        if (!region) {
            regionSelect.setCustomValidity('Debe seleccionar una región');
            esValido = false;
        } else {
            regionSelect.setCustomValidity('');
        }
        
        if (!comuna) {
            comunaSelect.setCustomValidity('Debe seleccionar una comuna');
            esValido = false;
        } else {
            comunaSelect.setCustomValidity('');
        }
        
        return esValido;
    }
    
    // Event listeners para validaciones en tiempo real
    nombreInput.addEventListener('input', validarNombre);
    nombreInput.addEventListener('blur', validarNombre);
    
    apellidoInput.addEventListener('input', validarApellido);
    apellidoInput.addEventListener('blur', validarApellido);
    
    runInput.addEventListener('blur', validarRun);
    
    tipoUsuarioSelect.addEventListener('change', validarTipoUsuario);
    
    correoInput.addEventListener('input', validarCorreoFormulario);
    correoInput.addEventListener('blur', validarCorreoFormulario);
    
    direccionInput.addEventListener('input', validarDireccion);
    direccionInput.addEventListener('blur', validarDireccion);
    
    comentarioInput.addEventListener('input', validarComentario);
    comentarioInput.addEventListener('blur', validarComentario);
    
    contrasenaInput.addEventListener('input', function() {
        validarContrasenaFormulario();
        if (confirmarContrasenaInput.value) {
            validarConfirmarContrasena();
        }
    });
    
    confirmarContrasenaInput.addEventListener('input', validarConfirmarContrasena);
    
    telefonoInput.addEventListener('blur', validarTelefonoFormulario);
    
    regionSelect.addEventListener('change', validarRegionComuna);
    comunaSelect.addEventListener('change', validarRegionComuna);
    
    // Manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ejecutar todas las validaciones
        const nombreValido = validarNombre();
        const apellidoValido = validarApellido();
        const runValido = validarRun();
        const tipoUsuarioValido = validarTipoUsuario();
        const correoValido = validarCorreoFormulario();
        const contrasenaValida = validarContrasenaFormulario();
        const confirmarContrasenaValida = validarConfirmarContrasena();
        const telefonoValido = validarTelefonoFormulario();
        const direccionValida = validarDireccion();
        const comentarioValido = validarComentario();
        const regionComunaValida = validarRegionComuna();
        
        // Verificar si todas las validaciones son exitosas
        const formularioValido = nombreValido && apellidoValido && runValido && 
                                tipoUsuarioValido && correoValido && contrasenaValida && 
                                confirmarContrasenaValida && telefonoValido && 
                                direccionValida && comentarioValido && regionComunaValida;
        
        if (formularioValido && form.checkValidity()) {
            // Simular loading
            const submitButton = document.querySelector('.btn-registrar');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'REGISTRANDO...';
            submitButton.disabled = true;
            
            // Recopilar datos del formulario
            const formData = new FormData(form);
            const userData = Object.fromEntries(formData.entries());
            
            console.log('📝 Datos del formulario capturados:', userData);
            
            // Limpiar teléfono de caracteres no numéricos para el envío (si existe)
            if (userData.telefono) {
                userData.telefono = userData.telefono.replace(/\D/g, '');
            }
            
            // Limpiar RUN para almacenamiento (formato estándar con puntos y guión)
            userData.run = ValidadorRun.formatear(userData.run.trim());
            
            // Agregar ID único y fecha de registro
            userData.id = Date.now(); // ID único basado en timestamp
            userData.fechaRegistro = new Date().toISOString();
            
            // El role se asigna según el tipo de usuario seleccionado
            userData.role = userData.tipoUsuario;
            
            console.log('💾 Datos finales a guardar:', userData);
            
            console.log('Datos del usuario validados:', userData);
            
            // Guardar en localStorage
            guardarUsuarioEnLocalStorage(userData);
            
            // Simular proceso de registro
            setTimeout(() => {
                alert('Usuario registrado exitosamente');
                
                // Restablecer formulario
                form.reset();
                cargarRegiones(document.getElementById('direccionRegion')); // Restablecer dropdowns
                
                // Restablecer botón
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Opcional: redireccionar a la página de órdenes
                // window.location.href = 'ordenes.html';
            }, 2000);
        } else {
            // Mostrar mensaje de error si hay validaciones fallidas
            alert('Por favor, corrija los errores en el formulario antes de continuar.');
            
            // Enfocar el primer campo con error
            const camposConError = form.querySelectorAll(':invalid');
            if (camposConError.length > 0) {
                camposConError[0].focus();
            }
        }
    });
});

// Funciones para manejar localStorage
function guardarUsuarioEnLocalStorage(userData) {
    try {
        // Obtener usuarios existentes o crear array vacío
        const usuariosExistentes = obtenerUsuariosDeLocalStorage();
        
        // Verificar si ya existe un usuario con el mismo correo
        const usuarioExistentePorCorreo = usuariosExistentes.find(user => user.correo === userData.correo);
        
        if (usuarioExistentePorCorreo) {
            alert('Ya existe un usuario registrado con este correo electrónico.');
            return false;
        }
        
        // Verificar si ya existe un usuario con el mismo RUN
        const usuarioExistentePorRun = usuariosExistentes.find(user => user.run === userData.run);
        
        if (usuarioExistentePorRun) {
            alert('Ya existe un usuario registrado con este RUN.');
            return false;
        }
        
        // Agregar nuevo usuario
        usuariosExistentes.push(userData);
        
        // Guardar en localStorage
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosExistentes));
        
        console.log('Usuario guardado en localStorage:', userData);
        console.log('Total usuarios registrados:', usuariosExistentes.length);
        
        return true;
    } catch (error) {
        console.error('Error al guardar usuario en localStorage:', error);
        alert('Error al guardar los datos del usuario');
        return false;
    }
}

function obtenerUsuariosDeLocalStorage() {
    try {
        const usuarios = localStorage.getItem('usuariosRegistrados');
        return usuarios ? JSON.parse(usuarios) : [];
    } catch (error) {
        console.error('Error al obtener usuarios de localStorage:', error);
        return [];
    }
}

function buscarUsuarioPorCorreo(correo) {
    const usuarios = obtenerUsuariosDeLocalStorage();
    return usuarios.find(user => user.correo === correo);
}

function buscarUsuarioPorRun(run) {
    const usuarios = obtenerUsuariosDeLocalStorage();
    return usuarios.find(user => user.run === run);
}

function validarCredencialesUsuario(correo, contrasena) {
    const usuario = buscarUsuarioPorCorreo(correo);
    if (usuario && usuario.contrasena === contrasena) {
        return {
            valido: true,
            usuario: usuario
        };
    }
    return {
        valido: false,
        usuario: null
    };
}

// Función para listar todos los usuarios (útil para debugging)
function listarUsuariosRegistrados() {
    const usuarios = obtenerUsuariosDeLocalStorage();
    console.log('Usuarios registrados:', usuarios);
    return usuarios;
}

// Función para limpiar todos los usuarios (útil para testing)
function limpiarUsuariosRegistrados() {
    localStorage.removeItem('usuariosRegistrados');
    console.log('Usuarios registrados eliminados de localStorage');
}

// Exponer funciones globalmente para uso en otras páginas
window.usuariosLocalStorage = {
    guardar: guardarUsuarioEnLocalStorage,
    obtener: obtenerUsuariosDeLocalStorage,
    buscarPorCorreo: buscarUsuarioPorCorreo,
    buscarPorRun: buscarUsuarioPorRun,
    validarCredenciales: validarCredencialesUsuario,
    listar: listarUsuariosRegistrados,
    limpiar: limpiarUsuariosRegistrados
};

// Funciones de debugging para RUN
window.debugRun = {
    validar: function(run) {
        console.log(`🔍 Validando RUN: ${run}`);
        const resultado = ValidadorRun.validar(run);
        console.log(`✅ Resultado: ${resultado ? 'VÁLIDO' : 'INVÁLIDO'}`);
        if (resultado) {
            console.log(`📝 Formato: ${ValidadorRun.formatear(run)}`);
        }
        return resultado;
    },
    
    formatear: function(run) {
        const formateado = ValidadorRun.formatear(run);
        console.log(`📝 ${run} → ${formateado}`);
        return formateado;
    },
    
    probarEjemplos: function() {
        const ejemplos = [
            '12345678-9',
            '12.345.678-9',
            '12345678-K',
            '1234567-8',
            '11111111-1',
            '22222222-2',
            '12345678-0'
        ];
        
        console.log('🧪 Probando RUNs de ejemplo:');
        ejemplos.forEach(run => {
            const valido = ValidadorRun.validar(run);
            console.log(`${valido ? '✅' : '❌'} ${run} → ${valido ? 'VÁLIDO' : 'INVÁLIDO'}`);
        });
    }
};

console.log('🔧 Sistema de validación de RUN mejorado cargado.');
console.log('💡 Usa debugRun.validar("tu-run") para probar un RUN específico.');
console.log('💡 Usa debugRun.probarEjemplos() para ver ejemplos de validación.');
