 HEAD
const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2/promise');

// Reemplaza con tu token de BotFather
const TOKEN = '8041502880:AAEXID_fmek37Y4M388v6weF0s-2AFG6dnk';

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Cambia esto si tienes un usuario diferente
    password: '', // Cambia esto si tienes una contraseña configurada
    database: 'mi_chatbot'
});

// Crea el bot en modo polling
const bot = new TelegramBot(TOKEN, { polling: true });

const userSessions = {};

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;

    if (!userSessions[from]) {
        userSessions[from] = { step: 0, data: {} };
    }

    const session = userSessions[from];

    try {
        switch (session.step) {
            case 0:
                await bot.sendMessage(chatId, 'Bienvenido a Bogoker SAS, ¿desea ingresar un inmueble para venta? (si/no)');
                session.step++;
                break;
            case 1:
                if (msg.text.toLowerCase() === 'si') {
                    await bot.sendMessage(chatId, '¿Me indica la ubicación?');
                    session.step++;
                } else {
                    await bot.sendMessage(chatId, 'Gracias por su interés.');
                    delete userSessions[from];
                }
                break;
            case 2:
                session.data.ubicacionInmueble = msg.text;
                await bot.sendMessage(chatId, '¿Acepta la política de ventas del 3% de comisión como participación de la inmobiliaria? (si/no)');
                session.step++;
                break;
            case 3:
                if (msg.text.toLowerCase() === 'si') {
                    session.data.aceptaPolitica = true;
                    await bot.sendMessage(chatId, 'Por favor, indíqueme su nombre.');
                    session.step++;
                } else {
                    await bot.sendMessage(chatId, 'Gracias por su interés.');
                    delete userSessions[from];
                }
                break;
            case 4:
                session.data.nombre = msg.text;
                await bot.sendMessage(chatId, 'Por favor, indíqueme sus apellidos.');
                session.step++;
                break;
            case 5:
                session.data.apellidos = msg.text;
                await bot.sendMessage(chatId, 'Por favor, indíqueme su cédula.');
                session.step++;
                break;
            case 6:
                session.data.cedula = msg.text;
                await bot.sendMessage(chatId, 'Por favor, indíqueme el valor del inmueble.');
                session.step++;
                break;
            case 7:
                const valor = parseFloat(msg.text.replace(',', '.')); // Convierte a número y maneja decimales con coma
                if (isNaN(valor)) {
                    await bot.sendMessage(chatId, 'Por favor, ingrese un valor numérico válido para el inmueble.');
                } else {
                    session.data.valorInmueble = valor;
                    await bot.sendMessage(chatId, 'Por favor, indíqueme la dirección del inmueble.');
                    session.step++;
                    }
                break;
            case 8:
                session.data.direccion = msg.text;
                await bot.sendMessage(chatId, 'Por favor, indíqueme su teléfono.');
                session.step++;
                break;
            case 9:
                session.data.telefono = msg.text;
                await bot.sendMessage(chatId, 'Por favor, indíqueme su correo electrónico.');
                session.step++;
                break;
            case 10:
                session.data.correoElectronico = msg.text;
                await bot.sendMessage(chatId, 'Por favor, indíqueme el tipo de inmueble (por ejemplo: casa, apartamento, etc.).');
                session.step++;
                break;
            case 11:
                session.data.tipoInmueble = msg.text;
                await bot.sendMessage(chatId, '¿El inmueble es usado o nuevo?');
                session.step++;
                break;
            case 12: {
                session.data.estado = msg.text.toLowerCase().trim();
                if (session.data.estado === 'usado') {
                    await bot.sendMessage(chatId, 'Por favor, indique el tiempo de uso (años o meses).');
                    session.step++;
                } else if (session.data.estado === 'nuevo') {
                    session.data.tiempoUso = ''; // No se solicita tiempo de uso
                    await guardarEnBaseDeDatos(session.data, from);
                    await bot.sendMessage(chatId, 'Gracias por proporcionar la información. Hemos registrado su inmueble; uno de nuestros asesores le atenderá en la mayor brevedad.');
                    delete userSessions[from];
                } else {
                    await bot.sendMessage(chatId, 'Por favor, responda "usado" o "nuevo".');
                }
                break;
            }
            case 13: {
                session.data.tiempoUso = msg.text;
                await guardarEnBaseDeDatos(session.data, from);
                await bot.sendMessage(chatId, 'Gracias por proporcionar la información. Hemos registrado su inmueble; uno de nuestros asesores le atenderá en la mayor brevedad.');
                delete userSessions[from];
                break;
            }
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

// Función para guardar los datos en la base de datos
async function guardarEnBaseDeDatos(data, from) {
    const query = `
        INSERT INTO messages (
            \`from\`, body, timestamp, nombre, apellidos, cedula, ubicacionInmueble, 
            valorInmueble, aceptaPolitica, direccion, telefono, correoElectronico, 
            tipoInmueble, estado, tiempoUso
        ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        from,
        'Ingreso de inmueble',
        data.nombre,
        data.apellidos,
        data.cedula,
        data.ubicacionInmueble,
        data.valorInmueble,
        data.aceptaPolitica,
        data.direccion,
        data.telefono,
        data.correoElectronico,
        data.tipoInmueble,
        data.estado,
        data.tiempoUso
    ];

    const connection = await pool.getConnection();
    try {
        await connection.execute(query, values);
        console.log('Datos guardados en la base de datos.');
    } catch (error) {
        console.error('Error al guardar en la base de datos:', error);
    } finally {
        connection.release();
    }
}

console.log("🤖 Bot de Telegram está funcionando...");