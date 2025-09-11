export function initializerCarrito() {
  // Si no existe un Carrito lo inicializa en array vacio
  if (!localStorage.getItem("Carrito")) {
    localStorage.setItem("Carrito", JSON.stringify([]));
  }

  const ruta = window.location.pathname.split("/").pop();

  if (ruta === "carrito.html") {
    renderPagCarrito();
  }
}

const carrito = JSON.parse(localStorage.getItem("Carrito")) || [];

function agregarProductoAlCarrito(productoId, cantidad = 1) {
  const productoExistente = carrito.find((item) => item.id === productoId);

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    carrito.push({ id: productoId, cantidad });
  }

  localStorage.setItem("Carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {

  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.textContent = totalItems;
    contador.style.display = totalItems > 0 ? "block" : "none";
  }
}

function renderPagCarrito(){
    console.log("carrito")
}
