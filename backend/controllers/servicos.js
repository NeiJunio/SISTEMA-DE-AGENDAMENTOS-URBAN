const db = require('../database/connection');

module.exports = {

    async listarServicos(request, response) {
        try {
            const sql = `
                SELECT servicos.serv_id, 
                       servicos.cat_serv_id, 
                       categorias_servicos.cat_serv_nome AS cat_serv_nome, 
                       servicos.serv_nome, 
                       servicos.serv_duracao, 
                       servicos.serv_preco, 
                       servicos.serv_descricao, 
                       CASE 
                           WHEN servicos.serv_situacao = 1 THEN 'Ativo' 
                           ELSE 'Inativo' 
                       END AS serv_situacao
                  FROM servicos
                  JOIN categorias_servicos ON servicos.cat_serv_id = categorias_servicos.cat_serv_id`;
    
            const [servicos] = await db.query(sql);
            const nItens = servicos.length;
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de serviços.',
                dados: servicos,
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
    
    async listarServicosPorCategoria(request, response) {
        try {
            const { cat_serv_id } = request.params;
            

            const sql = `
                SELECT s.serv_id,
                       s.cat_serv_id,
                       cs.cat_serv_nome AS cat_serv_nome,
                       s.serv_nome,
                       s.serv_duracao,
                       s.serv_preco,
                       s.serv_descricao,
                       CASE 
                           WHEN s.serv_situacao = 1 THEN 'Ativo'
                           ELSE 'Inativo'
                       END AS serv_situacao
                  FROM servicos s
                  JOIN categorias_servicos cs ON s.cat_serv_id = cs.cat_serv_id
                 WHERE s.cat_serv_id = ?;`;
    
            const [servicos] = await db.query(sql, [cat_serv_id]);
    
            const nItens = servicos.length;
    
            if (nItens === 0) {
                return response.status(200).json({
                    sucesso: false,
                    mensagem: 'Nenhum serviço encontrado para essa categoria.',
                });
            }
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de serviços por categoria.',
                dados: servicos,
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
    

    async visualizarServico(request, response) {
        try {
            const { serv_id } = request.params;
            const sql = `
                SELECT s.serv_id,
                       s.cat_serv_id, 
                       cs.cat_serv_nome AS cat_serv_nome,
                       s.serv_nome,
                       s.serv_duracao,
                       s.serv_preco,
                       s.serv_descricao,
                       s.serv_situacao = 1 AS serv_situacao
                  FROM servicos s
                  JOIN categorias_servicos cs ON s.cat_serv_id = cs.cat_serv_id 
                 WHERE s.serv_id = ? 
            `;
    
            const [servico] = await db.query(sql, [serv_id]);
    
            if (servico.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Serviço não encontrado.',
                });
            }
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Serviço encontrado.',
                dados: servico[0],
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },    
    
    async cadastrarServico(request, response) {
        try {
            const {
                cat_serv_id,
                serv_nome,
                serv_duracao,
                serv_preco,
                serv_descricao,
                serv_situacao
            } = request.body;

            const sql = `
                INSERT INTO servicos (cat_serv_id, serv_nome, serv_duracao, serv_preco, serv_descricao, serv_situacao) 
                              VALUES (?, ?, ?, ?, ?, ?)`;

            const values = [
                cat_serv_id,
                serv_nome,
                serv_duracao,
                serv_preco,
                serv_descricao,
                serv_situacao
            ];

            const [execSql] = await db.query(sql, values);
            const serv_id = execSql.insertId;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de serviço efetuado com sucesso.',
                dados: serv_id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarServico(request, response) {
        try {
            const {
                cat_serv_id,
                serv_nome,
                serv_duracao,
                serv_preco,
                serv_descricao,
                serv_situacao
            } = request.body;

            const { serv_id } = request.params;

            const sql = `
                UPDATE servicos
                   SET cat_serv_id = ?, 
                       serv_nome = ?, 
                       serv_duracao = ?, 
                       serv_preco = ?, 
                       serv_descricao = ?, 
                       serv_situacao = ? 
                 WHERE serv_id = ?;`;
   
            const values = [
                cat_serv_id,
                serv_nome,
                serv_duracao,
                serv_preco,
                serv_descricao,
                serv_situacao,
                serv_id
            ];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Serviço ${serv_id} atualizado com sucesso!`,
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

    async excluirServico(request, response) {
        try {
            const { serv_id } = request.params;

            const sql = `
                DELETE *
                  FROM servicos
                 WHERE serv_id = ?`;

            const values = [serv_id];
            const [excluir] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Serviço ${serv_id} excluído com sucesso`,
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
    
    async ocultarServico(request, response) {
        try {
            const {
                serv_situacao
            } = request.body;

            const { serv_id } = request.params;

            const sql = `
                UPDATE servicos
                   SET serv_situacao = ?
                 WHERE serv_id = ?;`;
                 
            const values = [serv_situacao, serv_id];
            const [atualizacao] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Serviço ${serv_id} ${serv_situacao == 1 ? 'reativado' : 'desativado'} com sucesso`,
                dados: atualizacao.affectedRows
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
}