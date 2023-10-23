import {Modal} from "react-bootstrap";
import successErrMsg from "../../img/successsErrMsg.svg";
import React from "react";

const SuccessfulSendMessage = ({show, onHide}) => {


    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
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
                Сообщение отправлено, скоро мы с вами свяжемся!
            </Modal.Body>
            <Modal.Footer style={{
                backgroundColor: '#F4F4F4',
                width: '100%',
                justifyContent: 'space-between',
                borderTop: '0'
            }}>
            </Modal.Footer>
        </Modal>
    );
};

export default SuccessfulSendMessage;
