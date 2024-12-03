import styles from './page.module.css';
import { useState, useEffect } from 'react';

import api from '@/services/api';

import FormAgendamentos from '@/components/FormAgendamentos';

import Swal from 'sweetalert2';
import { PiListMagnifyingGlassBold } from "react-icons/pi";
import { MdRemoveRedEye, MdEdit } from "react-icons/md";
import { parseISO, format } from 'date-fns';
import { IoMdTrash } from "react-icons/io";

export default function UsuarioHistorico() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [filteredAgendamentos, setFilteredAgendamentos] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedColumn, setSortedColumn] = useState(null);
    const [isAsc, setIsAsc] = useState(true);
    const [situacaoDoAgendamento, setSituacaoDoAgendamento] = useState([])
    const [userId, setUserId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAgend, setSelectedAgend] = useState({
        agend_data: '',
        agend_horario: '',
        agend_id: '',
        agend_observ: '',
        agend_serv_situ_id: 1,
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
    const agendamentosPerPage = 15;

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
        if (userId) {
            ListarAgendamentos();
            ListarSituacaoDoAgendamento();
        }
    }, [userId]);

    useEffect(() => {
        const storedUserId = localStorage.getItem('user');
        if (storedUserId) {
            const parsedUser = JSON.parse(storedUserId);
            setUserId(parsedUser?.id || null);
        }
    }, []);

    const ListarAgendamentos = async () => {
        try {
            const response = await api.get(`/agendamentos/${userId}`);
            
            const agendamentosOrdenados = response.data.dados.sort((a, b) => {
                const dateTimeA = new Date(`${a.agend_data}T${a.agend_horario}`);
                const dateTimeB = new Date(`${b.agend_data}T${b.agend_horario}`);
                return dateTimeB - dateTimeA;
            });
    
            setAgendamentos(agendamentosOrdenados);
            setFilteredAgendamentos(agendamentosOrdenados);
        } catch (error) {
            console.error("Erro ao buscar os agendamentos:", error);
            Swal.fire({
                title: "Aviso",
                text: "Ainda não há agendamentos.",
                icon: "warning",
                iconColor: '#ff9d00',
                confirmButtonColor: '#ff9d00',
            });
        }
    };

    const ListarSituacaoDoAgendamento = async () => {
        try {
            const responde = await api.get('/agendaServicosSituacao');
            setSituacaoDoAgendamento(responde.data.dados);
        } catch (error) {
            console.error("Erro ao buscar os situações dos agendamentos:", error);
            Swal.fire({
                title: "Erro!",
                text: "Ainda não há agendamentos",
                icon: "error",
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    const handleSubmit = async (agendamentos) => {
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
                response = await api.patch(`/agendamentos/${agendamentos.agend_id}`, dados);
            }
            Swal.fire({
                title: 'Sucesso!',
                text: response.data.mensagem,
                icon: 'success',
                iconColor: "rgb(40, 167, 69)",
                confirmButtonColor: "rgb(40, 167, 69)",
            });
    
            setShowForm(false);
            setIsEditing(false);
            setIsViewing(false);
            ListarAgendamentos();
        } catch (error) {
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
    
    const handleSearch = (text) => {
        setSearchText(text); // Atualiza o texto de busca
        const lowerText = text.toLowerCase(); // Normaliza o texto para comparação
    
        const filtered = agendamentos.filter((agendamento) => {
            const idMatch = agendamento.agend_id.toString().includes(lowerText); // Verifica ID
            const placaMatch = agendamento.veic_placa.toLowerCase().includes(lowerText); // Verifica placa
            const dataMatch = format(parseISO(agendamento.agend_data), 'dd/MM/yyyy').includes(lowerText); // Verifica data
            const horarioMatch = agendamento.agend_horario.includes(lowerText); // Verifica horário
            const servicoMatch = agendamento.serv_nome.toLowerCase().includes(lowerText); // Verifica nome do serviço
    
            return idMatch || placaMatch || dataMatch || horarioMatch || servicoMatch; // Combina todas as condições
        });
    
        setFilteredAgendamentos(filtered); // Atualiza os agendamentos filtrados
    };

    const handleDateChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        applyFilters(searchText, start, end, statusFilter);
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
        applyFilters(searchText, startDate, endDate, status);
    };

    const handleEditAgend = (agendamentos) => {
        setShowForm(true)
        setSelectedAgend(agendamentos);
        setIsViewing(false);
        setIsEditing(true);
    };

    const handleViewAgend = (agendamentos) => {
        setSelectedAgend(agendamentos);
        setShowForm(true);
        setIsViewing(true);
        setIsEditing(false);
    };

    const CancelarAgendamento = async (agendamentos) => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você deseja realmente cancelar este agendamento? Esta ação não pode ser desfeita.",
            icon: "warning",
            iconColor: "#ff9d00",
            showCancelButton: true,
            confirmButtonColor: "rgb(40, 167, 69)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, cancelar!",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
            backdrop: "rgba(0,0,0,0.7)"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const situacao = 0;
                    const servSituacaoId = 4;

                    const dados = {
                        agend_situacao: parseInt(situacao, 10),
                        agend_serv_situ_id: parseInt(servSituacaoId, 10)
                    };

                    const response = await api.patch(`/agendamentos/cancelar/${agendamentos.agend_id}`, dados);

                    if (response.data.sucesso) {
                        Swal.fire({
                            title: 'Sucesso!',
                            text: 'Agendamento cancelado com sucesso.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            iconColor: "rgb(40, 167, 69)",
                            confirmButtonColor: "rgb(40, 167, 69)",
                        });
                        ListarAgendamentos();
                    } else {
                        Swal.fire({
                            title: 'Erro!',
                            text: response.data.mensagem || 'Ocorreu um erro ao cancelar o agendamento.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            iconColor: '#d33',
                            confirmButtonColor: '#d33',
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Erro!',
                        text: `Erro no cancelamento do agendamento: ${error.message}`,
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
        Swal.fire({
            title: "Deseja Cancelar?",
            text: "As informações não serão salvas",
            icon: "warning",
            iconColor: "orange",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "rgb(40, 167, 69)",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Confirmar",
            reverseButtons: true,
            backdrop: "rgba(0,0,0,0.7)",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Cancelado!",
                    text: "As alterações foram canceladas.",
                    icon: "success",
                    iconColor: "rgb(40, 167, 69)",
                    confirmButtonColor: "rgb(40, 167, 69)",
                }).then(() => {
                    setShowForm(false);
                    setSelectedAgend({
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
                    setIsViewing(false);
                    setIsEditing(false);
                });
            }
        });
    };

    const handleExit = () => {
        setShowForm(false);
        setSelectedAgend({
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
        setIsViewing(false);
        setIsEditing(false);
    };

    const applyFilters = (text, start, end, status) => {
        const result = agendamentos.filter((agendamento) => {
            const matchesText = agendamento.agend_observ.toLowerCase().includes(text.toLowerCase()) ||
                agendamento.veic_placa.toLowerCase().includes(text.toLowerCase()) ||
                agendamento.agend_id.toString().includes(text);

            const agendamentoData = new Date(agendamento.agend_data).setUTCHours(0, 0, 0, 0);
            const startDate = start ? new Date(start).setUTCHours(0, 0, 0, 0) : null;
            const endDate = end ? new Date(end).setUTCHours(23, 59, 59, 999) : null;

            const matchesDate = (!startDate || agendamentoData >= startDate) &&
                (!endDate || agendamentoData <= endDate);

            const matchesStatus = status === 'todos' || agendamento.agend_serv_situ_id === parseInt(status);

            return matchesText && matchesDate && matchesStatus;
        });
        setFilteredAgendamentos(result);
        setCurrentPage(1);
    };

    const sortByColumn = (column) => {
        let newIsAsc = true;
        if (sortedColumn === column) newIsAsc = !isAsc;

        const sortedData = [...filteredAgendamentos].sort((a, b) => {
            if (a[column] < b[column]) return newIsAsc ? -1 : 1;
            if (a[column] > b[column]) return newIsAsc ? 1 : -1;
            return 0;
        });

        setFilteredAgendamentos(sortedData);
        setSortedColumn(column);
        setIsAsc(newIsAsc);
    };

    const indexOfLastAgendamento = currentPage * agendamentosPerPage;
    const indexOfFirstAgendamento = indexOfLastAgendamento - agendamentosPerPage;
    const currentAgendamentos = filteredAgendamentos.slice(indexOfFirstAgendamento, indexOfLastAgendamento);

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
                                                            title="Cancelar"
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
                    <FormAgendamentos
                        selectedAgend={selectedAgend}
                        setSelectedAgend={setSelectedAgend}
                        Cancelar={Cancelar}
                        isViewing={isViewing}
                        isEditing={isEditing}
                        handleSubmit={handleSubmit}
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