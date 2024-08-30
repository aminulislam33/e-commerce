const Cart = require("../model/cartProduct");

async function handleAddToCart(req, res) {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId == productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

async function getAllCartProductsOfUser(req, res) {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    handleAddToCart,
    getAllCartProductsOfUser
}