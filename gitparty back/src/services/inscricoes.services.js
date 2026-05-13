const prisma = require("../data/prisma");

const limiteParticipantes = async (usuarioId, eventoId) => {
  const evento = await prisma.eventos.findUnique({
    where: { id: eventoId },
    include: { inscricoes: true },
  });

  if (!evento) throw new Error("Evento não encontrado.");

  const numeroParticipantes = evento.inscricoes.filter(
    (inscricao) => inscricao.status === "CONFIRMADA"
  ).length;

  return numeroParticipantes >= evento.capacidade_maxima
    ? "LISTA_ESPERA"
    : "CONFIRMADA";
};

const verificarDuplicidade = async (usuarioId, eventoId) => {
  const cadastro = await prisma.inscricoes.findFirst({
    where: { eventosId: eventoId, usuariosId: usuarioId },
  });

  if (cadastro) throw new Error("Usuário já cadastrado.");
};

const excluirInscricao = async (usuarioId, eventoId) => {
  const inscricao = await prisma.inscricoes.findFirst({
    where: { eventosId: eventoId, usuariosId: usuarioId },
    include: { eventos: true },
  });

  if (!inscricao) throw new Error("Inscrição não encontrada.");
  if (!inscricao.eventos) throw new Error("Evento não encontrado.");

  const hoje = new Date();
  const dataEvento = new Date(inscricao.eventos.data_evento);
  const diferencaHoras = (dataEvento - hoje) / (1000 * 60 * 60);

  if (diferencaHoras > 0 && diferencaHoras < 24) {
    throw new Error("Não é possível cancelar a inscrição com menos de 24 horas para o evento.");
  }
  
  await prisma.inscricoes.update({
    where: { id: inscricao.id },
    data: { status: "CANCELADA" },
  });

  await atualizarStatusInscricao(eventoId);

  return inscricao;
};

const atualizarStatusInscricao = async (eventoId) => {
  const proximo = await prisma.inscricoes.findFirst({
    where: { eventosId: eventoId, status: "LISTA_ESPERA" },
    orderBy: { data_incricao: "asc" },
  });

  if (!proximo) return;

  await prisma.inscricoes.update({
    where: { id: proximo.id },
    data: { status: "CONFIRMADA" },
  });
};

module.exports = {
  limiteParticipantes,
  verificarDuplicidade,
  excluirInscricao,
  atualizarStatusInscricao,
};

// //3
// let hoje =new Date();//date e hora atual
// let algumadata = new Date("2024-12-08 19:59");//data 

// algumadata - hoje => intervalo em milisegundos//tranforma em milisegundos e so transformar em horas

// //4
// //CANCELAR a inscrição
// //SE staus == CONfIRMADA
// //where eventosId == id && status == "LISTA_ESPERA" ORDER BY data_inscricao