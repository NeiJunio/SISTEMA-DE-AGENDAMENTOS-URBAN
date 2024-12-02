-- Remover as chaves estrangeiras

ALTER TABLE `agenda_servicos` DROP FOREIGN KEY `fk_agenda_servicos_agendamentos`;
ALTER TABLE `agenda_servicos` DROP FOREIGN KEY `fk_agenda_servicos_servicos`;
ALTER TABLE `agenda_servicos` DROP FOREIGN KEY `agend_serv_situ_id`;

ALTER TABLE `agendamentos` DROP FOREIGN KEY `agendamentos_fk1`;

ALTER TABLE `veiculo_usuario` DROP FOREIGN KEY `veiculo_usuario_fk1`;
ALTER TABLE `veiculo_usuario` DROP FOREIGN KEY `veiculo_usuario_fk2`;

ALTER TABLE `veiculos` DROP FOREIGN KEY `veiculos_fk1`;

ALTER TABLE `modelos` DROP FOREIGN KEY `modelos_fk2`;

ALTER TABLE `marcas` DROP FOREIGN KEY `marcas_fk3`;

ALTER TABLE `servicos` DROP FOREIGN KEY `FK_cat_serv_id`;

-- Remover as tabelas na ordem correta

DROP TABLE IF EXISTS `agenda_servicos`;
DROP TABLE IF EXISTS `agenda_servicos_situacao`;
DROP TABLE IF EXISTS `agendamentos`;
DROP TABLE IF EXISTS `veiculo_usuario`;
DROP TABLE IF EXISTS `veiculos`;
DROP TABLE IF EXISTS `modelos`;
DROP TABLE IF EXISTS `marcas`;
DROP TABLE IF EXISTS `categorias`;
DROP TABLE IF EXISTS `servicos`;
DROP TABLE IF EXISTS `categorias_servicos`;
DROP TABLE IF EXISTS `indisponibilidade`;
DROP TABLE IF EXISTS `disponibilidade`;
DROP TABLE IF EXISTS `usuarios`;