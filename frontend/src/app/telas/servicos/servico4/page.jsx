import Image from 'next/image';
import styles from './page.module.css';

export default function Servico2() {
    return (
        <>
            <div className={styles.image_servicos}>
                <Image
                    src={'/bateriatrocar.png'}
                    alt={"Substituição de Baterias"}
                    width={500}
                    height={250}
                    unoptimized={true}
                />
            </div>

            <hr className={styles.hr}></hr>

            <div className={styles.image_descricao}>
                Melhore a visibilidade e segurança ao dirigir com nosso tratamento de vitrificação de vidros. Criamos uma camada repelente de água e sujeira sobre o para-brisa e vidros laterais, facilitando a remoção de detritos e garantindo uma visão clara em qualquer condição climática.
            </div>
        </>
    )
}
