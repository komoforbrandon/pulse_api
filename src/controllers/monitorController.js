import { parse } from "../lib/validate.js";
import {
  listIdSchema,
  monitorSchema,
  listMonitorSchema,
  patchMonitorSchema,
  checkListSchema,
  windowSchema,
} from "../lib/schemas.js";
import * as monitorModel from "../models/monitor.js";
import * as checkModel from "../models/check.js";
import { uptime } from "../models/uptime.js";
import createError from "http-errors";
import { Transform } from "node:stream";

export async function createMonitor(req, res, next) {
  const validateBody = parse(monitorSchema, req.body, 400);
  const operator_id = req.operator.id;

  console.log(`This is the operator_id ${operator_id}`);

  if (!operator_id) {
    return next(createError(401, "Unauthorized: Missing operator context"));
  }

  try {
    const monitor = await monitorModel.create({ operator_id, ...validateBody });
    res.status(201).json({
      message: "URL to monitor created",
      URLmonitor: monitor,
    });
  } catch (err) {
    if (err.message === "duplicate") {
      res.status(409).json({ error: "URL monitor already exitst" });
    }

    next(err);
  }
}

export async function listMonitors(req, res, next) {
  const { after, limit } = parse(listMonitorSchema, req.query, 400);
  try {
    const monitors = await monitorModel.list({ after, limit });
    res.status(200).json({
      messages: "List of URLs to monitor",
      URLmonitors: monitors,
      next_cursor: monitors.length === limit ? monitors.at(-1).id : null,
    });
  } catch (err) {
    next(err);
  }
}

export async function listById(req, res, next) {
  const { id } = parse(listIdSchema, req.params, 400);
  try {
    const monitor = await monitorModel.listById(id);
    res.status(200).json({
      messages: "URL to monitor",
      URLmonitor: monitor,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteById(req, res, next) {
  const { id } = parse(listIdSchema, req.params, 400);

  try {
    const deletedMonitor = await monitorModel.deleteById(id);

    if (!deletedMonitor) {
      return next(createError(404, "URL to Monitor not found"));
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function toggleIsActive(req, res, next) {
  const { id } = parse(listIdSchema, req.params, 400);

  const validateBody = parse(patchMonitorSchema, req.body, 400);

  try {
    const updatedMonitor = await monitorModel.updateById(id, validateBody);

    if (!updatedMonitor) {
      return next(createError(404, "URL to Monitor not found"));
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function monitorsCheck(req, res, next) {
  const { id } = parse(listIdSchema, req.params, 400);
  const { after, limit } = parse(checkListSchema, req.query, 400);

  try {
    const monitorExist = await monitorModel.listById(id);
    if (!monitorExist) {
      return next(createError(404, "Monitor not found"));
    }
    const checks = await checkModel.check({ monitor_id: id, after, limit });

    res.status(200).json({
      messages: "Monitor list check",
      checks: checks,
      next_cursor: checks.length === limit ? checks.at(-1).id : null,
    });
  } catch (err) {
    next(err);
  }
}

function createCheckToCsvTransform() {
  return new Transform({
    objectMode: true,
    transform(row, encoding, callback) {
      const time = row.checked_at ? new Date(row.checked_at).toISOString() : "";

      const errorMsg = row.error ? `"${row.error.replace(/"/g, '""')}"` : "";

      const csvLine = `${row.id},${time},${row.ok},${row.status_code ?? ""},${row.latency_ms ?? ""},${errorMsg}\n`;

      this.push(csvLine);

      callback();
    },
  });
}

export async function exportChecksCsv(req, res, next) {
  const { id } = parse(listIdSchema, req.params, 400);

  try {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="monitor-${id}-checks.csv"`,
    );

    res.write("ID,Timestamp,Is_ok,Status_Code,Latency_Ms,Error\n");

    const dbStream = await checkModel.streamChecksByMonitorId(id);

    const csvFormatter = createCheckToCsvTransform();

    dbStream.pipe(csvFormatter).pipe(res);

    dbStream.on("error", (err) => next(err));
    csvFormatter.on("error", (err) => next(err));
  } catch (err) {
    next(err);
  }
}

export async function getMonitorUptimeStats(req, res, next) {
  const { id } = parse(listIdSchema, req.params, 400);
  const { window } = parse(windowSchema, req.query, 400);

  try {
    const monitorExist = await monitorModel.listById(id);

    if (!monitorExist) {
      return next(createError(404, 'URL Monitor not found'));
    }

    const stats = uptime({ monitor_id: id, windowString: window });

    res.status(200).json({
      message: 'Monitor uptime stats',
      window_requested: window,
      metrics: stats
    });
  } catch (err) {
    next(err);
  }
}
