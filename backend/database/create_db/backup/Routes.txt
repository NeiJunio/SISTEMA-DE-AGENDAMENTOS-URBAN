const express = require('express');
const router = express.Router();

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


router.get('/usuarios', usuariosController.listarUsuarios);
router.get('/usuarios/dadosUsuario/:usu_id', usuariosController.listarDadosUsuario);
router.post('/usuarios', usuariosController.cadastrarUsuarios);
router.post('/usuarios/verificarCpf', usuariosController.verificarCpf);
router.post('/usuarios/verificarEmail', usuariosController.verificarEmail);
router.post('/usuarios/cpf', usuariosController.listarUsuarioPorCpf);
router.patch('/usuarios/:usu_id', usuariosController.editarUsuarios);
router.patch('/usuarios/ocultar/:usu_id', usuariosController.ocultarUsuario);
router.delete('/usuarios/:usu_id', usuariosController.excluirUsuarios);


router.post('/login', usuariosController.login);


router.get('/veiculos', veiculosController.listarVeiculos);
router.get('/veiculos/:veic_id', veiculosController.visualizarVeiculo);
router.post('/veiculos', veiculosController.cadastrarVeiculo);
router.post('/verificarPlaca', veiculosController.verificarPlaca);
router.post('/veiculos/placa', veiculosController.listarVeiculoPorPlaca);
router.patch('/veiculos/:veic_id', veiculosController.editarVeiculo);
router.patch('/veiculos/usuario/:veic_id', veiculosController.usuarioEditandoVeiculo);
router.patch('/veiculos/ocultar/:veic_id', veiculosController.ocultarVeiculo);
router.delete('/veiculos/:veic_id', veiculosController.excluirVeiculo);


router.get('/servicos', servicosController.listarServicos);
router.get('/servicos/:serv_id', servicosController.visualizarServico);
router.get('/servicos/categoria/:cat_serv_id', servicosController.listarServicosPorCategoria);
router.post('/servicos', servicosController.cadastrarServico);
router.patch('/servicos/:serv_id', servicosController.editarServico);
router.patch('/servicos/ocultar/:serv_id', servicosController.ocultarServico);
router.delete('/servicos/:serv_id', servicosController.apagarServico);


router.get('/disponibilidade', disponibilidadeController.listarDisponibilidade);
router.post('/disponibilidade', disponibilidadeController.cadastrarDisponibilidade);
router.patch('/disponibilidade/:disp_id', disponibilidadeController.editarDisponibilidade);
router.patch('/disponibilidade/desabilitar/:disp_id', disponibilidadeController.desabilitarDisponibilidade);
router.delete('/disponibilidade/:disp_id', disponibilidadeController.excluirDisponibilidade);


router.get('/indisponibilidade', indisponibilidadeController.listarIndisponibilidade);
router.post('/indisponibilidade', indisponibilidadeController.cadastrarIndisponibilidade);
router.patch('/indisponibilidade/:indisp_id', indisponibilidadeController.editarIndisponibilidade);
router.patch('/indisponibilidade/desabilitar/:indisp_id', indisponibilidadeController.desabilitarIndisponibilidade);
router.delete('/indisponibilidade/:indisp_id', indisponibilidadeController.excluirIndisponibilidade);


router.get('/veiculoUsuario', veiculoUsuarioController.listarVeiculosUsuario);
router.get('/veiculoUsuario/proprietarios/:VeiculoId', veiculoUsuarioController.listarVeiculoUsuarioPorId);


router.get('/veiculoUsuario/usuario/:UsuarioId', veiculoUsuarioController.listarVeicUsuarioPorId);
router.post('/veiculoUsuario', veiculoUsuarioController.cadastrarVeiculoUsuario);
router.patch('/veiculoUsuario/:veic_usu_id', veiculoUsuarioController.editarVeiculoUsuario);
router.patch('/veiculoUsuario/:veic_usu_id/data_final', veiculoUsuarioController.atualizarDataFinalVeiculoUsuario);
router.delete('/veiculoUsuario/:veic_usu_id', veiculoUsuarioController.excluirVeiculoUsuario);


router.get('/agendaServicos', agendaServicosController.listarAgendaServicos);
router.post('/agendaServicos', agendaServicosController.cadastrarAgendaServico);
router.patch('/agendaServicos/:agend_serv_id', agendaServicosController.editarAgendaServico);
router.delete('/agendaServicos/:agend_serv_id', agendaServicosController.excluirAgendaServico);


router.get('/agendaServicosSituacao', agendaServicosSituacaoController.listarSituacoes);
router.post('/agendaServicosSituacao', agendaServicosSituacaoController.cadastrarSituacao);
router.patch('/agendaServicosSituacao/:agend_serv_situ_id', agendaServicosSituacaoController.editarSituacao);
router.delete('/agendaServicosSituacao/:agend_serv_situ_id', agendaServicosSituacaoController.excluirSituacao);


router.get('/agendamentos', agendamentosController.listarTodosAgendamentos);
router.get('/agendamentos/todos', agendamentosController.listarAgendamentos);
router.get('/agendamentos/usuarios/:UsuarioId/:UserAcesso/:Month/:Year', agendamentosController.listarAgendamentosDoUsuario);
router.get('/agendamentos/situacao/:agend_situacao', agendamentoController.listarAgendamentosPorSituacao); 
router.get('/agendamentos/:UsuarioId', agendamentoController.listarHistoricoDoUsuario);
router.post('/agendamentos', agendamentosController.cadastrarAgendamento);
router.patch('/agendamentos/:agend_id', agendamentosController.editarAgendamento);
router.patch('/agendamentos/situacao/:agend_id', agendamentoController.editarSituacaoAgendamento);
router.patch('/agendamentos/cancelar/:agend_id', agendamentosController.cancelarAgendamento);


router.get('/categoriasServicos', categoriasServicosController.listarCategorias);
router.get('/categoriasServicosAtivas', categoriasServicosController.listarCategoriasAtivas);
router.post('/categoriasServicos', categoriasServicosController.cadastrarCategoria);
router.patch('/categoriasServicos/:cat_serv_id', categoriasServicosController.editarCategoria);
router.patch('/categoriasServicos/:cat_serv_id/visibilidade', categoriasServicosController.alterarVisibilidadeCategoria);
router.delete('/categoriasServicos/:cat_serv_id', categoriasServicosController.excluirCategoria);


router.get('/categorias', categoriasController.listarCategorias);
router.post('/categorias', categoriasController.cadastrarCategoria);
router.patch('/categorias/:cat_id', categoriasController.editarCategoria);
router.delete('/categorias/:cat_id', categoriasController.excluirCategoria);


router.get('/marcas', marcasController.listarMarcas);
router.get('/marcas/categorias/:cat_id', marcasController.listarMarcaPorCategoria);
router.post('/marcas', marcasController.cadastrarMarca);
router.patch('/marcas/:mar_id', marcasController.editarMarca);
router.delete('/marcas/:mar_id', marcasController.excluirMarca);


router.get('/modelos', modelosController.listarModelos);
router.get('/modelos/marca/:mar_id', modelosController.listarModelosPorMarca);
router.get('/modelos/cat/:cat_id/mar/:mar_id', modelosController.listarModelosPorCategoriaEMarca);
router.post('/modelos', modelosController.cadastrarModelo);
router.patch('/modelos/:mod_id', modelosController.editarModelo);
router.delete('/modelos/:mod_id', modelosController.excluirModelo);

module.exports = router;