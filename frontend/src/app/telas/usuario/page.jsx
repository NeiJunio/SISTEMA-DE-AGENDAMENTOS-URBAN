'use client'; // Indica que este código é para ser executado no lado do cliente (browser) em vez do servidor.

import React from "react"; // Importa o React para poder usar JSX e hooks.
import { useState } from "react"; // Importa o hook useState para gerenciar o estado do componente.
import Link from "next/link"; // Importa o Link do Next.js para navegação de páginas.
import styles from "./page.module.css"; // Importa o arquivo de estilos CSS.

import UsuarioVeiculos from "./UsuarioVeiculos/page"; // Importa o componente de "Meus Veículos".
import UsuarioDados from "./UsuarioDados/page"; // Importa o componente de "Meus Dados".
import UsuarioHistorico from "./usuarioHistórico/page"; // Importa o componente de "Histórico".
import FullCalendarGeral from "./agenda/page"; // Importa o componente de "Agenda".

import { MdPowerSettingsNew } from "react-icons/md"; // Importa o ícone de desligar (power) do react-icons.
import Cookies from "js-cookie"; // Importa a biblioteca para manipulação de cookies.

export default function Home() {

    const [tela, setTela] = useState(0); // Hook de estado para controlar qual tela/section será exibida. Inicialmente, a tela 0 é a padrão.

    // Função para limpar o localStorage e remover o cookie 'token' ao fazer logout.
    const clearLocalStorage = () => {
        localStorage.clear(); // Limpa todos os dados armazenados no localStorage.
        Cookies.remove('token', { path: '/' }); // Remove o cookie 'token', garantindo que ele será removido em toda a aplicação.
    };

    return (
        <div className={styles.grid_container}> {/* Contêiner principal da página, com grid layout. */}
            <div className={styles.header}> {/* Cabeçalho da página, onde exibe o título e o ícone de logout. */}
                <h1 className={styles.title}>Painel do Usuário</h1> {/* Título principal do painel. */}
                <Link href="/" className={styles.iconPower}> {/* Link que leva ao home page e contém o ícone de logout. */}
                    <MdPowerSettingsNew className={styles.power} onClick={clearLocalStorage} /> {/* Ícone de desligar que chama a função clearLocalStorage quando clicado. */}
                </Link>
            </div>
            <div className={styles.sidebar}> {/* Barra lateral com botões para navegação entre as telas. */}
                <button data-target="#meusdados" onClick={() => setTela(1)}>Meus Dados</button> {/* Botão que exibe a tela de "Meus Dados". */}
                <button data-target="#meusveiculos" onClick={() => setTela(2)}>Meus Veículos</button> {/* Botão que exibe a tela de "Meus Veículos". */}
                <button data-target="#historico" onClick={() => setTela(3)}>Histórico</button> {/* Botão que exibe a tela de "Histórico". */}
                <button data-target="#agenda" onClick={() => setTela(5)}>Agenda</button> {/* Botão que exibe a tela de "Agenda". */}
            </div>
            <div className={styles.main_content}> {/* Área principal de conteúdo onde as diferentes telas serão renderizadas. */}

                {
                    // Condicionalmente renderiza os componentes baseados no valor de 'tela' (estado).
                    tela === 1 ?
                        <UsuarioDados /> // Exibe o componente "UsuarioDados" quando 'tela' é 1.
                        : tela === 2 ?
                            <UsuarioVeiculos /> // Exibe o componente "UsuarioVeiculos" quando 'tela' é 2.
                            : tela === 3 ?
                                <UsuarioHistorico /> // Exibe o componente "UsuarioHistorico" quando 'tela' é 3.
                                : tela === 4 ?
                                    <UsuarioDados /> // Exibe o componente "UsuarioDados" (para tela 4, mas não é usado neste exemplo).
                                    : tela === 5 ?
                                        <FullCalendarGeral /> // Exibe o componente "FullCalendarGeral" quando 'tela' é 5.
                                        : <></> // Se nenhum dos valores de 'tela' for correspondente, exibe um fragmento vazio (sem conteúdo).
                }
            </div>
        </div>
    )
}
