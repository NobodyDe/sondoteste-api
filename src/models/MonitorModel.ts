import { db } from "../db/pg";
import { redis } from "../redis";

interface SensorProps {
  id: number;
  name: string;
  hardware: string;
  stream_id: string;
  create_at: string;
}

const SENSOR_TTL = 3600; //1h

const MonitorModels = {
  async getNameInDatabase(hardware: string): Promise<SensorProps | null> {
    const cacheKey = `sensor:${hardware}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Via cache", cached);
      return JSON.parse(cached) as SensorProps;
    }

    const query = `SELECT id,name,hardware,stream_id,created_at FROM sensores WHERE hardware = $1 AND status = 1 LIMIT 1 `;
    const result = await db.query(query, [hardware]);

    const sensor = result.rows[0] ?? null;

    if (sensor) {
      await redis.set(cacheKey, JSON.stringify(sensor), "EX", SENSOR_TTL);
    }

    return sensor;
  },

  async registerPayloadInDatabase(
    hardware: string,
    payload: Record<string, unknown>,
  ): Promise<number | null> {
    const sensor = await this.getNameInDatabase(hardware);
    if (!sensor) return null;
    const register = {
      name: sensor.name,
      hardware: sensor.hardware,
      payload: payload,
    };
    const query = `INSERT INTO monitor(name,hardware,payload)
    VALUES($1,$2,$3)
    RETURNING id`;
    try {
      const result = await db.query(query, [
        register.name,
        register.hardware,
        register.payload,
      ]);
      return result.rows[0]?.id ?? null;
    } catch (err) {
      console.error("Erro ao inserir", err);
      throw err;
    }
  },
};

export default MonitorModels;
