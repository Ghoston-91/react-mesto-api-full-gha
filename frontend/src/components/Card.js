import React from "react";
import CurrentUserContext from "../context/CurrentUserContext";

export default function Card({ onCardLike, onCardDelete, onCardClick, card }) {
    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = card.owner === currentUser._id;
    const isLiked = card.likes.some(
        (item) => item === currentUser._id
    );

    const cardLikeButtonClassName = `card__like ${
        isLiked && "card__like_active"
    }`;

    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card);
    }

    function handleDeleteClick() {
        onCardDelete(card);
    }

    return (
        <div className="card">
            <img
                src={card.link}
                className="card__image"
                alt={card.name}
                onClick={handleClick}
            />
            {isOwn && <button
                    className="card__delete"
                    type="button"
                    onClick={handleDeleteClick}
                />
            }
            <div className="card__info">
                <h2 className="card__description">{card.name}</h2>
                <div className="card__like-group">
                    <button
                        type="button"
                        className={cardLikeButtonClassName}
                        aria-label="Поставить лайк"
                        onClick={handleLikeClick}
                    />
                    <span className="card__number-likes">{card.likes.length}</span>
                </div>
            </div>
        </div>
    );
}
