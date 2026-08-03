import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const router = Router();

const specPath = fileURLToPath(
  new URL("../../docs/openapi.yaml", import.meta.url),
);

const spec = YAML.parse(readFileSync(specPath, "utf8"));

const swaggerHandler = swaggerUi.setup(spec);

router.use("/", swaggerUi.serve);
router.get("/", swaggerHandler);

export default router;
