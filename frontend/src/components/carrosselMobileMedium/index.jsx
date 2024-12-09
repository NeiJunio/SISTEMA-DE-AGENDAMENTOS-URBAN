
'use client'

import Image from 'next/image'; // Importa o componente de imagem do Next.js para otimização de imagens
import styles from "./index.module.css"; // Importa o arquivo CSS com os estilos específicos deste componente

import { Carousel } from 'react-responsive-carousel'; // Importa o componente de carrossel da biblioteca 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa os estilos padrão do carrossel

// Componente CarrosselMobileMedium, responsável por exibir um carrossel de imagens para a versão medium (média) do layout
export default function CarrosselMobileMedium() {
    return (
        // Wrapper que envolve todo o carrossel, estilizado com a classe 'carouselWrapper'
        <div className={styles.carouselWrapper}>
            {/* Componente Carousel que exibe as imagens em um carrossel, com diversas configurações */}
            <Carousel
                showArrows={false} // Desabilita as setas de navegação
                showThumbs={false} // Desabilita a exibição de miniaturas das imagens
                infiniteLoop={true} // Ativa o loop infinito para as imagens
                autoPlay={true} // Ativa a reprodução automática do carrossel
                interval={4000} // Intervalo de 4 segundos entre as trocas de imagem
                className={styles.carousel} // Aplica a classe de estilo 'carousel' ao componente
                showStatus={false} // Desabilita a exibição do status do carrossel (ex. número da imagem atual)
            >
                {/* Cada div abaixo representa um slide do carrossel */}
                <div className={styles.carrosselMobile}>
                    {/* Componente Image para renderizar a imagem do carrossel */}
                    <Image
                        src='/imgCarrossel/img2mcopy.jpg' // Caminho da primeira imagem
                        alt="Ana Costa" // Texto alternativo para a imagem (nome da pessoa)
                        width={1920} // Largura da imagem
                        height={2880} // Altura da imagem
                        className={styles.testeImg} // Classe de estilo aplicada à imagem
                    />
                </div>
                {/* Outro slide com a segunda imagem */}
                <div className={styles.carrosselMobile}>
                    <Image
                        src='/imgCarrossel/img4.jpg' // Caminho da segunda imagem
                        alt="Ana Costa" // Texto alternativo para a imagem (nome da pessoa)
                        width={1920} // Largura da imagem
                        height={2880} // Altura da imagem
                        className={styles.testeImg} // Classe de estilo aplicada à imagem
                    />
                </div>
            </Carousel>
        </div>
    )
}
