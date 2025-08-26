import pool from "../db/pool.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://litcoder-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email_b64 } = req.query;
    const { rows } = await pool.query(
      `SELECT roll_number, name, email, litcoder_score, quality_score, accuracy_score, lab_data, contest_data
       FROM students WHERE email_b64 = $1`,
      [email_b64]
    );

    if (!rows.length) return res.status(404).json({ error: "Student not found" });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
