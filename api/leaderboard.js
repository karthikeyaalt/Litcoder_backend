import pool from "../db/pool.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://litcoder-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const sortBy = req.query.sortBy || "litcoder_score";
    const validSorts = ["litcoder_score", "accuracy_score", "quality_score"];
    if (!validSorts.includes(sortBy)) {
      return res.status(400).json({ error: "Invalid sortBy" });
    }

    const { rows } = await pool.query(`
      SELECT roll_number, name, email, litcoder_score, quality_score, accuracy_score, lab_data, contest_data
      FROM students
      ORDER BY ${sortBy} DESC NULLS LAST
    `);

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
