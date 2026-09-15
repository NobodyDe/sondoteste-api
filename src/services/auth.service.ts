import bcrypt from "bcryptjs";
import AuthModels from "../models/AuthModel";
import UserProps from "../types/user";

export const authService = {
  async authenticate({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<UserProps | null> {
    const fullUser = await AuthModels.verifyEmail(email);

    if (!fullUser) {
      return null; // email não encontrado (mas não diga isso ao cliente!)
    }

    const { password: storedPassword, ...user } = fullUser;

    if (typeof storedPassword !== "string") {
      return null;
    }

    const matchPassword = await bcrypt.compare(
      password,
      storedPassword,
    );

    if (!matchPassword) {
      return null; // autenticação falhou
    }

    return user;
  },
};
