import { Router, Request, Response } from "express";
import MonitorModels from "../../models/MonitorModel";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Rota monitor");
});

router.post("/", async (req: Request, res: Response) => {
  const { hardware, ...payload } = (req.body ?? {}) as Record<string, unknown>;

  if (!hardware) {
    return res.status(400).json({
      error: "O payload deve conter o hardware como texto.",
    });
  }
  console.log(hardware, payload);
  return;
  try {
    const sensor = await MonitorModels.registerPayloadInDatabase(
      hardware as string,
      payload,
    );

    if (sensor === null) {
      return res.status(404).json({
        error: "Hardware não encontrado ou inativo.",
      });
    }

    return res.status(201).json({
      sensor,
    });
  } catch (err) {
    console.error("Erro ao processar monitor:", err);
    return res.status(500).json({
      error: "Não foi possível registrar o payload.",
    });
  }
});

export default router;
