const db = require('../database/connection');

module.exports = {

    async listarDisponibilidade(request, response) {
        try {
            const sql = `
            SELECT disp_id, 
                   disp_dia, 
                   disp_periodo, 
                   disp_hr_ini, 
                   disp_hr_fin, 
                   disp_situacao
              FROM disponibilidade`;

            const [disponibilidades] = await db.query(sql);
            const nItens = disponibilidades.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de disponibilidades.',
                dados: disponibilidades,
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

    async cadastrarDisponibilidade(request, response) {
        try {
            const {
                disp_dia,
                disp_periodo,
                disp_hr_ini,
                disp_hr_fin,
                disp_situacao
            } = request.body;

            const sql = `
                INSERT INTO disponibilidade (disp_dia, disp_periodo, disp_hr_ini, disp_hr_fin, disp_situacao) 
                                     VALUES (?, ?, ?, ?, ?)`;

            const values = [
                disp_dia,
                disp_periodo,
                disp_hr_ini,
                disp_hr_fin,
                disp_situacao
            ];

            const [execSql] = await db.query(sql, values);
            const disp_id = execSql.insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de disponibilidade efetuado com sucesso.',
                dados: disp_id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarDisponibilidade(request, response) {
        try {
            const {
                disp_dia,
                disp_periodo,
                disp_hr_ini,
                disp_hr_fin,
                disp_situacao
            } = request.body;

            const { disp_id } = request.params;

            const sql = `
                UPDATE disponibilidade
                   SET disp_dia = ?, 
                       disp_periodo = ?, 
                       disp_hr_ini = ?, 
                       disp_hr_fin = ?, 
                       disp_situacao = ?
                 WHERE disp_id = ?;`;

            const values = [
                disp_dia,
                disp_periodo,
                disp_hr_ini,
                disp_hr_fin,
                disp_situacao,
                disp_id
            ];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Disponibilidade ${disp_id} atualizada com sucesso!`,
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

    async excluirDisponibilidade(request, response) {
        try {
            const { disp_id } = request.params;

            const sql = `
                DELETE * 
                  FROM disponibilidade
                 WHERE disp_id = ?`;

            const values = [disp_id];
            const [excluir] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Disponibilidade ${disp_id} excluída com sucesso`,
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

    async desabilitarDisponibilidade(request, response) {
        try {
            const {
                disp_situacao
            } = request.body;

            const { disp_id } = request.params;

            const sql = `
                UPDATE disponibilidade
                   SET disp_situacao = ?
                 WHERE disp_id = ?`;
                 
            const values = [disp_situacao, disp_id];
            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Disponibilidade ${disp_id} ${disp_situacao ? 'habilitada' : 'desabilitada'} com sucesso!`,
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