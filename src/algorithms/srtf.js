export const srtfScheduling = (processes) => {
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

  const result = [];
  const timeline = [];
  const ticks = [];
  let remaining = [...list];
  let t = 0;
  let running = null;

  while (remaining.length > 0) {
    const arrived = remaining.filter((p) => p.arrivalTime <= t);

    let selected = null;
    if (arrived.length > 0) {
      // Choose process with minimum remaining time
      arrived.sort((a, b) => {
        if (a.remainingTime !== b.remainingTime) {
          return a.remainingTime - b.remainingTime;
        }
        if (a.arrivalTime !== b.arrivalTime) {
          return a.arrivalTime - b.arrivalTime;
        }
        return a.pid.localeCompare(b.pid);
      });
      selected = arrived[0];
    }

    running = selected;

    // Capture ready queue state (excluding running process)
    const readyQueue = remaining
      .filter((p) => p.arrivalTime <= t && p !== running)
      .sort((a, b) => {
        if (a.remainingTime !== b.remainingTime) {
          return a.remainingTime - b.remainingTime;
        }
        if (a.arrivalTime !== b.arrivalTime) {
          return a.arrivalTime - b.arrivalTime;
        }
        return a.pid.localeCompare(b.pid);
      })
      .map((p) => p.pid);

    const completed = list
      .filter((p) => p.remainingTime === 0)
      .map((p) => p.pid);

    const processStates = {};
    const remainingBursts = {};
    list.forEach((p) => {
      remainingBursts[p.pid] = p.remainingTime;
      if (p.remainingTime === 0) {
        processStates[p.pid] = "completed";
      } else if (running && p.pid === running.pid) {
        processStates[p.pid] = "running";
      } else if (p.arrivalTime <= t) {
        processStates[p.pid] = "ready";
      } else {
        processStates[p.pid] = "not_arrived";
      }
    });

    ticks.push({
      tick: t,
      running: running ? running.pid : null,
      readyQueue,
      completed,
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

      if (running.remainingTime === 0) {
        running.completionTime = t + 1;
        running.turnaroundTime = running.completionTime - running.arrivalTime;
        running.waitingTime = running.turnaroundTime - running.burstTime;
        result.push(running);
        remaining = remaining.filter((p) => p.pid !== running.pid);
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
      const finished = result.find((r) => r.pid === p.pid);
      return finished || p;
    }),
    timeline,
    ticks,
  };
};
