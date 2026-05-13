const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadImagem");

const { cadastrar, excluir, buscar } = require("../controllers/imagemEvento.controller");

router.post("/cadastrar/:id", upload, cadastrar);

router.delete("/excluir/:id", excluir);
router.get("/buscar/:id", buscar);


module.exports = router;