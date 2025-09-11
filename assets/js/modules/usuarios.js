export const usuarios = [
  {
    id: 1,
    email: "admin",
    password: "admin123",
    role: "admin",
  },
];

// Función para obtener todos los usuarios (admin + usuarios registrados)
export function obtenerTodosLosUsuarios() {
  try {
    // Obtener usuarios registrados de localStorage
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    
    // Convertir formato de usuarios registrados para que coincida con el formato del admin
    const usuariosFormateados = usuariosRegistrados.map(user => ({
      id: user.id,
      email: user.correo,
      password: user.contrasena,
      role: user.role || 'cliente',
      nombre: user.nombre,
      apellido: user.apellido,
      run: user.run,
      telefono: user.telefono,
      region: user.direccionRegion,
      comuna: user.direccionComuna,
      direccion: user.direccion,
      comentario: user.comentario,
      fechaRegistro: user.fechaRegistro
    }));
    
    // Combinar usuarios admin con usuarios registrados
    return [...usuarios, ...usuariosFormateados];
  } catch (error) {
    console.error('Error al obtener usuarios de localStorage:', error);
    return usuarios; // Retornar solo usuarios admin si hay error
  }
}

// Función para buscar usuario por email en ambas fuentes
export function buscarUsuarioPorEmail(email) {
  const todosLosUsuarios = obtenerTodosLosUsuarios();
  return todosLosUsuarios.find(user => user.email === email);
}

// Función para validar credenciales
export function validarCredenciales(email, password) {
  const usuario = buscarUsuarioPorEmail(email);
  return usuario && usuario.password === password ? usuario : null;
}


