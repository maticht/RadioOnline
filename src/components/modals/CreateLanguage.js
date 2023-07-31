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
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить язык
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor: '#F4F4F4'}}>
                <div>
                    {languages.map(language => <div
                        key={language.id}
                        style={{
                            display: 'flex', alignItems: 'center', marginBottom: '10px',
                        }}
                    >
                        <p style={{marginRight: '10px'}}>{language.name}</p>
                        <span
                            style={{cursor: 'pointer', color: 'red', marginLeft: '5px'}}
                            onClick={() => handleDeleteLanguage(language.id)}
                        >
                    &times;
                    </span>
                    </div>)}
                </div>
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
                <Button variant={"outline-danger"} style={{width: '375px'}} className='admin-additional-button'
                        onClick={onHide}>Закрыть</Button>
                <Button variant={"outline-success"} style={{width: '375px'}} className='main-admin-button'
                        onClick={addLanguage}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateLanguage;
