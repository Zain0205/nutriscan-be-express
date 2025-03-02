import { FoodService } from "./food_service";
import { Request, Response } from "express";

export class FoodController {
  private foodService: FoodService;

  constructor(){
    this.foodService = new FoodService();
  }
  
  async getFoodLogData(req: Request, res: Response){
    try {
      const foodData = req.body;
      const userId = req.body.userId;

      const result = await this.foodService.getFoodLogData(foodData, userId);
      res.status(200).json(result);
    }catch(err){
      console.error(err);
      res.status(400).json({
        message: "Failed to get food log data"
      })
    }
  }
}
