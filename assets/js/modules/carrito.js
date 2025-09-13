export function initializerCarrito() {
  // Si no existe un Carrito lo inicializa en array vacio
  if (!localStorage.getItem("Carrito")) {
    localStorage.setItem("Carrito", JSON.stringify([]));
    localStorage.setItem("TotalItemsCarrito", 0);
  }

  const ruta = window.location.pathname.split("/").pop();

  if (ruta === "carrito.html") {
    renderPagCarrito();
    setupCartEventListeners();
  }
  renderNavCarrito();
}

export function handleClickAgregarCarrito(buttonElement) {
  const productoId = parseInt(buttonElement.getAttribute("id"));
  agregarProductoAlCarrito(productoId);
}

function agregarProductoAlCarrito(productoId, cantidad = 1) {
  const carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
  const listaProductos =
    JSON.parse(localStorage.getItem("ListaProductos")) || [];
  // El productoId llega como String y los id son Number asi que se castea
  const productoExistenteCarrito = carrito.find(
    (item) => item.id === productoId
  );

  // Si existe solo se le suma la cantidad
  if (productoExistenteCarrito) {
    productoExistenteCarrito.cantidad += cantidad;
    alert("Cantidad actualizada");
  } else {
    const producto = listaProductos.find(
      (produc) => produc.id === productoId
    );

    // Nuestro item que se ira directo al carrito
    const productoAgregar = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
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

  containerContador
    ? (containerContador.textContent = `(${totalItems})`)
    : (containerContador.textContent = "(0)");
}

function renderPagCarrito() {
  const containerCarrito = document.getElementById("cart-list");
  const carrito = JSON.parse(localStorage.getItem("Carrito")) || [];

  if (!containerCarrito) {
    console.error(
      `No se encontró el contenedor con clase: ${containerCarrito}`
    );
    return;
  }

  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const totalCarrito = document.getElementById("totalCarrito");

  if (carrito.length === 0) {
    totalCarrito.innerHTML = `$0`;
    containerCarrito.innerHTML = `
    <div >
      <h3>No hay elementos en tu carrito...</h3>
      <p>Agrega algunos productos para continuar</p>
    </div>`;
  } else {
    totalCarrito.innerHTML = `$ ${total}`;
    containerCarrito.innerHTML = carrito
      .map(
        (item) => `
        <article class="productoCarrito" data-carrito-id="${item.id}">
            <div class="containerImgProductoCarrito">
              <img
                src="../../assets/images/${item.imagen}"
                alt="Producto"
                class="imgProductoCarrito"
              />
            </div>
            <div>
              <h4>${item.nombre}</h4>
              <p>${item.descripcion.slice(0, 3)}</p>
            </div>
            <div class="d-flex flex-column">
              <h4 class="precioItem">$ ${item.precio * item.cantidad}</h4>
              <div>
                <button class="btn-restar">-</button>
                <input
                  type="number"
                  id="cantidadProductoCarrito"
                  name="cantidad"
                  min="1"
                  max="100"
                  value="${item.cantidad}"
                  class="w-50 cantidadProductoCarrito"
                  onkeydown="return false" onpaste="return false"
                />
                 <button class="btn-sumar">+</button>
              </div>
            </div>
          </article>`
      )
      .join("");
  }
}


function setupCartEventListeners() {
  // Similar a en productos donde habia que distinguir 
  // cuando se apretara para agregar al carro o
  // ir al detalle en particular
  // hay que hacerlo con los botones de sumar y restar 
  const containerCarrito = document.getElementById("cart-list");

  if (containerCarrito) {
    containerCarrito.addEventListener("click", function (event) {
  
      if (
        event.target.matches(".btn-sumar") ||
        event.target.matches(".btn-restar")
      ) {
       
        const article = event.target.closest(".productoCarrito");
        if (!article) return;

        
        const id = parseInt(article.getAttribute("data-carrito-id"));

        
        if (event.target.matches(".btn-sumar")) {
          aumentarCantidad(id);
        } else if (event.target.matches(".btn-restar")) {
          disminuirCantidad(id);
        }
      }
    });
  }
}

function disminuirCantidad(id) {
  let carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
  const itemIndex = carrito.findIndex((i) => i.id === id);

  const containerItem = document.querySelector(
    `.productoCarrito[data-carrito-id="${id}"]`
  );

  // Teniendo el id se puede saber la posicion en el array y se cambia la cantidad
  carrito[itemIndex].cantidad -= 1;

  // Actualizar solo el input de cantidad
  if (containerItem) {
    const input = containerItem.querySelector(".cantidadProductoCarrito");
    if (input) {
      input.value = carrito[itemIndex].cantidad;
    }
  }

  // Cuando la cantidad sea cero, sacar del carrito
  if (carrito[itemIndex].cantidad <= 0) {
    carrito = carrito.filter((item) => item.id !== id);
  }

  localStorage.setItem("Carrito", JSON.stringify(carrito));
  updateContadorCarrito();
  renderNavCarrito();
  renderPagCarrito();
}

function aumentarCantidad(id) {
  let carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
  const itemIndex = carrito.findIndex((i) => i.id === id);

  if (itemIndex !== -1) {
    carrito[itemIndex].cantidad += 1;

    localStorage.setItem("Carrito", JSON.stringify(carrito));
    updateContadorCarrito();
    renderNavCarrito();
    renderPagCarrito();

    const article = document.querySelector(
      `.productoCarrito[data-carrito-id="${id}"]`
    );

    if (article) {
      const input = article.querySelector(".cantidadProductoCarrito");
      if (input) {
        input.value = carrito[itemIndex].cantidad;
      }
    }
  }
}
