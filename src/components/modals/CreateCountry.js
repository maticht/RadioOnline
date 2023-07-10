import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createCountry} from "../../http/radioApi";
import "../../pages/Admin/admin.css";

const CreateCountry = ({show, onHide}) => {

    const [value, setValue] = useState('')

    const addCountry = () => {
        createCountry({name: value}).then(data => {
            setValue('')
            onHide()
        })
    }
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton style={{backgroundColor:'#F4F4F4'}}>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить страну
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor:'#F4F4F4'}}>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите название страны"}
                        style={{backgroundColor:'#fff', outline:'none', border:'0', height:'42px', borderRadius:'10px'}}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor:'#F4F4F4', width:'100%', justifyContent:'space-between'}}>
                <Button variant={"outline-danger"} style={{width:'375px'}} className='admin-additional-button' onClick={onHide}>Закрыть</Button>
                <Button variant={"outline-success"} style={{width:'375px'}} className='main-admin-button' onClick={addCountry}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateCountry;
