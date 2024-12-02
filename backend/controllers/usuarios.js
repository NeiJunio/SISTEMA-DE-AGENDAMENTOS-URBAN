const db = require('../database/connection');
const moment = require('moment');

const dataInput = (data) => {
    const dataInput = moment(data, 'YYYY-MM-DD').format('YYYY-MM-DD');
    return dataInput;
}

module.exports = {
    async listarUsuarios(request, response) {
        try {
            const sql = `
            SELECT usu_id, 
                   usu_nome, 
                   usu_cpf, 
                   usu_data_nasc, 
                   usu_sexo, 
                   usu_telefone, 
                   usu_email, 
                   usu_observ, 
                   usu_acesso,
                   usu_senha,
                   usu_situacao = 1 AS usu_situacao
              FROM usuarios`;

            const [usuarios] = await db.query(sql);
            const nItens = usuarios.length;

            const usuariosFormatados = usuarios.map(usuario => ({
                ...usuario,
                usu_data_nasc: dataInput(usuario.usu_data_nasc)
            }));

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuários.',
                dados: usuariosFormatados,
                nItens
            });
        } catch (error) {
            console.error('Erro em listarUsuarios:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async listarDadosUsuario(request, response) {
        try {
            const { usu_id } = request.params;

            const sql = `
                SELECT usu_id, 
                       usu_nome, 
                       usu_cpf, 
                       usu_data_nasc, 
                       usu_sexo, 
                       usu_telefone, 
                       usu_email, 
                       usu_acesso, 
                       usu_observ, 
                       usu_senha,
                       usu_situacao = 1 AS usu_situacao
                  FROM usuarios
                 WHERE usu_id = ?
            `;

            const [usuarios] = await db.query(sql, [usu_id]);

            if (usuarios.length > 0) {
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Dados do usuário.',
                    dados: usuarios[0]
                });
            } else {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado.',
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

    async listarUsuarioPorCpf(request, response) {
        try {
            const { usu_cpf } = request.body;

            if (!usu_cpf) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CPF do usuário é obrigatório.',
                });
            }

            const sql = `
                SELECT usu_id,
                       usu_nome,
                       usu_cpf,
                       usu_email
                  FROM usuarios 
                 WHERE usu_cpf LIKE ?
            `;

            const values = [`%${usu_cpf}%`];

            const [usuarios] = await db.query(sql, values);
            const nItens = usuarios.length;

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de usuários.',
                dados: usuarios,
                // dados: usuarios[0],
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

    async verificarCpf(request, response) {
        try {
            const { usu_cpf } = request.body;

            if (!usu_cpf) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CPF é obrigatório.',
                    dados: null
                });
            }

            const sql = `
                SELECT usu_id 
                  FROM usuarios 
                 WHERE usu_cpf = ?`;

            const [result] = await db.query(sql, [usu_cpf]);

            if (result.length > 0) {
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'CPF já cadastrado.',
                    exists: true,
                    existsUserId: result[0].usu_id
                });
            } else {
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'CPF válido.',
                    exists: false
                });
            }

        } catch (error) {
            console.error('Erro em verificarCpf:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na verificação do CPF.',
                dados: error.message
            });
        }
    },

    async verificarEmail(request, response) {
        try {
            const { usu_email, usu_id } = request.body;

            if (!usu_email) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Email é obrigatório.',
                    dados: null
                });
            }

            const sql = `
                SELECT usu_id
                  FROM usuarios
                 WHERE usu_email = ?`;

            const [result] = await db.query(sql, [usu_email]);

            if (result.length > 0 && result[0].usu_id !== usu_id) {
                return response.status(200).json({
                    sucesso: true,
                    mensagem: 'Email já cadastrado por outro usuário.',
                    dados: result[0]
                });
            } else {
                return response.status(200).json({
                    sucesso: false,
                    mensagem: 'Email disponível ou pertence ao usuário atual.',
                    dados: null
                });
            }
        } catch (error) {
            console.error('Erro em verificarEmail: ', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na verificação do email.',
                dados: error.message
            });
        }
    },

    async cadastrarUsuarios(request, response) {
        try {
            const {
                usu_nome,
                usu_cpf,
                usu_data_nasc,
                usu_sexo,
                usu_telefone,
                usu_email,
                usu_observ,
                usu_acesso,
                usu_senha,
                usu_situacao
            } = request.body;

            if (!usu_cpf) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CPF é obrigatório.',
                    dados: null
                });
            }

            if (!usu_email) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Email é obrigatório.',
                    dados: null
                });
            }

            const sqlVerificaCpf = `
                SELECT usu_id
                  FROM usuarios
                 WHERE usu_cpf = ?`;
 
            const [cpfExistente] = await db.query(sqlVerificaCpf, [usu_cpf]);

            if (cpfExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CPF já cadastrado. Não é possível cadastrar novamente.',
                });
            }

            const sqlVerificaEmail = `
                SELECT usu_id
                  FROM usuarios
                 WHERE usu_email = ?`;

            const [emailExistente] = await db.query(sqlVerificaEmail, [usu_email]);

            if (emailExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Email já cadastrado. Não é possível cadastrar novamente.',
                });
            }

            const sql = `
                INSERT INTO usuarios (usu_nome, usu_cpf, usu_data_nasc, usu_sexo, usu_telefone, usu_email, usu_observ, usu_acesso, usu_senha, usu_situacao) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                usu_nome,
                usu_cpf,
                dataInput(usu_data_nasc),
                usu_sexo,
                usu_telefone,
                usu_email,
                usu_observ,
                usu_acesso,
                usu_senha,
                usu_situacao
            ];

            const [execSql] = await db.query(sql, values);
            const usu_id = execSql.insertId;

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Cadastro de usuário efetuado com sucesso.',
                dados: { usu_id }
            });
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async editarUsuarios(request, response) {
        try {
            const {
                usu_nome,
                usu_cpf,
                usu_data_nasc,
                usu_sexo,
                usu_telefone,
                usu_email,
                usu_observ,
                usu_acesso,
                usu_senha,
                usu_situacao
            } = request.body;

            const { usu_id } = request.params;

            if (!usu_nome || !usu_cpf || !usu_data_nasc || usu_sexo === undefined || !usu_telefone || !usu_email || !usu_senha) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Campos obrigatórios não preenchidos.',
                });
            }

            const sqlVerificaCpf = `
                SELECT usu_id
                  FROM usuarios
                 WHERE usu_cpf = ? AND usu_id != ?`;

            const [cpfExistente] = await db.query(sqlVerificaCpf, [usu_cpf, usu_id]);

            if (cpfExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'CPF já cadastrado por outro usuário.',
                });
            }

            const sqlVerificaEmail = `SELECT usu_id FROM usuarios WHERE usu_email = ? AND usu_id != ?`;
            const [emailExistente] = await db.query(sqlVerificaEmail, [usu_email, usu_id]);

            if (emailExistente.length > 0) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Email já cadastrado por outro usuário.',
                });
            }

            const sql = `
                UPDATE usuarios 
                   SET usu_nome = ?, 
                       usu_cpf = ?, 
                       usu_data_nasc = ?, 
                       usu_sexo = ?, 
                       usu_telefone = ?, 
                       usu_email = ?, 
                       usu_observ = ?, 
                       usu_acesso = ?,
                       usu_senha = ?,
                       usu_situacao = ?                
                 WHERE usu_id = ?;`;

            const values = [
                usu_nome,
                usu_cpf,
                dataInput(usu_data_nasc),
                usu_sexo,
                usu_telefone,
                usu_email,
                usu_observ || null,
                usu_acesso,
                usu_senha,
                usu_situacao,
                usu_id
            ];

            const [atualizaDados] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${usu_id} atualizado com sucesso!`,
                dados: atualizaDados.affectedRows
            });
        } catch (error) {
            console.error('Erro em editarUsuarios:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async excluirUsuarios(request, response) {
        try {
            const { usu_id } = request.params;
            const sql = `
                DELETE * 
                  FROM usuarios
                 WHERE usu_id = ?`;
            
            const values = [usu_id];
            const [excluir] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${usu_id} excluído com sucesso`,
                dados: excluir.affectedRows
            });
        } catch (error) {
            console.error('Erro em excluirUsuarios:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async ocultarUsuario(request, response) {
        try {
            const { usu_situacao } = request.body;
            const { usu_id } = request.params;

            const sql = `
                UPDATE usuarios
                   SET usu_situacao = ?
                 WHERE usu_id = ?;`;
            
            const values = [usu_situacao, usu_id];
            const [atualizacao] = await db.query(sql, values);

            return response.status(200).json({
                sucesso: true,
                mensagem: `Usuário ${usu_id} ${usu_situacao == 1 ? 'reativado' : 'desativado'} com sucesso`,
                dados: atualizacao.affectedRows
            });
        } catch (error) {
            console.error('Erro em ocultarUsuario:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    async login(request, response) {
        try {
            const { usu_email, usu_senha } = request.body;

            const sql = `
                SELECT usu_id, 
                       usu_nome,
                       usu_acesso,
                       usu_situacao
                  FROM usuarios 
                 WHERE usu_email = ? AND usu_senha = ?`;
                 
            const values = [usu_email, usu_senha];

            const [usuarios] = await db.query(sql, values);

            if (!usuarios || usuarios.length < 1) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Login e/ou senha inválido.',
                    tipoErro: 'credenciais',
                    dados: null,
                });
            }

            const usuario = usuarios[0];

            if (usuario.usu_situacao === 0) {
                return response.status(403).json({
                    sucesso: false,
                    mensagem: 'Acesso não permitido. Usuário inativo.',
                    tipoErro: 'inativo',
                    dados: null,
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Login efetuado com sucesso',
                dados: usuario
            });
        } catch (error) {
            console.error('Erro em login:', error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                tipoErro: 'conexao',
                dados: error.message
            });
        }
    }

};