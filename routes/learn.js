const express = require("express");
const router = express.Router();
const content = require("../data/languageContent");

// Language content page
router.get("/:language", (req, res) => {

  const data = content[req.params.language];

  if (!data) {
    return res.status(404).send("Content not found");
  }

  res.render("learn-page", { data });

});

module.exports = router;
