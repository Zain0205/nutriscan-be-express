export interface IUser {
  id: string;
  email: string;  
  password: String;
  name: string;
  age: number;
  height: number;
  weight: number;
  goal: string;
  goalCalories: number;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  createdAt: Date;
}

export interface IRegister {
  email: string;
  password: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: "Bulking" | "Cutting" | "Maintenance"
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IVerif {
  email: string;
  code: string;
}
