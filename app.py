from flask import Flask, render_template, redirect, url_for, request, jsonify
import mysql.connector

app = Flask(__name__)

# Configuración de la conexión a MySQL
db_config = {
    'host': 'localhost',
    'user': 'root',  # Cambia esto si tienes un usuario diferente
    'password': '',  # Cambia esto si tienes una contraseña configurada
    'database': 'mi_chatbot'
}

# Ruta para la página principal
@app.route('/')
def index():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM messages")
    messages = cursor.fetchall()
    cursor.close()
    connection.close()
    return render_template('index.html', messages=messages)

# Ruta para eliminar un mensaje
@app.route('/delete/<int:id>', methods=['GET'])
def delete_record(id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    cursor.execute("DELETE FROM messages WHERE id = %s", (id,))
    connection.commit()
    cursor.close()
    connection.close()
    return redirect(url_for('index'))

# Ruta para agregar un mensaje
@app.route('/add_message', methods=['POST'])
def add_message():
    content = request.json
    author = content.get('author')
    text = content.get('text')

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    cursor.execute("INSERT INTO messages (author, text) VALUES (%s, %s)", (author, text))
    connection.commit()
    message_id = cursor.lastrowid
    cursor.close()
    connection.close()
    return jsonify({'id': message_id}), 201

if __name__ == '__main__':
    app.run(debug=True)