// JavaScript for Crypto Portfolio Tracker

// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetSection = document.querySelector(this.getAttribute('href'));
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Example: Dynamic content loading (analytics data simulation)
function loadAnalytics() {
    const analyticsSection = document.getElementById('analytics');
    const analyticsContent = document.createElement('div');
    analyticsContent.innerHTML = `
        <p>Your portfolio increased by <strong>15%</strong> this week!</p>
        <p>Top performer: <strong>Bitcoin (BTC)</strong></p>
    `;
    analyticsSection.appendChild(analyticsContent);
}

// Load analytics data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAnalytics();
});
