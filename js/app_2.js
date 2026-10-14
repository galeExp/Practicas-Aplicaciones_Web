document.addEventListener('DOMContentLoaded', () => {

    // --- CARRUSEL ---
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
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        puntos.forEach((punto, index) => {
            punto.classList.toggle('activo', index === currentIndex);
        });
    }

    function moverAIndex(index) {
        currentIndex = index;
        actualizarCarrusel();
    }

    btnNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        actualizarCarrusel();
    });

    btnPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        actualizarCarrusel();
    });

    // --- MODALES INDIVIDUALES ---
    let modalActivo = null;

    function abrirModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modalActivo = modal;
        modal.classList.add('abierto');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-abierto');

        // El PDF se carga solo al abrir el modal
        const visor = modal.querySelector('embed[data-src]');
        if (visor) visor.src = visor.dataset.src;

        // Inicia el audio/video si el navegador lo permite
        const media = modal.querySelector('video, audio');
        if (media) media.play().catch(() => {});
    }

    function cerrarModal() {
        if (!modalActivo) return;

        // Pausa y reinicia el audio/video
        modalActivo.querySelectorAll('video, audio').forEach(media => {
            media.pause();
            media.currentTime = 0;
        });

        const visor = modalActivo.querySelector('embed[data-src]');
        if (visor) visor.removeAttribute('src');

        modalActivo.classList.remove('abierto');
        modalActivo.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-abierto');
        modalActivo = null;
    }

    // Cada tarjeta abre SU modal
    document.querySelectorAll('.btn-modal').forEach(tarjeta => {
        tarjeta.addEventListener('click', () => abrirModal(tarjeta.dataset.modal));
        // Accesible con teclado: Enter o Espacio
        tarjeta.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                abrirModal(tarjeta.dataset.modal);
            }
        });
    });

    // Cerrar con la ✕ o haciendo clic en el fondo oscuro
    document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelector('.modal-cerrar').addEventListener('click', cerrarModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModal();
        });
    });

    // Cerrar con Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarModal();
    });
});
