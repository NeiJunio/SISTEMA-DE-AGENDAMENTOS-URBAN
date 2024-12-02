const db = require('../database/connection');
const moment = require('moment');

const dataInput = (data) => {
    const dataInput = moment(data, 'YYYY-MM-DD').format('YYYY-MM-DD');
    return dataInput;
}

module.exports = {
    async listarVeiculosUsuario(request, response) {
        try {
            const sql = `
                SELECT veic_usu_id, 
                    veic_id, 
                    usu_id, 
                    ehproprietario, 
                    data_inicial, 
                    data_final
                FROM veiculo_usuario`;

            const [veiculosUsuarios] = await db.query(sql);
            const nItens = veiculosUsuarios.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de veículos e usuários.',
                dados: veiculosUsuarios,
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

    async listarVeiculoUsuarioPorId(request, response) {
        try {
            const { VeiculoId } = request.params;

            const sql = `
                 SELECT vu.veic_usu_id, 
                        vu.veic_id, 
                        vu.usu_id, 
                        vu.ehproprietario = 1 AS ehproprietario, 
                        vu.data_inicial,
                        vu.data_final, 
                        u.usu_nome,
                        u.usu_cpf   
                   FROM veiculo_usuario vu
                   JOIN usuarios u ON vu.usu_id = u.usu_id
                  WHERE vu.veic_id = ?
                  ORDER BY vu.data_final IS NOT NULL, 
                           vu.data_final DESC, 
                           vu.data_inicial ASC;
            `;

            const [veiculosUsuariosPorId] = await db.query(sql, [VeiculoId]);
            const nItens = veiculosUsuariosPorId.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de Veiculos com seus respectivos usuários.',
                dados: veiculosUsuariosPorId,
                nItens
            });
        }
        catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async listarVeicUsuarioPorId(request, response) {
        try {
            const { UsuarioId } = request.params;

            const sql = `
                 SELECT vu.veic_usu_id, 
                        vu.veic_id, 
                        vu.usu_id, 
                        vu.ehproprietario = 1 AS ehproprietario, 
                        vu.data_inicial,
                        vu.data_final,
                        v.veic_placa,
                        v.veic_ano,
                        v.veic_cor,
                        v.veic_combustivel,
                        v.veic_observ,
                        v.veic_situacao,
                        m.mod_id AS mod_id,
                        m.mod_nome AS mod_nome,
                        ma.mar_nome AS mar_nome,
                        c.cat_id AS cat_id,
                        c.cat_nome AS cat_nome
                   FROM veiculo_usuario vu
                   JOIN veiculos v     ON vu.veic_id = v.veic_id
                   JOIN modelos m      ON v.mod_id = m.mod_id
                   JOIN marcas ma      ON m.mar_id = ma.mar_id
              LEFT JOIN categorias c   ON ma.cat_id = c.cat_id
              WHERE vu.usu_id = ? AND vu.data_final IS NULL AND v.veic_situacao = 1`;
            //   WHERE vu.usu_id = ? AND vu.data_final IS NULL`;
              //   WHERE vu.usu_id = ? AND vu.data_final IS NULL `;

            const [veiculosPorUsuarioId] = await db.query(sql, [UsuarioId]);
            const nItens = veiculosPorUsuarioId.length;

            const veiculosFormatados = veiculosPorUsuarioId.map(veiculo => ({
                ...veiculo,
                data_inicial: dataInput(veiculo.data_inicial),
                data_final: veiculo.data_final ? dataInput(veiculo.data_final) : null
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de Veículos do Usuário.',
                dados: veiculosFormatados,
                nItens
            });
        }
        catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async cadastrarVeiculoUsuario(request, response) {
        try {
            const { veic_id, usu_id, ehproprietario, data_inicial } = request.body;

            if (!veic_id || !usu_id || !data_inicial) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Veículo ID, Usuário ID e Data Inicial são obrigatórios.'
                });
            }

            const sqlVerificar = `
                SELECT veic_usu_id
                  FROM veiculo_usuario
                 WHERE veic_id = ? AND usu_id = ?`;

            const [resultado] = await db.query(sqlVerificar, [veic_id, usu_id]);

            if (resultado.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Este veículo já está associado a este usuário.'
                });
            }

            const sql = `
                INSERT INTO veiculo_usuario (veic_id, usu_id, ehproprietario, data_inicial) 
                                     VALUES (?, ?, ?, ?)`;

            const values = [veic_id, usu_id, ehproprietario, data_inicial];
            const [execSql] = await db.query(sql, values);
            const veic_usu_id = execSql.insertId;

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de veículo e usuário efetuado com sucesso.',
                dados: veic_usu_id
            });
        } catch (error) {
            console.error("Erro ao cadastrar veículo e usuário:", error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarVeiculoUsuario(request, response) {
        const { veic_usu_id } = request.params;
        const { data_inicial,
            data_final, ehproprietario } = request.body;

        try {
            const sql = `
                UPDATE veiculo_usuario
                   SET data_inicial = ?, 
                       data_final = ?,
                       ehproprietario = ?
                 WHERE veic_usu_id = ?`;

            const values = [
                data_inicial,
                data_final,
                ehproprietario,
                veic_usu_id
            ];

            const [result] = await db.query(sql, values);

            if (result.affectedRows > 0) {
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Dados atualizados com sucesso.'
                });
            } else {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Dados não encontrado.'
                });
            }
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na atualização do veículo-usuário.',
                dados: error.message
            });
        }
    },

    async atualizarDataFinalVeiculoUsuario(request, response) {
        const { veic_usu_id } = request.params;
        const { data_final } = request.body;

        try {
            const sql = `
                UPDATE veiculo_usuario
                   SET data_final = ?
                 WHERE veic_usu_id = ?`;

            const values = [
                data_final,
                veic_usu_id
            ];

            const [result] = await db.query(sql, values);

            if (result.affectedRows > 0) {
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Data final atualizada com sucesso.'
                });
            } else {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Veículo-usuário não encontrado.'
                });
            }
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na atualização da data final.',
                dados: error.message
            });
        }
    },

    async excluirVeiculoUsuario(request, response) {
        try {
            const { veic_usu_id } = request.params;

            const sql = `
                DELETE *
                  FROM veiculo_usuario
                 WHERE veic_usu_id = ?`;

            const values = [veic_usu_id];

            const [excluir] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Relação veículo-usuário ${veic_usu_id} excluída com sucesso`,
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