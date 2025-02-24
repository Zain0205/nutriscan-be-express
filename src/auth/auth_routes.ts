import { Router } from "express";
import { AuthController } from "./auth_controller";

const router = Router();
const authController = new AuthController();

router.post("/api/register", (req, res) => authController.register(req, res));

export default router;
