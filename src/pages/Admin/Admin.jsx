import '../../components/modals/CreateRadio/CreateRadio.css'
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {Button, Col, Dropdown, Form, Image} from "react-bootstrap";
import CreateGenre from "../../components/modals/CreateGenre";
import CreateCountry from "../../components/modals/CreateCountry";
import CreateRadio from "../../components/modals/CreateRadio/CreateRadio";
import CreateLanguage from "../../components/modals/CreateLanguage";
import {observer} from "mobx-react-lite";
import HeaderNavBar from '../../components/headerNavBar/headerNavBar';
import {createUseStyles} from "react-jss";
import {
    deleteRadio,
    fetchOneRadio,
    getAllCountries,
    getAllGenres,
    getAllLanguages,
    getRadios,
    updateRadio
} from "../../http/radioApi";
import {Context} from "../../index";
import {Link, useParams} from "react-router-dom";
import goldStar from "../../img/goldStar.svg";
import nonePrev from "../../img/noneprev.png";
import Pages from "../../components/Pages/Pages";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import "./admin.css";

const useStyles = createUseStyles({
    container: {
        backgroundColor: "#F1F1F1",
        paddingBottom:'60px'
    },
    maxWidthContainer: {
        maxWidth: '1060px',
        margin: '0 auto',
        backgroundColor: "#F1F1F1"
    },
});

const Admin = observer(() => {
    const param = useParams();
    const [countryVisible, setCountryVisible] = useState(false)
    const [genreVisible, setGenreVisible] = useState(false)
    const [languageVisible, setLanguageVisible] = useState(false)
    const [radioVisible, setRadioVisible] = useState(false)
    const [selectedRadio, setSelectedRadio] = useState(null);
    const [title, setTitle] = useState('')
    const [radioWave, setRadioWave] = useState([{ audioURL: '', bitrate: '' }, { audioURL: '', bitrate: '' }, { audioURL: '', bitrate: '' }]);
    const [radioLinkName, setRadioLinkName] = useState('')
    const [updGenre, setUpdGenre] = useState([])
    const [updCountry, setUpdCountry] = useState('')
    const [updLanguage, setUpdLanguage] = useState('')
    const [file, setFile] = useState(null)
    const [validateToken, setValidateToken] = useState(false)
    const {radioStation} = useContext(Context)
    const [showButtons, setShowButtons] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isLoading, setIsLoading] = useState(true);
    const classes = useStyles();

    const toggleButtons = () => {
        setShowButtons(!showButtons);
    };

    useEffect(() => {
        const fetchLastToken = async () => {
            try {
                setIsLoading(true)
                const {data} = await axios.get(`https://backend.radio-online.me/getLastToken`);

                setIsLoading(false);
                if (data.token === param.token) {
                    setValidateToken(true);
                }
                console.log(`${data.token} === ${param.token}`);
            } catch (err) {
                console.log(err);
            }
        };
        fetchLastToken();
    }, []);


    useEffect(() => {
        if (radioVisible === false) {
            console.log('a ue 1')
            getAllCountries().then(data => radioStation.setCountries(data))
            getAllGenres().then(data => radioStation.setGenres(data))
            getRadios(null, null, radioStation.page, radioStation.limit, '', radioStation.bitrate).then(data => {
                    radioStation.setRadios(data[0])
                    radioStation.setTotalCount(data[1])
                }
            )
        }
    }, [radioVisible])

    useEffect(() => {
            console.log('a ue 2')
            const genresIds = radioStation.selectedGenre.join(',')
            getRadios(radioStation.selectedCountry.id, genresIds, radioStation.page, radioStation.limit, radioStation.searchName, radioStation.bitrate).then(data => {
                radioStation.setRadios(data[0])
                radioStation.setTotalCount(data[1])
                console.log('page:' + radioStation.page)
            })
        }, [radioStation.page, radioStation.selectedCountry, radioStation.selectedGenre, radioStation.searchName]
    )
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleMarginRight = (index) => {
        if (windowWidth <= 339) {
            return index % 1 === index || 0 ? '0px' : '0px';
        } else if (windowWidth <= 355) {
            return index % 2 === 1 ? '0px' : '6px';
        } else if (windowWidth <= 360) {
            return index % 2 === 1 ? '0px' : '10px';
        } else if (windowWidth <= 535) {
            return index % 2 === 1 ? '0px' : '18px';
        } else if (windowWidth <= 713) {
            return index % 3 === 2 ? '0px' : '18px';
        } else if (windowWidth <= 891) {
            return index % 4 === 3 ? '0px' : '18px';
        } else if (windowWidth <= 1060) {
            return index % 5 === 4 ? '0px' : '18px';
        } else {
            return index % 6 === 5 ? '0px' : '20px';
        }
    };

    const selectFile = e => {
        setFile(e.target.files[0])
    }


    const refreshPage = () => {
        window.location.reload();
    }

    const getOneRadio = (r) => {
        fetchOneRadio(r.id).then(data => {
            setSelectedRadio(r)
            const genresIdArr = data[1].map((genre) => genre.id);
            setUpdGenre(genresIdArr)
            setUpdCountry(data[2])
            setUpdLanguage(data[3])
            setTitle(r.title)
            setRadioWave(JSON.parse(r.radio))
            setRadioLinkName(r.radioLinkName)
            console.log(data[0], data[1], data[2], data[3])
        })
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const toggleGenre = (genreId) => {
        setUpdGenre((prevGenres) => {
            if (prevGenres.includes(genreId)) {
                // Убираем жанр, если он уже в списке
                return prevGenres.filter(selected => selected !== genreId);
            } else {
                // Добавляем жанр, если его нет в списке
                return [...prevGenres, genreId];
            }
        });
    }

    const getCountries = async () => {
        getAllCountries().then(data => radioStation.setCountries(data))
    }

    const getGenres = async () => {
        getAllGenres().then(data => radioStation.setGenres(data))
    }

    const getLanguages = async () => {
        getAllLanguages().then(data => radioStation.setLanguages(data))
    }

    const deleteR = async (id) => {
        deleteRadio({id: id}).then(response => refreshPage())
    }

    const handleRadioInputChange = (index, field, value) => {
        if (field === 'bitrate') {
            const isValidBitrate = /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 1000;
            if (isValidBitrate || value === "") {
                const updatedRadio = [...radioWave];
                updatedRadio[index][field] = value;
                setRadioWave(updatedRadio);
            }
        } else {
            const updatedRadio = [...radioWave];
            updatedRadio[index][field] = value;
            setRadioWave(updatedRadio);
        }
    };

    const updateR = (id) => {
        console.log('popal')
        const formData = new FormData()
        formData.append('id', id)
        formData.append('title', title)
        formData.append('radio', JSON.stringify(radioWave));
        formData.append('radioLinkName', radioLinkName)
        formData.append('image', file)
        formData.append('imageName', selectedRadio.image)
        formData.append('country_id', updCountry.id)
        const genresIdsString = updGenre.join(',');
        formData.append('genre_id', genresIdsString)
        formData.append('language_id', updLanguage.id)
        updateRadio(formData).then(data => {
            if (data.status === 409){
                alert(data.message)
            }else{
                refreshPage()
            }

        })
    }



    return (
        <>
            {!isLoading ?
                validateToken === true ? (
                    <div className={classes.container}>
                        <div className={classes.maxWidthContainer}>
                            <HeaderNavBar/>
                            <div className={'bestSpecialists'}>
                                <div className="adminBlock">
                                    <div className="adminComtainer d-flex align-items-center justify-content-between"
                                         style={{display: 'flex', alignItems: 'center', margin: '0px'}}>
                                        <h2 className="mt-2 text-left my-2"
                                            style={{fontSize: '20px', fontWeight: 'bold', margin: '0px'}}>Админ панель</h2>
                                        <button
                                            variant={"outline-dark"}
                                            className={`${showButtons ? 'active' : ''}`}
                                            onClick={toggleButtons}
                                            style={{
                                                borderRadius: '50%',
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: '#06B5AE',
                                                border: '0',
                                                fontSize: '30px',
                                                fontWeight: 'bold',
                                                padding: '0 0 6px 0',
                                                color: '#fff',
                                                position: 'relative'
                                            }}
                                        >
                                        <span style={{
                                            display: 'inline-block',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            width: '3px',
                                            height: '15px',
                                            background: '#fff',
                                            borderRadius: '2px',
                                            transition: 'transform 0.3s',
                                            transform: `translate(-50%, -50%) rotate(${showButtons ? '90deg' : '90deg'})`
                                        }}></span>
                                            <span style={{
                                                display: 'inline-block',
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                width: '3px',
                                                height: '15px',
                                                background: '#fff',
                                                borderRadius: '2px',
                                                transition: 'transform 0.3s',
                                                transform: `translate(-50%, -50%) rotate(${showButtons ? '-90deg' : '180deg'})`
                                            }}></span>
                                        </button>

                                    </div>
                                    {showButtons && (
                                        <>
                                            <div className="d-flex justify-content-between admin-additional-button-block">
                                                <Button
                                                    variant={"outline-dark"}
                                                    className="mt-3 p-2 flex-fill admin-additional-button"
                                                    onClick={() => setCountryVisible(true)}
                                                >
                                                    Добавить страну
                                                </Button>
                                                <Button
                                                    variant={"outline-dark"}
                                                    className="mt-3 p-2 flex-fill admin-additional-button center-additional-button"
                                                    onClick={() => setGenreVisible(true)}
                                                >
                                                    Добавить жанр
                                                </Button>
                                                <Button
                                                    variant={"outline-dark"}
                                                    className="mt-3 p-2 flex-fill admin-additional-button"
                                                    onClick={() => setLanguageVisible(true)}
                                                >
                                                    Добавить язык
                                                </Button>
                                            </div>
                                            <Button
                                                variant={"outline-dark"}
                                                className="mt-3 p-2 main-admin-button main-admin-button-screen"
                                                onClick={() => setRadioVisible(true)}
                                            >
                                                Добавить радиостанцию
                                            </Button>
                                        </>
                                    )}
                                    <CreateCountry show={countryVisible} onHide={() => setCountryVisible(false)}/>
                                    <CreateGenre show={genreVisible} onHide={() => setGenreVisible(false)}/>
                                    <CreateLanguage show={languageVisible} onHide={() => setLanguageVisible(false)}/>
                                    <CreateRadio show={radioVisible} onHide={() => setRadioVisible(false)}/>
                                </div>

                                {selectedRadio && (
                                    <div className="largeRadioBlockAdmin">
                                        <div className={'dropdown-image-block'}>
                                            <div className="d-flex justify-content-start custom-dropdown-block"
                                                 style={{display: 'flex', flexDirection: 'column'}}>
                                                <Dropdown className="custom-dropdown custom-admin-dropdown" style={{
                                                    boxShadow: '0px 0px 18px rgba(133, 133, 133, 0.2',
                                                }} onClick={getGenres}>
                                                    <DropdownToggle
                                                        className="custom-dropdown-toggle custom-admin-dropdown-toggle" style={{backgroundColor: '#FFFFFF', color: '#909095'}}>{'Жанр'}</DropdownToggle>
                                                    <DropdownMenu
                                                        className="custom-dropdown-menu custom-admin-dropdown-menu">
                                                        {radioStation.genres.map(genre =>
                                                            <Dropdown.Item key={genre.id} onClick={(e) => e.stopPropagation()}>
                                                                <Form.Check
                                                                    className="checkboxOne"
                                                                    type="checkbox"
                                                                    label={genre.name.length >= 11 ? genre.name.slice(0, 12) : genre.name}
                                                                    checked={updGenre.includes(genre.id)}
                                                                    onChange={() => toggleGenre(genre.id)}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </Dropdown.Item>)}
                                                    </DropdownMenu>
                                                </Dropdown>
                                                <Dropdown className="custom-dropdown custom-admin-dropdown" style={{
                                                    boxShadow: '0px 0px 18px rgba(133, 133, 133, 0.2',
                                                }} onClick={getCountries}>
                                                    <DropdownToggle
                                                        className="custom-dropdown-toggle custom-admin-dropdown-toggle" style={{backgroundColor: '#FFFFFF', color: '#909095'}}>{updCountry.name || 'страна'}</DropdownToggle>
                                                    <DropdownMenu
                                                        className="custom-dropdown-menu custom-admin-dropdown-menu">
                                                        {radioStation.countries.map(country =>
                                                            <Dropdown.Item onClick={() => setUpdCountry(country)}
                                                                           key={country.id}> {country.name.length >= 13 ? country.name.slice(0,14) : country.name} </Dropdown.Item>
                                                        )}
                                                    </DropdownMenu>
                                                </Dropdown>
                                                <Dropdown className="custom-dropdown custom-admin-dropdown" style={{
                                                    boxShadow: '0px 0px 18px rgba(133, 133, 133, 0.2',
                                                }} onClick={getLanguages}>
                                                    <DropdownToggle
                                                        className="custom-dropdown-toggle custom-admin-dropdown-toggle" style={{backgroundColor: '#FFFFFF', color: '#909095'}}>{updLanguage.name || 'язык'}</DropdownToggle>
                                                    <DropdownMenu
                                                        className="custom-dropdown-menu custom-admin-dropdown-menu">
                                                        {radioStation.languages.map(language =>
                                                            <Dropdown.Item onClick={() => setUpdLanguage(language)}
                                                                           key={language.id}> {language.name.length >= 13 ? language.name.slice(0,14) : language.name} </Dropdown.Item>
                                                        )}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                            <div>
                                                <Image
                                                    width={150}
                                                    height={150}
                                                    style={{borderRadius: '8px'}}
                                                    src={selectedRadio.image !== 'image' ? 'https://backend.radio-online.me/' + selectedRadio.image : nonePrev}
                                                />
                                            </div>
                                        </div>
                                        <div className={'select-admin-radio-info'}>
                                            <div className="d-flex justify-content-between select-admin-radio-inputs">
                                                <Form className='admin-input-block'>
                                                    <p style={{margin: '0 15px 0 0', fontWeight: '500'}}>Название:</p>
                                                    <Form.Control
                                                        value={title}
                                                        onChange={e => setTitle(e.target.value)}
                                                        placeholder={selectedRadio.title ? selectedRadio.title : "Введите название"}
                                                        className='admin-input'
                                                    />
                                                </Form>
                                                <Form className='admin-input-block'>
                                                    <p style={{margin: '0 15px 0 0', fontWeight: '500'}}>Отображение:</p>
                                                    <Form.Control
                                                        value={radioLinkName}
                                                        onChange={e => setRadioLinkName(e.target.value)}
                                                        placeholder={selectedRadio.radioLinkName}
                                                        className='admin-input'
                                                    />
                                                </Form>
                                                <Form className='admin-input-block' style={{marginBottom:'0'}}>
                                                    <p style={{margin: '0 15px 0 0', fontWeight: '500'}}>Файл:</p>
                                                    <Form.Control
                                                        type="file"
                                                        onChange={selectFile}
                                                        className='fileBtn admin-input'
                                                    />
                                                </Form>
                                            </div>
                                            <div className="d-flex justify-content-between select-admin-radio-inputs" style={{marginTop:'10px'}}>
                                                <Form className='admin-input-block'>
                                                    <div style={{display:'flex', flexDirection: 'row', width:'100%', justifyContent:'space-between'}}>
                                                        <p style={{margin: '0 15px 0 0', fontWeight: '500'}}>Ссылка:</p>
                                                        <p style={{margin: '0 22px 0 0', fontWeight: '500'}}>Битрейт:</p>
                                                    </div>
                                                    <div style={{display:'flex', flexDirection: 'row', width:'100%'}}>
                                                        <Form.Control
                                                            value={radioWave[0].audioURL}
                                                            onChange={(e) =>
                                                                handleRadioInputChange(0, 'audioURL', e.target.value)
                                                            }
                                                            className='admin-input'
                                                            placeholder="Введите ссылку на радиостанцию"
                                                            style={{backgroundColor:'#fff', outline:'none', border:'0', height:'42px', borderRadius:'10px'}}
                                                        />
                                                        <Form.Control
                                                            value={radioWave[0].bitrate}
                                                            onChange={(e) =>
                                                                handleRadioInputChange(0, 'bitrate', e.target.value)
                                                            }
                                                            className='admin-input'
                                                            placeholder="Битрейт"
                                                            style={{backgroundColor:'#fff', outline:'none', border:'0', height:'42px', borderRadius:'10px', width:'85px', marginLeft:'15px'}}
                                                        />
                                                    </div>
                                                </Form>
                                                <Form className='admin-input-block'>
                                                    <div style={{display:'flex', flexDirection: 'row', width:'100%', justifyContent:'space-between'}}>
                                                        <p style={{margin: '0 15px 0 0', fontWeight: '500'}}>Ссылка:</p>
                                                        <p style={{margin: '0 22px 0 0', fontWeight: '500'}}>Битрейт:</p>
                                                    </div>
                                                    <div style={{display:'flex', flexDirection: 'row', width:'100%'}}>
                                                        <Form.Control
                                                            value={radioWave[1].audioURL}
                                                            onChange={(e) =>
                                                                handleRadioInputChange(1, 'audioURL', e.target.value)
                                                            }
                                                            className='admin-input'
                                                            placeholder="Введите ссылку на радиостанцию"
                                                            style={{backgroundColor:'#fff', outline:'none', border:'0', height:'42px', borderRadius:'10px'}}
                                                        />
                                                        <Form.Control
                                                            value={radioWave[1].bitrate}
                                                            onChange={(e) =>
                                                                handleRadioInputChange(1, 'bitrate', e.target.value)
                                                            }
                                                            className='admin-input'
                                                            placeholder="Битрейт"
                                                            style={{backgroundColor:'#fff', outline:'none', border:'0', height:'42px', borderRadius:'10px', width:'85px', marginLeft:'15px'}}
                                                        />
                                                    </div>
                                                </Form>
                                                <Form className='admin-input-block' style={{marginBottom:'0'}}>
                                                    <div style={{display:'flex', flexDirection: 'row', width:'100%', justifyContent:'space-between'}}>
                                                        <p style={{margin: '0 15px 0 0', fontWeight: '500'}}>Ссылка:</p>
                                                        <p style={{margin: '0 22px 0 0', fontWeight: '500'}}>Битрейт:</p>
                                                    </div>
                                                    <div style={{display:'flex', flexDirection: 'row', width:'100%'}}>
                                                        <Form.Control
                                                            value={radioWave[2].audioURL}
                                                            onChange={(e) =>
                                                                handleRadioInputChange(2, 'audioURL', e.target.value)
                                                            }
                                                            className='admin-input'
                                                            placeholder="Введите ссылку на радиостанцию"
                                                            style={{backgroundColor:'#fff', outline:'none', border:'0', height:'42px', borderRadius:'10px'}}
                                                        />
                                                        <Form.Control
                                                            value={radioWave[2].bitrate}
                                                            onChange={(e) =>
                                                                handleRadioInputChange(2, 'bitrate', e.target.value)
                                                            }
                                                            className='admin-input'
                                                            placeholder="Битрейт"
                                                            style={{backgroundColor:'#fff', outline:'none', border:'0', height:'42px', borderRadius:'10px', width:'85px', marginLeft:'15px'}}
                                                        />
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>
                                        <Col className="d-flex justify-content-between admin-btns-block">
                                            <Button
                                                variant={"outline-dark"}
                                                style={{margin: '15px 0 0 0'}}
                                                className="admin-additional-button admin-btn"
                                                onClick={() => deleteR(selectedRadio.id)}

                                            >
                                                Удалить
                                            </Button>
                                            <Button
                                                variant={"outline-dark"}
                                                style={{margin: '15px 0 0 0'}}
                                                className="main-admin-buttonn admin-btn"
                                                onClick={() => updateR(selectedRadio.id)}
                                            >
                                                Обновить
                                            </Button>
                                        </Col>
                                    </div>
                                )}
                                <p style={{
                                    fontSize: '18px',
                                    fontStyle: 'normal',
                                    margin: '20px 0 10px 0',
                                    fontWeight: '700',
                                    lineHeight: 'normal'
                                }}>{`Все радиостанции`}</p>
                                <div className={'allRadios'}>
                                    {radioStation.radios.map((radio, index) => (
                                        <div className={'oneBestSpecialistsBlock'}
                                             key={radio.id}
                                             onClick={() => getOneRadio(radio)}
                                             // style={{
                                             //     marginRight: handleMarginRight(index),
                                             // }}
                                        >
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
                                                    <div style={{
                                                        position: 'relative',
                                                        display: 'flex',
                                                        flexDirection: 'row'
                                                    }}>
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
                                                                <img style={{width: '15px'}} src={goldStar} alt="star"/>
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
                                                               src={radio.image !== 'image' ? 'https://backend.radio-online.me/' + radio.image : nonePrev}/>

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
                                                        {(radio.title).length > 15 ? (radio.title).slice(0, 15) + '...' : radio.title}
                                                    </p>
                                                </div>

                                            </Link>
                                        </div>
                                    ))}
                                </div>
                                <Pages/>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        display: "flex",
                        height: '100vh',
                        backgroundColor: '#F4F4F4',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        alignContent: 'center'
                    }}>
                        <div style={{
                            display: "flex",
                            padding: "30px 50px",
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            alignContent: 'center',
                            margin: '10px 20px'
                        }}>
                            <h1 style={{
                                fontWeight: '900',
                                color: '#06B5AE',
                                marginBottom: '20px',
                                fontSize: '100px',
                                textAlign: 'center'
                            }}>404</h1>
                            <h4 style={{
                                fontWeight: '700',
                                color: '#000000',
                                marginBottom: '20px',
                                textAlign: 'center'
                            }}>Страница не найдена</h4>
                            <p style={{
                                fontSize: '18px',
                                fontWeight: '400',
                                color: '#000000',
                                marginBottom: '20px',
                                textAlign: 'center'
                            }}>Перейдите на главную или подтвердите, что вы администратор ещё раз</p>
                            <Link to="/" style={{
                                border: 'none',
                                borderRadius: '10px',
                                backgroundColor: '#06B5AE',
                                color: '#fff',
                                fontWeight: "500",
                                padding: '10px 20px',
                                marginBottom: '20px',
                                textDecoration: "none"
                            }}>
                                На главную
                            </Link>

                        </div>
                    </div>
                ) : (
                <div></div>
            )}
        </>
    );
});

export default Admin;
