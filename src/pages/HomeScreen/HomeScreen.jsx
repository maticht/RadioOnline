import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Col, Image} from "react-bootstrap";
import HeaderNavBar from '../../components/headerNavBar/headerNavBar';
import {createUseStyles} from "react-jss";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {
    createCustomRating,
    decrementBitrate,
    fetchCurrentMusicName,
    fetchOneRadioByLink,
    getAllCountries,
    getAllGenres,
    getFavoritesRadios,
    getRadios,
    incrementBitrate,
} from "../../http/radioApi";
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
import shearlogo from "../../img/shearlogo.svg";
import oklogo from '../../img/oklogo.svg';
import fblogo from '../../img/fblogo.svg';
import vklogo from '../../img/vklogo.svg';
import tglogo from '../../img/tglogo.svg';
import instlogo from '../../img/instlogo.png';
import wtplogo from '../../img/wtplogo.png';
import {Context} from "../../index";
import SendErrorMessage from "../../components/modals/SendErrorMessage";
import SendRatingMessage from "../../components/modals/SendRatingMessage";
import Pages from "../../components/Pages/Pages";
import {observer} from "mobx-react-lite";
import Footer from "../../components/Footer/Footer";
import { Helmet } from 'react-helmet-async';


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
    const [selectGenre, setSelectGenre] = useState([]);
    const [selectCountry, setSelectCountry] = useState('');
    const [selectLanguage, setSelectLanguage] = useState('');
    const [currentMusicName, setCurrentMusicName] = useState('Загрузка...');
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
    const [bitrateNumber, setBitrateNumber] = useState(0);
    const [currentUrl, setCurrentUrl] = useState(window.location.href);
    const [inputCurrentUrl, setInputCurrentUrl] = useState(window.location.href);
    const wrapperRef = useRef(null);
    const [visibleReviews, setVisibleReviews] = useState(2);

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
                }, 100);
            });
        } else {
            setIsLoading(true);

            let radioId;
            if (selectedRadio !== null) {
                radioId = selectedRadio.id;
            }
            getRadios(null, null, radioStation.page, radioStation.limit, '', radioId, radioStation.bitrate).then(data => {
                    radioStation.setRadios(data[0]);
                    radioStation.setTotalCount(data[1]);
                    console.log('запрс из 1 useEffect');
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 100);
                }
            )
        }
    }, [])

    useEffect(() => {
            setIsLoading(true);
            let radioId;
            if (selectedRadio !== null) {
                radioId = selectedRadio.id;
            }
            console.log(radioStation.selectedGenre)
            const genresIds = radioStation.selectedGenre.join(',')
            if (!isFav && !isFavWithId) {
                getRadios(radioStation.selectedCountry.id, genresIds, radioStation.page, radioStation.limit, radioStation.searchName, radioId, radioStation.bitrate).then(data => {
                    radioStation.setRadios(data[0])
                    radioStation.setTotalCount(data[1]);
                    console.log('запрс из 2 useEffect')
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 100);
                })
            }
        }, [radioStation.page, radioStation.selectedCountry, radioStation.selectedGenre, radioStation.searchName]
    )

    // const [htmlData, setHtmlData] = useState(""); // Состояние для HTML-кода
    function replaceHtmlWithNewContent(newHtml) {
        const tempDiv = document.createElement('div');
// Вставляем в него HTML-код, который вы хотите использовать в теге <head>
        tempDiv.innerHTML = newHtml;

// Получаем ссылку на текущий тег <head> в документе
        const currentHead = document.head;

// Удаляем все дочерние элементы из текущего тега <head>
        while (currentHead.firstChild) {
            currentHead.removeChild(currentHead.firstChild);
        }

// Вставляем новые элементы из временного div в текущий тег <head>
        while (tempDiv.firstChild) {
            currentHead.appendChild(tempDiv.firstChild);
        }
    }


    useEffect(() => {
        if (typeof (params.radioId) !== "undefined") {
            setLeaveReview(false)
            setAllReviews(false)
            radioStation.setLimit((windowWidth <= 535) ? 8 : (windowWidth <= 720) ? 12 : 18);
            // (windowWidth <= 535) ? radioStation.setLimit(8) :
            fetchOneRadioByLink(params.radioId).then(data => {
                setIsLoading(true);
                setSelectedRadio(data[0]);

                const ogTags = [
                    { property: 'og:title', content: `Radio Online - ${data[0].title}` },
                    { property: 'og:image', content: `https://backend.radio-online.me/${data[0].image}` },
                    { property: 'og:description', content: `Слушайте радиостанцию "${data[0].title}" на radio-online.me` },
                ];

                // Устанавливаем метатеги с помощью react-helmet-async
                const helmet = document.querySelector('head');
                ogTags.forEach(tag => {
                    const tagElement = document.createElement('meta');
                    tagElement.setAttribute('property', tag.property);
                    tagElement.setAttribute('content', tag.content);
                    helmet.appendChild(tagElement);
                });

                setRadioOnline(data[0].online);
                setRatingArrUs(data[0].rating);
                console.log(selectGenre);
                console.log(data[1]);
                setSelectGenre(data[1]);
                setSelectCountry(data[2]);
                setSelectLanguage(data[3]);
                console.log(data[4]);
                //replaceHtmlWithNewContent(data[4]);
                if (!isFav && !isFavWithId) {
                    const genresIdArr = data[1].map((genre) => genre.id);
                    radioStation.setSelectGenre(genresIdArr)
                    console.log(radioStation.selectedGenre)
                }
                audioRef.current.play();
                togglePlayback();
                setTimeout(() => {
                    setIsLoading(false);
                }, 500);

            });
        }
    }, [params]);


    useEffect(() => {
        if (selectedRadio !== null) {
            const interval = setInterval(() => {
                fetchCurrentMusicName(selectedRadio).then(data => {
                    if (data.StreamTitle === '') {
                        setCurrentMusicName(`${selectedRadio.title}`);
                    } else {
                        setCurrentMusicName(data.StreamTitle);
                    }
                    console.log(data);
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [selectedRadio]);

    const toggleRate = async (userid, rating, description, name, email) => {
        try {
            // const url = `https://backend.radio-online.me/addingRating/${userid}`;
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
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            setIsLoading(true);
            setSelectedRadio(r);
            radioStation.setSearchName('');
            fetchCurrentMusicName(r).then(data => {
                if (data.StreamTitle === '') {
                    setCurrentMusicName(`${r.title}`);
                } else {
                    setCurrentMusicName(data.StreamTitle);
                }
                console.log(data)
            });
            setTimeout(() => {
                setIsPlaying(true);
                audioRef.current.play();
            }, 200)

            // });
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
    const toggleBitrateChange = (bitrateNumber) => {
        setTimeout(() => {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.play();
            }
            setBitrateNumber(bitrateNumber);
        }, 200)
    };
    const handleVolumeChange = (event, num) => {
        const newValue = event.target.value;
        setVolume(newValue);
        setBgSize(`${newValue}% 100%`);
    };

    const copyLinkAndShowMessage = () => {
        let currentUrl = window.location.href;
        setCurrentUrl(currentUrl);
        setInputCurrentUrl(currentUrl);
        if (location.pathname === `/favorites/${params.radioId}`) {
            currentUrl = currentUrl.replace('/favorites', '');
        }
        navigator.clipboard.writeText(currentUrl).then(() => {
            (showCopiedMessage !== true) ? setShowCopiedMessage(true) : setShowCopiedMessage(false)
        }).catch(err => console.error('Could not copy text: ', err));

    };

    const copyLinkToClipboard = () => {
        if (selectedRadio !== null) {
            navigator.clipboard.writeText(currentUrl).then(() => {
                setInputCurrentUrl('Скопировано!')
            }).catch(err => console.error('Could not copy text: ', err));
        }

    };
    let socialMediaLogos = [];
    if (selectedRadio !== null) {
        const radioTitle = selectedRadio.title.includes('адио') ? selectedRadio.title : `Радио ${selectedRadio.title}`;
        const sharingText = `Слушать ${radioTitle} бесплатно`;
        socialMediaLogos = [
            {
                name: 'Telegram',
                logo: tglogo,
                url: `https://telegram.me/share/url?url=${encodeURIComponent(`${sharingText}\n${currentUrl}`)}`
            },
            {
                name: 'VK',
                logo: vklogo,
                url: `https://vk.com/share.php?url=${encodeURIComponent(`${sharingText}\n${currentUrl}`)}`
            },
            {
                name: 'Facebook',
                logo: fblogo,
                url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${sharingText}\n${currentUrl}`)}`
            },
            {
                name: 'OK',
                logo: oklogo,
                url: `https://connect.ok.ru/offer?url=${encodeURIComponent(`${sharingText}\n${currentUrl}`)}`
            },
            {
                name: 'WhatsApp',
                logo: wtplogo,
                url: `https://wa.me/?text=${encodeURIComponent(`${sharingText}\n${currentUrl}`)}`
            },
            {
                name: 'Instagram',
                logo: instlogo,
                url: `https://www.instagram.com/?url=${encodeURIComponent(`${sharingText}\n${currentUrl}`)}`
            }
        ];
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowCopiedMessage(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);


    const handleAddToFavorites = async (selectedRadioId) => {
        try {
            const index = favorites.indexOf(selectedRadioId);
            let newFavorites = [];
            if (index !== -1) {
                newFavorites = favorites.filter((radioId) => radioId !== selectedRadioId);
                await decrementBitrate(params.radioId);
            } else {
                newFavorites = [...favorites, selectedRadioId];
                await incrementBitrate(params.radioId);
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

    const genreOutput = (genreArr) => {
        if (genreArr.length > 1) {
            const genresNames = genreArr.map((genre) => genre.name);
            return genresNames.join(', ')
        } else {
            return genreArr[0].name;
        }
    }

    return (
        <div className={classes.container}>
            {selectedRadio !== null ? (
                <Helmet>
                    {/* HTML Meta Tags*/}
                    <title>Radio Online</title>
                    <meta name="description" content="Здарова бандиты, это Сережа Соколов, узнали ?"/>

                    {/*Facebook Meta Tags*/}
                    <meta property="og:url" content={`https://radio-online.me/${selectedRadio.radioLinkName}`}/>
                    <meta property="og:type" content="music.radio_station"/>
                    <meta property="og:title" content={`Radio Online - ${selectedRadio.title}`}/>
                    <meta property="og:description" content={`Слушайте радиостанцию "${selectedRadio.title}" на radio-online.me`}/>
                    <meta property="og:image" content={`https://backend.radio-online.me/${selectedRadio.image}`}/>

                    {/*Twitter Meta Tags*/}
                    <meta name="twitter:card" content="summary_large_image"/>
                    <meta property="twitter:domain" content="radio-online.me"/>
                    <meta property="twitter:url" content={`https://radio-online.me/${selectedRadio.radioLinkName}`}/>
                    <meta name="twitter:title" content={`Radio Online - ${selectedRadio.title}`}/>
                    <meta name="twitter:description" content={`Слушайте радиостанцию "${selectedRadio.title}" на radio-online.me`}/>
                    <meta name="twitter:image" content={`https://backend.radio-online.me/${selectedRadio.image}`}/>
                </Helmet>
            ) : (
                <Helmet>
                    {/* HTML Meta Tags*/}
                    <title>RadioOnline</title>
                    <meta name="description" content="Слушайте любимые радиостанции с удовольствием на площадке Radio Online!" data-rh="true"/>

                    {/*Facebook Meta Tags*/}
                    <meta property="og:url" content="https://radio-online.me" data-rh="true"/>
                    <meta property="og:type" content="music.radio_station" data-rh="true"/>
                    <meta property="og:title" content="RadioOnline" data-rh="true"/>
                    <meta property="og:description" content="Слушайте любимые радиостанции с удовольствием на площадке Radio Online!" data-rh="true"/>
                    <meta property="og:image" content="image_holder" data-rh="true"/>

                    {/*Twitter Meta Tags*/}
                    <meta name="twitter:card" content="summary_large_image" data-rh="true"/>
                    <meta property="twitter:domain" content="radio-online.me" data-rh="true"/>
                    <meta property="twitter:url" content="https://radio-online.me" data-rh="true"/>
                    <meta name="twitter:title" content="Radio Online" data-rh="true"/>
                    <meta name="twitter:description" content="Слушайте любимые радиостанции с удовольствием на площадке Radio Online!" data-rh="true"/>
                    <meta name="twitter:image" content="image_holder" data-rh="true"/>
                </Helmet>
            )}
            <div className={classes.maxWidthContainer}>
                <HeaderNavBar setSelectedRadio={removeSelectedRadio} isSelectedRadioActive={selectedRadio !== null}/>
                <div className={'bestSpecialists'}>
                    {selectedRadio === null ?
                        <p style={{
                            fontSize: '20px',
                            margin: '0 0 px 0',
                            fontStyle: 'normal',
                            fontWeight: '700',
                            lineHeight: 'normal'
                        }}>{isFav || isFavWithId ? 'Избранные радиостанции' : `Радио онлайн — слушать бесплатно`}</p>
                        : isLoading ? (
                            <div className='bitrate' style={{
                                width: "250px",
                                height: '30px',
                                display: 'flex',
                                marginTop: '-7px',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignContent: 'space-around',
                                borderRadius: '10px',
                                background: 'linear-gradient(to right, #e3e3e3, #f0f0f0, #f0f0f0, #e3e3e3)',
                                backgroundSize: '200% 100%',
                                animation: 'gradientAnimation 1s linear infinite',
                            }}>
                            </div>
                        ) : (
                            <title style={{
                                fontSize: '20px',
                                margin: '0 0 5px 0',
                                fontStyle: 'normal',
                                fontWeight: '700',
                                lineHeight: 'normal'
                            }}>{`${selectedRadio.title} — слушать бесплатно`}</title>
                        )
                    }
                    {selectedRadio && (
                        <div className='selectedRadio'>
                            <div className="radioBlock">
                                <div className='radioInfoBlock'>
                                    <div className='selectedRadioInfo'>
                                        <div>
                                            <div style={{position: 'relative', display: 'flex', flexDirection: 'row'}}>
                                                {isLoading ? (
                                                    <div>
                                                        <div style={{
                                                            width: "140px",
                                                            height: '25px',
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
                                                        <div style={{
                                                            marginTop: '10px',
                                                            width: "140px",
                                                            height: '120px',
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
                                                ) : (
                                                    <div style={{
                                                        backgroundColor: '#ffffff',
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        justifyContent: 'space-between',
                                                        flexDirection: 'column',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <Image width={140} height={140}
                                                               className="mt-1 rounded rounded-10 d-block mx-auto"
                                                               src={selectedRadio.image !== 'image' ? 'https://backend.radio-online.me/' + selectedRadio.image : nonePrev}/>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={"sl-radio-info"}>
                                            <div style={{position: 'relative', display: 'flex', flexDirection: 'row'}}>
                                                <div className={'radioInfo'}>
                                                    {isLoading ? (
                                                        <div style={{
                                                            width: "150px",
                                                            height: '65px',
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
                                                    ) : (
                                                        <div style={{
                                                            width: '100%',
                                                            paddingBottom: '15px',
                                                            paddingTop: '5px',
                                                            borderBottom: '1px solid #E9E9E9'
                                                        }}>
                                                            {/*{ratingArrUS && ratingArrUS.length > 0 && ratingArrUS[0] !== '' && (*/}
                                                            {/*    <div style={{*/}
                                                            {/*        display: 'flex',*/}
                                                            {/*        flexDirection: 'row',*/}
                                                            {/*        alignItems: 'center'*/}
                                                            {/*    }}>*/}
                                                            {/*        <img style={{margin: '0', width: '14px'}}*/}
                                                            {/*             src={goldStar} alt="star"/>*/}
                                                            {/*        <p style={{*/}
                                                            {/*            margin: '1px 0 0 2px',*/}
                                                            {/*            fontSize: '13px',*/}
                                                            {/*            fontWeight: '500'*/}
                                                            {/*        }}>*/}
                                                            {/*            {(ratingArrUS.reduce((acc, rating) => acc + rating.value, 0) / ratingArrUS.length).toFixed(1)}*/}
                                                            {/*        </p>*/}
                                                            {/*        <p style={{margin: '0 0 0 5px', fontSize: '12px'}}>*/}
                                                            {/*            ({ratingArrUS.length} отзывов)*/}
                                                            {/*        </p>*/}
                                                            {/*    </div>*/}
                                                            {/*)}*/}
                                                            <div>
                                                                <h6 style={{
                                                                    margin: '0 0 0 0',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '14px'
                                                                }}>{selectedRadio.title}</h6>
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                marginTop: '5px'
                                                            }}>
                                                                <img style={{width: '16px'}} src={online} alt="online"/>

                                                                <p style={{margin: '0 0 0 5px', fontSize: '14px'}}>
                                                                    {radioOnline}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {isLoading ? (
                                                        <div style={{
                                                            marginTop: '20px',
                                                            width: "150px",
                                                            height: '65px',
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
                                                    ) : (
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
                                                                <p style={{
                                                                    margin: '2px 0',
                                                                    fontSize: '12px'
                                                                }}>Страна</p>
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
                                                                }}>{genreOutput(selectGenre)}</p>
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
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="audio-player-block">
                                        <div className="audio-player">
                                            <audio ref={audioRef}
                                                   src={JSON.parse(selectedRadio.radio)[bitrateNumber].audioURL}></audio>
                                            <div className='audio-info'>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'flex-start',
                                                    marginRight: '-20px'
                                                }}>
                                                    <button className={`audio-play-btn`} onClick={togglePlayback}>
                                                        {currentMusicName === 'Загрузка...' ? (
                                                            <div className="loading-icon"></div>
                                                        ) : isLoading ? (
                                                            <div className="loading-icon"></div>
                                                        ) : isPlaying ? (
                                                            <img src={stop} alt="Stop" className="audio-icon"/>
                                                        ) : (
                                                            <img src={play} alt="Play" className="audio-icon"/>
                                                        )}
                                                    </button>
                                                    {isLoading ? (
                                                        <div className={'music-title musicName'} style={{
                                                            height: '60px',
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
                                                    ) : (
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
                                                    )}
                                                </div>
                                                {isLoading ? (
                                                    <div className='bitrate' style={{
                                                        width: "100px",
                                                        height: '30px',
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
                                                ) : (
                                                    <p className='bitrate'>Битрейт:
                                                        <span style={{
                                                            color: '#06B5AE',
                                                            fontWeight: bitrateNumber === 0 ? 500 : 200,
                                                            margin: '0 0 0 5px',
                                                            cursor: 'pointer'
                                                        }}
                                                              onClick={() => toggleBitrateChange(0)}>
                                                            {JSON.parse(selectedRadio.radio)[0].bitrate}
                                                        </span>
                                                        <span style={{
                                                            color: '#06B5AE',
                                                            margin: '0 0 0 5px',
                                                            fontWeight: bitrateNumber === 1 ? 500 : 200,
                                                            cursor: 'pointer'
                                                        }}
                                                              onClick={() => toggleBitrateChange(1)}
                                                        >
                                                            {JSON.parse(selectedRadio.radio)[1].bitrate}
                                                        </span>
                                                        <span style={{
                                                            color: '#06B5AE',
                                                            margin: '0 0 0 5px',
                                                            fontWeight: bitrateNumber === 2 ? 500 : 200,
                                                            cursor: 'pointer'
                                                        }}
                                                              onClick={() => toggleBitrateChange(2)}
                                                        >
                                                            {JSON.parse(selectedRadio.radio)[2].bitrate}
                                                        </span>
                                                    </p>
                                                )}
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
                                <div className="shearContainer" ref={wrapperRef}>
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
                                                <div>
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: "row",
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <input type="text" value={inputCurrentUrl}/>
                                                        <img style={{
                                                            width: '20px',
                                                            marginLeft: '8px',
                                                            cursor: "pointer"
                                                        }} src={shearlogo} onClick={copyLinkToClipboard}/>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        marginTop: "10px",
                                                        marginBottom: "5px"
                                                    }}>
                                                        {socialMediaLogos.map((platform, index) => (
                                                            <img
                                                                key={index}
                                                                style={{width: '24px', cursor: 'pointer'}}
                                                                src={platform.logo}
                                                                alt={platform.name}
                                                                onClick={() => window.open(platform.url, '_blank')}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
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
                            <div className={'allRadios'}>
                                {/*{[...Array(radioStation.radios && radioStation.radios.length > 0 ? radioStation.radios.length : 24)].map((_, index) => (*/}
                                {[...Array(radioStation.limit)].map((_, index) => (
                                    <div key={index} className={'oneBestSpecialistsBlock'}
                                        //      style={{
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

                                    <div
                                        className={'oneBestSpecialistsBlock'}
                                        key={radio.id}
                                        onClick={() => getOneRadio(radio)}
                                        // style={{
                                        //     marginRight: handleMarginRight(selectedRadio && selectedRadio.id !== radio.id ? (index - 1) : index),
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
                                                            <img style={{width: '15px', margin: '0 0 3px 0'}}
                                                                 src={goldStar} alt="star"/>
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
                                                padding: radio.title.length >= 17 ? '4px 5px 0 5px' : '12px 5px 0 5px',
                                                borderTop: "1px solid #EAEAEA",
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                alignContent: 'space-around'
                                            }}>
                                                <p className="mx-auto"
                                                   style={{
                                                       fontWeight: '500',
                                                       margin: '0 0 0 0',
                                                       textAlign: 'center',
                                                       lineHeight: '16px'
                                                   }}>
                                                    {radio.title}
                                                    {/*{(radio.title).length > 15 ? (radio.title).slice(0, 15) + '...' : radio.title}*/}
                                                </p>
                                            </div>

                                        </Link>
                                    </div>
                                ))}
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
                                                <img onClick={() => handleRate(1)}
                                                     style={{marginRight: '15px', width: '28px'}}
                                                     src={rating >= 1 ? goldStar : Star} alt={'Star'}/>
                                                <img onClick={() => handleRate(2)}
                                                     style={{marginRight: '15px', width: '28px'}}
                                                     src={rating >= 2 ? goldStar : Star} alt={'Star'}/>
                                                <img onClick={() => handleRate(3)}
                                                     style={{marginRight: '15px', width: '28px'}}
                                                     src={rating >= 3 ? goldStar : Star} alt={'Star'}/>
                                                <img onClick={() => handleRate(4)}
                                                     style={{marginRight: '15px', width: '28px'}}
                                                     src={rating >= 4 ? goldStar : Star} alt={'Star'}/>
                                                <img onClick={() => handleRate(5)} style={{width: '28px'}}
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
                                                style={{width: '100%'}}
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
                                                style={{width: '100%'}}
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
                                <div style={{display: 'flex', flexDirection: "row", alignItems: 'center'}}>
                                    <p style={{
                                        fontSize: '20px',
                                        fontStyle: 'normal',
                                        margin: '0 0 10px 0',
                                        fontWeight: '700',
                                        lineHeight: 'normal'
                                    }}
                                    >{`Отзывы`}</p>
                                    {ratingArrUS && ratingArrUS.length > 0 && ratingArrUS[0] !== '' && (
                                        <div style={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginLeft: '10px'
                                        }}>
                                            <img style={{margin: '0 0 5px 0', width: '14px'}}
                                                 src={goldStar} alt="star"/>
                                            <p style={{
                                                margin: '0 0 7px 2px',
                                                fontSize: '13px',
                                                fontWeight: '500'
                                            }}>
                                                {(ratingArrUS.reduce((acc, rating) => acc + rating.value, 0) / ratingArrUS.length).toFixed(1)}
                                            </p>
                                            <p style={{margin: '0 0 6px 5px', fontSize: '12px'}}>
                                                ({ratingArrUS.length - 1} отзывов)
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {allReviews ?
                                    ratingArrUS.map((rating, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            flexDirection: 'column',
                                            padding: "10px 0px",
                                            backgroundColor: '#fff',
                                            borderRadius: '10px',
                                            textDecoration: "none",
                                            color: "#000000",
                                            marginBottom: '10px',
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                width: 'calc(100% - 20px)',
                                                flexDirection: 'row',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                                margin:"0 10px"

                                            }}>
                                                <p style={{
                                                    margin: '0px',
                                                    fontWeight: '600',
                                                    color: '#000',
                                                    fontSize: '14px'
                                                }}>{rating.name}</p>
                                                <div
                                                    style={{
                                                        width:'100%',
                                                        justifyContent:'space-between',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        marginLeft: '10px',
                                                        alignItems: 'center',
                                                        border:"1px"
                                                    }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                    }}>
                                                        {[...Array(5)].map((_, index) => (
                                                            <img
                                                                key={index}
                                                                src={index < rating.value ? goldStar : Star}
                                                                alt="Star"
                                                                style={{ margin: '0 5px -1px 0', width: '15px' }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className={'data-text'}>{new Date(rating.created).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <p style={{
                                                wordWrap: "break-word",
                                                color: '#000',
                                                width:'calc(100% - 0px)',
                                                borderTop:'1px solid #E9E9E9',
                                                margin: '8px 0 5px 0',
                                                padding:'5px 10px 0 10px',
                                                fontSize: '13px'
                                            }}>
                                                {rating.description}
                                            </p>
                                        </div>
                                    ))
                                    :
                                    ratingArrUS.slice(0, visibleReviews).map((rating, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            flexDirection: 'column',
                                            padding: "10px 0px",
                                            backgroundColor: '#fff',
                                            borderRadius: '10px',
                                            textDecoration: "none",
                                            color: "#000000",
                                            marginBottom: '10px',
                                        }}>
                                            {isLoading ? (
                                                <div style={{
                                                    width: "150px",
                                                    height: '25px',
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
                                            ) : (
                                                <div style={{
                                                    display: 'flex',
                                                    width: 'calc(100% - 20px)',
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'center',
                                                    margin:"0 10px"

                                                }}>
                                                    <p style={{
                                                        margin: '0px',
                                                        fontWeight: '600',
                                                        color: '#000',
                                                        fontSize: '14px'
                                                    }}>{rating.name}</p>
                                                    <div
                                                        style={{
                                                            width:'100%',
                                                            justifyContent:'space-between',
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            marginLeft: '10px',
                                                            alignItems: 'center',
                                                            border:"1px"
                                                        }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                        }}>
                                                            {[...Array(5)].map((_, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={index < rating.value ? goldStar : Star}
                                                                    alt="Star"
                                                                    style={{ margin: '0 5px -1px 0', width: '15px' }}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className={'data-text'}>{new Date(rating.created).toLocaleString()}</p>
                                                    </div>
                                                </div>)}
                                            {isLoading ? (
                                                <div style={{
                                                    width: "100%",
                                                    height: '25px',
                                                    display: 'flex',
                                                    margin: '5px 5px 0 0',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    alignContent: 'space-around',
                                                    borderRadius: '10px',
                                                    background: 'linear-gradient(to right, #e3e3e3, #f0f0f0, #f0f0f0, #e3e3e3)',
                                                    backgroundSize: '200% 100%',
                                                    animation: 'gradientAnimation 1s linear infinite',
                                                }}>
                                                </div>
                                            ) : (
                                                <p style={{
                                                    wordWrap: "break-word",
                                                    color: '#000',
                                                    width:'calc(100% - 0px)',
                                                    borderTop:'1px solid #E9E9E9',
                                                    margin: '8px 0 5px 0',
                                                    padding:'5px 10px 0 10px',
                                                    fontSize: '13px'
                                                }}>
                                                    {rating.description}
                                                </p>
                                            )}
                                        </div>))
                                }
                                <Col className="d-flex justify-content-between rate-btns-block">
                                    <Button
                                        variant={"outline-dark"}
                                        className="admin-additional-button submit_btn"
                                        onClick={() => setVisibleReviews(prev => prev + 10)}
                                    >
                                        {ratingArrUS.length - visibleReviews <= 10 ? 'Показать оставшиеся' : 'Загрузить ещё'}
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
