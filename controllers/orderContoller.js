const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { format } = require("date-fns");

const getAllOrders = async (req, res) => {
  const { email, lastName, page, id } = req.query;
  const queryObject = {};
  if (email) {
    queryObject.email = { $regex: email, $options: "i" };
  }
  if (lastName) {
    queryObject.lastName = { $regex: lastName, $options: "i" };
  }
  if (id) {
    queryObject._id = id;
  }

  let result = Order.find(queryObject).select(
    "createdAt email firstName lastName total status"
  );

  //documents count is needed on the front-end to pagination
  const ordersCount = await Order.countDocuments(queryObject);

  const limit = 10;

  const skip = (page - 1) * limit;

  result = result
    .skip(skip || 0)
    .limit(limit)
    .sort("-createdAt");

  const orders = await result;

  res.status(StatusCodes.OK).json({ orders, ordersCount });
};

const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ order });
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const {
    status,
    firstName,
    lastName,
    address,
    city,
    postCode,
    phoneNumber,
    country,
  } = req.body;
  let order = await Order.findOne({ _id: id });

  //order can only updated if payment has been received by stripe *payments are supported by stripe on useGuitar*
  if (order.status === "waiting for payment" && status !== order.status) {
    throw new CustomError.UnauthorizedError("Payment not confirmed yet.");
  }
  if (order.status === "canceled") {
    throw new CustomError.BadRequestError(
      "Can't change the order if it is canceled."
    );
  }

  const orderBody = {
    status,
    firstName,
    lastName,
    address,
    city,
    postCode,
    phoneNumber,
    country,
  };

  const updatedOrder = await Order.updateOne({ _id: id }, orderBody);

  res.status(StatusCodes.OK).json({ msg: "Order updated" });
};

const getOrdersStats = async (req, res) => {
  const date = new Date();
  const pastYear = date.getFullYear() - 1;
  date.setFullYear(pastYear);
  date.setDate(1);

  const orders = await Order.find({
    status: ["send", "waiting for shipment"],
    createdAt: { $gte: date },
  });

  let dates = [];

  dates = orders.map((order) => {
    const date = new Date(order.createdAt);
    return format(date, "MMM yy");
  });

  const datesWithOrdersAmounts = dates.reduce((prev, cur) => {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});

  const placedOrdersByDate = Object.entries(datesWithOrdersAmounts).map(
    (entry) => {
      return {
        month: entry[0],
        amount: entry[1],
      };
    }
  );

  // with current object structure in array can't correctly sort data
  const monthOrder = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  placedOrdersByDate.sort((a, b) => {
    const [monthA, yearA] = a.month.split(" ");
    const [monthB, yearB] = b.month.split(" ");

    if (yearA !== yearB) {
      return yearA - yearB;
    }

    return monthOrder[monthA] - monthOrder[monthB];
  });

  const allOrdersTotal = orders.reduce((acc, order) => acc + order.total, 0);
  let allOrdersTotalProducts = 0;
  orders.map((order) =>
    order.orderItems.map(
      (item) =>
        (allOrdersTotalProducts = allOrdersTotalProducts + item.quantity)
    )
  );

  const products = await Product.find({}).select("subcategory name images");

  let salesBySubcategory = [];
  let productsArray = [];

  // I first tried to fetch every product separately but it took database 12 second to send every document
  // and i decided to change my strategy to something that may be a little ugly, but effective

  // for (const order of orders) {
  //   for (const item of order.orderItems) {
  //     const product = await Product.find({ _id: item.product }).select(
  //       "subcategory"
  //     );
  //   }
  // }

  function getRandomColor() {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  for (const order of orders) {
    for (const item of order.orderItems) {
      for (const product of products) {
        if (product.name === item.name) {
          //getting values by product subcategory
          if (salesBySubcategory.length < 1) {
            salesBySubcategory = [
              ...salesBySubcategory,
              {
                subcategory: product.subcategory,
                value: item.quantity,
                color: getRandomColor(),
              },
            ];
          } else {
            let flag = false;
            salesBySubcategory.forEach((obj, index) => {
              if (obj.subcategory === product.subcategory && !flag) {
                flag = true;
                obj.value = obj.value + item.quantity;
              } else if (!flag && index === salesBySubcategory.length - 1) {
                flag = true;
                salesBySubcategory = [
                  ...salesBySubcategory,
                  {
                    subcategory: product.subcategory,
                    value: item.quantity,
                    color: getRandomColor(),
                  },
                ];
              }
            });
            //getting values by product name
            if (productsArray.length < 1) {
              productsArray = [
                ...productsArray,
                {
                  name: product.name,
                  value: item.quantity,
                  image: product.images[0].imageURL,
                },
              ];
            } else {
              let flag = false;
              productsArray.forEach((obj, index) => {
                if (obj.name === product.name && !flag) {
                  flag = true;
                  obj.value = obj.value + item.quantity;
                } else if (!flag && index === productsArray.length - 1) {
                  flag = true;
                  productsArray = [
                    ...productsArray,
                    {
                      name: product.name,
                      value: item.quantity,
                      image: product.images[0].imageURL,
                    },
                  ];
                }
              });
            }
          }
        }
      }
    }
  }

  const sortedProductsArray = productsArray.sort(
    ({ value: a }, { value: b }) => b - a
  );

  const topSellingProducts = [];

  // loop to separete top 5 products
  for (let i = 0; i < 5; i++) {
    topSellingProducts.push(sortedProductsArray[i]);
  }

  res.status(StatusCodes.OK).json({
    ordersNumber: orders.length,
    allOrdersTotal,
    allOrdersTotalProducts,
    salesBySubcategory,
    topSellingProducts,
    placedOrdersByDate,
  });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  updateOrder,
  getOrdersStats,
};
