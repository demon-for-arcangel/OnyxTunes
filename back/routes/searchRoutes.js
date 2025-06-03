const { Router } = require("express");
const searchController = require("../controllers/searchController");
const { checkToken } = require("../middlewares/abilities");

const router = Router();

router.get("/", checkToken, searchController.searchAll); 

module.exports = router;