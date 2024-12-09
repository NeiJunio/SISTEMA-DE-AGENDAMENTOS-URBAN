import React, { useState } from 'react'; // Importação do React e do hook useState para gerenciamento de estados.
import styles from './index.module.css'; // Importação das classes de estilização CSS.

import InputMask from "react-input-mask"; // Biblioteca para aplicar máscaras de entrada em campos.
import { IoMdEyeOff, IoMdEye } from "react-icons/io"; // Importação de ícones de visibilidade de senha.

export default function FormCliente({
    selectedUser, // Objeto com os dados do cliente selecionado.
    setSelectedUser, // Função para atualizar os dados do cliente selecionado.
    senhaErro, // Mensagem de erro relacionada à senha.
    setSenhaErro, // Função para atualizar os erros de senha.
    focused, // Flag para determinar se o campo de senha está em foco.
    handleFocus, // Função chamada quando o campo de senha ganha foco.
    handleBlur, // Função chamada quando o campo de senha perde foco.
    validarSenha, // Função para validar a senha inserida.
    isViewing, // Flag para indicar se o formulário está no modo de visualização.
    handleSubmit, // Função para manipular o envio do formulário.
    isEditing // Flag para indicar se o formulário está no modo de edição.
}) {

    const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha.
    const [cpfExists, setCpfExists] = useState(false); // Estado para verificar se o CPF já existe.
    const [cpfChecked, setCpfChecked] = useState(false); // Estado para verificar se o CPF foi validado.
    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento de alguma operação.
    const [errors, setErrors] = useState(''); // Estado para armazenar mensagens de erro gerais.
    const isDisabled = isViewing || isEditing; // Define se os campos do formulário devem estar desabilitados.

    // Mapeamento dos valores de sexo para exibição no formulário.
    const sexoMap = {
        0: 'Feminino', // Valor 0 corresponde ao sexo Feminino.
        1: 'Masculino', // Valor 1 corresponde ao sexo Masculino.
        2: 'Outro' // Valor 2 corresponde a Outro.
    };

    // Alterna a visibilidade da senha entre texto e oculto.
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Manipula mudanças no campo de senha.
    const handleChangeSenha = (e) => {
        const novaSenha = e.target.value; // Obtém o valor digitado no campo de senha.
        setSelectedUser({ ...selectedUser, usu_senha: novaSenha }); // Atualiza o estado do usuário com a nova senha.

        // Valida a senha se o campo estiver em foco.
        if (focused) {
            const erros = validarSenha(novaSenha); // Executa a validação da senha.
            setSenhaErro(erros); // Atualiza o estado com os erros de validação.
        }
    };

    // Manipula mudanças no campo de CPF.
    const handleCPFChange = (e) => {
        const cpf = e.target.value; // Obtém o valor digitado no campo de CPF.
        setSelectedUser({ ...selectedUser, usu_cpf: cpf }); // Atualiza o estado do usuário com o CPF digitado.
        setCpfChecked(false); // Reseta o estado indicando que o CPF ainda não foi validado.
        setCpfExists(false); // Reseta o estado indicando que o CPF não existe.
        setErrors(''); // Limpa quaisquer mensagens de erro relacionadas ao CPF.
    };

    return (
        <form id="clienteForm" className={styles.form} onSubmit={handleSubmit}>
            <input type="hidden" id="clienteId" value={selectedUser ? selectedUser.usu_id : ''} className={styles.input_cliente} />

            <div className={styles.grid}>
                <div className={`${styles.grid_item} ${styles.grid_codigo}`}>
                    <label htmlFor="codigo_cliente" className={styles.label_cliente}>Código</label>
                    <input
                        type="number"
                        id="codigo_cliente"
                        name="codigo_cliente"
                        value={selectedUser ? selectedUser.usu_id : ''}
                        className={styles.input_cliente}
                        disabled
                        required
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_nome}`}>

                    <label htmlFor="nome_cliente" className={styles.label_cliente}>Nome</label>
                    <input
                        type="text"
                        id="nome_cliente"
                        name="nome_cliente"
                        value={selectedUser ? selectedUser.usu_nome : ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, usu_nome: e.target.value })}
                        disabled={isDisabled}
                        className={styles.input_cliente}
                        placeholder="Nome Completo"
                        required
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_cpf}`}>
                    <label htmlFor="usu_cpf" className={styles.label_cliente}>CPF</label>
                    <InputMask
                        mask="999.999.999-99"
                        type="text"
                        id="usu_cpf"
                        name="usu_cpf"
                        value={selectedUser ? selectedUser.usu_cpf : ''}
                        onChange={handleCPFChange}
                        disabled={isDisabled}
                        className={styles.input_cliente}
                        required
                    />

                    {cpfChecked && !loading && (
                        <span className={cpfExists ? styles.error : styles.success}>
                            {cpfExists ? 'CPF já cadastrado' : ''}
                        </span>
                    )}
                    {errors && <span className={styles.error}>{errors}</span>}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_data}`}>
                    <label htmlFor="data_nasc_cliente" className={styles.label_cliente}>Data de Nascimento</label>
                    <input
                        type="date"
                        id="data_nasc_cliente"
                        name="data_nasc_cliente"
                        value={selectedUser ? selectedUser.usu_data_nasc : ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, usu_data_nasc: e.target.value })}
                        disabled={isDisabled}
                        className={styles.input_cliente}
                        required
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_sexo}`}>
                    <label htmlFor="usu_sexo" className={styles.label_cliente}>Sexo</label>
                    {isViewing ? (
                        <input
                            type="text"
                            id="usu_sexo"
                            name="usu_sexo"
                            value={selectedUser ? sexoMap[selectedUser.usu_sexo] || '' : ''}
                            onChange={(e) => setSelectedUser({ ...selectedUser, usu_sexo: parseInt(e.target.value) })}
                            disabled={isViewing}
                            className={styles.input_cliente}
                            required
                        />
                    ) : (
                        <select
                            id="usu_sexo"
                            name="usu_sexo"
                            value={selectedUser ? selectedUser.usu_sexo : ''}
                            onChange={(e) => setSelectedUser({ ...selectedUser, usu_sexo: parseInt(e.target.value) })}
                            disabled={isViewing}
                            className={`${styles.select_cliente} ${styles.input_sexo}`}
                            required
                        >
                            <option value="" disabled>Selecionar</option>
                            <option value="0">Feminino</option>
                            <option value="1">Masculino</option>
                            <option value="2">Outro</option>
                        </select>
                    )}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_telefone}`}>
                    <label htmlFor="usu_telefone" className={styles.label_cliente}>Telefone</label>
                    <InputMask
                        mask="(99) 99999-9999"
                        type="tel"
                        id="usu_telefone"
                        name="usu_telefone"
                        value={selectedUser ? selectedUser.usu_telefone : ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, usu_telefone: e.target.value })}
                        disabled={isViewing}
                        className={`${styles.input_cliente}`}
                        required
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_email}`}>
                    <label htmlFor="email_cliente" className={styles.label_cliente}>Email</label>
                    <input
                        type="email"
                        id="email_cliente"
                        name="email_cliente"
                        value={selectedUser ? selectedUser.usu_email : ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, usu_email: e.target.value })}
                        disabled={isViewing}
                        className={styles.input_cliente}
                        placeholder="exemplo@exemplo.com"
                        required
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_senha}`}>
                    <label htmlFor="usu_senha" className={styles.label_cliente}>Senha</label>

                    <div className={styles.input_cliente_senha}>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="usu_senha"
                            name="usu_senha"
                            value={selectedUser ? selectedUser.usu_senha : ''}
                            onChange={handleChangeSenha}
                            className={styles.input_cliente_password}
                            disabled={isViewing}
                            placeholder="Digite sua senha"
                            required
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />

                        {showPassword ? (
                            <IoMdEye onClick={togglePasswordVisibility} className={styles.mdEye} />
                        ) : (
                            <IoMdEyeOff onClick={togglePasswordVisibility} className={styles.mdEye} />
                        )}
                    </div>

                    {focused && Array.isArray(senhaErro) && senhaErro.length > 0 && (
                        <div className={styles.error_message}>
                            <ul>
                                {senhaErro.map((erro, index) => (
                                    <li key={index} className={styles.errorText}>{erro}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {!focused && senhaErro.length > 0 && (
                        <div className={styles.error_message_simples}>
                            Senha inválida.
                        </div>
                    )}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_observacoes}`}>
                    <label htmlFor="usu_observ" className={styles.label_cliente}>Observações</label>
                    <input
                        type="text"
                        id="usu_observ"
                        name="usu_observ"
                        value={selectedUser ? selectedUser.usu_observ : ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, usu_observ: e.target.value })}
                        disabled={isViewing}
                        className={styles.input_cliente}
                        required
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_acesso}`}>
                    <label htmlFor="nivel_acesso" className={styles.label_cliente}>Nível de Acesso</label>
                    {isViewing ? (
                        <input
                            type="text"
                            id="nivel_acesso"
                            name="nivel_acesso"
                            value={selectedUser ? (selectedUser.usu_acesso === 0 ? 'Usuário' : 'Administrador') : ''}
                            onChange={(e) => setSelectedUser({ ...selectedUser, usu_acesso: parseInt(e.target.value) })}
                            className={styles.input_cliente}
                            disabled={isViewing}
                            required
                        />
                    ) : (
                        <select
                            id="nivel_acesso"
                            name="nivel_acesso"
                            className={`${styles.select_cliente} ${styles.input_acesso}`}
                            value={selectedUser ? selectedUser.usu_acesso : ''}
                            onChange={(e) => setSelectedUser({ ...selectedUser, usu_acesso: parseInt(e.target.value) })}
                        >
                            <option value="0">Usuário</option>
                            <option value="1">Administrador</option>
                        </select>
                    )}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_situacao}`}>
                    <label htmlFor="usu_situacao" className={styles.label_cliente}>Situação</label>
                    {isEditing ? (
                        <select
                            id="usu_situacao"
                            name="usu_situacao"
                            className={`${styles.select_cliente} ${styles.input_situacao}`}
                            value={selectedUser ? selectedUser.usu_situacao : ''}
                            onChange={(e) => setSelectedUser({ ...selectedUser, usu_situacao: parseInt(e.target.value) })}
                        >
                            <option value="1" className={styles.option}>Ativo</option>
                            <option value="0" className={styles.option}>Inativo</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            id="usu_situacao"
                            name="usu_situacao"
                            value={selectedUser ? (selectedUser.usu_situacao === 1 ? 'Ativo' : 'Inativo') : ''}
                            onChange={(e) => setSelectedUser({ ...selectedUser, usu_situacao: parseInt(e.target.value) })}
                            disabled
                            className={styles.input_cliente}
                            required
                        />
                    )}
                </div>
            </div>
        </form>
    )
}