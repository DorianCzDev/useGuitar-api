require("dotenv").config();

const express = require("express");
const app = express();

const connectDB = require("./db/connect");

app.use(express.json());

//routers
const productRouter = require("./routes/productRoutes");

app.use("/api/products", productRouter);

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
