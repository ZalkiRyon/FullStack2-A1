// Lógica de login para inicioSesion.html (admin y usuarios)
import { obtenerTodosLosUsuarios } from './modules/usuarios.js';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.formInicioSesion');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validar que los campos no estén vacíos
        if (!email || !password) {
            alert('Por favor, ingresa tanto el correo como la contraseña.');
            return;
        }

        // Obtener todos los usuarios (admin + localStorage)
        const todosLosUsuarios = obtenerTodosLosUsuarios();
        console.log('Usuarios cargados (admin + registrados desde localStorage):', todosLosUsuarios.length);

        // Buscar usuario
        const user = todosLosUsuarios.find(u => u.email === email && u.password === password);
        
        if (!user) {
            alert('Correo o contraseña incorrectos.');
            return;
        }

        // Redirigir según el rol del usuario
        if (user.role === 'admin') {
            // Guardar información de sesión para admin
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminUser', user.email);
            sessionStorage.setItem('userId', user.id);
            
            alert('¡Bienvenido, administrador!');
            
            // Redirigir al dashboard
            window.location.href = '../admin/dashboard.html';
        } else if (user.role === 'cliente') {
            // Guardar información de sesión para cliente
            sessionStorage.setItem('clienteLoggedIn', 'true');
            sessionStorage.setItem('clienteUser', user.email);
            sessionStorage.setItem('userId', user.id);
            sessionStorage.setItem('clienteNombre', user.nombre || 'Usuario');
            
            alert(`¡Bienvenido, ${user.nombre || 'Usuario'}!`);
            
            // Redirigir a la tienda (por ahora al inicio)
            window.location.href = '../../index.html';
        } else {
            alert('Tipo de usuario no reconocido.');
        }
    });
});
