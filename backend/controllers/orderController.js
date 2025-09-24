import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const { orderItems, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  } else {
    const order = new Order({
      orderItems: orderItems.map(x => ({ ...x, product: x.id, _id: undefined })),
      user: req.user._id,
      totalPrice,
    });
    
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};

export { addOrderItems };