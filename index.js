const express = require("express");
const app = express();
const fs = require("fs");

//Habilitar el middleware que analiza (parsea) las solicitudes HTTP con un cuerpo en formato JSON.
app.use(express.json());

//Inicia el servidor
app.listen(
  3000,
  console.log("Server listening on port 3000 -  url: http://localhost:3000")
);

// __dirname + '/index.html' construye la ruta completa al archivo index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Obtener canciones
app.get("/canciones", (req, res) => {
  const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));
  res.status(200).json(canciones);
});

// Agrega una canción
app.post("/canciones", (req, res) => {
  const cancion = req.body;
  const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));
  canciones.push(cancion);
  fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2));
  res.status(201).json({ message: "Canción agregada satisfactoriamenete" });
  console.log("Canción agregada satisfactoriamenete");
});

// Modificar canción
app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const cancion = req.body;
  const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));
  const index = canciones.findIndex((cancion) => cancion.id == id);
  if (index !== -1) {
    console.log(`Canción modificada en el índice: ${index}`);
  } else {
    console.log(`No se encontró ninguna canción con el id: ${id}`);
  }
  canciones[index] = cancion;
  fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2));
  res.status(200).json({ message: "Canción modificada satisfactoriamente" });
});

//Eliminar canción
app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));
  const index = canciones.findIndex((cancion) => cancion.id == id);
  if (index !== -1) {
    console.log(`Canción eliminada en el índice: ${index}`);
  } else {
    console.log(`No se encontró ninguna canción con el id: ${id}`);
  }
  canciones.splice(index, 1);
  fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2));
  res.status(200).json({ message: "Canción eliminada satisfactoriamente" });
});
