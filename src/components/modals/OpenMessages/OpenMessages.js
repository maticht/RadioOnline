import React, {useContext, useEffect, useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {Context} from "../../../index";
import './OpenMessages.css';
import axios from "axios";
import {createCustomRating, deleteCustomError, getAllCustomErrors} from "../../../http/radioApi";
import {deleteCustomRating, getAllCustomRating} from "../../../http/radioApi";
import {observer} from "mobx-react-lite";
import {useLocation, useParams} from "react-router-dom";
import goldStar from "../../../img/goldStar.svg";

const OpenMessages = observer(({show, onHide}) => {
    const {radioStation} = useContext(Context)
    const param = useParams()
    const location = useLocation()
    const isAdminLoc = location.pathname === `/admin/${param.token}`
    const [errMessages, setErrMessages] = useState([]);
    const [ratMessages, setRatMessages] = useState([]);
    const [showErrors, setShowErrors] = useState(true);
    const [showRatings, setShowRatings] = useState(false);

    useEffect(() => {
        getAllCustomRating().then(data => {
            setRatMessages(data)
        });
    }, [])
    const handleDeleteRat = (id) => {
        deleteCustomRating({id: id});
        setRatMessages(ratMessages.filter((ratMessage) => ratMessage.id !== id));
    }

    useEffect(() => {
        getAllCustomErrors().then(data => {
            setErrMessages(data)
        });
    }, [])
    const handleDeleteErr = (id) => {
        deleteCustomError({id: id});
        setErrMessages(errMessages.filter((errMessage) => errMessage.id !== id));
    }

    const toggleRate = async (id, userid, rating, description, name, email) => {
        try {
            const url = `http://localhost:8081/addingRating/${userid}`;
            const {data: res} = await axios.put(url, {value: rating, description: description, name: name, email: email});
            deleteCustomRating({id: id});
            setRatMessages(ratMessages.filter((ratMessage) => ratMessage.commentatorId !== userid));
        } catch (error) {
            console.log(error);
        }
    };

    return (<Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
    >
        <Modal.Header closeButton style={{backgroundColor: '#F4F4F4'}}>
            <Modal.Title id="contained-modal-title-vcenter" style={{fontSize: '20px', fontWeight: 'bold'}}>
                Входящие сообщения
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor: '#F4F4F4', padding: '0 8px 0 15px'}}>
            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                marginTop: '10px',
            }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginRight: '20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        color: showErrors === true ? '#06B5AE' : '#666'
                    }}
                    onClick={() => {
                        setShowErrors(!showErrors);
                        setShowRatings(false);
                    }}
                >
                    <div style={{marginBottom: '5px'}}>Ошибки</div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginRight: '20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        color: showRatings === true ? '#06B5AE' : '#666'
                    }}
                    onClick={() => {
                        setShowErrors(false);
                        setShowRatings(!showRatings);
                    }}
                >
                    <div style={{marginBottom: '5px'}}>Отзывы</div>
                </div>
            </div>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                {showErrors && (<div className={'err-scroll'} style={{
                    width: '100%',
                    display: 'flex',
                    maxHeight: '450px',
                    overflowY: 'auto',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginTop: '10px',
                }}>
                    {errMessages.map(errMessage => (
                        <div style={{
                            width:'100%',
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '10px',
                            flexDirection:'column',
                            backgroundColor: '#fff',
                            padding: '5px 10px 10px',
                            borderRadius: '10px',
                            marginRight:'8px'
                        }}>
                            <div
                                key={errMessage.id}
                                style={{
                                    width:'100%',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div className={'radio-err-msg'}>
                                        <p style={{ margin: '0px', fontWeight:'600', marginRight:'10px' }}>
                                            Название радиостанции:</p>
                                        {errMessage.radioStationName}
                                    </div>
                                    <div className={'radio-err-msg'} style={{ margin: '6px 0 0 0px' }}>
                                        <p style={{ margin: '0px', fontWeight:'600', marginRight:'10px' }}>
                                            Текст ошибки:</p>
                                        {errMessage.text}
                                    </div>

                                </div>
                                <span
                                    style={{ cursor: 'pointer', color: '#666', marginLeft: '5px', fontSize:'20px' }}
                                    onClick={() => handleDeleteErr(errMessage._id)}
                                >
                                &times;
                            </span>
                            </div>
                            <div className={'radio-err-btn-data'} >
                                <a className={'link-btn'} target="_blank" href={errMessage.radioStationLink}>Перейти к риадиостанции</a>
                                <p className={'data-text'}>{new Date(errMessage.time).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>)}
            </div>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                {showRatings && (<div  className={'err-scroll'} style={{
                    width: '100%',
                    display: 'flex',
                    height:'450px',
                    maxHeight: '450px',
                    overflowY: 'auto',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginTop: '10px',
                }}>
                    {ratMessages.map(ratMessage => (
                        <div style={{
                            width:'100%',
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '10px',
                            flexDirection:'column',
                            backgroundColor: '#fff',
                            padding: '5px 10px 10px',
                            borderRadius: '10px',
                            marginRight:'8px'
                        }}>
                            <div
                                key={ratMessage.id}
                                style={{
                                    width:'100%',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div className={'radio-err-msg'}>
                                        <p style={{ margin: '0px', fontWeight:'600', marginRight:'10px' }}>
                                            Имя отправителя:</p>
                                        {ratMessage.name}
                                    </div>
                                    <div className={'radio-err-msg'} style={{ margin: '6px 0 0 0px' }}>
                                        <p style={{ margin: '0px', fontWeight:'600', marginRight:'10px' }}>
                                            Почта отправителя:</p>
                                        {ratMessage.email}
                                    </div>
                                    <div className={'radio-err-msg'} style={{ margin: '6px 0 0 0px', display:'flex', flexWrap:'nowrap', flexDirection:'row' }}>
                                        <p style={{ margin: '0px', fontWeight:'600', marginRight:'10px' }}>
                                            Оенка отзыва:</p>
                                        <img src={goldStar} alt="Star"
                                             style={{marginRight: '5px', width: '18px'}}/>
                                        <p style={{margin: '0px', fontWeight: '500',}}>{ratMessage.value}</p>
                                    </div>
                                    <div className={'radio-err-msg'} style={{ display:'flex',flexDirection:'column', width:'100%',margin: '6px 0 0 0px',wordWrap: 'break-word', wordBreak: 'break-all' }}>
                                        <p style={{ width:'100%',  margin: '0px', fontWeight:'600', marginRight:'10px' }}>
                                            Описание отзыва:</p>
                                        {ratMessage.description}
                                    </div>
                                </div>
                                <span
                                    style={{ cursor: 'pointer', color: '#666', marginLeft: '5px', fontSize:'20px' }}
                                    onClick={() => handleDeleteRat(ratMessage._id)}
                                >
                                &times;
                            </span>
                            </div>
                            <div className={'radio-err-btn-data'} >
                                <a className={'link-btn'} onClick={() => toggleRate(ratMessage._id, ratMessage.commentatorId, ratMessage.value, ratMessage.description,ratMessage.name, ratMessage.email, )} >Добавить отзыв</a>
                                <p className={'data-text'}>{new Date(ratMessage.created).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>)}
            </div>
        </Modal.Body>
        <Modal.Footer style={{backgroundColor: '#F4F4F4', width: '100%', justifyContent: 'space-between'}}>
            <Button variant={"outline-danger"} className='admin-additional-button' style={{width: '100%'}}
                    onClick={onHide}>Закрыть</Button>
        </Modal.Footer>
    </Modal>);
});
export default OpenMessages;
