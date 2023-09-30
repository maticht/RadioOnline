const nodemailer = require("nodemailer");

module.exports = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: 'radio-online@server757413.nazwa.pl',
                pass: '7hC-X74jRQ#2QA$',
            },
            secure: false,
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: 'sergey-sokolov@inbox.ru',
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

