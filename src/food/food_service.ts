import { prisma } from "../../prisma/PrismaClient";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { IFood } from "./food_interface";

export class FoodService {
  async createFoodData(foodData: IFood): Promise<IFood> {
    return prisma.food.create({
      data: {
        name: foodData.name,
        calories: foodData.calories,
        protein: foodData.protein,
        fat: foodData.fat,
        carbs: foodData.carbs,
        servingSize: foodData.servingSize,
      },
    });
  }

  async getFoodLogData(foodData: any, userId: number) {
    try {
      const newFoodData = await this.createFoodData(foodData);

      const totalCal: number = newFoodData.calories;
      const totalProtein: number = newFoodData.protein;
      const totalFat: number = newFoodData.fat;
      const totalCarbs: number = newFoodData.carbs;

      const newFoodLogData = await prisma.foodLog.create({
        data: {
          userId: userId,
          foodId: newFoodData.id,
          totalCal: totalCal,
          totalProtein: totalProtein,
          totalFat: totalFat,
          totalCarbs: totalCarbs,
          quantity: 1,
        },
      });

      return {
        food: newFoodData,
        log: newFoodLogData,
      };
    } catch (err) {
      throw err;
    }
  }

  async getDailyFoodLog(req: AuthenticatedRequest) {
    try {
      const userId = req.user.id;
      const { date } = req.params;

      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999);

      const foodLogDataResult = await prisma.foodLog.findMany({
        where:{
          userId: userId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          food: true,
        },
      })

      return foodLogDataResult;

    } catch (err) {
      throw err;
    }
  }
  async getWeeklyFoodLog() {}
  async getMonthlyFoodLog() {}
}
