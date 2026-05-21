export const rrScheduling = (processes, timeQuantum = 2) => {
  let list = processes.map((p) => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
    remainingTime: Number(p.burstTime),
    startTime: undefined,
    completionTime: undefined,
    turnaroundTime: undefined,
    waitingTime: undefined,
    responseTime: undefined,
  }));

  let q = [];
  let t = 0;
  let running = null;
  let quantumTracker = 0;
  let remaining = [...list];
  let completedList = [];
  const timeline = [];
  const ticks = [];

  // Sort initial list by arrival, then PID
  remaining.sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.pid.localeCompare(b.pid);
  });

  let queued = new Set();

  // Helper to queue newly arrived processes
  const queueArrivals = (time) => {
    remaining.forEach((p) => {
      if (
        p.arrivalTime <= time &&
        !queued.has(p.pid) &&
        p !== running &&
        !completedList.some((c) => c.pid === p.pid)
      ) {
        q.push(p);
        queued.add(p.pid);
      }
    });
  };

  // First queue at time 0
  queueArrivals(0);

  while (completedList.length < list.length) {
    // If CPU is idle and nothing in queue, jump time or wait
    if (!running && q.length === 0) {
      const unarrived = remaining.filter((p) => !queued.has(p.pid));
      if (unarrived.length > 0) {
        const nextArrival = Math.min(...unarrived.map((p) => p.arrivalTime));
        while (t < nextArrival) {
          ticks.push({
            tick: t,
            running: null,
            readyQueue: [],
            completed: completedList.map((c) => c.pid),
            processStates: list.reduce((acc, p) => {
              acc[p.pid] = completedList.some((c) => c.pid === p.pid)
                ? "completed"
                : "not_arrived";
              return acc;
            }, {}),
            remainingBursts: list.reduce((acc, p) => {
              acc[p.pid] = p.remainingTime;
              return acc;
            }, {}),
          });
          t++;
        }
        queueArrivals(t);
      } else {
        break;
      }
    }

    // Start a new process if idle
    if (!running && q.length > 0) {
      running = q.shift();
      quantumTracker = 0;
    }

    // Capture state
    const readyQueuePids = q.map((p) => p.pid);
    const completedPids = completedList.map((p) => p.pid);
    const processStates = {};
    const remainingBursts = {};

    list.forEach((p) => {
      const orig =
        remaining.find((r) => r.pid === p.pid) ||
        completedList.find((c) => c.pid === p.pid);
      remainingBursts[p.pid] = orig.remainingTime;
      if (orig.remainingTime === 0) {
        processStates[p.pid] = "completed";
      } else if (running && p.pid === running.pid) {
        processStates[p.pid] = "running";
      } else if (queued.has(p.pid)) {
        processStates[p.pid] = "ready";
      } else {
        processStates[p.pid] = "not_arrived";
      }
    });

    ticks.push({
      tick: t,
      running: running ? running.pid : null,
      readyQueue: readyQueuePids,
      completed: completedPids,
      processStates,
      remainingBursts,
    });

    if (running) {
      if (running.startTime === undefined) {
        running.startTime = t;
        running.responseTime = t - running.arrivalTime;
      }

      // Add to timeline
      if (timeline.length > 0 && timeline[timeline.length - 1].pid === running.pid) {
        timeline[timeline.length - 1].completionTime = t + 1;
      } else {
        timeline.push({
          pid: running.pid,
          startTime: t,
          completionTime: t + 1,
        });
      }

      running.remainingTime -= 1;
      quantumTracker += 1;

      if (running.remainingTime === 0) {
        running.completionTime = t + 1;
        running.turnaroundTime = running.completionTime - running.arrivalTime;
        running.waitingTime = running.turnaroundTime - running.burstTime;
        completedList.push(running);
        running = null;
        queueArrivals(t + 1);
      } else if (quantumTracker === timeQuantum) {
        const preempted = running;
        running = null;
        queueArrivals(t + 1);
        q.push(preempted);
      } else {
        queueArrivals(t + 1);
      }
    }

    t++;
  }

  // Final snapshot
  ticks.push({
    tick: t,
    running: null,
    readyQueue: [],
    completed: list.map((p) => p.pid),
    processStates: list.reduce((acc, p) => {
      acc[p.pid] = "completed";
      return acc;
    }, {}),
    remainingBursts: list.reduce((acc, p) => {
      acc[p.pid] = 0;
      return acc;
    }, {}),
  });

  return {
    processes: list.map((p) => {
      const finished = completedList.find((r) => r.pid === p.pid);
      return finished || p;
    }),
    timeline,
    ticks,
  };
};
