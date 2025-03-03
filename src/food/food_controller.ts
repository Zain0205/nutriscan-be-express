import { FoodService } from "./food_service";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export class FoodController {
  private foodService: FoodService;

  constructor() {
    this.foodService = new FoodService();
  }

  async getFoodLogData(req: AuthenticatedRequest, res: Response) {
    try {
      const foodData = req.body;
      const userId = req.user.id;

      const result = await this.foodService.getFoodLogData(foodData, userId);
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json({
        message: "Failed to get food log data",
      });
    }
  }

  async getDailyFoodLog(req: AuthenticatedRequest, res: Response) {
    try {

    } catch (err) {
      console.error(err);
      res.status(400).json({
        message: "Failed to get daily food log",
      });
    }
  }
}
