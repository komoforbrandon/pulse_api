import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";
import { rateLimit } from "express-rate-limit";
import authRoute from "./routes/authRoute.js";
export function createApp() {
  const app = express();

  if (config.NODE_ENV === "development") app.set("trust proxy", 1);

  app.use(helmet({ contentSecurityPolicy: false }));

  app.use(cors({ origin: config.CORS_ORIGIN }));

  app.use(pinoHttp({ logger }));

  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: config.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      status: "ok",
      message: "Welcome to Pulse: Uptime monitor & Public status page API",
      Docs: "/docs",
      Health: "/health",
    });
  });

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/auth", authRoute);

  return app;
}

export { config };
