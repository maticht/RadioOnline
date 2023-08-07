const router = require("express").Router();
const Token = require("./token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateEmailTemplate = (title, errorMessage) => {
    const buttonText = "Перейти";
    const emailHtml = `
        <html lang="RU">
            <head>
             <title>Возникла ошибка с радио ${title}</title>
            </head>
            <body style="background-color: #f1f1f1;text-align: center;width: 700px;padding: 0">
             <div style=" margin: 0 auto; padding: 3px 3px 20px 3px;">
              <div style="text-align: center; margin-top: 20px;">
               <p style=" color: #000000;font-size: 16px;"><b>Текст ошибки с радио "${title}": </b> ${errorMessage}</p>
             </div>
            </div>
            </body>
        </html>
    `;
    return emailHtml;
};

router.post("/", async (req, res) => {
    try {
        const {title, errorMessage} = req.body;
        const emailHtml = generateEmailTemplate(title, errorMessage);

        await sendEmail(process.env.ADMIN, `Radio Online | Возникла ошибка с радио ${title}`, emailHtml);

        return res.status(201).send({ message: "Письмо с ошибкой отправленно" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Внутренняя ошибка сервера" });
    }
});

module.exports = router;
