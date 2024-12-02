import Image from 'next/image';
import styles from './page.module.css';

export default function Servico1() {
  return (
    <>      
        <div className={styles.image_servicos}>

          <Image
            src={'/trocadeoleo1.png'}
            alt={"Troca de Óleo"}
            width={500}
            height={500}
            unoptimized={true}
          />

        </div>

        <hr className={styles.hr}></hr>

        <div className={styles.image_descricao}>
          Revitalize o brilho e a profundidade da cor do seu veículo com nosso serviço de polimento e cristalização. Removemos micro-riscos, manchas e marcas superficiais, aplicando uma camada de proteção que prolonga o efeito visual e protege contra agentes externos, como raios UV e poluição.
        </div>
      
    </>
  )
}

