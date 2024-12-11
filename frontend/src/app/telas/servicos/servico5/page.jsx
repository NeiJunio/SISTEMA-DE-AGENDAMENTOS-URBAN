import Image from 'next/image';
import styles from './page.module.css';

export default function Servico2() {
    return (
        <>
            <div className={styles.image_servicos}>
                <Image
                    src={'/suspensao.png'}
                    alt={"Manutenção da Suspensão"}
                    width={300}
                    height={300}
                    unoptimized={true}
                />
            </div>

            <hr className={styles.hr}></hr>

            <div className={styles.image_descricao}>
                Elimine imperfeições, riscos profundos e manchas na pintura com nosso serviço de correção. Utilizamos técnicas avançadas para restaurar a superfície original do seu veículo, garantindo um acabamento impecável e duradouro, sem a necessidade de repintura completa.
            </div>
        </>
    )
}