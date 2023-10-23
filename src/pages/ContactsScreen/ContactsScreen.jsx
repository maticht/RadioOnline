import React, {useCallback, useState} from 'react';
import arrLeft from "../../img/arrowleft.svg";
import {Button} from "react-bootstrap";
import SendMessage from "../../components/modals/SendMessage";

const ContactsScreen = () => {
    const contactName = 'Сергей Соколов';
    const contactEmail = 'contact@example.com';
    const contactPhone = '+1 (555) 123-4567';
    const contactAddress = '123 Main Street, City, Country';

    const handleBack = useCallback(() => {
        window.history.back();
    }, []);

    const [sendMessage, setSendMessage] = useState(false);

    return (
        <div className={'mainFooterNavBarBlock'}>
            <div className={'footerNavBarBlock'}>
                <div className={'navBarImgBlock'}  onClick={handleBack}>
                    <img className={'navBarImg'} src={arrLeft}/>
                </div>

                <p className={'footerTitle'}>Контакты</p>
            </div>
            <p>
                Добро пожаловать на страницу контактов компании Radio-Online.me.
            </p>
            <p>
                Если у вас возникли вопросы, пожелания или предложения, свяжитесь с нами по указанным ниже
                контактным данным.
            </p>
            <p className={'footerTextTitle'}>Контактная информация</p>
            <ul>
                <li>Имя: {contactName}</li>
                <li>Email: {contactEmail}</li>
                <li>Телефон: {contactPhone}</li>
                <li>Адрес: {contactAddress}</li>
            </ul>
            <p>
                Мы всегда рады помочь и ответить на ваши вопросы. Свяжитесь с нами, и мы постараемся
                предоставить вам необходимую информацию.
            </p>
            <Button
                variant={"outline-dark"}
                className="main-admin-button submit_btn"
                onClick={() => setSendMessage(true)}
            >
                Связаться с нами
            </Button>
            <SendMessage
                show={sendMessage}
                onHide={() => setSendMessage(false)}
            />
        </div>
    );
};

export default ContactsScreen;
