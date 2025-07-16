import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import express, { Request, Response } from "express";
import { createClient } from "redis";

// Setup
const app = express();
app.use(express.json());

// Redis Initialization
const redisUrl = process.env.REDIS_CLIENT || "redis://localhost:6379";
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

//   Routes
app.post("/notify", async (req: Request, res: Response) => {
  try {
    // type => private, broadcast, room
    const { message, email, userId, target, type } = req.body;

    // Validate input
    if (!message || !email || !userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "fail",
        success: false,
        message: "Kindly provide proper data",
      });
    }

    if (type != "broadcast" && !target) {
      return res.status(400).json({
        statusCode: 400,
        status: "fail",
        success: false,
        message: "Kindly provide target",
      });
    }

    // Push notification to Redis list (queue)
    await redisClient.lPush(
      "notification",
      JSON.stringify({ message, email, userId, target, type })
    );

    return res.status(202).json({
      status: "queued",
      statusCode: 202,
      success: true,
      message: "Notification is under process",
    });
  } catch (error) {
    console.error("Error in /notify route:", error);
    return res.status(500).json({
      statusCode: 500,
      status: "error",
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
