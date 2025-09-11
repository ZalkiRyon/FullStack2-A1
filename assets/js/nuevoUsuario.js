// Script para manejar el formulario de nuevo usuario

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('nuevoUsuarioForm');
    const btnRegistrar = document.querySelector('.btn-registrar');
    
    // Configurar eventos del formulario
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Validación en tiempo real para las contraseñas
        const contrasena = document.getElementById('contrasena');
        const confirmarContrasena = document.getElementById('confirmarContrasena');
        
        if (contrasena && confirmarContrasena) {
            confirmarContrasena.addEventListener('input', validarContrasenas);
            contrasena.addEventListener('input', validarContrasenas);
        }
        
        // Configurar cascada de regiones y comunas
        const regionSelect = document.getElementById('direccionRegion');
        if (regionSelect) {
            regionSelect.addEventListener('change', actualizarComunas);
        }
    }
});

// Manejar envío del formulario
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validarFormulario()) {
        return;
    }
    
    // Mostrar loading
    const btnRegistrar = document.querySelector('.btn-registrar');
    btnRegistrar.classList.add('loading');
    btnRegistrar.disabled = true;
    
    // Simular envío del formulario
    setTimeout(() => {
        alert('Usuario registrado exitosamente!');
        
        // Remover loading
        btnRegistrar.classList.remove('loading');
        btnRegistrar.disabled = false;
        
        // Limpiar formulario
        document.getElementById('nuevoUsuarioForm').reset();
        
        // Opcional: redirigir a la página de usuarios
        // window.location.href = 'ordenes.html';
    }, 2000);
}

// Validar todo el formulario
function validarFormulario() {
    let esValido = true;
    
    // Validar campos requeridos
    const camposRequeridos = [
        'nombreCompleto',
        'correo', 
        'telefono',
        'contrasena',
        'confirmarContrasena',
        'direccionRegion',
        'direccionComuna'
    ];
    
    camposRequeridos.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (!elemento.value.trim()) {
            mostrarError(elemento, 'Este campo es requerido');
            esValido = false;
        } else {
            limpiarError(elemento);
        }
    });
    
    // Validar email
    const email = document.getElementById('correo');
    if (email.value && !validarEmail(email.value)) {
        mostrarError(email, 'Por favor ingresa un email válido');
        esValido = false;
    }
    
    // Validar contraseñas
    if (!validarContrasenas()) {
        esValido = false;
    }
    
    // Validar teléfono
    const telefono = document.getElementById('telefono');
    if (telefono.value && !validarTelefono(telefono.value)) {
        mostrarError(telefono, 'Por favor ingresa un teléfono válido');
        esValido = false;
    }
    
    return esValido;
}

// Validar contraseñas
function validarContrasenas() {
    const contrasena = document.getElementById('contrasena');
    const confirmarContrasena = document.getElementById('confirmarContrasena');
    
    if (!contrasena.value || !confirmarContrasena.value) {
        return false;
    }
    
    if (contrasena.value.length < 6) {
        mostrarError(contrasena, 'La contraseña debe tener al menos 6 caracteres');
        return false;
    }
    
    if (contrasena.value !== confirmarContrasena.value) {
        mostrarError(confirmarContrasena, 'Las contraseñas no coinciden');
        return false;
    }
    
    limpiarError(contrasena);
    limpiarError(confirmarContrasena);
    return true;
}

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar teléfono
function validarTelefono(telefono) {
    // Permitir diferentes formatos de teléfono chileno
    const regex = /^(\+?56)?[0-9]{8,9}$/;
    return regex.test(telefono.replace(/\s/g, ''));
}

// Mostrar error
function mostrarError(elemento, mensaje) {
    elemento.classList.add('error');
    
    // Remover mensaje de error previo
    const errorPrevio = elemento.parentNode.querySelector('.error-message');
    if (errorPrevio) {
        errorPrevio.remove();
    }
    
    // Crear nuevo mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = mensaje;
    
    elemento.parentNode.appendChild(errorDiv);
}

// Limpiar error
function limpiarError(elemento) {
    elemento.classList.remove('error');
    const errorMessage = elemento.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Actualizar comunas basado en la región seleccionada
function actualizarComunas() {
    const regionSelect = document.getElementById('direccionRegion');
    const comunaSelect = document.getElementById('direccionComuna');
    
    // Limpiar comunas
    comunaSelect.innerHTML = '<option value="">Seleccionar...</option>';
    
    const comunasPorRegion = {
        'region-metropolitana': [
            'Santiago', 'Las Condes', 'Providencia', 'Vitacura', 'Maipú', 'Ñuñoa', 
            'La Florida', 'Puente Alto', 'San Miguel', 'Independencia', 'La Reina',
            'Peñalolén', 'Macul', 'San Joaquín', 'Pedro Aguirre Cerda'
        ],
        'region-valparaiso': [
            'Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana', 
            'Casablanca', 'San Antonio', 'Quillota'
        ],
        'region-biobio': [
            'Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles', 'Coronel', 
            'San Pedro de la Paz', 'Hualpén'
        ]
        // Puedes agregar más regiones según necesites
    };
    
    const comunas = comunasPorRegion[regionSelect.value];
    if (comunas) {
        comunas.forEach(comuna => {
            const option = document.createElement('option');
            option.value = comuna.toLowerCase().replace(/\s+/g, '-');
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    }
}

// Formatear teléfono mientras se escribe
document.addEventListener('DOMContentLoaded', function() {
    const telefonos = ['telefono', 'telefonoOpcional'];
    
    telefonos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 8) {
                        value = value.replace(/(\d{4})(\d{4})/, '$1 $2');
                    } else {
                        value = value.replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2 $3');
                    }
                }
                e.target.value = value;
            });
        }
    });
});
