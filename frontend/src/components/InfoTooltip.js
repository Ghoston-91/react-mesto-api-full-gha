import React from "react";
import { ReactComponent as SuccessIcon } from "../images/OkIcon.svg";
import { ReactComponent as FailIcon } from "../images/Fail-Icon.svg";

export default function InfoTooltip({ name, isOpen, onClose, text, isError }) {
    // const image = isError ? UnionSuccess : UnionFailed;

    return (
        <div
            className={`popup popup_type_${name} ${
                isOpen ? "popup_active" : ""
            }`}
        >
            <div className="popup__container">
                <button
                    type="button"
                    className="popup__close"
                    onClick={onClose}
                />
                <form className="popup__form" name={name} id={name}>
                    {isError ? (<FailIcon className="popup__info-image"/>) : (<SuccessIcon className="popup__info-image"/>)}
                    {/* <img
                        className="popup__info-image"
                        src={}
                        alt={isError ? "Ошибка" : "Успешно" }
                    /> */}
                    <p className="popup__info-text">{text}</p> {/* className={`popup__info-text ${isError ? "popup__info-text_errored" : ""}`} */}
                </form>
            </div>
        </div>
    );
}