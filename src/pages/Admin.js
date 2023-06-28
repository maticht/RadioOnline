import React, {useState} from 'react';
import {Button, Col, Container, Navbar} from "react-bootstrap";
import CreateGenre from "../components/modals/CreateGenre";
import CreateCountry from "../components/modals/CreateCountry";
import CreateRadio from "../components/modals/CreateRadio";
import CreateLanguage from "../components/modals/CreateLanguage";
import {observer} from "mobx-react-lite";
import HeaderNavBar from '../components/headerNavBar/headerNavBar';


const Admin = observer(() => {
    const [countryVisible, setCountryVisible] = useState(false)
    const [genreVisible, setGenreVisible] = useState(false)
    const [languageVisible, setLanguageVisible] = useState(false)
    const [radioVisible, setRadioVisible] = useState(false)

    return (
        <>

        <Container className="d-flex flex-column">

            <h2 className="mt-2">Админ панель</h2>

            <Button
                variant={"outline-dark"}
                className="mt-3 p-2 mt-3"
                onClick={() => setCountryVisible(true)}
            >
                Добавить страну
            </Button>
            <Button
                variant={"outline-dark"}
                className="mt-3 p-2"
                onClick={() => setGenreVisible(true)}
            >
                Добавить жанр
            </Button>
            <Button
                variant={"outline-dark"}
                className="mt-3 p-2"
                onClick={() => setLanguageVisible(true)}
            >
                Добавить язык
            </Button>
            <Button
                variant={"outline-dark"}
                className="mt-3 p-2"
                onClick={() => setRadioVisible(true)}
            >
                Добавить радиостанцию
            </Button>
            <CreateCountry show={countryVisible} onHide={() => setCountryVisible(false)}/>
            <CreateGenre show={genreVisible} onHide={() => setGenreVisible(false)}/>
            <CreateLanguage show={languageVisible} onHide={() => setLanguageVisible(false)}/>
            <CreateRadio show={radioVisible} onHide={() => setRadioVisible(false)}/>
        </Container>
        </>
    );
});

export default Admin;