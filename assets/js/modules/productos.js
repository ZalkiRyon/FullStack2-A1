// En los modulos se manejaran las funciones relacionadas a estos
// 1. Crear el array de productos
// 2. Funcion de initializer los datos
// 3. Funcion para obtener los datos
// 4. Funciones para renderizar los productos en el DOM

import { handleClickAgregarCarrito } from "./carrito.js";

const listaProductos = [
  {
    id: 1,
    nombre: "FR001 - Manzanas Fuji",
    categoria: "Frutas frescas",
    precio: 1200,
    stock: 150,
    descripcion:
      "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.",
    imagen: "manzana.jpg",
  },
  {
    id: 2,
    nombre: "FR002 - Naranjas Valencia",
    categoria: "Frutas frescas",
    precio: 1000,
    stock: 200,
    descripcion:
      "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.",
    imagen: "naranja.jpg",
  },
  {
    id: 3,
    nombre: "FR003 - Plátanos Cavendish",
    categoria: "Frutas frescas",
    precio: 800,
    stock: 250,
    descripcion:
      "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.",
    imagen: "platano.jpg",
  },
  {
    id: 4,
    nombre: "VR001 - Zanahorias Organicas",
    categoria: "Verduras organicas",
    precio: 900,
    stock: 100,
    descripcion:
      "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.",
    imagen: "zanahoria.jpg",
  },
  {
    id: 5,
    nombre: "VR002 - Espinacas Frescas",
    categoria: "Verduras organicas",
    precio: 700,
    stock: 80,
    descripcion:
      "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.",
    imagen: "espinaca.jpg",
  },
  {
    id: 6,
    nombre: "VR003 - Pimentones Tricolores",
    categoria: "Verduras organicas",
    precio: 1500,
    stock: 120,
    descripcion:
      "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.",
    imagen: "pimenton.jpg",
  },
  {
    id: 7,
    nombre: "PO001 - Miel Organica",
    categoria: "Productos organicos",
    precio: 5000,
    stock: 50,
    descripcion:
      "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.",
    imagen: "miel.jpg",
  },
  {
    id: 8,
    nombre: "PO002 - Quinua Organica",
    categoria: "Productos organicos",
    precio: 3000,
    stock: 70,
    descripcion:
      "Grano andino altamente nutritivo, ideal para ensaladas, sopas y guarniciones. La quinua es una excelente fuente de proteínas completas y fibra, cultivada sin el uso de pesticidas.",
    imagen: "quinoa.jpg",
  },
  {
    id: 9,
    nombre: "PL001 - Leche Entera",
    categoria: "Productos lacteos",
    precio: 1200,
    stock: 100,
    descripcion:
      "Leche fresca y pasteurizada, rica en calcio y vitaminas. Ideal para el consumo diario, ya sea sola o como ingrediente en diversas recetas.",
    imagen: "leche.jpg",
  },
];

export function initializerListaProductos() {
  // Cargar productos en localStorage si no existen
  if (!localStorage.getItem("ListaProductos")) {
    localStorage.setItem("ListaProductos", JSON.stringify(listaProductos));
  }
  console.log("Productos inicializados en localStorage");

  const ruta = window.location.pathname.split("/").pop();

  if (ruta === "" || ruta === "index.html") {
    renderProductosPagPrincipal();
  }
  if (ruta === "productos.html") {
    renderProductos();
  }
  if (ruta === "detalleProducto.html") {
    renderDetalleProducto();
  }
}



function renderProductosPagPrincipal() {
  // Renderizado pag principal
  const containerPagPrincipal = document.querySelector(".seccion-productos");

  // Obtener productos base y personalizados
  const productosBase = JSON.parse(localStorage.getItem("ListaProductos")) || [];
  const productosPersonalizados = JSON.parse(localStorage.getItem("ProductosPersonalizados")) || [];
  const productos = [...productosBase, ...productosPersonalizados];

  if (!containerPagPrincipal) {
    console.error(
      `No se encontró el contenedor con clase: ${containerPagPrincipal}`
    );
    return;
  }

  const primerosTresProductos = productos.slice(0, 3);

  containerPagPrincipal.innerHTML = primerosTresProductos
    .map(
      (producto) => {
        // Determinar la fuente de la imagen
        const imagenSrc = producto.imagenCustom 
          ? producto.imagenCustom 
          : producto.imagen 
            ? `assets/images/${producto.imagen}` 
            : 'assets/images/icono.png';
            
        return `
        <article class="cartaProducto">
          <div class="imgCartaProducto">
            <img src="${imagenSrc}" alt="Producto ${producto.nombre}" onerror="this.src='assets/images/icono.png'" />
          </div>
          <a href="">${producto.nombre}</a>
          <div class="contenidoCartaProducto">
            <p>${producto.categoria}</p>
            <p>$${producto.precio.toLocaleString()}</p>
          </div>
        </article>
        `;
      }
    )
    .join("");
}

function renderProductos() {
  // Renderizado Pag Producto
  const containerPagProducto = document.querySelector(
    ".sectionTodosLosProductos"
  );

  if (!containerPagProducto) {
    console.error(
      `No se encontró el contenedor con clase: ${containerPagProducto}`
    );
    return;
  }

  // Obtener productos base y personalizados
  const productosBase = JSON.parse(localStorage.getItem("ListaProductos")) || [];
  const productosPersonalizados = JSON.parse(localStorage.getItem("ProductosPersonalizados")) || [];
  const productos = [...productosBase, ...productosPersonalizados];

  containerPagProducto.innerHTML = productos
    .map(
      (producto) => {
        // Determinar la fuente de la imagen
        const imagenSrc = producto.imagenCustom 
          ? producto.imagenCustom 
          : producto.imagen 
            ? `../../assets/images/${producto.imagen}` 
            : '../../assets/images/icono.png';
            
        return `
        <article class="cardProductos" data-producto-id="${producto.id}">
          <div class="containerImgProductos">
            <img src="${imagenSrc}" alt="Imagen Producto ${producto.nombre}" class="imgProductos" onerror="this.src='../../assets/images/icono.png'" />
          </div>
          <h6>${producto.nombre}</h6>
          <span>$${producto.precio.toLocaleString()}</span>
          <button class="btnAddProductos" id="${producto.id}" >Añadir</button>
        </article>
        `;
      }
    )
    .join("");
  setupEvent();
}

function setupEvent() {
  // Identificar donde estaremos ubicados
  const container = document.querySelector(".sectionTodosLosProductos");

  container.addEventListener("click", (event) => {
    const target = event.target;

    // Solo para el evento de ver detalle
    // Buscamos el target mas cercano al la carta del producto
    const card = target.closest(".cardProductos");

    if (card && !target.matches(".btnAddProductos")) {
      handleClickDetalle(card);
    }

    // Llamo una funcion que viene desde carrito para entregarle el id del producto que seleccione
    if (target.matches(".btnAddProductos")) {
      handleClickAgregarCarrito(target);
      return;
    }
  });
}

function handleClickDetalle(cardElement) {
  const productoId = cardElement.getAttribute("data-producto-id");
  redirectDetalleProducto(productoId);
}

function redirectDetalleProducto(productoId) {
  // Obtener productos base y personalizados
  const productosBase = JSON.parse(localStorage.getItem("ListaProductos")) || [];
  const productosPersonalizados = JSON.parse(localStorage.getItem("ProductosPersonalizados")) || [];
  const productos = [...productosBase, ...productosPersonalizados];
  
  const producto = productos.find((p) => p.id == productoId);

  if (producto) {
    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
    window.location.href = "detalleProducto.html";
  }
}

function renderDetalleProducto() {
  const producto =
    JSON.parse(localStorage.getItem("productoSeleccionado")) || [];
  document.getElementById("nombreDetalleProducto").textContent =
    producto.nombre;
  document.getElementById("barraNombreDetalleProducto").textContent =
    producto.nombre;
  document.getElementById(
    "precioDetalleProducto"
  ).textContent = `$${producto.precio.toLocaleString()}`;
  document.getElementById("descripcionDetalleProducto").textContent =
    producto.descripcion;
    
  // Manejar imagen personalizada o predefinida
  const imagenElement = document.getElementById("imgDetalleProducto");
  if (producto.imagenCustom) {
    imagenElement.src = producto.imagenCustom;
  } else if (producto.imagen) {
    imagenElement.src = "../../assets/images/" + producto.imagen;
  } else {
    imagenElement.src = "../../assets/images/icono.png";
  }
  imagenElement.alt = producto.nombre;
  imagenElement.onerror = function() { this.src = "../../assets/images/icono.png"; };
}

