class Process {
    constructor(id, arrivalTime, burstTime) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.startTime = null;
        this.completionTime = null;
        this.started = false;
    }
}

class GanttEntry {
    constructor(processId, startTime, endTime) {
        this.processId = processId; // -1 للـ Idle
        this.startTime = startTime;
        this.endTime = endTime;
    }
}