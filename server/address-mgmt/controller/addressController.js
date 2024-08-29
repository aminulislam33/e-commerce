const Address = require("../model/addressSchema");

async function handleNewAddress(req, res) {
    try {
        const address = new Address({
            user: req.user.id,
            ...req.body
        });
        await address.save(); 
        res.status(201).json(address);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add address' });
    }
};

async function getAllAddressOfUser(req, res) {
    try {
        const addresses = await Address.find({ user: req.params.userId });
        
        if (addresses.length === 0) {
            return res.status(404).json({ message: 'No addresses found for this user.' });
        }

        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch addresses' });
    }
};

async function updateAddressExistingAddress(req, res) {
    try {
        const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update address' });
    }
};

async function deleteAddress(req, res) {
    try {
        const address = await Address.findByIdAndDelete(req.params.id);
        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete address' });
    }
};

module.exports = {
    handleNewAddress,
    getAllAddressOfUser,
    updateAddressExistingAddress,
    deleteAddress
}