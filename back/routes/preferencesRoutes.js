const { Router } = require("express");
const controlador = require("../controllers/preferencesController");

const router = Router();

router.get("/", controlador.getPreferences);
router.get("/:id", controlador.getPreferenceById);
router.post("/", controlador.createPreference);
router.put("/:id", controlador.updatePreference);
router.delete("/:id", controlador.deletePreference);

module.exports = router;