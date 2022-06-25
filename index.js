import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import hotelsRouter from "./routes/hotels.js";
import roomsRouter from "./routes/rooms.js";
import usersRouter from "./routes/users.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});

// middleware
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/users", usersRouter);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  connect();
  console.log(`Server is running on ${port}`);
});
