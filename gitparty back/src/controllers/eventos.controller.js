const prisma = require("../data/prisma");
const fs = require("fs");

const cadastrar = async (req, res) => {
    try {
        const data = req.body;

        data.data_evento = new Date(data.data_evento);

        const item = await prisma.eventos.create({
            data
        });

        res.json(item).status(201).end();

    } catch (error) {
        res.json({ erro: error.message }).status(500).end();
    }
};

const listar = async (req, res) => {
    const lista = await prisma.eventos.findMany({
        include: {imagens:true}
    });

    res.json(lista).status(200).end();
};

const buscar = async (req, res) => {
    const { id } = req.params;
    
    const item = await prisma.eventos.findUnique({
        where: { id : Number(id) },
        include: { imagens: true }
    });

    res.json(item).status(200).end();
};

// const atualizar = async (req, res) => {
//     const dados = {
//     ...req.body,
//     capacidade_maxima: Number(req.body.capacidade_maxima),
//     data_evento: new Date(req.body.data_evento)
// };
//     try {
//         const { id } = req.params;
//         const dados = req.body;
        
//         const item = await prisma.eventos.update({
//             where: { id : Number(id) },
//             data: dados
//         });

//         if (req.file) {
//             const pastaFinal = `uploads/eventos/${id}`;
//             const caminhoFinal = `${pastaFinal}/${req.file.filename}`;

//             if (!fs.existsSync(pastaFinal)) {
//                 fs.mkdirSync(pastaFinal, { recursive: true });
//             }

//             fs.renameSync(req.file.path, caminhoFinal);

//             await prisma.imagem.create({
//                 data: {
//                     nomeOriginal: req.file.originalname,
//                     nomeArquivo: req.file.filename,
//                     mimeType: req.file.mimetype,
//                     path: caminhoFinal,
//                     eventosId: Number(id),
//                 },
//             });
//         }

//         const atualizado = await prisma.eventos.findUnique({
//             where: { id: Number(id) },
//             include: { imagens: true }
//         });

//         res.json(atualizado).status(200).end();

//     } catch (error) {
//         res.json({ erro: error.message }).status(500).end();
//     }
// };

const atualizar = async (req, res) => {

    try {

        const { id } = req.params;

        const dados = {
            ...req.body,

            capacidade_maxima:
            Number(req.body.capacidade_maxima),

            data_evento:
            new Date(req.body.data_evento)
        };

        const item = await prisma.eventos.update({

            where: {
                id : Number(id)
            },

            data: dados
        });

        if (req.file) {

            const pastaFinal =
            `uploads/eventos/${id}`;

            const caminhoFinal =
            `${pastaFinal}/${req.file.filename}`;

            if (!fs.existsSync(pastaFinal)) {

                fs.mkdirSync(
                    pastaFinal,
                    { recursive: true }
                );
            }

            fs.renameSync(
                req.file.path,
                caminhoFinal
            );

            await prisma.imagem.create({
                data: {
                    nomeOriginal:
                    req.file.originalname,

                    nomeArquivo:
                    req.file.filename,

                    mimeType:
                    req.file.mimetype,

                    path: caminhoFinal,

                    eventosId: Number(id),
                },
            });
        }

        const atualizado =
        await prisma.eventos.findUnique({

            where: {
                id: Number(id)
            },

            include: {
                imagens: true
            }
        });

        res.status(200).json(atualizado);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            erro: error.message
        });
    }
};
// const excluir = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const evento = await prisma.eventos.findUnique({
//             where: { id: Number(id) },
//             include: { inscricoes: true }
//         });

//         if (!evento) {
//             return res.status(404).json({ erro: "Evento não encontrado" });
//         }

//         if (evento.inscricoes.length > 0) {
//             return res.status(400).json({
//                 erro: "Não é possível excluir este evento pois possui inscrições"
//             });
//         }

//         await prisma.eventos.delete({
//             where: { id: Number(id) }
//         });

//         return res.status(200).json({
//             mensagem: "Evento excluído com sucesso"
//         });

//     } catch (error) {
//         return res.status(500).json({ erro: error.message });
//     }
// };

const excluir = async (req, res) => {

    try {

        const { id } = req.params;

        const evento = await prisma.eventos.findUnique({
            where: { id: Number(id) },
            include: {
                inscricoes: true,
                imagens: true
            }
        });

        if (!evento) {
            return res.status(404).json({
                erro: "Evento não encontrado"
            });
        }

        if (evento.inscricoes.length > 0) {

            return res.status(400).json({
                erro:
                "Não é possível excluir este evento pois possui inscrições"
            });
        }

        await prisma.imagem.deleteMany({
            where: {
                eventosId: Number(id)
            }
        });

        await prisma.eventos.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({
            mensagem: "Evento excluído com sucesso"
        });

    } catch (error) {

        return res.status(500).json({
            erro: error.message
        });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};