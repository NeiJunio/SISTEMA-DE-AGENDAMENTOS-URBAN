-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS `usuarios` (
	`usu_id` int AUTO_INCREMENT NOT NULL UNIQUE, -- Identificador único do usuário
	`usu_nome` varchar(60) NOT NULL, -- Nome do usuário
	`usu_cpf` char(14) NOT NULL, -- CPF do usuário (formato: XXX.XXX.XXX-XX)
	`usu_data_nasc` date NOT NULL, -- Data de nascimento do usuário
	`usu_sexo` tinyint NOT NULL, -- Sexo do usuário (0: Masculino, 1: Feminino)
	`usu_telefone` varchar(20) NOT NULL, -- Telefone do usuário
	`usu_email` varchar(80) NOT NULL, -- Email do usuário
	`usu_observ` varchar(120) NOT NULL, -- Observações sobre o usuário
	`usu_acesso` boolean NOT NULL, -- Indicador de acesso (ativo/inativo)
	`usu_senha` varchar(256) NOT NULL, -- Senha do usuário
	`usu_situacao` bit(1) NULL; -- Status de usuário
	PRIMARY KEY (`usu_id`) -- Chave primária
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS `categorias` (
	`cat_id` int AUTO_INCREMENT NOT NULL UNIQUE, -- Identificador único da categoria
	`cat_nome` varchar(50) NOT NULL, -- Nome da categoria
	`cat_icone` varchar(128), -- Ícone da categoria (caminho ou URL)
	PRIMARY KEY (`cat_id`) -- Chave primária
);

-- Tabela de Disponibilidade
CREATE TABLE IF NOT EXISTS `disponibilidade` (
	`disp_id` int AUTO_INCREMENT NOT NULL UNIQUE, -- Identificador único da disponibilidade
	`disp_dia` char(3) NOT NULL, -- Dia da semana (ex: SEG, TER)
	`disp_periodo` tinyint NOT NULL, -- Período do dia (0: Manhã, 1: Tarde, 2: Noite)
	`disp_hr_ini` time NOT NULL, -- Hora de início da disponibilidade
	`disp_hr_fin` time NOT NULL, -- Hora de fim da disponibilidade
	PRIMARY KEY (`disp_id`) -- Chave primária
);

-- Tabela de Indisponibilidade
CREATE TABLE IF NOT EXISTS `indisponibilidade` (
	`indisp_id` int AUTO_INCREMENT NOT NULL UNIQUE, -- Identificador único da indisponibilidade
	`indisp_data` date NOT NULL, -- Data da indisponibilidade
	PRIMARY KEY (`indisp_id`) -- Chave primária
);

-- Tabela de Marcas
CREATE TABLE IF NOT EXISTS `marcas` (
	`mar_id` int AUTO_INCREMENT NOT NULL UNIQUE, -- Identificador único da marca
	`mar_nome` varchar(50) NOT NULL, -- Nome da marca
	`mar_cod` int NOT NULL, -- Código da marca
	`mar_icone` varchar(128), -- Ícone da marca (caminho ou URL)
	`cat_id` int NULL, -- Chave estrangeira para a tabela categorias
	PRIMARY KEY (`mar_id`) -- Chave primária
);

-- Tabela de Modelos
CREATE TABLE IF NOT EXISTS `modelos` (
	`mod_id` int AUTO_INCREMENT NOT NULL UNIQUE, -- Identificador único do modelo
	`mod_nome` varchar(60) NOT NULL, -- Nome do modelo
	`mod_cod` int NOT NULL, -- Código do modelo
	`mar_cod` int NOT NULL, -- Código da marca (potencialmente redundante)
	`mar_id` int NULL, -- Chave estrangeira para a tabela marcas
	PRIMARY KEY (`mod_id`) -- Chave primária
);

-- Tabela de Veículos
CREATE TABLE IF NOT EXISTS `veiculos` (
	`veic_id` int AUTO_INCREMENT NOT NULL UNIQUE, -- Identificador único do veículo
	`mod_id` int NOT NULL, -- Chave estrangeira para a tabela modelos
	`veic_placa` varchar(10) NOT NULL, -- Placa do veículo
	`veic_ano` varchar(4) NOT NULL, -- Ano do veículo (pode ser melhor como YEAR)
	`veic_cor` varchar(15) NOT NULL, -- Cor do veículo
	`veic_combustivel` varchar(20) NOT NULL, -- Tipo de combustível do veículo
	`veic_observ` varchar(200) NOT NULL, -- Observações sobre o veículo
	`veic_situacao` bit(1) NOT NULL, -- Status do veiculo
	PRIMARY KEY (`veic_id`) -- Chave primária
);

-- Tabela de Relação entre Veículo e Usuário
CREATE TABLE IF NOT EXISTS `veiculo_usuario` (
	`veic_usu_id` int AUTO_INCREMENT NOT NULL UNIQUE, -- Identificador único da relação
	`veic_id` int NOT NULL, -- Chave estrangeira para a tabela veículos
	`usu_id` int NOT NULL, -- Chave estrangeira para a tabela usuários
	`ehproprietario` bit(1) NOT NULL, -- Indicador se o usuário é proprietário do veículo
	`data_inicial` date NOT NULL, -- Data inicial de posse
	`data_final` date, -- Data final de posse (opcional)
	PRIMARY KEY (`veic_usu_id`) -- Chave primária
);

-- Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS `agendamentos` (
	`agend_id` int AUTO_INCREMENT NOT NULL UNIQUE, -- Identificador único do agendamento
	`veic_usu_id` int NOT NULL,
	`agend_data` date NOT NULL, -- Data do agendamento
	`agend_horario` time NOT NULL, -- Horário do agendamento
	`agend_situacao` int NOT NULL, -- Situação do agendamento
	`agend_observ` varchar(200) NOT NULL, -- Observações sobre o agendamento
	PRIMARY KEY (`agend_id`) -- Chave primária
);

-- Tabela Agenda_serviços
CREATE TABLE IF NOT EXISTS `agenda_servicos` (
	`agend_serv_id` int AUTO_INCREMENT NOT NULL UNIQUE, -- Identificador único do serviço agendado
	`agend_id` int NOT NULL,
	`serv_id` INT NOT NULL,
	`agend_serv_situ_id` INT NOT NULL,
	 PRIMARY KEY (`agend_serv_id`),  -- Chave primária
	 FOREIGN KEY (`agend_serv_situ_id`) REFERENCES agenda_servicos_situacao (`agend_serv_situ_id`)
);

CREATE TABLE IF NOT EXISTS `agenda_servicos_situacao` (
	`agend_serv_situ_id` int AUTO_INCREMENT NOT NULL, -- Identificador único da situação do serviço agendado
	`agend_serv_situ_nome` varchar(50) NOT NULL, -- Nome da situação
	PRIMARY KEY (`agend_serv_situ_id`)  -- Chave primária
);

-- Tabela de Categorias de Serviços
CREATE TABLE IF NOT EXISTS `categorias_servicos` (
    `cat_serv_id` INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único da categoria de serviço
    `cat_serv_nome` VARCHAR(60) NOT NULL -- Nome da categoria de serviço
);

-- Tabela de Serviços
CREATE TABLE IF NOT EXISTS `servicos` (
    `serv_id` INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único do serviço
    `cat_serv_id` INT NULL, -- Chave estrangeira para a tabela categorias_servicos
    `serv_nome` VARCHAR(60) NOT NULL, -- Nome do serviço
    `serv_duracao` TIME NOT NULL, -- Duração do serviço
    `serv_preco` DECIMAL(7,2) NOT NULL, -- Preço do serviço
    `serv_descricao` VARCHAR(200) NOT NULL, -- Descrição do serviço
    `serv_situacao` BIT NOT NULL, -- Situação do serviço (ativo/inativo)
    FOREIGN KEY (`cat_serv_id`) REFERENCES categorias_servicos(`cat_serv_id`) -- Chave estrangeira
);

-- Adicionando Chaves Estrangeiras

-- Tabela Veículos referenciando Modelos
ALTER TABLE `veiculos` ADD CONSTRAINT `veiculos_fk1` FOREIGN KEY (`mod_id`) REFERENCES `modelos`(`mod_id`);

-- Tabela Agendamentos referenciando Veículo_Usuario
ALTER TABLE `agendamentos` ADD CONSTRAINT `agendamentos_fk1` FOREIGN KEY (`veic_usu_id`) REFERENCES `veiculo_usuario`(`veic_usu_id`);

-- Tabela Veículo_Usuario referenciando Veículos
ALTER TABLE `veiculo_usuario` ADD CONSTRAINT `veiculo_usuario_fk1` FOREIGN KEY (`veic_id`) REFERENCES `veiculos`(`veic_id`);

-- Tabela Veículo_Usuario referenciando Usuários
ALTER TABLE `veiculo_usuario` ADD CONSTRAINT `veiculo_usuario_fk2` FOREIGN KEY (`usu_id`) REFERENCES `usuarios`(`usu_id`);

-- Tabela Modelos referenciando Marcas
ALTER TABLE `modelos` ADD CONSTRAINT `modelos_fk2` FOREIGN KEY (`mar_id`) REFERENCES `marcas`(`mar_id`);

-- Tabela Serviços referenciando Categorias_Servicos
ALTER TABLE `servicos` ADD CONSTRAINT `FK_cat_serv_id` FOREIGN KEY (`cat_serv_id`) REFERENCES `categorias_servicos`(`cat_serv_id`);

-- Tabela Marcas referenciando Categorias
ALTER TABLE `marcas` ADD CONSTRAINT `marcas_fk3` FOREIGN KEY (`cat_id`) REFERENCES `categorias`(`cat_id`);

-- Adicionando chave estrangeira na tabela agenda_servicos para agendamentos
ALTER TABLE `agenda_servicos` ADD CONSTRAINT `fk_agenda_servicos_agendamentos` FOREIGN KEY (`agend_id`) REFERENCES `agendamentos`(`agend_id`);

-- Adicionando chave estrangeira na tabela agenda_servicos para servicos
ALTER TABLE `agenda_servicos` ADD CONSTRAINT `fk_agenda_servicos_servicos` FOREIGN KEY (`serv_id`) REFERENCES `servicos`(`serv_id`);



ALTER TABLE `usuarios` ADD `usu_situacao` BIT(1) NOT NULL; -- Adiciona uma nova coluna 'usu_situacao' do tipo BIT(1) na tabela 'usuarios'
UPDATE `usuarios` SET `usu_situacao` = 1 WHERE `usu_situacao` = 0; -- Atualiza a coluna 'usu_situacao' para 1 onde atualmente é 0


ALTER TABLE `veiculos` ADD `veic_situacao` BIT(1) NOT NULL; -- Adiciona uma nova coluna 'veic_situacao' do tipo BIT(1) na tabela 'veiculos'
UPDATE `veiculos` SET `veic_situacao` = 1 WHERE `veic_situacao` = 0; -- Atualiza a coluna 'veic_situacao' para 1 onde atualmente é 0


ALTER TABLE `usuarios` CHANGE COLUMN `usu_status` `usu_situacao` BIT(1); -- Renomeia a coluna 'usu_status' para 'usu_situacao' e altera seu tipo de dados para BIT(1)

ALTER TABLE `disponibilidade` ADD `disp_situacao` BIT(1) NOT NULL;
UPDATE `disponibilidade` SET `disp_situacao` = 1 WHERE `disp_situacao` = 0;


ALTER TABLE `indisponibilidade` ADD `indisp_situacao` BIT(1) NOT NULL;
UPDATE `indisponibilidade` SET `indisp_situacao` = 1 WHERE `indisp_situacao` = 0;


ALTER TABLE `agendamentos` ADD `serv_id` INTEGER NULL;
ALTER TABLE `agendamentos` ADD `agend_serv_situ_id` INTEGER DEFAULT 1;


ALTER TABLE `agendamentos` ADD CONSTRAINT `fk_agendamentos_servicos` FOREIGN KEY (`serv_id`) REFERENCES `servicos` (`serv_id`);
ALTER TABLE `agendamentos` ADD CONSTRAINT `fk_agendamentos_agenda_servicos_situacao` FOREIGN KEY (`agend_serv_situ_id`) REFERENCES `agenda_servicos_situacao` (`agend_serv_situ_id`);


-- MODIFICAR PARA LOGIN
ALTER TABLE `usuarios` MODIFY COLUMN `usu_situacao` TINYINT(1) DEFAULT 1;

-- Garantir Sensibilidade a Maiúsculas/Minúsculas no Banco
ALTER TABLE `usuarios` MODIFY `usu_senha` VARCHAR(255) COLLATE utf8mb4_bin;