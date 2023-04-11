class Api {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

    getUserInfoProfile() {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: this._headers,
            })
            .then(this._checkResponse)
    }

    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'GET',
            headers: this._headers,
          })
          .then(this._checkResponse)
    }

    editUserProfile(userProfile) {
      return fetch(`${this._baseUrl}/users/me`, {
          method: "PATCH",
          headers: this._headers,
          body: JSON.stringify(userProfile),
      }).then((res) => {
          return this._checkResponse(res);
      });
  }

      addNewCard(cardData) {
        return fetch(`${this._baseUrl}/cards`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({ name: cardData.title, link: cardData.link }),
        }).then((res) => {
            return this._checkResponse(res);
        });
    }

    deleteCard(cardId) {
      return fetch(`${this._baseUrl}/cards/${cardId}`, {
        method: "DELETE",
        headers: this._headers,
    }).then((res) => {
        return this._checkResponse(res);
    });
}

    putLikeCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: "PUT",
            headers: this._headers,
          }).then((res) => {
              return this._checkResponse(res);
          });
      }
      

    deleteLikeCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: "DELETE",
            headers: this._headers,
          }).then((res) => {
              return this._checkResponse(res);
          });
      }
      

    changeAvatar(link) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
          method: "PATCH",
          headers: this._headers,
          body: JSON.stringify({
              avatar: link,
          }),
      }).then((res) => {
          return this._checkResponse(res);
      });
  }

    changeLikeCardStatus(cardId, isLiked) {
      if (isLiked) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: "PUT",
            headers: this._headers,
        }).then((res) => {
            return this._checkResponse(res);
        });
    } else {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: "DELETE",
            headers: this._headers,
        }).then((res) => {
            return this._checkResponse(res);
        });
    }
}
}

const apiConnect = new Api({
    baseUrl: "https://api.ghoston91.nomoredomains.monster",
});
export default apiConnect;
