import { prisma } from "../../prisma/PrismaClient";
import { EmailService } from "../email/email_service";
import { IUser, IRegister, ILogin, IVerif } from "./auth_interface";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  private emailService: EmailService = new EmailService();
  private readonly JWT_SECRET: string = process.env.JWT_SECRET || "";

  private verificationCodeGenerator(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async registerUser(data: IRegister) {
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

  async loginUser(data: ILogin) {
    try {
      const user = await prisma.user.findUnique({ where: { email: data.email } });

      if (!user) throw new Error("User not found");
      if (!user.isVerified) throw new Error("User not verified");

      const passwordMatch = await bcrypt.compare(data.password, user.password);

      if (!passwordMatch) throw new Error("Invalid password");

      const token = jwt.sign({ id: user.id }, this.JWT_SECRET, { expiresIn: "24h" });

      return {
        message: "User logged in successfully",
        token: token,
      };
    } catch (err) {
      throw err;
      console.error(err);
    }
  }

  async emailVerification(data: any) {
    try {
      const user = await prisma.user.findUnique({ where: { email: data.email } });

      if (!user) throw new Error("User not found");
      if (user.isVerified) throw new Error("User already verified");
      if (user.verificationCode !== data.code) throw new Error("Invalid verification code");

      const updatedUser = await prisma.user.update({
        where: { email: data.email },
        data: {
          isVerified: true,
          verificationCode: null,
        },
      })

      const token = jwt.sign({ id: updatedUser.id }, this.JWT_SECRET, { expiresIn: "24h" });

      return {
        message: "User verified successfully",
        token: token,
      };
    } catch (err) {
      throw err;
      console.error(err);
    }
  }
}
