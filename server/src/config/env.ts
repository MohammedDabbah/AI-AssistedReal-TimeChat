function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "development",

  PORT: Number(process.env.PORT ?? 3000),

  DATABASE_URL: requireEnv("DATABASE_URL"),

  MONGO_URI: process.env.MONGO_URI ?? "",

  JWT_SECRET: requireEnv("JWT_SECRET"),

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? "access_secret",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ?? "refresh_secret",

  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES ?? "15m",
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES ?? "7d",

  GOOGLE_CLIENT_ID: requireEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: requireEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: requireEnv("GOOGLE_REDIRECT_URI"),

  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:3000",
  
  REDIS_URL: process.env.REDIS_URL ?? "redis://localhost:6379",

  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? ""
} as const;
