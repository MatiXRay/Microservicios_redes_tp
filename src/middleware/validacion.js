const IP_REGEX = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/;


//middleware validarDispositivo
const validarDispositivo = (req, res, next) => {
  const { nombre, ip, tipo } = req.body;
  const errores = [];


  if (!nombre || nombre.trim() === "") {
    errores.push("El campo 'nombre' es obligatorio y no puede estar vacío.");
  }

  if (!ip || !IP_REGEX.test(ip)) {
    errores.push("El campo 'ip' debe ser una dirección IPv4 válida.");
  }

  if (!tipo || tipo.trim() === "") {
    errores.push("El campo 'tipo' es obligatorio.");
  }

  if (errores.length > 0) {
    return res.status(400).json({ error: "Datos inválidos", detalles: errores });
  }

  next();
};

//middleware de autenticacion
const autenticar = (req, res, next) => {
  if (req.headers["authorization"] !== "1234") {
    return res.status(401).json({ error: "No autorizado. Header 'Authorization: 1234' requerido." });
  }
  next();
};

module.exports = { validarDispositivo, autenticar };
