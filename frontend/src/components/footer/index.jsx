import Link from 'next/link'
import styles from './index.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerIcons}>
                    <span className={styles.footerLogo}></span>
                    <div className={styles.footerSocialIcons}>
                        <Link href={'https://instagram.com'}>
                            <span className={styles.iconInstagram}></span>
                        </Link>
                        <Link href={'https://whatsapp.com'}>
                            <span className={styles.iconWhatsapp}></span>
                        </Link>
                        <Link href={'https://facebook.com'}>
                            <span className={styles.iconFacebook}></span>
                        </Link>
                        <Link href={'https://youtube.com'}>
                            <span className={styles.iconYoutube}></span>
                        </Link>
                    </div>
                </div>
                <div className={styles.footerAddress}>
                    <div className={styles.phone}>
                        <span className={styles.iconPhone}></span>
                        <div className={styles.infoPhone}>
                            <div className={styles.titlePhone}>Telefone</div>
                            <Link href='tel:(14) 99675 - 6789' className={styles.numberPhone}>(14) 99675 - 6789</Link>
                        </div>
                    </div>

                    <div className={styles.tell}>
                        <span className={styles.iconTell}></span>
                        <div className={styles.infoTell}>
                            <div className={styles.titleTell}>Telefone</div>
                            <Link href='tel: (14) 3404 - 4014' className={styles.numberTell}>(14) 3404 - 4014</Link>
                        </div>
                    </div>

                    <div className={styles.email}>
                        <span className={styles.iconEmail}></span>
                        <div className={styles.infoEmail}>
                            <div className={styles.titleEmail}>Email</div>
                            <Link href='mailto: atendimento@urbanestetica.com' className={styles.addressEmail}>atendimento@urbanestetica.com</Link>
                        </div>
                    </div>

                    <div className={styles.address}>
                        <span className={styles.iconAddress}></span>
                        <div className={styles.infoAddress}>
                            <div className={styles.titleAddress}>Endereço</div>
                            <div className={styles.localizationEmail}>R Bezerra de Menezes, 215, Tupã</div>
                        </div>
                    </div>
                </div>

                <div className={styles.footerAddressMobile}>
                    <div className={styles.phoneMobile}>
                        <span className={styles.iconPhoneMobile}></span>
                        <div className={styles.infoPhoneMobile}>
                            <div className={styles.titlePhoneMobile}>Telefone</div>
                            <Link href='tel:(14) 99675 - 6789' className={styles.numberPhoneMobile}>(14) 99675 - 6789 / (14) 3404 - 4014</Link>
                        </div>
                    </div>

                    <div className={styles.emailMobile}>
                        <span className={styles.iconEmailMobile}></span>
                        <div className={styles.infoEmailMobile}>
                            <div className={styles.titleEmailMobile}>Email</div>
                            <Link href='mailto: atendimento@urbanestetica.com' className={styles.addressEmailMobile}>atendimento@urbanestetica.com.com</Link>
                        </div>
                    </div>

                    <div className={styles.addressMobile}>
                        <span className={styles.iconAddressMobile}></span>
                        <div className={styles.infoAddressMobile}>
                            <div className={styles.titleAddressMobile}>Endereço</div>
                            <div className={styles.localizationEmailMobile}>R Bezerra de Menezes, 215, Tupã</div>
                        </div>
                    </div>
                </div>

                <div className={styles.footerLicense}>
                    <span className={styles.copyright}>Urban © 2024 - Todos os direitos reservados</span>
                    <Link href="/telas/termos" target="_blank" className={styles.footerTerms}>Termos & Políticas</Link>
                </div>
            </div>
        </footer >
    )
}