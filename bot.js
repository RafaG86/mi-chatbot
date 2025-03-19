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

const ciudadesColombia = require('./ciudadesColombia'); // Importar la lista de ciudades

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;

    if (!userSessions[from]) {
        userSessions[from] = { step: 0, data: {} };
    }

    const session = userSessions[from];

    try {
        // Verificar si el usuario quiere reiniciar el bot
        if (msg.text.toLowerCase() === 'reiniciar') {
            delete userSessions[from];
            await bot.sendMessage(chatId, 'El bot ha sido reiniciado. Escribe cualquier mensaje para comenzar de nuevo.');
            return;
        }

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
                // Validar que la ubicación esté en la lista de ciudades de Colombia
                const ciudadIngresada = msg.text.trim();
                if (ciudadesColombia.map(ciudad => ciudad.toLowerCase()).includes(ciudadIngresada.toLowerCase())) {
                    session.data.ubicacionInmueble = ciudadIngresada;
                    await bot.sendMessage(chatId, '¿Acepta la política de ventas del 3% de comisión como participación de la inmobiliaria? (si/no)');
                    session.step++;
                } else {
                    await bot.sendMessage(chatId, 'Por favor, ingrese una ciudad válida de Colombia (no pueblos ni municipios).');
                }
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
                // Validar que el nombre solo contenga caracteres alfabéticos
                if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(msg.text)) {
                    session.data.nombre = msg.text;
                    await bot.sendMessage(chatId, 'Por favor, indíqueme sus apellidos.');
                    session.step++;
                } else {
                    await bot.sendMessage(chatId, 'Por favor, ingrese un nombre válido (solo letras).');
                }
                break;
            case 5:
                // Validar que los apellidos solo contengan caracteres alfabéticos
                if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(msg.text)) {
                    session.data.apellidos = msg.text;
                    await bot.sendMessage(chatId, 'Por favor, indíqueme su cédula.');
                    session.step++;
                } else {
                    await bot.sendMessage(chatId, 'Por favor, ingrese apellidos válidos (solo letras).');
                }
                break;
            case 6:
                // Validar que la cédula solo contenga números
                if (/^\d+$/.test(msg.text)) {
                    session.data.cedula = msg.text;
                    await bot.sendMessage(chatId, 'Por favor, indíqueme el valor del inmueble.');
                    session.step++;
                } else {
                    await bot.sendMessage(chatId, 'Por favor, ingrese un número de cédula válido (solo números).');
                }
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
                // Validar que el teléfono solo contenga números
                if (/^\d+$/.test(msg.text)) {
                    session.data.telefono = msg.text;
                    await bot.sendMessage(chatId, 'Por favor, indíqueme su correo electrónico.');
                    session.step++;
                } else {
                    await bot.sendMessage(chatId, 'Por favor, ingrese un número de teléfono válido (solo números).');
                }
                break;
            case 10:
                // Validar que el correo electrónico tenga un formato válido
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(msg.text)) {
                    session.data.correoElectronico = msg.text;
                    await bot.sendMessage(chatId, 'Por favor, indíqueme el tipo de inmueble (por ejemplo: casa, apartamento, etc.).');
                    session.step++;
                } else {
                    await bot.sendMessage(chatId, 'Por favor, ingrese un correo electrónico válido.');
                }
                break;
            case 11:
                // Validar que el tipo de inmueble sea uno de los permitidos
                const tiposValidos = ['casa', 'apartamento', 'finca', 'predio', 'local', 'lote'];
                if (tiposValidos.includes(msg.text.toLowerCase())) {
                    session.data.tipoInmueble = msg.text.toLowerCase();
                    await bot.sendMessage(chatId, '¿El inmueble es usado o nuevo?');
                    session.step++;
                } else {
                    await bot.sendMessage(chatId, 'Por favor, ingrese un tipo de inmueble válido (casa, apartamento, finca, predio, local, lote).');
                }
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