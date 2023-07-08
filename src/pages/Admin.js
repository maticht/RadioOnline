import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Container, Image, Navbar, Row, Form, Dropdown} from "react-bootstrap";
import CreateGenre from "../components/modals/CreateGenre";
import CreateCountry from "../components/modals/CreateCountry";
import CreateRadio from "../components/modals/CreateRadio";
import CreateLanguage from "../components/modals/CreateLanguage";
import {observer} from "mobx-react-lite";
import HeaderNavBar from '../components/headerNavBar/headerNavBar';
import {createUseStyles} from "react-jss";
import {
    deleteRadio,
    fetchOneRadio,
    getAllCountries,
    getAllGenres, getAllLanguages,
    getRadios,
    updateRadio
} from "../http/radioApi";
import {Context} from "../index";
import {Link, useLocation} from "react-router-dom";
import goldStar from "../img/goldStar.svg";
import nonePrev from "../img/noneprev.png";
import Pages from "../components/Pages/Pages";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";



const Admin = observer(() => {
    const [countryVisible, setCountryVisible] = useState(false)
    const [genreVisible, setGenreVisible] = useState(false)
    const [languageVisible, setLanguageVisible] = useState(false)
    const [radioVisible, setRadioVisible] = useState(false)
    const [selectedRadio, setSelectedRadio] = useState(null);
    const [title, setTitle] = useState('')
    const [radioWave, setRadioWave] = useState('')
    const [updGenre, setUpdGenre] = useState('')
    const [updCountry, setUpdCountry] = useState('')
    const [updLanguage, setUpdLanguage]= useState('')
    const [file, setFile] = useState(null)
    const {radioStation} = useContext(Context)


    useEffect(() => {
        radioStation.setSearchName('')
        radioStation.setSelectCountry({})
        radioStation.setSelectGenre({})
        getAllCountries().then(data => radioStation.setCountries(data))
        getAllGenres().then(data => radioStation.setGenres(data))
        getRadios(null, null, radioStation.page, radioStation.limit, '').then(data => {
                radioStation.setRadios(data[0])
                radioStation.setTotalCount(data[1])
            }
        )
    }, [])

    useEffect(() => {
            getRadios(radioStation.selectedCountry.id, radioStation.selectedGenre.id, radioStation.page, radioStation.limit, radioStation.searchName).then(data => {
                radioStation.setRadios(data[0])
                radioStation.setTotalCount(data[1])
                console.log('page:' + radioStation.page)
            })
        }, [radioStation.page, radioStation.selectedCountry, radioStation.selectedGenre, radioStation.searchName]
    )

    const selectFile = e => {
        setFile(e.target.files[0])
    }


    const refreshPage = () => {
        window.location.reload();
    }

    const getOneRadio = (r)=>{
        fetchOneRadio(r.id).then(data=>{
            setSelectedRadio(r)
            setUpdGenre(data[1])
            setUpdCountry(data[2])
            setUpdLanguage(data[3])
            setTitle(r.title)
            setRadioWave(r.radio)
            console.log()
        })
    }

    const getCountries = async() =>{
            getAllCountries().then(data => radioStation.setCountries(data))
    }

    const getGenres = async() =>{
            getAllGenres().then(data => radioStation.setGenres(data))
    }

    const getLanguages = async() =>{
            getAllLanguages().then(data => radioStation.setLanguages(data))
    }

    const deleteR = async (id) =>{
        deleteRadio({id: id}).then(response => refreshPage())
    }

    const updateR = (id) =>{
        console.log('popal')
        const formData = new FormData()
        formData.append('id', id)
        formData.append('title', title)
        formData.append('radio', radioWave)
        formData.append('image', file)
        formData.append('imageName', selectedRadio.image)
        formData.append('country_id', updCountry.id)
        formData.append('genre_id', updGenre.id)
        formData.append('language_id',updLanguage.id)
        updateRadio(formData).then(response => refreshPage())
    }

    const useStyles = createUseStyles({
        container: {
            minHeight: "100vh",
            backgroundColor: "#F1F1F1"
        },
    });
    const classes = useStyles();

    return (
        <>
            <div className={classes.container}>
                <HeaderNavBar/>
                <div className={'bestSpecialists'}>
                    <Container className="d-flex flex-column">
                        <h2 className="mt-2 text-center my-2">Админ панель</h2>
                        <Col className="d-flex justify-content-between">
                            <Button
                                variant={"outline-dark"}
                                className="mt-3 p-2 flex-fill"
                                onClick={() => setCountryVisible(true)}
                            >
                                Добавить страну
                            </Button>
                            <Button
                                variant={"outline-dark"}
                                className="mt-3 p-2 flex-fill mx-4"
                                onClick={() => setGenreVisible(true)}
                            >
                                Добавить жанр
                            </Button>
                            <Button
                                variant={"outline-dark"}
                                className="mt-3 p-2 flex-fill"
                                onClick={() => setLanguageVisible(true)}
                            >
                                Добавить язык
                            </Button>
                        </Col>
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

                    {selectedRadio && (
                        <div className="largeRadioBlockAdmin">
                            <Row>
                                <Col className="flex-grow-1">
                                    <div>
                                        <Image
                                            width={150}
                                            height={150}
                                            className="mt-1 rounded rounded-10 d-block mx-auto"
                                            src={selectedRadio.image !== 'image' ? 'http://localhost:8081/' + selectedRadio.image : nonePrev}
                                        />
                                    </div>
                                    <Form.Control
                                        type="file"
                                        onChange={selectFile}
                                    />
                                </Col>

                                <Col className="flex-grow-1">
                                    <p className="mx-auto" style={{fontWeight: '500', margin: '5px 0 0 0'}}>
                                        Название радио
                                    </p>
                                    <Form>
                                    <Form.Control
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder={selectedRadio.title}
                                    />
                                </Form>
                                    <p className="mx-auto" style={{fontWeight: '500', margin: '5px 0 0 0'}}>
                                        Ссылка на радио
                                    </p>
                                    <Form>
                                        <Form.Control
                                            value={radioWave}
                                            onChange={e => setRadioWave(e.target.value)}
                                            placeholder={selectedRadio.radio}
                                        />
                                    </Form>
                                    <p className="mx-auto" style={{fontWeight: '500', margin: '5px 0 0 0'}}>
                                        Параметры радио
                                    </p>
                                    <Col className="d-flex justify-content-between">
                                        <Dropdown className="custom-dropdown" onClick={getGenres}>
                                            <DropdownToggle className="custom-dropdown-toggle" style={{width:'170px',marginRight: '25px', backgroundColor: '#FFFFFF', color: '#909095'}}>{updGenre.name|| 'жанр' }</DropdownToggle>
                                            <DropdownMenu className="custom-dropdown-menu" style={{width:'170px'}}>
                                                {radioStation.genres.map(genre =>
                                                    <Dropdown.Item onClick={() => setUpdGenre(genre)}
                                                                   key={genre.id}> {genre.name} </Dropdown.Item>
                                                )}
                                            </DropdownMenu>
                                        </Dropdown>
                                        <Dropdown className="custom-dropdown" onClick={getCountries}>
                                            <DropdownToggle className="custom-dropdown-toggle" style={{width:'170px',marginRight: '25px', backgroundColor: '#FFFFFF', color: '#909095'}}>{updCountry.name || 'страна' }</DropdownToggle>
                                            <DropdownMenu className="custom-dropdown-menu" style={{width:'170px'}}>
                                                {radioStation.countries.map(country =>
                                                    <Dropdown.Item onClick={() => setUpdCountry(country)}
                                                                   key={country.id}> {country.name} </Dropdown.Item>
                                                )}
                                            </DropdownMenu>
                                        </Dropdown>
                                        <Dropdown className="custom-dropdown" onClick={getLanguages}>
                                            <DropdownToggle className="custom-dropdown-toggle" style={{width:'170px',marginRight: '25px', backgroundColor: '#FFFFFF', color: '#909095'}}>{updLanguage.name|| 'язык'}</DropdownToggle>
                                            <DropdownMenu className="custom-dropdown-menu" style={{width:'170px'}}>
                                                {radioStation.languages.map(language =>
                                                    <Dropdown.Item onClick={() => setUpdLanguage(language)}
                                                                   key={language.id}> {language.name} </Dropdown.Item>
                                                )}
                                            </DropdownMenu>
                                        </Dropdown>
                                    </Col>
                                {/* Вторая колонка */}
                                </Col>
                            </Row>
                            <Col className="d-flex justify-content-between">
                                <Button
                                    variant={"outline-dark"}
                                    className="mt-3 p-2 flex-fill mx-2"
                                    onClick={() => deleteR(selectedRadio.id)}
                                >
                                    Удалить
                                </Button>
                                <Button
                                    variant={"outline-dark"}
                                    className="mt-3 p-2 flex-fill mx-2"
                                    onClick={() => updateR(selectedRadio.id)}
                                >
                                    Обновить
                                </Button>
                            </Col>

                        </div>
                    )}

                    <div
                        style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                        {radioStation.radios.map((radio) => (
                            <div className={'oneBestSpecialistsBlock'} key={radio.id}
                                 onClick={() => getOneRadio(radio)}>
                                <Link style={{
                                    textDecoration: "none",
                                    color: "#000",
                                    flexDirection: 'column',
                                    height: '100%',
                                    width: '100%'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignContent: 'space-between'
                                    }}>
                                        <div style={{position: 'relative', display: 'flex', flexDirection: 'row'}}>
                                            {radio.rating && radio.rating.length > 0 && radio.rating[0] !== '' && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 1,
                                                    left: 1,
                                                    backgroundColor: '#ffffff',
                                                    padding: '13px 5px 1px 12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRadius: '8px'
                                                }}>
                                                    <img style={{width: '12px'}} src={goldStar} alt="star"/>
                                                    <p style={{margin: '0 0 0 2px', fontSize: '13px'}}>
                                                        {(radio.rating.reduce((acc, rating) => acc + rating.value, 0) / radio.rating.length).toFixed(1)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{
                                            marginTop: '10px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            alignContent: 'space-around'
                                        }}>
                                            <Image width={140} height={125}
                                                   className="mt-1 rounded rounded-10 d-block mx-auto"
                                                   src={radio.image !== 'image' ? 'http://localhost:8081/' + radio.image : nonePrev}/>

                                        </div>
                                    </div>
                                    <div style={{
                                        marginTop: '10px',
                                        paddingTop: '2px',
                                        borderTop: "1px solid #EAEAEA",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignContent: 'space-around'
                                    }}>
                                        <p className="mx-auto" style={{fontWeight: '500', margin: '5px 0 0 0'}}>
                                            {radio.title}
                                        </p>
                                    </div>

                                </Link>
                            </div>
                        ))}
                    </div>
                    <Pages/>
                </div>
            </div>
        </>
    );
});

export default Admin;
