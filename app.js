require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

//routers
const productRouter = require("./routes/productRoutes");

app.use("/api/products", productRouter);

const port = process.env.PORT || 5001;
const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
