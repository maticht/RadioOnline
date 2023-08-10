import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Col, Image} from "react-bootstrap";
import HeaderNavBar from '../../components/headerNavBar/headerNavBar';
import {createUseStyles} from "react-jss";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {createCustomRating} from "../../http/radioApi";
import goldStar from "../../img/goldStar.svg";
import online from "../../img/online.svg";
import './HomeScreen.css';
import Star from "../../img/Star1.svg";
import stop from '../../img/stop.svg'
import play from '../../img/play.svg'
import quiet from '../../img/quiet.svg'
import loud from '../../img/loud.svg'
import silently from '../../img/silently.svg'
import nonePrev from "../../img/noneprev.png";
import nofavorite from "../../img/nofavorite.svg";
import favorite from "../../img/favorite.svg";
import errormsg from "../../img/errormsg.svg";
import share from "../../img/share.svg";
import {Context} from "../../index";
import SendErrorMessage from "../../components/modals/SendErrorMessage";
import SendRatingMessage from "../../components/modals/SendRatingMessage";

import {
    fetchCurrentMusicName,
    fetchOneRadio, fetchOneRadioByLink,
    getAllCountries,
    getAllGenres,
    getFavoritesRadios,
    getRadios
} from "../../http/radioApi";
import Pages from "../../components/Pages/Pages";
import {observer} from "mobx-react-lite";
import Footer from "../../components/Footer/Footer";


const useStyles = createUseStyles({
    container: {
        backgroundColor: "#F1F1F1",
    },
    maxWidthContainer: {
        maxWidth: '1060px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: "#F1F1F1"
    },
});
const HomeScreen = observer(() => {
    const params = useParams();
    const classes = useStyles();
    const [selectedRadio, setSelectedRadio] = useState(null);
    const [radioOnline, setRadioOnline] = useState('');
    const {radioStation} = useContext(Context);
    const [selectGenre, setSelectGenre] = useState('');
    const [selectCountry, setSelectCountry] = useState('');
    const [selectLanguage, setSelectLanguage] = useState('');
    const [currentMusicName, setCurrentMusicName] = useState('Неизвестно');
    const [allReviews, setAllReviews] = useState(false);
    const [leaveReview, setLeaveReview] = useState(false);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [rating, setRating] = useState(0);
    const [ratingDesc, setRatingDesc] = useState({description: ""});
    const [ratingName, setRatingName] = useState({name: ""});
    const [ratingEmail, setRatingEmail] = useState({email: ""});
    const [volume, setVolume] = useState(50);
    const [bgSize, setBgSize] = useState('50% 100%');
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const navigation = useNavigate();
    const location = useLocation();
    const [isFavorite, setIsFavorite] = useState(false);
    const [sendError, setSendError] = useState(false)
    const storedFavorites = localStorage.getItem('favorites');
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    const [favoritesUS, setFavoritesUS] = useState(favorites);
    const [ratingArrUS, setRatingArrUs] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isLoading, setIsLoading] = useState(false);
    const [successfulAddRating, setSuccessfulAddRating] = useState(false);

    const isFav = location.pathname === '/favorites'
    const isFavWithId = location.pathname === `/favorites/${params.radioId}`


    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);
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


    const lowerSound = () => {
        setVolume(0);
        setBgSize(`0% 100%`);
    }
    const upperSound = () => {
        setVolume(50);
        setBgSize(`50% 100%`);
    }


    useEffect(() => {

        getAllCountries().then(data => radioStation.setCountries(data))
        getAllGenres().then(data => radioStation.setGenres(data))
        if (isFav || isFavWithId) {
            setIsLoading(true);
            getFavoritesRadios(localStorage.getItem('favorites')).then(data => {
                radioStation.setRadios(data);
                radioStation.setTotalCount(data.length);
                console.log('юз эффект с фав');
                setTimeout(() => {
                    setIsLoading(false);
                }, 10);
            })
        } else {
            setIsLoading(true);
            getRadios(null, null, radioStation.page, radioStation.limit, '').then(data => {
                    radioStation.setRadios(data[0]);
                    radioStation.setTotalCount(data[1]);
                    console.log('запрс из 1 useEffect');
                setTimeout(() => {
                    setIsLoading(false);
                }, 10);
                }
            )
        }
    }, [])

    useEffect(() => {
            setIsLoading(true);
            if (!isFav && !isFavWithId) {
                getRadios(radioStation.selectedCountry.id, radioStation.selectedGenre.id, radioStation.page, radioStation.limit, radioStation.searchName).then(data => {
                    radioStation.setRadios(data[0])
                    radioStation.setTotalCount(data[1])
                    console.log('запрс из 2 useEffect')
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 10);
                })
            }
        }, [radioStation.page, radioStation.selectedCountry, radioStation.selectedGenre, radioStation.searchName]
    )

    useEffect(() => {
        if (typeof (params.radioId) !== "undefined") {
            fetchOneRadioByLink(params.radioId).then(data => {
                setSelectedRadio(data[0]);
                setRadioOnline(data[0].online);
                setRatingArrUs(data[0].rating);
                setSelectGenre(data[1]);
                setSelectCountry(data[2]);
                setSelectLanguage(data[3]);
                if(!isFav && !isFavWithId){
                    radioStation.setSelectGenre(data[1])
                }
                setIsPlaying(true);
                audioRef.current.play();

            });
        }
    }, [params]);

    useEffect(() => {
        if (selectedRadio !== null) {
            const interval = setInterval(() => {
                fetchCurrentMusicName(selectedRadio).then(data => {
                    setCurrentMusicName(data.StreamTitle);
                    console.log(data);
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [selectedRadio]);

    const toggleRate = async (userid, rating, description, name, email) => {
        try {
            // const url = `http://localhost:8081/addingRating/${userid}`;
            // const {data: res} = await axios.put(url, {value: rating, description: description, name: name, email: email});
            // const nemRatingArr = [...ratingArrUS, {value: rating, description: description, name: name, email: email,}];
            await createCustomRating({
                value: rating,
                description: description,
                commentatorId: userid,
                name: name,
                email: email,
            })
            // setRatingArrUs(nemRatingArr)
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = ({currentTarget: input}) => {
        const {name, value} = input;

        if (value.length <= 2000) {
            setRatingDesc({...ratingDesc, [name]: value});
        } else {
            setRatingDesc({...ratingDesc, [name]: value.slice(0, 2000)});
        }
    };
    const handleChangeName = ({currentTarget: input}) => {
        const {name, value} = input;
        setRatingName({...ratingName, [name]: value});
    };
    const handleChangeEmail = ({currentTarget: input}) => {
        const {name, value} = input;
        setRatingEmail({...ratingEmail, [name]: value});
    };

    const handleAddRating = () => {
        if (ratingDesc.description === '' || ratingName.name === '' || ratingEmail.email === '') {
            alert('Заполните поля ввода для добавления отзыва')
        } else {
            toggleRate(selectedRadio._id, rating, ratingDesc.description, ratingName.name, ratingEmail.email)
                .then(() => {
                    setRating(0);
                    setRatingDesc({description: ""});
                    setRatingName({name: ""});
                    setRatingEmail({email: ""});
                })
                .catch(error => {
                    console.log(error);
                });
            setLeaveReview(false);
            setSuccessfulAddRating(true);
            setTimeout(() => {
                setSuccessfulAddRating(false);
            }, 5000);
        }
    };
    const handleRate = (value) => {
        setRating(value);
    };

    /* eslint-disable no-restricted-globals */
    const getOneRadio = (r) => {
        if (selectedRadio === null || r.title !== selectedRadio.title) {
            setSelectedRadio(r)
            setLeaveReview(false)
            setAllReviews(false)
            setRatingArrUs(r.rating)
            radioStation.setLimit(18)
            fetchCurrentMusicName(r).then(data => {
                setCurrentMusicName(data.StreamTitle)
                console.log(data)
            })
            fetchOneRadio(r.id).then(data => {
                setRadioOnline(data[0].online)
                setSelectGenre(data[1])
                setSelectCountry(data[2])
                setSelectLanguage(data[3])
                if(!isFav && !isFavWithId){
                    radioStation.setSelectGenre(data[1])
                }
                setIsPlaying(true);
                audioRef.current.play();
            });
            if (isFav || isFavWithId) {
                navigation(`/favorites/${r.radioLinkName}`)
            } else {
                navigation(`/${r.radioLinkName}`)
            }
        }
    }

    const togglePlayback = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
    const handleVolumeChange = (event, num) => {
        const newValue = event.target.value;
        setVolume(newValue);
        setBgSize(`${newValue}% 100%`);
    };

    const copyLinkAndShowMessage = () => {
        let currentUrl = window.location.href;
        if (location.pathname === `/favorites/${params.radioId}`) {
            currentUrl = currentUrl.replace('/favorites', '')
        }
        navigator.clipboard.writeText(currentUrl).then(r => {
        });
        setShowCopiedMessage(true);
        setTimeout(() => {
            setShowCopiedMessage(false);
        }, 1200);
    };
    // useEffect(() => {
    //     setIsFavorite(favorites.includes(selectedRadioId));
    // }, [favorites, selectedRadioId]);
    const handleAddToFavorites = (selectedRadioId) => {
        try {
            const index = favorites.indexOf(selectedRadioId);
            let newFavorites = [];
            if (index !== -1) {
                newFavorites = favorites.filter((radioId) => radioId !== selectedRadioId);
            } else {
                newFavorites = [...favorites, selectedRadioId];
            }
            setFavoritesUS(newFavorites);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            console.log(newFavorites);
        } catch (error) {
            console.log(error);
        }
    };

    const removeSelectedRadio = () => {
        setSelectedRadio(null)
    }


    return (
        <div className={classes.container}>
            <div className={classes.maxWidthContainer}>
                <HeaderNavBar setSelectedRadio={removeSelectedRadio}/>
                <div className={'bestSpecialists'}>
                    {selectedRadio === null
                        ?
                        <p style={{
                            fontSize: '20px',
                            margin: '0 0 px 0',
                            fontStyle: 'normal',
                            fontWeight: '700',
                            lineHeight: 'normal'
                        }}>{isFav || isFavWithId ? 'Избранные радиостанции' : `Слушать радио онлайн бесплатно`}</p>
                        :
                        <p style={{
                            fontSize: '20px',
                            margin: '0 0 5px 0',
                            fontStyle: 'normal',
                            fontWeight: '700',
                            lineHeight: 'normal'
                        }}>{`${selectedRadio.title} — слушать бесплатно`}</p>}
                    {selectedRadio && (
                        <div className='selectedRadio'>
                            <div className="radioBlock">
                                <div className='radioInfoBlock'>
                                    <div className='selectedRadioInfo'>
                                        <div>
                                            <div style={{position: 'relative', display: 'flex', flexDirection: 'row'}}>
                                                <div style={{
                                                    backgroundColor: '#ffffff',
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'space-between',
                                                    flexDirection: 'column',
                                                    borderRadius: '8px'
                                                }}>
                                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                                        <img style={{width: '16px'}} src={online} alt="star"/>

                                                        <p style={{margin: '0 0 0 5px', fontSize: '14px'}}>
                                                            {radioOnline}
                                                        </p>
                                                    </div>
                                                    <Image width={140} height={125}
                                                           className="mt-1 rounded rounded-10 d-block mx-auto"
                                                           src={selectedRadio.image !== 'image' ? 'http://localhost:8081/' + selectedRadio.image : nonePrev}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"sl-radio-info"}>
                                            <div style={{position: 'relative', display: 'flex', flexDirection: 'row'}}>
                                                <div className={'radioInfo'}>
                                                    <div style={{
                                                        width: '100%',
                                                        paddingBottom: '20px',
                                                        borderBottom: '1px solid #E9E9E9'
                                                    }}>
                                                        {ratingArrUS && ratingArrUS.length > 0 && ratingArrUS[0] !== '' && (
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                alignItems: 'center'
                                                            }}>
                                                                <img style={{width: '12px'}} src={goldStar} alt="star"/>
                                                                <p style={{
                                                                    margin: '0 0 0 2px',
                                                                    fontSize: '13px',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {(ratingArrUS.reduce((acc, rating) => acc + rating.value, 0) / ratingArrUS.length).toFixed(1)}
                                                                </p>
                                                                <p style={{margin: '0 0 0 5px', fontSize: '12px'}}>
                                                                    ({ratingArrUS.length} отзывов)
                                                                </p>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h6 style={{
                                                                fontWeight: 'bold',
                                                                fontSize: '14px'
                                                            }}>{selectedRadio.title}</h6>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        marginTop: '20px'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            justifyContent: 'space-between',
                                                            flexDirection: 'column',
                                                        }}>
                                                            <p style={{margin: '2px 0', fontSize: '12px'}}>Жанр</p>
                                                            <p style={{margin: '2px 0', fontSize: '12px'}}>Страна</p>
                                                            <p style={{margin: '2px 0', fontSize: '12px'}}>Язык</p>
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            justifyContent: 'space-between',
                                                            flexDirection: 'column',
                                                            margin: '0 0 0 10px'
                                                        }}>
                                                            <p style={{
                                                                margin: '2px 0',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold'
                                                            }}>{selectGenre.name}</p>
                                                            <p style={{
                                                                margin: '2px 0',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold'
                                                            }}>{selectCountry.name}</p>
                                                            <p style={{
                                                                margin: '2px 0',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold'
                                                            }}>{selectLanguage.name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="audio-player-block">
                                        <div className="audio-player">
                                            <audio ref={audioRef} src={selectedRadio.radio}></audio>
                                            <div className='audio-info'>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'flex-start',
                                                    marginRight: '-20px'
                                                }}>
                                                    <button className={`audio-play-btn `} onClick={togglePlayback}>
                                                        {isPlaying ? (
                                                            <img src={stop} alt="Stop" className="audio-icon"/>
                                                        ) : (
                                                            <img src={play} alt="Play" className="audio-icon"/>
                                                        )}
                                                    </button>
                                                    <div className={'music-title'}>
                                                        <p style={{
                                                            fontSize: '12px',
                                                            fontWeight: '400',
                                                            margin: '1px 0'
                                                        }}>Сейчас играет</p>
                                                        <div className='musicName'>
                                                            {currentMusicName.length > 32 ? (
                                                                <p style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: 'bold',
                                                                    margin: '1px 0',
                                                                    animation: 'marquee 8s linear infinite',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'visible',
                                                                    textOverflow: 'unset'
                                                                }}>
                                                                    {currentMusicName}
                                                                </p>
                                                            ) : (
                                                                <p style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: 'bold',
                                                                    margin: '1px 0',
                                                                }}>
                                                                    {currentMusicName}
                                                                </p>
                                                            )}

                                                        </div>

                                                    </div>
                                                </div>
                                                <p className='bitrate'>Битрейт: <span style={{
                                                    color: '#06B5AE',
                                                    margin: '0'
                                                }}>{selectedRadio.bitrate}</span></p>
                                            </div>

                                            <div className={'sound-radio'}>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    transform: 'rotate(90deg)',
                                                    marginRight: '10px',
                                                    marginTop: '8px',
                                                    width: '20px',
                                                    cursor: 'pointer'
                                                }}>
                                                    {volume <= 0 ? (
                                                        <img onClick={upperSound} style={{}} src={silently} alt="Stop"/>
                                                    ) : volume >= 80 ? (
                                                        <img onClick={lowerSound} src={loud} alt="Play"/>
                                                    ) : (
                                                        <img onClick={lowerSound} src={quiet} alt="Play"/>
                                                    )}
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={volume}
                                                    onChange={handleVolumeChange}
                                                    className="vertical-slider"
                                                    style={{backgroundSize: bgSize}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='btnsBlock'>
                                <div
                                    onClick={() => handleAddToFavorites(selectedRadio._id)}
                                    className="btnContainer"
                                >
                                    <img
                                        className="imgContainer"
                                        src={favoritesUS.includes(selectedRadio._id) ? favorite : nofavorite}
                                    />
                                    <p className="textContainer">Добавить <br/> в избранное</p>
                                </div>
                                <div
                                    onClick={() => setSendError(true)}
                                    className="btnContainer"
                                >
                                    <img className="imgContainer" src={errormsg}/>
                                    <p className="textContainer">Радио <br/> не работает</p>
                                </div>
                                <div className="shearContainer">
                                    <div
                                        className="btnContainer"
                                        onClick={copyLinkAndShowMessage}
                                    >
                                        <img className="imgContainer" src={share}/>
                                        <p className="textContainer" style={{
                                            marginTop: '10px',
                                            padding: '5px 10px',
                                        }}>Поделиться</p>
                                    </div>
                                    <div>
                                        {showCopiedMessage && (
                                            <div className="copiedMessage">
                                                Ссылка скопирована!
                                            </div>
                                        )}
                                    </div>
                                    <SendErrorMessage
                                        show={sendError}
                                        onHide={() => setSendError(false)}
                                        radio={selectedRadio}
                                    />
                                    <SendRatingMessage
                                        show={successfulAddRating}
                                        onHide={() => setSuccessfulAddRating(false)}
                                        radio={selectedRadio}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {selectedRadio !== null ? <p style={{
                            fontSize: '18px',
                            fontStyle: 'normal',
                            margin: '30px 0 10px 0',
                            fontWeight: '700',
                            lineHeight: 'normal'
                        }}>{isFav || isFavWithId ? `Избранные радиостанции` : `Похожие радиостанции`}</p>
                        : null}
                    <div>
                        {isLoading ? (
                            <div className={'allRadios'}>{[...Array(radioStation.radios.length || 24)].map((_, index) => (
                                <div key={index} className={'oneBestSpecialistsBlock'} style={{
                                    marginRight: handleMarginRight(index),
                                }}>
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
                                                width: "140px",
                                                height: '125px',
                                                marginTop: '10px',
                                                marginLeft: '10px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                alignContent: 'space-around',
                                                borderRadius: '10px',
                                                background: 'linear-gradient(to right, #e3e3e3, #f0f0f0, #f0f0f0, #e3e3e3)',
                                                backgroundSize: '200% 100%',
                                                animation: 'gradientAnimation 1s linear infinite',
                                            }}>
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
                                            <div style={{
                                                width: "140px",
                                                height: '30px',
                                                marginLeft: '10px',
                                                marginTop: '5px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                alignContent: 'space-around',
                                                borderRadius: '10px',
                                                background: 'linear-gradient(to right, #e3e3e3, #f0f0f0, #f0f0f0, #e3e3e3)',
                                                backgroundSize: '200% 100%',
                                                animation: 'gradientAnimation 1s linear infinite',
                                            }}>
                                            </div>
                                        </div>

                                    </Link>
                                </div>
                            ))}</div>
                        ) : (
                            <div className={'allRadios'}>
                                {radioStation.radios.map((radio, index) => (
                                    selectedRadio && selectedRadio.id === radio.id ? null : (
                                        <div
                                            className={'oneBestSpecialistsBlock'}
                                            key={radio.id}
                                            onClick={() => getOneRadio(radio)}
                                            style={{
                                                marginRight: handleMarginRight(index),
                                            }}
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
                                                    <p className="mx-auto"
                                                       style={{fontWeight: '500', margin: '5px 0 0 0',}}>
                                                        {(radio.title).length > 15 ? (radio.title).slice(0, 15) + '...' : radio.title}
                                                    </p>
                                                </div>

                                            </Link>
                                        </div>
                                    )))}
                            </div>
                        )}
                    </div>
                    <Pages/>
                    {selectedRadio && (
                        <div className="largeRadioBlock">
                            {leaveReview ?
                                <div style={{position: 'relative', zIndex: 1, marginBottom: '10px', marginTop: '15px'}}>
                                    <div style={{
                                        margin: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'column'
                                    }}>
                                        <div className={'rate-star'}>
                                            <p style={{
                                                fontSize: '18px',
                                                fontStyle: 'normal',
                                                margin: '30px 0 10px 0',
                                                fontWeight: '700',
                                                lineHeight: 'normal'
                                            }}>Оценить:</p>
                                            <div>
                                                <img onClick={() => handleRate(1)} style={{marginRight: '15px',}}
                                                     src={rating >= 1 ? goldStar : Star} alt={'Star'}/>
                                                <img onClick={() => handleRate(2)} style={{marginRight: '15px',}}
                                                     src={rating >= 2 ? goldStar : Star} alt={'Star'}/>
                                                <img onClick={() => handleRate(3)} style={{marginRight: '15px',}}
                                                     src={rating >= 3 ? goldStar : Star} alt={'Star'}/>
                                                <img onClick={() => handleRate(4)} style={{marginRight: '15px',}}
                                                     src={rating >= 4 ? goldStar : Star} alt={'Star'}/>
                                                <img onClick={() => handleRate(5)} style={{}}
                                                     src={rating >= 5 ? goldStar : Star} alt={'Star'}/>
                                            </div>
                                        </div>

                                        <div style={{
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            marginTop: '5px'
                                        }}>
                                            <input
                                                type="text"
                                                placeholder="Имя"
                                                name="name"
                                                onChange={handleChangeName}
                                                value={ratingName.name}
                                                required
                                                className="input"
                                                style={{width:'100%'}}
                                            />
                                        </div>
                                        <div style={{
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            marginTop: '5px'
                                        }}>
                                            <input
                                                type="text"
                                                placeholder="Email"
                                                name="email"
                                                onChange={handleChangeEmail}
                                                value={ratingEmail.email}
                                                required
                                                className="input"
                                                style={{width:'100%'}}
                                            />
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                        <textarea
                                            placeholder={rating === 0 ? "Поставьте оценку перед написанием комментария" : "Напишите комментарий к оценке"}
                                            name="description"
                                            onChange={handleChange}
                                            value={ratingDesc.description}
                                            required
                                            className="inputTop"
                                            style={{height: '50px', margin: '10px 0 0 0', width: '100%'}}
                                            disabled={rating === 0}
                                        />
                                        </div>
                                        <button onClick={handleAddRating} className="submit_btn"
                                                style={{width: '100%', margin: '15px 10px'}}>
                                            Добавить отзыв
                                        </button>
                                    </div>
                                </div>
                                : null}
                            <div style={{margin: '10px 0 13px 0', overflow: 'auto'}}>
                                <p style={{
                                    fontSize: '20px',
                                    fontStyle: 'normal',
                                    margin: '0 0 10px 0',
                                    fontWeight: '700',
                                    lineHeight: 'normal'
                                }}
                                >{`Отзывы`}</p>
                                {allReviews ?
                                    ratingArrUS.map((rating, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            flexDirection: 'column',
                                            padding: "10px 10px",
                                            backgroundColor: '#fff',
                                            borderRadius: '10px',
                                            textDecoration: "none",
                                            color: "#000000",
                                            marginBottom: '10px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                width: '100%',
                                                flexDirection: 'row',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center'
                                            }}>
                                                <p style={{
                                                    margin: '0px',
                                                    fontWeight: '700',
                                                    color: '#000',
                                                    fontSize: '14px'
                                                }}>{rating.name}</p>
                                                <div
                                                    style={{display: 'flex', flexDirection: 'row', marginLeft: '15px'}}>
                                                    <img src={goldStar} alt="Star"
                                                         style={{marginRight: '5px', width: '18px'}}/>
                                                    <p style={{margin: '0px', fontWeight: '500',}}>{rating.value}</p>
                                                </div>
                                            </div>
                                            <p style={{
                                                wordWrap: "break-word",
                                                color: '#000',
                                                margin: '5px 5px 5px 0',
                                                fontSize: '13px'
                                            }}>
                                                {rating.description}
                                            </p>

                                        </div>
                                    ))
                                    :
                                    ratingArrUS.slice(0, 2).map((rating, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            flexDirection: 'column',
                                            padding: "10px 10px",
                                            backgroundColor: '#fff',
                                            borderRadius: '10px',
                                            textDecoration: "none",
                                            color: "#000000",
                                            marginBottom: '10px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                width: '100%',
                                                flexDirection: 'row',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center'
                                            }}>
                                                <p style={{
                                                    margin: '0px',
                                                    fontWeight: '700',
                                                    color: '#000',
                                                    fontSize: '14px'
                                                }}>{rating.name}</p>
                                                <div
                                                    style={{display: 'flex', flexDirection: 'row', marginLeft: '15px'}}>
                                                    <img src={goldStar} alt="Star"
                                                         style={{marginRight: '5px', width: '18px'}}/>
                                                    <p style={{margin: '0px', fontWeight: '500',}}>{rating.value}</p>
                                                </div>
                                            </div>
                                            <p style={{
                                                wordWrap: "break-word",
                                                color: '#000',
                                                margin: '5px 5px 5px 0',
                                                fontSize: '13px'
                                            }}>
                                                {rating.description}
                                            </p>
                                        </div>))
                                }
                                <Col className="d-flex justify-content-between rate-btns-block">
                                    <Button
                                        variant={"outline-dark"}
                                        className="admin-additional-button submit_btn"
                                        onClick={() => setAllReviews(true)}
                                    >
                                        Читать все отзывы
                                    </Button>
                                    <Button
                                        variant={"outline-dark"}
                                        className="main-admin-button submit_btn"
                                        onClick={() => setLeaveReview(true)}
                                    >
                                        Оставить отзыв
                                    </Button>
                                </Col>
                            </div>
                        </div>
                    )}

                </div>

            </div>
            <Footer/>
        </div>
    );
})
export default HomeScreen;
