import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createGenre} from "../../http/radioApi";
//import successErrMsg from "../../img/successErrMsg.svg";
import axios from "axios";

const SendErrorMessage = ({show, onHide, title}) => {
    const [value, setValue] = useState('');
    const [isSend, setIsSend] = useState(false);

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
            const {data: res} = await axios.post(url, {title: title, errorMessage: value});
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
                            <Modal.Title id="contained-modal-title-vcenter">
                                Ошибка с радио "{title}"
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body  style={{backgroundColor:'#F4F4F4', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', textAlign:'center'}}>
                            {/*<img src={successErrMsg} alt="success" style={{width:'100px', height:'100px', margin:'20px'}}/>*/}
                            Ваше сообщение отправлено
                        </Modal.Body>
                        <Modal.Footer  style={{backgroundColor:'#F4F4F4', width:'100%', justifyContent:'space-between', borderTop:'0'}}>
                        </Modal.Footer>
                    </div>
                </div>
            ) : (
                <>
                    <Modal.Header closeButton  style={{backgroundColor:'#F4F4F4'}}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Ошибка с радио "{title}"
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
                        <Button variant={"outline-danger"} style={{width:'375px'}} className='admin-additional-button' onClick={onHide}>Закрыть</Button>
                        <Button variant={"outline-success"}  style={{width:'375px'}} className='main-admin-button' onClick={sendMessage}>Добавить</Button>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
};

export default SendErrorMessage;
