import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/check", (req: Request, res: Response) => {
  res.send("Server is up and running");
});

export default router;
