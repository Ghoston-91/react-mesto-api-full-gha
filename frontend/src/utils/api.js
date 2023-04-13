class Api {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    _injectJWT(headers){
        const jwt = localStorage.getItem('jwt');
        if (!!jwt){
            return { ...headers, "Authorization": `Bearer ${jwt}` };
        } else {
            return headers;
        }
        // return !!jwt ? { ...headers, "Authorization": `Bearer ${jwt}` } : headers;
    }

    _getResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return res.json().then((error) => {
            error.statusCode = res.status;
            return Promise.reject(error);
        })
        
    }

    getUserInfoProfile() {
        return fetch(`${this._baseUrl}/users/me`, {
            headers: this._injectJWT(this._headers),
        }).then(this._getResponse);
    }

    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
            headers: this._injectJWT(this._headers),
        }).then(this._getResponse);
    }

    editUserProfile(userProfile) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: "PATCH",
            headers: this._injectJWT(this._headers),
            body: JSON.stringify(userProfile),
        }).then(this._getResponse);
    }

    addNewCard(cardData) {
        return fetch(`${this._baseUrl}/cards`, {
            method: "POST",
            headers: this._injectJWT(this._headers),
            body: JSON.stringify({ name: cardData.title, link: cardData.link }),
        }).then(this._getResponse);
    }

    deleteCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}`, {
            method: "DELETE",
            headers: this._injectJWT(this._headers),
        }).then(this._getResponse);
    }

    signUp (data) {
        return fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(this._getResponse)
      };
      
    signIn (data){
        return fetch(`${this._baseUrl}/signin`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(this._getResponse)
      };
      
    checkAuthData (token) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(this._getResponse)
      };

    changeAvatar(link) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: "PATCH",
            headers: this._injectJWT(this._headers),
            body: JSON.stringify({
                avatar: link,
            }),
        }).then(this._getResponse);
    }

    changeLikeCardStatus(cardId, isLiked) {
            return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
                method: isLiked ? "DELETE" : "PUT",
                headers: this._injectJWT(this._headers),
            }).then(this._getResponse);
        } 
}

const apiConnect = new Api({
    baseUrl: "https://api.ghoston91.nomoredomains.monster",
    headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
    },
});
export default apiConnect;
