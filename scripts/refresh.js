import { refreshAllStudents } from "../services/updater.js";

(async () => {
  try {
    console.log("🔄 Refreshing all students...");
    await refreshAllStudents();
    console.log("✅ All students refreshed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error refreshing students:", err);
    process.exit(1);
  }
})();
