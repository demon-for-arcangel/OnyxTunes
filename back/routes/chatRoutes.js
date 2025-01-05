const { Router } = require("express");
const ChatController = require("../controllers/chatController");
const { checkToken } = require("../middlewares/abilities");
const router = Router();

router.get(
  "/mensajes/:emisorId/:receptorId",
  /*checkToken, */ ChatController.obtenerMensajes,
);

router.get("/:usuarioId", /*checkToken,*/ ChatController.obtenerChats); //meter en el front

router.post("/enviar-mensaje", /*checkToken, */ ChatController.enviarMensaje);

router.post("/mensaje-leido", /*checkToken, */ ChatController.marcarComoLeido);

router.post(
  "/archivos-mensaje",
  /*checkToken, */ ChatController.subirArchivosMensaje,
);

module.exports = router;
