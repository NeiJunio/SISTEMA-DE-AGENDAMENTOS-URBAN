const db = require('../database/connection');

const moment = require('moment');

const dataInput = (data) => {
    const dataInput = moment(data, 'YYYY-MM-DD').format('YYYY-MM-DD');
    return dataInput;
}

module.exports = {
    async listarAgendamentos(request, response) {
        try {
            const { UsuarioId } = request.params;

            const sqlTodos = `
               SELECT a.agend_id,
                       a.veic_usu_id,
                       DATE_FORMAT(a.agend_data, '%Y-%m-%d') AS agend_data_formatada,
                       a.agend_horario,
                       a.agend_serv_situ_id,
                       a.agend_observ,
                       u.usu_id,
                       u.usu_nome,
                       v.veic_placa,
                       v.veic_ano,
                       v.veic_cor,
                       s.serv_nome, 
                       s.serv_duracao
                  FROM agendamentos a
                  JOIN veiculo_usuario vu ON a.veic_usu_id = vu.veic_usu_id
                  JOIN usuarios u         ON vu.usu_id = u.usu_id
                  JOIN veiculos v         ON vu.veic_id = v.veic_id
                  JOIN servicos s         ON a.serv_id = s.serv_id
            `;

            const [todosAgendamentos] = await db.query(sqlTodos);
            const nItensTodos = todosAgendamentos.length;

            const colorMap = {
                1: '#e69500f3',  // Pendente - Dourado
                2: '#1b77d4',    // Em andamento - Azul
                3: '#26a426',    // Concluído - Verde
                4: '#c3290e'     // Cancelado - Vermelho
            };

            const Resultado = todosAgendamentos.map((e) => {
                const [hora, minuto, segundo] = e.agend_horario.split(':').map(Number);
                const agendData = new Date(`${e.agend_data_formatada}T${e.agend_horario}`);

                const [duracaoHora, duracaoMinuto, duracaoSegundo] = e.serv_duracao.split(':').map(Number);

                agendData.setHours(agendData.getHours() + duracaoHora);
                agendData.setMinutes(agendData.getMinutes() + duracaoMinuto);
                agendData.setSeconds(agendData.getSeconds() + duracaoSegundo);

                const end = agendData.toISOString();

                return {
                    agend_id: e.agend_id,
                    usu_id: e.usu_id,
                    veic_usu_id: e.veic_usu_id,
                    veic_placa: e.veic_placa,
                    veic_ano: e.veic_ano,
                    veic_cor: e.veic_cor,
                    agend_data: e.agend_data_formatada,
                    agend_horario: e.agend_horario,
                    agend_serv_situ_id: e.agend_serv_situ_id,
                    agend_observ: e.agend_observ,
                    serv_nome: e.serv_nome,
                    serv_duracao: e.serv_duracao,
                    title: `Agendado`,
                    start: `${e.agend_data_formatada}T${e.agend_horario}`,
                    end: end,
                    overlap: false,
                    backgroundColor: colorMap[e.agend_serv_situ_id] || '#33338',
                };
            });

            return response.status(200).json({
                sucesso: true,
                mensagem: `Lista de agendamentos do usuário ID ${UsuarioId} e todos os agendamentos.`,
                dados: todosAgendamentos,
                nItensTodos,
                dadosTodos: Resultado

            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async listarAgendamentosDoUsuario(request, response) {
        try {
            const { UsuarioId, UserAcesso, Month, Year } = request.params;

            const sqlUsuario = `
                SELECT a.agend_id,
                       a.veic_usu_id,
                       DATE_FORMAT(a.agend_data, '%Y-%m-%d') AS agend_data_formatada,
                       a.agend_horario,
                       a.agend_serv_situ_id,
                       a.agend_observ,
                       u.usu_id,
                       u.usu_nome,
                       v.veic_placa,
                       v.veic_ano,
                       v.veic_cor,
                       s.serv_nome, 
                       s.serv_duracao,
                       cs.cat_serv_id,
                       cs.cat_serv_nome
                  FROM agendamentos a
                  JOIN veiculo_usuario vu     ON a.veic_usu_id = vu.veic_usu_id
                  JOIN usuarios u             ON vu.usu_id = u.usu_id
                  JOIN veiculos v             ON vu.veic_id = v.veic_id
                  JOIN servicos s             ON a.serv_id = s.serv_id
                  JOIN categorias_servicos cs ON s.cat_serv_id = cs.cat_serv_id
                 WHERE YEAR(a.agend_data)  = ?
                   AND MONTH(a.agend_data) = ?
                   AND a.agend_situacao = 1
                   AND a.agend_serv_situ_id <> 4
                   `;
                   
            const values = [Year, Month];
            const [agendamentosUsuario] = await db.query(sqlUsuario, values);

            const nItensUsuario = agendamentosUsuario.length;

            const colorMap = {
                1: '#e69500f3',
                2: '#1b77d4',
                3: '#26a426',
                4: '#c3290e'
            };

            const Resultado = agendamentosUsuario.map((e) => {
                const [hora, minuto, segundo] = e.agend_horario.split(':').map(Number);
                const agendData = new Date(`${e.agend_data_formatada}T${e.agend_horario}`);
                const [duracaoHora, duracaoMinuto, duracaoSegundo] = e.serv_duracao.split(':').map(Number);

                agendData.setHours(agendData.getHours() + duracaoHora);
                agendData.setMinutes(agendData.getMinutes() + duracaoMinuto);
                agendData.setSeconds(agendData.getSeconds() + duracaoSegundo);

                const end = agendData.toISOString();

                const detalhesExtras = (UserAcesso == 1 || e.usu_id === parseInt(UsuarioId)) ? {
                    veic_placa: e.veic_placa,
                    veic_usu_id: e.veic_usu_id,
                    veic_ano: e.veic_ano,
                    veic_cor: e.veic_cor,
                    agend_observ: e.agend_observ,
                    serv_nome: e.serv_nome,
                    serv_duracao: e.serv_duracao,
                    cat_serv_nome: e.cat_serv_nome,
                    cat_serv_id: e.cat_serv_id
                } : {};

                return {
                    agend_id: e.agend_id,
                    start: `${e.agend_data_formatada}T${e.agend_horario}`,
                    end: end,
                    title: `Agendado`,
                    backgroundColor: colorMap[e.agend_serv_situ_id] || '#33338',
                    agend_data: e.agend_data_formatada,
                    agend_horario: e.agend_horario,
                    agend_serv_situ_id: e.agend_serv_situ_id,
                    extendedProps: {
                        userId: e.usu_id
                    },
                    ...detalhesExtras
                };
            });

            return response.status(200).json({
                sucesso: true,
                mensagem: `Lista de todos os agendamentos`,
                dadosTodos: Resultado,
                nItensUsuario,
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async listarTodosAgendamentos(request, response) {
        try {
            const sql = `
                SELECT a.agend_id,
                       a.veic_usu_id,
                       DATE_FORMAT(a.agend_data, '%Y-%m-%d') AS agend_data,
                       a.agend_horario,
                       a.agend_serv_situ_id,
                       a.agend_observ,
                       u.usu_id,
                       u.usu_nome,
                       v.veic_placa,
                       v.veic_ano,
                       v.veic_cor,
                       s.serv_id,
                       s.serv_nome,
                       cs.cat_serv_id,
                       cs.cat_serv_nome,
                       m.mod_nome AS mod_nome,
                       ma.mar_nome AS mar_nome
                  FROM agendamentos a
                  JOIN veiculo_usuario vu     ON a.veic_usu_id = vu.veic_usu_id
                  JOIN usuarios u             ON vu.usu_id = u.usu_id
                  JOIN veiculos v             ON vu.veic_id = v.veic_id
                  JOIN modelos m              ON v.mod_id = m.mod_id        
                  JOIN marcas ma              ON m.mar_id = ma.mar_id       
                  JOIN servicos s             ON a.serv_id = s.serv_id
                  JOIN categorias_servicos cs ON s.cat_serv_id = cs.cat_serv_id
            `;

            const [agendamentos] = await db.query(sql);
            const nItens = agendamentos.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: `Lista de agendamentos`,
                dados: agendamentos,
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

    async listarAgendamentosPorSituacao(request, response) {
        try {
            const { agend_situacao } = request.params;

            const sql = `
                SELECT agend_id,
                       veic_usu_id,
                       agend_data,
                       agend_horario,
                       agend_situacao,
                       agend_observ
                  FROM agendamentos
                 WHERE agend_situacao = ?
            `;

            const values = [agend_situacao];
            const [agendamentos] = await db.query(sql, values);
            const nItens = agendamentos.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: `Lista de agendamentos com a situação: ${agend_situacao}`,
                dados: agendamentos,
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

    async listarHistoricoDoUsuario(request, response) {
        try {
            const { UsuarioId } = request.params;

            const sql = `
                SELECT a.agend_id,
                       a.veic_usu_id,
                       DATE_FORMAT(a.agend_data, '%Y-%m-%d') AS agend_data,
                       a.agend_horario,
                       a.agend_serv_situ_id,
                       a.agend_observ,
                       u.usu_id,
                       u.usu_nome,
                       v.veic_placa,
                       v.veic_ano,
                       v.veic_cor,
                       s.serv_id,
                       s.serv_nome,
                       cs.cat_serv_id,
                       cs.cat_serv_nome,
                       m.mod_nome AS mod_nome,
                       ma.mar_nome AS mar_nome
                  FROM agendamentos a
                  JOIN veiculo_usuario vu     ON a.veic_usu_id = vu.veic_usu_id
                  JOIN usuarios u             ON vu.usu_id = u.usu_id
                  JOIN veiculos v             ON vu.veic_id = v.veic_id
                  JOIN modelos m              ON v.mod_id = m.mod_id        
                  JOIN marcas ma              ON m.mar_id = ma.mar_id       
                  JOIN servicos s             ON a.serv_id = s.serv_id
                  JOIN categorias_servicos cs ON s.cat_serv_id = cs.cat_serv_id
                 WHERE u.usu_id = ?
            `;

            const values = [UsuarioId];
            const [agendamentosPorUsuario] = await db.query(sql, values);

            if (agendamentosPorUsuario.length > 0) {
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Agendamentos do usuário.',
                    dados: agendamentosPorUsuario
                });
            } else {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Nenhum agendamento encontrado para o usuário.',
                    dados: null
                });
            }
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    // async cadastrarAgendamento(request, response) {
    //     try {
    //         const {
    //             veic_usu_id,
    //             agend_data,
    //             agend_horario,
    //             agend_situacao,
    //             agend_observ,
    //             serv_id,
    //             agend_serv_situ_id
    //         } = request.body;

    //         const sqlVerificacao = `SELECT 1
    //                                 FROM agendamentos
    //                                 WHERE CAST(? AS TIME) < (SELECT ADDTIME(age.agend_horario, ser.serv_duracao)
    //                                                                     FROM agendamentos age
    //                                                             INNER JOIN servicos     ser ON ser.serv_id = age.serv_id
    //                                                                     WHERE age.agend_data = ?
    //                                                                     AND age.agend_horario <= CAST(? AS TIME)
    //                                                                     AND age.agend_serv_situ_id <> 4 /*CANCELADO*/
    //                                                                 ORDER BY age.agend_horario DESC 
    //                                                                     LIMIT 1
    //                                                                 )
    //                                     OR  ( SELECT ADDTIME(CAST(? AS TIME), serv_duracao)
    //                                             FROM servicos
    //                                         WHERE serv_id = ?
    //                                         ) > ( SELECT agend_horario 
    //                                                 FROM agendamentos 
    //                                             WHERE agend_data = ?
    //                                                 AND agend_horario >= CAST(? AS TIME)
    //                                                 AND agend_serv_situ_id <> 4 /*CANCELADO*/
    //                                             ORDER BY agend_horario ASC
    //                                             LIMIT 1 
    //                                             )
    //                                     OR CAST(? AS TIME) < CAST("07:59:59" AS TIME)
    //                                     OR CAST("18:00:00" AS TIME) < ( SELECT ADDTIME(CAST(? AS TIME), serv_duracao)
    //                                                                     FROM servicos
    //                                                                     WHERE serv_id = ?
    //                                                                 )
    //                                     AND agendamentos.agend_serv_situ_id <> 4 /*CANCELADO*/
    //                                 LIMIT 1;
    //         `
    //         const valuesVerificacao = [
    //             agend_horario,
    //             agend_data,
    //             agend_horario,
    //             agend_horario,
    //             serv_id,
    //             agend_data,
    //             agend_horario,
    //             agend_horario,
    //             agend_horario,
    //             serv_id
    //         ]

    //         const [verificacao] = await db.query(sqlVerificacao, valuesVerificacao);

    //         if (verificacao.length > 0) {
    //             return response.status(400).json({
    //                 sucesso: false,
    //                 mensagem: 'Horário indisponível',
    //                 dados: verificacao
    //             });
    //         } else {

    //             const sql = `
    //             INSERT INTO agendamentos (veic_usu_id, agend_data, agend_horario, agend_situacao, agend_observ, serv_id, agend_serv_situ_id) 
    //             VALUES (?, ?, ?, ?, ?, ?, ?)`;

    //             const values = [
    //                 veic_usu_id,
    //                 agend_data,
    //                 agend_horario,
    //                 agend_situacao,
    //                 agend_observ,
    //                 serv_id,
    //                 agend_serv_situ_id
    //             ];

    //             const [execSql] = await db.query(sql, values);
    //             const agend_id = execSql.insertId;

    //             return response.status(200).json({
    //                 sucesso: true,
    //                 mensagem: 'Cadastro de agendamento efetuado com sucesso.',
    //                 dados: agend_id
    //             });
    //         }

    //     } catch (error) {
    //         return response.status(500).json({
    //             sucesso: false,
    //             mensagem: 'Erro na requisição.',
    //             dados: error.message
    //         });
    //     }
    // },

    async cadastrarAgendamento(request, response) {
        try {
            const {
                veic_usu_id,
                agend_data,
                agend_horario,
                agend_situacao,
                agend_observ,
                serv_id,
                agend_serv_situ_id
            } = request.body;
    
            const sqlVerificacao = `SELECT 1
                                    FROM agendamentos
                                    WHERE 
                                        CAST(? AS TIME) < (
                                            SELECT ADDTIME(age.agend_horario, ser.serv_duracao)
                                            FROM agendamentos age
                                            INNER JOIN servicos ser ON ser.serv_id = age.serv_id
                                            WHERE age.agend_data = ?
                                            AND age.agend_horario <= CAST(? AS TIME)
                                            AND age.agend_serv_situ_id <> 4 /*CANCELADO*/
                                            ORDER BY age.agend_horario DESC 
                                            LIMIT 1
                                        )
                                        OR (
                                            SELECT ADDTIME(CAST(? AS TIME), serv_duracao)
                                            FROM servicos
                                            WHERE serv_id = ?
                                        ) > (
                                            SELECT agend_horario 
                                            FROM agendamentos 
                                            WHERE agend_data = ?
                                            AND agend_horario >= CAST(? AS TIME)
                                            AND agend_serv_situ_id <> 4 /*CANCELADO*/
                                            ORDER BY agend_horario ASC
                                            LIMIT 1 
                                        )
                                        OR CAST(? AS TIME) < CAST("07:59:59" AS TIME)
                                        OR CAST("18:00:00" AS TIME) < (
                                            SELECT ADDTIME(CAST(? AS TIME), serv_duracao)
                                            FROM servicos
                                            WHERE serv_id = ?
                                        )
                                        OR ? < CURRENT_DATE /* Validação para evitar agendamentos retroativos */
                                        AND agendamentos.agend_serv_situ_id <> 4 /*CANCELADO*/
                                    LIMIT 1;
            `;
    
            const valuesVerificacao = [
                agend_horario,
                agend_data,
                agend_horario,
                agend_horario,
                serv_id,
                agend_data,
                agend_horario,
                agend_horario,
                agend_horario,
                serv_id,
                agend_data
            ];
    
            const [verificacao] = await db.query(sqlVerificacao, valuesVerificacao);
    
            if (verificacao.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Horário indisponível ou data inválida.',
                    dados: verificacao
                });
            } else {
                const sql = `
                INSERT INTO agendamentos (veic_usu_id, agend_data, agend_horario, agend_situacao, agend_observ, serv_id, agend_serv_situ_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
                const values = [
                    veic_usu_id,
                    agend_data,
                    agend_horario,
                    agend_situacao,
                    agend_observ,
                    serv_id,
                    agend_serv_situ_id
                ];
    
                const [execSql] = await db.query(sql, values);
                const agend_id = execSql.insertId;
    
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Cadastro de agendamento efetuado com sucesso.',
                    dados: agend_id
                });
            }
    
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarAgendamento(request, response) {
        try {
            const { agend_id } = request.params;

            const {
                veic_usu_id,
                agend_data,
                agend_horario,
                serv_id,
                agend_serv_situ_id,
                agend_observ,
            } = request.body;

            const sql = `
                UPDATE agendamentos
                   SET veic_usu_id = ?,
                       agend_data = ?,
                       agend_horario = ?,
                       serv_id = ?,
                       agend_serv_situ_id = ?,
                       agend_observ = ?
                 WHERE agend_id = ?
            `;

            const values = [
                veic_usu_id,
                agend_data,
                agend_horario,
                serv_id,
                agend_serv_situ_id,
                agend_observ,
                agend_id
            ];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Agendamento ${agend_id} atualizado com sucesso!`,
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

    async editarSituacaoAgendamento(request, response) {
        try {
            const { agend_id } = request.params;
            const { agend_serv_situ_id } = request.body;

            const sql = `
                UPDATE agendamentos
                   SET agend_serv_situ_id = ? 
                 WHERE agend_id = ?`;

            const values = [agend_serv_situ_id, agend_id];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Situação do agendamento ${agend_id} atualizada com sucesso!`,
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

    async cancelarAgendamento(request, response) {
        try {
            const { agend_id } = request.params;
            const { agend_situacao, agend_serv_situ_id } = request.body;

            const sql = `
                UPDATE agendamentos
                   SET agend_situacao = ?, 
                       agend_serv_situ_id = ?
                 WHERE agend_id = ?`;

            const values = [agend_situacao, agend_serv_situ_id, agend_id];
            const [resultado] = await db.query(sql, values);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Agendamento ${agend_id} não encontrado.`
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: `Agendamento ${agend_id} atualizado com sucesso.`,
                dados: resultado.affectedRows
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