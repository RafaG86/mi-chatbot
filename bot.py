from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters
import mysql.connector
from datetime import datetime

TOKEN = "8041502880:AAEXID_fmek37Y4M388v6weF0s-2AFG6dnk"

# Configuración de la conexión a MySQL
db_config = {
    'host': 'localhost',
    'user': 'root',  # Cambia esto si tienes un usuario diferente
    'password': '',  # Cambia esto si tienes una contraseña configurada
    'database': 'mi_chatbot'
}

async def start(update: Update, context):
    await update.message.reply_text("¡Hola! Soy tu bot de Telegram. ¿En qué puedo ayudarte?")

async def reply(update: Update, context):
    user_message = update.message.text
    await update.message.reply_text(f"Recibí tu mensaje: {user_message}")

    # Guardar el mensaje en MySQL
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = """
        INSERT INTO messages (`from`, body, timestamp, nombre, apellidos, cedula, ubicacionInmueble, 
                              valorInmueble, aceptaPolitica)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    data = (
        update.message.from_user.id,
        user_message,
        datetime.now(),
        '',  # nombre
        '',  # apellidos
        '',  # cedula
        '',  # ubicacionInmueble
        '',  # valorInmueble
        False  # aceptaPolitica
    )
    cursor.execute(query, data)
    connection.commit()
    cursor.close()
    connection.close()

def main():
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, reply))

    print("Bot corriendo...")
    app.run_polling()

if __name__ == "__main__":
    main()