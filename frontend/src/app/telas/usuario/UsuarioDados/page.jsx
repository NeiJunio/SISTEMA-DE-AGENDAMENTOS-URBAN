import React, { useContext, useState, useEffect } from "react";
import styles from "./page.module.css";

import api from "@/services/api";

import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { format } from 'date-fns';
import Swal from "sweetalert2";
import InputMask from "react-input-mask";

export default function DadosDoUsuario() {
    const [meusDados, setMeusDados] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [originalCpf, setOriginalCpf] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [userId, setUserId] = useState(null);

    const sexoMap = {
        0: 'Feminino',
        1: 'Masculino',
        2: 'Outro'
    };

    useEffect(() => {
        const storedUserId = localStorage.getItem('user');
        if (storedUserId) {
            const parsedUser = JSON.parse(storedUserId);
            setUserId(parsedUser?.id || null);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            listarDadosUsuario();
        }
    }, [userId]); 

    const listarDadosUsuario = async () => {
        if (!userId) return;

        try {
            const response = await api.get(`/usuarios/dadosUsuario/${userId}`);
            setMeusDados(response.data.dados);

            setOriginalCpf(response.data.dados.usu_cpf);
            setOriginalEmail(response.data.dados.usu_email);

        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'usu_sexo' ? parseInt(value) : value;

        setMeusDados((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));
    };
    
    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        Swal.fire({
            title: "Deseja Cancelar?",
            text: "As informações não serão salvas",
            icon: "warning",
            iconColor: "orange",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "rgb(40, 167, 69)",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Confirmar",
            reverseButtons: true,
            backdrop: "rgba(0,0,0,0.7)",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Cancelado!",
                    text: "As alterações foram canceladas.",
                    icon: "success",
                    iconColor: "rgb(40, 167, 69)",
                    confirmButtonColor: "rgb(40, 167, 69)",
                }).then(() => {
                    setIsEditing(false);
                    listarDadosUsuario();
                    setShowPassword(false);
                });
            }
        });
    };

    const validarCPF = async (cpf) => {
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

        if (!cpfRegex.test(cpf)) {
            return 'CPF inválido.';
        }

        const numbersOnly = cpf.replace(/[^\d]/g, '');

        if (numbersOnly.length !== 11 || /^(\d)\1+$/.test(numbersOnly)) {
            return 'CPF inválido.';
        }

        let soma = 0;
        let resto;

        for (let i = 1; i <= 9; i++) {
            soma += parseInt(numbersOnly.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(numbersOnly.substring(9, 10))) {
            return 'CPF inválido.';
        }

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(numbersOnly.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(numbersOnly.substring(10, 11))) {
            return 'CPF inválido.';
        }
        try {
            const response = await api.post('/usuarios/verificarCpf', { usu_cpf: cpf });
            if (response.data.sucesso && response.data.dados) {
                return 'CPF indisponível';
            }
        } catch (error) {
            console.error('Erro na verificação do CPF:', error);
            return 'Ocorreu um erro ao verificar o CPF. Por favor, tente novamente.';
        }

        return null;
    };

    function checkEmail(email) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
        );
    }

    // const validaEmail = async (usuario) => {
    //     const email = usuario.usu_email.trim();

    //     if (!email) {
    //         return 'O e-mail do usuário é obrigatório.';
    //     } else if (!checkEmail(email)) {
    //         return 'Insira um e-mail válido.';
    //     }

    //     try {
    //         const response = await api.post('/usuarios/verificarEmail', { usu_email: email });
    //         if (response.data.sucesso && response.data.dados) {
    //             return 'Email já está cadastrado.';
    //         }
    //     } catch (error) {
    //         console.error('Erro na verificação do email:', error);
    //         return 'Ocorreu um erro ao verificar o email. Por favor, tente novamente.';
    //     }
    //     return null;
    // };

    const validaEmail = async (usuario) => {
        const email = usuario.usu_email.trim();
    
        if (!email) {
            return 'O e-mail do usuário é obrigatório.';
        } else if (!checkEmail(email)) {
            return 'Insira um e-mail válido.';
        }
    
        try {
            const response = await api.post('/usuarios/verificarEmail', { 
                usu_email: email, 
                usu_id: usuario.usu_id // Enviar o ID do usuário
            });
    
            if (response.data.sucesso && response.data.dados) {
                return 'Email já está cadastrado.';
            }
        } catch (error) {
            console.error('Erro na verificação do email:', error);
            return 'Ocorreu um erro ao verificar o email. Por favor, tente novamente.';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (meusDados.usu_cpf !== originalCpf) {
            const cpfError = await validarCPF(meusDados.usu_cpf);
            if (cpfError) {
                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    iconColor: "#d33",
                    text: cpfError,
                });
                return; 
            }
        }
        
        if (meusDados.usu_email !== originalEmail) {
            const emailError = await validaEmail(meusDados);
            if (emailError) {
                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    iconColor: "#d33",
                    text: emailError,
                });
                return;
            }
        }

        try {
            const response = await api.patch(`/usuarios/${meusDados.usu_id}`, meusDados);

            if (response.data.sucesso) {
                Swal.fire({
                    title: "Sucesso",
                    text: "Dados salvos com sucesso!",
                    icon: "success",
                    confirmButtonColor: "rgb(40, 167, 69)",
                    iconColor: "rgb(40, 167, 69)",
                });
                setIsEditing(false); 
            } else {
                Swal.fire({
                    title: "Erro",
                    text: "Falha ao salvar os dados.",
                    icon: "error",
                    confirmButtonColor: "rgb(40, 167, 69)",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Erro",
                text: "Ocorreu um erro ao salvar os dados.",
                icon: "error",
                confirmButtonColor: "rgb(40, 167, 69)",
            });
            console.error("Erro ao salvar dados:", error);
        }
    };

    return (
        <div id="clientes" className={styles.content_section}>
            <h2 className={styles.title_page}>Meus Dados</h2>

            {meusDados ? (
                <>
                    <form id="clienteForm" className={styles.form} onSubmit={handleSubmit}>
                        <input
                            type="hidden"
                            id="clienteId"
                            className={styles.input_cliente}
                            value={meusDados?.usu_id || ''}
                        />

                        <div className={styles.grid}>
                            <div className={`${styles.grid_item} ${styles.grid_codigo}`}>
                                <label htmlFor="codigo_cliente" className={styles.label_cliente}>Código</label>
                                <input
                                    type="number"
                                    id="codigo_cliente"
                                    name="codigo_cliente"
                                    className={styles.input_cliente}
                                    value={meusDados?.usu_id || ''}
                                    disabled
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_nome}`}>
                                <label htmlFor="usu_nome" className={styles.label_cliente}>Nome</label>
                                <input
                                    type="text"
                                    id="usu_nome"
                                    name="usu_nome"
                                    className={styles.input_cliente}
                                    placeholder="Nome Completo"
                                    value={meusDados?.usu_nome || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_cpf}`}>
                                <label htmlFor="usu_cpf" className={styles.label_cliente}>CPF</label>
                                <input
                                    type="text"
                                    id="usu_cpf"
                                    name="usu_cpf"
                                    className={styles.input_cliente}
                                    placeholder="000.000.000-00"
                                    value={meusDados?.usu_cpf || ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_data}`}>
                                <label htmlFor="usu_data_nasc" className={styles.label_cliente}>Data de nascimento</label>
                                <input
                                    type="date"
                                    id="usu_data_nasc"
                                    name="usu_data_nasc"
                                    className={styles.input_cliente}
                                    value={meusDados?.usu_data_nasc ? new Date(meusDados.usu_data_nasc).toISOString().split("T")[0] : ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_sexo}`}>
                                <label htmlFor="usu_sexo" className={styles.label_cliente}>Sexo</label>

                                {isEditing ? (
                                    <select
                                        id="usu_sexo"
                                        name="usu_sexo"
                                        value={meusDados?.usu_sexo || ''}
                                        onChange={handleChange}
                                        className={`${styles.select_cliente} ${styles.input_sexo}`}
                                        required
                                    >
                                        {/* <option value="">Selecionar</option> */}
                                        <option value="0">Feminino</option>
                                        <option value="1">Masculino</option>
                                        <option value="2">Outro</option>
                                    </select>
                                ) : (
                                    <input
                                        id="usu_sexo"
                                        name="usu_sexo"
                                        className={`${styles.input_cliente} ${styles.input_sexo}`}
                                        value={sexoMap[meusDados?.usu_sexo] || ''}
                                        onChange={handleChange}
                                        disabled
                                    />
                                )}
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_telefone}`}>
                                <label htmlFor="usu_telefone" className={styles.label_cliente}>Telefone</label>
                                <InputMask
                                    mask="(99) 99999-9999"
                                    type="tel"
                                    id="usu_telefone"
                                    name="usu_telefone"
                                    className={styles.input_cliente}
                                    placeholder="(xx) xxxxx - xxxxx"
                                    value={meusDados?.usu_telefone || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_email}`}>
                                <label htmlFor="usu_email" className={styles.label_cliente}>Email</label>
                                <input
                                    type="email"
                                    id="usu_email"
                                    name="usu_email"
                                    className={styles.input_cliente}
                                    placeholder="exemplo@exemplo.com"
                                    value={meusDados?.usu_email || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />

                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_email}`}>
                                <label htmlFor="usu_senha" className={styles.label_cliente}>Senha</label>
                                <div className={styles.input_cliente_senha}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="usu_senha"
                                        name="usu_senha"
                                        value={meusDados?.usu_senha || ''}
                                        onChange={handleChange}
                                        className={styles.input_cliente_password}
                                        disabled={!isEditing}
                                        placeholder="Digite sua senha"
                                        required
                                    />
                                    {showPassword ? (
                                        <IoMdEye onClick={togglePasswordVisibility} className={styles.mdEye} />
                                    ) : (
                                        <IoMdEyeOff onClick={togglePasswordVisibility} className={styles.mdEye} />
                                    )}
                                </div>
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_email}`}>
                                <label htmlFor="usu_acesso" className={styles.label_cliente}>Nível de Acesso</label>
                                <input
                                    type="text"
                                    id="usu_acesso"
                                    name="usu_acesso"
                                    className={styles.input_cliente}
                                    value={meusDados?.usu_acesso === 0 ? "Usuário" : "Administrador" || ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_observacoes}`}>
                                <label htmlFor="usu_observ" className={styles.label_cliente}>Observações</label>
                                <input
                                    type="text"
                                    id="usu_observ"
                                    name="usu_observ"
                                    className={styles.input_cliente}
                                    value={meusDados?.usu_observ || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className={`${styles.grid_item} ${styles.grid_situacao}`}>
                                <label htmlFor="usu_situacao" className={styles.label_cliente}>Situação</label>
                                <input
                                    id="usu_situacao"
                                    name="usu_situacao"
                                    className={`${styles.input_cliente} ${styles.input_situacao}`}
                                    value={meusDados?.usu_situacao === 1 ? "Ativo" : "Inativo" || '1'}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                        </div>

                    </form>
                    <div className={styles.footer_form}>
                        {!isEditing ? ( 
                            <button type="button" onClick={handleEdit} className={styles.button_edit}>Editar</button>
                        ) : (
                            <>
                                <button type="button" onClick={handleCancel} className={styles.button_cancel}>Cancelar</button>
                                <button type="submit" onClick={handleSubmit} className={styles.button_submit}>Salvar</button>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <p>Carregando dados do usuário...</p>
            )}
        </div>
    );
}