// Utilidades para debugging de localStorage

// Funciones globales para debugging en consola
window.debugLocalStorage = {
    // Ver todos los usuarios registrados
    verUsuarios: function() {
        const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        console.table(usuarios);
        return usuarios;
    },
    
    // Crear un usuario de prueba
    crearUsuarioPrueba: function() {
        const usuarioPrueba = {
            id: Date.now(),
            nombreCompleto: "Usuario de Prueba",
            correo: "prueba@duoc.cl",
            telefono: "12345678",
            contrasena: "test123",
            telefonoOpcional: "",
            direccionRegion: "region-metropolitana",
            direccionComuna: "santiago",
            fechaRegistro: new Date().toISOString(),
            role: "cliente"
        };
        
        const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        usuarios.push(usuarioPrueba);
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
        
        console.log('Usuario de prueba creado:', usuarioPrueba);
        return usuarioPrueba;
    },
    
    // Limpiar todos los usuarios
    limpiarUsuarios: function() {
        localStorage.removeItem('usuariosRegistrados');
        console.log('Todos los usuarios eliminados de localStorage');
    },
    
    // Exportar usuarios a JSON
    exportarUsuarios: function() {
        const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        const dataStr = JSON.stringify(usuarios, null, 2);
        const dataBlob = new Blob([dataStr], {type:'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'usuarios_registrados.json';
        link.click();
        console.log('Usuarios exportados a archivo JSON');
    },
    
    // Contar usuarios por rol
    contarPorRol: function() {
        const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        const conteo = usuarios.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {});
        console.log('Usuarios por rol:', conteo);
        return conteo;
    },
    
    // Buscar usuario por correo
    buscarPorCorreo: function(correo) {
        const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        const usuario = usuarios.find(u => u.correo === correo);
        console.log('Usuario encontrado:', usuario);
        return usuario;
    },
    
    // Ver estadísticas
    estadisticas: function() {
        const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        const stats = {
            total: usuarios.length,
            porRol: this.contarPorRol(),
            ultimoRegistro: usuarios.length > 0 ? usuarios[usuarios.length - 1].fechaRegistro : null,
            dominiosEmail: usuarios.reduce((acc, user) => {
                const dominio = user.correo.split('@')[1];
                acc[dominio] = (acc[dominio] || 0) + 1;
                return acc;
            }, {})
        };
        console.log('Estadísticas de usuarios:', stats);
        return stats;
    }
};

// Mostrar ayuda en consola
console.log(`
🔧 UTILIDADES DE DEBUGGING DISPONIBLES:

debugLocalStorage.verUsuarios()         - Ver todos los usuarios en tabla
debugLocalStorage.crearUsuarioPrueba()  - Crear usuario de prueba
debugLocalStorage.limpiarUsuarios()     - Eliminar todos los usuarios
debugLocalStorage.exportarUsuarios()    - Descargar usuarios como JSON
debugLocalStorage.contarPorRol()        - Contar usuarios por rol
debugLocalStorage.buscarPorCorreo(email) - Buscar usuario específico
debugLocalStorage.estadisticas()        - Ver estadísticas generales

También disponible:
window.usuariosLocalStorage.listar()    - Función original para listar usuarios
`);
