import { prisma } from "../../prisma/PrismaClient";
import { EmailService } from "../email/email_service";
import { IUser, IRegister } from "./auth_interface";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  private emailService: EmailService = new EmailService();
  private readonly JWT_SECRET: string = process.env.JWT_SECRET || "";

  private verificationCodeGenerator(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async registerUser(data: IRegister) {
    console.log(data);
    try {
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const verificationCode = this.verificationCodeGenerator();
      const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          age: data.age,
          goal: data.goal,
          height: data.height,
          weight: data.weight,
          verificationCode: verificationCode,
        },
      });

      await this.emailService.sendVerificationEmail(data.email, verificationCode);

      return {
        message: "User registered successfully",
        email: user.email,
      };
    } catch (err) {
      throw err;
    }
  }
}
