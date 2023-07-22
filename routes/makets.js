const express = require("express");
const {getAllMakets, getMaket, getMaketForOption, getRandomMaketForOption, getMaketPopular, getCountMakets, getMaketsPagination } = require("../controllers/makets");
const router = express.Router();


router.get("/", getAllMakets);
router.get("/maket", getMaket);
router.get("/count", getCountMakets);
router.get("/popular", getMaketPopular);
router.get("/option", getMaketForOption);
router.get("/random-for-option", getRandomMaketForOption);
router.get("/paginations", getMaketsPagination);


module.exports = router;


