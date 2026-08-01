import { Router } from "express";
import * as monitorController from "../controllers/monitorController.js";
import { authorizeOperator } from "../middlewares/authMiddleware.js";

const router = Router({ mergeParams: true }); 

router.post("/", authorizeOperator, monitorController.createMonitor);

router.get("/", monitorController.listMonitors)

router.get("/:id", monitorController.listById)

router.delete("/:id", authorizeOperator, monitorController.deleteById)

router.patch("/:id", monitorController.toggleIsActive)

router.get(":id/checks", monitorController.monitorsCheck)

export default router;
