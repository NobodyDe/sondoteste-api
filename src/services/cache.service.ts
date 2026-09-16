import { redis } from "../redis";

interface PayloadProps {
  temperature: number;
  umidade: number;
}

async function getLastRead(hardware: string): Promise<PayloadProps | null> {
  const cacheKey = `monitor:${hardware}:last`;
  const cached = await redis.get(cacheKey);
  return cached ? (JSON.parse(cached) as PayloadProps) : null;
}

function payloadChage(
  anterior: PayloadProps | null,
  atual: PayloadProps,
): boolean {
  if (!anterior) return true; // primeira leitura desse hardware → sempre salva
  return (
    anterior.temperature !== atual.temperature ||
    anterior.umidade !== atual.umidade
  );
}

async function saveLastRead(
  hardware: string,
  payload: PayloadProps,
): Promise<void> {
  const cacheKey = `monitor:${hardware}:last`;
  await redis.set(cacheKey, JSON.stringify(payload)); // sem TTL: é o "estado atual" do hardware, não expira sozinho
}
