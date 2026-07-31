import { parse } from "../lib/validate.js";
import {
  listIdSchema,
  monitorSchema,
  listMonitorSchema,
  patchMonitorSchema,
} from "../lib/schemas.js";
import * as monitorModel from "../models/monitor.js";
import createError from "http-errors";

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
    const updatedMonitor = await monitorModel.updateById(id, validateBody)
     
    if(!updatedMonitor) {
      return next(createError(404, "URL to Monitor not found"));
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
