document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const ctx = document.getElementById('myPieChart').getContext('2d');

    // Initialize the Pie Chart
    let myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [], // Storage names
            datasets: [{
                data: [], // Percentages
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
                hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#f4b619', '#d63528'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
                borderWidth: 5// Set thinner border width
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const value = myPieChart.data.datasets[0].data[tooltipItem.dataIndex];
                            return `${myPieChart.data.labels[tooltipItem.dataIndex]}: ${value}%`;
                        }
                    }
                }
            }
        }
    });

    // Update Pie Chart based on table data
    function updatePieChart() {
        const storageData = {};
        let totalUSD = 0;

        // Aggregate total USD values per storage
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const storage = row.querySelector('.crypto-storage').value.trim();
            const totalValue = parseFloat(row.querySelector('.crypto-total').textContent) || 0;

            if (storage && totalValue > 0) {
                storageData[storage] = (storageData[storage] || 0) + totalValue;
                totalUSD += totalValue;
            }
        });

        // Calculate percentages for the Pie Chart
        const labels = Object.keys(storageData);
        const percentages = labels.map(storage => ((storageData[storage] / totalUSD) * 100).toFixed(2));

        // Update chart data
        myPieChart.data.labels = labels;
        myPieChart.data.datasets[0].data = percentages;
        myPieChart.update();
    }

    // Expose updatePieChart globally for `chart-area-demo.js`
    window.updatePieChart = updatePieChart;
    return `${myPieChart.data.labels[tooltipItem.dataIndex]}: ${value}%`;
});





