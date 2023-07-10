const nodemailer = require("nodemailer");

module.exports = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: 'cisdeals@delkind.pl',
                pass: 'SDE7heXNE*9H85W',
            },
            secure: false,
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: process.env.ADMIN,
            subject: subject,
            html: html,
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email!");
        console.error(error);
        return error;
    }
};

