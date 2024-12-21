// Example JavaScript for header interactivity
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menuToggle');
    const menu = document.querySelector('#menu');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
});
