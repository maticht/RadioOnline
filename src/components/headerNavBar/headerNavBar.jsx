import './headerNavBar.css';
import logo from '../../img/applogo.svg';
import {Link} from "react-router-dom";
import React, {useEffect, useState, useContext} from "react";
import searchBtn from "../../img/search.svg";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {Context} from "../../index";
import {Dropdown} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";

const HeaderNavBar = observer(() => {

    const {radioStation} = useContext(Context)
    const [search, setSearch] = useState('')
    const history = useNavigate()
    const handleKeyDown = (event) => {
        if(event.key === 'Enter'){
            event.preventDefault()
            click()
        }
    }
    const click = async () =>{
        try{
            radioStation.setSearchName(search)
            console.log(radioStation.searchName)
            history("/")

        }catch (e){
            alert(e.response.data.message)
        }
    }

    const refresh = async ()=> {
        radioStation.setSearchName('')
        radioStation.setSelectGenre({})
        radioStation.setSelectCountry({})
        radioStation.setSelectLanguage({})
    }

    return (<div className={'navBarBlock'}>
        <Link to={"/"}>
            <img src={logo} alt={"logo"}
            onClick={refresh}/>
        </Link>
        <div style={{width:'340px',height:'40px', backgroundColor:'#fff', display:'flex', justifyContent:'flex-start', alignItems:'center', borderRadius:'10px'}}>
            <img style={{width:'30px', marginBottom:'3px'}} src={searchBtn} alt="logo" />
            <input
                style={{ border: 'none' }}
                placeholder="Введите запрос"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}/>
        </div>
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
            <DropdownToggle>{radioStation.selectedGenre.name || 'Выберите жанр'}</DropdownToggle>
            <DropdownMenu>
                {radioStation.genres.map(genre =>
                    <Dropdown.Item onClick={() => radioStation.setSelectGenre(genre)}
                                   key={genre.id}> {genre.name} </Dropdown.Item>
                )}
            </DropdownMenu>
        </Dropdown>
        <Link className={"logInBlock"} to={"/admin"}>
            <p className={"accountText"}>Админ</p>
            <button className={"accountBtn"}></button>
        </Link>
    </div>);
})

export default HeaderNavBar;
