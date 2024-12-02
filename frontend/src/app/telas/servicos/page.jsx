'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

import Header from '@/components/header';
import Footer from '@/components/footer';

import Servico1 from './servico1/page';
import Servico2 from './servico2/page';
import Servico3 from './servico3/page';
import Servico4 from './servico4/page';
import Servico5 from './servico5/page';
import Servico6 from './servico6/page';

export default function Servicos() {
    const [tela, setTela] = useState(1);

    useEffect(() => {
        setTela(1);
    }, []);

    return (
        <>
            <Header />

            <main className={styles.main}>
                <section className={styles.section}>
                    <div className={styles.geral_servicos}>
                        <div className={styles.sidebar_buttons}>
                            <h1 className={styles.emalta}>Em alta</h1>

                            <Link href='' className={`${styles.link_button} ${tela === 1 ? styles.active : ''}`} onClick={() => setTela(1)}>
                                Polimento e Cristalização da Pintura
                            </Link>

                            <Link href='' className={`${styles.link_button} ${tela === 2 ? styles.active : ''}`} onClick={() => setTela(2)}>
                                Higienização Interna Completa
                            </Link>

                            <Link href='' className={`${styles.link_button} ${tela === 3 ? styles.active : ''}`} onClick={() => setTela(3)}>
                                Envelopamento Automotivo
                            </Link>

                            <Link href='' className={`${styles.link_button} ${tela === 4 ? styles.active : ''}`} onClick={() => setTela(4)}>
                                Vitrificação de Vidros
                            </Link>

                            <Link href='' className={`${styles.link_button} ${tela === 5 ? styles.active : ''}`} onClick={() => setTela(5)}>
                                Correção de Pintura
                            </Link>

                            <Link href='' className={`${styles.link_button} ${tela === 6 ? styles.active : ''}`} onClick={() => setTela(6)}>
                                Proteção Cerâmica
                            </Link>

                        </div>

                        <div className={styles.container_servicos}>
                            {
                                tela === 1 ?
                                    <Servico1 />
                                    : tela === 2 ?
                                        <Servico2 />
                                        : tela === 3 ?
                                            <Servico3 />
                                            : tela === 4 ?
                                                <Servico4 />
                                                : tela === 5 ?
                                                    <Servico5 />
                                                    : tela === 6 ?
                                                        <Servico6 />
                                                        : <></>
                            }

                        </div>

                        <div className={styles.container_servicosMobile}>

                            <div className={`${styles.servico} ${styles.um}`}>
                                <p>Polimento</p>
                                <div className={styles.contentText}>
                                    Revitalize o brilho e a profundidade da cor do seu veículo com nosso serviço de polimento e cristalização. Removemos micro-riscos, manchas e marcas superficiais, aplicando uma camada de proteção que prolonga o efeito visual e protege contra agentes externos, como raios UV e poluição.
                                </div>
                            </div>
                            <div className={`${styles.servico} ${styles.dois}`}>
                                <p>Higienização</p>
                                <div className={styles.contentText}>
                                    Mantenha o interior do seu carro sempre limpo e agradável. Nosso serviço de higienização interna inclui a limpeza profunda de estofados, carpetes, painéis e portas, utilizando produtos que eliminam odores, manchas e sujeira, garantindo um ambiente fresco e saudável para você e seus passageiros.</div>
                            </div>
                            <div className={`${styles.servico} ${styles.tres}`}>
                                <p>Envelopamento</p>
                                <div className={styles.contentText}>
                                    Dê uma nova cara ao seu carro com o nosso serviço de envelopamento automotivo. Oferecemos uma ampla variedade de cores e acabamentos, incluindo fosco, brilhante e metálico. Além de alterar a estética do veículo, o envelopamento protege a pintura original contra arranhões e desgaste.</div>
                            </div>
                            <div className={`${styles.servico} ${styles.quatro}`}>
                                <p>Vitrificação</p>
                                <div className={styles.contentText}>
                                    Melhore a visibilidade e segurança ao dirigir com nosso tratamento de vitrificação de vidros. Criamos uma camada repelente de água e sujeira sobre o para-brisa e vidros laterais, facilitando a remoção de detritos e garantindo uma visão clara em qualquer condição climática.</div>
                            </div>
                            <div className={`${styles.servico} ${styles.cinco}`}>
                                <p>Pintura</p>
                                <div className={styles.contentText}>
                                    Elimine imperfeições, riscos profundos e manchas na pintura com nosso serviço de correção. Utilizamos técnicas avançadas para restaurar a superfície original do seu veículo, garantindo um acabamento impecável e duradouro, sem a necessidade de repintura completa.</div>
                            </div>
                            <div className={`${styles.servico} ${styles.seis}`}>
                                <p>Proteção Cerâmica</p>
                                <div className={styles.contentText}>
                                    Proteja a pintura do seu carro com nosso serviço de aplicação de proteção cerâmica. Esse revestimento cria uma barreira resistente contra contaminantes, UV, e desgaste, além de oferecer um brilho duradouro. Ideal para quem deseja preservar a beleza e valor do veículo por mais tempo.</div>
                            </div>
                            <h2>Para conhecer todos os serviços, cadastre-se</h2>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}