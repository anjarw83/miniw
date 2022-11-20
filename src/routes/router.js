const express = require("express");
// const { ensureGuest, ensureAuth } = require("../auth/auth.middleware");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json("OK")
    // res.render("login");
});

router.get("/hello", async (req, res) => {
    res.status(200).json({message: "OK"})
    // res.render("index", { userinfo: req.user });
});

module.exports = router;
