const nodemailer = require('nodemailer');

const sendVerificationEmail = async (user) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const verificationToken = user.generateVerificationToken();
    console.log(`${process.env.BASE_URL}/api/auth/verify/${verificationToken}`);
    await user.save();

    const mailOptions = {
        from: 'no-reply@aminuldev.me',
        to: user.email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking on the following link: \n\n
      ${process.env.BASE_URL}/user/auth/verify/${verificationToken}\n\n
      If you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
