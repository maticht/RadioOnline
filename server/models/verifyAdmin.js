const router = require("express").Router();
const Token = require("./token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateEmailTemplate = (url) => {
    const title = "Проверка электронной почты администратора";
    const buttonText = "Перейти";
    const emailHtml = `
        <html lang="RU">
            <head>
             <title>${title}</title>
            </head>
            <body style="background-color: #f1f1f1;text-align: center;width: 700px;padding: 0">
             <div style=" margin: 0 auto; padding: 3px 3px 20px 3px;">
              <div style="text-align: center; margin-top: 20px;">
               <h1 style=" color: #000000;font-size: 18px; font-weight: bold;">${title}</h1>
               <p style="color: #000000;font-size: 14px;">Для перехода на страницу администратора, пожалуйста, нажмите на кнопку</p>
               <a href="${url}" style="background-color: #06B5AE;font-weight: bold;font-size: 14px; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">${buttonText}</a>
             </div>
            </div>
            </body>
        </html>
    `;
    return emailHtml;
};

router.post("/", async (req, res) => {
    try {
        const token = await new Token({
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `https://radio-online.me/admin/${token.token}`;
        const emailHtml = generateEmailTemplate(url);
        await sendEmail(process.env.ADMIN, "Radio Online | Проверка электронной почты администратора", emailHtml);

        return res.status(201).send({ message: "Вам отправлено письмо! Пожалуйста, подтвердите ваш аккаунт (Может быть оно попало в спам)" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Внутренняя ошибка сервера" });
    }
});

module.exports = router;
