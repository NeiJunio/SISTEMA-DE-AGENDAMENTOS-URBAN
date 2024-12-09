
'use client'

import Image from 'next/image'; // Importa o componente de imagem do Next.js para otimização de imagens
import styles from "./index.module.css"; // Importa o arquivo CSS com os estilos específicos deste componente

import { Carousel } from 'react-responsive-carousel'; // Importa o componente de carrossel da biblioteca 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa os estilos padrão do carrossel

// Componente CarrosselInicial, responsável por exibir o carrossel de imagens na página inicial
export default function CarrosselInicial() {
    return (
        // Wrapper que envolve todo o carrossel, estilizado com a classe 'carouselWrapper'
        <div className={styles.carouselWrapper}>

            {/* Componente Carousel que exibe as imagens em um carrossel, com diversas configurações */}
            <Carousel
                showArrows={false} // Desabilita as setas de navegação
                showThumbs={false} // Desabilita a exibição de miniaturas das imagens
                infiniteLoop={true} // Ativa o loop infinito para as imagens
                autoPlay={true} // Ativa a reprodução automática do carrossel
                transitionTime={1500} // Define a duração da transição entre as imagens (1500ms)
                interval={4000} // Intervalo de 4 segundos entre as trocas de imagem
                className={styles.carousel} // Aplica a classe de estilo 'carousel' ao componente
                showStatus={false} // Desabilita a exibição do status do carrossel (ex. número da imagem atual)
            >
                {/* Cada div abaixo representa um slide do carrossel */}
                <div className={styles.carrossel}>
                    {/* Componente Image para renderizar a primeira imagem do carrossel */}
                    <Image
                        src='/imgCarrossel/img11.jpg' // Caminho da primeira imagem
                        alt='imagem' // Texto alternativo para a imagem
                        width={4256} // Largura da imagem
                        height={2832} // Altura da imagem
                        className={styles.testeImg} // Classe de estilo aplicada à imagem
                    />
                </div>
                <div className={styles.carrossel}>
                    <Image
                        src='/imgCarrossel/img2.jpg'
                        alt='imagem'
                        width={2000}
                        height={1423}
                        className={styles.testeImg}
                    />
                </div>
                <div className={styles.carrossel}>
                    <Image
                        src='/imgCarrossel/img3.jpg'
                        alt='imagem'
                        width={2400}
                        height={1522}
                        className={styles.testeImg}
                    />
                </div>
                <div className={styles.carrossel}>
                    <Image
                        src='/imgCarrossel/img4.jpg'
                        alt='imagem'
                        width={2400}
                        height={1350}
                        className={styles.testeImg}
                    />
                </div>
                <div className={styles.carrossel}>
                    <Image
                        src='/imgCarrossel/motorcycle.jpg'
                        alt='imagem'
                        width={1500}
                        height={1200}
                        className={styles.testeImg}
                    />
                </div>
            </Carousel>
        </div>
    )
}