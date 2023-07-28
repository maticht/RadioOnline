import React from 'react';

const ContactsScreen = () => {
    const contactName = 'Сергей Соколов';
    const contactEmail = 'contact@example.com';
    const contactPhone = '+1 (555) 123-4567';
    const contactAddress = '123 Main Street, City, Country';

    return (
        <div style={{padding:'15px 20px'}}>
            <h2>Контакты</h2>
            <p>
                Добро пожаловать на страницу контактов компании Radio-Online.me.
            </p>
            <p>
                Если у вас возникли вопросы, пожелания или предложения, свяжитесь с нами по указанным ниже
                контактным данным.
            </p>
            <h5>Контактная информация</h5>
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
        </div>
    );
};

export default ContactsScreen;
