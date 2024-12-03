
import React from 'react';
import styles from './page.module.css';

const Termos = () => {
    return (
        <>
            <header className={styles.header}>
                <span className={styles.logo}></span>
            </header>

            <div className={styles.container}>
                <h1 className={styles.titulo}>Termos, Políticas e Referências</h1>

                <section className={styles.section}>
                    <h2>Política de Privacidade</h2>
                    <p>
                        A sua privacidade é importante para nós. Esta página descreve como
                        coletamos, armazenamos e utilizamos as suas informações. Garantimos
                        que todos os dados coletados são tratados com segurança e em
                        conformidade com as leis de proteção de dados aplicáveis.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Política de Segurança</h2>
                    <p>
                        Nosso site é protegido por várias camadas de segurança para proteger
                        seus dados contra acessos não autorizados, alterações e destruição.
                        Trabalhamos constantemente para aprimorar nossas medidas de segurança.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Uso de Cookies</h2>
                    <p>
                        Utilizamos cookies para melhorar a sua experiência de navegação.
                        Estes cookies nos ajudam a entender como você utiliza o site e
                        personalizar o conteúdo e as funcionalidades oferecidas. Você pode
                        configurar seu navegador para bloquear os cookies, mas isso pode
                        limitar algumas funcionalidades do site.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Referências e Fontes</h2>
                    <p>
                        Todas as informações contidas neste site são provenientes de fontes
                        confiáveis e atualizadas. As referências usadas para construir nossas
                        políticas de segurança são baseadas nas melhores práticas do setor.
                    </p>
                </section>
            </div>

        </>
    );
};

export default Termos;