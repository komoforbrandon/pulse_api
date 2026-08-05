import { checkSingleMonitor } from "./controllers/schedulerController.js";
import { schedulerModel, addCheck } from "./models/schedulerModel.js";
import { logger } from "./lib/logger.js";

async function runSchedulerTick() {
  const dueMonitors = await schedulerModel();
  if (dueMonitors.length === 0) return;
  logger.info(`[Scheduler] Found ${dueMonitors.length} monitors to check.`);

  const checkPromises = dueMonitors.map(async (monitor) => {
    try {
      const data = await checkSingleMonitor(monitor);
      await addCheck(data);
      logger.info(data);
    } catch (err) {
      logger.error(`[Scheduler] Worker failure for ID ${monitor.id}:${err.message}`);
    }
  });

  await Promise.all(checkPromises)
}

export function initScheduler(intervalMs = 10000) {
    logger.info(`🚀 Scheduling Engine initialized. Checking due targets every ${intervalMs / 1000} seconds...`);
    runSchedulerTick();
    setInterval(()=>{
        runSchedulerTick();
    }, intervalMs);
}