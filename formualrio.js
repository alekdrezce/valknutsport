document.addEventListener("DOMContentLoaded", function() {
    const btnAgregar = document.getElementById("add-row-btn");
    const tablaPlantel = document.querySelector("#roster-table tbody");
    const btnEnviar = document.querySelector(".btn-whatsapp-submit");

    // 1. Lógica para agregar nuevas filas a la tabla
    btnAgregar.addEventListener("click", function() {
        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>
                <select>
                    <option>Jugador</option>
                    <option>Golero</option>
                </select>
            </td>
            <td>
                <select>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                    <option>XXL</option>
                </select>
            </td>
            <td><input type="number" placeholder="Ej: 10" style="width: 70px;"></td>
            <td><input type="text" placeholder="Ej: GÓMEZ"></td>
            <td><button type="button" class="btn-eliminar" style="color: #d90267; background: transparent; border: none; cursor: pointer; font-weight: bold; font-size: 1.2rem;">X</button></td>
        `;
        tablaPlantel.appendChild(nuevaFila);

        // Lógica para eliminar la fila recién creada
        nuevaFila.querySelector(".btn-eliminar").addEventListener("click", function() {
            nuevaFila.remove();
        });
    });

    // 2. Lógica para recopilar datos, generar PDF y enviar a WhatsApp
    btnEnviar.addEventListener("click", function(e) {
        e.preventDefault();

        const equipo = document.getElementById("team-name").value.trim();
        const contacto = document.getElementById("contact-name").value.trim();
        const cantidad = document.getElementById("total-qty").value;

        // Validación básica
        if (!equipo || !contacto || !cantidad) {
            alert("Por favor, completa el nombre del equipo, tu nombre y la cantidad aproximada.");
            return;
        }

        const filas = document.querySelectorAll("#roster-table tbody tr");
        let datosTabla = [];
        let textoWhatsApp = `Hola Valknut! Soy ${contacto}. Quiero hacer un pedido para mi equipo "${equipo}".\n`;
        textoWhatsApp += `Cantidad estimada: ${cantidad} camisetas.\n\n`;
        textoWhatsApp += `*Detalle del plantel:*\n`;

        // Recorrer la tabla para extraer la info
        filas.forEach(fila => {
            const tipo = fila.querySelector("td:nth-child(1) select").value;
            const talle = fila.querySelector("td:nth-child(2) select").value;
            const numero = fila.querySelector("td:nth-child(3) input").value || "S/N";
            const nombre = fila.querySelector("td:nth-child(4) input").value || "Sin nombre";

            datosTabla.push([tipo, talle, numero, nombre]);
            textoWhatsApp += `- ${tipo} | Talle ${talle} | N° ${numero} | ${nombre}\n`;
        });

        textoWhatsApp += `\n*Nota:* Te adjunto en este chat el PDF del pedido y las imágenes del diseño que descargué del editor 3D.`;

        // 3. Generar el PDF con jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Título del PDF
        doc.setFontSize(20);
        doc.text("Pedido de Camisetas - Valknut", 14, 20);
        
        // Datos del cliente en el PDF
        doc.setFontSize(12);
        doc.text(`Equipo: ${equipo}`, 14, 30);
        doc.text(`Contacto: ${contacto}`, 14, 38);
        doc.text(`Cantidad: ${cantidad}`, 14, 46);

        // Generar tabla en el PDF
        doc.autoTable({
            startY: 55,
            head: [['Tipo', 'Talle', 'Número', 'Nombre en Espalda']],
            body: datosTabla,
            theme: 'grid',
            headStyles: { fillColor: [217, 2, 103] } // Color de acento Valknut (--accent)
        });

        // Descargar el PDF
        const nombreArchivo = `Pedido_Valknut_${equipo.replace(/\s+/g, '_')}.pdf`;
        doc.save(nombreArchivo);

        // 4. Redirigir a WhatsApp (Esperamos 1 segundo para dar tiempo a la descarga)
        setTimeout(() => {
            const urlWhatsApp = `https://wa.me/59892585171?text=${encodeURIComponent(textoWhatsApp)}`;
            window.open(urlWhatsApp, '_blank');
        }, 1000);
    });
});