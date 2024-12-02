'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './index.module.css'

export default function Header() {
    const [mobile, setMobile] = useState(false);
    const [closing, setClosing] = useState(false);

    function ativaMenuMobile() {
        if (mobile === false) {
            setMobile(true);
        } else {
            setClosing(true);
            setTimeout(() => {
                setMobile(false);
                setClosing(false);
            }, 300);
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.containerNav}>
                <div className={styles.menu}>
                    <span className={styles.logo}></span>
                    <nav className={styles.navbar}>
                        <ul className={styles.navlist}>
                            <li><Link href="/" className={styles.linkNav}>Home</Link></li>
                            <li><Link href="/telas/sobre" className={styles.linkNav}>Sobre</Link></li>
                            <li><Link href="/telas/servicos" className={styles.linkNav}>Serviços</Link></li>
                            <li><Link href="/telas/contatos" className={styles.linkNav}>Contato</Link></li>
                            <li><Link href="/telas/login" className={styles.linkNav}>Login</Link></li>
                        </ul>
                    </nav>
                    <div className={styles.menuMobile} onClick={ativaMenuMobile}>
                        <Image
                            src={'/icons/menuMobile.svg'}
                            width={32}
                            height={32}
                            alt="icon menu"
                        ></Image>
                    </div>
                </div>

                {mobile && !closing && (
                    <div className={styles.menuBackground} onClick={() => ativaMenuMobile()}></div>
                )}

                <div className={mobile ? (closing ? styles.menuMobileClosing : styles.menuMobileActive) : styles.hidden}>
                    <div className={styles.closeMenu} onClick={() => ativaMenuMobile()}>
                        <Image
                            src={'/icons/closeMenu.svg'}
                            width={32}
                            height={32}
                            alt="icon close"
                        ></Image>
                    </div>

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