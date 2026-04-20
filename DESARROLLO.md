# Desarrollo del Proyecto - Registro de Dispositivos en Red

## Objetivo

Desarrollar un backend tipo microservicio en Node.js que exponga una API REST para gestionar dispositivos conectados a una red, aplicando correctamente métodos HTTP, status codes y middleware.

---

## Paso 1: Inicialización del proyecto

Lo primero fue crear el archivo `package.json`, que es el archivo de configuración de cualquier proyecto Node.js. Este archivo define el nombre del proyecto, la versión, el punto de entrada (`server.js`) y los scripts disponibles para correrlo.

Se definieron dos scripts:
- `start`: corre el servidor con `node server.js` (modo producción)
- `dev`: corre el servidor con `nodemon server.js` (modo desarrollo, con auto-reload al guardar cambios)

Se instalaron las dependencias necesarias con:

```bash
npm install
```

Las dependencias instaladas fueron:
- **express**: framework web para Node.js que simplifica la creación de servidores HTTP y el manejo de rutas.
- **nodemon**: herramienta de desarrollo que reinicia el servidor automáticamente cada vez que se modifica un archivo.

---

## Paso 2: Estructura de carpetas

Se organizó el proyecto en carpetas separadas por responsabilidad, siguiendo el principio de separación de incumbencias:

```
tp_redes_microservicio_back/
├── server.js                        # Punto de entrada
├── package.json
└── src/
    ├── data/
    │   └── dispositivos.js          # Datos en memoria
    ├── middleware/
    │   └── validacion.js            # Middleware de autenticación y validación
    └── routes/
        └── dispositivos.js          # Endpoints REST
```

Esta estructura permite que cada archivo tenga una única responsabilidad, facilitando la lectura y el mantenimiento del código.

---

## Paso 3: Persistencia en memoria

Dado que el trabajo no requería base de datos, se implementó la persistencia usando un **array de JavaScript** en el archivo `src/data/dispositivos.js`.

Se crearon dos dispositivos de ejemplo para tener datos iniciales al arrancar el servidor.

Se definieron las siguientes funciones CRUD (Create, Read, Update, Delete):

- `getAll()`: retorna todo el array de dispositivos.
- `getById(id)`: busca un dispositivo por su id usando el método `.find()`.
- `create(data)`: agrega un nuevo dispositivo al array. Asigna un `id` autoincremental mediante la variable `nextId` (que empieza en 3 porque los dispositivos iniciales ya ocupan los ids 1 y 2) y registra la fecha y hora de creación con `createdAt`.
- `update(id, data)`: busca el índice del dispositivo con `.findIndex()` y reemplaza sus datos manteniendo el mismo `id`.
- `remove(id)`: busca el índice y lo elimina del array con `.splice()`.

---

## Paso 4: Middleware de validación y autenticación

Se creó el archivo `src/middleware/validacion.js` con dos middlewares:

### ¿Qué es un middleware?

Un middleware es una función que se ejecuta **entre** que llega la petición HTTP y que llega al endpoint. Recibe tres parámetros:
- `req`: el objeto de la petición (contiene headers, body, params, etc.)
- `res`: el objeto de la respuesta (permite enviar datos al cliente)
- `next`: una función que, al llamarse, le indica a Express que continúe al siguiente paso

Si el middleware detecta un error, devuelve una respuesta directamente **sin llamar a `next()`**, cortando el flujo.

### Middleware `autenticar`

Verifica que la petición incluya el header `Authorization: 1234`. Si no está presente o tiene otro valor, devuelve un error `401 No autorizado`.

### Middleware `validarDispositivo`

Se aplica únicamente en las peticiones POST y PUT, donde el cliente envía datos. Valida que:
- El campo `nombre` no esté vacío (usa `.trim()` para descartar strings con solo espacios).
- El campo `ip` sea una dirección IPv4 válida, utilizando una expresión regular que verifica que cada uno de los 4 bloques sea un número entre 0 y 255.
- El campo `tipo` no esté vacío.

Si alguna validación falla, acumula los errores en un array y devuelve un `400 Bad Request` con el detalle de cada error.

---

## Paso 5: Definición de los endpoints (Rutas)

Se creó el archivo `src/routes/dispositivos.js` usando `express.Router()`, que permite agrupar rutas relacionadas en un módulo separado.

Al inicio del archivo se aplica `router.use(autenticar)`, lo que hace que el middleware de autenticación se ejecute automáticamente **antes de cualquier endpoint** del router.

Se implementaron los siguientes endpoints:

### GET /dispositivos
Llama a `db.getAll()` y devuelve todos los dispositivos con status `200 OK`.

### GET /dispositivos/activos
Llama a `db.getAll()` y filtra con `.filter()` los dispositivos que tienen `estado === "activo"`. Devuelve `200 OK`.

Este endpoint se declara **antes** de `GET /dispositivos/:id` porque Express resuelve las rutas en orden de declaración. Si estuviera después, Express interpretaría la palabra `"activos"` como un valor de `:id` y nunca llegaría al endpoint correcto.

### GET /dispositivos/:id
Convierte el parámetro `:id` de string a número con `parseInt()` y llama a `db.getById()`. Si no encuentra el dispositivo, devuelve `404 Not Found`.

### POST /dispositivos
Aplica primero el middleware `validarDispositivo`. Si los datos son válidos, llama a `db.create()` y devuelve el dispositivo creado con status `201 Created`.

### PUT /dispositivos/:id
Aplica `validarDispositivo`, luego llama a `db.update()`. Si el dispositivo no existe, devuelve `404 Not Found`.

### DELETE /dispositivos/:id
Llama a `db.remove()`. Si el dispositivo no existe, devuelve `404 Not Found`. Si se elimina correctamente, devuelve `200 OK` con un mensaje de confirmación.

---

## Paso 6: Configuración del servidor principal

En `server.js` se configuró Express con tres elementos globales:

1. **`express.json()`**: middleware nativo de Express que permite leer el body de las peticiones en formato JSON. Sin esto, `req.body` sería `undefined`.

2. **Middleware de logging**: se registra en consola cada petición que llega al servidor con el formato:
   ```
   [METHOD] /ruta - timestamp
   ```
   Esto es útil para monitorear el tráfico durante el desarrollo.

3. **Middleware 404**: al final de todas las rutas, se agrega un manejador que captura cualquier ruta no definida y devuelve `404 Not Found`.

El servidor escucha en el puerto `3000`, configurable mediante la variable de entorno `PORT`.

---

## Paso 7: Extras implementados

### Timestamp de creación (`createdAt`)
Al crear un dispositivo, se registra automáticamente la fecha y hora exacta en formato ISO 8601 (por ejemplo: `"2026-04-20T14:00:00.000Z"`). Esto permite saber cuándo fue registrado cada dispositivo.

### Endpoint de dispositivos activos
Se agregó `GET /dispositivos/activos` como endpoint de búsqueda adicional, que filtra y devuelve únicamente los dispositivos con estado activo.

### Middleware de autenticación simple
Se implementó un control de acceso básico mediante un header `Authorization`. Esto simula un sistema de autenticación real, donde solo los clientes que conocen el token pueden acceder a la API.

---


## Pruebas con Postman

Las pruebas se realizaron con **Postman**, una herramienta que permite enviar peticiones HTTP de forma visual. Para cada petición se configuró:

- El método HTTP (GET, POST, PUT, DELETE)
- La URL del endpoint (`http://localhost:3000/dispositivos`)
- El header `Authorization: 1234` (requerido en todos los endpoints)
- El header `Content-Type: application/json` y el body en formato JSON (para POST y PUT)
