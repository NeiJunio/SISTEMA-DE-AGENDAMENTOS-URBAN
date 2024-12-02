"use client";

import styles from "./page.module.css"; // Importa o arquivo CSS para estilização da página
import Image from "next/image"; // Importa o componente Image do Next.js para otimização de imagens
import Link from "next/link"; // Importa o componente Link do Next.js para navegação entre páginas
import { useRouter } from 'next/navigation'; // Importa o hook useRouter para manipulação de rotas
import { useState } from "react"; // Importa o hook useState para gerenciar o estado da aplicação

import api from "@/services/api"; // Importa a instância da API para realizar requisições

import Swal from "sweetalert2"; // Importa o SweetAlert2 para exibição de alertas customizados
import Cookies from "js-cookie"; // Importa a biblioteca js-cookie para manipulação de cookies

export default function LoginUsu() {
    const [email, setEmail] = useState(''); // Gerencia o estado do campo de e-mail
    const [senha, setSenha] = useState(''); // Gerencia o estado do campo de senha
    const [showPassword, setShowPassword] = useState(false); // Controla a visibilidade da senha

    const router = useRouter(); // Instancia o router para navegação programática entre páginas

    // Função para alternar a visibilidade da senha
    const alternarVisibilidadeSenha = () => {
        setShowPassword(!showPassword); // Troca o estado da visibilidade da senha
    };

     // Função de envio do formulário
     function handleSubmit(event) {
        event.preventDefault(); // Previne o comportamento padrão de envio do formulário
        logar(); // Chama a função para realizar o login
    }

    // Função assíncrona para realizar o login
    async function logar() {
        try {
            const dados = { // Cria um objeto com os dados do login
                usu_email: email,
                usu_senha: senha
            };

            const response = await api.post('/login', dados); // Envia os dados para a API e aguarda a resposta

            if (response.data.sucesso) { // Verifica se a resposta foi bem-sucedida
                const usuario = response.data.dados; // Obtém os dados do usuário retornados pela API
                const objLogado = { // Cria um objeto com as informações do usuário logado
                    "id": usuario.usu_id,
                    "nome": usuario.usu_nome,
                    "acesso": usuario.usu_acesso
                };

                localStorage.clear(); // Limpa o localStorage antes de armazenar novos dados
                localStorage.setItem('user', JSON.stringify(objLogado)); // Armazena as informações do usuário no localStorage

                Cookies.set('token', usuario.usu_id, { expires: 7, path: '/' }); // Cria um cookie com o token do usuário para manter a sessão

                // Redireciona para a página de administração ou usuário dependendo do nível de acesso
                if (usuario.usu_acesso === 1) {
                    router.push('/telas/admin'); // Redireciona para a tela de administrador
                } else {
                    router.push('/telas/usuario'); // Redireciona para a tela do usuário comum
                }
            }
        } catch (error) { // Captura erros durante o processo de login
            if (error.response) { // Se houver uma resposta de erro da API
                const status = error.response.status; // Obtém o status da resposta
                const tipoErro = error.response.data.tipoErro; // Obtém o tipo de erro

                if (status === 403 && tipoErro === 'inativo') { // Verifica se o erro é relacionado ao usuário inativo
                    Swal.fire({ // Exibe um alerta com o SweetAlert2
                        icon: 'warning',
                        title: 'Acesso não permitido!',
                        text: 'Entre em contato com um administrador',
                        confirmButtonText: 'OK',
                        iconColor: '#FFA500',
                        confirmButtonColor: '#FFA500',
                    });
                    setEmail(''); // Limpa o campo de e-mail
                    setSenha(''); // Limpa o campo de senha
                }
                else if (status === 403 && tipoErro === 'credenciais') { // Verifica se o erro é relacionado às credenciais inválidas
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Email e/ou senha inválidos.',
                        confirmButtonText: 'OK',
                        iconColor: '#d33',
                        confirmButtonColor: '#d33',
                    });
                    setEmail(''); // Limpa o campo de e-mail
                    setSenha(''); // Limpa o campo de senha
                }
                else { // Caso outro erro ocorra
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Ocorreu um erro ao tentar realizar o login.',
                        confirmButtonText: 'OK',
                        iconColor: '#d33',
                        confirmButtonColor: '#d33',
                    });
                    setEmail(''); // Limpa o campo de e-mail
                    setSenha(''); // Limpa o campo de senha
                }
            } else { // Caso não haja resposta da API
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Ocorreu um erro ao tentar realizar o login.',
                    confirmButtonText: 'OK',
                    iconColor: '#d33',
                    confirmButtonColor: '#d33',
                });
                setEmail(''); // Limpa o campo de e-mail
                setSenha(''); // Limpa o campo de senha
            }
        }
    };

    return (
        <>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.boxLogin}>
                        <div className={styles.logoImg}>
                            <Link href="/">
                                <Image
                                    src='/logo50.png'
                                    alt="logo"
                                    width={393}
                                    height={78}
                                    className={styles.imgLogo}
                                />
                            </Link>
                        </div>

                        <span className={styles.titleLogin}>LOGIN</span>

                        <form id="form" className={styles.formLogin} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email" className={styles.labelLogin}>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={styles.inputLogin}
                                    placeholder="Digite seu email"
                                    onChange={e => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password" className={styles.labelLogin}>Senha</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className={styles.inputLogin}
                                    placeholder="Digite sua senha"
                                    onChange={e => setSenha(e.target.value)}
                                    value={senha}
                                    required
                                />
                            </div>

                            <div className={styles.checkboxContainer}>
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    checked={showPassword}
                                    onChange={alternarVisibilidadeSenha}
                                    className={styles.checkbox}
                                />
                                <label htmlFor="showPassword" className={styles.checkboxLabel}>
                                    Mostrar senha
                                </label>
                            </div>

                            <div className={styles.loginButtonContainer}>
                                <button type="submit" className={styles.loginButton}>
                                    Entrar
                                </button>
                            </div>

                            <div className={styles.registerLink}>
                                Não tem uma conta? <Link href="/telas/cadastro" className={styles.link}>Cadastre-se</Link>
                            </div>
                        </form>
                    </div>
                </div>

                <div className={styles.image}>
                    <Image
                        src='/lambo2.jpeg'
                        alt="Background Image"
                        width={1700}
                        height={2560}
                        className={styles.img}
                        priority={true}
                    />
                </div>
            </main>
        </>
    );
}