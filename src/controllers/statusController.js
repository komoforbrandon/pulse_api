import * as statusModel from "../models/status.js"; 

export async function getStatus(req, res, next) {
  try {
    const [activeMonitors, openIncidents] = await Promise.all([
      statusModel.listUpMonitor(),
      statusModel.listActiveIncidents()
    ]);

    const composedMonitors = activeMonitors.map(monitor => ({
      id: monitor.id,
      name: monitor.name,
      url: monitor.url,
      interval_seconds: monitor.interval_seconds,
      status: 'UP',
    }));

    return res.status(200).json({
      system_status: 'System status',
      monitors: composedMonitors,
      active_incidents: openIncidents
    });

  } catch (err) {
    next(err);
  }
}
