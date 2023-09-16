import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
<<<<<<< HEAD
import {createCountry} from "../../http/radioApi";
import "../../pages/Admin/admin.css";
=======
import {
    createCountry,
    deleteCountry,
    getAllCountries,

} from "../../http/radioApi";
import "../../pages/Admin/admin.css";
import {Context} from "../../index";
>>>>>>> deb7e21556671a12e89aeb549aaf0eb6dbd58a31

const CreateCountry = ({show, onHide}) => {
    const {radioStation} = useContext(Context);
    const [countries, setCountries] = useState([])


    useEffect(() => {
        getAllCountries().then(data => {
            radioStation.setCountries(data)
            setCountries(data)
        });
    }, [])

    const [value, setValue] = useState('')
    const addCountry = async () => {
        await createCountry({name: value}).then(data => {
            if (data.status === 409){
                alert(data.message)
            }
            setValue('');
        });
        await getAllCountries().then(data => {
            radioStation.setCountries(data)
            setCountries(data)
        });
    }
<<<<<<< HEAD
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
=======
    const handleDeleteCountry = (id) => {
        deleteCountry({id: id});
        setCountries(countries.filter((country) => country.id !== id));
    }

    return (<Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
    >
        <Modal.Header closeButton style={{backgroundColor: '#F4F4F4'}}>
            <Modal.Title id="contained-modal-title-vcenter" style={{fontSize:'20px', fontWeight:'bold'}}>
                Страны
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor: '#F4F4F4'}}>
            <div style={{width:'100%', display:'flex', justifyContent:'flex-start', flexDirection:'row', alignItems:'center', flexWrap:'wrap'}}>
                {countries.map(country => <div
                    key={country.id}
                    style={{
                        display: 'flex', alignItems: 'center', marginBottom: '10px',backgroundColor:'#fff', padding:"5px 10px", marginRight:'10px', borderRadius:'10px'
                    }}
                >
                    <p style={{margin: '0px'}}>{country.name}</p>
                    <span
                        style={{cursor: 'pointer', color: '#666', marginLeft: '5px'}}
                        onClick={() => handleDeleteCountry(country.id)}
                    >
                    &times;
                    </span>
                </div>)}
            </div>
            <Modal.Title id="contained-modal-title-vcenter" style={{margin:"10px 0 15px 0", fontSize:'18px', fontWeight:'bold'}}>
                Добавить страну
            </Modal.Title>
            <Form>
                <Form.Control
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={"Введите название страны"}
                    style={{
                        backgroundColor: '#fff', outline: 'none', border: '0', height: '42px', borderRadius: '10px'
                    }}
                />
            </Form>
        </Modal.Body>
        <Modal.Footer style={{backgroundColor: '#F4F4F4', width: '100%', justifyContent: 'space-between'}}>
            <Button variant={"outline-danger"} className='admin-additional-button'
                    onClick={onHide}>Закрыть</Button>
            <Button variant={"outline-success"} className='main-admin-button'
                    onClick={addCountry}>Добавить</Button>
        </Modal.Footer>
    </Modal>);
>>>>>>> deb7e21556671a12e89aeb549aaf0eb6dbd58a31
};

export default CreateCountry;
