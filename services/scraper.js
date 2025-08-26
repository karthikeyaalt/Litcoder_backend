import axios from "axios";
import * as cheerio from "cheerio";

function extractChartData(html, chartName) {
  const regex = new RegExp(
    `var ${chartName}\\s*=\\s*AmCharts\\.makeChart[\\s\\S]*?"dataProvider":\\s*(\\[[\\s\\S]*?\\])`,
    "m"
  );
  const match = html.match(regex);
  if (!match) return [];

  try {
    let fixed = match[1].replace(/(\w+):/g, '"$1":');
    let arr = JSON.parse(fixed);

    return arr
      .map((obj) => {
        const out = {};
        for (const [k, v] of Object.entries(obj)) {
          if (!isNaN(v) && v !== "") out[k] = Number(v);
          else out[k] = v;
        }
        return out;
      })
      .filter((obj) => {
        const { hard = 0, medium = 0, easy = 0 } = obj;
        return hard !== 0 || medium !== 0 || easy !== 0;
      });
  } catch (e) {
    console.error("❌ JSON parse failed:", e.message);
    return [];
  }
}

export async function fetchStudentStats(studentId) {
  const url = `https://litcoder.in/student-profile/share/${studentId}`;
  const res = await axios.get(url, { timeout: 10000 });
  const $ = cheerio.load(res.data);

  const scores = $("span.fw-semibold.fs-2x.text-gray-800")
    .map((i, el) => $(el).text().trim())
    .get();
  const [litcoderScore, qualityScore, accuracyScore] = scores;

  const labData = extractChartData(res.data, "labChart");
  const contestData = extractChartData(res.data, "contestChart");

  return {
    id: studentId,
    litcoderScore: litcoderScore ? parseFloat(litcoderScore) : null,
    qualityScore: qualityScore ? parseFloat(qualityScore) : null,
    accuracyScore: accuracyScore ? parseFloat(accuracyScore) : null,
    labData,
    contestData,
  };
}
