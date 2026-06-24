/**
 * Database Configuration
 * Project: Client CRM
 * Author: Maurica Bellaphant
 *
 * Purpose:
 * Creates a reusable PostgreSQL connection pool.
 *
 * Why this file exists:
 * Instead of opening a new database connection in every route,
 * we create one shared pool and reuse it across the backend.
 */

const { Pool } = require("pg");
require("dotenv").config();

/**
 * PostgreSQL connection pool.
 *
 * The pool uses environment variables so sensitive information
 * like database passwords are not hard-coded into the application.
 */
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

module.exports = pool;