const express = require("express");
const {getOptions } = require("../controllers/options");
const router = express.Router();



router.get("/", getOptions);


module.exports = router;


