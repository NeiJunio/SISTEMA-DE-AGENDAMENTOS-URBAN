
'use client'

import Image from 'next/image';
import styles from './index.module.css';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function CarrosselMobile() {
    return (
        <div className={styles.carouselWrapper}>
            <Carousel
                showArrows={false}
                showThumbs={false}
                infiniteLoop={true}
                autoPlay={true}
                interval={4000}
                className={styles.carousel}
                showStatus={false}  
            >
                <div className={styles.carrosselMobile}>
                    <Image
                        src='/imgCarrossel/img1m.jpg'
                        alt="Imagem"
                        width={4256}
                        height={2832}
                        className={styles.testeImg}
                    />
                </div>
                <div className={styles.carrosselMobile}>
                    <Image
                        src='/imgCarrossel/img2m.jpg'
                        alt="Imagem"
                        width={2000}
                        height={1423}
                        className={styles.testeImg}
                    />
                </div>
                <div className={styles.carrosselMobile}>
                    <Image
                        src='/imgCarrossel/img3m.jpg'
                        alt="Imagem"
                        width={2400}
                        height={1522}
                        className={styles.testeImg}
                    />
                </div>
                <div className={styles.carrosselMobile}>
                    <Image
                        src='/imgCarrossel/img4m.jpg'
                        alt="Imagem"
                        width={2400}
                        height={1350}
                        className={styles.testeImg}
                    />
                </div>
                <div className={styles.carrosselMobile}>
                    <Image
                        src='/imgCarrossel/img5m.jpg'
                        alt="Imagem"
                        width={2400}
                        height={1600}
                        className={styles.testeImg}
                    />
                </div>
            </Carousel>
        </div>
    )
}