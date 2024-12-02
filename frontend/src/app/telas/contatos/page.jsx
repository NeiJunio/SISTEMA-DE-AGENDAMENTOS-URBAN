import Link from 'next/link';
import styles from './page.module.css';

import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Contato() {
    return (
        <div>
            <Header />
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.title}>Fale conosco</div>
                    <div className={styles.info}>
                        <div className={styles.card}>
                            <div className={styles.infoDuvidas}>
                                <span className={styles.infoDuvidasTitulo}>Dúvidas</span>
                                <div className={styles.infos}>
                                    <span className={styles.informacao}>Telefone: (14) 3404 - 4004</span>
                                    <span className={styles.informacao}>WhatsApp: (14) 99675 - 6789</span>
                                    <span className={styles.informacao}>Email: suporte@urbanestetica.com</span>
                                </div>
                            </div>
                            <div className={styles.infoContatos}>
                                <span className={styles.infoContatosTitulo}>Contatos</span>
                                <div className={styles.infos}>
                                    <span className={styles.informacao}>Telefone: (14) 3404 - 4014</span>
                                    <span className={styles.informacao}>WhatsApp: (14) 99675 - 6789</span>
                                    <span className={styles.informacao}>Email: atendimento@urbanestetica.com</span>
                                </div>
                            </div>
                            <div className={styles.infoParcerias}>
                                <span className={styles.infoParceriasTitulo}>Parcerias</span>
                                <div className={styles.infos}>
                                    <span className={styles.informacao}>Email: parcerias@urbanestetica.com</span>
                                    <span className={styles.informacao}>Obrigado pela preferência!</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.map}>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2693.6267260148106!2d-50.52792255807266!3d-21.93769244259237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9495b7e39ba13817%3A0xf46b63b9addcc184!2sEscola%20T%C3%A9cnica%20Estadual%20Professor%20Massuyuki%20Kawano%20-%20Tup%C3%A3!5e0!3m2!1spt-BR!2sbr!4v1725489101938!5m2!1spt-BR!2sbr" className={styles.maps}></iframe>
                        <div className={styles.address}>
                            <Link href="https://maps.app.goo.gl/i3uxbgFqejEes5Vs5" target='_blank' className={styles.linkAddress}>
                                R Bezerra de Menezes, 215<br /> Tupã - SP
                            </Link>
                        </div>
                    </div>
                </div>
            </main >
            <Footer />
        </div >
    )
}