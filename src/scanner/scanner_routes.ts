import { Router } from "express";
import { ScannerController } from "./scanner_controller";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const scannerController: ScannerController = new ScannerController();

router.post("/api/food-scanner", upload.single("image"), async (req, res) => {
  await scannerController.foodScanner(req, res);
});

export default router;
