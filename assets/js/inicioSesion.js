// Lógica de login para inicioSesion.html (admin y usuarios)

document.addEventListener('DOMContentLoaded', async function() {
    const form = document.querySelector('.formInicioSesion');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validar que los campos no estén vacíos
        if (!email || !password) {
            alert('Por favor, ingresa tanto el correo como la contraseña.');
            return;
        }

        // Importar usuarios desde el módulo
        let usuarios = [];
        try {
            const modulo = await import('./modules/usuarios.js');
            usuarios = modulo.usuarios;
            console.log('Usuarios cargados:', usuarios);
        } catch (err) {
            console.error('Error cargando usuarios:', err);
            alert('Error cargando usuarios. Verifica la conexión.');
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
            // Guardar información de sesión
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminUser', user.email);
            sessionStorage.setItem('userId', user.id);
            
            alert('¡Bienvenido, administrador!');
            
            // Redirigir al dashboard
            window.location.href = '../admin/dashboard.html';
        } else {
            alert('Acceso solo para administradores en esta versión.');
        }
    });
});
