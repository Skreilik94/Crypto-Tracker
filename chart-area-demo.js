// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}



document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('table-body'); // Table containing rows
  const ctx = document.getElementById('myAreaChart').getContext('2d');

  // Initialize Area Chart
  const myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: [], // Dynamic months
          datasets: [{
              label: "Portfolio Value (Cumulative)",
              lineTension: 0.3,
              backgroundColor: "rgba(78, 115, 223, 0.05)",
              borderColor: "rgba(78, 115, 223, 1)",
              pointRadius: 3,
              pointBackgroundColor: "rgba(78, 115, 223, 1)",
              pointBorderColor: "rgba(78, 115, 223, 1)",
              pointHoverRadius: 3,
              pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
              pointHoverBorderColor: "rgba(78, 115, 223, 1)",
              pointHitRadius: 10,
              pointBorderWidth: 2,
              data: [], // Dynamic cumulative values
          }],
      },
      options: {
          maintainAspectRatio: false,
          layout: {
              padding: {
                  left: 10,
                  right: 25,
                  top: 25,
                  bottom: 0
              }
          },
          scales: {
              xAxes: [{
                  time: {
                      unit: 'date'
                  },
                  gridLines: {
                      display: false,
                      drawBorder: false
                  },
                  ticks: {
                      maxTicksLimit: 7
                  }
              }],
              yAxes: [{
                  ticks: {
                      maxTicksLimit: 5,
                      padding: 10,
                      callback: function(value) {
                          return '$' + number_format(value);
                      }
                  },
                  gridLines: {
                      color: "rgb(234, 236, 244)",
                      zeroLineColor: "rgb(234, 236, 244)",
                      drawBorder: false,
                      borderDash: [2],
                      zeroLineBorderDash: [2]
                  }
              }],
          },
          legend: {
              display: false
          },
          tooltips: {
              backgroundColor: "rgb(255,255,255)",
              bodyFontColor: "#858796",
              titleMarginBottom: 10,
              titleFontColor: '#6e707e',
              titleFontSize: 14,
              borderColor: '#dddfeb',
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: false,
              intersect: false,
              mode: 'index',
              caretPadding: 10,
              callbacks: {
                  label: function(tooltipItem, chart) {
                      var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                      return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
                  }
              }
          }
      }
  });

  // Function to update the Area Chart dynamically
  function updateAreaChart() {
      const currentDate = new Date();
      const startMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1); // Start from one month before current month
      const months = [];

      // Generate dynamic month labels
      for (let i = 0; i < 12; i++) {
          const month = new Date(startMonth.getFullYear(), startMonth.getMonth() + i);
          months.push(month.toLocaleString('default', { month: 'short', year: 'numeric' }));
      }

      // Initialize cumulative totals
      const cumulativeTotals = Array(12).fill(0);

      // Iterate through all rows in the table
      const rows = tableBody.querySelectorAll('tr');
      rows.forEach((row) => {
          const dateInput = row.querySelector('.crypto-date').value;
          const totalValue = parseFloat(row.querySelector('.crypto-total').textContent) || 0;

          if (dateInput && totalValue > 0) {
              const date = new Date(dateInput);

              // Add the value to all months from the given date onwards (cumulative sum)
              months.forEach((monthLabel, index) => {
                  const monthDate = new Date(startMonth.getFullYear(), startMonth.getMonth() + index);
                  if (date <= monthDate) {
                      cumulativeTotals[index] += totalValue;
                  }
              });
          }
      });

      // Update the chart's data
      myLineChart.data.labels = months;
      myLineChart.data.datasets[0].data = cumulativeTotals;
      myLineChart.update();
  }

  // Add event listeners to dynamically update the chart
  tableBody.addEventListener('input', updateAreaChart); // Trigger on input change
  tableBody.addEventListener('change', updateAreaChart); // Trigger on date changes or other edits
  tableBody.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('remove-row-btn')) {
          e.target.closest('tr').remove(); // Remove the row
          updateAreaChart(); // Update the chart
      }
  });
});
