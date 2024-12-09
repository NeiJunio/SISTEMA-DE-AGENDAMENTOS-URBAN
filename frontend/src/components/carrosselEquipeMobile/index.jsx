'use client'

import Image from 'next/image'; // Importa o componente de imagem do Next.js para otimização de imagens
import styles from "./index.module.css"; // Importa o arquivo CSS com os estilos específicos deste componente

import { Carousel } from 'react-responsive-carousel'; // Importa o componente de carrossel da biblioteca 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa os estilos padrão do carrossel

// Exporta o componente CarrosselEquipeMobile como padrão
export default function CarrosselEquipeMobile() {
    return (
        <>
            {/* Wrapper do carrossel com estilos personalizados */}
            <div className={styles.carouselWrapper}>
                {/* Título da seção */}
                <h2 className={styles.sectionHeading}>Nossa Equipe</h2>
                
                {/* Componente de carrossel com configurações personalizadas */}
                <Carousel
                    showArrows={true} // Exibe setas de navegação
                    showThumbs={false} // Oculta miniaturas
                    infiniteLoop={true} // Habilita loop infinito
                    autoPlay={true} // Reproduz automaticamente
                    interval={7000} // Intervalo de 7 segundos entre os slides
                    showStatus={false} // Oculta o status do carrossel
                    stopOnHover={true} // Pausa o carrossel ao passar o mouse
                    className={styles.carousel} // Classe CSS personalizada
                    renderIndicator={false} // Oculta indicadores de posição
                    renderArrowPrev={(clickHandler, hasPrev, labelPrev) =>
                        // Renderiza seta anterior personalizada se houver slide anterior
                        hasPrev && (
                            <button
                                type="button"
                                onClick={clickHandler} // Função de clique para voltar
                                className={styles.customPrevArrow} // Classe CSS da seta anterior
                                aria-label={labelPrev} // Texto alternativo para acessibilidade
                            >
                                &#9664; {/* Ícone da seta */}
                            </button>
                        )
                    }
                    renderArrowNext={(clickHandler, hasNext, labelNext) =>
                        // Renderiza seta próxima personalizada se houver próximo slide
                        hasNext && (
                            <button
                                type="button"
                                onClick={clickHandler} // Função de clique para avançar
                                className={styles.customNextArrow} // Classe CSS da seta próxima
                                aria-label={labelNext} // Texto alternativo para acessibilidade
                            >
                                &#9654; {/* Ícone da seta */}
                            </button>
                        )
                    }
                >
                    {/* Cards individuais de membros da equipe */}
                    <div className={styles.employeeContainer}>
                        <div className={styles.employeeCard}>
                            <Image
                                src='/mecanico.png' // Caminho da imagem
                                alt="Carlos Silva" // Texto alternativo
                                width={450} // Largura da imagem
                                height={450} // Altura da imagem
                                className={styles.employeeImage} // Classe CSS personalizada
                            />
                            <h3 className={styles.employeeName}>Carlos Silva</h3> {/* Nome do membro */}
                            <p className={styles.employeePosition}>Mecânico Chefe</p> {/* Cargo */}
                            <p className={styles.employeeDescription}>Especialista em diagnósticos complexos.</p> {/* Descrição */}
                        </div>
                    </div>

                    {/* Repetição do bloco acima para outros membros da equipe */}
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
                </Carousel>
            </div>
        </>
    );
}

