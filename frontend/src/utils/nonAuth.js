const BASE_URL = "https://api.ghoston91.nomoredomains.monster";

const getResponse = (res) => {
  if (res.ok) {
      return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

