const express = require("express");
const {sendTelegram } = require("../controllers/telegram");
const router = express.Router();



router.post("/", sendTelegram);



module.exports = router;


