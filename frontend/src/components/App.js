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
import * as auth from "../utils/authorization";
import InfoTooltip from "./InfoTooltip";

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
    const [userEmail, setUserEmail] = useState('');
    const [infoTooltipOpen, setInfoTooltipOpen] = useState(false);
    
    const [isSuccess, setIsSuccess] = useState(false);
    const [infoTooltipText, setIsInfoTooltipText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const jwt = localStorage.getItem('token');
        if (jwt) {
            auth.checkAuthData(jwt)
            .then((res) => {
                if (res) {
                    setUserEmail(res.email);
                    setIsLoggedIn(true);
                    navigate('/', {replace: true});
                }
            })
            .catch((err) => {console.log(err)})
        }
    }, []);

    useEffect(() => {
        async function setUser() {
            await apiConnect.getUserInfoProfile()
              .then((user) => {
                setCurrentUser(user);
              })
              .catch((err) => {console.log(err)})
          }
        async function setData() {
            await apiConnect.getInitialCards()
              .then((userCards) => {
                  setCards(userCards);
              })
              .catch((err) => {
                  console.log(err)
              })
        }

        if (isLoggedIn) {
            setUser();
            setData();
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

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsImagePopupOpen(false);
        setInfoTooltipOpen(false)
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
            .catch((err) => {
                console.log(err);
            });
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((user) => user._id === currentUser._id);
        // Отправляем запрос в API и получаем обновлённые данные карточки
        apiConnect
            .changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((cards) =>
                    cards.map((c) => (c._id === card._id ? newCard : c))
                );
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleUpdateAvatar({ avatar }) {
        apiConnect
            .changeAvatar(avatar)
            .then((res) => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleUpdateUser({ name, about }) {
        setIsRenderLoading(true);
        apiConnect
            .editUserProfile({ name, about })
            .then((res) => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleAddCard({ title, link }) {
        apiConnect
            .addNewCard({ title, link })
            .then((res) => {
                setCards((cards) => [res, ...cards]);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function openInfoTooltip(isSuccessfull) {
        isSuccessfull 
        ? setIsInfoTooltipText('Вы успешно зарегистрировались!') 
        : setIsInfoTooltipText('Что-то пошло не так! Попробуйте ещё раз.');
        setIsSuccess(isSuccessfull);
        setInfoTooltipOpen(true);
    }

    function handleRegister(formValue) {
        auth.signUp(formValue)
            .then(() => {
                openInfoTooltip(true);
            })
            .then(() => {
                navigate('/sign-in');
            })
            .catch(() => {
                openInfoTooltip(false);
            })
    }

    function handleSignIn(formValue) {
        auth.signIn(formValue)
            .then(() => {
                setUserEmail(formValue.email);
                setIsLoggedIn(true);
            })
            .then(() => {
                navigate('/', {replace:true})
            })
            .catch(() => {
                openInfoTooltip(false);
            })
    }

    function handleSignExit(){
        localStorage.clear('token');
        setIsLoggedIn(false);
        setUserEmail('email@email');
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
                <Header userEmail={userEmail} onSignExit={handleSignExit}/>
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
                isSuccess={isSuccess}
                text={infoTooltipText}
                isOpen={infoTooltipOpen}
                onClose={closeAllPopups}
                />
        </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
