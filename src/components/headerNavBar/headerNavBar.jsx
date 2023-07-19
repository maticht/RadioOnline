import './headerNavBar.css';
import logo from '../../img/applogo.svg';
import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState, useContext} from "react";
import searchBtn from "../../img/search.svg";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {Context} from "../../index";
import {Dropdown} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import {useLocation} from "react-router-dom";
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


    return (<div className={'navBarBlock'}>
        <Link to={"/"}>
            <img src={logo} alt={"logo"}
                 onClick={refresh}/>
        </Link>
        {!isFav && !isFavWithId ?
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div style={{
                width: '340px',
                height: '40px',
                backgroundColor: '#fff',
                display: 'flex',
                marginRight: '15px',
                justifyContent: 'flex-start',
                alignItems: 'center',
                borderRadius: '10px'
            }}>
                <img style={{width: '30px'}} src={searchBtn} alt="logo"/>
                <input
                    style={{border: 'none'}}
                    className="searchFld"
                    placeholder="Введите название радиостанции"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}/>
            </div>
            <Dropdown className="custom-dropdown" style={{width: '170px'}} onClick={getCountries}>
                <DropdownToggle className="custom-dropdown-toggle" style={{
                    width: '170px',
                    marginRight: '25px',
                    backgroundColor: '#FFFFFF',
                    color: '#909095'
                }}>{radioStation.selectedCountry.name || 'Выберите страну'}</DropdownToggle>
                <DropdownMenu className="custom-dropdown-menu"
                              style={{width: '170px', maxHeight: '250px', overflowY: 'auto'}}>
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
                <DropdownMenu className="custom-dropdown-menu"
                              style={{width: '160px', maxHeight: '250px', overflowY: 'auto'}}>
                    {radioStation.genres.map(genre =>
                        <Dropdown.Item onClick={() => radioStation.setSelectGenre(genre)}
                                       key={genre.id}> {genre.name} </Dropdown.Item>
                    )}
                </DropdownMenu>
            </Dropdown>
        </div>        : null}
        {!isAdminLoc && !isFav && !isFavWithId ?
            <Link className={"logInBlock"} to={"/favorites"} onClick={goToFav}>
                <p className={"accountText"} >Избранное</p>
                <button className={"accountBtn"}></button>
            </Link>
        : null}


    </div>);
});

export default HeaderNavBar;
