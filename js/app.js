document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DEL CARRUSEL ---
    const track = document.getElementById('carrusel-track');
    const items = document.querySelectorAll('.carrusel-item');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const puntosContenedor = document.getElementById('carrusel-puntos');

    let currentIndex = 0;
    const totalItems = items.length;

    // Crear puntos de navegación dinámicamente
    items.forEach((_, index) => {
        const punto = document.createElement('div');
        punto.classList.add('punto');
        if (index === 0) punto.classList.add('activo');
        punto.addEventListener('click', () => moverAIndex(index));
        puntosContenedor.appendChild(punto);
    });

    const puntos = document.querySelectorAll('.punto');

    function actualizarCarrusel() {
        // Desplazar el track horizontalmente
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Actualizar puntos activos
        puntos.forEach((punto, index) => {
            punto.classList.toggle('activo', index === currentIndex);
        });
    }

    function moverAIndex(index) {
        currentIndex = index;
        actualizarCarrusel();
    }

    btnNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems; // Vuelve al inicio al llegar al final
        actualizarCarrusel();
    });

    btnPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems; // Vuelve al final si retrocede desde el inicio
        actualizarCarrusel();
    });


    // --- LÓGICA DE CARGA DE MULTIMEDIA (Lazy Load) ---
    const placeholders = document.querySelectorAll('.media-placeholder[data-type="iframe"]');

    placeholders.forEach(container => {
        const button = container.querySelector('.btn-cargar');
        
        button.addEventListener('click', () => {
            const src = container.getAttribute('data-src');
            const iframe = document.createElement('iframe');
            
            iframe.src = src;
            iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
            iframe.allowFullscreen = true;

            container.innerHTML = '';
            container.appendChild(iframe);
        });
    });

    // Abrir PDF en Modal
    const btnPdf = document.querySelector('.btn-pdf');
    if (btnPdf) {
        btnPdf.addEventListener('click', () => {
            const pdfUrl = btnPdf.getAttribute('data-pdf');

            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.85); display: flex; flex-direction: column;
                align-items: center; justify-content: center; z-index: 9999; padding: 20px;
            `;

            modal.innerHTML = `
                <button id="cerrar-pdf" style="align-self: flex-end; font-size: 1rem; font-weight: bold; background: #ff4757; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 10px;">✕ Cerrar Lectura</button>
                <iframe src="${pdfUrl}" style="width: 100%; max-width: 900px; height: 85vh; border: none; border-radius: 8px; background: white;"></iframe>
            `;

            document.body.appendChild(modal);

            document.getElementById('cerrar-pdf').addEventListener('click', () => {
                modal.remove();
            });
        });
    }
});