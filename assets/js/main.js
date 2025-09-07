// JavaScript principal para VeggieMart
document.addEventListener('DOMContentLoaded', function() {
    console.log('VeggieMart cargado correctamente');
    
    // Inicializar componentes
    initializeApp();
});

function initializeApp() {
    // Verificar si existe datos en localStorage, si no, crear estructura inicial
    if (!localStorage.getItem('veggiemartData')) {
        initializeData();
    }
    
    // Cargar datos de productos
    loadInitialData();
}

function initializeData() {
    const initialData = {
        productos: [
            {
                id: 1,
                nombre: "Tomates Frescos",
                categoria: "Verduras",
                precio: 2500,
                stock: 50,
                descripcion: "Tomates frescos de la huerta",
                imagen: "assets/images/tomate.jpg"
            },
            {
                id: 2,
                nombre: "Lechuga Criolla",
                categoria: "Hojas Verdes",
                precio: 1800,
                stock: 30,
                descripcion: "Lechuga fresca y crujiente",
                imagen: "assets/images/lechuga.jpg"
            },
            {
                id: 3,
                nombre: "Zanahorias",
                categoria: "Raíces",
                precio: 2200,
                stock: 40,
                descripcion: "Zanahorias dulces y nutritivas",
                imagen: "assets/images/zanahoria.jpg"
            }
        ],
        usuarios: [
            {
                id: 1,
                username: "admin",
                password: "admin123",
                role: "admin"
            }
        ],
        carrito: [],
        configuracion: {
            nombre_tienda: "VeggieMart",
            moneda: "CLP"
        }
    };
    
    localStorage.setItem('veggiemartData', JSON.stringify(initialData));
    console.log('Datos iniciales creados');
}

function loadInitialData() {
    const data = JSON.parse(localStorage.getItem('veggiemartData'));
    console.log('Datos cargados:', data);
    return data;
}

// Funciones utilitarias
function formatPrice(price) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(price);
}

function saveData(data) {
    localStorage.setItem('veggiemartData', JSON.stringify(data));
}

function getData() {
    return JSON.parse(localStorage.getItem('veggiemartData'));
}