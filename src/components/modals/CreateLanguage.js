import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createLanguage} from "../../http/radioApi";

const CreateLanguage = ({show, onHide}) => {
    const [value, setValue] = useState('')

    const addLanguage = () => {
        createLanguage({name: value}).then(data => {
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
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить язык
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите язык"}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"outline-danger"} onClick={onHide}>Закрыть</Button>
                <Button variant={"outline-success"} onClick={addLanguage}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateLanguage;