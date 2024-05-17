const express = require("express");
const router = require("express").Router();
var serveIndex = require("serve-index");

router.get("/ping", (req, res) => {
    res.send("pong!");
});

router.use(
    "/diff",
    express.static("./data/diff", { extensions: ["txt"] }),
    serveIndex("./data/diff", { icons: true })
);

module.exports = router;
