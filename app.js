require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

const morgan = require("morgan");

const connectDB = require("./db/connect");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//routers
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

//error middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5001;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
