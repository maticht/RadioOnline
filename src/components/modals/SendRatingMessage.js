import React, {useState} from 'react';
import {Modal} from "react-bootstrap";
import successErrMsg from "../../img/successsErrMsg.svg";

const SendRatingMessage = ({show, onHide, radio}) => {

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton  style={{backgroundColor:'#F4F4F4'}}>
            <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:'20px', fontWeight:'bold'}}>
                Оценка радио "{radio.title}"
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
                Ваш отзыв находится на рассмотрении
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

export default SendRatingMessage;
