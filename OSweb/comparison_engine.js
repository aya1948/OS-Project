class ComparisonEngine {
    static compute(rrProcesses, srtfProcesses, quantum) {
        const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
        const stdDev = (arr) => {
            const mean = avg(arr);
            return Math.sqrt(avg(arr.map(x => (x - mean) ** 2)));
        };

        const rrWT = rrProcesses.map(p => (p.completionTime - p.arrivalTime - p.burstTime));
        const rrTAT = rrProcesses.map(p => (p.completionTime - p.arrivalTime));
        const rrRT = rrProcesses.map(p => (p.startTime - p.arrivalTime));
        const srtfWT = srtfProcesses.map(p => (p.completionTime - p.arrivalTime - p.burstTime));
        const srtfTAT = srtfProcesses.map(p => (p.completionTime - p.arrivalTime));
        const srtfRT = srtfProcesses.map(p => (p.startTime - p.arrivalTime));

        const rrAvgWT = avg(rrWT), srtfAvgWT = avg(srtfWT);
        const rrAvgTAT = avg(rrTAT), srtfAvgTAT = avg(srtfTAT);
        const rrAvgRT = avg(rrRT), srtfAvgRT = avg(srtfRT);
        const rrStdTAT = stdDev(rrTAT), srtfStdTAT = stdDev(srtfTAT);

        let comp = `=== Comparison (Same Workload, Quantum = ${quantum}) ===\n\n`;
        comp += `Metric          | Round Robin   | SRTF\n`;
        comp += `Avg Waiting     | ${rrAvgWT.toFixed(2)}          | ${srtfAvgWT.toFixed(2)}\n`;
        comp += `Avg Turnaround  | ${rrAvgTAT.toFixed(2)}          | ${srtfAvgTAT.toFixed(2)}\n`;
        comp += `Avg Response    | ${rrAvgRT.toFixed(2)}          | ${srtfAvgRT.toFixed(2)}\n`;
        comp += `TAT Std Dev     | ${rrStdTAT.toFixed(2)}          | ${srtfStdTAT.toFixed(2)}   (lower = fairer)\n`;

        let concl = `=== Final Conclusion ===\n\n`;
        concl += `1. Average Waiting Time: `;
        if (rrAvgWT < srtfAvgWT) concl += `Round Robin gave better (lower) average waiting time.\n`;
        else if (srtfAvgWT < rrAvgWT) concl += `SRTF gave better average waiting time.\n`;
        else concl += `Both same.\n`;

        concl += `2. Response Time: `;
        if (rrAvgRT < srtfAvgRT) concl += `Round Robin gave faster first response.\n`;
        else if (srtfAvgRT < rrAvgRT) concl += `SRTF gave better response time.\n`;
        else concl += `Similar.\n`;

        concl += `3. Fairness: `;
        if (rrStdTAT < srtfStdTAT) concl += `Round Robin appears fairer (less variation in turnaround times).\n`;
        else concl += `SRTF shows less fairness (long jobs may starve).\n`;

        concl += `4. Effect of Quantum (RR): ${quantum}. Smaller quantum improves response but increases context switches.\n`;
        concl += `5. Short-job advantage: SRTF clearly favors short jobs; they complete much faster than in RR, which treats all lengths equally.\n`;

        concl += `\nRecommendation: `;
        if (rrAvgWT < srtfAvgWT && rrAvgRT < srtfAvgRT) {
            concl += `Round Robin is recommended for this workload.`;
        } else if (srtfAvgWT < rrAvgWT && srtfAvgRT < rrAvgRT) {
            concl += `SRTF is recommended (efficient, short jobs complete quickly).`;
        } else {
            concl += `Depends on priority: RR if fairness/response matter, SRTF if efficiency matters.`;
        }

        return { comparisonText: comp, conclusionText: concl };
    }
}