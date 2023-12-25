import express from "express";
import dotenv from "dotenv";
dotenv.config();
// import productRoutes from "./routes/productRoutes.js";
const port = process.env.PORT || 5000;
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";

connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.listen(port);
