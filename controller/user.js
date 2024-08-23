const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendVerificationEmail = require("../utils/sendVerificationMail");

async function handleUserRegistration(req, res) {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
        });

        await user.save();
        await sendVerificationEmail(user);

        res.status(200).json({ msg: 'Registration successful. Please check your email to verify your account.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

async function verifyEmail(req, res) {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ msg: 'Email verified successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

async function getUserData(req, res) {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    handleUserRegistration,
    handleUserLogin,
    getUserData,
    verifyEmail
}