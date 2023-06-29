import './headerNavBar.css';
import logo from '../../img/applogo.svg';
import {Link} from "react-router-dom";
import React, {useEffect, useState, useContext} from "react";
import searchBtn from "../../img/search.svg";

function HeaderNavBar() {



    return (<div className={'navBarBlock'}>
        <Link to={"/"}>
            <img src={logo} alt={"logo"}/>
        </Link>
        <div style={{width:'340px',height:'40px', backgroundColor:'#fff', display:'flex', justifyContent:'flex-start', alignItems:'center', borderRadius:'10px'}}>
            <img style={{width:'30px', marginBottom:'3px'}} src={searchBtn} alt="logo" />
            <input style={{ border: 'none' }} placeholder="Введите запрос"  />
        </div>
        <Link className={"logInBlock"} to={"/admin"}>
            <p className={"accountText"}>Админ</p>
            <button className={"accountBtn"}></button>
        </Link>
    </div>);
}

export default HeaderNavBar;
