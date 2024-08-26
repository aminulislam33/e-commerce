const Order = require("../model/order");

async function placeOrder(req, res) {
    const { products, totalAmount } = req.body;
    try {
        const order = new Order({
            user: req.user.id,
            products,
            totalAmount,
        });
        await order.save();
        res.status(201).json({ msg: 'Order placed successfully', order });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

async function singleOrder(req, res) {
    const { id } = req.params;
    try {
        const order = await Order.findById(id).populate('products.product');
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

async function multipleOrder(req, res) {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ user: userId }).populate('products.product');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

async function getAllOrders(req, res) {
    console.log("getAllOrders");
    try {
        const orders = await Order.find({})
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
}

async function updateOrderStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.status(200).json({ msg: 'Order status updated successfully', order });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

async function deleteOrder(req, res) {
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndDelete(id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.status(200).json({ msg: 'Order cancelled successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = {
    placeOrder,
    singleOrder,
    multipleOrder,
    updateOrderStatus,
    deleteOrder,
    getAllOrders
};