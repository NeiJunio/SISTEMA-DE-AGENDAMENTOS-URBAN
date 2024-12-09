'use client' // Indica que este arquivo será renderizado no lado do cliente no Next.js

import { useState } from 'react'; // Importa o hook useState para gerenciar estados locais
import Link from 'next/link'; // Importa o componente Link para navegação entre páginas
import Image from 'next/image'; // Importa o componente Image para otimizar imagens no Next.js
import styles from './index.module.css'; // Importa os estilos CSS para este componente

export default function Header() {
    const [mobile, setMobile] = useState(false); // Estado para controlar se o menu mobile está aberto
    const [closing, setClosing] = useState(false); // Estado para gerenciar a animação de fechamento do menu

    // Função para ativar ou desativar o menu mobile
    function ativaMenuMobile() {
        if (mobile === false) { // Se o menu mobile não está ativo
            setMobile(true); // Ativa o menu mobile
        } else {
            setClosing(true); // Ativa o estado de fechamento
            setTimeout(() => { // Após 300ms, conclui o fechamento do menu
                setMobile(false); // Desativa o menu mobile
                setClosing(false); // Reseta o estado de fechamento
            }, 300); // Tempo da animação de fechamento
        }
    }

    return (
        <header className={styles.header}> {/* Header do site com classe para estilização */}
            <div className={styles.containerNav}> {/* Container principal da navegação */}
                <div className={styles.menu}> {/* Div que contém o logo e o menu */}
                    <span className={styles.logo}></span> {/* Espaço reservado para o logo */}
                    <nav className={styles.navbar}> {/* Navegação principal (desktop) */}
                        <ul className={styles.navlist}> {/* Lista de links da navegação */}
                            <li><Link href="/" className={styles.linkNav}>Home</Link></li>
                            <li><Link href="/telas/sobre" className={styles.linkNav}>Sobre</Link></li>
                            <li><Link href="/telas/servicos" className={styles.linkNav}>Serviços</Link></li>
                            <li><Link href="/telas/contatos" className={styles.linkNav}>Contato</Link></li>
                            <li><Link href="/telas/login" className={styles.linkNav}>Login</Link></li>
                        </ul>
                    </nav>
                    {/* Botão para abrir o menu mobile */}
                    <div className={styles.menuMobile} onClick={ativaMenuMobile}>
                        <Image
                            src={'/icons/menuMobile.svg'} // Ícone do menu mobile
                            width={32} // Largura do ícone
                            height={32} // Altura do ícone
                            alt="icon menu" // Texto alternativo do ícone
                        ></Image>
                    </div>
                </div>

                {/* Background escuro que aparece quando o menu mobile está ativo */}
                {mobile && !closing && (
                    <div className={styles.menuBackground} onClick={() => ativaMenuMobile()}></div>
                )}

                {/* Menu mobile com animações de abertura e fechamento */}
                <div className={mobile ? (closing ? styles.menuMobileClosing : styles.menuMobileActive) : styles.hidden}>
                    <div className={styles.closeMenu} onClick={() => ativaMenuMobile()}>
                        <Image
                            src={'/icons/closeMenu.svg'} // Ícone de fechar o menu
                            width={32}
                            height={32}
                            alt="icon close" // Texto alternativo do ícone
                        ></Image>
                    </div>

                    {/* Navegação dentro do menu mobile */}
                    <nav className={styles.navlistMobile}>
                        <Link href="/" className={styles.linkNavMobile} onClick={() => ativaMenuMobile()}>Home</Link>
                        <Link href="/telas/sobre" className={styles.linkNavMobile} onClick={() => ativaMenuMobile()}>Sobre</Link>
                        <Link href="/telas/contatos" className={styles.linkNavMobile} onClick={() => ativaMenuMobile()}>Contato</Link>
                        <Link href="/telas/login" className={styles.linkNavMobile} onClick={() => ativaMenuMobile()}>Login</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}