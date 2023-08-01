import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createLanguage, deleteLanguage, getAllLanguages} from "../../http/radioApi";
import {Context} from "../../index";

const CreateLanguage = ({show, onHide}) => {
    const {radioStation} = useContext(Context);
    const [languages, setLanguages] = useState([])

    useEffect(() => {
        getAllLanguages().then(data => {
            radioStation.setLanguages(data)
            setLanguages(data)
        });
    }, [])

    const [value, setValue] = useState('')

    const addLanguage = async () => {
        await createLanguage({name: value}).then(data => {
            setValue('')
            onHide()
        });
        await getAllLanguages().then(data => {
            radioStation.setLanguages(data)
            setLanguages(data)
        });
    }

    const handleDeleteLanguage = (id) => {
        deleteLanguage({id: id});
        setLanguages(languages.filter((language) => language.id !== id));
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton style={{backgroundColor: '#F4F4F4'}}>
                <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:'20px', fontWeight:'bold'}}>
                    Языки
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor: '#F4F4F4'}}>
                <div style={{width:'100%', display:'flex', justifyContent:'flex-start', flexDirection:'row', alignItems:'center', flexWrap:'wrap'}}>
                    {languages.map(language => <div
                        key={language.id}
                        style={{
                            display: 'flex', alignItems: 'center', marginBottom: '10px',backgroundColor:'#fff', padding:"5px 10px", marginRight:'10px', borderRadius:'10px'
                        }}
                    >
                        <p style={{margin: '0px'}}>{language.name}</p>
                        <span
                            style={{cursor: 'pointer', color: '#666', marginLeft: '5px'}}
                            onClick={() => handleDeleteLanguage(language.id)}
                        >
                    &times;
                    </span>
                    </div>)}
                </div>
                <Modal.Title id="contained-modal-title-vcenter" style={{margin:"10px 0 15px 0", fontSize:'18px', fontWeight:'bold'}}>
                    Добавить язык
                </Modal.Title>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите язык"}
                        style={{
                            backgroundColor: '#fff',
                            outline: 'none',
                            border: '0',
                            height: '42px',
                            borderRadius: '10px'
                        }}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor: '#F4F4F4', width: '100%', justifyContent: 'space-between'}}>
                <Button variant={"outline-danger"} className='admin-additional-button'
                        onClick={onHide}>Закрыть</Button>
                <Button variant={"outline-success"} className='main-admin-button'
                        onClick={addLanguage}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateLanguage;
