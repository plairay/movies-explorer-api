const ERR_CODE_BAD_REQ = 400;
const ERR_CODE_UN_AUTH = 401;
const ERR_CODE_FORBIDDEN = 403;
const ERR_CODE_NOT_FOUND = 404;
const ERR_CODE_CONFLICT = 409;
const ERR_CODE_INT_SER = 500;

const MES_SER_ERR = 'На сервере произошла ошибка';
const MES_NOT_FOUND_PAGE = 'Страница не найдена';
const MES_NOT_FOUND_USER = 'Пользователь не найден';
const MES_NOT_FOUND_FILM = 'Фильм не найден';
const MES_INVALID_DATA = 'Переданы некорректные данные';
const MES_INVALID_FILM_ID = 'Передан некорректный _id фильма';
const MES_DUPLICATE_ERR = 'Пользователь с таким Email уже существует';
const MES_AUTH_ERR = 'Передан неверный логин или пароль';
const MES_FILM_AUTH_ERR = 'Фильм добавлен не вами';
const MES_TOKEN_DEL = 'Токен удален';

const SECRET_CODE = '$2b$12$CmlwbfGcHhRkZZQGC5ymEerYSgHdPgIL4Chvg.GMdw8G3V1DeGFfq';

const ALLOWED_CORS = [
  'https://plairay.movies.nomoredomains.club',
  'http://plairay.movies.nomoredomains.club',
  'http://localhost:3000',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  ERR_CODE_BAD_REQ,
  ERR_CODE_UN_AUTH,
  ERR_CODE_FORBIDDEN,
  ERR_CODE_NOT_FOUND,
  ERR_CODE_CONFLICT,
  ERR_CODE_INT_SER,
  SECRET_CODE,
  ALLOWED_CORS,
  DEFAULT_ALLOWED_METHODS,
  MES_SER_ERR,
  MES_NOT_FOUND_PAGE,
  MES_NOT_FOUND_USER,
  MES_NOT_FOUND_FILM,
  MES_INVALID_DATA,
  MES_INVALID_FILM_ID,
  MES_DUPLICATE_ERR,
  MES_AUTH_ERR,
  MES_FILM_AUTH_ERR,
  MES_TOKEN_DEL,
};
