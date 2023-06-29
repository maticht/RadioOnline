import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createGenre} from "../../http/radioApi";

const CreateGenre = ({show, onHide}) => {
    const [value, setValue] = useState('')

    const addGenre = () => {
        createGenre({name: value}).then(data => {
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
                    Добавить жанр
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите название жанра"}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"outline-danger"} onClick={onHide}>Закрыть</Button>
                <Button variant={"outline-success"} onClick={addGenre}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateGenre;