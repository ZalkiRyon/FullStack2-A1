// JavaScript para el login de administrador

// Lista de usuarios admin (copiada del módulo)
const usuarios = [
    {
        id: 1,
        username: "admin",
        password: "admin123",
        role: "admin",
    },
];

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Verificar si ya está autenticado
    if (sessionStorage.getItem('adminAuthenticated')) {
        window.location.href = 'dashboard.html';
    }
});

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validar credenciales
    const user = usuarios.find(u => u.username === username && u.password === password && u.role === 'admin');
    
    if (user) {
        // Autenticación exitosa
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminUser', user.username);
        
        // Mostrar mensaje de éxito
        showMessage('Inicio de sesión exitoso. Redirigiendo...', 'success');
        
        // Redirigir al dashboard después de un breve delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } else {
        // Credenciales incorrectas
        showMessage('Usuario o contraseña incorrectos', 'error');
    }
}

function showMessage(message, type) {
    // Remover mensaje anterior si existe
    const existingMessage = document.querySelector('.login-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert login-message ${type === 'success' ? 'alert-success' : 'alert-danger'}`;
    messageDiv.textContent = message;
    
    // Insertar el mensaje después del formulario
    const form = document.getElementById('login-form');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    // Remover el mensaje después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}
