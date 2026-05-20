export const fcfsScheduling = (processes) => {
  const sorted = [...processes].sort(
    (a, b) => a.arrivalTime - b.arrivalTime
  );

  let currentTime = 0;

  const result = sorted.map((p) => {
    const startTime = Math.max(currentTime, p.arrivalTime);

    const completionTime = startTime + p.burstTime;

    const turnaroundTime = completionTime - p.arrivalTime;

    const waitingTime = turnaroundTime - p.burstTime;

    currentTime = completionTime;

    return {
      ...p,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    };
  });

  return result;
};