import jwt, { SignOptions, Secret } from "jsonwebtoken";
import UserProps from "../types/user";

type TokenDuration = NonNullable<SignOptions["expiresIn"]>;

const getSecret = (name: string): Secret => {
  const secret = process.env[name] || process.env.TOKEN_KEY_HASH;

  if (!secret) {
    throw new Error(`${name} ou TOKEN_KEY_HASH não está definida no .env`);
  }

  return secret;
};

export const cookieService = {
  generateAccessToken(payload: UserProps, expireAt: TokenDuration) {
    return jwt.sign(payload, getSecret("JWT_SECRET"), {
      expiresIn: expireAt,
    });
  },
  generateRefreshToken(userId: string, expireAt: TokenDuration) {
    return jwt.sign({ sub: userId }, getSecret("JWT_REFRESH_SECRET"), {
      expiresIn: expireAt,
    });
  },
  generateTokens(userId: string, payload: UserProps) {
    return {
      accessToken: this.generateAccessToken(payload, "30m"),
      refreshToken: this.generateRefreshToken(userId, "30d"),
    };
  },
};
