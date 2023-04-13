export function makeErrorText (error){
    console.dir(error);
    return !!error.statusCode ? error.message : "Ошибка связи или неизвестная ошибка приложения";
}