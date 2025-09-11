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
    
    // También verificar si es vendedor (pueden acceder al admin)
    const isVendedorLoggedIn = sessionStorage.getItem('vendedorLoggedIn');
    const vendedorUser = sessionStorage.getItem('vendedorUser');
    
    if (!isAdminLoggedIn && !isVendedorLoggedIn) {
        // Redirigir al login si no está autenticado
        alert('Debes iniciar sesión como administrador o vendedor para acceder a esta página.');
        window.location.href = '../tienda/inicioSesion.html';
        return;
    }
    
    // Mostrar información del usuario logueado si hay elementos para ello
    const userInfoElement = document.querySelector('#adminUserInfo');
    if (userInfoElement) {
        if (isAdminLoggedIn && adminUser) {
            userInfoElement.textContent = `Admin: ${adminUser}`;
        } else if (isVendedorLoggedIn && vendedorUser) {
            userInfoElement.textContent = `Vendedor: ${vendedorUser}`;
        }
    }
    
    console.log('Usuario autenticado:', adminUser || vendedorUser);
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
        // Usar la función global de cerrar sesión si está disponible
        if (window.validarSesion && window.validarSesion.cerrarSesion) {
            window.validarSesion.cerrarSesion();
        } else {
            // Fallback: limpiar manualmente
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminUser');
            sessionStorage.removeItem('vendedorLoggedIn');
            sessionStorage.removeItem('vendedorUser');
            sessionStorage.removeItem('vendedorNombre');
            sessionStorage.removeItem('userId');
        }
        
        // Redirigir al login
        window.location.href = '../tienda/inicioSesion.html';
    }
}

// Función para validar acceso admin (puede ser usada por otras páginas)
function validateAdminAccess() {
    const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const isVendedorLoggedIn = sessionStorage.getItem('vendedorLoggedIn');
    return isAdminLoggedIn === 'true' || isVendedorLoggedIn === 'true';
}

// Exportar funciones si se necesitan en otros scripts
window.adminAuth = {
    checkAdminAuth,
    logout,
    validateAdminAccess
};
