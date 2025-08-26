import pkg from "pg";
const { Pool } = pkg;

// Use DATABASE_URL from environment; fallback only for local dev
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // required for cloud DBs
});

export default pool;
