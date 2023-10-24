import React, {useState} from 'react';
import {Modal} from "react-bootstrap";
import {createCustomMessage} from "../../http/radioApi";
import SuccessfulSendMessage from "./SuccessfulSendMessage";
import BlurOverlay from "../BlurOverlay/BlurOverlay";


const SendMessage = ({show, onHide}) => {

    const [messageDesc, setMessageDesc] = useState({description: ""});
    const [messageSenderName, setMessageSenderName] = useState({name: ""});
    const [messageSenderEmail, setMessageSenderEmail] = useState({email: ""});
    const [successfulSentMessage, setSuccessfulSentMessage] = useState(false);


    const handleChange = ({currentTarget: input}) => {
        const {name, value} = input;

        if (value.length <= 2000) {
            setMessageDesc({...messageDesc, [name]: value});
        } else {
            setMessageDesc({...messageDesc, [name]: value.slice(0, 2000)});
        }
    };
    const handleChangeName = ({currentTarget: input}) => {
        const {name, value} = input;
        setMessageSenderName({...messageSenderName, [name]: value});
    };
    const handleChangeEmail = ({currentTarget: input}) => {
        const {name, value} = input;
        setMessageSenderEmail({...messageSenderEmail, [name]: value});
    };

    const toggleMessage = async (description, name, email) => {
        try {
            await createCustomMessage({
                description: description,
                name: name,
                email: email,
            })
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddMessage = () => {
        if (messageDesc.description === '' || messageSenderName.name === '' || messageSenderEmail.email === '') {
            alert('Заполните поля ввода для отправки сообщения')
        } else {
            toggleMessage(messageDesc.description, messageSenderName.name, messageSenderEmail.email)
                .then(() => {
                    setMessageDesc({description: ""});
                    setMessageSenderName({name: ""});
                    setMessageSenderEmail({email: ""});
                })
                .catch(error => {
                    console.log(error);
                });
            setSuccessfulSentMessage(true);
            onHide();
            setTimeout(() => {
                setSuccessfulSentMessage(false);
            }, 5000);
        }
    };

    return (
        <div>
            <BlurOverlay show={show}/> {/* Включите BlurOverlay с передачей show */}
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                centered
            >
                <Modal.Header closeButton style={{backgroundColor: '#F4F4F4'}}>
                    <Modal.Title id="contained-modal-title-vcenter" style={{fontSize: '20px', fontWeight: 'bold'}}>
                        Связаться с нами
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{
                    backgroundColor: '#F4F4F4',
                }}>
                    <div style={{position: 'relative', zIndex: 1, marginBottom: '10px'}}>
                        <div style={{
                            margin: '0',
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}>
                            <div style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                marginTop: '5px'
                            }}>
                                <input
                                    type="text"
                                    placeholder="Имя"
                                    name="name"
                                    onChange={handleChangeName}
                                    value={messageSenderName.name}
                                    required
                                    className="input"
                                    style={{width: '100%'}}
                                />
                            </div>
                            <div style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                marginTop: '5px'
                            }}>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    name="email"
                                    onChange={handleChangeEmail}
                                    value={messageSenderEmail.email}
                                    required
                                    className="input"
                                    style={{width: '100%'}}
                                />
                            </div>
                            <div style={{
                                width: '100%',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                        <textarea
                                            placeholder={"Напишите ваше сообщение"}
                                            name="description"
                                            onChange={handleChange}
                                            value={messageDesc.description}
                                            required
                                            className="inputTop"
                                            style={{height: '50px', margin: '10px 0 0 0', width: '100%'}}
                                        />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{
                    backgroundColor: '#F4F4F4',
                    width: '100%',
                    justifyContent: 'space-between',
                    borderTop: '0',
                    marginTop: '-15px'
                }}>
                    <button onClick={handleAddMessage} className="submit_btn"
                            style={{width: '100%', margin: ''}}>
                        Отправить сообщение
                    </button>
                </Modal.Footer>
            </Modal>
            <SuccessfulSendMessage
                show={successfulSentMessage}
                onHide={() => setSuccessfulSentMessage(false)}
            />
        </div>
    );
};

export default SendMessage;