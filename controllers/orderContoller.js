const getAllOrders = async (req, res) => {
  res.send("getAllOrders");
};

const getSingleOrder = async (req, res) => {
  res.send("getSingleOrder");
};
const getUserOrders = async (req, res) => {
  res.send("getUserOrders");
};

const createOrder = async (req, res) => {
  res.send("createOrder");
};

const updateOrder = async (req, res) => {
  res.send("updateOrder");
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getUserOrders,
  createOrder,
  updateOrder,
};
