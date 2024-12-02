const db = require('../database/connection');

module.exports = {

    async listarCategorias(request, response) {
        try {
            const sql = `
                SELECT cat_serv_id, 
                       cat_serv_nome,
                       cat_serv_visibilidade
                  FROM categorias_servicos`;

            const [categorias] = await db.query(sql);
            const nItens = categorias.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de categorias de serviços.',
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

    async listarCategoriasAtivas(request, response) {
        try {
            const sql = `
                SELECT cat_serv_id, 
                       cat_serv_nome,
                       cat_serv_visibilidade
                  FROM categorias_servicos
                 WHERE cat_serv_visibilidade = 1`;

            const [categorias] = await db.query(sql);
            const nItens = categorias.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de categorias de serviços.',
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
            const { cat_serv_nome } = request.body;

            const sql = `
                INSERT INTO categorias_servicos (cat_serv_nome)
                                         VALUES (?)`;
            const values = [cat_serv_nome];

            const [execSql] = await db.query(sql, values);
            const cat_serv_id = execSql.insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de categoria de serviço efetuado com sucesso.',
                dados: cat_serv_id
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
            const { cat_serv_nome } = request.body;
            const { cat_serv_id } = request.params;

            const sql = `
                UPDATE categorias_servicos
                   SET cat_serv_nome = ? 
                 WHERE cat_serv_id = ?`;

            const values = [cat_serv_nome, cat_serv_id];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Categoria ${cat_serv_id} atualizada com sucesso!`,
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
            const { cat_serv_id } = request.params;

            const sql = `
                DELETE *
                  FROM categorias_servicos
                 WHERE cat_serv_id = ?`;

            const values = [cat_serv_id];

            const [excluir] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Categoria ${cat_serv_id} excluída com sucesso`,
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

    async alterarVisibilidadeCategoria(request, response) {
        try {
            const { cat_serv_id } = request.params;
            const { cat_serv_visibilidade } = request.body;

            const sql = `
                UPDATE categorias_servicos
                   SET cat_serv_visibilidade = ?
                 WHERE cat_serv_id = ?`;
                 
            const values = [cat_serv_visibilidade, cat_serv_id];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Categoria ${cat_serv_id} atualizada com sucesso!`,
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
};