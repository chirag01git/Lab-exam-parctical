const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PORT = 3000;

const logFile = path.join(__dirname, 'visitors.log');
const backupFile = path.join(__dirname, 'backup.log');

const server = http.createServer((req, res) => {

    // HOME
    if (req.url === '/') {
        res.end("Visitor Log Server Running");
    }

    // VISIT ROUTE (WRITE LOG)
    else if (req.url === '/visit') {

        const log = `Visitor visited at ${new Date().toLocaleString()}\n`;

        fs.appendFile(logFile, log, (err) => {

            if (err) {
                res.end("Error writing log");
            } else {
                res.end("Visitor logged successfully");
            }

        });
    }

    // READ LOGS
    else if (req.url === '/logs') {

        fs.readFile(logFile, 'utf-8', (err, data) => {

            if (err) {
                res.end("No logs found");
            } else {
                res.end(data);
            }

        });
    }

    // COPY LOGS
    else if (req.url === '/copy-logs') {

        fs.copyFile(logFile, backupFile, (err) => {

            if (err) {
                res.end("Error copying logs");
            } else {
                res.end("Logs copied successfully");
            }

        });
    }

    // CLEAR LOGS
    else if (req.url === '/clear-logs') {

        fs.unlink(logFile, (err) => {

            if (err) {
                res.end("Error deleting logs");
            } else {
                res.end("Logs deleted successfully");
            }

        });
    }

    // SYSTEM INFO
    else if (req.url === '/system-info') {

        const systemInfo = {

            hostname: os.hostname(),

            platform: os.platform(),

            cpu_model: os.cpus()[0].model,

            cpu_cores: os.cpus().length,

            total_memory_MB: (os.totalmem() / 1024 / 1024).toFixed(2),

            free_memory_MB: (os.freemem() / 1024 / 1024).toFixed(2),

            used_memory_MB: (
                (os.totalmem() - os.freemem()) / 1024 / 1024
            ).toFixed(2),

            uptime_minutes: (os.uptime() / 60).toFixed(2)

        };

        res.writeHead(200, { "Content-Type": "application/json" });

        res.end(JSON.stringify(systemInfo, null, 2));
    }

    // INVALID ROUTE
    else {
        res.end("Route not found");
    }

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});