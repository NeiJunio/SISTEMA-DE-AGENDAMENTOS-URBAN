"use client"; // Indica que este componente será renderizado no lado do cliente.

import React, { useRef, useEffect, useState, Fragment } from 'react'; // Importação de hooks do React para gerenciamento de estado e referências.
import styles from './page.module.css'; // Importação do arquivo de estilos CSS específico para este componente.

import api from '@/services/api'; // Importação do serviço de API para realizar requisições.

import CalendarEventDetailsModal from '@/components/modalAgendamentos'; // Componente modal para detalhes dos eventos.

import { Calendar } from '@fullcalendar/core'; // Biblioteca para renderização do calendário.
import ptLocale from '@fullcalendar/core/locales/pt-br'; // Configuração de localidade para português.
import interactionPlugin from '@fullcalendar/interaction'; // Plugin para interação com o calendário.
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugin para exibição no formato de grade diária.
import timeGridPlugin from '@fullcalendar/timegrid'; // Plugin para exibição no formato de grade de tempo.

import { parseISO, format } from "date-fns"; // Bibliotecas para manipulação de datas.
import InputMask from "react-input-mask"; // Biblioteca para aplicar máscaras de entrada em campos de texto.
import Swal from 'sweetalert2'; // Biblioteca para exibição de alertas estilizados.

const FullCalendarGeral = () => {
    const calendarRef = useRef(null); // Referência para o componente de calendário.
    const [calendarApi, setCalendarApi] = useState(null); // Armazena a API do calendário.
    const [userId, setUserId] = useState(null); // Identifica o usuário logado.
    const [userAcesso, setUserAcesso] = useState(null); // Nível de acesso do usuário.
    const [events, setEvents] = useState([]); // Lista de eventos do calendário.
    const [showModal, setShowModal] = useState(false); // Controle de visibilidade do modal de detalhes.
    const [modalEvent, setModalEvent] = useState(null); // Dados do evento selecionado para o modal.
    const [veiculos, setVeiculos] = useState([]); // Lista de veículos do usuário.
    const [cpfUsuario, setCpfUsuario] = useState([]); // Armazena o CPF do usuário.
    const [agendamentosUsuario, setAgendamentoUsuario] = useState([]); // Lista de agendamentos do usuário.
    const [eventos, setEventos] = useState([]); // Lista de eventos para exibição no calendário.
    const [categoriaServicos, setCategoriaServicos] = useState([]); // Lista de categorias de serviços.
    const [servicos, setServicos] = useState([]); // Lista de serviços disponíveis.
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // Mês atual (baseado no sistema).
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Ano atual (baseado no sistema).
    const [formValues, setFormValues] = useState({
        veic_usu_id: '', // ID do veículo do usuário.
        agend_data: '', // Data do agendamento.
        agend_horario: '', // Horário do agendamento.
        agend_situacao: 1, // Situação inicial do agendamento.
        agend_observ: '', // Observações sobre o agendamento.
        serv_id: '', // ID do serviço selecionado.
        agend_serv_situ_id: 1 // Situação inicial do serviço.
    });

    useEffect(() => {
        // Verifica se o ID do usuário está definido para listar os veículos associados.
        if (userId) {
            ListarVeiculosUsuario();
        }
    }, [userId]); // Executa o efeito sempre que o userId mudar.

    useEffect(() => {
        // Recupera dados do usuário armazenados no localStorage ao carregar o componente.
        const storedData = localStorage.getItem('user');

        if (storedData) {
            const parsedUser = JSON.parse(storedData); // Converte os dados de JSON para um objeto.
            setUserAcesso(parsedUser?.acesso !== undefined ? parsedUser.acesso : null); // Define o acesso do usuário.
        }
    }, []); // Executa apenas uma vez ao montar o componente.

    useEffect(() => {
        // Verifica se o usuário tem acesso nível 0 para buscar seus dados do localStorage.
        if (userAcesso === 0) {
            const storedUser = localStorage.getItem('user'); // Recupera os dados do usuário armazenados no localStorage.
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser); // Converte os dados armazenados em JSON para objeto.
                setUserId(parsedUser?.id || null); // Define o ID do usuário ou null caso não exista.
            }
        }
    }, [userAcesso]); // Executa o efeito toda vez que o valor de userAcesso mudar.


    useEffect(() => {
        // Lista agendamentos do usuário e categorias de serviços ao alterar mês, ano, ou informações do usuário.
        ListarAgendamentosUsuario();
        ListarCategoriaServicos();
    }, [currentMonth, currentYear, userId, userAcesso]); // Dependências para atualizar os dados dinamicamente.


    useEffect(() => {
        // Verifica se o usuário tem acesso nível 0 para buscar seus dados do localStorage.
        if (userAcesso === 0) {
            const storedUser = localStorage.getItem('user'); // Recupera os dados do usuário armazenados no localStorage.
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser); // Converte os dados armazenados em JSON para objeto.
                setUserId(parsedUser?.id || null); // Define o ID do usuário ou null caso não exista.
            }
        }
    }, [userAcesso]); // Executa o efeito toda vez que o valor de userAcesso mudar.

    useEffect(() => {
        // Lista agendamentos do usuário e categorias de serviços ao alterar mês, ano, ou informações do usuário.
        ListarAgendamentosUsuario();
        ListarCategoriaServicos();
    }, [currentMonth, currentYear, userId, userAcesso]); // Dependências para atualizar os dados dinamicamente.

    useEffect(() => {
        if (currentMonth && currentYear) {
            // Define a data inicial para o calendário com base no mês e ano atuais.
            const initialDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;

            // Configurações do calendário FullCalendar.
            const calendar = new Calendar(calendarRef.current, {
                contentHeight: 600, // Altura do calendário.
                selectable: true, // Permite selecionar períodos no calendário.
                locale: ptLocale, // Define o idioma como português.
                aspectRatio: 2, // Proporção da largura para altura.
                showNonCurrentDates: false, // Oculta datas de meses diferentes no calendário.
                timeZone: 'local', // Define o fuso horário local.
                eventOverlap: false, // Impede que eventos se sobreponham.
                selectOverlap: false, // Impede que seleções se sobreponham.
                expandRows: true, // Expande as linhas do calendário para preencher o espaço.
                plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin], // Plugins utilizados.
                initialView: 'dayGridMonth', // Define a exibição inicial como grade mensal.
                headerToolbar: { // Configuração da barra de ferramentas do calendário.
                    left: 'dayGridMonth',
                    center: 'title',
                    right: 'today prev,next'
                },
                initialDate: initialDate, // Data inicial do calendário.
                events: eventos, // Lista de eventos a serem exibidos.
                datesSet: handleDatesSet, // Função chamada ao alterar as datas visíveis no calendário.
                dateClick: function (info) {
                    // Trata o clique em uma data específica.
                    const clickedDate = info.dateStr; // Data clicada no formato string.
                    if (info.view.type === "dayGridMonth") {
                        if (calendar) {
                            // Altera a visualização para o dia específico se estiver na grade mensal.
                            calendar.changeView('timeGridDay', clickedDate);
                        }
                    } else {
                        handleDateClick(info); // Função personalizada para lidar com o clique em datas.
                    }
                },
                eventClick: handleEventClick, // Função para tratar cliques em eventos.
                slotMinTime: '08:00:00', // Horário mínimo para exibição na grade de horários.
                slotMaxTime: '18:00:00', // Horário máximo para exibição na grade de horários.
                eventTimeFormat: { // Formato de exibição do horário dos eventos.
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false
                },
                allDaySlot: false, // Oculta o slot de eventos de dia inteiro.
            });

            calendar.render(); // Renderiza o calendário na tela.
            setCalendarApi(calendar); // Salva a instância do calendário na API para controle.
        } else {
            console.error("currentMonth ou currentYear não estão definidos corretamente"); // Exibe erro no console se os valores não estiverem corretos.
        }
    }, [eventos, currentMonth, currentYear]); // Dependências para recriar o calendário quando estas variáveis mudarem.

    const ListarAgendamentosUsuario = async () => {
        try {
            // Faz uma requisição para buscar os agendamentos do usuário com base no ID, acesso, mês e ano.
            const response = await api.get(`/agendamentos/usuarios/${userId}/${userAcesso}/${currentMonth}/${currentYear}}`);
            setAgendamentoUsuario(response.data.dadosTodos); // Atualiza a lista de agendamentos.
            setEventos(response.data.dadosTodos); // Atualiza os eventos do calendário.
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error); // Exibe erro no console se a requisição falhar.
        }
    };

    const handleDatesSet = (datesInfo) => {
        // Atualiza o mês e ano ao navegar no calendário.
        if (datesInfo.start) {
            const startDate = datesInfo.start; // Data inicial do intervalo visível.
            const newMonth = startDate.getMonth() + 1; // Novo mês visível no calendário.
            const newYear = startDate.getFullYear(); // Novo ano visível no calendário.

            setCurrentMonth(newMonth); // Atualiza o estado do mês.
            setCurrentYear(newYear); // Atualiza o estado do ano.
        } else {
            console.error("Data de início não disponível!"); // Exibe erro no console se a data inicial for inválida.
        }
    };

    const BuscarUsuarioPorCpf = async () => {
        // Verifica se o CPF do usuário é válido antes de realizar a busca.
        if (!cpfUsuario || cpfUsuario.trim().length === 0) {
            Swal.fire({
                title: 'CPF inválido',
                text: 'Por favor, insira um CPF válido.',
                icon: 'error',
                confirmButtonColor: '#d33',
                iconColor: '#d33'
            });
            return;
        }
        try {
            // Faz uma requisição para buscar o usuário pelo CPF.
            const response = await api.post('/usuarios/cpf', { usu_cpf: cpfUsuario });

            if (response.data.dados) {
                setUserId(response.data.dados.usu_id); // Define o ID do usuário retornado pela API.
            } else {
                Swal.fire({
                    title: 'Usuário não encontrado',
                    text: 'Não foi possível encontrar um usuário com este CPF.',
                    icon: 'warning',
                    confirmButtonColor: '#ff9d00',
                    iconColor: '#ff9d00'
                });
            }
        } catch (error) {
            console.error("Erro ao buscar usuário:", error); // Exibe erro no console se a requisição falhar.
            Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro ao tentar buscar o usuário. Por favor, tente novamente.',
                icon: 'error',
                confirmButtonColor: '#d33',
                iconColor: '#d33'
            });
        }
    };

    const ListarVeiculosUsuario = async () => {
        if (!userId) return; // Verifica se o ID do usuário está definido, caso contrário, interrompe a execução.

        try {
            const response = await api.get(`/veiculoUsuario/usuario/${userId}`); // Faz uma requisição à API para buscar os veículos do usuário.
            setVeiculos(response.data.dados || []); // Atualiza o estado com os veículos retornados, ou com um array vazio caso não haja dados.
        } catch (error) {
            console.error("Erro ao buscar veículos:", error); // Loga o erro no console para depuração.
        }
    };

    const listarServicosPorCategoria = async (cat_serv_id) => {
        try {
            const response = await api.get(`/servicos/categoria/${cat_serv_id}`); // Faz uma requisição à API para buscar serviços de uma categoria específica.
            setServicos(response.data.dados); // Atualiza o estado com a lista de serviços retornada.
        } catch (error) {
            console.error("Erro ao buscar os serviços:", error); // Loga o erro no console para depuração.
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível buscar os serviços.', // Mensagem de erro para o usuário.
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    const ListarCategoriaServicos = async () => {
        try {
            const response = await api.get('/categoriasServicosAtivas'); // Faz uma requisição à API para buscar categorias de serviços ativas.
            setCategoriaServicos(response.data.dados); // Atualiza o estado com as categorias retornadas.
        } catch (error) {
            console.error("Erro ao buscar as categorias:", error); // Loga o erro no console para depuração.
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível buscar as categorias.', // Mensagem de erro para o usuário.
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    const handleDateClick = (info) => {
        if (info?.dateStr) { // Verifica se a data do evento é válida.
            const formattedDate = format(parseISO(info.dateStr), 'yyyy-MM-dd'); // Formata a data para o padrão 'aaaa-MM-dd'.
            const formattedTime = format(info.date, 'HH:mm'); // Extrai e formata o horário para o padrão 'HH:mm'.

            setFormValues({
                ...formValues, // Mantém os valores anteriores do formulário.
                agend_data: formattedDate, // Define a data formatada.
                agend_horario: formattedTime // Define o horário formatado.
            });
            setShowModal(true); // Abre o modal para agendamento.
        } else {
            console.error("Data inválida no evento."); // Loga um erro caso a data seja inválida.
        }
    };

    const handleEventClick = (info) => {
        const isOwner = parseInt(info.event.extendedProps.userId) === parseInt(userId); // Verifica se o usuário logado é o proprietário do evento.

        if (userAcesso === 1 || isOwner) { // Permite visualizar o evento se o usuário for administrador ou proprietário.
            setModalEvent(info.event); // Define o evento atual no estado do modal.
            setShowModal(true); // Exibe o modal de detalhes.
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Acesso restrito',
                text: 'Você não tem permissão para visualizar os detalhes deste agendamento.', // Mensagem de acesso restrito para o usuário.
                iconColor: '#ff9d00',
                confirmButtonColor: '#ff9d00',
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target; // Extrai o nome e o valor do campo alterado.

        if (name === "cat_serv_id" || name === "serv_id" || name === "veic_usu_id") { // Verifica se o campo alterado está relacionado a ID de categorias, serviços ou veículos.
            const parsedValue = parseInt(value, 10); // Converte o valor para número inteiro.
            setFormValues((prevValues) => ({
                ...prevValues, // Mantém os valores anteriores do formulário.
                [name]: parsedValue // Atualiza o campo específico.
            }));

            if (name === "cat_serv_id") { // Caso seja a categoria, carrega os serviços associados.
                listarServicosPorCategoria(parsedValue); // Chama a função para listar serviços da categoria selecionada.
            }
        } else {
            setFormValues({
                ...formValues, // Mantém os valores anteriores do formulário.
                [name]: value // Atualiza o campo específico.
            });
        }
    };

    const handleInputCpf = (e) => {
        setCpfUsuario(e.target.value); // Atualiza o estado com o CPF digitado pelo usuário.
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário de recarregar a página.

        // Remove a categoria de serviço dos dados a serem enviados, pois não é necessário para a requisição.
        const { cat_serv_id, ...dataToSend } = formValues;
        const horario = formValues.agend_horario;

        // Converte o horário do formulário em horas e minutos.
        const [hour, minute] = horario.split(":").map(Number);

        // Valida se o horário está dentro do intervalo permitido (08:00 a 17:00).
        if (hour < 8 || (hour === 17 && minute > 0) || hour > 17) {
            Swal.fire({
                icon: 'error',
                title: 'Horário inválido!', // Exibe mensagem de erro em caso de horário fora do intervalo.
                text: 'Por favor, selecione um horário entre 08:00 e 17:00.',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
            return; // Interrompe a execução se o horário for inválido.
        }

        // Configura um novo evento a ser adicionado ao calendário.
        const newEvent = {
            id: String(events.length + 1), // Gera um ID baseado na quantidade de eventos existentes.
            title: `Veículo: ${dataToSend.veic_usu_id}`, // Define o título do evento com o ID do veículo.
            start: `${dataToSend.agend_data}T${dataToSend.agend_horario}`, // Combina a data e o horário.
            allDay: false, // Define que o evento não ocupa o dia inteiro.
            backgroundColor: '#FF9D00', // Cor de fundo do evento.
            textColor: '#000' // Cor do texto do evento.
        };

        try {
            // Envia os dados do agendamento para a API.
            await api.post('/agendamentos', dataToSend);

            // Atualiza a lista de eventos no estado com o novo evento.
            setEvents([...events, newEvent]);

            clearFields(); // Limpa os campos do formulário.
            setShowModal(false); // Fecha o modal.

            // Exibe uma mensagem de sucesso ao usuário.
            Swal.fire({
                icon: 'success',
                title: 'Agendamento realizado com sucesso!',
                text: 'O agendamento foi salvo com sucesso',
                iconColor: "rgb(40, 167, 69)",
                confirmButtonColor: "rgb(40, 167, 69)",
            });

        } catch (error) {
            // Verifica se houve um erro específico relacionado à indisponibilidade de horário.
            if (error.response && error.response.status === 400 && error.response.data.mensagem === 'Horário indisponível ou data inválida.') {
                clearFields(); // Limpa os campos do formulário.

                Swal.fire({
                    icon: 'warning',
                    title: 'Horário indisponível', // Exibe uma mensagem de aviso sobre o horário.
                    text: 'O horário selecionado não está disponível para o serviço escolhido. Por favor, selecione outro horário.',
                    iconColor: '#ff9d00',
                    confirmButtonColor: '#ff9d00',
                }).then((result) => {
                    if (result.isConfirmed) {
                        setShowModal(false); // Fecha o modal caso o usuário confirme.
                    }
                });
            } else {
                // Exibe uma mensagem genérica de erro se o problema não for específico.
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao salvar agendamento!',
                    text: 'Ocorreu um erro ao tentar salvar o agendamento. Por favor, tente novamente.',
                    iconColor: '#d33',
                    confirmButtonColor: '#d33',
                });
            }
        }

        ListarAgendamentosUsuario(); // Atualiza a lista de agendamentos do usuário após a submissão.
    };

    const handleCancel = () => {
        // Exibe um modal de confirmação antes de cancelar o agendamento.
        Swal.fire({
            title: "Deseja Cancelar esse agendamento?",
            text: "As informações não serão salvas", // Alerta que os dados serão descartados.
            icon: "warning",
            iconColor: "orange",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "rgb(40, 167, 69)",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Confirmar",
            reverseButtons: true,
            backdrop: "rgba(0,0,0,0.7)", // Fundo escurecido para destaque do modal.
        }).then((result) => {
            if (result.isConfirmed) {
                // Confirmação do cancelamento com uma mensagem de sucesso.
                Swal.fire({
                    title: "Cancelado!",
                    text: "As alterações foram canceladas.",
                    icon: "success",
                    iconColor: "rgb(40, 167, 69)",
                    confirmButtonColor: "rgb(40, 167, 69)",
                }).then(() => {
                    clearFields(); // Limpa os campos do formulário.
                    setShowModal(false); // Fecha o modal.
                });
            }
        });
    };

    const clearFields = () => {
        // Reseta os valores do formulário para seus estados iniciais.
        setFormValues({
            veic_usu_id: '',
            agend_data: '',
            agend_horario: '',
            agend_situacao: 1,
            agend_observ: '',
            serv_id: '',
            agend_serv_situ_id: 1
        });
    };

    const visualizacao = () => {
        setShowModal(false); // Fecha o modal de visualização.
        ListarAgendamentosUsuario(); // Atualiza a lista de agendamentos após uma visualização.
    };

    return (
        <div>
            <div ref={calendarRef} className={styles.calendar}></div>
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        {modalEvent ? (
                            <>
                                <CalendarEventDetailsModal
                                    veiculos={veiculos}
                                    modalEvent={modalEvent}
                                    onClose={visualizacao}
                                    isEditable={parseInt(modalEvent.extendedProps.userId) === parseInt(userId)}
                                    isAdmin={userAcesso === 1 ? 1 : ''}
                                />
                            </>
                        ) : (
                            <>
                                <h2 className={styles.title_page}>Novo Agendamento</h2>

                                <form onSubmit={handleSubmit} className={styles.form}>

                                    {userAcesso == 1 ? (
                                        <>
                                            <div className={`${styles.grid} ${styles.grid_cpf}`}>
                                                <label className={styles.label}>CPF do cliente</label>
                                                <InputMask
                                                    mask="999.999.999-99"
                                                    type="text"
                                                    name="usu_cpf"
                                                    value={cpfUsuario}
                                                    onChange={handleInputCpf}
                                                    className={`${styles.input} ${styles.input_cpf}`}
                                                    required
                                                />
                                            </div>

                                            <div className={`${styles.grid} ${styles.grid_buttonSearch}`}>
                                                <label className={styles.labelButtonSearch}>Pesquisar CPF</label>
                                                <button
                                                    type="button"
                                                    onClick={BuscarUsuarioPorCpf}
                                                    className={styles.buttonSearch}
                                                >
                                                    Buscar
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                        </>
                                    )}

                                    <div className={`${styles.grid} ${styles.grid_veiculo}`}>
                                        <label className={styles.label}>Veículo</label>

                                        <select
                                            name="veic_usu_id"
                                            value={formValues.veic_usu_id}
                                            onChange={handleInputChange}
                                            className={styles.select}
                                            disabled={!userId}
                                            required
                                        >
                                            <option value="" hidden>Selecione o veículo</option>
                                            {veiculos.length > 0 ? (
                                                veiculos.map((veiculo) => (
                                                    <option key={veiculo.veic_usu_id} value={veiculo.veic_usu_id}>
                                                        {veiculo.veic_placa}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Nenhum veículo disponível</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className={`${styles.grid} ${styles.grid_data}`}>
                                        <label className={styles.label}>Data do Agendamento</label>
                                        <input
                                            type="date"
                                            name="agend_data"
                                            value={formValues.agend_data}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>

                                    <div className={`${styles.grid} ${styles.grid_horario}`}>
                                        <label className={styles.label}>Horário</label>
                                        <input
                                            type="time"
                                            name="agend_horario"
                                            min="08:00"
                                            max="17:00"
                                            value={formValues.agend_horario}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>

                                    <div className={`${styles.grid} ${styles.grid_cat_serv}`}>
                                        <label className={styles.label}>Categoria de serviço</label>
                                        <select
                                            name="cat_serv_id"
                                            value={formValues.cat_serv_id}
                                            onChange={handleInputChange}
                                            className={styles.select}
                                            required
                                        >
                                            <option value="">Selecione</option>
                                            {categoriaServicos.length > 0 ? (
                                                categoriaServicos.map((cat_serv) => (
                                                    <option key={cat_serv.cat_serv_id} value={cat_serv.cat_serv_id}>
                                                        {cat_serv.cat_serv_nome}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Nenhuma categoria disponível</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className={`${styles.grid} ${styles.grid_serv}`}>
                                        <label className={styles.label}>Serviço</label>
                                        <select
                                            name="serv_id"
                                            value={formValues.serv_id || ''}
                                            onChange={handleInputChange}
                                            disabled={!formValues.cat_serv_id}
                                            className={styles.select}
                                            required
                                        >
                                            <option value="">Selecione o serviço</option>
                                            {servicos.length > 0 ? (
                                                servicos.map((servico) => (
                                                    <option key={servico.serv_id} value={servico.serv_id}>
                                                        {servico.serv_nome}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Nenhum serviço disponível</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className={`${styles.grid} ${styles.grid_observ}`}>
                                        <label className={styles.label}>Observações</label>
                                        <input
                                            name="agend_observ"
                                            value={formValues.agend_observ}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={`${styles.buttons_form} ${styles.grid} ${styles.grid_footer}`}>
                                        <button type="submit" className={styles.button_submit}>Salvar</button>
                                        <button type="button" className={styles.button_cancel} onClick={handleCancel}>Cancelar</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FullCalendarGeral;