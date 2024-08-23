const Product = require("../model/product");

async function createProduct(req, res) {
    const { name, description, price, image, category, stock } = req.body;
    try {
        const product = new Product({ name, description, price, image, category, stock });
        await product.save();
        res.status(201).json({ msg: 'Product added successfully', product });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

async function getAllProduct(req, res) {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

async function getSingleProduct(req, res) {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

async function updateSingleProduct(req, res) {
    const { id } = req.params;
    const { name, description, price, image, category, stock } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(id, { name, description, price, image, category, stock }, { new: true });
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.status(200).json({ msg: 'Product updated successfully', product });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

async function deleteSingleProduct(req, res) {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.status(200).json({ msg: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
}

module.exports = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateSingleProduct,
    deleteSingleProduct
};