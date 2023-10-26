import React, { useCallback } from 'react';
import "./owners.css";
import arrLeft from '../../img/arrowleft.svg'

const OwnersScreen = () => {

    const handleBack = useCallback(() => {
        window.history.back();
    }, []);

    return (
        <div className={'mainFooterNavBarBlock'}>
            <div className={'footerNavBarBlock'}>
                <div className={'navBarImgBlock'}  onClick={handleBack}>
                    <img className={'navBarImg'} src={arrLeft}/>
                </div>

                <p className={'footerTitle'}>Правообладателям</p>
            </div>

            <p>
                Добро пожаловать на страницу для правообладателей компании Radio-Online.me.
            </p>
            <p>
                В Radio-Online.me мы уважаем права интеллектуальной собственности и стремимся соблюдать авторские
                права и интересы правообладателей.
            </p>
            <p className={'footerTextTitle'}>Уведомление о нарушении авторских прав</p>
            <p>
                <br></br>
                Сайт <a href={'https://radio-online.me'}>Radio-Online.me</a> не занимается собственной трансляцией или ретрансляций аудиопотоков радиостанций. Все опубликованные материалы (ссылки на аудиопотоки и контактная информация) взяты из открытых источников в сети интернет или были присланы пользователями сайта. Вещания происходит на сторонних серверах со специальным для этого программным обеспечением.
                <br></br>
                <br></br>
                Логотипы (товарные знаки), прошедшие официальную регистрацию, принадлежат их владельцам. Сайт https://radio-online.me использует такие материалы в информационных целях.
                <br></br>
                <br></br>
                <a href={'https://radio-online.me'}>Radio-Online.me</a> уважает права интеллектуальной собственности других лиц и ожидает что ее пользователи будут делать то же самое.
                <br></br>
                <br></br>
                Если вы являетесь владельцем авторских прав или уполномочены действовать от их имени, пожалуйста, сообщите о предполагаемых нарушениях авторских прав. Укажите материал, который, по вашему мнению, нарушает авторские права предъявив убедительные доказательства. После получения уведомления, top-radio.ru оперативно отреагирует на заявления о нарушении авторского права, предпримет любые действия по своему усмотрению, в том числе удалит оспариваемый материал с сайта.
                <br></br>
                <br></br>
                Для уведомления воспользуйтесь <a href={'https://radio-online.me/contacts'}>формой обратной связи.</a>
            </p>
        </div>
    );
};

export default OwnersScreen;
