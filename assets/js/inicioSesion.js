// Lógica de login para inicioSesion.html (admin y usuarios)

document.addEventListener('DOMContentLoaded', async function() {
    const form = document.querySelector('.formInicioSesion');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Importar usuarios desde el módulo
        let usuarios = [];
        try {
            const modulo = await import('./modules/usuarios.js');
            usuarios = modulo.usuarios;
        } catch (err) {
            alert('Error cargando usuarios.');
            return;
        }

        // Buscar usuario
        const user = usuarios.find(u => u.email === email && u.password === password);
        if (!user) {
            alert('Correo o contraseña incorrectos.');
            return;
        }

        // Si es admin, redirigir al dashboard
        if (user.role === 'admin') {
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminUser', user.email);
            window.location.href = '../admin/dashboard.html';
        } else {
            alert('Acceso solo para administradores.');
        }
    });
});
