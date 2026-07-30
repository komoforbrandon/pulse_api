import createHttpError from "http-errors";
import { config } from "../config.js";

export function parse(schema, input, status = 400) {
  const result = schema.safeParse(input);
  if (!result.success) {
    const detail =
      config.NODE_ENV === "development"
        ? result.error.issues.map((issue) => ({
            field: issue.path.join(",") || "(body)",
            message: issue.message,
          }))
        : undefined;

    return result.data;
  }
}
