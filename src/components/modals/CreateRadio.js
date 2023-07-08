import React, {useContext, useEffect, useState} from 'react';
import {Button, Dropdown, Form, Modal, Col} from "react-bootstrap";
import {Context} from "../../index";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import {createRadio, getAllCountries, getAllGenres, getAllLanguages} from "../../http/radioApi";
import {observer} from "mobx-react-lite";
import {useLocation} from "react-router-dom";

const CreateRadio = observer(({show, onHide}) => {
    const {radioStation} = useContext(Context)
    const [title, setTitle] = useState('')
    const [radio, setRadio] = useState('')
    const [genreToAdd, setGenreToAdd] =useState('')
    const[countryToAdd, setCountryToAdd] =useState('')
    const[languageToAdd, setLanguageToAdd] = useState('')
    const [file, setFile] = useState(null)
    const location = useLocation()
    const isAdminLoc = location.pathname === '/admin'

    useEffect(() => {
        getAllGenres().then(data => radioStation.setGenres(data))
        getAllCountries().then(data => radioStation.setCountries(data))
        getAllLanguages().then(data => radioStation.setLanguages(data))
    }, [])

    const getCountries = async() =>{
        if(isAdminLoc){
            getAllCountries().then(data => radioStation.setCountries(data))
        }
    }

    const getGenres = async() =>{
        if(isAdminLoc) {
            getAllGenres().then(data => radioStation.setGenres(data))
        }
    }

    const getLanguages = async() =>{
        if(isAdminLoc) {
            getAllLanguages().then(data => radioStation.setLanguages(data))
        }
    }

    const selectFile = e => {
        setFile(e.target.files[0])
    }

    const addRadio = () => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('radio', radio)
        formData.append('image', file)
        formData.append('country_id', countryToAdd.id)
        formData.append('genre_id', genreToAdd.id)
        formData.append('language_id',languageToAdd.id)
        createRadio(formData).then(data => onHide())
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
                    Добавить радиостанцию
                </Modal.Title>
            </Modal.Header>
            <Modal.Body  style={{backgroundColor:'#F4F4F4', padding:'0 15px'}}>
                <Form>
                    <Form.Control
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="mt-3"
                        placeholder="Введите название радиостанции"
                        style={{backgroundColor:'#fff', outline:'none', border:'0', height:'42px', borderRadius:'10px'}}
                    />
                    <Form.Control
                        value={radio}
                        onChange={e => setRadio(e.target.value)}
                        className="mt-3"
                        placeholder="Введите ссылку на радиостанцию"
                        style={{backgroundColor:'#fff', outline:'none', border:'0', height:'42px', borderRadius:'10px'}}
                    />
                    <Col className="d-flex justify-content-between" style={{display:'flex', alignItems:'center'}}>
                        <Dropdown className="custom-dropdown" onClick={getGenres}>
                            <DropdownToggle className="custom-dropdown-toggle" style={{ width: '160px', marginRight: '25px', backgroundColor: '#FFFFFF', color: '#909095' }}>
                                {genreToAdd.name || 'Выберите жанр'}
                            </DropdownToggle>
                            <DropdownMenu className="custom-dropdown-menu" style={{ width: '150px', maxHeight:'250px', overflowY: 'auto' }}>
                                {radioStation.genres.map(genre =>
                                    <Dropdown.Item onClick={() => setGenreToAdd(genre)} key={genre.id}>
                                        {genre.name}
                                    </Dropdown.Item>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown className="custom-dropdown" style={{width:'170px'}} onClick={getCountries}>
                            <DropdownToggle className="custom-dropdown-toggle" style={{width:'170px',marginRight: '25px', backgroundColor: '#FFFFFF', color: '#909095'}}>{ countryToAdd.name|| 'Выберите страну'}</DropdownToggle>
                            <DropdownMenu className="custom-dropdown-menu" style={{width:'170px', maxHeight:'250px', overflowY: 'auto'}}>
                                {radioStation.countries.map(country =>
                                    <Dropdown.Item onClick={() => setCountryToAdd(country)}
                                                   key={country.id}> {country.name} </Dropdown.Item>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown className="custom-dropdown" onClick={getLanguages}>
                            <DropdownToggle className="custom-dropdown-toggle" style={{width:'160px',marginRight: '25px', backgroundColor: '#FFFFFF', color: '#909095'}}>{languageToAdd.name || 'Выберите язык'}</DropdownToggle>
                            <DropdownMenu className="custom-dropdown-menu" style={{width:'150px', maxHeight:'250px', overflowY: 'auto'}}>
                                {radioStation.languages.map(language =>
                                    <Dropdown.Item onClick={() => setLanguageToAdd(language)}
                                                   key={language.id}> {language.name} </Dropdown.Item>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                        <Form.Control
                            className="mt-3 fileBtn"
                            type="file"
                            onChange={selectFile}
                            style={{backgroundColor:'#fff', outline:'none', border:'0', height:'42px', borderRadius:'10px', marginBottom:'15px'}}
                        />
                    </Col>

                </Form>
            </Modal.Body>
            <Modal.Footer  style={{backgroundColor:'#F4F4F4', width:'100%', justifyContent:'space-between'}}>
                <Button variant={"outline-danger"} style={{width:'375px'}} className='admin-additional-button' onClick={onHide}>Закрыть</Button>
                <Button variant={"outline-success"} style={{width:'375px'}} className='main-admin-button' onClick={addRadio}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateRadio;
