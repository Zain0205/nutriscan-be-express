import { Request, Response } from "express";
import { ScannerService } from "./scanner_service";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export class ScannerController {
  private scannerService: ScannerService = new ScannerService(process.env.GOOGLE_AI_API_KEY);

  async foodScanner(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const analysResponse = await this.scannerService.foodScanner(req.file);
      res.json(analysResponse);
    } catch (err) {
      console.error(err);
      res.status(400).json({
        message: "Food scanning failed",
      });
    }
  }
}