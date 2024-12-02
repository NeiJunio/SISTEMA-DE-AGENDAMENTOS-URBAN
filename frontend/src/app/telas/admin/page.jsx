'use client';

import React from "react";
import { useEffect, useState } from "react"; // Importa hooks do React
import Link from "next/link"; // Componente Link do Next.js para navegação
import styles from "./page.module.css"; // Importa estilos CSS específicos para esta página

// Importação de componentes para exibição condicional
import CadCliente from "./cadcliente/page";
import Veiculos from "./veiculos/page";
import Servicos from "./servicos/page";
import FullCalendarGeral from "../usuario/agenda/page";
import HistoricoAgendamentos from "./historicoagendamentos/page";

import { MdPowerSettingsNew } from "react-icons/md"; // Ícone para botão de logout
import Cookies from "js-cookie"; // Biblioteca para manipulação de cookies


export default function Home() {
    // Estados para armazenar o ID do usuário e a tela atual
    const [userId, setUserId] = useState(null); // Inicialmente, o usuário não está definido
    const [tela, setTela] = useState(0); // Tela inicial é 0, nenhum componente exibido

    // useEffect executa ao carregar o componente
    useEffect(() => {
        const storedUser = localStorage.getItem('user'); // Recupera usuário do localStorage

        if (storedUser) { // Verifica se há dados de usuário armazenados
            const parsedUser = JSON.parse(storedUser); // Converte string para objeto
            setUserId(parsedUser); // Define o ID do usuário no estado
        }
    }, []); // Dependência vazia para executar apenas uma vez

    // Função para limpar localStorage e remover cookies
    const clearLocalStorage = () => {
        localStorage.clear(); // Limpa todos os dados armazenados localmente
        Cookies.remove('token', { path: '/' }); // Remove o cookie 'token'
    };

    return (
        <div className={styles.grid_container}> {/* Container principal com layout em grid */}
            <div className={styles.header}> {/* Cabeçalho do painel administrativo */}
                <h1 className={styles.title}>Painel Administrativo</h1> {/* Título do painel */}

                {/* Link para logout que também limpa o localStorage e cookies */}
                <Link href="/" className={styles.iconPower}>
                    <MdPowerSettingsNew className={styles.power} onClick={clearLocalStorage} />
                </Link>
            </div>
            <div className={styles.sidebar}> {/* Barra lateral com botões de navegação */}
                <button data-target="#clientes" onClick={() => setTela(1)}>Clientes</button> {/* Botão para a tela de Clientes */}
                <button data-target="#veiculos" onClick={() => setTela(2)}>Veículos</button> {/* Botão para a tela de Veículos */}
                <button data-target="#servicos" onClick={() => setTela(3)}>Serviços</button> {/* Botão para a tela de Serviços */}
                <button data-target="#agenda" onClick={() => setTela(4)}>Agenda</button> {/* Botão para a tela de Agenda */}
                <button data-target="#historico" onClick={() => setTela(5)}>Histórico</button> {/* Botão para a tela de Histórico */}
            </div>
            <div className={styles.main_content}> {/* Conteúdo principal onde os componentes são renderizados */}
                {
                    // Renderização condicional com base no valor de 'tela'
                    tela === 1 ?
                        <CadCliente /> // Exibe componente de Cadastro de Clientes
                        : tela === 2 ?
                            <Veiculos /> // Exibe componente de Veículos
                            : tela === 3 ?
                                <Servicos /> // Exibe componente de Serviços
                                : tela === 4 ?
                                    <FullCalendarGeral /> // Exibe calendário geral
                                    : tela === 5 ?
                                        <HistoricoAgendamentos /> // Exibe histórico de agendamentos
                                        : <></> // Caso 'tela' seja 0, não exibe nada
                }
            </div>
        </div>
    )
}