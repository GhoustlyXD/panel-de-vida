// Datos inventados para el modo demo (nada real se publica en GitHub).
window.DEMO_DATA = (() => {
  const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
  let i = 0;
  const id = () => "demo-" + (++i);
  const D = {
    pedidos: [
      { id: id(), Cliente: "Nova — Espada rúnica", Encargo: "Espada rúnica", Estado: "En curso", Precio: 120, Moneda: "USD", Cobrado: 60, "Fecha de pedido": d(-6), "Fecha de entrega": d(2), "Segundos trabajados": 7420 },
      { id: id(), Cliente: "Kiro — Dragón low-poly", Encargo: "Dragón low-poly", Estado: "Sin empezar", Precio: 60000, Moneda: "Robux", Cobrado: 0, "Fecha de pedido": d(-3), "Fecha de entrega": d(-1), "Segundos trabajados": 0 },
      { id: id(), Cliente: "Luma — Casa medieval", Encargo: "Casa medieval", Estado: "En espera de revisión", Precio: 90, Moneda: "EUR", Cobrado: 0, "Fecha de pedido": d(-10), "Fecha de entrega": d(-2), "Segundos trabajados": 15300 },
      { id: id(), Cliente: "Nova — Escudo", Encargo: "Escudo", Estado: "Listo", Precio: 45, Moneda: "USD", Cobrado: 45, "Fecha de pedido": d(-40), "Fecha de pago": d(-33), "Método de pago": "Wise", "Segundos trabajados": 5400 },
      { id: id(), Cliente: "Orbe — Personaje rig", Encargo: "Personaje rig", Estado: "Listo", Precio: 210, Moneda: "USD", Cobrado: 210, "Fecha de pedido": d(-25), "Fecha de pago": d(-18), "Método de pago": "PayPal", "Segundos trabajados": 30000 },
      { id: id(), Cliente: "Pixel — Pack de armas", Encargo: "Pack de armas", Estado: "Listo", Precio: 150, Moneda: "USD", Cobrado: 150, "Fecha de pedido": d(-70), "Fecha de pago": d(-62), "Método de pago": "Wise", "Segundos trabajados": 21000 },
      { id: id(), Cliente: "Kiro — Coche", Encargo: "Coche", Estado: "Listo", Precio: 80, Moneda: "USD", Cobrado: 80, "Fecha de pedido": d(-12), "Fecha de pago": d(-4), "Método de pago": "Wise", "Segundos trabajados": 9000 },
      { id: id(), Cliente: "Ras — Árbol", Encargo: "Árbol", Estado: "Cancelado", Precio: 30, Moneda: "USD", "Fecha de pedido": d(-15) },
    ],
    cuentas: [
      { id: id(), Cuenta: "Banco ES", Tipo: "Banco", "País": "España", Saldo: 640, Moneda: "EUR" },
      { id: id(), Cuenta: "Banco RU", Tipo: "Banco", "País": "Rusia", Saldo: 52000, Moneda: "RUB" },
      { id: id(), Cuenta: "Hucha", Tipo: "Ahorro", "País": "Rusia", Saldo: 20000, Moneda: "RUB" },
      { id: id(), Cuenta: "Un amigo me debe", Tipo: "Prestado", "País": "Rusia", Saldo: 1500, Moneda: "RUB" },
    ],
    funpay: [
      { id: id(), Nota: "inicial", Fecha: d(-50), Saldo: 9000, Retirado: 9000 },
      { id: id(), Nota: "retirada", Fecha: d(-35), Saldo: 6000, Retirado: 6000 },
      { id: id(), Nota: "retirada", Fecha: d(-20), Saldo: 11000, Retirado: 11000 },
      { id: id(), Nota: "saldo actual", Fecha: d(-2), Saldo: 4300, Retirado: 0 },
    ],
    tareas: [
      { id: id(), Tarea: "Hacer la compra", "Área": "Casa", Estado: "Pendiente", Fecha: d(0) },
      { id: id(), Tarea: "Enviar avance a Nova", "Área": "Pedidos", Estado: "Hecha", Fecha: d(0) },
      { id: id(), Tarea: "Cocinar", "Área": "Cocina", Estado: "Pendiente" },
    ],
    rutina: [
      { id: id(), Bloque: "Levantarse", Hora: "07:00", Orden: 1 },
      { id: id(), Bloque: "Ejercicio", Hora: "Sin hora fija", Orden: 2 },
      { id: id(), Bloque: "Ir a la tienda", Hora: "Sobre las 20:00", Orden: 3, Nota: "Aproximado" },
      { id: id(), Bloque: "Dormir", Hora: "Sobre las 23:00", Orden: 4 },
    ],
    ventas: [],
    clientes: [],
  };
  // Una ficha por cliente, enlazada a sus pedidos.
  D.pedidos.forEach((p) => {
    const name = p.Cliente.split(" — ")[0];
    let c = D.clientes.find((x) => x.Nombre === name);
    if (!c) { c = { id: id(), Nombre: name, Desde: p["Fecha de pedido"], Canal: "Discord" }; D.clientes.push(c); }
    p["Ficha de cliente"] = [c.id];
  });
  return D;
})();
