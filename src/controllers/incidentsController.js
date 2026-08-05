import { list } from "../models/incident.js";
import { parse } from "../lib/validate.js";
import { listMonitorSchema } from "../lib/schemas.js";

export async function listIncidents(req, res, next) {
  const { after, limit } = parse(listMonitorSchema, req.query, 400);
  try {
    const incidents = await list({after, limit});
    res.status(200).json({
      messages: "List of incidents",
      incidents: incidents,
    });
  } catch (err) {
    next(err);
  }
}
