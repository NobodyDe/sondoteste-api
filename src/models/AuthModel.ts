import { db } from "../db/pg";
import UserProps from "../types/user";

const AuthModels = {
  async verifyEmail(email: string): Promise<UserProps | null> {
    const query = `SELECT id, name, email, password, create_at FROM users WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result.rows[0] ?? null;
  },
};

export default AuthModels;
