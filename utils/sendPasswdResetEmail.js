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

    const mailOptions = {
        from: 'your-email@example.com',
        to: user.email,
        subject: 'Password Reset Request',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${process.env.BASE_URL}/api/auth/reset/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendResetPasswordEmail;  