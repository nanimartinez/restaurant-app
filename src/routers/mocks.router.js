import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

// Endpoint para generar 50 usuarios falsos (sin guardarlos en DB)
router.get('/mockingusers', mocksController.getMockedUsers);

// Endpoint para generar e insertar datos en la DB
router.post('/generateData', mocksController.generateDataForDB);

export default router;