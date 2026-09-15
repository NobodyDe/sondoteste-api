import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateBody = <T extends z.ZodType>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten().fieldErrors, // formato { campo: ["mensagem"] }
      });
    }

    // Sobrescreve o body com os dados já parseados e limpos pelo Zod
    req.body = result.data;
    return next();
  };
};
