import Image from 'next/image';
import styles from './page.module.css';

export default function Servico2() {
    return (
        <>
            <div className={styles.image_servicos}>
                <Image
                    src={'/revisaodefreio.png'}
                    alt={"Revisão de freios"}
                    width={300}
                    height={300}
                    unoptimized={true}
                />

            </div>

            <hr className={styles.hr}></hr>

            <div className={styles.image_descricao}>
            Dê uma nova cara ao seu carro com o nosso serviço de envelopamento automotivo. Oferecemos uma ampla variedade de cores e acabamentos, incluindo fosco, brilhante e metálico. Além de alterar a estética do veículo, o envelopamento protege a pintura original contra arranhões e desgaste.
            </div>
        </>
    )
}