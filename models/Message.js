const mongoose = require('mongoose'); //Formato de la base de datos

const messageSchema = new mongoose.Schema({
    from: String,
    body: String,
    timestamp: { type: Date, default: Date.now },
    nombre: String,
    apellidos: String,
    cedula: String,
    ubicacionInmueble: String,
    valorInmueble: String,
    aceptaPolitica: Boolean,
    direccion: String,
    telefono: String,
    correoElectronico: String,
    tipoInmueble: String,
    estado: String, // 'usado' o 'nuevo'
    tiempoUso: String
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;