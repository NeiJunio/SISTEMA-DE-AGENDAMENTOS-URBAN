
'use client'

import Image from 'next/image';
import styles from './index.module.css';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function CarrosselMobileMedium() {
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
                        src='/imgCarrossel/img2mcopy.jpg'
                        alt="Ana Costa"
                        width={1920}
                        height={2880}
                        className={styles.testeImg}
                    />
                </div>
                <div className={styles.carrosselMobile}>
                    <Image
                        src='/imgCarrossel/img4.jpg'
                        alt="Ana Costa"
                        width={1920}
                        height={2880}
                        className={styles.testeImg}
                    />
                </div>
            </Carousel>
        </div>
    )
}