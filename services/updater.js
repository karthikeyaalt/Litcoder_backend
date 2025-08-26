import pool from "../db/pool.js";
import { fetchStudentStats } from "./scraper.js";

async function updateStudentStats(student) {
  await pool.query(
    `
    UPDATE students SET
      litcoder_score = $2,
      quality_score = $3,
      accuracy_score = $4,
      lab_data = $5,
      contest_data = $6,
      last_updated = NOW()
    WHERE email_b64 = $1
  `,
    [
      student.id,
      student.litcoderScore,
      student.qualityScore,
      student.accuracyScore,
      JSON.stringify(student.labData),
      JSON.stringify(student.contestData),
    ]
  );
}

export async function refreshAllStudents() {
  const { rows } = await pool.query("SELECT email_b64 FROM students");
  const ids = rows.map((r) => r.email_b64);

  console.log(`🔄 Updating ${ids.length} students...`);

  const concurrency = 5;
  let i = 0;

  async function worker() {
    while (i < ids.length) {
      const idx = i++;
      const id = ids[idx];
      try {
        const stats = await fetchStudentStats(id);
        await updateStudentStats(stats);
        console.log(`✅ Updated ${id}`);
      } catch (err) {
        console.error(`❌ Failed ${id}`, err.message);
      }
    }
  }

  await Promise.all(Array(concurrency).fill(0).map(worker));
  console.log("🎉 All students updated!");
}
