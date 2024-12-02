'use client'

import Image from 'next/image';
import styles from "./index.module.css";

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function CarrosselEquipeMobile() {
    return (
        <>
            <div className={styles.carouselWrapper}>
                <h2 className={styles.sectionHeading}>Nossa Equipe</h2>
                <Carousel
                    showArrows={true}
                    showThumbs={false}
                    infiniteLoop={true}
                    autoPlay={true}
                    interval={7000}
                    showStatus={false}
                    stopOnHover={true}
                    className={styles.carousel}
                    renderIndicator={false}
                    renderArrowPrev={(clickHandler, hasPrev, labelPrev) =>
                        hasPrev && (
                            <button
                                type="button"
                                onClick={clickHandler}
                                className={styles.customPrevArrow}
                                aria-label={labelPrev}
                            >
                                &#9664; 
                            </button>
                        )
                    }
                    renderArrowNext={(clickHandler, hasNext, labelNext) =>
                        hasNext && (
                            <button
                                type="button"
                                onClick={clickHandler}
                                className={styles.customNextArrow}
                                aria-label={labelNext}
                            >
                                &#9654;
                            </button>
                        )
                    }
                >

                    <div className={styles.employeeContainer}>
                        <div className={styles.employeeCard}>
                            <Image
                                src='/mecanico.png'
                                alt="Carlos Silva"
                                width={450}
                                height={450}
                                className={styles.employeeImage}
                            />
                            <h3 className={styles.employeeName}>Carlos Silva</h3>
                            <p className={styles.employeePosition}>Mecânico Chefe</p>
                            <p className={styles.employeeDescription}>Especialista em diagnósticos complexos.</p>
                        </div>
                    </div>

                    <div className={styles.employeeContainer}>
                        <div className={styles.employeeCard}>
                            <Image
                                src='/Mecanico_Mulher.png'
                                alt="Ana Costa"
                                width={450}
                                height={450}
                                className={styles.employeeImage}
                            />
                            <h3 className={styles.employeeName}>Ana Costa</h3>
                            <p className={styles.employeePosition}>Consultora de Serviços</p>
                            <p className={styles.employeeDescription}>Responsável pelo atendimento ao cliente.</p>
                        </div>
                    </div>

                    <div className={styles.employeeContainer}>
                        <div className={styles.employeeCard}>
                            <Image
                                src='/mecanico.png'
                                alt="Marcos Pereira"
                                width={450}
                                height={450}
                                className={styles.employeeImage}
                            />
                            <h3 className={styles.employeeName}>Marcos Pereira</h3>
                            <p className={styles.employeePosition}>Técnico em Eletrônica</p>
                            <p className={styles.employeeDescription}>Especializado em sistemas eletrônicos de veículos.</p>
                        </div>
                    </div>

                    <div className={styles.employeeContainer}>
                        <div className={styles.employeeCard}>
                            <Image
                                src='/mecanico.png'
                                alt="João Lima"
                                width={450}
                                height={450}
                                className={styles.employeeImage}
                            />
                            <h3 className={styles.employeeName}>João Lima</h3>
                            <p className={styles.employeePosition}>Assistente de Oficina</p>
                            <p className={styles.employeeDescription}>Auxilia nos serviços gerais e manutenção preventiva.</p>
                        </div>
                    </div>

                    <div className={styles.employeeContainer}>
                        <div className={styles.employeeCard}>
                            <Image
                                src='/mecanico.png'
                                alt="Marcos Pereira"
                                width={450}
                                height={450}
                                className={styles.employeeImage}
                            />
                            <h3 className={styles.employeeName}>Leopoldo Henrique</h3>
                            <p className={styles.employeePosition}>Técnico em Eletrônica</p>
                            <p className={styles.employeeDescription}>Especializado em sistemas eletrônicos de veículos.</p>
                        </div>
                    </div>

                    <div className={styles.employeeContainer}>
                        <div className={styles.employeeCard}>
                            <Image
                                src='/mecanico.png'
                                alt="Calabreso"
                                width={450}
                                height={450}
                                className={styles.employeeImage}
                            />
                            <h3 className={styles.employeeName}>Stephen Curry</h3>
                            <p className={styles.employeePosition}>Assistente de Oficina</p>
                            <p className={styles.employeeDescription}>Auxilia nos serviços gerais e manutenção preventiva.</p>
                        </div>
                    </div>
                </Carousel >
            </div >
        </>
    );
}