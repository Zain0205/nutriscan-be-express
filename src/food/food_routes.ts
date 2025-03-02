import { Router } from "express";
import { FoodController } from "./food_controller";

const router = Router();
const foodController: FoodController = new FoodController();

router.post("/api/food-log", (req, res) => foodController.getFoodLogData(req, res));

export default router;