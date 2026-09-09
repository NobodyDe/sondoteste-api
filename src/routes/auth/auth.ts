import { Router, Request, Response } from "express";
import { validateBody } from "../../middleware/validateDto";
import { AuthDtoSchema, AuthUserInput } from "../../dto/auth.dto";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Rota de usúarios");
});

router.post(
  "/signin",
  validateBody(AuthDtoSchema),
  async (req: Request<{}, {}, AuthUserInput>, res: Response) => {
    const { email, password } = req.body;
    res.send("passou");
  },
);

export default router;
