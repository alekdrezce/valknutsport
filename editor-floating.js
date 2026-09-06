(function() {
    // 1. Crear el contenedor principal del elemento flotante
    const floatingContainer = document.createElement("div");
    floatingContainer.id = "valknut-floating-bar";
    
    // 2. Estilos inyectados para asegurar que flote perfectamente sin romper el responsive
    const style = document.createElement("style");
    style.innerHTML = `
        #valknut-floating-bar {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid #2a2a2a;
            padding: 10px 20px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 9999;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            font-family: 'Roadgeek 2005 Mittelschrift', sans-serif;
        }
        .valknut-float-btn {
            background-color: #d90267;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            font-family: 'Roadgeek 2005 Series 5B', sans-serif;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
        }
        .valknut-float-btn:hover {
            background-color: #b30055;
        }
        .valknut-float-btn.secondary {
            background-color: #2a2a2a;
            border: 1px solid #444;
        }
        .valknut-float-btn.secondary:hover {
            background-color: #333;
        }
        @media (max-width: 768px) {
            #valknut-floating-bar {
                width: 90%;
                justify-content: space-between;
                padding: 8px 15px;
            }
            .valknut-float-btn {
                padding: 8px 12px;
                font-size: 0.8rem;
            }
        }
    `;
    document.head.appendChild(style);

    // 3. Contenido de la barra flotante (Botón para volver/cotizar)
    floatingContainer.innerHTML = `
        <a href="index.html" class="valknut-float-btn secondary">← Volver al Inicio</a>
        <a href="index.html#order-form" class="valknut-float-btn">Cotizar este Diseño</a>
    `;

    // 4. Añadir la barra al cuerpo de la página del diseñador
    document.body.appendChild(floatingContainer);
})();