import "./bootstrap/env";
import { ENV } from "./config/env";
import { connectDB } from "./config/dbToken";
import { server } from "./socket";
import { connectRedis } from "./config/redis";

connectDB();
connectRedis();

server.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});