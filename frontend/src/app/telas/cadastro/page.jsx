"use client";

import { useState } from "react";  // Importa o hook useState para gerenciar o estado no componente
import { useRouter } from "next/navigation";  // Importa o hook useRouter do Next.js para navegação de páginas
import Image from "next/image";  // Importa o componente Image do Next.js para otimização de imagens
import Link from "next/link";  // Importa o componente Link do Next.js para navegação entre páginas
import styles from "./page.module.css";  // Importa os estilos CSS do componente

import api from "@/services/api";  // Importa a instância de API personalizada

import 'react-toastify/dist/ReactToastify.css';  // Importa os estilos do Toastify para notificações
import { ToastContainer, toast } from 'react-toastify';  // Importa os componentes do Toastify para exibir notificações
import { cpf as cpfValidator } from 'cpf-cnpj-validator';  // Importa a função de validação de CPF
import InputMask from "react-input-mask";  // Importa o componente InputMask para mascarar entradas como CPF e telefone
import Swal from "sweetalert2";  // Importa a biblioteca SweetAlert2 para alertas estilizados

export default function Cadastro() {
    // Declaração de estados do componente
    const [showPassword, setShowPassword] = useState(false);  // Controle para exibir ou ocultar a senha
    const [cpfError, setCpfError] = useState('');  // Estado para armazenar o erro de validação do CPF
    const [emailError, setEmailError] = useState('');  // Estado para armazenar o erro de validação do e-mail
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);  // Estado que indica se o e-mail está sendo verificado
    const [isCheckingCpf, setIsCheckingCpf] = useState(false);  // Estado que indica se o CPF está sendo verificado
    const [senhaErro, setSenhaErro] = useState([]);  // Estado para armazenar erros relacionados à senha
    const [focused, setFocused] = useState(false);  // Estado que controla se o campo de senha está focado
    const [senha, setSenha] = useState('');  // Estado que armazena o valor da senha
    const [valida, setValida] = useState({
        nascimento: { validado: true, mensagem: [] },
    });
    const [usuario, setUsuario] = useState({  // Estado que armazena os dados do usuário
        usu_nome: '',
        usu_cpf: '',
        usu_data_nasc: '',
        usu_sexo: '',
        usu_telefone: '',
        usu_email: '',
        usu_observ: '',
        usu_acesso: 0,
        usu_senha: '',
        usu_situacao: 1,
    });

    const router = useRouter();  // Cria uma instância do hook useRouter para navegação

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);  // Alterna a visibilidade da senha (exibe ou oculta)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;  // Extrai o nome e valor do campo alterado
        setUsuario(prev => ({ ...prev, [name]: value }));  // Atualiza o estado do usuário com o novo valor

        // Validações de CPF e e-mail
        if (name === 'usu_cpf') {
            setCpfError('');  // Limpa o erro de CPF quando o campo é alterado
        }
        if (name === 'usu_email') {
            setEmailError('');  // Limpa o erro de e-mail quando o campo é alterado
        }
    };

    const validateEmail = async () => {
        const email = usuario.usu_email.trim(); // Obtém o email do usuário e remove espaços em branco no início e no fim
        let errorMessage = null; // Variável para armazenar a mensagem de erro, caso haja

        // Verifica se o email é válido utilizando a função isValidEmail
        if (!isValidEmail(email)) {
            errorMessage = 'Email inválido.'; // Define a mensagem de erro se o email for inválido
            setEmailError(errorMessage); // Exibe a mensagem de erro no estado de erro do email
            return errorMessage; // Retorna a mensagem de erro e sai da função
        }

        setIsCheckingEmail(true); // Define que a verificação de email está em andamento
        try {
            // Realiza uma requisição à API para verificar se o email já está cadastrado
            const response = await api.post('/usuarios/verificarEmail', { usu_email: email });

            // Verifica se a resposta da API indica que o email já está cadastrado
            if (response.data.sucesso && response.data.dados) {
                errorMessage = 'Email já está cadastrado.'; // Define a mensagem de erro se o email já existir
                setEmailError(errorMessage); // Exibe a mensagem de erro
            }
        } catch (error) {
            // Captura erros na requisição e exibe uma mensagem de erro genérica
            console.error('Erro na verificação do email:', error);
            errorMessage = 'Erro ao verificar o email.'; // Define a mensagem de erro se houver falha na requisição
            setEmailError(errorMessage); // Exibe a mensagem de erro
        } finally {
            setIsCheckingEmail(false); // Define que a verificação de email foi concluída
        }

        return errorMessage; // Retorna a mensagem de erro ou null caso não haja erro
    };

    const validaNascimento = () => {
        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        const dataNascimentoObj = new Date(usuario.usu_data_nasc);

        let objTemp = {
            validado: true,
            mensagem: [],
        };

        if (usuario.usu_data_nasc.trim() === '') {
            objTemp.validado = false;
            objTemp.mensagem.push('O preenchimento da data é obrigatório.');
        } else if (isNaN(dataNascimentoObj)) {
            objTemp.validado = false;
            objTemp.mensagem.push('Data de nascimento inválida.');
        } else if (dataNascimentoObj > hoje) {
            objTemp.validado = false;
            objTemp.mensagem.push('A data de nascimento não pode ser futura.');
        } else {
            const anoNascimento = dataNascimentoObj.getFullYear();
            const idade = anoAtual - anoNascimento;

            if (idade > 100) {
                objTemp.validado = false;
                objTemp.mensagem.push('A idade não pode ser superior a 100 anos.');
            }
            if (idade < 18) {
                objTemp.validado = false;
                objTemp.mensagem.push('A idade não pode ser inferior a 18 anos.');
            }
        }

        setValida(prevState => ({
            ...prevState,
            nascimento: objTemp,
        }));

        return objTemp.validado ? 1 : 0;
    };


    const validateCPF = async () => {
        const cpfNumbers = usuario.usu_cpf.trim(); // Obtém o CPF do usuário e remove espaços em branco
        let errorMessage = null; // Variável para armazenar a mensagem de erro, caso haja

        // Verifica se o CPF tem exatamente 14 caracteres
        if (cpfNumbers.length !== 14) {
            errorMessage = 'CPF deve conter 11 dígitos numéricos.'; // Define a mensagem de erro para CPF inválido
            setCpfError(errorMessage); // Exibe a mensagem de erro no estado de erro do CPF
            return errorMessage; // Retorna a mensagem de erro e sai da função
        }

        // Verifica se o CPF é válido usando a biblioteca cpfValidator
        if (!cpfValidator.isValid(cpfNumbers)) {
            errorMessage = 'CPF inválido.'; // Define a mensagem de erro se o CPF não for válido
            setCpfError(errorMessage); // Exibe a mensagem de erro
            return errorMessage; // Retorna a mensagem de erro
        }

        setIsCheckingCpf(true); // Define que a verificação de CPF está em andamento
        try {
            // Realiza uma requisição à API para verificar se o CPF já está cadastrado
            const response = await api.post('/usuarios/verificarCpf', { usu_cpf: cpfNumbers });

            // Verifica se a resposta da API indica que o CPF já está cadastrado
            if (response.data.sucesso && response.data.dados) {
                errorMessage = 'CPF já está cadastrado.'; // Define a mensagem de erro se o CPF já existir
                setCpfError(errorMessage); // Exibe a mensagem de erro
            }
        } catch (error) {
            // Captura erros na requisição e exibe uma mensagem de erro genérica
            console.error('Erro na verificação do CPF:', error);
            errorMessage = 'Ocorreu um erro ao verificar o CPF. Por favor, tente novamente.'; // Mensagem de erro genérica
            setCpfError(errorMessage); // Exibe a mensagem de erro
        } finally {
            setIsCheckingCpf(false); // Define que a verificação de CPF foi concluída
        }

        return errorMessage; // Retorna a mensagem de erro ou null caso não haja erro
    };


    const handleChangeSenha = (event) => {
        const novaSenha = event.target.value; // Obtém o valor da nova senha digitada
        setSenha(novaSenha); // Atualiza o estado da senha
        setUsuario({ ...usuario, usu_senha: novaSenha }); // Atualiza o objeto 'usuario' com a nova senha

        if (focused) { // Se o campo de senha estiver focado, valida a senha
            const erros = validarSenha(novaSenha); // Valida a senha
            setSenhaErro(erros); // Exibe os erros de validação no estado da senha
        }
    };

    const validarSenha = (senha) => {
        const minLength = 8; // Tamanho mínimo da senha
        const hasUpperCase = /[A-Z]/.test(senha); // Verifica se a senha contém letra maiúscula
        const hasLowerCase = /[a-z]/.test(senha); // Verifica se a senha contém letra minúscula
        const hasNumber = /\d/.test(senha); // Verifica se a senha contém número
        const hasSpecialChar = /[!@#$%^&*]/.test(senha); // Verifica se a senha contém caractere especial
        const hasSpaces = /\s/.test(senha); // Verifica se a senha contém espaços em branco

        let errorMessage = []; // Array para armazenar as mensagens de erro

        // Valida os requisitos da senha e adiciona as mensagens de erro correspondentes
        if (senha.length < minLength) {
            errorMessage.push(`Pelo menos ${minLength} caracteres.`); // Mensagem de erro se a senha for muito curta
        }
        if (!hasUpperCase) {
            errorMessage.push('Uma letra maiúscula.'); // Mensagem de erro se faltar letra maiúscula
        }
        if (!hasLowerCase) {
            errorMessage.push('Uma letra minúscula.'); // Mensagem de erro se faltar letra minúscula
        }
        if (!hasNumber) {
            errorMessage.push('Um número.'); // Mensagem de erro se faltar número
        }
        if (!hasSpecialChar) {
            errorMessage.push('Um caractere especial (ex: !@#$%^&*).'); // Mensagem de erro se faltar caractere especial
        }
        if (hasSpaces) {
            errorMessage.push('Sem espaços em branco.'); // Mensagem de erro se houver espaços em branco
        }

        return errorMessage.length > 0 ? errorMessage : []; // Retorna as mensagens de erro ou um array vazio se não houver erros
    };

    const handleFocus = () => {
        setFocused(true); // Define o estado "focused" como verdadeiro quando o campo ganha o foco
    };

    const handleBlur = () => {
        setFocused(false); // Define o estado "focused" como falso quando o campo perde o foco
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de envio do formulário

        const errors = []; // Cria um array para armazenar erros de validação

        const nascimentoValido = validaNascimento();
        if (nascimentoValido === 0) {
            errors.push('Corrija os erros na data de nascimento.');
        }

        // Valida CPF e adiciona erro
        const cpfValidationError = await validateCPF();
        if (cpfValidationError) {
            errors.push(cpfValidationError);
        }

        // Valida e-mail e adiciona erro,
        const emailValidationError = await validateEmail();
        if (emailValidationError) {
            errors.push(emailValidationError);
        }

        // Valida a senha e adiciona erro, se houver
        const senhaError = validarSenha(senha);
        if (senhaError.length > 0) {
            errors.push(senhaError.join(' ')); // Junta os erros de senha em uma string
        }

        // Se houver erros, exibe uma mensagem de erro
        if (errors.length > 0) {
            Swal.fire({
                title: 'Dados Incorretos',
                text: 'Verifique novamente seus dados',
                // html: errors.join('<br/>'),
                icon: 'error',
                confirmButtonText: 'OK',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
            return; // Interrompe a execução se houver erros
        }
        cadastrar(); // Se não houver erros, chama a função de cadastro
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para validar o formato de e-mail
        return emailRegex.test(email); // Retorna verdadeiro se o e-mail for válido
    };

    const clearInputs = () => {
        // Limpa todos os campos do formulário
        setUsuario({
            usu_nome: '',
            usu_cpf: '',
            usu_data_nasc: '',
            usu_sexo: '',
            usu_telefone: '',
            usu_email: '',
            usu_observ: '',
            usu_acesso: 0,
            usu_senha: '',
            usu_situacao: 1,
        });
        setCpfError(''); // Limpa o erro de CPF
        setEmailError(''); // Limpa o erro de e-mail
    };

    async function cadastrar() {
        try {
            const response = await api.post('/usuarios', usuario); // Envia a solicitação POST para criar um usuário

            if (response.data.sucesso === true) { // Verifica se o cadastro foi bem-sucedido
                const usu_id = response.data.dados; // Obtém o ID do usuário

                clearInputs(); // Limpa os campos do formulário após o cadastro
                localStorage.clear(); // Limpa o localStorage
                localStorage.setItem('user', JSON.stringify({
                    id: usu_id,
                    nome: usuario.usu_nome,
                    email: usuario.usu_email,
                    senha: usuario.usu_senha,
                    sexo: usuario.usu_sexo,
                    data_nasc: usuario.usu_data_nasc,
                    cpf: usuario.usu_cpf,
                    telefone: usuario.usu_telefone,
                })); // Armazena os dados do usuário no localStorage

                toast.success('Cadastrado com sucesso!', { // Exibe uma notificação de sucesso
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });

                setTimeout(() => {
                    router.push('/telas/login'); // Redireciona para a página de login após 1,5 segundos
                }, 1500);

            } else {
                console.error('Erro no cadastro:', response.data.mensagem, response.data.dados); // Loga o erro no console
                if (response.data.mensagem.includes('CPF já cadastrado')) {
                    // Exibe uma mensagem de erro se o CPF já estiver cadastrado
                    Swal.fire({
                        title: 'CPF Já Cadastrado',
                        text: 'O CPF informado já está cadastrado. Por favor, verifique ou utilize outro CPF.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        iconColor: '#d33',
                        confirmButtonColor: '#d33',
                    });
                } else {
                    // Exibe uma mensagem de erro genérica
                    toast.error('Erro no cadastro. Tente novamente.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            }
        } catch (error) {
            console.error('Erro no cadastro:', error.response ? error.response.data : error.message); // Loga o erro no console
            if (error.response && error.response.data && error.response.data.mensagem.includes('CPF já cadastrado')) {
                // Exibe uma mensagem de erro se o CPF já estiver cadastrado
                Swal.fire({
                    title: 'CPF Já Cadastrado',
                    text: 'O CPF informado já está cadastrado. Por favor, verifique ou utilize outro CPF.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    iconColor: '#d33',
                    confirmButtonColor: '#d33',
                });
            } else {
                // Exibe uma mensagem de erro genérica
                Swal.fire({
                    title: 'Erro no Cadastro',
                    text: 'Ocorreu um erro durante o cadastro. Por favor, tente novamente mais tarde.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    iconColor: '#d33',
                    confirmButtonColor: '#d33',
                });
            }
        }
    };

    return (
        <>
            <main className={styles.main}>
                <div className={styles.image}>
                    <Image
                        src="/mac.jpeg"
                        alt="Background Image"
                        width={4256}
                        height={2832}
                        className={styles.img}
                        priority={true}
                    />
                </div>

                <div className={styles.container}>
                    <div className={styles.boxCadastro}>
                        <div className={styles.logoImg}>
                            <Image
                                src="/logo50.png"
                                alt="logo"
                                width={393}
                                height={78}
                                className={styles.imgLogo}
                            />
                        </div>

                        <span className={styles.titleCadastro}>CADASTRO</span>

                        <form className={styles.formCadastro} onSubmit={handleSubmit}>
                            <div className={styles.doubleInputGroup}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="nome" className={styles.labelCadastro}>Nome</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="usu_nome"
                                        className={styles.inputCadastro}
                                        placeholder="Digite seu nome"
                                        value={usuario.usu_nome}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={`${styles.inputGroup} ${cpfError ? styles.errorActive : ''}`}>
                                    <label htmlFor="cpf" className={styles.labelCadastro}>CPF</label>
                                    <InputMask
                                        mask="999.999.999-99"
                                        type="text"
                                        id="cpf"
                                        name="usu_cpf"
                                        className={`${styles.inputCadastro} ${cpfError ? styles.errorActive : ''}`}
                                        placeholder="Digite seu CPF"
                                        value={usuario.usu_cpf}
                                        onChange={handleChange}
                                        required
                                    />
                                    {isCheckingCpf && <span className={styles.loading}>Verificando CPF...</span>}
                                    {cpfError && <span className={styles.error}>{cpfError}</span>}
                                </div>
                            </div>

                            <div className={styles.doubleInputGroup}>
                                <div className={`${styles.inputGroup} ${valida?.nascimento?.mensagem.length ? styles.errorActive : ''}`}>
                                    <label htmlFor="nascimento" className={styles.labelCadastro}>Data de Nascimento</label>
                                    <input
                                        type="date"
                                        id="nascimento"
                                        name="usu_data_nasc"
                                        className={`${styles.inputCadastro} ${valida?.nascimento?.mensagem.length ? styles.errorActive : ''}`}
                                        value={usuario.usu_data_nasc}
                                        onChange={handleChange}
                                        required
                                    />
                                    {valida?.nascimento?.mensagem.length > 0 && (
                                        <span className={styles.error}>{valida.nascimento.mensagem.join(' ')}</span>
                                    )}
                                </div>


                                <div className={styles.inputGroup}>
                                    <label htmlFor="sexo" className={styles.labelCadastro}>Sexo</label>
                                    <select
                                        id="sexo"
                                        name="usu_sexo"
                                        className={styles.inputCadastro}
                                        value={usuario.usu_sexo}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" hidden>Selecione</option>
                                        <option value="0">Feminino</option>
                                        <option value="1">Masculino</option>
                                        <option value="2">Outro</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.doubleInputGroup}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="telefone" className={styles.labelCadastro}>Telefone</label>
                                    <InputMask
                                        mask="(99) 99999-9999"
                                        type="tel"
                                        id="telefone"
                                        name="usu_telefone"
                                        className={styles.inputCadastro}
                                        placeholder="Digite seu telefone"
                                        value={usuario.usu_telefone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={`${styles.inputGroup} ${emailError ? styles.errorActive : ''}`}>
                                    <label htmlFor="email" className={styles.labelCadastro}>Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="usu_email"
                                        className={`${styles.inputCadastro} ${emailError ? styles.errorActive : ''}`}
                                        placeholder="Digite seu email"
                                        value={usuario.usu_email}
                                        onChange={handleChange}
                                        required
                                    />
                                    {emailError && <span className={styles.error}>{emailError}</span>}
                                </div>
                            </div>

                            <div className={styles.doubleInputGroup}>
                                <div className={`${styles.inputGroup} ${styles.teste}`}>
                                    <label htmlFor="password" className={styles.labelCadastro}>Senha</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="usu_senha"
                                        className={styles.inputCadastro}
                                        placeholder="Digite sua senha"
                                        value={usuario.usu_senha}
                                        onChange={handleChangeSenha}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        required
                                    />

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

                                <div className={styles.checkboxContainer}>
                                    <input
                                        type="checkbox"
                                        id="showPassword"
                                        checked={showPassword}
                                        onChange={togglePasswordVisibility}
                                        className={styles.checkbox}
                                    />

                                    <label htmlFor="showPassword" className={styles.checkboxLabel}>
                                        Mostrar senha
                                    </label>
                                </div>
                            </div>

                            <div className={styles.cadastroButtonContainer}>
                                <button
                                    type="submit"
                                    className={styles.cadastroButton}
                                    disabled={isCheckingCpf || isCheckingEmail}
                                >
                                    Cadastrar
                                </button>
                            </div>
                        </form>

                        <div className={styles.loginLink}>
                            Já tem uma conta? <Link href="/telas/login" className={styles.link}>Faça login</Link>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </main>
        </>
    )
}