let dispositivos = [
  { id: 1, nombre: "PC-Oficina", ip: "192.168.0.10", estado: "activo", tipo: "pc", createdAt: new Date().toISOString() },
  { id: 2, nombre: "Router-Principal", ip: "192.168.0.1", estado: "activo", tipo: "router", createdAt: new Date().toISOString() },
];

let nextId = 3;

const getAll = () => dispositivos;

const getById = (id) => dispositivos.find((d) => d.id === id);

const create = (data) => {
  const nuevo = { id: nextId++, ...data, createdAt: new Date().toISOString() };
  dispositivos.push(nuevo);
  return nuevo;
};

const update = (id, data) => {
  const index = dispositivos.findIndex((d) => d.id === id);
  if (index === -1) return null;
  dispositivos[index] = { ...dispositivos[index], ...data, id };
  return dispositivos[index];
};

const remove = (id) => {
  const index = dispositivos.findIndex((d) => d.id === id);
  if (index === -1) return false;
  dispositivos.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, create, update, remove };
