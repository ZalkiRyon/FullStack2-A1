export function initializerCarrito() {
  // Si no existe un Carrito lo inicializa en array vacio
  if (!localStorage.getItem("Carrito")) {
    localStorage.setItem("Carrito", JSON.stringify([]));
    localStorage.setItem("TotalItemsCarrito", 0);
  }

  const ruta = window.location.pathname.split("/").pop();

  if (ruta === "carrito.html") {
    renderPagCarrito();
  }
  renderNavCarrito();
}

export function handleClickAgregarCarrito(buttonElement) {
  const productoId = buttonElement.getAttribute("id");
  agregarProductoAlCarrito(productoId);
}

function agregarProductoAlCarrito(productoId, cantidad = 1) {
  const carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
  const listaProductos =
    JSON.parse(localStorage.getItem("ListaProductos")) || [];
  // El productoId llega como String y los id son Number asi que se castea
  const productoExistenteCarrito = carrito.find(
    (item) => item.id === parseInt(productoId)
  );

  // Si existe solo se le suma la cantidad
  if (productoExistenteCarrito) {
    productoExistenteCarrito.cantidad += cantidad;
    alert("Cantidad actualizada");
  } else {
    const producto = listaProductos.find(
      (produc) => produc.id === parseInt(productoId)
    );

    // Nuestro item que se ira directo al carrito
    const productoAgregar = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria,
      stock: producto.stock,
      cantidad: cantidad,
    };

    carrito.push(productoAgregar);
    alert("Producto agregado con exito al carrito");
  }

  localStorage.setItem("Carrito", JSON.stringify(carrito));
  updateContadorCarrito();
  renderNavCarrito();
}

function updateContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
  // Yo queria usar forEach pero internet dice usar reduce es mas elegante xq queda en 1 linea
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  localStorage.setItem("TotalItemsCarrito", totalItems.toString());
  return totalItems;
}

function renderNavCarrito() {
  const totalItems = localStorage.getItem("TotalItemsCarrito") || "0";

  const containerContador = document.querySelector("#carritoTexto");

  containerContador.textContent = "(" + totalItems + ")";
}

function renderPagCarrito() {
  console.log("carrito");
}
