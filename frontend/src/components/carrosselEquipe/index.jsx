'use client'

import Image from 'next/image'; // Importa o componente de imagem do Next.js para otimização de imagens
import styles from "./index.module.css"; // Importa o arquivo CSS com os estilos específicos deste componente

import { Carousel } from 'react-responsive-carousel'; // Importa o componente de carrossel da biblioteca 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa os estilos padrão do carrossel

// Define o componente CarrosselEquipe
export default function CarrosselEquipe() {
    return (
        // Wrapper do carrossel estilizado com uma classe do CSS
        <div className={styles.carouselWrapper}>
            {/* Título da seção */}
            <h2 className={styles.sectionHeading}>Nossa Equipe</h2>
            
            {/* Componente do carrossel com várias propriedades configuradas */}
            <Carousel
                showArrows={true} // Exibe setas de navegação
                showThumbs={false} // Oculta as miniaturas
                infiniteLoop={true} // Habilita o loop infinito
                autoPlay={true} // Ativa a reprodução automática
                interval={7000} // Define o intervalo de 7 segundos entre slides
                showStatus={false} // Oculta o indicador de status
                stopOnHover={true} // Pausa a reprodução automática ao passar o mouse
                className={styles.carousel} // Aplica estilos personalizados
                renderIndicator={false} // Oculta os indicadores de navegação
                renderArrowPrev={(clickHandler, hasPrev, labelPrev) =>
                    // Renderiza a seta personalizada para navegação anterior
                    hasPrev && (
                        <button
                            type="button"
                            onClick={clickHandler}
                            className={styles.customPrevArrow}
                            aria-label={labelPrev} // Acessibilidade: descrição da seta
                        >
                            &#9664; {/* Ícone da seta para a esquerda */}
                        </button>
                    )
                }
                renderArrowNext={(clickHandler, hasNext, labelNext) =>
                    // Renderiza a seta personalizada para navegação próxima
                    hasNext && (
                        <button
                            type="button"
                            onClick={clickHandler}
                            className={styles.customNextArrow}
                            aria-label={labelNext} // Acessibilidade: descrição da seta
                        >
                            &#9654; {/* Ícone da seta para a direita */}
                        </button>
                    )
                }
            >
                {/* Primeiro conjunto de slides com informações da equipe */}
                <div className={styles.employeeContainer}>
                    <div className={styles.employeeCard}>
                        {/* Imagem do colaborador com otimização */}
                        <Image
                            src='/mecanico.png'
                            alt="Carlos Silva"
                            width={450}
                            height={450}
                            className={styles.employeeImage}
                        />
                        {/* Informações do colaborador */}
                        <h3 className={styles.employeeName}>Carlos Silva</h3>
                        <p className={styles.employeePosition}>Mecânico Chefe</p>
                        <p className={styles.employeeDescription}>Especialista em diagnósticos complexos.</p>
                    </div>

                    <div className={styles.employeeCard}>
                        <Image
                            src='/mecanicomulher.png'
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

                {/* Segundo conjunto de slides */}
                <div className={styles.employeeContainer}>
                    <div className={styles.employeeCard}>
                        <Image
                            src='/mec_zé_ruelas.png'
                            alt="Marcos Pereira"
                            width={650}
                            height={650}
                            className={styles.employeeImage}
                        />
                        <h3 className={styles.employeeName}>Marcos Pereira</h3>
                        <p className={styles.employeePosition}>Técnico em Eletrônica</p>
                        <p className={styles.employeeDescription}>Especializado em sistemas eletrônicos de veículos.</p>
                    </div>

                    <div className={styles.employeeCard}>
                        <Image
                            src='/mecanico_feio_com_fundos.png'
                            alt="João Lima"
                            width={650}
                            height={650}
                            className={styles.employeeImage}
                        />
                        <h3 className={styles.employeeName}>João Lima</h3>
                        <p className={styles.employeePosition}>Assistente de Oficina</p>
                        <p className={styles.employeeDescription}>Auxilia nos serviços gerais e manutenção preventiva.</p>
                    </div>
                </div>

                {/* Terceiro conjunto de slides */}
                <div className={styles.employeeContainer}>
                    <div className={styles.employeeCard}>
                        <Image
                            src='/mecanico3.png'
                            alt="Cléber Sampaio"
                            width={450}
                            height={450}
                            className={styles.employeeImage}
                        />
                        <h3 className={styles.employeeName}>Cléber Sampaio</h3>
                        <p className={styles.employeePosition}>Técnico em Eletrônica</p>
                        <p className={styles.employeeDescription}>Especializado em sistemas eletrônicos de veículos.</p>
                    </div>

                    <div className={styles.employeeCard}>
                        <Image
                            src='/mecanico4.png'
                            alt="João Silva"
                            width={650}
                            height={650}
                            className={styles.employeeImage}
                        />
                        <h3 className={styles.employeeName}>João Silva</h3>
                        <p className={styles.employeePosition}>Assistente de Oficina</p>
                        <p className={styles.employeeDescription}>Auxilia nos serviços gerais e manutenção preventiva.</p>
                    </div>
                </div>
            </Carousel >
        </div >
    );
}