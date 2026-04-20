# TP Redes - Microservicio: Registro de Dispositivos en Red

API REST desarrollada en Node.js para gestionar dispositivos conectados a una red. A través de peticiones HTTP se pueden registrar, consultar, actualizar y eliminar dispositivos.

---

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Modo desarrollo (auto-reload con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor corre en `http://localhost:3000`.

---

## Autenticación

Todos los endpoints requieren el siguiente header en cada petición:

```
Authorization: 1234
```

Sin este header la API devuelve `401 No autorizado`.

---

## Endpoints

### GET /dispositivos
Obtiene todos los dispositivos registrados.

**Respuesta 200:**
```json
[
  { "id": 1, "nombre": "PC-Oficina", "ip": "192.168.0.10", "estado": "activo", "tipo": "pc", "createdAt": "2026-04-20T14:00:00.000Z" }
]
```

### GET /dispositivos/activos
Obtiene solo los dispositivos con `estado: "activo"`.

**Respuesta 200:** misma estructura que el anterior, filtrada.

### GET /dispositivos/:id
Obtiene un dispositivo por su ID.

**Respuesta 200:**
```json
{ "id": 1, "nombre": "PC-Oficina", "ip": "192.168.0.10", "estado": "activo", "tipo": "pc", "createdAt": "2026-04-20T14:00:00.000Z" }
```
**Respuesta 404:** dispositivo no encontrado.

### POST /dispositivos
Crea un nuevo dispositivo.

**Body:**
```json
{
  "nombre": "Router",
  "ip": "192.168.0.1",
  "estado": "activo",
  "tipo": "router"
}
```
**Respuesta 201:** dispositivo creado con `id` y `createdAt` generados automáticamente.

**Respuesta 400:** si `nombre` está vacío, `ip` no es una IPv4 válida, o `tipo` está ausente.

### PUT /dispositivos/:id
Actualiza un dispositivo existente. Mismo body que POST.

**Respuesta 200:** dispositivo actualizado.

**Respuesta 400:** datos inválidos.

**Respuesta 404:** dispositivo no encontrado.

### DELETE /dispositivos/:id
Elimina un dispositivo.

**Respuesta 200:**
```json
{ "mensaje": "Dispositivo con id 1 eliminado correctamente." }
```
**Respuesta 404:** dispositivo no encontrado.

---

## Estructura del proyecto

```
tp_redes_microservicio_back/
├── server.js                        # Punto de entrada, configura Express y middlewares globales
├── package.json
└── src/
    ├── data/
    │   └── dispositivos.js          # Persistencia en memoria (array) + operaciones CRUD
    ├── middleware/
    │   └── validacion.js            # Middleware de autenticación y validación de campos
    └── routes/
        └── dispositivos.js          # Definición de los endpoints REST
```

---

## Middleware

Función que se ejecuta entre la petición y el endpoint. Permite interceptar, validar o rechazar requests antes de que lleguen a la lógica principal.

```
Petición HTTP → [logging] → [autenticar] → [validarDispositivo] → Endpoint → Respuesta
```

Cada middleware recibe `(req, res, next)`:
- `req` → la petición del cliente
- `res` → la respuesta a devolver
- `next()` → continúa al siguiente paso; si no se llama, el flujo se corta