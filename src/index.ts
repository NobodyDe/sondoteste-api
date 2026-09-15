import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import cors, { CorsOptions } from "cors";
import auth from "./routes/auth/auth";
import cookieParser from "cookie-parser";
import monitor from "./routes/monitor/monitor";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions: CorsOptions = {
  origin: "*", // Permite requisições de qualquer origem
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json(), cors(corsOptions), cookieParser());

// Aplicação isolada no app
app.use("/auth", auth);
app.use("/monitor", monitor);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
