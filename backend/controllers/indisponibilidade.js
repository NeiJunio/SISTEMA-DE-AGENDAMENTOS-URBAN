const db = require('../database/connection');

module.exports = {
    async listarIndisponibilidade(request, response) {
        try {
            const sql = `
            SELECT indisp_id, 
                   indisp_data, 
                   indisp_situacao
              FROM indisponibilidade`;

            const [indisponibilidades] = await db.query(sql);
            const nItens = indisponibilidades.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de indisponibilidades.',
                dados: indisponibilidades,
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

    async cadastrarIndisponibilidade(request, response) {
        try {
            const { indisp_data, indisp_situacao } = request.body;

            const sql = `
                INSERT INTO indisponibilidade (indisp_data, indisp_situacao) 
                                       VALUES (?, ?)`;

            const values = [indisp_data, indisp_situacao];

            const [execSql] = await db.query(sql, values);
            const indisp_id = execSql.insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de indisponibilidade efetuado com sucesso.',
                dados: indisp_id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarIndisponibilidade(request, response) {
        try {
            const { indisp_data } = request.body;
            const { indisp_id } = request.params;

            const sql = `
                UPDATE indisponibilidade
                   SET indisp_data = ?
                 WHERE indisp_id = ?`;

            const values = [indisp_data, indisp_id];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Indisponibilidade ${indisp_id} atualizada com sucesso!`,
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

    async excluirIndisponibilidade(request, response) {
        try {
            const { indisp_id } = request.params;

            const sql = `
                DELETE *
                  FROM indisponibilidade
                 WHERE indisp_id = ?`;

            const values = [indisp_id];
            const [excluir] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Indisponibilidade ${indisp_id} excluída com sucesso`,
                dados: excluir.affectedRows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async desabilitarIndisponibilidade(request, response) {
        try {
            const {
                indisp_situacao
            } = request.body;

            const { indisp_id } = request.params;

            const sql = `
                UPDATE indisponibilidade
                   SET indisp_situacao = ?
                 WHERE indisp_id = ?`;
                 
            const values = [indisp_situacao, indisp_id];
            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Indisponibilidade ${indisp_id} ${indisp_situacao ? 'habilitada' : 'desabilitada'} com sucesso!`,
                dados: atualizaDados.affectedRows
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