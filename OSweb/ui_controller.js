const UI = {
    processList: [],

    addProcess() {
        const pid = document.getElementById('pid').value.trim();
        const arr = document.getElementById('arrival').value.trim();
        const burst = document.getElementById('burst').value.trim();

        if (!pid || !arr || !burst) { alert('All fields must be filled.'); return; }
        const id = parseInt(pid), arrival = parseInt(arr), burstTime = parseInt(burst);
        if (isNaN(id) || isNaN(arrival) || isNaN(burstTime)) { alert('All inputs must be numeric.'); return; }
        if (arrival < 0) { alert('Arrival time cannot be negative.'); return; }
        if (burstTime <= 0) { alert('Burst time must be greater than 0.'); return; }
        if (this.processList.some(p => p.id === id)) { alert('Process ID must be unique.'); return; }

        this.processList.push(new Process(id, arrival, burstTime));
        this.updateTable();
        document.getElementById('pid').value = '';
        document.getElementById('arrival').value = '';
        document.getElementById('burst').value = '';
    },

    updateTable() {
        const tbody = document.querySelector('#processTable tbody');
        tbody.innerHTML = '';
        this.processList.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${p.id}</td><td>${p.arrivalTime}</td><td>${p.burstTime}</td>`;
            tbody.appendChild(tr);
        });
    },

    clearAll() {
        this.processList = [];
        this.updateTable();
        document.getElementById('quantum').value = '';
        ['rrCanvas','srtfCanvas'].forEach(id => {
            const canvas = document.getElementById(id);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        });
        document.getElementById('rrTableContainer').innerHTML = '';
        document.getElementById('srtfTableContainer').innerHTML = '';
        document.getElementById('rrQueueLog').innerHTML = '';
        document.getElementById('comparisonSummary').innerHTML = '';
        document.getElementById('conclusion').innerHTML = '';
    },

    runSimulation() {
        if (this.processList.length === 0) { alert('Add at least one process.'); return; }
        const qVal = document.getElementById('quantum').value.trim();
        if (!qVal) { alert('Enter a time quantum.'); return; }
        const quantum = parseInt(qVal);
        if (isNaN(quantum) || quantum <= 0) { alert('Quantum must be a positive integer.'); return; }

        const rrScheduler = new SchedulerRR(this.processList, quantum);
        const rrResult = rrScheduler.simulate();
        const srtfScheduler = new SchedulerSRTF(this.processList);
        const srtfResult = srtfScheduler.simulate();

        GanttRenderer.draw(document.getElementById('rrCanvas'), rrResult.gantt);
        GanttRenderer.draw(document.getElementById('srtfCanvas'), srtfResult.gantt);

        this.renderMetricsTable('rrTableContainer', rrResult.processes);
        this.renderMetricsTable('srtfTableContainer', srtfResult.processes);

        const logDiv = document.getElementById('rrQueueLog');
        logDiv.innerHTML = rrResult.log.map(entry => `<div>${entry}</div>`).join('');

        const { comparisonText, conclusionText } = ComparisonEngine.compute(
            rrResult.processes, srtfResult.processes, quantum
        );
        document.getElementById('comparisonSummary').innerText = comparisonText;
        document.getElementById('conclusion').innerText = conclusionText;
    },

    renderMetricsTable(containerId, processes) {
        let html = `<table class="results-table">
            <tr><th>ID</th><th>Arrival</th><th>Burst</th><th>WT</th><th>TAT</th><th>RT</th></tr>`;
        let totalWT = 0, totalTAT = 0, totalRT = 0;
        processes.forEach(p => {
            const tat = p.completionTime - p.arrivalTime;
            const wt = tat - p.burstTime;
            const rt = p.startTime - p.arrivalTime;
            totalWT += wt; totalTAT += tat; totalRT += rt;
            html += `<tr><td>${p.id}</td><td>${p.arrivalTime}</td><td>${p.burstTime}</td>
                     <td>${wt}</td><td>${tat}</td><td>${rt}</td></tr>`;
        });
        const n = processes.length;
        html += `<tr><td colspan="3"><b>Averages</b></td>
                 <td><b>${(totalWT/n).toFixed(2)}</b></td>
                 <td><b>${(totalTAT/n).toFixed(2)}</b></td>
                 <td><b>${(totalRT/n).toFixed(2)}</b></td></tr>`;
        html += `</table>`;
        document.getElementById(containerId).innerHTML = html;
    }
};

function addProcess() { UI.addProcess(); }
function runSimulation() { UI.runSimulation(); }
function clearAll() { UI.clearAll(); }