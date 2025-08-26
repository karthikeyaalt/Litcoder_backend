import { refreshAllStudents } from "../services/updater.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://litcoder-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    await refreshAllStudents();
    res.status(200).json({ success: true, message: "All students refreshed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
