import createError from "http-errors";
import { verifyToken } from "../lib/tokens.js";

export function authorizeOperator(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(createError(401, "Authentication required"));

  try {
    const payload = verifyToken(token);
    req.operator = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    next(createError(401, "Invalid or expired token"));
  }
}
