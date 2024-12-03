import Image from 'next/image';
import styles from './page.module.css';

export default function Servico2() {
    return (
        <>
            <div className={styles.image_servicos}><Image
                src={'/alinhamentocarro.png'}
                alt={"Alinhamento e Balanceamento"}
                width={500}
                height={500}
                unoptimized={true}
            />
            </div>

            <hr className={styles.hr}></hr>

            <div className={styles.image_descricao}>
                Mantenha o interior do seu carro sempre limpo e agradável. Nosso serviço de higienização interna inclui a limpeza profunda de estofados, carpetes, painéis e portas, utilizando produtos que eliminam odores, manchas e sujeira, garantindo um ambiente fresco e saudável para você e seus passageiros.
            </div>
        </>
    )
}