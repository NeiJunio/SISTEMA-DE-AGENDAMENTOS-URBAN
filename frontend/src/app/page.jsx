'use client'

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

import Header from "@/components/header";
import Footer from "@/components/footer";

import CarrosselInicial from "@/components/carrosselPage";
import CarrosselMobile from "@/components/carrosselMobile";
import CarrosselMobileMedium from "@/components/carrosselMobileMedium";
import CarrosselEquipe from "@/components/carrosselEquipe";
import CarrosselEquipeMobile from "@/components/carrosselEquipeMobile";

export default function Home() {
    return (
        <html>
            <body>

                <Header />

                <section className={styles.section}>

                    <div className={styles.carrosselInicial}>
                        <CarrosselInicial />
                    </div>
                    <div className={styles.carrosselMobile}>
                        <CarrosselMobile />
                    </div>
                    <div className={styles.CarrosselMobileMedium}>
                        <CarrosselMobileMedium />
                    </div>

                    <div className={styles.backgroundSection}>
                        <h2 className={styles.sectionTitle1}>Seu carro na melhor performance!</h2>
                        <p className={styles.sectionContent1}>Revele a essência do seu automóvel</p>
                    </div>
                </section>

                <main className={styles.main}>

                    <div className={styles.divider}></div>

                    <section className={styles.section2}>
                        <div className={styles.section2Image}>
                            <Image
                                src='/servicomecanico1233.png'
                                alt="Imagem de serviço"
                                width={500}
                                height={520}
                                className={styles.imagememsi}/>
                        </div>
                        <div className={styles.section2Content}>
                            <h2 className={styles.section2Title}>Nossos Serviços</h2>
                            <p className={styles.section2Description}>
                                Oferecemos uma ampla gama de serviços para garantir que seu veículo esteja sempre em ótimo estado.
                                Desde manutenção preventiva até reparos complexos, temos a expertise que você precisa.
                            </p>
                            <div>
                                <Link href="/telas/servicos">
                                    <button className={styles.section2Button}>Veja mais</button>
                                </Link>
                            </div>
                        </div>
                    </section>

                    <div className={styles.divider}></div>

                    <section className={styles.secao3}>
                        <div className={styles.carrouselEquipe}>
                            <CarrosselEquipe />
                        </div>
                        <div className={styles.carrouselEquipeMobile}>
                            <CarrosselEquipeMobile />
                        </div>
                    </section>

                    <div className={styles.divider}></div>

                    <section className={styles.section4}>
                        <p className={styles.title_questions}>Perguntas frequentes</p>
                        <div className={styles.container_questions}>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Preciso agendar um horário para realizar serviços de estética no meu veículo?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Sim, recomendamos que você agende um horário para garantir que possamos atender seu veículo no melhor momento para você. Entre em contato pelo telefone, site ou aplicativo para agendar.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Quanto tempo leva para realizar um polimento completo no veículo?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    O tempo necessário para realizar um polimento completo pode variar dependendo do estado do veículo e do tipo de acabamento desejado. Em média, o processo leva de 3 a 5 horas.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Quais tipos de serviços de estética automotiva vocês realizam?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Realizamos uma variedade de serviços de estética automotiva, como lavagem, polimento, enceramento, vitrificação, higienização interna, proteção de pintura, entre outros. Garantimos que seu carro estará sempre com a melhor aparência.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Quais formas de pagamento são aceitas?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Aceitamos pagamentos em dinheiro, cartões de crédito e débito, e transferência bancária. Também trabalhamos com algumas opções de parcelamento, consulte nossa equipe para mais detalhes.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Vocês oferecem serviços de proteção de pintura?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Sim, oferecemos diversos tipos de proteção de pintura, incluindo vitrificação, aplicação de cera e selante. Esses serviços ajudam a preservar a cor e o brilho do seu veículo por mais tempo.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Como posso agendar um serviço de estética automotiva?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Para agendar um serviço de estética automotiva, entre em contato conosco por telefone, ou acesse nosso site ou aplicativo. Nossa equipe estará pronta para ajudar a escolher o melhor horário para você.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Qual é a frequência recomendada para serviços de lavagem e manutenção estética?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Recomendamos realizar a lavagem e manutenção estética do veículo pelo menos uma vez por mês para manter a pintura e o interior em excelente estado. A frequência pode variar conforme o uso e as condições ambientais.
                                </div>
                            </details>

                            <details className={styles.details}>
                                <summary className={styles.summary}>
                                    <div className={styles.summary_content}>
                                        Qual é o horário de funcionamento da oficina?
                                    </div>
                                    <div className={styles.boxArrow}>
                                        <span className={styles.arrow_down}></span>
                                    </div>
                                </summary>
                                <div className={styles.description}>
                                    Nossa oficina funciona de segunda a sexta, das 8h às 18h, e aos sábados das 8h às 13h. Não abrimos aos domingos e feriados.
                                </div>
                            </details>
                        </div>
                    </section>

                </main>

                <Footer />

            </body>
        </html >
    );
}
