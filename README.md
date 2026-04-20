# Microservicios_redes_tp

Que hace la app? a traves de peticiones http se gestionan los dispositivos en red. es un microservicio

estructura de archivos:
server.js                  → punto de entrada, arranca el servidor
src/
  data/dispositivos.js     → los datos (array en memoria) + operaciones CRUD
  middleware/validacion.js → funciones que se ejecutan antes de los endpoints
  routes/dispositivos.js   → los endpoints (GET, POST, PUT, DELETE)

Middleware: funcion que se ejecuta antes del endpoint y despues de la peticion.
Petición HTTP → [middleware 1] → [middleware 2] → Endpoint → Respuesta

Cada middleware recibe (req, res, next):
req → la petición (qué mandó el cliente)
res → la respuesta (qué le devolvés)
next() → "todo ok, seguí al siguiente paso"
Si algo falla, el middleware no llama a next() y devuelve una respuesta de error directamente, cortando el flujo.



GET	/dispositivos	trae todos	200
GET	/dispositivos/activos	filtra por estado === "activo"	200
GET	/dispositivos/:id	trae uno por id	200 / 404
POST	/dispositivos	crea uno nuevo	201 / 400
PUT	/dispositivos/:id	actualiza uno	200 / 400 / 404
DELETE	/dispositivos/:id	elimina uno	200 / 404
El :id en la ruta es un parámetro dinámico — Express lo captura y lo ponés como req.params.id.