import React, {useContext, useEffect, useState} from 'react';
import {Button, Dropdown, Form, Modal} from "react-bootstrap";
import {Context} from "../../index";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import {createRadio, getAllCountries, getAllGenres, getAllLanguages} from "../../http/radioApi";
import {observer} from "mobx-react-lite";


const CreateRadio = observer(({show, onHide}) => {
    const {radioStation} = useContext(Context)
    const [title, setTitle] = useState('')
    const [radio, setRadio] = useState('')
    const [file, setFile] = useState(null)


    useEffect(() => {
        getAllGenres().then(data => radioStation.setGenres(data))
        getAllCountries().then(data => radioStation.setCountries(data))
        getAllLanguages().then(data => radioStation.setLanguages(data))
    }, [])


    const selectFile = e => {
        setFile(e.target.files[0])
    }

    const addRadio = () => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('radio', radio)
        formData.append('image', file)
        formData.append('country_id', radioStation.selectedCountry.id)
        formData.append('genre_id', radioStation.selectedGenre.id)
        formData.append('language_id', radioStation.selectedLanguage.id)
        createRadio(formData).then(data => onHide())
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
                    Добавить радиостанцию
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-3 mb-3">
                        <DropdownToggle>{radioStation.selectedGenre.name || 'Выберите жанр'}</DropdownToggle>
                        <DropdownMenu>
                            {radioStation.genres.map(genre =>
                                <Dropdown.Item onClick={() => radioStation.setSelectGenre(genre)}
                                               key={genre.id}> {genre.name} </Dropdown.Item>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown className="mt-3 mb-3">
                        <DropdownToggle>{radioStation.selectedCountry.name || 'Выберите страну'}</DropdownToggle>
                        <DropdownMenu>
                            {radioStation.countries.map(country =>
                                <Dropdown.Item onClick={() => radioStation.setSelectCountry(country)}
                                               key={country.id}> {country.name} </Dropdown.Item>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown className="mt-3 mb-3">
                        <DropdownToggle>{radioStation.selectedLanguage.name || 'Выберите язык'}</DropdownToggle>
                        <DropdownMenu>
                            {radioStation.languages.map(language =>
                                <Dropdown.Item onClick={() => radioStation.setSelectLanguage(language)}
                                               key={language.id}> {language.name} </Dropdown.Item>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                    <Form.Control
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="mt-3"
                        placeholder="Введите название радиостанции"
                    />
                    <Form.Control
                        value={radio}
                        onChange={e => setRadio(e.target.value)}
                        className="mt-3"
                        placeholder="Введите ссылку на радиостанцию"
                    />
                    <Form.Control
                        className="mt-3"
                        type="file"
                        onChange={selectFile}
                    />
                    <hr/>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"outline-danger"} onClick={onHide}>Закрыть</Button>
                <Button variant={"outline-success"} onClick={addRadio}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateRadio;