const prisma = require("../data/prisma");
const fs = require("fs");

const cadastrar = async (req, res) => {
  try {
    const idEvento = parseInt(req.params.id);
    const arquivo = req.file;

    const pastaFinal = `uploads/eventos/${idEvento}`;
    const caminhoFinal = `${pastaFinal}/${arquivo.filename}`;

    if (!fs.existsSync(pastaFinal)) {
      fs.mkdirSync(pastaFinal, { recursive: true });
    }

    fs.renameSync(arquivo.path, caminhoFinal);

    const imagem = await prisma.imagem.create({
      data: {
        nomeOriginal: arquivo.originalname,
        nomeArquivo: arquivo.filename,
        mimeType: arquivo.mimetype,
        path: caminhoFinal,
        eventosId: idEvento,
      },
    });

    res.json(imagem).status(201).end();

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({ erro: error.message }).status(500).end();
  }
};


    

const excluir = async (req, res) => {
  try {
    const { id } = req.params;

    const imagem = await prisma.imagem.findUnique({
      where: { id: Number(id) },
    });

    if (!imagem) {
      return res.json({ erro: "Imagem não encontrada" }).status(404).end();
    }

    if (fs.existsSync(imagem.path)) {
      fs.unlinkSync(imagem.path);
    }

    await prisma.imagem.delete({
      where: { id: Number(id) },
    });

    res.json({ mensagem: "Imagem excluída" }).status(200).end();

  } catch (error) {
    res.json({ erro: error.message }).status(500).end();
  }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;
        const imagem = await prisma.imagem.findUnique({
            where: { id: Number(id) },
        });
        if (!imagem) {
            
            return res.json({ erro: "Imagem não encontrada" }).status(404).end();
        }
         res.sendFile(imagem.path, { root: "." });
    } catch (error) {
        res.json({ erro: error.message }).status(500).end();
    }
    
};

module.exports = {
  cadastrar,
  excluir,
  buscar
};