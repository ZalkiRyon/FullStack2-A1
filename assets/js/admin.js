// JavaScript para el área de administración - Dashboard Home

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard de administración cargado');
    
    // Verificar autenticación (básico)
    checkAuthStatus();
    
    // Inicializar componentes del dashboard
    initializeDashboard();
});

// Función para verificar el estado de autenticación
function checkAuthStatus() {
    // Verificar si el usuario está autenticado
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    
    if (!isAuthenticated) {
        // Redirigir al login si no está autenticado
        window.location.href = 'login.html';
        return;
    }
    
    console.log('Usuario administrador autenticado');
}

// Función para inicializar el dashboard
function initializeDashboard() {
    // Configurar navegación del sidebar
    setupSidebarNavigation();
    
    // Configurar perfil de usuario
    setupUserProfile();
}

// Configurar la navegación del sidebar
function setupSidebarNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo prevenir default si no tiene href válido
            const href = this.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
                
                // Remover clase active de todos los items
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Agregar clase active al item clickeado
                this.closest('.nav-item').classList.add('active');
                
                // Aquí se puede agregar lógica para cambiar el contenido
                const sectionName = this.querySelector('span').textContent;
                console.log(`Navegando a: ${sectionName}`);
            }
            // Si tiene href válido, permitir navegación normal
        });
    });
}

// Configurar el perfil de usuario
function setupUserProfile() {
    const userNameElement = document.querySelector('.user-name');
    
    // Obtener nombre del usuario desde sessionStorage o usar valor por defecto
    const adminUser = sessionStorage.getItem('adminUser') || 'Admin';
    
    if (userNameElement) {
        userNameElement.textContent = adminUser;
    }
}

// Función para cerrar sesión
function logout() {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

// Exportar funciones para uso externo si es necesario
window.adminDashboard = {
    logout: logout
};
