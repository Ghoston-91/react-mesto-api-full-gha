import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import apiConnect from "../utils/api";
import CurrentUserContext from "../context/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup ";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import { defaultTooltipState } from "../utils/constants";
import { makeErrorText } from "../utils/makeerrortext";

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({});
    
    const [cards, setCards] = React.useState([]);
    const [currentUser, setCurrentUser] = React.useState({});
    
    const [isRenderLoading, setIsRenderLoading] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tooltipState, setTooltipState] = useState(defaultTooltipState);
    const navigate = useNavigate();

    function closeTooltip (){
        setTooltipState(defaultTooltipState);
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsImagePopupOpen(false);
        closeTooltip();
    }

    function handleError(err){
        setTooltipState({
            isError: true,
            isOpen: true,
            text: makeErrorText(err)
        });
    }

    useEffect(() => {
        if (isLoggedIn){
            Promise.all([apiConnect.getUserInfoProfile(), apiConnect.getInitialCards()])
            .then(([user, cards]) => {
                setCurrentUser(user);
                setCards(cards);
            })
            .catch(handleError);
        }

    }, [isLoggedIn]);

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setIsImagePopupOpen(true);
        setSelectedCard({
            name: card.name,
            link: card.link,
        });
    }

    function handleCardDelete(card) {
        apiConnect
            .deleteCard(card._id)
            .then(() => {
                setCards((cardsArr) =>
                    cardsArr.filter((cardItem) => cardItem._id !== card._id)
                );
            })
            .catch(handleError);
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((user) => user === currentUser._id);
        // Отправляем запрос в API и получаем обновлённые данные карточки
        apiConnect
            .changeLikeCardStatus(card._id, isLiked)
            .then((newCard) => {
                setCards((cards) =>
                    cards.map((c) => (c._id === card._id ? newCard : c))
                );
            })
            .catch(handleError);
    }

    function handleUpdateAvatar({ avatar }) {
        apiConnect
            .changeAvatar(avatar)
            .then(({ data }) => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch(handleError);
    }

    function handleUpdateUser({ name, about }) {
        setIsRenderLoading(true);
        apiConnect
            .editUserProfile({ name, about })
            .then(({ data }) => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch(handleError);
    }

    function handleAddCard({ title, link }) {
        apiConnect
            .addNewCard({ title, link })
            .then((res) => {
                setCards((cards) => [res, ...cards]);
                closeAllPopups();
            })
            .catch(handleError);
    }

    const handleRegister = async (data) => {
        try {
            await apiConnect.signUp(data);
            setTooltipState({
                text: "Вы успешно зарегистрировались!",
                isError: false,
                isOpen: true
            })
            navigate("/sign-in")
        } catch(err) {
            setTooltipState({
                isError: true,
                isOpen: true,
                text: `Произошла ошибка регистрации: ${makeErrorText(err)}`,
            })
        }
    }

    const handleSignIn = async (data) => {
        try {
            const {token} = await apiConnect.signIn(data);
            localStorage.setItem('jwt', token);
            setIsLoggedIn(true);
            navigate("/")
        } catch(err) {
            setTooltipState({
                isError: true,
                isOpen: true,
                text: `Произошла ошибка входа: ${makeErrorText(err)}`,
            })
        }
    }

    function handleSignExit(){
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
        setCurrentUser({});
        navigate('/sign-in')
    } 

    useEffect(() =>{
        const jwt = localStorage.getItem('jwt');

        if(jwt) {
            apiConnect.checkAuthData(jwt)
            .then((res) => {
                setIsLoggedIn(true);
                navigate('/')
            })
            .catch(handleError)
        }
    }, [navigate])

    return (
        <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
                <Header /*userEmail={userEmail}*/ onSignExit={handleSignExit}/>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Main
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                /> 
                </ProtectedRoute>
                } />
                <Route path="/sign-up" element={<Register onSubmit={handleRegister}/>}/>
                <Route path="/sign-in" element={<Login onSubmit={handleSignIn}/>}/>
                </Routes>
                <Footer />
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                    isRenderLoading={isRenderLoading}
                />
                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddCard}
                />
                <ImagePopup
                    name="reveal-image"
                    card={selectedCard}
                    onClose={closeAllPopups}
                    isOpen={isImagePopupOpen}
                />
                <PopupWithForm
                    name="confirm"
                    title="Вы уверены?"
                    buttonText="Да"
                    onClose={closeAllPopups}
                />
                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                /> 
                <InfoTooltip
                name="status"
                isOpen={tooltipState.isOpen}
                onClose={closeTooltip}
                text={tooltipState.text}
                isError={tooltipState.isError}
                />
        </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
