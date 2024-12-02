const db = require('../database/connection');

module.exports = {

    async listarCategorias(request, response) {
        try {
            const sql = `
            SELECT cat_id, 
                   cat_nome, 
                   cat_icone
            FROM categorias`;

            const [categorias] = await db.query(sql);
            const nItens = categorias.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de categorias.',
                dados: categorias,
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

    async cadastrarCategoria(request, response) {
        try {
            const {
                cat_nome,
                cat_icone
            } = request.body;

            const sql = `
                INSERT INTO categorias (cat_nome, cat_icone) 
                                VALUES (?, ?)`;

            const values = [
                cat_nome,
                cat_icone
            ];

            const [execSql] = await db.query(sql, values);
            const cat_id = execSql.insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de categoria efetuado com sucesso.',
                dados: cat_id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarCategoria(request, response) {
        try {
            const {
                cat_nome,
                cat_icone
            } = request.body;

            const { cat_id } = request.params;

            const sql = `
                UPDATE categorias
                   SET cat_nome = ?, 
                       cat_icone = ? 
                 WHERE cat_id = ?;`;

            const values = [
                cat_nome,
                cat_icone,
                cat_id
            ];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Categoria ${cat_id} atualizada com sucesso!`,
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

    async excluirCategoria(request, response) {
        try {
            const { cat_id } = request.params;
            
            const sql = `
                DELETE *
                  FROM categorias
                 WHERE cat_id = ?`;
                 
            const values = [cat_id];
            const [excluir] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Categoria ${cat_id} excluída com sucesso`,
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