import { useState, useEffect } from 'react';
import styles from './page.module.css';

import api from '@/services/api';

import FormAgendamentosAdmin from '@/components/FormAgendamentosAdmin';

import { PiListMagnifyingGlassBold } from "react-icons/pi";
import { MdRemoveRedEye, MdEdit } from "react-icons/md";
import { parseISO, format } from 'date-fns';
import { IoMdTrash } from "react-icons/io";
import Swal from 'sweetalert2';


export default function HistoricoAgendamentos() {
    // Estados para armazenar agendamentos e informações relacionadas
    const [agendamentos, setAgendamentos] = useState([]); // Lista completa de agendamentos
    const [filteredAgendamentos, setFilteredAgendamentos] = useState([]); // Agendamentos filtrados
    const [searchText, setSearchText] = useState(''); // Texto da barra de busca
    const [startDate, setStartDate] = useState(''); // Data inicial para filtro
    const [endDate, setEndDate] = useState(''); // Data final para filtro
    const [statusFilter, setStatusFilter] = useState('todos'); // Filtro de status
    const [currentPage, setCurrentPage] = useState(1); // Página atual na paginação
    const [sortedColumn, setSortedColumn] = useState(null); // Coluna sendo ordenada
    const [isAsc, setIsAsc] = useState(true); // Direção da ordenação (ascendente ou descendente)
    const [situacaoDoAgendamento, setSituacaoDoAgendamento] = useState([]); // Lista de situações dos agendamentos
    const [userAcesso, setUserAcesso] = useState(null); // Tipo de acesso do usuário
    const agendamentosPerPage = 15; // Quantidade de agendamentos por página

    const [showForm, setShowForm] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [selectedAgend, setSelectedAgend] = useState({
        agend_data: '',
        agend_horario: '',
        agend_id: '',
        agend_observ: '',
        agend_serv_situ_id: '',
        serv_nome: '',
        usu_id: '',
        usu_nome: '',
        veic_ano: '',
        veic_cor: '',
        veic_placa: '',
        veic_usu_id: '',
        cat_serv_id: '',
        cat_serv_nome: '',
        mod_nome: '',
        mar_nome: ''
    });

    const agendSituacaoMap = {
        1: 'Pendente',
        2: 'Em andamento',
        3: 'Concluído',
        4: "Cancelado"
    };

    const colorMap = {
        1: '#e69500f3',  // Pendente - Dourado
        2: '#1b77d4',  // Em andamento - Azul
        3: '#26a426',  // Concluído - Verde
        4: '#c3290e'   // Cancelado - Vermelho
    };

    useEffect(() => {
        // Recupera os dados do usuário armazenados no localStorage
        const storedData = localStorage.getItem('user');

        if (storedData) {
            // Se houver dados armazenados, faz o parsing do JSON e define o acesso do usuário
            const parsedUser = JSON.parse(storedData);
            setUserAcesso(parsedUser?.acesso !== undefined ? parsedUser.acesso : null);
        }
    }, []); // Executa apenas uma vez ao montar o componente

    useEffect(() => {
        // Lista os agendamentos e a situação dos agendamentos ao montar o componente
        ListarAgendamentos();
        ListarSituacaoDoAgendamento();
    }, []); // Executa apenas uma vez ao montar o componente


    const handleSubmit = async (agendamentos) => {
        // Prepara os dados para envio, baseando-se nos valores selecionados
        const dados = {
            veic_usu_id: selectedAgend.veic_usu_id,
            agend_data: selectedAgend.agend_data,
            agend_horario: selectedAgend.agend_horario,
            serv_id: selectedAgend.serv_id,
            agend_serv_situ_id: selectedAgend.agend_serv_situ_id,
            agend_observ: selectedAgend.agend_observ,
            agend_id: selectedAgend.agend_id,
        };

        try {
            let response;

            if (isEditing) {
                // Se estiver editando, realiza uma requisição PATCH para atualizar os dados
                response = await api.patch(`/agendamentos/${agendamentos.agend_id}`, dados);
            }

            // Exibe uma mensagem de sucesso
            Swal.fire({
                title: 'Sucesso!',
                text: response.data.mensagem,
                icon: 'success',
                iconColor: "rgb(40, 167, 69)",
                confirmButtonColor: "rgb(40, 167, 69)",
            });

            // Reseta os estados do formulário
            setShowForm(false);
            setIsEditing(false);
            setIsViewing(false);

            // Atualiza a lista de agendamentos
            ListarAgendamentos();
        } catch (error) {
            // Exibe uma mensagem de erro em caso de falha
            console.error('Erro ao salvar o agendamento:', error);
            Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro ao salvar o agendamento. Tente novamente.',
                icon: 'error',
                iconColor: "rgb(255, 69, 58)",
                confirmButtonColor: "rgb(255, 69, 58)",
            });
        }
    };

    const handleEditAgend = (agendamentos) => {
        // Prepara o estado para edição de um agendamento específico
        setShowForm(true);
        setSelectedAgend(agendamentos);
        setIsViewing(false);
        setIsEditing(true);
    };

    const handleViewAgend = (agendamentos) => {
        // Prepara o estado para visualização de um agendamento específico
        setSelectedAgend(agendamentos);
        setShowForm(true);
        setIsViewing(true);
        setIsEditing(false);
    };

    const CancelarAgendamento = async (agendamentos) => {
        // Exibe um alerta de confirmação antes de cancelar o agendamento
        Swal.fire({
            title: "Tem certeza?",
            text: "Você deseja realmente excluir este agendamento? Esta ação não pode ser desfeita.",
            icon: "warning",
            iconColor: "#ff9d00",
            showCancelButton: true,
            confirmButtonColor: "rgb(40, 167, 69)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
            backdrop: "rgba(0,0,0,0.7)"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Define a situação de cancelamento e monta os dados para envio
                    const situacao = 0;
                    const servSituacaoId = 4;

                    const dados = {
                        agend_situacao: parseInt(situacao, 10),
                        agend_serv_situ_id: parseInt(servSituacaoId, 10)
                    };

                    // Envia a requisição para cancelar o agendamento
                    const response = await api.patch(`/agendamentos/cancelar/${agendamentos.agend_id}`, dados);

                    if (response.data.sucesso) {
                        // Exibe uma mensagem de sucesso se o cancelamento foi concluído
                        Swal.fire({
                            title: 'Sucesso!',
                            text: 'Agendamento excluído com sucesso.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            iconColor: "rgb(40, 167, 69)",
                            confirmButtonColor: "rgb(40, 167, 69)",
                        });

                        // Atualiza a lista de agendamentos
                        ListarAgendamentos();
                    } else {
                        // Exibe uma mensagem de erro personalizada
                        Swal.fire({
                            title: 'Erro!',
                            text: response.data.mensagem || 'Ocorreu um erro ao excluir o agendamento.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            iconColor: '#d33',
                            confirmButtonColor: '#d33',
                        });
                    }
                } catch (error) {
                    // Exibe uma mensagem de erro genérica em caso de falha
                    Swal.fire({
                        title: 'Erro!',
                        text: `Erro na exclusão do agendamento: ${error.message}`,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        iconColor: '#d33',
                        confirmButtonColor: '#d33',
                    });
                }
            }
        });
    };

    const Cancelar = () => {
        // Exibe um alerta de confirmação para cancelar as alterações
        Swal.fire({
            title: "Deseja Cancelar?", // Título do alerta
            text: "As informações não serão salvas", // Mensagem informativa
            icon: "warning", // Ícone de alerta
            iconColor: "orange", // Cor do ícone
            showCancelButton: true, // Exibe o botão de cancelamento
            cancelButtonColor: "#d33", // Cor do botão de cancelar
            confirmButtonColor: "rgb(40, 167, 69)", // Cor do botão de confirmação
            cancelButtonText: "Cancelar", // Texto do botão de cancelar
            confirmButtonText: "Confirmar", // Texto do botão de confirmação
            reverseButtons: true, // Inverte a ordem dos botões
            backdrop: "rgba(0,0,0,0.7)", // Fundo semitransparente
        }).then((result) => {
            // Verifica se o botão de confirmação foi clicado
            if (result.isConfirmed) {
                // Exibe uma mensagem de sucesso ao cancelar as alterações
                Swal.fire({
                    title: "Cancelado!", // Título da mensagem
                    text: "As alterações foram canceladas.", // Mensagem informativa
                    icon: "success", // Ícone de sucesso
                    iconColor: "rgb(40, 167, 69)", // Cor do ícone
                    confirmButtonColor: "rgb(40, 167, 69)", // Cor do botão de confirmação
                }).then(() => {
                    // Reseta os estados ao cancelar
                    setShowForm(false); // Esconde o formulário
                    setSelectedAgend({ // Limpa os dados do agendamento
                        agend_data: '',
                        agend_horario: '',
                        agend_id: '',
                        agend_observ: '',
                        agend_serv_situ_id: '',
                        serv_nome: '',
                        usu_id: '',
                        usu_nome: '',
                        veic_ano: '',
                        veic_cor: '',
                        veic_placa: '',
                        veic_usu_id: '',
                        cat_serv_id: '',
                        cat_serv_nome: ''
                    });
                    setIsViewing(false); // Reseta o estado de visualização
                    setIsEditing(false); // Reseta o estado de edição
                });
            }
        });
    };

    const handleExit = () => {
        // Função para fechar o formulário e resetar os estados
        setShowForm(false); // Esconde o formulário
        setSelectedAgend({ // Limpa os dados do agendamento
            agend_data: '',
            agend_horario: '',
            agend_id: '',
            agend_observ: '',
            agend_serv_situ_id: '',
            serv_nome: '',
            usu_id: '',
            usu_nome: '',
            veic_ano: '',
            veic_cor: '',
            veic_placa: '',
            veic_usu_id: '',
            cat_serv_id: '',
            cat_serv_nome: ''
        });
        setIsViewing(false); // Reseta o estado de visualização
        setIsEditing(false); // Reseta o estado de edição
    };

    const ListarAgendamentos = async () => {
        try {
            // Requisição para buscar os agendamentos
            const response = await api.get('/agendamentos');

            // Ordena os agendamentos por data e horário em ordem decrescente
            const agendamentosOrdenados = response.data.dados.sort((a, b) => {
                const dateTimeA = new Date(`${a.agend_data}T${a.agend_horario}`);
                const dateTimeB = new Date(`${b.agend_data}T${b.agend_horario}`);
                return dateTimeB - dateTimeA;
            });

            setAgendamentos(agendamentosOrdenados); // Atualiza os agendamentos
            setFilteredAgendamentos(agendamentosOrdenados); // Atualiza os agendamentos filtrados
        } catch (error) {
            // Exibe um alerta caso ocorra erro na requisição
            console.error("Erro ao buscar os agendamentos:", error);
            Swal.fire({
                title: "Erro!", // Título do alerta
                text: "Não foi possível carregar os agendamentos.", // Mensagem de erro
                icon: "error", // Ícone de erro
                iconColor: '#d33', // Cor do ícone
                confirmButtonColor: '#d33', // Cor do botão de confirmação
            });
        }
    };

    const ListarSituacaoDoAgendamento = async () => {
        try {
            // Requisição para buscar as situações de agendamento
            const responde = await api.get('/agendaServicosSituacao');
            setSituacaoDoAgendamento(responde.data.dados); // Atualiza as situações
        } catch (error) {
            // Exibe um alerta caso ocorra erro na requisição
            console.error("Erro ao buscar os situações dos agendamentos:", error);
            Swal.fire({
                title: "Erro!", // Título do alerta
                text: "Não foi possível carregar os agendamentos.", // Mensagem de erro
                icon: "error", // Ícone de erro
                iconColor: '#d33', // Cor do ícone
                confirmButtonColor: '#d33', // Cor do botão de confirmação
            });
        }
    };

    // Atualiza os filtros com base no texto digitado
    const handleSearch = (text) => {
        setSearchText(text); // Atualiza o texto de busca
        const lowerText = text.toLowerCase(); // Normaliza o texto para comparação
    
        const filtered = agendamentos.filter((agendamento) => {
            const clienteMatch = agendamento.usu_nome.toLowerCase().includes(lowerText); // Verifica correspondência no nome do cliente
            const servicoMatch = agendamento.serv_nome.toLowerCase().includes(lowerText); // Verifica correspondência no nome do serviço
            return clienteMatch || servicoMatch; // Retorna verdadeiro se qualquer uma das condições for verdadeira
        });
    
        setFilteredAgendamentos(filtered); // Atualiza os agendamentos filtrados
    };

    // Atualiza os filtros com base nas datas
    const handleDateChange = (start, end) => {
        setStartDate(start); // Atualiza a data inicial
        setEndDate(end); // Atualiza a data final
        applyFilters(searchText, start, end, statusFilter); // Aplica os filtros
    };

    // Atualiza os filtros com base no status selecionado
    const handleStatusFilterChange = (status) => {
        setStatusFilter(status); // Atualiza o status
        applyFilters(searchText, startDate, endDate, status); // Aplica os filtros
    };


    // Aplica os filtros nos agendamentos
    const applyFilters = (text, start, end, status) => {
        const result = agendamentos.filter((agendamento) => {
            // Verifica se o texto corresponde ao agendamento
            const matchesText = agendamento.agend_observ.toLowerCase().includes(text.toLowerCase()) ||
                agendamento.veic_placa.toLowerCase().includes(text.toLowerCase()) ||
                agendamento.agend_id.toString().includes(text);

            // Calcula as datas de início e fim do filtro
            const agendamentoData = new Date(agendamento.agend_data).setUTCHours(0, 0, 0, 0);
            const startDate = start ? new Date(start).setUTCHours(0, 0, 0, 0) : null;
            const endDate = end ? new Date(end).setUTCHours(23, 59, 59, 999) : null;

            // Verifica se as datas correspondem ao filtro
            const matchesDate = (!startDate || agendamentoData >= startDate) &&
                (!endDate || agendamentoData <= endDate);

            // Verifica se o status corresponde ao filtro
            const matchesStatus = status === 'todos' || agendamento.agend_serv_situ_id === parseInt(status);

            return matchesText && matchesDate && matchesStatus; // Retorna o resultado final do filtro
        });
        setFilteredAgendamentos(result); // Atualiza os agendamentos filtrados
        setCurrentPage(1); // Reseta a página atual
    };

    // Ordena os agendamentos por coluna
    const sortByColumn = (column) => {
        let newIsAsc = true; // Define a direção de ordenação inicial
        if (sortedColumn === column) newIsAsc = !isAsc; // Inverte a direção se a coluna for a mesma

        const sortedData = [...filteredAgendamentos].sort((a, b) => {
            // Compara os valores da coluna para ordenação
            if (a[column] < b[column]) return newIsAsc ? -1 : 1;
            if (a[column] > b[column]) return newIsAsc ? 1 : -1;
            return 0;
        });

        setFilteredAgendamentos(sortedData); // Atualiza os agendamentos ordenados
        setSortedColumn(column); // Atualiza a coluna ordenada
        setIsAsc(newIsAsc); // Atualiza a direção de ordenação
    };

    // Determina os índices para a paginação
    const indexOfLastAgendamento = currentPage * agendamentosPerPage; // Índice do último agendamento na página atual
    const indexOfFirstAgendamento = indexOfLastAgendamento - agendamentosPerPage; // Índice do primeiro agendamento na página atual
    const currentAgendamentos = filteredAgendamentos.slice(indexOfFirstAgendamento, indexOfLastAgendamento); // Lista de agendamentos exibidos na página atual

    return (
        <div id="clientes" className={styles.content_section}>
            <h2 className={styles.title_page}>Gerenciamento de Agendamentos</h2>

            {!showForm ? (
                <>
                    <div className={styles.contentSearch}>
                        <div className={styles.search}>
                            <div className={styles.searchInput}>
                                <input
                                    type="text"
                                    placeholder="Digite aqui..."
                                    className={styles.inputSearch}
                                    value={searchText}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <PiListMagnifyingGlassBold className={styles.lupa} />
                            </div>
                        </div>

                        <div className={styles.filterButtons}>
                            <div className={styles.filterGroup}>
                                <label htmlFor="startDate" className={styles.labelFilter}>Data Início</label>
                                <input

                                    type="date"
                                    id="startDate"
                                    className={styles.filterSelect}
                                    value={startDate}
                                    onChange={(e) => handleDateChange(e.target.value, endDate)}
                                />
                            </div>

                            <div className={styles.filterGroup}>
                                <label htmlFor="endDate" className={styles.labelFilter}>Data Fim</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    className={styles.filterSelect}
                                    value={endDate}
                                    onChange={(e) => handleDateChange(startDate, e.target.value)}
                                />
                            </div>

                            <div className={styles.filterGroup}>
                                <label htmlFor="status" className={styles.labelFilter}>Situação</label>
                                <select
                                    id="status"
                                    className={styles.filterSelect}
                                    value={statusFilter}
                                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                                >
                                    <option value="todos">Todos</option>
                                    {situacaoDoAgendamento.map((agendSitu) => (
                                        <option key={agendSitu.agend_serv_situ_id} value={agendSitu.agend_serv_situ_id}>
                                            {agendSitu.agend_serv_situ_nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.resultTableContainer}>
                        <table className={styles.resultTable}>
                            <thead className={styles.tableHead}>
                                <tr>
                                    <th
                                        className={`${styles.tableHeader} ${styles.id}`}
                                        onClick={() => sortByColumn('agend_id')}>
                                        ID
                                        {sortedColumn === 'agend_id' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.placa}`}
                                        onClick={() => sortByColumn('veic_placa')}>
                                        Placa
                                        {sortedColumn === 'veic_placa' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.data}`}
                                        onClick={() => sortByColumn('agend_data')}>
                                        Data
                                        {sortedColumn === 'agend_data' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.horario}`}
                                        onClick={() => sortByColumn('agend_horario')}>
                                        Horário
                                        {sortedColumn === 'agend_horario' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.observ}`}
                                        onClick={() => sortByColumn('serv_nome')}>
                                        Serviço
                                        {sortedColumn === 'serv_nome' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.cliente}`}
                                        onClick={() => sortByColumn('usu_nome')}>
                                        Cliente
                                        {sortedColumn === 'usu_nome' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.situacao}`}>
                                        Situação
                                    </th>
                                    <th className={`${styles.tableHeader} ${styles.acao}`}>Ações</th>
                                </tr>
                            </thead>

                            <tbody className={styles.tableBody}>
                                {currentAgendamentos.length > 0 ? (
                                    currentAgendamentos.map((agendamento) => (
                                        <tr key={agendamento.agend_id} className={styles.tableRow}>
                                            <td className={styles.tdId}>{agendamento.agend_id}</td>
                                            <td>{agendamento.veic_placa}</td>
                                            <td>{format(parseISO(agendamento?.agend_data), 'dd/MM/yyyy')}</td>
                                            <td>{agendamento.agend_horario}</td>
                                            <td>{agendamento.serv_nome}</td>
                                            <td>{agendamento.usu_nome}</td>

                                            <td>
                                                <div
                                                    className={styles.corSituacao}
                                                    style={{ backgroundColor: colorMap[agendamento.agend_serv_situ_id] || '#ccc' }}
                                                >
                                                    {agendSituacaoMap[agendamento.agend_serv_situ_id] || 'Desconhecido'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.actionIcons}>
                                                    <i>
                                                        <MdRemoveRedEye
                                                            title="Visualizar"
                                                            onClick={() => handleViewAgend(agendamento)}
                                                        />
                                                    </i>
                                                    <i>
                                                        <MdEdit
                                                            title="Editar"
                                                            onClick={() => handleEditAgend(agendamento)}
                                                        />
                                                    </i>

                                                    <i>
                                                        <IoMdTrash
                                                            title='excluir'
                                                            onClick={() => CancelarAgendamento(agendamento)}
                                                        />
                                                    </i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className={styles.tableRow}>
                                        <td colSpan="8">Nenhum agendamento encontrado</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.pagination}>
                        <button
                            className={`${styles.buttonPrev} ${styles.paginationButton}`}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <span className={styles.paginationText}>Página {currentPage}</span>
                        <button
                            className={`${styles.buttonNext} ${styles.paginationButton}`}
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    filteredAgendamentos.length > indexOfLastAgendamento ? prev + 1 : prev
                                )
                            }
                            disabled={filteredAgendamentos.length <= indexOfLastAgendamento}
                        >
                            Próxima
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <FormAgendamentosAdmin
                        selectedAgend={selectedAgend}
                        setSelectedAgend={setSelectedAgend}
                        Cancelar={Cancelar}
                        isViewing={isViewing}
                        isEditing={isEditing}
                        handleSubmit={handleSubmit}
                        isAdmin={userAcesso === 1 ? 1 : ''}
                    />

                    <div className={styles.footer_form}>

                        {isViewing ? (

                            <button
                                type="button"
                                className={styles.button_exit}
                                onClick={handleExit}
                            >
                                Voltar
                            </button>
                        ) : (
                            <>
                                {isEditing ? (
                                    <>
                                        <button
                                            type="reset"
                                            onClick={Cancelar}
                                            className={styles.button_cancel}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="submit"
                                            className={styles.button_submit}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSubmit(selectedAgend);
                                            }}
                                        >
                                            Salvar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="reset"
                                            onClick={Cancelar}
                                            className={styles.button_cancel}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="submit"
                                            className={styles.button_submit}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSubmit(selectedAgend);
                                            }}
                                        >
                                            Salvar
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}