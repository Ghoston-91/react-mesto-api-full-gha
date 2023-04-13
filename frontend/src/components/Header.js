import React from "react";
import headerLogo from "../images/logo.svg";
import { Routes, Route, Link } from "react-router-dom";
import CurrentUserContext from "../context/CurrentUserContext";

export default function Header({ onSignExit }) {
    const { email = "" } = React.useContext(CurrentUserContext);
    return (
        <div className="header">
            <img
                src={headerLogo}
                className="header__logo"
                alt="логотип Место"
            />
            <div className="header__nav"> 
            <Routes>
                <Route path="sign-in" element={<Link to="/sign-up" className="header__link" >Регистрация</Link> }/>
                <Route path="sign-up" element={<Link to="/sign-in" className="header__link" >Войти</Link> }/>
                <Route path="/" element={
                    <>
                    <p className="header__email">{email}</p>
                    <Link to="/sign-in" className="header__link" onClick={onSignExit}>Выйти</Link>
                    </>
                }/>
            </Routes>
            </div>
        </div>
    );
}
