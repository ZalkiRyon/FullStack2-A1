// Ocuparemos el main.js para la configuracion inicial de la app
// 1. Iniciar modulos (Los array con objts)
// 2. Inicializar la APP cuando el DOM se encuentre listo

// IMPORTAR MODULOS
import { initializerListaProductos } from "./modules/productos.js";

// Función principal de inicialización
function initializerApp() {
  console.log("Inicializando aplicación Huerto Hogar...");

  // Inicializar módulos
  initializerListaProductos();
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", initializerApp);

