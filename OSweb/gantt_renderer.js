/*****************************************
 * رسم مخطط جانت على Canvas
 * (عضو الفريق: مسؤول الرسوميات)
 *****************************************/
class GanttRenderer {
    static draw(canvas, entries) {
        if (entries.length === 0) return;
        const maxTime = entries[entries.length - 1].endTime;
        const pixelsPerUnit = Math.max(30, Math.floor(600 / (maxTime || 1)));
        const width = maxTime * pixelsPerUnit + 20;
        canvas.width = width;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barHeight = 30;
        // خط الزمن
        ctx.beginPath();
        ctx.moveTo(0, barHeight + 5);
        ctx.lineTo(width, barHeight + 5);
        ctx.strokeStyle = 'black';
        ctx.stroke();

        const colors = ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#C9CBCF'];
        const colorMap = {};
        let colorIndex = 0;
        const getColor = (pid) => {
            if (pid === -1) return '#D3D3D3';
            if (!colorMap[pid]) {
                colorMap[pid] = colors[colorIndex % colors.length];
                colorIndex++;
            }
            return colorMap[pid];
        };

        entries.forEach(e => {
            const x = e.startTime * pixelsPerUnit;
            const w = (e.endTime - e.startTime) * pixelsPerUnit;
            ctx.fillStyle = getColor(e.processId);
            ctx.fillRect(x, 0, w, barHeight);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(x, 0, w, barHeight);
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            const label = e.processId === -1 ? 'Idle' : 'P' + e.processId;
            if (w > 20) ctx.fillText(label, x + 3, barHeight - 5);
        });

        for (let t = 0; t <= maxTime; t++) {
            const x = t * pixelsPerUnit;
            ctx.beginPath();
            ctx.moveTo(x, barHeight + 5 - 5);
            ctx.lineTo(x, barHeight + 5 + 5);
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.fillText(t, x - 3, barHeight + 20);
        }
    }
}