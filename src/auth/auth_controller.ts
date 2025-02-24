import { Response, Request } from "express";
import { AuthService } from "./auth_services";

export class AuthController {
  private authService: AuthService = new AuthService();

  async register(req: Request, res: Response) {
    const data = req.body;

    try {
      const result = await this.authService.registerUser(data);
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json({
        message: "Registration failed",
      });
    }
  }
}
