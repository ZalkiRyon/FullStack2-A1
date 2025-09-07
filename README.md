# VeggieMart - Tienda de Vegetales

Sistema web de tienda de vegetales con interfaz de usuario y administración.

## Descripción del Proyecto
Aplicación web para la venta de vegetales frescos, desarrollada con HTML, CSS, JavaScript y Bootstrap. Incluye funcionalidades para usuarios (navegación y compra) y administradores (gestión de productos).

## Tecnologías Utilizadas
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3
- LocalStorage para persistencia de datos

## Estructura del Proyecto
```
/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   └── style.css      # Estilos personalizados
│   ├── js/
│   │   ├── main.js        # JavaScript principal
│   │   ├── tienda.js      # Lógica de la tienda
│   │   └── admin.js       # Lógica de administración
│   └── images/            # Imágenes de productos
├── pages/
│   ├── tienda/
│   │   └── tienda.html    # Interfaz de usuario/tienda
│   └── admin/
│       ├── login.html     # Login administrativo
│       └── dashboard.html # Panel de administración
├── data/
│   └── productos.json     # Datos iniciales
└── README.md
```

## Funcionalidades

### Para Usuarios:
- Visualización de productos
- Búsqueda y filtrado
- Carrito de compras
- Responsive design

### Para Administradores:
- Login seguro
- CRUD completo de productos
- Gestión de inventario
- Dashboard administrativo

## Instalación y Uso
1. Clonar el repositorio
2. Abrir `index.html` en un navegador web
3. Para administración: acceder a `/pages/admin/login.html`
   - Usuario: `admin`
   - Contraseña: `admin123`

## Colaboradores
- [Tu nombre] - Módulo de administración
- [Compañera] - Módulo de tienda/usuarios

## Estado del Proyecto
🚧 En desarrollo - Estructura básica completada