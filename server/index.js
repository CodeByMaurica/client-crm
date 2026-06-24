/**
 * Client CRM Backend API
 * Project: Client CRM
 * Author: Maurica Bellaphant
 *
 * Purpose:
 * This Express server handles API requests from the React frontend
 * and communicates with the PostgreSQL database.
 *
 * Current Features:
 * - Get all clients
 * - Create a new client
 * - Update an existing client
 * - Delete a client
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

/**
 * Middleware
 *
 * cors() allows the React frontend to communicate with this backend.
 * express.json() allows the server to read JSON data sent in requests.
 */
app.use(cors());
app.use(express.json());

/**
 * Health Check Route
 *
 * This route confirms the backend server is running.
 */
app.get("/", (req, res) => {
  res.json({
    message: "Client CRM API Running 🚀",
  });
});

/**
 * GET /api/clients
 *
 * Purpose:
 * Retrieves all clients from the PostgreSQL database.
 */
app.get("/api/clients", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM clients ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching clients:", error);

    res.status(500).json({
      message: "Failed to fetch clients",
    });
  }
});

/**
 * POST /api/clients
 *
 * Purpose:
 * Creates a new client record in PostgreSQL.
 */
app.post("/api/clients", async (req, res) => {
  try {
    const { name, business, email, phone, status, notes } = req.body;

    const result = await pool.query(
      `
      INSERT INTO clients (
        name,
        business,
        email,
        phone,
        status,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [name, business, email, phone, status, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating client:", error);

    res.status(500).json({
      message: "Failed to create client",
    });
  }
});

/**
 * PUT /api/clients/:id
 *
 * Purpose:
 * Updates an existing client record.
 *
 * This route supports updating:
 * - status
 * - business
 * - email
 * - phone
 * - notes
 */
app.put("/api/clients/:id", async (req, res) => {
  try {
    const clientId = Number(req.params.id);

    /**
     * First, get the existing client.
     * This allows partial updates without deleting fields
     * that were not sent in the request body.
     */
    const existingClient = await pool.query(
      "SELECT * FROM clients WHERE id = $1",
      [clientId]
    );

    if (existingClient.rows.length === 0) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const currentClient = existingClient.rows[0];

    const updatedClient = {
      name: req.body.name ?? currentClient.name,
      business: req.body.business ?? currentClient.business,
      email: req.body.email ?? currentClient.email,
      phone: req.body.phone ?? currentClient.phone,
      status: req.body.status ?? currentClient.status,
      notes: req.body.notes ?? currentClient.notes,
    };

    const result = await pool.query(
      `
      UPDATE clients
      SET
        name = $1,
        business = $2,
        email = $3,
        phone = $4,
        status = $5,
        notes = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
      `,
      [
        updatedClient.name,
        updatedClient.business,
        updatedClient.email,
        updatedClient.phone,
        updatedClient.status,
        updatedClient.notes,
        clientId,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating client:", error);

    res.status(500).json({
      message: "Failed to update client",
    });
  }
});

/**
 * DELETE /api/clients/:id
 *
 * Purpose:
 * Deletes a client record from PostgreSQL.
 */
app.delete("/api/clients/:id", async (req, res) => {
  try {
    const clientId = Number(req.params.id);

    const result = await pool.query(
      "DELETE FROM clients WHERE id = $1 RETURNING *",
      [clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.json({
      message: "Client deleted successfully",
      deletedClient: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting client:", error);

    res.status(500).json({
      message: "Failed to delete client",
    });
  }
});

/**
 * Server Startup
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});