import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createGenre} from "../../http/radioApi";
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
        const timerId = setTimeout(() => {
            setIsSend(false)
        }, 100);

        return () => {
            clearTimeout(timerId)
        };
    }, [onHide]);

    const sendMessage = async () => {
        try {
            const url = `https://backend.radio-online.me/sendErrorMessage`;
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
    const [block1Disabled, setBlock1Disabled] = useState(false);
    const [block2Disabled, setBlock2Disabled] = useState(false);
    const [block3Disabled, setBlock3Disabled] = useState(false);

    const handleBlockClick = (blockText, blockNumber) => {
        if (value.indexOf(blockText) === -1) {
            setValue((prevValue) => prevValue + blockText);
            if (blockNumber === 1) {
                setBlock1Disabled(true);
            } else if (blockNumber === 2) {
                setBlock2Disabled(true);
            } else if (blockNumber === 3) {
                setBlock3Disabled(true);
            }
        }
    };
    useEffect(() => {
        setBlock1Disabled(value.indexOf('Радио не работает. ') !== -1);
        setBlock2Disabled(value.indexOf('Радио прерывается. ') !== -1);
        setBlock3Disabled(value.indexOf('Долгая загрузка. ') !== -1);
    }, [value]);


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
                        <Modal.Body style={{
                            backgroundColor: '#F4F4F4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            textAlign: 'center'
                        }}>
                            <img src={successErrMsg} alt="success"
                                 style={{width: '100px', height: '100px', margin: '20px'}}/>
                            Ваше сообщение отправлено
                        </Modal.Body>
                        <Modal.Footer style={{
                            backgroundColor: '#F4F4F4',
                            width: '100%',
                            justifyContent: 'space-between',
                            borderTop: '0'
                        }}>
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
                    <Modal.Body style={{ backgroundColor: '#F4F4F4' }}>
                        <Form>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', flexWrap:'wrap' }}>
                                <div
                                    style={{
                                        backgroundColor:'#fff',
                                        borderRadius: '10px',
                                        padding: '10px',
                                        color:'#06B5AE',
                                        fontWeight:'500',
                                        cursor: block1Disabled ? 'default' : 'pointer',
                                        border: block1Disabled ? '2px solid #06B5AE' : '2px solid #fff',
                                    }}
                                    onClick={() => handleBlockClick('Радио не работает. ', 1)}
                                >
                                    Радио не работает
                                </div>
                                <div
                                    style={{
                                        backgroundColor:'#fff',
                                        borderRadius: '10px',
                                        padding: '10px',
                                        color:'#06B5AE',
                                        fontWeight:'500',
                                        cursor: block2Disabled ? 'default' : 'pointer',
                                        border: block2Disabled ? '2px solid #06B5AE' : '2px solid #fff',
                                    }}
                                    onClick={() => handleBlockClick('Радио прерывается. ', 2)}
                                >
                                    Радио прерывается
                                </div>
                                <div
                                    style={{
                                        backgroundColor:'#fff',
                                        borderRadius: '10px',
                                        padding: '10px',
                                        color:'#06B5AE',
                                        fontWeight:'500',
                                        cursor: block3Disabled ? 'default' : 'pointer',
                                        border: block3Disabled ? '2px solid #06B5AE' : '2px solid #fff',
                                    }}
                                    onClick={() => handleBlockClick('Долгая загрузка. ', 3)}
                                >
                                    Долгая загрузка
                                </div>
                            </div>
                            <textarea
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={'Введите текст ошибки'}
                                style={{
                                    backgroundColor: '#fff',
                                    outline: 'none',
                                    border: '0',
                                    minHeight: '100px',
                                    borderRadius: '10px',
                                    width: '100%',
                                    padding: '10px',
                                    marginTop: '10px',
                                }}
                            />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer style={{backgroundColor: '#F4F4F4', width: '100%', justifyContent: 'space-between'}}>
                        <Button variant={"outline-danger"} style={{marginRight:'4px'}} className='admin-additional-button'
                                onClick={onHide}>Закрыть</Button>
                        <Button variant={"outline-success"} style={{marginLeft:'4px'}} className='main-admin-button'
                                onClick={sendMessage}>Добавить</Button>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
};

export default SendErrorMessage;
