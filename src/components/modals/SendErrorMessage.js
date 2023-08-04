import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import successErrMsg from "../../img/successsErrMsg.svg";
import axios from "axios";
import {createCustomError} from "../../http/radioApi";
import {useLocation, useParams} from "react-router-dom";

const SendErrorMessage = ({show, onHide, radio}) => {
    const [value, setValue] = useState('');
    const [isSend, setIsSend] = useState(false);
    const location = useLocation();
    const params = useParams();

    useEffect(() => {
        const timerId = setTimeout(()=>
        {
            setIsSend(false)
        }, 500);

        return()=>{
            clearTimeout(timerId)
        };
    }, [onHide]);

    const sendMessage = async () => {
        try {
            const url = `http://localhost:8081/sendErrorMessage`;
            const {data: res} = await axios.post(url, {title: radio.title, errorMessage: value});


            let currentUrl = window.location.href;
            if (location.pathname === `/favorites/${params.radioId}`) {
                currentUrl = currentUrl.replace('/favorites', '')
            }

            await createCustomError({
                text: value,
                radioStationName: radio.title,
                radioStationLink: currentUrl,
            })
            setIsSend(true);
            setValue('');
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            {isSend ? (
                <div>
                    <div>
                        <Modal.Header closeButton  style={{backgroundColor:'#F4F4F4'}}>
                            <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:'20px', fontWeight:'bold'}}>
                                Ошибка с радио "{radio.title}"
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body  style={{backgroundColor:'#F4F4F4', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', textAlign:'center'}}>
                            <img src={successErrMsg} alt="success" style={{width:'100px', height:'100px', margin:'20px'}}/>
                            Ваше сообщение отправлено
                        </Modal.Body>
                        <Modal.Footer  style={{backgroundColor:'#F4F4F4', width:'100%', justifyContent:'space-between', borderTop:'0'}}>
                        </Modal.Footer>
                    </div>
                </div>
            ) : (
                <>
                    <Modal.Header closeButton  style={{backgroundColor:'#F4F4F4'}}>
                        <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:'20px', fontWeight:'bold'}}>
                            Ошибка с радио "{radio.title}"
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body  style={{backgroundColor:'#F4F4F4'}}>
                        <Form>
                    <textarea
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите текст ошибки"}
                        style={{backgroundColor:'#fff', outline:'none', border:'0', minHeight:'100px', borderRadius:'10px', width:'100%', padding:'10px'}}
                    />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer  style={{backgroundColor:'#F4F4F4', width:'100%', justifyContent:'space-between'}}>
                        <Button variant={"outline-danger"} className='admin-additional-button' onClick={onHide}>Закрыть</Button>
                        <Button variant={"outline-success"} className='main-admin-button' onClick={sendMessage}>Добавить</Button>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
};

export default SendErrorMessage;
