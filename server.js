const express = require("express");
const dispositivosRouter = require("./src/routes/dispositivos");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware de logging por request, muestra en consola las peticiones https y la fecha/hora
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.use("/dispositivos", dispositivosRouter);

// 404 para rutas no definidas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

app.listen(PORT, () => {
  console.log(`Microservicio corriendo en http://localhost:${PORT}`);
});
