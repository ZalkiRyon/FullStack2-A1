// Validación y funcionalidad para el formulario de nuevo usuario

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
    
    // Formateo de teléfonos
    const telefonoInput = document.getElementById('telefono');
    const telefonoOpcionalInput = document.getElementById('telefonoOpcional');
    
    function formatearTelefono(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 8) {
            value = value.substring(0, 9); // Permitir hasta 9 dígitos
            if (value.length === 8) {
                value = value.replace(/(\d{4})(\d{4})/, '$1-$2');
            } else if (value.length === 9) {
                value = value.replace(/(\d{1})(\d{4})(\d{4})/, '$1-$2-$3');
            }
        }
        input.value = value;
        
        // Validar teléfono en tiempo real si es el campo obligatorio
        if (input === telefonoInput) {
            validarTelefono();
        }
    }
    
    telefonoInput.addEventListener('input', function() {
        formatearTelefono(this);
    });
    
    telefonoOpcionalInput.addEventListener('input', function() {
        formatearTelefono(this);
    });
    
    // Validaciones de formulario
    const nombreCompletoInput = document.getElementById('nombreCompleto');
    const correoInput = document.getElementById('correo');
    const contrasenaInput = document.getElementById('contrasena');
    const confirmarContrasenaInput = document.getElementById('confirmarContrasena');
    
    // Validación de nombre completo
    function validarNombreCompleto() {
        const nombre = nombreCompletoInput.value.trim();
        
        if (!nombre) {
            nombreCompletoInput.setCustomValidity('El nombre completo es obligatorio');
            return false;
        } else if (nombre.length > 100) {
            nombreCompletoInput.setCustomValidity('El nombre no puede tener más de 100 caracteres');
            return false;
        } else {
            nombreCompletoInput.setCustomValidity('');
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
            // Verificar si el correo ya está registrado
            const usuarios = obtenerUsuariosDeLocalStorage();
            const correoExiste = usuarios.some(user => user.correo === correo);
            
            if (correoExiste) {
                correoInput.setCustomValidity('Este correo electrónico ya está registrado');
                return false;
            } else {
                correoInput.setCustomValidity('');
                return true;
            }
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
    
    // Validación de teléfono obligatorio
    function validarTelefono() {
        const telefono = telefonoInput.value.trim();
        
        if (!telefono) {
            telefonoInput.setCustomValidity('El teléfono es obligatorio');
            return false;
        } else if (telefono.replace(/\D/g, '').length < 8) {
            telefonoInput.setCustomValidity('El teléfono debe tener al menos 8 dígitos');
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
    nombreCompletoInput.addEventListener('input', validarNombreCompleto);
    nombreCompletoInput.addEventListener('blur', validarNombreCompleto);
    
    correoInput.addEventListener('input', validarCorreo);
    correoInput.addEventListener('blur', validarCorreo);
    
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
        const nombreValido = validarNombreCompleto();
        const correoValido = validarCorreo();
        const contrasenaValida = validarContrasena();
        const confirmarContrasenaValida = validarConfirmarContrasena();
        const telefonoValido = validarTelefono();
        const regionComunaValida = validarRegionComuna();
        
        // Verificar si todas las validaciones son exitosas
        const formularioValido = nombreValido && correoValido && contrasenaValida && 
                                confirmarContrasenaValida && telefonoValido && regionComunaValida;
        
        if (formularioValido && form.checkValidity()) {
            // Simular loading
            const submitButton = document.querySelector('.btn-registrar');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'REGISTRANDO...';
            submitButton.disabled = true;
            
            // Recopilar datos del formulario
            const formData = new FormData(form);
            const userData = Object.fromEntries(formData.entries());
            
            // Limpiar teléfonos de caracteres no numéricos para el envío
            userData.telefono = userData.telefono.replace(/\D/g, '');
            if (userData.telefonoOpcional) {
                userData.telefonoOpcional = userData.telefonoOpcional.replace(/\D/g, '');
            }
            
            // Agregar ID único y fecha de registro
            userData.id = Date.now(); // ID único basado en timestamp
            userData.fechaRegistro = new Date().toISOString();
            userData.role = 'cliente'; // Por defecto es cliente para la tienda
            
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
        const usuarioExistente = usuariosExistentes.find(user => user.correo === userData.correo);
        
        if (usuarioExistente) {
            alert('Ya existe un usuario registrado con este correo electrónico.');
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
    validarCredenciales: validarCredencialesUsuario,
    listar: listarUsuariosRegistrados,
    limpiar: limpiarUsuariosRegistrados
};
