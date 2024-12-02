const db = require('../database/connection');

module.exports = {
    async listarAgendaServicos(request, response) {
        try {
            const sql = `
                SELECT agend_serv_id, 
                       agend_id, 
                       serv_id, 
                       agend_serv_situ_id 
                  FROM agenda_servicos`;

            const [agendaServicos] = await db.query(sql);
            const nItens = agendaServicos.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de serviços agendados.',
                dados: agendaServicos,
                nItens
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async cadastrarAgendaServico(request, response) {
        try {
            const {
                agend_id,
                serv_id,
                agend_serv_situ_id
            } = request.body;

            const sql = `
                INSERT INTO agenda_servicos (agend_id, serv_id, agend_serv_situ_id) 
                                     VALUES (?, ?, ?)`;

            const values = [
                agend_id,
                serv_id,
                agend_serv_situ_id
            ];

            const [execSql] = await db.query(sql, values);
            const agend_serv_id = execSql.insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de serviço agendado efetuado com sucesso.',
                dados: agend_serv_id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarAgendaServico(request, response) {
        try {
            const {
                agend_id,
                serv_id,
                agend_serv_situ_id
            } = request.body;

            const { agend_serv_id } = request.params;

            const sql = `
                UPDATE agenda_servicos
                   SET agend_id = ?, 
                       serv_id = ?, 
                       agend_serv_situ_id = ? 
                 WHERE agend_serv_id = ?`;

            const values = [
                agend_id,
                serv_id,
                agend_serv_situ_id,
                agend_serv_id
            ];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Serviço agendado ${agend_serv_id} atualizado com sucesso!`,
                dados: atualizaDados.affectedRows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async excluirAgendaServico(request, response) {
        try {
            const { agend_serv_id } = request.params;

            const sql = `
                DELETE *
                  FROM agenda_servicos
                 WHERE agend_serv_id = ?`;
                 
            const values = [agend_serv_id];
            const [excluir] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Serviço agendado ${agend_serv_id} excluído com sucesso`,
                dados: excluir.affectedRows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }
}