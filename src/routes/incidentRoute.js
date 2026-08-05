import { Router } from "express";
import { listIncidents } from "../controllers/incidentsController.js";

const router = Router();

router.get("/", listIncidents);

export default router;