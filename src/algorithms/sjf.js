export const sjfScheduling = (processes) => {
  // Create a deep copy of the processes array to avoid mutation
  let remaining = processes.map((p) => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
  }));

  let currentTime = 0;
  const result = [];

  while (remaining.length > 0) {
    // Filter processes that have arrived at or before currentTime
    let arrived = remaining.filter((p) => p.arrivalTime <= currentTime);

    // If no process has arrived yet, jump to the next earliest arrival time
    if (arrived.length === 0) {
      const nextArrival = Math.min(...remaining.map((p) => p.arrivalTime));
      currentTime = nextArrival;
      arrived = remaining.filter((p) => p.arrivalTime <= currentTime);
    }

    // Sort by burstTime (Shortest Job First)
    // Tie-breaker 1: Arrival Time
    // Tie-breaker 2: Process ID
    arrived.sort((a, b) => {
      if (a.burstTime !== b.burstTime) {
        return a.burstTime - b.burstTime;
      }
      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime;
      }
      return a.pid.localeCompare(b.pid);
    });

    const selected = arrived[0];

    const startTime = currentTime;
    const completionTime = startTime + selected.burstTime;
    const turnaroundTime = completionTime - selected.arrivalTime;
    const waitingTime = turnaroundTime - selected.burstTime;

    currentTime = completionTime;

    result.push({
      ...selected,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    // Remove the scheduled process from the remaining pool
    remaining = remaining.filter((p) => p.pid !== selected.pid);
  }

  // Sort by startTime to return in order of execution
  return result.sort((a, b) => a.startTime - b.startTime);
};
