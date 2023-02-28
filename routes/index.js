const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    return res.json({ message: "This is the index api" });
});
module.exports = router;