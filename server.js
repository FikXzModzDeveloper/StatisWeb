const express = require('express');
const path = require('path');
const os = require('os');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/fullStats', (req, res) => {
    const uptimeRaw = process.uptime();
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const memPercentage = (usedMem / totalMem) * 100;

    res.json({
        uptime: uptimeRaw,
        cpuLoad: (Math.random() * 30 + 10).toFixed(2),
        ramUsage: memPercentage.toFixed(2),
        diskUsage: (Math.random() * 20 + 40).toFixed(2),
        networkIn: (Math.random() * 500).toFixed(1),
        networkOut: (Math.random() * 200).toFixed(1),
        activeRequests: Math.floor(Math.random() * 50),
        serverStatus: 'Operational',
        databaseLatency: Math.floor(Math.random() * 30) + 'ms'
    });
});

app.listen(port, () => {
    console.log('Terminal: Monitor Active on Port ' + port);
});
