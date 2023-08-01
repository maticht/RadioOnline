import './headerNavBar.css';
import logo from '../../img/applogo.svg';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import searchBtn from "../../img/search.svg";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Dropdown} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import {getAllCountries, getAllGenres} from "../../http/radioApi";
import axios from "axios";

const HeaderNavBar = observer(({setSelectedRadio}) => {
    const param = useParams();
    const {radioStation} = useContext(Context)
    const [search, setSearch] = useState('')
    const history = useNavigate()
    const location = useLocation();
    const [validateToken, setValidateToken] = useState(false)
    const isAdminLoc = location.pathname === `/admin/${param.token}`
    const isHomeScreen = location.pathname === '/'
    const isHomeScreenWithId = location.pathname === `/${param.radioId}`
    const isFav = location.pathname === '/favorites'
    const isFavWithId = location.pathname === `/favorites/${param.radioId}`
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            click()
        }
    }

    useEffect(() => {
        const fetchLastToken = async () => {
            try {
                const {data} = await axios.get(`http://localhost:8081/getLastToken`);
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

    const click = async () => {
        try {
            radioStation.setSearchName(search)
            radioStation.setPage(1)
            console.log(radioStation.searchName)
            if (isAdminLoc) {
                history(isAdminLoc)
            } else if (isHomeScreen) {
                history(isHomeScreen)
            } else if (isHomeScreenWithId) {
                history(isHomeScreenWithId)
            } else {
                history(`/`)
            }
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const goToFav = () => {
        // Добавляем параметр запроса isFav со значением true
        window.location = '/favorites';
    }

    const refresh = async () => {
        setSelectedRadio()//убирает значение выбранного радио это колбек функция
        radioStation.setSearchName('')
        radioStation.setPage(1)
        radioStation.setLimit(42)
        radioStation.setSelectGenre({})
        radioStation.setSelectCountry({})
        radioStation.setSelectLanguage({})
        history(`/`)
    }

    const getCountries = async () => {
        if (isAdminLoc) {
            getAllCountries().then(data => radioStation.setCountries(data))
        }
    }

    const getGenres = async () => {
        if (isAdminLoc) {
            getAllGenres().then(data => radioStation.setGenres(data))
        }
    }
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const handleMarginBottom = () => {
        if (isFav || isFavWithId) {
            if (windowWidth <= 360) {
                return  '20px';
            }else if (windowWidth <= 720) {
                return  '20px';
            }else if (windowWidth <= 1060) {
                return '20px';
            } else {
                return  '20px';
            }
        }
    };


    return (
        <div className={'navBarBlock'} style={{
            marginBottom: handleMarginBottom(),
        }}>
            <div className={'navBarBlock-logo'}>
                <Link to={"/"}>
                    <img src={logo} alt={"logo"}
                         onClick={refresh}/>
                </Link>
                <div className={'navBarBlock-fav'}>
                    {!isFav && !isFavWithId ?
                        <Link className={"logInBlock"} to={"/favorites"} onClick={goToFav}>
                            <p className={"accountText"}>Избранное</p>
                            <button className={"accountBtn"}></button>
                        </Link>
                        : null}
                </div>
            </div>
            <div>
                {!isFav && !isFavWithId ?
                    <div className={'main-filter-block'}>
                        <div className={'search-block'}>
                            <img style={{width: '30px'}} src={searchBtn} alt="logo"/>
                            <input
                                style={{border: 'none'}}
                                className="searchFld"
                                placeholder="Введите название радиостанции"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}/>
                        </div>
                        <div className={'dropdown-block'}>
                            <Dropdown className="custom-dropdown" onClick={getCountries}>
                                <DropdownToggle className="custom-dropdown-toggle"
                                                style={{backgroundColor: '#FFFFFF', color: '#909095'}}
                                >{radioStation.selectedCountry.name || 'Выберите страну'}</DropdownToggle>
                                <DropdownMenu className="custom-dropdown-menu">
                                    {radioStation.countries.map(country =>
                                        <Dropdown.Item onClick={() => radioStation.setSelectCountry(country)}
                                                       key={country.id}> {country.name} </Dropdown.Item>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown className="custom-dropdown" onClick={getGenres}>
                                <DropdownToggle className="custom-dropdown-toggle"
                                                style={{backgroundColor: '#FFFFFF', color: '#909095'}}
                                >{radioStation.selectedGenre.name || 'Выберите жанр'}</DropdownToggle>
                                <DropdownMenu className="custom-dropdown-menu">
                                    {radioStation.genres.map(genre =>
                                        <Dropdown.Item onClick={() => radioStation.setSelectGenre(genre)}
                                                       key={genre.id}> {genre.name} </Dropdown.Item>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div> : null}
            </div>
            <div className={'fav-btn'}>
                {!isFav && !isFavWithId ?
                    <Link className={"logInBlock"} to={"/favorites"} onClick={goToFav}>
                        <p className={"accountText"}>Избранное</p>
                        <button className={"accountBtn"}></button>
                    </Link>
                    : <p style={{
                        fontSize: '20px',
                        margin: '0 0 px 0',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        lineHeight: 'normal'
                    }}>{isFav || isFavWithId ? 'Избранное' : ` `}</p>}
            </div>
        </div>
    );
});

export default HeaderNavBar;
