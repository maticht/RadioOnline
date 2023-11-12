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
                Добро пожаловать на страницу контактов компании <a href={'https://radio-online.me'}>Radio-Online.me</a>.
            </p>
            <p>
                Если у вас возникли вопросы, пожелания или предложения, свяжитесь с нами. Мы всегда рады помочь и ответить на ваши вопросы.
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
