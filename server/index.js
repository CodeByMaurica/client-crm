const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const clients = require("./data/clients");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Client CRM API Running 🚀",
  });
});

const PORT = 5000;

app.get("/api/clients", (req, res) => {
  res.json(clients);
});

app.post("/api/clients", (req, res) => {
  const newClient = {
    id: Date.now(),
    ...req.body,
  };

  clients.push(newClient);

  res.status(201).json(newClient);
});

app.delete("/api/clients/:id", (req, res) => {
  const clientId = Number(req.params.id);
  const index = clients.findIndex((client) => client.id === clientId);

  if (index === -1) {
    return res.status(404).json({ message: "Client not found" });
  }

  clients.splice(index, 1);

  res.json({ message: "Client deleted" });
});

app.put("/api/clients/:id", (req, res) => {
  const clientId = Number(req.params.id);
  const index = clients.findIndex((client) => client.id === clientId);

  if (index === -1) {
    return res.status(404).json({ message: "Client not found" });
  }

  clients[index] = {
    ...clients[index],
    ...req.body,
  };

  res.json(clients[index]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});