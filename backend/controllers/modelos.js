const db = require('../database/connection');

module.exports = {
    async listarModelos(request, response) {
        try {
            const sql = `
                SELECT mod_id, 
                       mod_nome, 
                       mod_cod, 
                       mar_cod, 
                       mar_id
                  FROM modelos`;

            const [modelos] = await db.query(sql);
            const nItens = modelos.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de modelos.',
                dados: modelos,
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

    async listarModelosPorMarca(request, response) {
        try {
            const { mar_id } = request.params;

            const sql = `
                SELECT mod_id, 
                       mod_nome, 
                       mod_cod, 
                       mar_cod, 
                       mar_id
                  FROM modelos
                 WHERE mar_id = ?`;

            const values = [mar_id]

            const [modelos] = await db.query(sql, values);
            const nItens = modelos.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de modelos por marca.',
                dados: modelos,
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

    async listarModelosPorCategoriaEMarca(request, response) {
        try {
            const { cat_id, mar_id } = request.params;

            const values = [mar_id, cat_id];

            const sql = `
                SELECT mod_id, 
                       mod_nome, 
                       mod_cod, 
                       mar_id 
                  FROM modelos
                 WHERE mar_id = ? AND EXISTS (
                    SELECT 1 
                    FROM marcas 
                    WHERE cat_id = ? AND marcas.mar_id = modelos.mar_id
                )
            `;

            const [modelos] = await db.query(sql, values);
            const nItens = modelos.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de modelos por categoria e marca.',
                dados: modelos,
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

    async cadastrarModelo(request, response) {
        try {
            const {
                mod_nome,
                mod_cod,
                mar_cod,
                mar_id
            } = request.body;

            const sql = `
                INSERT INTO modelos (mod_nome, mod_cod, mar_cod, mar_id) 
                             VALUES (?, ?, ?, ?)`;

            const values = [
                mod_nome,
                mod_cod,
                mar_cod,
                mar_id
            ];

            const [execSql] = await db.query(sql, values);
            const mod_id = execSql.insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de modelo efetuado com sucesso.',
                dados: mod_id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarModelo(request, response) {
        try {
            const {
                mod_nome,
                mod_cod,
                mar_cod,
                mar_id
            } = request.body;

            const { mod_id } = request.params;

            const sql = `
                UPDATE modelos
                SET mod_nome = ?, 
                    mod_cod = ?, 
                    mar_cod = ?, 
                    mar_id = ? 
              WHERE mod_id = ?`;

            const values = [
                mod_nome,
                mod_cod,
                mar_cod,
                mar_id,
                mod_id
            ];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Modelo ${mod_id} atualizado com sucesso!`,
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

    async excluirModelo(request, response) {
        try {
            const { mod_id } = request.params;

            const sql = `
                DELETE *
                  FROM modelos
                 WHERE mod_id = ?`;
            
            const values = [mod_id];
            const [excluir] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Modelo ${mod_id} excluído com sucesso`,
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
};