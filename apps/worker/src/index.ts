import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { createClient } from "redis";

const redisUrl: string = process.env.REDIS_CLIENT || "redis://localhost:6379";
const queueName = "notification";
const pubChannel = "notification-updates";

const redisClient = createClient({ url: redisUrl });

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Redis connection failed:", err);
    process.exit(1);
  });

console.log("Worker connected to Redis");

const runner = async () => {
  while (true) {
    try {
      const res = await redisClient.brPop(queueName, 0); // Block until a job arrives
      if (res) {
        const job = JSON.parse(res.element);

        console.log("Processing job:", job);

        // Simulate processing (e.g., send email/notification)
        await new Promise((r) => setTimeout(r, 1000));

        // Publish update
        await redisClient.publish(
          pubChannel,
          JSON.stringify({
            userId: job.userId,
            status: "completed",
            message: job.message,
            target: job.target,
            type: job.type || "broadcast",
          })
        );
      }
    } catch (err) {
      console.error("Worker error:", err);
      break;
    }
  }
};

runner();
