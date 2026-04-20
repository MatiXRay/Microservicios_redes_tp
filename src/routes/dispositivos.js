const express = require("express");
const router = express.Router();
const db = require("../data/dispositivos");
const { validarDispositivo, autenticar } = require("../middleware/validacion");

router.use(autenticar);

// GET /dispositivos — obtener todos
router.get("/", (req, res) => {
  res.status(200).json(db.getAll());
});

// GET /dispositivos/activos — obtener solo los activos
router.get("/activos", (req, res) => {
  const activos = db.getAll().filter((d) => d.estado === "activo");
  res.status(200).json(activos);
});

// GET /dispositivos/:id — obtener por ID
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const dispositivo = db.getById(id);

  if (!dispositivo) {
    return res.status(404).json({ error: `Dispositivo con id ${id} no encontrado.` });
  }

  res.status(200).json(dispositivo);
});

// POST /dispositivos — crear
router.post("/", validarDispositivo, (req, res) => {
  const { nombre, ip, estado = "activo", tipo } = req.body;
  const nuevo = db.create({ nombre: nombre.trim(), ip, estado, tipo: tipo.trim() });
  res.status(201).json(nuevo);
});

// PUT /dispositivos/:id — actualizar
router.put("/:id", validarDispositivo, (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, ip, estado = "activo", tipo } = req.body;
  const actualizado = db.update(id, { nombre: nombre.trim(), ip, estado, tipo: tipo.trim() });

  if (!actualizado) {
    return res.status(404).json({ error: `Dispositivo con id ${id} no encontrado.` });
  }

  res.status(200).json(actualizado);
});

// DELETE /dispositivos/:id — eliminar
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const eliminado = db.remove(id);

  if (!eliminado) {
    return res.status(404).json({ error: `Dispositivo con id ${id} no encontrado.` });
  }

  res.status(200).json({ mensaje: `Dispositivo con id ${id} eliminado correctamente.` });
});

module.exports = router;
