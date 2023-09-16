import React, {useContext, useEffect, useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {Context} from "../../../index";
import './OpenMessages.css';
import axios from "axios";
import {deleteCustomError, deleteCustomRating, getAllCustomErrors, getAllCustomRating} from "../../../http/radioApi";
import {observer} from "mobx-react-lite";
import {useLocation, useParams} from "react-router-dom";
import goldStar from "../../../img/goldStar.svg";

const OpenMessages = observer(({show, onHide}) => {
    const {radioStation} = useContext(Context)
    const param = useParams()
    const location = useLocation()
    const isAdminLoc = location.pathname === `/admin/${param.token}`
    const [errMessages, setErrMessages] = useState([]);
    const [errMessagesLs, setErrMessagesLs] = useState([]);
    const [ratMessages, setRatMessages] = useState([]);
    const [ratMessagesLs, setRatMessagesLs] = useState([]);
    const [showErrors, setShowErrors] = useState(true);
    const [showRatings, setShowRatings] = useState(false);

    useEffect(() => {
        getAllCustomRating().then(data => {
            setRatMessages(data);
            setRatMessagesLs(data.length);
        });
    }, [])
    const handleDeleteRat = (id) => {
        deleteCustomRating({id: id});
        setRatMessages(ratMessages.filter((ratMessage) => ratMessage.id !== id));
    }

    useEffect(() => {
        getAllCustomErrors().then(data => {
            setErrMessages(data);
            setErrMessagesLs(data.length);
        });
    }, [])
    const handleDeleteErr = (id) => {
        deleteCustomError({id: id});
        setErrMessages(errMessages.filter((errMessage) => errMessage.id !== id));
    }

    const toggleRate = async (id, userid, rating, description, name, email) => {
        try {
            const url = `http://front.server757413.nazwa.pl/addingRating/${userid}`;
            const {data: res} = await axios.put(url, {
                value: rating, description: description, name: name, email: email
            });
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
                marginTop: '15px',
            }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginRight: '15px',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        setShowErrors(!showErrors);
                        setShowRatings(false);
                    }}
                >
                    <div className={'errMessages'} style={{

                        marginBottom: '5px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: showErrors === true ? '#06B5AE' : '#fff',
                        borderRadius:'10px',
                        padding:'0 13px'
                    }}>
                        <p style={{
                            color: showErrors === true ? '#fff' : '#666',
                            margin: '0',
                            fontWeight: '500',
                            padding:'5px 0'
                        }}>Ошибки</p>
                        { errMessagesLs !== 0 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize:'16px',
                                padding:'5px 0 5px 10px',
                                borderLeft: showErrors === true ? '2px solid #F4F4F4' : '2px solid #CECECEFF',
                                margin:'0 0 0 10px',
                                color: showErrors === true ? '#fff' : '#666',
                                fontWeight: '500',
                                textAlign: 'center'
                            }}>
                                {errMessagesLs}
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className={'ratMessages'}
                    style={{
                        marginBottom: '5px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        cursor: 'pointer',
                        backgroundColor: showRatings === true ? '#06B5AE' : '#fff',
                        borderRadius:'10px',
                        padding:'0 13px'
                    }}
                    onClick={() => {
                        setShowErrors(false);
                        setShowRatings(!showRatings);
                    }}
                >
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <p style={{
                            color: showRatings === true ? '#fff' : '#666',
                            margin: '0',
                            fontWeight: '500',
                            padding:'5px 0'
                        }}>Отзывы</p>
                        { ratMessagesLs !== 0 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize:'16px',
                                padding:'5px 0 5px 10px',
                                borderLeft: showRatings === true ? '2px solid #F4F4F4' : '2px solid #CECECEFF',
                                margin:'0 0 0 10px',
                                color: showRatings === true ? '#fff' : '#666',
                                fontWeight: '500',
                                textAlign: 'center'
                            }}>
                                {ratMessagesLs}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                {showErrors && (<div className={'err-scroll'} style={{
                    width: '100%',
                    display: 'flex',
                    height: '450px',
                    maxHeight: '450px',
                    overflowY: 'auto',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginTop: '10px',
                }}>
                    {errMessages.length !== 0 ?
                        errMessages.map(errMessage => (
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'flex-start',
                                marginBottom: '10px',
                                flexDirection: 'column',
                                backgroundColor: '#fff',
                                padding: '5px 10px 10px',
                                borderRadius: '10px',
                                marginRight: '8px'
                            }}>
                                <div
                                    key={errMessage.id}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'flex-start',
                                    }}
                                >
                                    <div style={{width: '100%', flex: 1}}>
                                        <div className={'radio-err-msg'}>
                                            <p style={{margin: '0px', fontWeight: '600', marginRight: '10px'}}>
                                                Название радиостанции:</p>
                                            {errMessage.radioStationName}
                                        </div>
                                        <div className={'radio-err-msg'}
                                             style={{margin: '6px 0 0 0px', display: 'inline-block'}}>
                                            <p style={{margin: '0px', fontWeight: '600', marginRight: '10px'}}>
                                                Текст ошибки:</p>
                                            <p style={{margin: '0px', wordBreak: 'break-all', display: 'inline-block'}}>
                                                {errMessage.text}
                                            </p>
                                        </div>

                                    </div>
                                    <span
                                        style={{cursor: 'pointer', color: '#666', marginLeft: '5px', fontSize: '20px'}}
                                        onClick={() => handleDeleteErr(errMessage._id)}
                                    >
                                &times;
                            </span>
                                </div>
                                <div className={'radio-err-btn-data'}>
                                    <a className={'link-btn'} target="_blank" href={errMessage.radioStationLink}>Перейти к
                                        риадиостанции</a>
                                    <p className={'data-text'}>{new Date(errMessage.time).toLocaleString()}</p>
                                </div>
                            </div>))
                        : (
                            <div style={{display:'flex', textAlign:'center', alignSelf:'center', width:'100%', justifyContent:"center", marginRight:'10px'}}>
                                <h2>Сообщений об ошибках нет</h2>
                            </div>
                        )
                    }

                </div>)}
            </div>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                {showRatings && (<div className={'err-scroll'} style={{
                    width: '100%',
                    display: 'flex',
                    height: '450px',
                    maxHeight: '450px',
                    overflowY: 'auto',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginTop: '10px',
                }}>
                    {ratMessages.length !== 0 ?
                        ratMessages.map(
                            ratMessage => (<div style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'flex-start',
                                marginBottom: '10px',
                                flexDirection: 'column',
                                backgroundColor: '#fff',
                                padding: '5px 10px 10px',
                                borderRadius: '10px',
                                marginRight: '8px'
                            }}>
                                <div
                                    key={ratMessage.id}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'flex-start',
                                    }}
                                >
                                    <div style={{flex: 1}}>
                                        <div className={'radio-err-msg'}>
                                            <p style={{margin: '0px', fontWeight: '600', marginRight: '10px'}}>
                                                Имя отправителя:</p>
                                            {ratMessage.name}
                                        </div>
                                        <div className={'radio-err-msg'} style={{margin: '6px 0 0 0px'}}>
                                            <p style={{margin: '0px', fontWeight: '600', marginRight: '10px'}}>
                                                Почта отправителя:</p>
                                            {ratMessage.email}
                                        </div>
                                        <div className={'radio-err-msg'} style={{
                                            margin: '6px 0 0 0px', display: 'flex', flexWrap: 'nowrap', flexDirection: 'row'
                                        }}>
                                            <p style={{margin: '0px', fontWeight: '600', marginRight: '10px'}}>
                                                Оенка отзыва:</p>
                                            <img src={goldStar} alt="Star"
                                                 style={{marginRight: '5px', width: '18px'}}/>
                                            <p style={{margin: '0px', fontWeight: '500',}}>{ratMessage.value}</p>
                                        </div>
                                        <div className={'radio-err-msg'} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '100%',
                                            margin: '6px 0 0 0px',
                                            wordWrap: 'break-word',
                                            wordBreak: 'break-all'
                                        }}>
                                            <p style={{
                                                width: '100%', margin: '0px', fontWeight: '600', marginRight: '10px'
                                            }}>
                                                Описание отзыва:</p>
                                            {ratMessage.description}
                                        </div>
                                    </div>
                                    <span
                                        style={{cursor: 'pointer', color: '#666', marginLeft: '5px', fontSize: '20px'}}
                                        onClick={() => handleDeleteRat(ratMessage._id)}
                                    >
                                &times;
                            </span>
                                </div>
                                <div className={'radio-err-btn-data'}>
                                    <a className={'link-btn'}
                                       onClick={() => toggleRate(ratMessage._id, ratMessage.commentatorId, ratMessage.value, ratMessage.description, ratMessage.name, ratMessage.email,)}>Добавить
                                        отзыв</a>
                                    <p className={'data-text'}>{new Date(ratMessage.created).toLocaleString()}</p>
                                </div>
                            </div>))
                        : (
                            <div style={{display:'flex', textAlign:'center', alignSelf:'center', width:'100%', justifyContent:"center", marginRight:'10px'}}>
                                <h2>Новых отзывов пока нет</h2>
                            </div>
                    )}

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
