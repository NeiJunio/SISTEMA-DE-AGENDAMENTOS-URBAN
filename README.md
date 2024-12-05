# **URBAN - Estética Automotiva (Sistema de Agendamentos)**

![Capa do Projeto](frontend/public/pixelcut-export.jpeg)

## **Resumo**
O **URBAN Estética Automotiva** é um sistema web desenvolvido para otimizar o agendamento de serviços na empresa **Urban Estética Automotiva**, mas com a flexibilidade de ser adaptado para outras empresas do ramo de estética automotiva. O sistema proporciona uma experiência ágil e conveniente tanto para clientes quanto para administradores, automatizando o processo de agendamento e eliminando a necessidade de atendimentos manuais. Além de permitir a gestão de agendamentos, usuários, veículos e serviços, o sistema conta com um painel gerencial que facilita a administração. Durante o desenvolvimento, foram superados desafios como a implementação de validações de dados, responsividade e privacidade dos usuários, resultando em uma solução eficiente e adaptável às necessidades de empresas do setor.


## **Tecnologias Utilizadas**
### **Front-end**
- **Next.js:** Framework React avançado para construção de aplicações web com SSR (Server-Side Rendering) e SSG (Static Site Generation), garantindo alta performance e SEO otimizado.
- **React:** Biblioteca JavaScript para criação de interfaces de usuário dinâmicas e responsivas.
- **CSS3:** Estilização das páginas com design responsivo e interativo, garantindo uma experiência agradável em diversos dispositivos.

### **Back-end**
- **Node.js:** Ambiente de execução JavaScript no lado do servidor, garantindo escalabilidade e alta performance.
- **Express:** Framework minimalista para Node.js, utilizado para construção de APIs RESTful rápidas e organizadas.

### **Banco de Dados**
- **MySQL:** Banco de dados relacional utilizado para armazenar informações de usuários, veículos, agendamentos e serviços.  

### **Outras Ferramentas e Bibliotecas**
- **Git:** Controle de versão para rastreamento e gerenciamento do código.
- **Axios:** Biblioteca para fazer requisições HTTP de forma simplificada no front-end e no back-end.
- **FullCalendar:** Integração para exibição e gerenciamento de agendamentos de forma visual e intuitiva.
- **SweetAlert2:** Biblioteca para exibir mensagens de feedback aos usuários de forma elegante e personalizada.
- **React Responsive Carousel:** Biblioteca para implementação de carrosséis responsivos e interativos, facilitando a exibição de conteúdos como imagens e textos de forma dinâmica.


## **Funcionalidades**
### **Para Clientes**
1. **Agendamento de Serviços:**
   - Visualize os serviços disponíveis com horários e datas.
   - Selecione o horário desejado para agendamento.
2. **Gerenciamento de Perfil:**
   - Edite informações pessoais.
3. **Gerenciamento de Veículos:**
   - cadastro e controle de veículos pessoais.
4. **Visualização do Histórico:**
   - Acompanhe agendamentos já realizados.


### **Para Administradores**
1. **Gerenciamento de Agendamentos:**
   - Visualize e gerencie todos os agendamentos feitos pelos clientes.
   - Altere ou cancele agendamentos.
2. **Gestão de Serviços:**
   - Crie, edite ou remova serviços.
   - Organize serviços por categorias.
3. **Gestão de Usuários:**
   - Cadastre, edite ou remova usuários.
4. **Gestão de Veículos:**
   - Associe veículos aos usuários.
   - Crie, edite ou remova veículos.
5. **Autenticação:**
   - Controle de acesso baseado em permissões.


## **Instalação**
### 1. **Clonando o Repositório**
1. Clone este repositório:
    ```bash
    git clone <URL-DO-REPOSITÓRIO-COMBINADO>
    ```

### 2. **Configuração do Front-end**
1. Navegue para a pasta do front-end:
    ```bash
    cd front-nextjs
    ```
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

### 3. **Configuração do Back-end**
1. Navegue para a pasta do back-end:
    ```bash
    cd API-URBAN
    ```
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Configure o banco de dados:
   - Configure as credenciais de conexão com o MySQL no arquivo .env.
  
4. Inicie o servidor:
    ```bash
    npm start
    ```

## **Como Usar**
1. Acesse a interface web pelo navegador (URL local ou hospedada).
2. Faça login ou cadastre-se como cliente ou administrador.
3. Navegue pelas seções do sistema:
   - **Clientes:** Acompanhe e gerencie seus agendamentos.
   - **Administradores:** Gerencie usuários, veículos, serviços e agendamentos.


## **Contribuição**
Contribuições são bem-vindas! Para contribuir:  

1. Faça um fork do repositório.  
2. Crie uma branch com sua feature ou correção:  
   ```bash
   git checkout -b minha-feature
   ```
3. Envie as alterações:
    ```bash
    git commit -m "Descrição da alteração"
    git push origin minha-feature
    ```
4. Abra um Pull Request detalhando sua contribuição.


## **Licença**
Este projeto está licenciado sob a **Licença MIT**, uma licença permissiva que permite uso, modificação e distribuição do código, desde que a atribuição adequada seja fornecida.  

Para mais detalhes, consulte o arquivo [LICENSE](./LICENSE). 


## **Créditos**
Este projeto foi desenvolvido por um grupo de colaboradores. Gostaríamos de agradecer a todos que contribuíram para o desenvolvimento do sistema.

### **Integrantes do Grupo**
- **Nei Junio Nogueira Gomes** - Desenvolvimento Fullstack (Front-end & Back-end), Integração com Banco de Dados, Testes e Deploy ( [LinkedIn](https://www.linkedin.com/in/nei-junio-nogueira-gomes/) )
- **Matheus Mota Tonini** - Desenvolvimento Fullstack (Front-end & Back-end), API, Banco de Dados e Implementação ( [LinkedIn](https://www.linkedin.com/in/matheusmotatonini/) )
- **Gabriel Roberto Rodella de Assis** - Testes e Documentação ( [LinkedIn](https://www.linkedin.com/in/gabriel-assis22/) )
- **Weslley Katsube** - Testes e Documentação ( [LinkedIn](https://www.linkedin.com/in/weslley-katsube-a03344227/) )

