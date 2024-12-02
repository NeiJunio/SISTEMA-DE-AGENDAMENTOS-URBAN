const db = require('../database/connection');
const moment = require('moment');

const dataInput = (data) => {
    const dataInput = moment(data, 'YYYY-MM-DD').format('YYYY-MM-DD');
    return dataInput;
}

module.exports = {
    
    async listarVeiculos(request, response) {
        try {
            const sql = `
                SELECT v.veic_id, 
                       mo.mod_nome AS modelo,  -- Puxando o nome do modelo
                       v.veic_placa, 
                       v.veic_ano, 
                       v.veic_cor, 
                       v.veic_combustivel, 
                       v.veic_observ, 
                       vu.data_final,
                       v.veic_situacao = 1 AS veic_situacao,
                       m.mar_nome AS marca,
                       GROUP_CONCAT(DISTINCT CASE 
                                                WHEN vu.data_final IS NULL THEN u.usu_nome
                                                ELSE NULL
                                            END SEPARATOR ', ') AS proprietarios,
                       COUNT(DISTINCT CASE 
                                         WHEN vu.data_final IS NULL THEN vu.usu_id
                                         ELSE NULL
                                     END) AS num_proprietarios
                  FROM veiculos v
                  JOIN modelos mo         ON v.mod_id = mo.mod_id
                  JOIN marcas m           ON mo.mar_id = m.mar_id
                  LEFT JOIN veiculo_usuario vu ON v.veic_id = vu.veic_id
                  LEFT JOIN usuarios u         ON vu.usu_id = u.usu_id
                  GROUP BY v.veic_id, mo.mod_nome, m.mar_nome, v.veic_placa, v.veic_ano, v.veic_cor, v.veic_combustivel, v.veic_observ, v.veic_situacao;
            `;

            const [veiculos] = await db.query(sql);
            const nItens = veiculos.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de veículos.',
                dados: veiculos,
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

    async listarVeiculoPorPlaca(request, response) {
        try {
            const { veic_placa } = request.body;
    
            if (!veic_placa) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Placa do veículo é obrigatória.',
                });
            }
    
            const sql = `
                SELECT v.veic_id,
                       m.mod_nome,
                       v.veic_placa
                  FROM veiculos v
                  JOIN modelos m ON v.mod_id = m.mod_id
                 WHERE v.veic_placa LIKE ?
            `;
    
            const values = [`%${veic_placa}%`];
    
            const [veiculos] = await db.query(sql, values);
            const nItens = veiculos.length;
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de veículos.',
                dados: veiculos,
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
    
    async cadastrarVeiculo(request, response) {
        try {
            const {
                mod_id,
                veic_placa,
                veic_ano,
                veic_cor,
                veic_combustivel,
                veic_observ,
                veic_situacao
            } = request.body;
    
            const verificarSql = `
                SELECT veic_id
                  FROM veiculos
                 WHERE veic_placa = ?
                 LIMIT 1`;
            
            const verificarValues = [veic_placa.toUpperCase()];
            const [verificarResult] = await db.query(verificarSql, verificarValues);
    
            if (verificarResult.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Placa já cadastrada.',
                });
            }
    
            const sql = `
                INSERT INTO veiculos (mod_id, veic_placa, veic_ano, veic_cor, veic_combustivel, veic_observ, veic_situacao) 
                              VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
            const values = [
                mod_id,
                veic_placa.toUpperCase(),
                veic_ano,
                veic_cor,
                veic_combustivel,
                veic_observ,
                veic_situacao
            ];
    
            const [execSql] = await db.query(sql, values);
            const veic_id = execSql.insertId;
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de veículo efetuado com sucesso.',
                dados: veic_id
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },
    
    async editarVeiculo(request, response) {
        try {
            const {
                mod_id,
                veic_placa,
                veic_ano,
                veic_cor,
                veic_combustivel,
                veic_observ,
                veic_situacao
            } = request.body;

            const { veic_id } = request.params;

            const sql = `
                UPDATE veiculos
                   SET mod_id = ?, 
                       veic_placa = ?, 
                       veic_ano = ?, 
                       veic_cor = ?, 
                       veic_combustivel = ?, 
                       veic_observ = ?,
                       veic_situacao = ?
                 WHERE veic_id = ?;`;

            const values = [
                mod_id,
                veic_placa,
                veic_ano,
                veic_cor,
                veic_combustivel,
                veic_observ,
                veic_situacao,
                veic_id
            ];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Veículo ${veic_id} atualizado com sucesso!`,
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

    async usuarioEditandoVeiculo(request, response) {
        try {
            const {
                mod_id,
                veic_placa,
                veic_ano,
                veic_cor,
                veic_combustivel,
                veic_observ
            } = request.body;

            const { veic_id } = request.params;

            const sql = `
                UPDATE veiculos
                   SET mod_id = ?, 
                       veic_placa = ?, 
                       veic_ano = ?, 
                       veic_cor = ?, 
                       veic_combustivel = ?, 
                       veic_observ = ?
                 WHERE veic_id = ?;`;

            const values = [
                mod_id,
                veic_placa,
                veic_ano,
                veic_cor,
                veic_combustivel,
                veic_observ,
                veic_id
            ];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Veículo ${veic_id} atualizado com sucesso!`,
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

    async excluirVeiculo(request, response) {
        try {
            const { veic_id } = request.params;
            
            const sql = `
                DELETE *
                  FROM veiculos
                 WHERE veic_id = ?`;
            
            const values = [veic_id];
            const [excluir] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Veículo ${veic_id} excluído com sucesso`,
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

    async ocultarVeiculo(request, response) {
        try {

            const {
                veic_situacao
            } = request.body;

            const { veic_id } = request.params;

            const sql = `
                UPDATE veiculos
                   SET veic_situacao = ?
                 WHERE veic_id = ?;`;
            
            const values = [veic_situacao, veic_id];
            const [atualizacao] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Veículo ${veic_id} ${veic_situacao == 1 ? 'reativado' : 'desativado'} com sucesso`,
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

    async visualizarVeiculo(request, response) {
        try {
            const { veic_id } = request.params;
            
            const sql = `
                SELECT v.veic_id, 
                       mo.mod_id AS mod_id,
                       mo.mod_nome AS mod_nome, 
                       v.veic_placa, 
                       v.veic_ano, 
                       v.veic_cor, 
                       v.veic_combustivel, 
                       v.veic_observ, 
                       v.veic_situacao = 1 AS veic_situacao, -- Lógica para veic_situacao
                       m.mar_nome AS mar_nome,
                       c.cat_nome AS cat_nome,
                       GROUP_CONCAT(DISTINCT u.usu_nome SEPARATOR ', ') AS proprietarios,
                       COUNT(DISTINCT vu.usu_id) AS num_proprietarios
                  FROM veiculos v
                  JOIN modelos mo         ON v.mod_id = mo.mod_id
                  JOIN marcas m           ON mo.mar_id = m.mar_id
             LEFT JOIN veiculo_usuario vu ON v.veic_id = vu.veic_id
             LEFT JOIN usuarios u         ON vu.usu_id = u.usu_id
             LEFT JOIN categorias c       ON m.cat_id = c.cat_id
                 WHERE v.veic_id = ? 
              GROUP BY v.veic_id
            `;

            const [veiculo] = await db.query(sql, [veic_id]);

            if (veiculo.length === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Veículo não encontrado.',
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Veículo encontrado.',
                dados: veiculo[0],
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }, 
    
    async verificarPlaca(request, response) {
        try {
            const { veic_placa } = request.body;
    
            if (!veic_placa) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Placa não fornecida.',
                });
            }
    
            const sql = `
                SELECT veic_id
                  FROM veiculos
                 WHERE veic_placa = ?
                 LIMIT 1`;
            
            const values = [veic_placa];
    
            const [result] = await db.query(sql, values);
    
            if (result.length > 0) {
                return response.status(409).json({
                    sucesso: false,
                    mensagem: 'Placa já cadastrada.',
                });
            }
    
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Placa disponível.',
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro no servidor.',
                dados: error.message
            });
        }
    }

}