import createHttpError from "http-errors";
import { config } from "../config.js";

export function parse(schema, input, status = 400) {
  const result = schema.safeParse(input);

  if (!result.success) {
    const isValidationError = status >= 400 && status < 500;

    const message = isValidationError
      ? "Validation Error"
      : "Internal Server Error";

    const detail = isValidationError
      ? result.error.issues.map((issue) => ({
          field: issue.path.join(".") || "(body)",
          message: issue.message,
        }))
      : config.NODE_ENV === "development"
        ? result.error.issues
        : undefined;

    throw createHttpError(status, { message, detail });
  }

  return result.data;
}