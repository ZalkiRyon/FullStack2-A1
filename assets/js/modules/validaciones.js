// Módulo de validaciones compartidas para todo el sistema
// Este módulo contiene validaciones comunes que se usan tanto en admin como en tienda

// Validación de RUN chileno
export const ValidadorRun = {
    // Limpia el RUN eliminando puntos, espacios y convirtiendo a mayúsculas
    limpiarRun: function(run) {
        return run.toString().replace(/[.\s-]/g, '').toUpperCase();
    },
    
    // Valida si el RUN tiene formato correcto (solo números y K al final)
    formatoValido: function(run) {
        const runLimpio = this.limpiarRun(run);
        return /^[0-9]{7,8}[0-9K]$/.test(runLimpio);
    },
    
    // Calcula el dígito verificador
    calcularDV: function(numero) {
        let suma = 0;
        let multiplicador = 2;
        
        // Recorrer el número de derecha a izquierda
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
    
    // Valida el RUN completo
    validar: function(run) {
        if (!run || run.length === 0) return false;
        
        const runLimpio = this.limpiarRun(run);
        
        // Verificar formato básico
        if (!this.formatoValido(runLimpio)) return false;
        
        // Separar número y dígito verificador
        const numero = runLimpio.slice(0, -1);
        const dvIngresado = runLimpio.slice(-1);
        
        // Calcular dígito verificador esperado
        const dvCalculado = this.calcularDV(numero);
        
        return dvIngresado === dvCalculado;
    },
    
    // Formatea el RUN con puntos y guión
    formatear: function(run) {
        const runLimpio = this.limpiarRun(run);
        if (runLimpio.length < 8) return run;
        
        const numero = runLimpio.slice(0, -1);
        const dv = runLimpio.slice(-1);
        
        // Agregar puntos cada 3 dígitos desde la derecha
        const numeroFormateado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        return `${numeroFormateado}-${dv}`;
    }
};

// Validación de correo específica
export function validarCorreo(correo) {
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return dominiosPermitidos.some(dominio => correo.endsWith(dominio));
}

// Validación de contraseña
export function validarContrasena(contrasena) {
    return contrasena.length >= 4 && contrasena.length <= 10;
}

// Validación de teléfono
export function validarTelefono(telefono) {
    return /^\d{0,10}$/.test(telefono);
}

// Datos completos de regiones y comunas de Chile
export const regionesYComunas = {
    "XV": {
        "nombre": "Región de Arica y Parinacota",
        "comunas": ["Arica", "Camarones", "Putre", "General Lagos"]
    },
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
    "XVI": {
        "nombre": "Región de Ñuble",
        "comunas": ["Chillán", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "Chillán Viejo", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"]
    },
    "VIII": {
        "nombre": "Región del Biobío",
        "comunas": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"]
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
    }
};

// Utilidades para manejar regiones y comunas
export function cargarRegiones(selectElement) {
    if (!selectElement) return;
    
    // Limpiar opciones existentes (excepto la primera)
    selectElement.innerHTML = '<option value="">Seleccionar región...</option>';
    
    // Agregar regiones ordenadas
    Object.keys(regionesYComunas).sort().forEach(codigo => {
        const option = document.createElement('option');
        option.value = codigo;
        option.textContent = regionesYComunas[codigo].nombre;
        selectElement.appendChild(option);
    });
}

export function cargarComunas(selectElement, codigoRegion) {
    if (!selectElement) return;
    
    // Limpiar opciones
    selectElement.innerHTML = '<option value="">Seleccionar comuna...</option>';
    
    if (!codigoRegion || !regionesYComunas[codigoRegion]) return;
    
    // Agregar comunas de la región seleccionada ordenadas alfabéticamente
    regionesYComunas[codigoRegion].comunas.sort().forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna;
        option.textContent = comuna;
        selectElement.appendChild(option);
    });
}

// Configurar eventos estándar para formularios
export function configurarEventosFormulario(config = {}) {
    const {
        regionSelectId = 'direccionRegion',
        comunaSelectId = 'direccionComuna',
        runInputId = 'run',
        telefonoInputId = 'telefono'
    } = config;
    
    // Evento cambio de región
    const selectRegion = document.getElementById(regionSelectId);
    const selectComuna = document.getElementById(comunaSelectId);
    
    if (selectRegion && selectComuna) {
        selectRegion.addEventListener('change', function() {
            cargarComunas(selectComuna, this.value);
        });
    }
    
    // Formateo automático del RUN
    const inputRun = document.getElementById(runInputId);
    if (inputRun) {
        inputRun.addEventListener('input', function() {
            if (this.value) {
                this.value = ValidadorRun.formatear(this.value);
            }
        });
    }
    
    // Validación de teléfono
    const inputTelefono = document.getElementById(telefonoInputId);
    if (inputTelefono) {
        inputTelefono.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 10);
        });
    }
}