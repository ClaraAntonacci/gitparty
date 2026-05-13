const prisma = require("../data/prisma");
const {limiteParticipantes, verificarDuplicidade, excluirInscricao, atualizarStatusInscricao} = require("../services/inscricoes.services");

const cadastrar = async (req, res) => {
  try {
    const data = req.body;

    await verificarDuplicidade(data.usuariosId, data.eventosId);

    const status = await limiteParticipantes(data.usuariosId, data.eventosId);
    data.status = status;

    const inscricao = await prisma.inscricoes.create({ data });
    return res.status(201).json(inscricao);
  } catch (error) {
    return res.status(400).json({ erro: error.message || error.toString() });
  }
};

const listar = async (req, res) => {
  const lista = await prisma.inscricoes.findMany();
  return res.status(200).json(lista);
};

const buscar = async (req, res) => {
  const { id } = req.params;
  const item = await prisma.inscricoes.findUnique({ where: { id: Number(id) } });

  if (!item) return res.status(404).json({ erro: "Inscrição não encontrada." });
  return res.status(200).json(item);
};

const atualizar = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  const item = await prisma.inscricoes.update({
    where: { id: Number(id) },
    data: dados,
  });
  return res.status(200).json(item);
};

const excluir = async (req, res) => {
  try {
    const { id } = req.params;

    const inscricao = await prisma.inscricoes.findUnique({
      where: { id: Number(id) },
    });

    if (!inscricao) {
      return res.status(404).json({ erro: "Inscrição não encontrada." });
    }

    await excluirInscricao(inscricao.usuariosId, inscricao.eventosId);

    return res.status(200).json({ mensagem: "Cancelada com sucesso" });
  } catch (error) {
    return res.status(400).json({ erro: error.message || error.toString() });
  }
};

module.exports = {
  cadastrar,
  listar,
  buscar,
  atualizar,
  excluir,
};