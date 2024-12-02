const db = require('../database/connection');

module.exports = {
    async  listarSituacoes(request, response) {
        try {
            const sql = `
                SELECT agend_serv_situ_id, 
                       agend_serv_situ_nome 
                  FROM agenda_servicos_situacao`;

            const [situacoes] = await db.query(sql);
            const nItens = situacoes.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de situações de serviços agendados.',
                dados: situacoes,
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

    async cadastrarSituacao(request, response) {
        try {
            const { agend_serv_situ_nome } = request.body;

            const sql = `
                INSERT INTO agenda_servicos_situacao (agend_serv_situ_nome) 
                                              VALUES (?)`;

            const values = [agend_serv_situ_nome];

            const [execSql] = await db.query(sql, values);
            const agend_serv_situ_id = execSql.insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de situação efetuado com sucesso.',
                dados: agend_serv_situ_id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarSituacao(request, response) {
        try {
            const { agend_serv_situ_nome } = request.body;
            const { agend_serv_situ_id } = request.params;

            const sql = `
                UPDATE agenda_servicos_situacao
                   SET agend_serv_situ_nome = ? 
                 WHERE agend_serv_situ_id = ?;`;

            const values = [agend_serv_situ_nome, agend_serv_situ_id];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Situação ${agend_serv_situ_id} atualizada com sucesso!`,
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

    async excluirSituacao(request, response) {
        try {
            const { agend_serv_situ_id } = request.params;
            const sql = `
                DELETE *
                  FROM agenda_servicos_situacao
                 WHERE agend_serv_situ_id = ?`;
            
            const values = [agend_serv_situ_id];
            const [excluir] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Situação ${agend_serv_situ_id} excluída com sucesso`,
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