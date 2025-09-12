export const usuarios = [
  // ADMINISTRADORES
  {
    id: 1,
    email: "admin",
    password: "admin123",
    role: "admin",
    nombre: "Super",
    apellido: "Administrador",
    run: "12.345.678-9",
    telefono: "912345678",
    region: "region-metropolitana",
    comuna: "santiago",
    direccion: "Av. Providencia 1234, Oficina 501",
    comentario: "Usuario administrador principal del sistema",
    fechaRegistro: "2024-01-15T08:00:00.000Z"
  },
  {
    id: 2,
    email: "maria.gonzalez@duoc.cl",
    password: "admin456",
    role: "admin",
    nombre: "María José",
    apellido: "González Pérez",
    run: "15.678.234-5",
    telefono: "987654321",
    region: "region-valparaiso",
    comuna: "valparaiso",
    direccion: "Calle Esmeralda 789, Casa 12",
    comentario: "Administradora de sistemas y base de datos",
    fechaRegistro: "2024-02-10T09:30:00.000Z"
  },
  {
    id: 3,
    email: "carlos.torres@profesor.duoc.cl",
    password: "admin789",
    role: "admin",
    nombre: "Carlos Eduardo",
    apellido: "Torres Silva",
    run: "18.234.567-8",
    telefono: "956789123",
    region: "region-biobio",
    comuna: "concepcion",
    direccion: "Av. O'Higgins 2456, Depto 34B",
    comentario: "Administrador de contenido y gestión académica",
    fechaRegistro: "2024-01-25T14:15:00.000Z"
  }, 

  // CLIENTES
  {
    id: 4,
    email: "ana.martinez@gmail.com",
    password: "cliente123",
    role: "cliente",
    nombre: "Ana María",
    apellido: "Martínez López",
    run: "19.876.543-2",
    telefono: "945678912",
    region: "region-metropolitana",
    comuna: "las-condes",
    direccion: "Av. Apoquindo 4567, Casa 78",
    comentario: "Cliente VIP, compra productos orgánicos semanalmente",
    fechaRegistro: "2024-03-05T10:20:00.000Z"
  },
  {
    id: 5,
    email: "pedro.ramirez@gmail.com",
    password: "cliente456",
    role: "cliente",
    nombre: "Pedro Antonio",
    apellido: "Ramírez Castro",
    run: "16.789.123-4",
    telefono: "934567891",
    region: "region-ohiggins",
    comuna: "rancagua",
    direccion: "Calle San Martín 1234, Villa El Sauce",
    comentario: "Cliente frecuente, prefiere frutas frescas locales",
    fechaRegistro: "2024-02-28T16:45:00.000Z"
  },
  {
    id: 6,
    email: "lucia.fernandez@duoc.cl",
    password: "cliente789",
    role: "cliente",
    nombre: "Lucía Elena",
    apellido: "Fernández Morales",
    run: "21.456.789-1",
    telefono: "923456789",
    region: "region-araucania",
    comuna: "temuco",
    direccion: "Pasaje Los Aromos 567, Población Nueva",
    comentario: "Estudiante DUOC, compra productos económicos y saludables",
    fechaRegistro: "2024-03-12T11:30:00.000Z"
  },

  // VENDEDORES
  {
    id: 7,
    email: "rodrigo.silva@duoc.cl",
    password: "vendedor123",
    role: "vendedor",
    nombre: "Rodrigo Alejandro",
    apellido: "Silva Mendoza",
    run: "17.345.678-9",
    telefono: "967891234",
    region: "region-metropolitana",
    comuna: "maipu",
    direccion: "Av. Pajaritos 3456, Block 12, Depto 204",
    comentario: "Vendedor especializado en productos orgánicos y frutas",
    fechaRegistro: "2024-02-15T08:45:00.000Z"
  },
  {
    id: 8,
    email: "sofia.herrera@gmail.com",
    password: "vendedor456",
    role: "vendedor",
    nombre: "Sofía Alejandra",
    apellido: "Herrera Vásquez",
    run: "20.123.456-7",
    telefono: "956781234",
    region: "region-maule",
    comuna: "talca",
    direccion: "Calle 1 Norte 2345, Villa Los Jardines",
    comentario: "Vendedora con experiencia en atención al cliente y productos lácteos",
    fechaRegistro: "2024-01-30T13:20:00.000Z"
  },
  {
    id: 9,
    email: "miguel.rojas@profesor.duoc.cl",
    password: "vendedor789",
    role: "vendedor",
    nombre: "Miguel Ángel",
    apellido: "Rojas Contreras",
    run: "14.567.890-1",
    telefono: "912347856",
    region: "region-valparaiso",
    comuna: "vina-del-mar",
    direccion: "Av. Libertad 1789, Casa 45",
    comentario: "Vendedor tiempo parcial, especialista en verduras orgánicas",
    fechaRegistro: "2024-02-05T15:10:00.000Z"
  }
];

// Función para obtener todos los usuarios (admin + usuarios registrados)
export function obtenerTodosLosUsuarios() {
  try {
    // Obtener usuarios registrados de localStorage
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    
    console.log('📊 Usuarios en localStorage:', usuariosRegistrados.length);
    console.log('🔍 Primer usuario localStorage (estructura):', usuariosRegistrados[0] || 'No hay usuarios');
    
    // Convertir formato de usuarios registrados para que coincida con el formato del admin
    const usuariosFormateados = usuariosRegistrados.map(user => ({
      id: user.id,
      email: user.correo || user.email,
      password: user.contrasena || user.password,
      role: user.role || 'cliente',
      nombre: user.nombre,
      apellido: user.apellido,
      run: user.run,
      telefono: user.telefono,
      region: user.direccionRegion || user.region,
      comuna: user.direccionComuna || user.comuna,
      direccion: user.direccion,
      comentario: user.comentario,
      fechaRegistro: user.fechaRegistro
    }));
    
    console.log('✅ Usuarios formateados:', usuariosFormateados.length);
    
    // Combinar usuarios admin con usuarios registrados
    const todosLosUsuarios = [...usuarios, ...usuariosFormateados];
    console.log('🎯 Total usuarios (admin + registrados):', todosLosUsuarios.length);
    
    return todosLosUsuarios;
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


