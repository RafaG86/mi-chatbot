const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json()); // Middleware para manejar JSON en las solicitudes

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Cambia esto si tienes un usuario diferente
    password: '', // Cambia esto si tienes una contraseña configurada
    database: 'mi_chatbot'
});

// Ruta para obtener todos los mensajes
app.get('/api/messages', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM messages');
        res.json(rows);
    } catch (error) {
        console.error('Error al consultar mensajes:', error);
        res.status(500).send('Error al consultar mensajes');
    } finally {
        connection.release();
    }
});

// Ruta para agregar un mensaje
app.post('/api/messages', async (req, res) => {
    const { from, body, nombre, apellidos, cedula, ubicacionInmueble, valorInmueble, aceptaPolitica, direccion, telefono, correoElectronico, tipoInmueble, estado, tiempoUso } = req.body;
    const connection = await pool.getConnection();
    try {
        const query = `
            INSERT INTO messages (
                \`from\`, body, timestamp, nombre, apellidos, cedula, ubicacionInmueble, 
                valorInmueble, aceptaPolitica, direccion, telefono, correoElectronico, 
                tipoInmueble, estado, tiempoUso
            ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [from, body, nombre, apellidos, cedula, ubicacionInmueble, valorInmueble, aceptaPolitica, direccion, telefono, correoElectronico, tipoInmueble, estado, tiempoUso];
        await connection.query(query, values);
        res.status(201).send('Mensaje agregado correctamente.');
    } catch (error) {
        console.error('Error al agregar mensaje:', error);
        res.status(500).send('Error al agregar mensaje');
    } finally {
        connection.release();
    }
});

// Ruta para eliminar un mensaje por ID
app.delete('/api/messages/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query('DELETE FROM messages WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).send('Mensaje no encontrado');
        } else {
            res.send(`Mensaje con ID ${id} eliminado.`);
        }
    } catch (error) {
        console.error('Error al eliminar mensaje:', error);
        res.status(500).send('Error al eliminar mensaje');
    } finally {
        connection.release();
    }
});

// Inicia el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});