import React from "react";


function ImagePopup({selectedCard, onClose}) {
    return (
        <div className={`popup popup_type_open-picture ${selectedCard ? 'popup_opened' : ''}`}>
            <div className="picture popup__content">
                <button type="button" aria-label="Закрыть фотографию" className="popup__close-btn picture__close-btn close-btn" onClick={onClose}/>
                <img src={selectedCard?.link} alt={selectedCard?.name} className="picture__image"/>
                <h2 className="picture__title">{selectedCard?.name}</h2>
            </div>
      </div>
    );
}

export default ImagePopup;
