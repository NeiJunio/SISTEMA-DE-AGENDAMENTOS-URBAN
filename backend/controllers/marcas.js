const db = require('../database/connection');

module.exports = {
    async listarMarcas(request, response) {
        try {
            const sql = `
            SELECT mar_id, 
                   mar_nome, 
                   mar_cod, 
                   mar_icone, 
                   cat_id
              FROM marcas`;

            const [marcas] = await db.query(sql);
            const nItens = marcas.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de marcas.',
                dados: marcas,
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

    async listarMarcaPorCategoria(request, response) {
        try {
            const { cat_id } = request.params;

            const sql = `
                SELECT mar_id, 
                       mar_nome, 
                       mar_cod, 
                       mar_icone, 
                       cat_id
                  FROM marcas
                 WHERE cat_id = ?`;

                const [marcas] = await db.query(sql, [cat_id]);
                const nItens = marcas.length;

                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Lista de marcas por categoria.',
                    dados: marcas,
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

    async cadastrarMarca(request, response) {
        try {
            const {
                mar_nome,
                mar_cod,
                mar_icone,
                cat_id
            } = request.body;

            const sql = `
                INSERT INTO marcas (mar_nome, mar_cod, mar_icone, cat_id) 
                            VALUES (?, ?, ?, ?)`;

            const values = [
                mar_nome,
                mar_cod,
                mar_icone,
                cat_id
            ];

            const [execSql] = await db.query(sql, values);
            const mar_id = execSql.insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de marca efetuado com sucesso.',
                dados: mar_id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarMarca(request, response) {
        try {
            const {
                mar_nome,
                mar_cod,
                mar_icone,
                cat_id
            } = request.body;

            const { mar_id } = request.params;

            const sql = `
                UPDATE marcas
                   SET mar_nome = ?, 
                       mar_cod = ?, 
                       mar_icone = ?, 
                       cat_id = ? 
                 WHERE mar_id = ?;`;

            const values = [
                mar_nome,
                mar_cod,
                mar_icone,
                cat_id,
                mar_id
            ];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Marca ${mar_id} atualizada com sucesso!`,
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

    async excluirMarca(request, response) {
        try {
            const { mar_id } = request.params;
            
            const sql = `
                DELETE *
                  FROM marcas
                 WHERE mar_id = ?`;
                 
            const values = [mar_id];
            const [excluir] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Marca ${mar_id} excluída com sucesso`,
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