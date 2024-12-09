import Link from 'next/link' // Importa o componente Link do Next.js para navegação entre páginas.
import styles from './index.module.css' // Importa o arquivo de estilos CSS para aplicar ao footer.

export default function Footer() {
    return (
        // Elemento principal do footer, com a classe de estilo "footer"
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>

                {/* Container que agrupa os ícones sociais e o logotipo */}
                <div className={styles.footerIcons}>
                    <span className={styles.footerLogo}></span> {/* Logo da empresa, sem texto */}

                    {/* Grupo de ícones sociais, com links para redes sociais */}
                    <div className={styles.footerSocialIcons}>
                        {/* Link para o Instagram */}
                        <Link href={'https://instagram.com'}>
                            <span className={styles.iconInstagram}></span> {/* Ícone do Instagram */}
                        </Link>
                        {/* Link para o WhatsApp */}
                        <Link href={'https://whatsapp.com'}>
                            <span className={styles.iconWhatsapp}></span> {/* Ícone do WhatsApp */}
                        </Link>
                        {/* Link para o Facebook */}
                        <Link href={'https://facebook.com'}>
                            <span className={styles.iconFacebook}></span> {/* Ícone do Facebook */}
                        </Link>
                        {/* Link para o YouTube */}
                        <Link href={'https://youtube.com'}>
                            <span className={styles.iconYoutube}></span> {/* Ícone do YouTube */}
                        </Link>
                    </div>
                </div>

                {/* Seção que contém informações de contato, como telefone e endereço */}
                <div className={styles.footerAddress}>

                    {/* Informações de telefone */}
                    <div className={styles.phone}>
                        <span className={styles.iconPhone}></span> {/* Ícone de telefone */}
                        <div className={styles.infoPhone}>
                            <div className={styles.titlePhone}>Telefone</div> {/* Título da seção */}
                            {/* Link para fazer uma chamada diretamente */}
                            <Link href='tel:(14) 99675 - 6789' className={styles.numberPhone}>(14) 99675 - 6789</Link>
                        </div>
                    </div>

                    {/* Informações de telefone fixo */}
                    <div className={styles.tell}>
                        <span className={styles.iconTell}></span> {/* Ícone de telefone fixo */}
                        <div className={styles.infoTell}>
                            <div className={styles.titleTell}>Telefone</div> {/* Título da seção */}
                            {/* Link para fazer uma chamada diretamente */}
                            <Link href='tel: (14) 3404 - 4014' className={styles.numberTell}>(14) 3404 - 4014</Link>
                        </div>
                    </div>

                    {/* Informações de e-mail */}
                    <div className={styles.email}>
                        <span className={styles.iconEmail}></span> {/* Ícone de e-mail */}
                        <div className={styles.infoEmail}>
                            <div className={styles.titleEmail}>Email</div> {/* Título da seção */}
                            {/* Link para enviar um e-mail */}
                            <Link href='mailto: atendimento@urbanestetica.com' className={styles.addressEmail}>atendimento@urbanestetica.com</Link>
                        </div>
                    </div>

                    {/* Informações de endereço */}
                    <div className={styles.address}>
                        <span className={styles.iconAddress}></span> {/* Ícone de endereço */}
                        <div className={styles.infoAddress}>
                            <div className={styles.titleAddress}>Endereço</div> {/* Título da seção */}
                            {/* Endereço da empresa */}
                            <div className={styles.localizationEmail}>R Bezerra de Menezes, 215, Tupã</div>
                        </div>
                    </div>
                </div>

                {/* Seção de informações de contato para visualização em dispositivos móveis */}
                <div className={styles.footerAddressMobile}>

                    {/* Informações de telefone para dispositivos móveis */}
                    <div className={styles.phoneMobile}>
                        <span className={styles.iconPhoneMobile}></span> {/* Ícone de telefone móvel */}
                        <div className={styles.infoPhoneMobile}>
                            <div className={styles.titlePhoneMobile}>Telefone</div> {/* Título da seção */}
                            {/* Link para fazer uma chamada diretamente para ambos os números */}
                            <Link href='tel:(14) 99675 - 6789' className={styles.numberPhoneMobile}>(14) 99675 - 6789 / (14) 3404 - 4014</Link>
                        </div>
                    </div>

                    {/* Informações de e-mail para dispositivos móveis */}
                    <div className={styles.emailMobile}>
                        <span className={styles.iconEmailMobile}></span> {/* Ícone de e-mail para mobile */}
                        <div className={styles.infoEmailMobile}>
                            <div className={styles.titleEmailMobile}>Email</div> {/* Título da seção */}
                            {/* Link para enviar um e-mail */}
                            <Link href='mailto: atendimento@urbanestetica.com' className={styles.addressEmailMobile}>atendimento@urbanestetica.com.com</Link>
                        </div>
                    </div>

                    {/* Informações de endereço para dispositivos móveis */}
                    <div className={styles.addressMobile}>
                        <span className={styles.iconAddressMobile}></span> {/* Ícone de endereço móvel */}
                        <div className={styles.infoAddressMobile}>
                            <div className={styles.titleAddressMobile}>Endereço</div> {/* Título da seção */}
                            {/* Endereço da empresa exibido para dispositivos móveis */}
                            <div className={styles.localizationEmailMobile}>R Bezerra de Menezes, 215, Tupã</div>
                        </div>
                    </div>
                </div>

                {/* Seção de licenciamento e direitos autorais */}
                <div className={styles.footerLicense}>
                    <span className={styles.copyright}>Urban © 2024 - Todos os direitos reservados</span> {/* Texto de copyright */}
                    {/* Link para a página de termos e políticas da empresa */}
                    <Link href="/telas/termos" target="_blank" className={styles.footerTerms}>Termos & Políticas</Link>
                </div>
            </div>
        </footer>
    )
}