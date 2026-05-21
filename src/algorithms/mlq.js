export const mlqScheduling = (processes) => {
  let list = processes.map((p) => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
    remainingTime: Number(p.burstTime),
    queue: p.queue !== undefined ? Number(p.queue) : 1, // 1: High (RR), 2: Low (FCFS)
    startTime: undefined,
    completionTime: undefined,
    turnaroundTime: undefined,
    waitingTime: undefined,
    responseTime: undefined,
  }));

  let q1 = []; // High Priority Ready Queue (RR)
  let q2 = []; // Low Priority Ready Queue (FCFS)
  let t = 0;
  let running = null;
  let runningQueue = null; // 1 or 2
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
        if (p.queue === 1) {
          q1.push(p);
        } else {
          q2.push(p);
        }
        queued.add(p.pid);
      }
    });
  };

  queueArrivals(0);

  while (completedList.length < list.length) {
    // If CPU is idle and both queues empty, jump time
    if (!running && q1.length === 0 && q2.length === 0) {
      const unarrived = remaining.filter((p) => !queued.has(p.pid));
      if (unarrived.length > 0) {
        const nextArrival = Math.min(...unarrived.map((p) => p.arrivalTime));
        while (t < nextArrival) {
          ticks.push({
            tick: t,
            running: null,
            readyQueue: { q1: [], q2: [] },
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

    // Check for preemption: if running process is from Q2 but Q1 has processes, preempt
    if (running && runningQueue === 2 && q1.length > 0) {
      const preempted = running;
      running = null;
      q2.unshift(preempted); // Put Q2 process back at the front of Q2
    }

    // Start next process if idle
    if (!running) {
      if (q1.length > 0) {
        running = q1.shift();
        runningQueue = 1;
        quantumTracker = 0;
      } else if (q2.length > 0) {
        running = q2.shift();
        runningQueue = 2;
      }
    }

    // Capture state
    const q1Pids = q1.map((p) => p.pid);
    const q2Pids = q2.map((p) => p.pid);
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
      readyQueue: { q1: q1Pids, q2: q2Pids },
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
      if (runningQueue === 1) {
        quantumTracker += 1;
      }

      if (running.remainingTime === 0) {
        running.completionTime = t + 1;
        running.turnaroundTime = running.completionTime - running.arrivalTime;
        running.waitingTime = running.turnaroundTime - running.burstTime;
        completedList.push(running);
        running = null;
        queueArrivals(t + 1);
      } else if (runningQueue === 1 && quantumTracker === 2) {
        // RR quantum expired for Q1 process
        const preempted = running;
        running = null;
        queueArrivals(t + 1);
        q1.push(preempted);
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
    readyQueue: { q1: [], q2: [] },
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
