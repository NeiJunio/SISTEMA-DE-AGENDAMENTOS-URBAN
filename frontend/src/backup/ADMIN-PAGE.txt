'use client';

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

import CadCliente from "./cadcliente/page";
import Veiculos from "./veiculos/page";
import Servicos from "./servicos/page";
import FullCalendarGeral from "../usuario/agenda/page";
import HistoricoAgendamentos from "./historicoagendamentos/page";

import { MdPowerSettingsNew } from "react-icons/md";
import Cookies from "js-cookie";

export default function Home() {
    const [userId, setUserId] = useState(null);
    const [tela, setTela] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserId(parsedUser);
        }
    }, []);

    const clearLocalStorage = () => {
        localStorage.clear();
        Cookies.remove('token', { path: '/' });
    };

    return (
        <div className={styles.grid_container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Painel Administrativo</h1>

                <Link href="/" className={styles.iconPower}>
                    <MdPowerSettingsNew className={styles.power} onClick={clearLocalStorage} />
                </Link>

            </div>
            <div className={styles.sidebar}>
                <button data-target="#clientes" onClick={() => setTela(1)}>Clientes</button>
                <button data-target="#veiculos" onClick={() => setTela(2)}>Veículos</button>
                <button data-target="#servicos" onClick={() => setTela(3)}>Serviços</button>
                <button data-target="#agenda" onClick={() => setTela(4)}>Agenda</button>
                <button data-target="#historico" onClick={() => setTela(5)}>Histórico</button>
            </div>
            <div className={styles.main_content}>
                {
                    tela === 1 ?
                        <CadCliente />
                        : tela === 2 ?
                            <Veiculos />
                            : tela === 3 ?
                                <Servicos />
                                : tela === 4 ?
                                    <FullCalendarGeral />
                                    : tela === 5 ?
                                        <HistoricoAgendamentos />
                                        : <></>
                }
            </div>

        </div>
    )
}