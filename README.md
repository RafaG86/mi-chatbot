## Bot Comercial para Registro de Nuevos Leads

Este proyecto es un bot comercial diseñado para registrar nuevos leads para la inmobiliaria Bogoker.

# Documentación de las APIs del Chatbot

## Descripción
Este proyecto contiene un conjunto de APIs para interactuar con la base de datos del chatbot. Las APIs permiten consultar, agregar y eliminar mensajes.

## Rutas Disponibles

### 1. Obtener Todos los Registros
- **Método:** `GET`
- **Ruta:** `/api/messages`
- **Descripción:** Devuelve todos los registros almacenados en la base de datos.
- **Respuesta:**
    ```json
    [
        {
            "id": 4,
            "from": "5253130749",
            "body": "Ingreso de inmueble",
            "timestamp": "2025-03-18T19:34:19.000Z",
            "nombre": "Rafael",
            "apellidos": "Gámez Fragozo",
            "cedula": "1032373186",
            "ubicacionInmueble": "Bogota",
            "valorInmueble": "340.00",
            "aceptaPolitica": 1,
            "direccion": "Kr 82 24d-48",
            "telefono": "3042629153",
            "correoElectronico": "Rafa.gzfr@gmail.com",
            "tipoInmueble": "Casa",
            "estado": "usado",
            "tiempoUso": "5 años"
        },
        {
            "id": 5,
            "from": "5253130749",
            "body": "Ingreso de inmueble",
            "timestamp": "2025-03-18T19:40:34.000Z",
            "nombre": "Paola",
            "apellidos": "Villa",
            "cedula": "1056370099",
            "ubicacionInmueble": "Marulanda",
            "valorInmueble": "99999999.99",
            "aceptaPolitica": 1,
            "direccion": "Kr 4 4-02",
            "telefono": "3045977547",
            "correoElectronico": "Pao-villa@hotmail.com",
            "tipoInmueble": "Casa",
            "estado": "usado",
            "tiempoUso": "20 años"
        },
        {
            "id": 6,
            "from": "5253130749",
            "body": "Ingreso de inmueble",
            "timestamp": "2025-03-18T19:48:47.000Z",
            "nombre": "José Camilo",
            "apellidos": "Fragozo Crespo",
            "cedula": "25009857",
            "ubicacionInmueble": "San Juan del cesar",
            "valorInmueble": "50000000.00",
            "aceptaPolitica": 1,
            "direccion": "Calle del embudo 2-3",
            "telefono": "3109856784",
            "correoElectronico": "Tiojose@gmail.com",
            "tipoInmueble": "Casa",
            "estado": "usado",
            "tiempoUso": "80 años"
        },
        {
            "id": 7,
            "from": "5253130749",
            "body": "Ingreso de inmueble",
            "timestamp": "2025-03-18T21:08:30.000Z",
            "nombre": "Juan Sebastián",
            "apellidos": "Villa Ocampo",
            "cedula": "1056390084",
            "ubicacionInmueble": "Bogota",
            "valorInmueble": "30000000.00",
            "aceptaPolitica": 1,
            "direccion": "Kr 77y 48bis sur 48",
            "telefono": "3045977564",
            "correoElectronico": "Sebas-villa@gmail.com",
            "tipoInmueble": "Apartamento",
            "estado": "nuevo",
            "tiempoUso": ""
        }
    ]
    ```

### 2. Agregar un Nuevo Registro
- **Método:** `POST`
- **Ruta:** `/api/messages`
- **Descripción:** Inserta un nuevo registro en la base de datos.
- **Entrada:**
    ```json
    {
        "from": "5253130749",
        "body": "Ingreso de inmueble",
        "nombre": "Carlos",
        "apellidos": "Gómez",
        "cedula": "987654321",
        "ubicacionInmueble": "Medellín",
        "valorInmueble": 450000000,
        "aceptaPolitica": true,
        "direccion": "Calle 45 #67-89",
        "telefono": "3009876543",
        "correoElectronico": "carlos.gomez@example.com",
        "tipoInmueble": "Casa",
        "estado": "Nuevo",
        "tiempoUso": "1 año"
    }
    ```
- **Respuesta:**
    ```json
    {
        "message": "Mensaje agregado correctamente."
    }
    ```

### 3. Eliminar un Registro
- **Método:** `DELETE`
- **Ruta:** `/api/messages/:id`
- **Descripción:** Elimina un registro específico en la base de datos por su ID.
- **Respuesta Exitosa:**
    ```json
    {
        "message": "Mensaje con ID 1 eliminado."
    }
    ```
- **Respuesta en Caso de Error:**
    ```json
    {
        "error": "Mensaje no encontrado."
    }
    ```