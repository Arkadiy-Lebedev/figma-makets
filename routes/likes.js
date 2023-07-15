const express = require("express");
const {addLikes } = require("../controllers/likes");
const router = express.Router();



router.post("/", addLikes);



module.exports = router;


