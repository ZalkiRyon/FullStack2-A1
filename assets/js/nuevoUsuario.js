// Validación y funcionalidad para el formulario de nuevo usuario
import { obtenerTodosLosUsuarios } from './modules/usuarios.js';

// Validación de RUT (transferido desde validaRut.js)
var Fn = {
    // Valida el rut con su cadena completa "XXXXXXXX-X"
    validaRut : function (rutCompleto) {
        if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
            return false;
        var tmp 	= rutCompleto.split('-');
        var digv	= tmp[1]; 
        var rut 	= tmp[0];
        if ( digv == 'K' ) digv = 'k' ;
        return (Fn.dv(rut) == digv );
    },
    dv : function(T){
        var M=0,S=1;
        for(;T;T=Math.floor(T/10))
            S=(S+T%10*(9-M++%6))%11;
        return S?S-1:'k';
    }
};

// Datos de regiones y comunas
const regionesComunas = {
    'region-metropolitana': {
        nombre: 'Región Metropolitana de Santiago',
        comunas: [
            { value: 'santiago', text: 'Santiago' },
            { value: 'las-condes', text: 'Las Condes' },
            { value: 'providencia', text: 'Providencia' },
            { value: 'vitacura', text: 'Vitacura' },
            { value: 'maipu', text: 'Maipú' },
            { value: 'nunoa', text: 'Ñuñoa' },
            { value: 'la-florida', text: 'La Florida' },
            { value: 'puente-alto', text: 'Puente Alto' },
            { value: 'la-reina', text: 'La Reina' },
            { value: 'macul', text: 'Macul' },
            { value: 'penalolen', text: 'Peñalolén' },
            { value: 'conchali', text: 'Conchalí' },
            { value: 'independencia', text: 'Independencia' },
            { value: 'recoleta', text: 'Recoleta' },
            { value: 'renca', text: 'Renca' },
            { value: 'quilicura', text: 'Quilicura' },
            { value: 'huechuraba', text: 'Huechuraba' },
            { value: 'cerro-navia', text: 'Cerro Navia' },
            { value: 'lo-prado', text: 'Lo Prado' },
            { value: 'quinta-normal', text: 'Quinta Normal' },
            { value: 'pudahuel', text: 'Pudahuel' },
            { value: 'cerrillos', text: 'Cerrillos' },
            { value: 'estacion-central', text: 'Estación Central' },
            { value: 'pedro-aguirre-cerda', text: 'Pedro Aguirre Cerda' },
            { value: 'san-miguel', text: 'San Miguel' },
            { value: 'san-joaquin', text: 'San Joaquín' },
            { value: 'san-ramon', text: 'San Ramón' },
            { value: 'la-cisterna', text: 'La Cisterna' },
            { value: 'lo-espejo', text: 'Lo Espejo' },
            { value: 'la-granja', text: 'La Granja' },
            { value: 'san-bernardo', text: 'San Bernardo' },
            { value: 'calera-de-tango', text: 'Calera de Tango' },
            { value: 'el-bosque', text: 'El Bosque' },
            { value: 'la-pintana', text: 'La Pintana' }
        ]
    },
    'region-valparaiso': {
        nombre: 'Región de Valparaíso',
        comunas: [
            { value: 'valparaiso', text: 'Valparaíso' },
            { value: 'vina-del-mar', text: 'Viña del Mar' },
            { value: 'quilpue', text: 'Quilpué' },
            { value: 'villa-alemana', text: 'Villa Alemana' },
            { value: 'san-antonio', text: 'San Antonio' },
            { value: 'quillota', text: 'Quillota' },
            { value: 'los-andes', text: 'Los Andes' }
        ]
    },
    'region-biobio': {
        nombre: 'Región del Biobío',
        comunas: [
            { value: 'concepcion', text: 'Concepción' },
            { value: 'talcahuano', text: 'Talcahuano' },
            { value: 'chillan', text: 'Chillán' },
            { value: 'los-angeles', text: 'Los Ángeles' },
            { value: 'coronel', text: 'Coronel' },
            { value: 'san-pedro-de-la-paz', text: 'San Pedro de la Paz' }
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

// Cargar regiones al inicializar
function cargarRegiones() {
    const selectRegion = document.getElementById('direccionRegion');
    const selectComuna = document.getElementById('direccionComuna');
    
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
    selectComuna.innerHTML = '<option value="">Seleccionar comuna...</option>';
    selectComuna.disabled = true;
}

// Cargar comunas según la región seleccionada
function cargarComunas(regionKey) {
    const selectComuna = document.getElementById('direccionComuna');
    
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

// Event listener para cuando cambia la región
document.addEventListener('DOMContentLoaded', function() {
    // Cargar regiones al inicializar la página
    cargarRegiones();
    
    const regionSelect = document.getElementById('direccionRegion');
    const comunaSelect = document.getElementById('direccionComuna');
    const form = document.getElementById('nuevoUsuarioForm');
    
    // Event listener para cambio de región
    regionSelect.addEventListener('change', function() {
        cargarComunas(this.value);
    });
    
    // Formateo de teléfono
    const telefonoInput = document.getElementById('telefono');
    
    function formatearTelefono(input) {
        // Solo permitir números
        let value = input.value.replace(/\D/g, '');
        
        // Limitar a máximo 10 dígitos
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        
        input.value = value;
        
        // Validar teléfono en tiempo real
        validarTelefono();
    }
    
    telefonoInput.addEventListener('input', function() {
        formatearTelefono(this);
    });
    
    // Formateo de RUN
    const runInput = document.getElementById('run');
    
    function formatearRun(input) {
        let value = input.value.replace(/[^0-9kK]/g, '');
        if (value.length > 1) {
            // Extraer cuerpo y dígito verificador
            const cuerpo = value.slice(0, -1);
            const dv = value.slice(-1);
            
            // Formatear cuerpo con puntos
            let cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            
            // Construir RUN completo
            value = cuerpoFormateado + '-' + dv;
        }
        input.value = value;
        
        // Validar RUN en tiempo real
        validarRun();
    }
    
    runInput.addEventListener('input', function() {
        formatearRun(this);
    });
    
    // Validaciones de formulario
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
    
    // Validación de RUN
    function validarRun() {
        const run = runInput.value.trim();
        
        if (!run) {
            runInput.setCustomValidity('El RUN es obligatorio');
            return false;
        } else if (!Fn.validaRut(run)) {
            runInput.setCustomValidity('El RUN ingresado no es válido');
            return false;
        } else {
            // Verificar si el RUN ya está registrado usando el módulo
            const todosLosUsuarios = obtenerTodosLosUsuarios();
            const runExiste = todosLosUsuarios.some(user => user.run === run);
            
            if (runExiste) {
                runInput.setCustomValidity('Este RUN ya está registrado');
                return false;
            } else {
                runInput.setCustomValidity('');
                return true;
            }
        }
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
    
    // Validación de correo
    function validarCorreo() {
        const correo = correoInput.value.trim();
        const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        
        if (!correo) {
            correoInput.setCustomValidity('El correo es obligatorio');
            return false;
        } else if (correo.length > 100) {
            correoInput.setCustomValidity('El correo no puede tener más de 100 caracteres');
            return false;
        } else if (!dominiosPermitidos.some(dominio => correo.endsWith(dominio))) {
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
    
    // Validación de contraseña
    function validarContrasena() {
        const contrasena = contrasenaInput.value;
        
        if (!contrasena) {
            contrasenaInput.setCustomValidity('La contraseña es obligatoria');
            return false;
        } else if (contrasena.length < 4 || contrasena.length > 10) {
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
    
    // Validación de teléfono opcional
    function validarTelefono() {
        const telefono = telefonoInput.value.trim();
        
        // Si no hay valor, es válido (es opcional)
        if (!telefono) {
            telefonoInput.setCustomValidity('');
            return true;
        }
        
        // Si hay valor, validar que sea solo números y máximo 10 dígitos
        if (!/^\d+$/.test(telefono)) {
            telefonoInput.setCustomValidity('El teléfono debe contener solo números');
            return false;
        } else if (telefono.length > 10) {
            telefonoInput.setCustomValidity('El teléfono no puede tener más de 10 dígitos');
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
    
    correoInput.addEventListener('input', validarCorreo);
    correoInput.addEventListener('blur', validarCorreo);
    
    direccionInput.addEventListener('input', validarDireccion);
    direccionInput.addEventListener('blur', validarDireccion);
    
    comentarioInput.addEventListener('input', validarComentario);
    comentarioInput.addEventListener('blur', validarComentario);
    
    contrasenaInput.addEventListener('input', function() {
        validarContrasena();
        if (confirmarContrasenaInput.value) {
            validarConfirmarContrasena();
        }
    });
    
    confirmarContrasenaInput.addEventListener('input', validarConfirmarContrasena);
    
    telefonoInput.addEventListener('blur', validarTelefono);
    
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
        const correoValido = validarCorreo();
        const contrasenaValida = validarContrasena();
        const confirmarContrasenaValida = validarConfirmarContrasena();
        const telefonoValido = validarTelefono();
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
            
            // Limpiar teléfono de caracteres no numéricos para el envío (si existe)
            if (userData.telefono) {
                userData.telefono = userData.telefono.replace(/\D/g, '');
            }
            
            // Limpiar RUN para almacenamiento (mantener formato con guión)
            userData.run = userData.run.trim();
            
            // Agregar ID único y fecha de registro
            userData.id = Date.now(); // ID único basado en timestamp
            userData.fechaRegistro = new Date().toISOString();
            
            // El role se asigna según el tipo de usuario seleccionado
            userData.role = userData.tipoUsuario;
            
            console.log('Datos del usuario validados:', userData);
            
            // Guardar en localStorage
            guardarUsuarioEnLocalStorage(userData);
            
            // Simular proceso de registro
            setTimeout(() => {
                alert('Usuario registrado exitosamente');
                
                // Restablecer formulario
                form.reset();
                cargarRegiones(); // Restablecer dropdowns
                
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
