// Registro de clientes desde la tienda
import { obtenerTodosLosUsuarios } from './modules/usuarios.js';

// Validación de RUN chileno
var ValidadorRun = {
    limpiarRun: function(run) {
        return run.toString().replace(/[.\s-]/g, '').toUpperCase();
    },
    
    formatoValido: function(run) {
        const runLimpio = this.limpiarRun(run);
        return /^[0-9]{7,8}[0-9K]$/.test(runLimpio);
    },
    
    calcularDV: function(numero) {
        let suma = 0;
        let multiplicador = 2;
        
        for (let i = numero.length - 1; i >= 0; i--) {
            suma += parseInt(numero[i]) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }
        
        const resto = suma % 11;
        const dv = 11 - resto;
        
        if (dv === 11) return '0';
        if (dv === 10) return 'K';
        return dv.toString();
    },
    
    validar: function(run) {
        if (!run || run.length === 0) return false;
        
        const runLimpio = this.limpiarRun(run);
        
        if (!this.formatoValido(runLimpio)) return false;
        
        const numero = runLimpio.slice(0, -1);
        const dvIngresado = runLimpio.slice(-1);
        const dvCalculado = this.calcularDV(numero);
        
        return dvIngresado === dvCalculado;
    },
    
    formatear: function(run) {
        const runLimpio = this.limpiarRun(run);
        if (runLimpio.length < 8) return run;
        
        const numero = runLimpio.slice(0, -1);
        const dv = runLimpio.slice(-1);
        const numeroFormateado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        return `${numeroFormateado}-${dv}`;
    }
};

// Validación de correo específica
function validarCorreo(correo) {
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return dominiosPermitidos.some(dominio => correo.endsWith(dominio));
}

// Validación de contraseña
function validarContrasena(contrasena) {
    return contrasena.length >= 4 && contrasena.length <= 10;
}

// Validación de teléfono
function validarTelefono(telefono) {
    return /^\d{0,10}$/.test(telefono);
}

// Datos de regiones y comunas de Chile
const regionesYComunas = {
    "I": {
        "nombre": "Región de Tarapacá",
        "comunas": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
    },
    "II": {
        "nombre": "Región de Antofagasta", 
        "comunas": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
    },
    "III": {
        "nombre": "Región de Atacama",
        "comunas": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
    },
    "IV": {
        "nombre": "Región de Coquimbo",
        "comunas": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
    },
    "V": {
        "nombre": "Región de Valparaíso",
        "comunas": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"]
    },
    "RM": {
        "nombre": "Región Metropolitana de Santiago",
        "comunas": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "Santiago", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
    },
    "VI": {
        "nombre": "Región del Libertador General Bernardo O'Higgins",
        "comunas": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"]
    },
    "VII": {
        "nombre": "Región del Maule",
        "comunas": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
    },
    "VIII": {
        "nombre": "Región del Biobío",
        "comunas": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío", "Chillán", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "Chillán Viejo", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"]
    },
    "IX": {
        "nombre": "Región de la Araucanía",
        "comunas": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
    },
    "XIV": {
        "nombre": "Región de Los Ríos",
        "comunas": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
    },
    "X": {
        "nombre": "Región de Los Lagos",
        "comunas": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"]
    },
    "XI": {
        "nombre": "Región Aysén del General Carlos Ibáñez del Campo",
        "comunas": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"]
    },
    "XII": {
        "nombre": "Región de Magallanes y de la Antártica Chilena",
        "comunas": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
    },
    "XV": {
        "nombre": "Región de Arica y Parinacota",
        "comunas": ["Arica", "Camarones", "Putre", "General Lagos"]
    }
};

// Inicialización del DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Registro de tienda cargado');
    
    // Cargar regiones en el select
    cargarRegiones();
    
    // Configurar eventos
    configurarEventos();
    
    // Configurar validación del formulario
    configurarValidacionFormulario();
});

function cargarRegiones() {
    const selectRegion = document.getElementById('direccionRegion');
    if (!selectRegion) return;
    
    // Limpiar opciones existentes (excepto la primera)
    selectRegion.innerHTML = '<option value="">Seleccionar región...</option>';
    
    // Agregar regiones
    Object.keys(regionesYComunas).forEach(codigo => {
        const option = document.createElement('option');
        option.value = codigo;
        option.textContent = regionesYComunas[codigo].nombre;
        selectRegion.appendChild(option);
    });
}

function cargarComunas(codigoRegion) {
    const selectComuna = document.getElementById('direccionComuna');
    if (!selectComuna) return;
    
    // Limpiar opciones
    selectComuna.innerHTML = '<option value="">Seleccionar comuna...</option>';
    
    if (!codigoRegion || !regionesYComunas[codigoRegion]) return;
    
    // Agregar comunas de la región seleccionada
    regionesYComunas[codigoRegion].comunas.forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna;
        option.textContent = comuna;
        selectComuna.appendChild(option);
    });
}

function configurarEventos() {
    // Evento cambio de región
    const selectRegion = document.getElementById('direccionRegion');
    if (selectRegion) {
        selectRegion.addEventListener('change', function() {
            cargarComunas(this.value);
        });
    }
    
    // Formateo automático del RUN
    const inputRun = document.getElementById('run');
    if (inputRun) {
        inputRun.addEventListener('input', function() {
            if (this.value) {
                this.value = ValidadorRun.formatear(this.value);
            }
        });
    }
    
    // Validación de teléfono
    const inputTelefono = document.getElementById('telefono');
    if (inputTelefono) {
        inputTelefono.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 10);
        });
    }
}

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