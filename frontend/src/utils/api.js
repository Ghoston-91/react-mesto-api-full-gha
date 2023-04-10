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
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              },
            })
            .then(this._checkResponse)
    }

    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'GET',
            headers: {
              'Authorization' : `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
          })
          .then(this._checkResponse)
    }

    editUserProfile(newName, newAbout) {
        return fetch(`${this.baseUrl}/users/me`, {
          method: 'PATCH',
          headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newName,
            about: newAbout
          })
        })
        .then(this._checkResponse)
      }

    addNewCard(cardData) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: {
              'Authorization' : `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: cardData.name,
              link: cardData.link
            })
          })
          .then(this._checkResponse)
        }

    deleteCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}`, {
            method: "DELETE",
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              },
            })
            .then(this._checkResponse)
          }

    putLikeCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: "PUT",
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              },
            })
            .then(this._checkResponse)
          }

    deleteLikeCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: "DELETE",
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              },
            })
            .then(this._checkResponse)
          }

    changeAvatar(link) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: "PATCH",
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                avatar: link
              })
            })
            .then(this._checkResponse)
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
