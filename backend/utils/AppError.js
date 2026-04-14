//Clase personalizada para errores de la aplicación
//Nos permite crear errores con un c'digo HTTP específico

class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //llama al constructor de Error con el mensaje
    this.statusCode = statusCode;
    this.isOperational = true; //distingue errores nuestros de bugs inesperados
  }
}

module.exports = AppError;
