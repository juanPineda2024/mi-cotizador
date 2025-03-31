let productosPedido = [];  // Almacena los productos de un pedido
let productosCotizacion = [];  // Almacena los productos de la cotización

// Función para manejar el formulario de ingreso de productos (Pedidos)
document.getElementById('pedidoForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const cliente = document.getElementById('cliente').value;
    const fecha = document.getElementById('fecha').value;
    const producto = document.getElementById('productoPedido').value;
    const precioUsd = parseFloat(document.getElementById('precioPedido').value);
    const tipoEnvio = document.getElementById('tipoEnvioPedido').value;
    const descuento = parseFloat(document.getElementById('descuentoPedido').value) || 0;

    const precioLempiras = precioUsd * 25.72; // El precio en lempiras sin ganancia
    const precioConGanancia = precioLempiras * 2; // Precio con el 100% de ganancia
    const precioEnvio = obtenerEnvio(tipoEnvio);
    const isv = precioConGanancia * 0.10;
    const subtotal = precioConGanancia + isv + precioEnvio;
    const precioFinal = subtotal - (descuento / 100) * subtotal;

    // Agregar producto al arreglo de productos para este pedido
    productosPedido.push({ producto, precioConGanancia, tipoEnvio, precioFinal });

    // Mostrar los productos y los resultados en la página
    mostrarPedido(cliente, fecha, productosPedido, precioFinal, isv, precioEnvio, subtotal, descuento);
});

// Función para mostrar los productos y totales en la página de pedido
function mostrarPedido(cliente, fecha, productos, precioFinal, isv, precioEnvio, subtotal, descuento) {
    let productoHTML = "<table border='1' cellpadding='5' style='width:100%; margin-top: 20px;'>";
    productoHTML += "<tr><th>Producto</th><th>Precio con Ganancia</th><th>Tipo de Envío</th><th>Precio Final</th></tr>";

    productos.forEach(producto => {
        productoHTML += `
            <tr>
                <td>${producto.producto}</td>
                <td>${producto.precioConGanancia}</td>
                <td>${producto.tipoEnvio}</td>
                <td>${producto.precioFinal}</td>
            </tr>
        `;
    });

    productoHTML += "</table>";

    document.getElementById('resultadoPedido').innerHTML = `
        <h3>Cliente: ${cliente}</h3>
        <h4>Fecha: ${fecha}</h4>
        ${productoHTML}
        <br>
        Precio con Ganancia Total: ${precioFinal.toFixed(2)}<br>
        ISV (10%): ${isv.toFixed(2)}<br>
        Envío Total: ${precioEnvio.toFixed(2)}<br>
        Subtotal: ${subtotal.toFixed(2)}<br>
        Descuento: ${descuento}%<br>
        Gran Total: ${precioFinal.toFixed(2)}
    `;
}

// Función para obtener el costo de envío según el tipo de producto
function obtenerEnvio(tipoEnvio) {
    switch (tipoEnvio) {
        case 'zapato': return 60;
        case 'ropaNiños': return 30;
        case 'articuloPequeño': return 15;
        case 'ropaAdulto': return 40;
        case 'articuloGrande': return 50;
        default: return 0;
    }
}

// Función para guardar el pedido en localStorage
function guardarPedido() {
    const cliente = document.getElementById('cliente').value;
    const fecha = document.getElementById('fecha').value;
    const estado = "Pendiente de Entrega"; // Estado inicial

    // Obtener los productos del pedido actual
    const pedido = {
        cliente,
        fecha,
        estado,
        productos: productosPedido
    };

    // Obtener pedidos anteriores de localStorage
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    // Agregar el nuevo pedido
    pedidos.push(pedido);

    // Guardar en localStorage
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    // Limpiar el formulario y el arreglo de productos
    productosPedido = [];
    alert("Pedido guardado exitosamente!");
}

// Función para ver los pedidos desde localStorage
function verPedidos() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    let pedidosHTML = "<h3>Pedidos Guardados:</h3><ul>";
    pedidos.forEach((pedido, index) => {
        pedidosHTML += `<li>
            Cliente: ${pedido.cliente}, Fecha: ${pedido.fecha}, Estado: ${pedido.estado}
            <button onclick="verDetalles(${index})">Ver Detalles</button>
            <button onclick="cambiarEstado(${index})">Marcar como Entregado</button>
        </li>`;
    });
    pedidosHTML += "</ul>";

    document.getElementById('resultadoPedido').innerHTML = pedidosHTML;
}

// Función para mostrar los detalles de un pedido
function verDetalles(index) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = pedidos[index];

    let detallesHTML = `<h4>Detalles del Pedido:</h4>
        <h5>Cliente: ${pedido.cliente}</h5>
        <h5>Fecha: ${pedido.fecha}</h5>
        <table border='1' cellpadding='5' style='width:100%;'>
        <tr><th>Producto</th><th>Precio con Ganancia</th><th>Tipo de Envío</th><th>Precio Final</th></tr>`;

    let sumaTotal = 0;

    pedido.productos.forEach(producto => {
        detallesHTML += `
            <tr>
                <td>${producto.producto}</td>
                <td>${producto.precioConGanancia}</td>
                <td>${producto.tipoEnvio}</td>
                <td>${producto.precioFinal}</td>
            </tr>
        `;
        sumaTotal += producto.precioFinal;
    });
    detallesHTML += "</table>";

    detallesHTML += `
        <h4>Total de Productos: ${sumaTotal.toFixed(2)}</h4>
    `;

    document.getElementById('resultadoPedido').innerHTML = detallesHTML;
}

// Función para cambiar el estado de un pedido a "Entregado"
function cambiarEstado(index) {
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos[index].estado = "Entregado";
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    verPedidos();
}

// Función para manejar el formulario de cotización
document.getElementById('cotizacionForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const cliente = document.getElementById('nombre').value;
    const producto = document.getElementById('producto').value;
    const precioUsd = parseFloat(document.getElementById('precioUsd').value);
    const tipoEnvio = document.getElementById('tipoEnvio').value;
    const descuento = parseFloat(document.getElementById('descuento').value) || 0;

    const precioLempiras = precioUsd * 25.72;  // El precio en lempiras sin ganancia
    const precioConGanancia = precioLempiras * 2; // Precio con el 100% de ganancia (doble del precio original)
    const precioEnvio = obtenerEnvio(tipoEnvio);

    // Agregar producto al arreglo de productos para esta cotización
    productosCotizacion.push({ producto, precioConGanancia, tipoEnvio, precioEnvio });

    // Calcular los totales
    calcularTotales(cliente, productosCotizacion, descuento);
});

// Función para calcular los totales y mostrar la cotización
function calcularTotales(cliente, productos, descuento) {
    let totalPrecioConGanancia = 0;
    let totalEnvio = 0;

    // Calcular el total de los productos, el precio con ganancia de cada uno y el total del envío
    productos.forEach(producto => {
        totalPrecioConGanancia += producto.precioConGanancia;
        totalEnvio += producto.precioEnvio;
    });

    // Calcular ISV, Subtotal y Gran Total
    const isv = totalPrecioConGanancia * 0.10;  // ISV del 10%
    const subtotal = totalPrecioConGanancia + isv + totalEnvio;
    const precioFinal = subtotal - (descuento / 100) * subtotal;

    // Mostrar los productos y los resultados en la página
    mostrarCotizacion(cliente, productos, totalPrecioConGanancia, isv, totalEnvio, subtotal, precioFinal, descuento);
}

// Función para mostrar los productos y los totales en la página de cotización
function mostrarCotizacion(cliente, productos, totalPrecioConGanancia, isv, totalEnvio, subtotal, precioFinal, descuento) {
    let productoHTML = "<table border='1' cellpadding='5' style='width:100%; margin-top: 20px;'>";
    productoHTML += "<tr><th style='width:25%'>Producto</th><th style='width:25%'>Precio</th><th style='width:25%'>Envío</th><th style='width:25%'>Precio Final</th></tr>";

    productos.forEach(producto => {
        productoHTML += `  
            <tr>
                <td>${producto.producto}</td>
                <td>${producto.precioConGanancia}</td>
                <td>${producto.precioEnvio}</td>
                <td>${producto.precioConGanancia + producto.precioEnvio}</td>
            </tr>
        `;
    });

    productoHTML += "</table>";

    document.getElementById('resultadoCotizacion').innerHTML = `  
        <h3>Cliente: ${cliente}</h3>  
        ${productoHTML}  
    `;

    // Definir window.pdfData para usarlo al generar el PDF
    window.pdfData = {
        nombreCliente: cliente,
        productos: productos,
        totalPrecioConGanancia: totalPrecioConGanancia,
        isv: isv,
        totalEnvio: totalEnvio,
        subtotal: subtotal,
        descuento: descuento,
        precioFinal: precioFinal
    };
}

// Función para generar el PDF con los datos de la cotización
function generarPDF() {
    if (!window.pdfData) {
        alert("No hay datos disponibles para generar el PDF.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;  // Posición en Y para escribir en el PDF

    const { nombreCliente, productos, totalPrecioConGanancia, isv, totalEnvio, subtotal, descuento, precioFinal } = window.pdfData;

    // Fondo blanco
    doc.setFillColor(255, 255, 255); // Blanco
    doc.rect(0, 0, 210, 297, 'F'); // Fondo blanco de toda la página

    // Palabra "COTIZACIÓN" centrada en la parte superior
    doc.setTextColor(255, 204, 0);  // Color mostaza
    doc.setFontSize(40); // Aumentamos el tamaño de la fuente para "Cotización"
    doc.text('COTIZACIÓN', 105, 30, { align: 'center' });  // Centrado en la página
    y += 20; // Espacio después de "COTIZACIÓN"

    // Nombre del cliente debajo de "Cotización" alineado a la izquierda
    doc.setTextColor(0, 0, 0);  // Texto en negro
    doc.setFontSize(14);
    doc.text(`Cliente: ${nombreCliente}`, 20, y + 10); // Alineado a la izquierda
    y += 20;  // Espacio después del nombre

    // Títulos de la tabla
    doc.setTextColor(0, 0, 0);  // Texto en negro
    doc.setFontSize(14);
    doc.text('Productos', 105, y, { align: 'center' });  // Título "Productos"
    y += 10;  // Espacio para la tabla

    // Calcular el ancho de la tabla
    const tableWidth = 170;  // Ancho de la tabla
    const marginLeft = (210 - tableWidth) / 2;  // Calcular el margen izquierdo para centrar

    // Configuración de la tabla (se ajusta el ancho al borde del cuadro de totales)
    doc.setDrawColor(255, 204, 0);  // Color de los bordes (mostaza)
    doc.setLineWidth(1);
    doc.autoTable({
        startY: y,
        head: [['Producto', 'Precio', 'Envío', 'Precio Final']],
        body: productos.map(producto => [
            producto.producto,
            producto.precioConGanancia.toFixed(2),
            producto.precioEnvio.toFixed(2),
            (producto.precioConGanancia + producto.precioEnvio).toFixed(2)
        ]),
        theme: 'grid',  // Para que tenga los bordes
        headStyles: { fillColor: [255, 204, 0] }, // Color de fondo de la cabecera (mostaza)
        margin: { left: marginLeft, top: 10 }, // Ajustamos el margen izquierdo para centrar la tabla
        tableWidth: tableWidth, // Ancho de la tabla
    });

    y = doc.lastAutoTable.finalY + 10; // Ajustar el Y después de la tabla

    // Recorrer totales en un cuadro centrado con el mismo tamaño que la tabla
    const cuadroY = y;
    doc.setDrawColor(255, 204, 0);  // Color del borde (mostaza)
    doc.setFillColor(255, 255, 255);  // Fondo blanco
    doc.rect(marginLeft, cuadroY, tableWidth, 80, 'S'); // Cuadro para los totales

    // Escribir los totales dentro del cuadro
    doc.setTextColor(0, 0, 0);  // Texto negro
    doc.setFontSize(12);
    doc.text(`Precio: ${totalPrecioConGanancia.toFixed(2)}`, marginLeft + 10, cuadroY + 10);
    doc.text(`ISV: ${isv.toFixed(2)}`, marginLeft + 10, cuadroY + 20);
    doc.text(`Envío Total: ${totalEnvio.toFixed(2)}`, marginLeft + 10, cuadroY + 30);
    doc.text(`Subtotal: ${subtotal.toFixed(2)}`, marginLeft + 10, cuadroY + 40);
    doc.text(`Descuento: ${descuento}%`, marginLeft + 10, cuadroY + 50);
    doc.text(`Gran Total: ${precioFinal.toFixed(2)}`, marginLeft + 10, cuadroY + 60);

    // Mensaje de descuento adicional al final
    doc.setFontSize(10);
    doc.setTextColor(255, 102, 0);  // Color naranja para el mensaje de descuento
    doc.text("Si tu compra es mayor a 2000, exige el 10% de descuento", 105, cuadroY + 100, { align: 'center' });

    // Guardar el archivo PDF
    doc.save('cotizacion.pdf');
}
