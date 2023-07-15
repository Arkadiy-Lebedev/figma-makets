const express = require("express");
const {getAllMakets, getMaket, getMaketForOption, getRandomMaketForOption } = require("../controllers/makets");
const router = express.Router();


router.get("/", getAllMakets);
router.get("/maket", getMaket);
router.get("/option", getMaketForOption);
router.get("/random-for-option", getRandomMaketForOption);



module.exports = router;


