let monitorChart;
const chartCtx = document.getElementById('liveChart').getContext('2d');

const setupChart = () => {
    monitorChart = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                data: Array(20).fill(0),
                borderColor: '#0052ff',
                borderWidth: 3,
                pointRadius: 0,
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { 
                    beginAtZero: true,
                    grid: { color: '#f0f0f0' }
                }
            }
        }
    });
};

const refreshData = async () => {
    try {
        const response = await fetch('/api/fullStats');
        const stats = await response.json();

        document.getElementById('cpuPercent').innerText = stats.cpuLoad + '%';
        document.getElementById('ramPercent').innerText = stats.ramUsage + '%';
        document.getElementById('diskPercent').innerText = stats.diskUsage + '%';
        
        document.getElementById('cpuBar').style.width = stats.cpuLoad + '%';
        document.getElementById('ramBar').style.width = stats.ramUsage + '%';
        document.getElementById('diskBar').style.width = stats.diskUsage + '%';

        document.getElementById('dbLatency').innerText = stats.databaseLatency;
        document.getElementById('requestCount').innerText = stats.activeRequests;

        const h = Math.floor(stats.uptime / 3600);
        const m = Math.floor((stats.uptime % 3600) / 60);
        const s = Math.floor(stats.uptime % 60);
        document.getElementById('uptimeText').innerText = 
            `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        pushChartData(stats.cpuLoad);
    } catch (err) {
        writeLog('Error fetching telemetry data');
    }
};

const pushChartData = (val) => {
    monitorChart.data.datasets[0].data.shift();
    monitorChart.data.datasets[0].data.push(val);
    monitorChart.update('none');
};

const writeLog = (msg) => {
    const wrapper = document.getElementById('logWrapper');
    const entry = document.createElement('div');
    entry.className = 'logEntry';
    entry.innerText = `> ${new Date().toLocaleTimeString()} : ${msg}`;
    wrapper.prepend(entry);
    
    if (wrapper.children.length > 8) {
        wrapper.lastElementChild.remove();
    }
};

setupChart();
setInterval(refreshData, 1000);
setInterval(() => writeLog('Heartbeat signal stable'), 10000);
setInterval(() => writeLog('Cache cleared automatically'), 25000);

