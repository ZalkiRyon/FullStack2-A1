// Lógica de administración y validación de sesión para páginas de admin

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado como admin
    checkAdminAuth();
    
    // Configurar el botón de logout si existe
    setupLogout();
});

function checkAdminAuth() {
    const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const adminUser = sessionStorage.getItem('adminUser');
    
    if (!isAdminLoggedIn || isAdminLoggedIn !== 'true') {
        // Redirigir al login si no está autenticado
        alert('Debes iniciar sesión como administrador para acceder a esta página.');
        window.location.href = '../tienda/inicioSesion.html';
        return;
    }
    
    // Mostrar información del usuario logueado si hay elementos para ello
    const userInfoElement = document.querySelector('#adminUserInfo');
    if (userInfoElement && adminUser) {
        userInfoElement.textContent = `Bienvenido, ${adminUser}`;
    }
    
    console.log('Admin autenticado:', adminUser);
}

function setupLogout() {
    const logoutButton = document.querySelector('#logoutButton, .logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Limpiar el sessionStorage
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminUser');
        sessionStorage.removeItem('userId');
        
        // Redirigir al login
        window.location.href = '../tienda/inicioSesion.html';
    }
}

// Función para validar acceso admin (puede ser usada por otras páginas)
function validateAdminAccess() {
    const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    return isAdminLoggedIn === 'true';
}

// Exportar funciones si se necesitan en otros scripts
window.adminAuth = {
    checkAdminAuth,
    logout,
    validateAdminAccess
};
