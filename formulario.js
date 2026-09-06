document.addEventListener("DOMContentLoaded", function() {
    const btnAgregar = document.getElementById("add-row-btn");
    const tablaPlantel = document.querySelector("#roster-table tbody");
    const btnEnviar = document.querySelector(".btn-whatsapp-submit");

    // Arrays de talles actualizados
    const tallesAdulto = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];
    const tallesNino = ["4", "6", "8", "10", "12", "14", "16"];

    // 1. Función para agregar una nueva fila con lógica dinámica
    function agregarFila() {
        if (!tablaPlantel) return;

        const nuevaFila = document.createElement("tr");
        
        nuevaFila.innerHTML = `
            <td>
                <select class="select-tipo">
                    <option value="Jugador">Jugador</option>
                    <option value="Golero">Golero</option>
                </select>
            </td>
            <td>
                <select class="select-categoria">
                    <option value="Adulto">Adulto</option>
                    <option value="Niño">Niño</option>
                </select>
            </td>
            <td>
                <select class="select-talle">
                    <!-- Se llenará dinámicamente -->
                </select>
            </td>
            <td><input type="number" class="input-numero" placeholder="Ej: 10" style="width: 70px;"></td>
            <td><input type="text" class="input-nombre" placeholder="Ej: GÓMEZ"></td>
            <td><button type="button" class="btn-eliminar" style="color: #d90267; background: transparent; border: none; cursor: pointer; font-weight: bold; font-size: 1.2rem;">X</button></td>
        `;

        tablaPlantel.appendChild(nuevaFila);

        // Elementos de la fila recién creada
        const selectCategoria = nuevaFila.querySelector(".select-categoria");
        const selectTalle = nuevaFila.querySelector(".select-talle");
        const btnEliminar = nuevaFila.querySelector(".btn-eliminar");

        // Función interna para cargar los talles según la categoría seleccionada
        function actualizarTalles() {
            selectTalle.innerHTML = ""; // Limpiar opciones
            const opciones = selectCategoria.value === "Adulto" ? tallesAdulto : tallesNino;
            
            opciones.forEach(talle => {
                const opt = document.createElement("option");
                opt.value = talle;
                opt.textContent = talle;
                selectTalle.appendChild(opt);
            });
        }

        // Cargar talles por defecto (Adulto)
        actualizarTalles();

        // Escuchar cambios en la categoría (Adulto <-> Niño)
        selectCategoria.addEventListener("change", actualizarTalles);

        // Lógica para eliminar la fila
        btnEliminar.addEventListener("click", function() {
            nuevaFila.remove();
        });
    }

    // Agregar la primera fila al cargar la página si la tabla existe
    if (tablaPlantel) {
        agregarFila();
    }

    // Evento para el botón de agregar jugador
    if (btnAgregar) {
        btnAgregar.addEventListener("click", agregarFila);
    }

    // 2. Lógica para recopilar datos, generar PDF y enviar a WhatsApp
    if (btnEnviar) {
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
            if (filas.length === 0) {
                alert("Por favor, agrega al menos un jugador en la tabla.");
                return;
            }

            let datosTabla = [];
            let textoWhatsApp = `Hola Valknut! Soy ${contacto}. Quiero hacer un pedido para mi equipo "${equipo}".\n`;
            textoWhatsApp += `Cantidad estimada: ${cantidad} camisetas.\n\n`;
            textoWhatsApp += `*Detalle del plantel:*\n`;

            // Recorrer la tabla para extraer la info
            filas.forEach(fila => {
                const tipo = fila.querySelector(".select-tipo").value;
                const categoria = fila.querySelector(".select-categoria").value;
                const talle = fila.querySelector(".select-talle").value;
                const numero = fila.querySelector(".input-numero").value || "S/N";
                const nombre = fila.querySelector(".input-nombre").value || "Sin nombre";

                datosTabla.push([tipo, categoria, talle, numero, nombre]);
                textoWhatsApp += `- ${tipo} (${categoria}) | Talle ${talle} | N° ${numero} | ${nombre}\n`;
            });

            textoWhatsApp += `\n*Nota:* Te adjunto en este chat el PDF del pedido y las imágenes del diseño que descargué del editor 3D.`;

            // 3. Generar el PDF con jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Título y datos del cliente en el PDF
            doc.setFontSize(20);
            doc.text("Pedido de Camisetas - Valknut", 14, 20);
            doc.setFontSize(12);
            doc.text(`Equipo: ${equipo}`, 14, 30);
            doc.text(`Contacto: ${contacto}`, 14, 38);
            doc.text(`Cantidad: ${cantidad}`, 14, 46);

            // Generar tabla en el PDF
            doc.autoTable({
                startY: 55,
                head: [['Tipo', 'Categoría', 'Talle', 'Número', 'Nombre en Espalda']],
                body: datosTabla,
                theme: 'grid',
                headStyles: { fillColor: [217, 2, 103] }
            });

            // Descargar el PDF
            const nombreArchivo = `Pedido_Valknut_${equipo.replace(/\s+/g, '_')}.pdf`;
            doc.save(nombreArchivo);

            // 4. Redirigir a WhatsApp
            setTimeout(() => {
                const urlWhatsApp = `https://wa.me/59892585171?text=${encodeURIComponent(textoWhatsApp)}`;
                window.open(urlWhatsApp, '_blank');
            }, 1000);
        });
    }
});