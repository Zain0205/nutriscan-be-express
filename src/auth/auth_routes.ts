import { Router } from "express";
import { AuthController } from "./auth_controller";

const router = Router();
const authController = new AuthController();

router.post("/api/register", (req, res) => authController.register(req, res));
router.post("/api/login", (req, res) => authController.login(req, res));
router.post("/api/verification", (req, res) => authController.verification(req, res));

export default router;
