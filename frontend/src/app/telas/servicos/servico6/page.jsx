import Image from 'next/image';
import styles from './page.module.css';

export default function Servico2() {
    return (
        <>
            <div className={styles.image_servicos}>
                <Image
                    src={'/revisaoeletronica.png'}
                    alt={"Diagnóstico Eletrônico"}
                    width={400}
                    height={300}
                    unoptimized={true}
                />

            </div>

            <hr className={styles.hr}></hr>

            <div className={styles.image_descricao}>
                Proteja a pintura do seu carro com nosso serviço de aplicação de proteção cerâmica. Esse revestimento cria uma barreira resistente contra contaminantes, UV, e desgaste, além de oferecer um brilho duradouro. Ideal para quem deseja preservar a beleza e valor do veículo por mais tempo.
            </div>
        </>
    )
}
