const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

// Render profile form
router.get("/", (req, res) => {
  res.render("profile"); // profile.ejs
});

// Fetch stats based on platform & username
router.post("/lookup", async (req, res) => {
  const { platform, username } = req.body;
  if (!platform || !username) {
    return res.status(400).json({ success: false, error: "Platform and username required." });
  }

  try {
    let data;
    if (platform === "leetcode") {
      data = await getLeetCodeStats(username);
    } else if (platform === "codeforces") {
      data = await getCodeforcesStats(username);
    } else if (platform === "codechef") {
      data = await getCodeChefStats(username);
    } else {
      return res.status(400).json({ success: false, error: "Unsupported platform." });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch stats." });
  }
});

// ---------------- HELPERS ----------------

// LeetCode
async function getLeetCodeStats(username) {
  try {
    const query = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStatsGlobal { acSubmissionNum { difficulty count } }
          }
        }`,
      variables: { username },
    };

    const resp = await axios.post("https://leetcode.com/graphql", query, {
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });

    const user = resp.data.data.matchedUser;
    const totalSolved =
      user?.submitStatsGlobal.acSubmissionNum.find(x => x.difficulty === "All")?.count || 0;

    return { username, rating: "N/A", solved: totalSolved };
  } catch {
    return { username, rating: "Error", solved: 0 };
  }
}

// Codeforces
async function getCodeforcesStats(username) {
  try {
    const resp = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`, { timeout: 5000 });
    const info = resp.data.result[0];
    return {
      username,
      rating: info.rating || "N/A",
      rank: info.rank || "N/A",
      maxRating: info.maxRating || "N/A",
    };
  } catch {
    return { username, rating: "Error", rank: "Error", maxRating: "Error" };
  }
}

// CodeChef
async function getCodeChefStats(username) {
  try {
    const url = `https://www.codechef.com/users/${username}`;
    const resp = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(resp.data);

    const rating = $(".rating-number").first().text().trim() || "N/A";
    const contests = $("section.rating-data-section .contest-participated-count")
      .text()
      .trim()
      .replace("Contests participated:", "")
      .trim() || "N/A";

    return { username, rating, contests };
  } catch {
    return { username, rating: "Error", contests: "Error" };
  }
}

module.exports = router;
