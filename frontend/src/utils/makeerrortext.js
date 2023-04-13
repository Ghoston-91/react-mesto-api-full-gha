export function makeErrorText (error){
    return !!error.statusCode ? error.message : "Ошибка связи или неизвестная ошибка приложения";
}