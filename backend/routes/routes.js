const express = require('express'); // Importa o framework Express
const router = express.Router(); // Cria um roteador para definir rotas

// Importa os controladores responsáveis pela lógica das operações
const usuariosController = require('../controllers/usuarios');
const veiculosController = require('../controllers/veiculos');
const servicosController = require('../controllers/servicos');
const disponibilidadeController = require('../controllers/disponibilidade');
const indisponibilidadeController = require('../controllers/indisponibilidade');
const veiculoUsuarioController = require('../controllers/veiculoUsuario');
const agendaServicosController = require('../controllers/agendaServicos');
const agendaServicosSituacaoController = require('../controllers/agendaServicosSituacao');
const agendamentosController = require('../controllers/agendamentos');
const categoriasServicosController = require('../controllers/categoriasServicos');
const categoriasController = require('../controllers/categorias');
const marcasController = require('../controllers/marcas');
const modelosController = require('../controllers/modelos');
const agendamentoController = require('../controllers/agendamentos');

// Rotas relacionadas a usuários
router.get('/usuarios', usuariosController.listarUsuarios); // Lista todos os usuários
router.get('/usuarios/dadosUsuario/:usu_id', usuariosController.listarDadosUsuario); // Lista os dados de um usuário específico
router.post('/usuarios', usuariosController.cadastrarUsuarios); // Cadastra um novo usuário
router.post('/usuarios/verificarCpf', usuariosController.verificarCpf); // Verifica se o CPF já está cadastrado
router.post('/usuarios/verificarEmail', usuariosController.verificarEmail); // Verifica se o e-mail já está cadastrado
router.post('/usuarios/cpf', usuariosController.listarUsuarioPorCpf); // Lista um usuário pelo CPF
router.patch('/usuarios/:usu_id', usuariosController.editarUsuarios); // Edita os dados de um usuário
router.patch('/usuarios/ocultar/:usu_id', usuariosController.ocultarUsuario); // Oculta um usuário
router.delete('/usuarios/:usu_id', usuariosController.excluirUsuarios); // Exclui um usuário

router.post('/login', usuariosController.login); // Realiza o login do usuário ou do admin

// Rotas relacionadas a veículos
router.get('/veiculos', veiculosController.listarVeiculos); // Lista todos os veículos
router.get('/veiculos/:veic_id', veiculosController.visualizarVeiculo); // Visualiza os detalhes de um veículo específico
router.post('/veiculos', veiculosController.cadastrarVeiculo); // Cadastra um novo veículo
router.post('/verificarPlaca', veiculosController.verificarPlaca); // Verifica se a placa do veículo já está cadastrada
router.post('/veiculos/placa', veiculosController.listarVeiculoPorPlaca); // Lista um veículo pela placa
router.patch('/veiculos/:veic_id', veiculosController.editarVeiculo); // Edita os dados de um veículo
router.patch('/veiculos/usuario/:veic_id', veiculosController.usuarioEditandoVeiculo); // Atualiza o usuário relacionado ao veículo
router.patch('/veiculos/ocultar/:veic_id', veiculosController.ocultarVeiculo); // Oculta um veículo
router.delete('/veiculos/:veic_id', veiculosController.excluirVeiculo); // Exclui um veículo

// Rotas relacionadas a serviços
router.get('/servicos', servicosController.listarServicos); // Lista todos os serviços
router.get('/servicos/:serv_id', servicosController.visualizarServico); // Visualiza os detalhes de um serviço específico
router.get('/servicos/categoria/:cat_serv_id', servicosController.listarServicosPorCategoria); // Lista serviços por categoria
router.post('/servicos', servicosController.cadastrarServico); // Cadastra um novo serviço
router.patch('/servicos/:serv_id', servicosController.editarServico); // Edita os dados de um serviço
router.patch('/servicos/ocultar/:serv_id', servicosController.ocultarServico); // Oculta um serviço
router.delete('/servicos/:serv_id', servicosController.excluirServico); // Exclui um serviço

// Rotas relacionadas à disponibilidade
router.get('/disponibilidade', disponibilidadeController.listarDisponibilidade); // Lista as disponibilidades
router.post('/disponibilidade', disponibilidadeController.cadastrarDisponibilidade); // Cadastra uma nova disponibilidade
router.patch('/disponibilidade/:disp_id', disponibilidadeController.editarDisponibilidade); // Edita uma disponibilidade
router.patch('/disponibilidade/desabilitar/:disp_id', disponibilidadeController.desabilitarDisponibilidade); // Desabilita uma disponibilidade
router.delete('/disponibilidade/:disp_id', disponibilidadeController.excluirDisponibilidade); // Exclui uma disponibilidade

// Rotas relacionadas à indisponibilidade
router.get('/indisponibilidade', indisponibilidadeController.listarIndisponibilidade); // Lista as indisponibilidades
router.post('/indisponibilidade', indisponibilidadeController.cadastrarIndisponibilidade); // Cadastra uma nova indisponibilidade
router.patch('/indisponibilidade/:indisp_id', indisponibilidadeController.editarIndisponibilidade); // Edita uma indisponibilidade
router.patch('/indisponibilidade/desabilitar/:indisp_id', indisponibilidadeController.desabilitarIndisponibilidade); // Desabilita uma indisponibilidade
router.delete('/indisponibilidade/:indisp_id', indisponibilidadeController.excluirIndisponibilidade); // Exclui uma indisponibilidade

// Rotas relacionadas à associação de veículos a usuários
router.get('/veiculoUsuario', veiculoUsuarioController.listarVeiculosUsuario); // Lista todos os veículos associados aos usuários
router.get('/veiculoUsuario/proprietarios/:VeiculoId', veiculoUsuarioController.listarVeiculoUsuarioPorId); // Lista os proprietários de um veículo específico
router.get('/veiculoUsuario/usuario/:UsuarioId', veiculoUsuarioController.listarVeicUsuarioPorId); // Lista os veículos associados a um usuário específico
router.post('/veiculoUsuario', veiculoUsuarioController.cadastrarVeiculoUsuario); // Associa um veículo a um usuário
router.patch('/veiculoUsuario/:veic_usu_id', veiculoUsuarioController.editarVeiculoUsuario); // Edita a associação de um veículo a um usuário
router.patch('/veiculoUsuario/:veic_usu_id/data_final', veiculoUsuarioController.atualizarDataFinalVeiculoUsuario); // Atualiza a data final de uma associação
router.delete('/veiculoUsuario/:veic_usu_id', veiculoUsuarioController.excluirVeiculoUsuario); // Exclui uma associação de veículo a usuário

// Rotas relacionadas à agenda de serviços
router.get('/agendaServicos', agendaServicosController.listarAgendaServicos); // Lista todos os registros na agenda de serviços
router.post('/agendaServicos', agendaServicosController.cadastrarAgendaServico); // Cadastra um novo registro na agenda de serviços
router.patch('/agendaServicos/:agend_serv_id', agendaServicosController.editarAgendaServico); // Edita um registro na agenda de serviços
router.delete('/agendaServicos/:agend_serv_id', agendaServicosController.excluirAgendaServico); // Exclui um registro da agenda de serviços

// Rotas relacionadas às situações da agenda de serviços
router.get('/agendaServicosSituacao', agendaServicosSituacaoController.listarSituacoes); // Lista todas as situações da agenda de serviços
router.post('/agendaServicosSituacao', agendaServicosSituacaoController.cadastrarSituacao); // Cadastra uma nova situação
router.patch('/agendaServicosSituacao/:agend_serv_situ_id', agendaServicosSituacaoController.editarSituacao); // Edita uma situação existente
router.delete('/agendaServicosSituacao/:agend_serv_situ_id', agendaServicosSituacaoController.excluirSituacao); // Exclui uma situação

// Rotas relacionadas aos agendamentos
router.get('/agendamentos', agendamentosController.listarTodosAgendamentos); // Lista todos os agendamentos
router.get('/agendamentos/todos', agendamentosController.listarAgendamentos); // Lista os agendamentos de todos os usuários
router.get('/agendamentos/usuarios/:UsuarioId/:UserAcesso/:Month/:Year', agendamentosController.listarAgendamentosDoUsuario); // Lista os agendamentos de um usuário para um mês/ano específico
router.get('/agendamentos/situacao/:agend_situacao', agendamentoController.listarAgendamentosPorSituacao); // Lista agendamentos filtrados por situação
router.get('/agendamentos/:UsuarioId', agendamentoController.listarHistoricoDoUsuario); // Lista o histórico de agendamentos de um usuário
router.post('/agendamentos', agendamentosController.cadastrarAgendamento); // Cadastra um novo agendamento
router.patch('/agendamentos/:agend_id', agendamentosController.editarAgendamento); // Edita os detalhes de um agendamento
router.patch('/agendamentos/situacao/:agend_id', agendamentoController.editarSituacaoAgendamento); // Atualiza a situação de um agendamento
router.patch('/agendamentos/cancelar/:agend_id', agendamentosController.cancelarAgendamento); // Cancela um agendamento

// Rotas relacionadas às categorias de serviços
router.get('/categoriasServicos', categoriasServicosController.listarCategorias); // Lista todas as categorias de serviços
router.get('/categoriasServicosAtivas', categoriasServicosController.listarCategoriasAtivas); // Lista apenas as categorias de serviços ativas
router.post('/categoriasServicos', categoriasServicosController.cadastrarCategoria); // Cadastra uma nova categoria de serviço
router.patch('/categoriasServicos/:cat_serv_id', categoriasServicosController.editarCategoria); // Edita uma categoria de serviço
router.patch('/categoriasServicos/:cat_serv_id/visibilidade', categoriasServicosController.alterarVisibilidadeCategoria); // Altera a visibilidade de uma categoria de serviço
router.delete('/categoriasServicos/:cat_serv_id', categoriasServicosController.excluirCategoria); // Exclui uma categoria de serviço

// Rotas relacionadas às categorias
router.get('/categorias', categoriasController.listarCategorias); // Lista todas as categorias
router.post('/categorias', categoriasController.cadastrarCategoria); // Cadastra uma nova categoria
router.patch('/categorias/:cat_id', categoriasController.editarCategoria); // Edita uma categoria
router.delete('/categorias/:cat_id', categoriasController.excluirCategoria); // Exclui uma categoria

// Rotas relacionadas às marcas
router.get('/marcas', marcasController.listarMarcas); // Lista todas as marcas
router.get('/marcas/categorias/:cat_id', marcasController.listarMarcaPorCategoria); // Lista as marcas relacionadas a uma categoria
router.post('/marcas', marcasController.cadastrarMarca); // Cadastra uma nova marca
router.patch('/marcas/:mar_id', marcasController.editarMarca); // Edita uma marca
router.delete('/marcas/:mar_id', marcasController.excluirMarca); // Exclui uma marca

// Rotas relacionadas aos modelos
router.get('/modelos', modelosController.listarModelos); // Lista todos os modelos
router.get('/modelos/marca/:mar_id', modelosController.listarModelosPorMarca); // Lista modelos relacionados a uma marca
router.get('/modelos/cat/:cat_id/mar/:mar_id', modelosController.listarModelosPorCategoriaEMarca); // Lista modelos relacionados a uma categoria e marca
router.post('/modelos', modelosController.cadastrarModelo); // Cadastra um novo modelo
router.patch('/modelos/:mod_id', modelosController.editarModelo); // Edita um modelo
router.delete('/modelos/:mod_id', modelosController.excluirModelo); // Exclui um modelo

module.exports = router; // Exporta o roteador para ser usado no servidor principal

