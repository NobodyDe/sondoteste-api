import { Router, Request, Response } from "express";
import { validateBody } from "../../middleware/validateDto";
import { AuthDtoSchema, AuthUserInput } from "../../dto/auth.dto";
import { cookieService } from "../../services/token.service";
import { authService } from "../../services/auth.service";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Rota de usúarios");
});

router.post(
  "/login",
  validateBody(AuthDtoSchema),
  async (req: Request<{}, {}, AuthUserInput>, res: Response) => {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "email e senha são obrigatórios" });
      return;
    }

    const user = await authService.authenticate({ email, password });
    if (!user) {
      res.status(400).json({ error: "Credenciais inválidas" });
      return;
    }

    const { accessToken, refreshToken } = cookieService.generateTokens(
      user.id,
      user,
    );
    res.cookie("accessToken", accessToken, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      path: "/auth",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).send({
      auth: true,
    });
  },
);

export default router;
