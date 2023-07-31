import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {
    createGenre,
    deleteGenre,
    getAllGenres,
} from "../../http/radioApi";
import {Context} from "../../index";

const CreateGenre = ({show, onHide}) => {
    const {radioStation} = useContext(Context);
    const [genres, setGenres] = useState([])

    useEffect(() => {
        getAllGenres().then(data => {
            radioStation.setGenres(data)
            setGenres(data)
        });
    }, [])

    const [value, setValue] = useState('')
    const addGenre = async () => {
        await createGenre({name: value}).then(data => {
            setValue('')
            onHide()
        });
        await getAllGenres().then(data => {
            radioStation.setGenres(data)
            setGenres(data)
        });
    }

    const handleDeleteGenre = (id) => {
        deleteGenre({id:id});
        setGenres(genres.filter((genre)=> genre.id!==id));
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton  style={{backgroundColor:'#F4F4F4'}}>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить жанр
                </Modal.Title>
            </Modal.Header>
            <Modal.Body  style={{backgroundColor:'#F4F4F4'}}>
                <div>
                    {genres.map(genre => <div
                        key={genre.id}
                        style={{
                            display: 'flex', alignItems: 'center', marginBottom: '10px',
                        }}
                    >
                        <p style={{marginRight: '10px'}}>{genre.name}</p>
                        <span
                            style={{cursor: 'pointer', color: 'red', marginLeft: '5px'}}
                            onClick={() => handleDeleteGenre(genre.id)}
                        >
                    &times;
                    </span>
                    </div>)}
                </div>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите название жанра"}
                        style={{backgroundColor:'#fff', outline:'none', border:'0', height:'42px', borderRadius:'10px'}}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer  style={{backgroundColor:'#F4F4F4', width:'100%', justifyContent:'space-between'}}>
                <Button variant={"outline-danger"} style={{width:'375px'}} className='admin-additional-button' onClick={onHide}>Закрыть</Button>
                <Button variant={"outline-success"}  style={{width:'375px'}} className='main-admin-button' onClick={addGenre}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateGenre;
