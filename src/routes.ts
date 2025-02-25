import express, { Request, Response } from "express";
import authRoutes from "./auth/auth_routes"
import scannerRoutes from "./scanner/scanner_routes"

const router = express.Router();

router.get("/api/check", (req: Request, res: Response) => {
  res.send("Server is up and running");
});

router.use(authRoutes);
router.use(scannerRoutes);

export default router;
