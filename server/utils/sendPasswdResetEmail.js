const nodemailer = require('nodemailer');

const sendResetPasswordEmail = async (user) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const resetToken = user.generateResetPasswordToken();
    await user.save();
    console.log(`${process.env.BASE_URL}/api/auth/reset/${resetToken}`);

    const mailOptions = {
        from: 'no-reply@aminuldev.me',
        to: user.email,
        subject: 'Password Reset Request',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n
        ${process.env.BASE_URL}/api/auth/reset/${resetToken}\n
        If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendResetPasswordEmail;  