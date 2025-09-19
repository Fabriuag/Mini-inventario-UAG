const express = require("express");
const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

const app = express();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false, // Ignora certificados autofirmados en local
  },
});


app.get("/api/inventario", async (req, res) => {
  const { sku } = req.query;
  try {
    const result = await pool.query("SELECT * FROM inventario WHERE sku = $1", [sku]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error en consulta:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("API Mini-Inventario funcionando 🚀. Usa /api/inventario?sku=SKU-ABC");
});
