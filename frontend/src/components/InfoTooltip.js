import React from "react";
import UnionSuccess from "../images/UnionSuccess.png";
import UnionFailed from "../images/UnionFailed.png";

// export default function InfoTooltip(props) {
//     const { name, isOpen, onClose, status } = props;
//     const image = status === "accept" ? UnionSuccess : UnionFailed;

//     return (
//         <div
//             className={`popup popup_type_${name} ${
//                 isOpen ? "popup_active" : ""
//             }`}
//         >
//             <div className="popup__container">
//                 <button
//                     type="button"
//                     className="popup__close"
//                     onClick={onClose}
//                 />
//                 <form className="popup__form" name={name} id={name}>
//                     <img
//                         className="popup__info-image"
//                         src={image}
//                         alt={status}
//                     />
//                     <p className="popup__info-text">{status === 'accept' ? 'Вы успешно зарегистрировались!'
//                 : 'Что-то пошло не так! Попробуйте ещё раз.'}</p>
//                 </form>
//             </div>
//         </div>
//     );
// }

function InfoTooltip(props) {
    return (
        <div className={`popup popup_type_info-tooltip ${props.isOpen ? 'popup_opened' : ''}`}>
            <div className="popup__container popup__content">
                <button type="button" aria-label="Закрыть попап" className="popup__close-btn close-btn" onClick={props.onClose}/>
                <div className="popup__info-container">
                    <img src={props.isSuccess ? UnionSuccess : UnionFailed} alt={props.isSuccess ? "Галочка" : "Крестик"} className="popup__icon"/>
                    <h2 className="popup__text">{props.text}</h2>   
                </div>
            </div>
        </div>
    )
}

export default InfoTooltip;