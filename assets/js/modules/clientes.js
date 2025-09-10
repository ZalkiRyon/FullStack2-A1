// Módulo de clientes y órdenes para el área de administración

// Lista de órdenes/clientes para el módulo de administración
export const ordenes = [
  { fecha: "2024-06-01", numeroOrden: "SO1001", cliente: "Acme Corporation", estado: "Enviado", monto: 2500.00 },
  { fecha: "2024-06-02", numeroOrden: "SO1002", cliente: "Bravo Solutions", estado: "Pendiente", monto: 1200.00 },
  { fecha: "2024-06-02", numeroOrden: "SO1003", cliente: "Charlie's Workshop", estado: "Cancelado", monto: 800.00 },
  { fecha: "2024-06-03", numeroOrden: "SO1004", cliente: "Delta Retail", estado: "Procesando", monto: 750.00 },
  { fecha: "2024-06-04", numeroOrden: "SO1005", cliente: "Echo Enterprises", estado: "Enviado", monto: 3000.00 },
  { fecha: "2024-06-05", numeroOrden: "SO1006", cliente: "Foxtrot Media", estado: "Pendiente", monto: 1150.00 },
  { fecha: "2024-06-06", numeroOrden: "SO1007", cliente: "Golf Goods Inc.", estado: "Enviado", monto: 2300.00 },
  { fecha: "2024-06-07", numeroOrden: "SO1008", cliente: "Hotel Harmony", estado: "Procesando", monto: 800.00 },
  { fecha: "2024-06-08", numeroOrden: "SO1009", cliente: "India IT Solutions", estado: "Cancelado", monto: 600.00 },
  { fecha: "2024-06-09", numeroOrden: "SO1010", cliente: "Juliet Services", estado: "Enviado", monto: 1850.00 },
  { fecha: "2024-06-10", numeroOrden: "SO1011", cliente: "Kilo Retail Group", estado: "Pendiente", monto: 2750.00 },
  { fecha: "2024-06-11", numeroOrden: "SO1012", cliente: "Lima Landscaping", estado: "Enviado", monto: 980.00 },
  { fecha: "2024-06-12", numeroOrden: "SO1013", cliente: "Mike's Mechanics", estado: "Procesando", monto: 450.00 },
  { fecha: "2024-06-13", numeroOrden: "SO1014", cliente: "November Nightlife", estado: "Enviado", monto: 3250.00 },
  { fecha: "2024-06-14", numeroOrden: "SO1015", cliente: "Oscar Outdoors", estado: "Cancelado", monto: 1300.00 },
  { fecha: "2024-06-15", numeroOrden: "SO1016", cliente: "Papa Pharmaceuticals", estado: "Pendiente", monto: 4800.00 },
  { fecha: "2024-06-16", numeroOrden: "SO1017", cliente: "Quebec Quilts", estado: "Procesando", monto: 1200.00 },
  { fecha: "2024-06-17", numeroOrden: "SO1018", cliente: "Romeo Restaurants", estado: "Enviado", monto: 2100.00 },
  { fecha: "2024-06-18", numeroOrden: "SO1019", cliente: "Sierra Studios", estado: "Pendiente", monto: 3350.00 },
  { fecha: "2024-06-19", numeroOrden: "SO1020", cliente: "Tango Tech", estado: "Enviado", monto: 5500.00 },
  { fecha: "2024-06-20", numeroOrden: "SO1021", cliente: "Uniform Universe", estado: "Procesando", monto: 920.00 },
  { fecha: "2024-06-21", numeroOrden: "SO1022", cliente: "Victor Ventures", estado: "Enviado", monto: 1680.00 },
  { fecha: "2024-06-22", numeroOrden: "SO1023", cliente: "Whiskey Wholesale", estado: "Cancelado", monto: 750.00 },
  { fecha: "2024-06-23", numeroOrden: "SO1024", cliente: "X-ray Experts", estado: "Pendiente", monto: 2200.00 },
  { fecha: "2024-06-24", numeroOrden: "SO1025", cliente: "Yankee Yard Care", estado: "Enviado", monto: 1450.00 },
  { fecha: "2024-06-25", numeroOrden: "SO1026", cliente: "Zulu Zest Catering", estado: "Procesando", monto: 3100.00 },
  { fecha: "2024-06-26", numeroOrden: "SO1027", cliente: "Alpha Analytics", estado: "Enviado", monto: 1850.00 },
  { fecha: "2024-06-27", numeroOrden: "SO1028", cliente: "Beta Building Supply", estado: "Pendiente", monto: 4200.00 },
  { fecha: "2024-06-28", numeroOrden: "SO1029", cliente: "Gamma Games", estado: "Cancelado", monto: 680.00 },
  { fecha: "2024-06-29", numeroOrden: "SO1030", cliente: "Delta Designs", estado: "Enviado", monto: 2900.00 },
  { fecha: "2024-06-30", numeroOrden: "SO1031", cliente: "Epsilon Electronics", estado: "Procesando", monto: 1250.00 },
  { fecha: "2024-07-01", numeroOrden: "SO1032", cliente: "Zeta Zoology", estado: "Enviado", monto: 1750.00 },
  { fecha: "2024-07-02", numeroOrden: "SO1033", cliente: "Eta Engineering", estado: "Pendiente", monto: 3800.00 },
  { fecha: "2024-07-03", numeroOrden: "SO1034", cliente: "Theta Theaters", estado: "Cancelado", monto: 950.00 },
  { fecha: "2024-07-04", numeroOrden: "SO1035", cliente: "Iota Industries", estado: "Enviado", monto: 2650.00 },
  { fecha: "2024-07-05", numeroOrden: "SO1036", cliente: "Kappa Kitchen", estado: "Procesando", monto: 1480.00 },
  { fecha: "2024-07-06", numeroOrden: "SO1037", cliente: "Lambda Logistics", estado: "Enviado", monto: 3200.00 },
  { fecha: "2024-07-07", numeroOrden: "SO1038", cliente: "Mu Manufacturing", estado: "Pendiente", monto: 820.00 },
  { fecha: "2024-07-08", numeroOrden: "SO1039", cliente: "Nu Networks", estado: "Cancelado", monto: 1100.00 },
  { fecha: "2024-07-09", numeroOrden: "SO1040", cliente: "Xi Xerography", estado: "Enviado", monto: 2400.00 },
  { fecha: "2024-07-10", numeroOrden: "SO1041", cliente: "Omicron Opticals", estado: "Procesando", monto: 1650.00 },
  { fecha: "2024-07-11", numeroOrden: "SO1042", cliente: "Pi Printing", estado: "Enviado", monto: 2850.00 },
  { fecha: "2024-07-12", numeroOrden: "SO1043", cliente: "Rho Robotics", estado: "Pendiente", monto: 4100.00 },
  { fecha: "2024-07-13", numeroOrden: "SO1044", cliente: "Sigma Security", estado: "Cancelado", monto: 780.00 },
  { fecha: "2024-07-14", numeroOrden: "SO1045", cliente: "Tau Textiles", estado: "Enviado", monto: 1950.00 },
  { fecha: "2024-07-15", numeroOrden: "SO1046", cliente: "Upsilon Utilities", estado: "Procesando", monto: 3600.00 },
  { fecha: "2024-07-16", numeroOrden: "SO1047", cliente: "Phi Photography", estado: "Enviado", monto: 1320.00 },
  { fecha: "2024-07-17", numeroOrden: "SO1048", cliente: "Chi Chemicals", estado: "Pendiente", monto: 2750.00 },
  { fecha: "2024-07-18", numeroOrden: "SO1049", cliente: "Psi Psychology", estado: "Cancelado", monto: 890.00 },
  { fecha: "2024-07-19", numeroOrden: "SO1050", cliente: "Omega Organics", estado: "Enviado", monto: 3450.00 },
  { fecha: "2024-07-20", numeroOrden: "SO1051", cliente: "Aurora Agriculture", estado: "Procesando", monto: 2100.00 },
  { fecha: "2024-07-21", numeroOrden: "SO1052", cliente: "Borealis Books", estado: "Enviado", monto: 1380.00 },
  { fecha: "2024-07-22", numeroOrden: "SO1053", cliente: "Cosmos Consulting", estado: "Pendiente", monto: 4500.00 },
  { fecha: "2024-07-23", numeroOrden: "SO1054", cliente: "Dynamo Dynamics", estado: "Cancelado", monto: 650.00 },
  { fecha: "2024-07-24", numeroOrden: "SO1055", cliente: "Eclipse Events", estado: "Enviado", monto: 2950.00 },
  { fecha: "2024-07-25", numeroOrden: "SO1056", cliente: "Fusion Foods", estado: "Procesando", monto: 1750.00 },
  { fecha: "2024-07-26", numeroOrden: "SO1057", cliente: "Galaxy Graphics", estado: "Enviado", monto: 2200.00 },
  { fecha: "2024-07-27", numeroOrden: "SO1058", cliente: "Horizon Holdings", estado: "Pendiente", monto: 3850.00 },
  { fecha: "2024-07-28", numeroOrden: "SO1059", cliente: "Infinity Insurance", estado: "Cancelado", monto: 1150.00 },
  { fecha: "2024-07-29", numeroOrden: "SO1060", cliente: "Nebula Networks", estado: "Enviado", monto: 2680.00 }
];

// Función para obtener todas las órdenes
export function obtenerOrdenes() {
  return ordenes;
}

// Función para filtrar órdenes por estado
export function filtrarOrdenesPorEstado(estado) {
  if (estado === 'all' || !estado) {
    return ordenes;
  }
  return ordenes.filter(orden => orden.estado.toLowerCase() === estado.toLowerCase());
}

// Función para obtener órdenes paginadas
export function obtenerOrdenesPaginadas(pagina = 1, porPagina = 20) {
  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  return ordenes.slice(inicio, fin);
}
