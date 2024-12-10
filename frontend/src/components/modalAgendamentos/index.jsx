import React, { useState, useEffect } from 'react'; // Importa React e os hooks useState e useEffect
import styles from './index.module.css'; // Importa os estilos CSS para o componente

import api from '@/services/api'; // Importa o serviço de API para chamadas HTTP

import { format, parseISO } from 'date-fns'; // Importa funções para manipulação de datas
import { ptBR } from 'date-fns/locale'; // Importa o locale para formatação em português do Brasil
import Swal from 'sweetalert2'; // Importa a biblioteca para exibir modais de alertas e confirmações

const CalendarEventDetailsModal = ({
    modalEvent,
    onClose,
    isEditable,
    isAdmin,
}) => {

    // Estados para armazenar os detalhes do agendamento
    const [agendSituacao, setAgendSituacao] = useState(null); // Situação do agendamento
    const [agendData, setAgendData] = useState(''); // Data do agendamento
    const [agendHorario, setAgendHorario] = useState(''); // Horário do agendamento
    const [veicUsuId, setVeicUsuId] = useState(''); // ID do veículo do usuário
    const [agendObserv, setAgendObserv] = useState(''); // Observações do agendamento
    const [veicPlaca, setVeicPlaca] = useState(''); // Placa do veículo
    const [servNome, setServNome] = useState(''); // Nome do serviço

     // Mapeamento de valores numéricos para nomes das situações do agendamento
     const situacaoMap = {
        1: 'Pendente',
        2: 'Em andamento',
        3: 'Concluído',
        4: 'Cancelado'
    };

    //----------------------------------------------------------------------------
     // Verifica se as propriedades do modal estão disponíveis antes de renderizar
     if (!modalEvent?._def?.extendedProps) {
        return null; // Não renderiza o componente se as props estão ausentes
    }

     // useEffect para atualizar os estados com os dados do evento modal
    useEffect(() => {
        if (modalEvent) {
            setAgendSituacao(parseInt(modalEvent?._def?.extendedProps?.agend_serv_situ_id, 10)); // Define a situação do agendamento
            setAgendData(modalEvent?._def?.extendedProps?.agend_data || ''); // Define a data do agendamento
            setAgendHorario(modalEvent?._def?.extendedProps?.agend_horario || ''); // Define o horário do agendamento
            setAgendObserv(modalEvent?._def?.extendedProps?.agend_observ || ''); // Define as observações
            setServNome(modalEvent?._def?.extendedProps?.serv_nome || ''); // Define o nome do serviço
            setVeicPlaca(modalEvent?._def?.extendedProps?.veic_placa || ''); // Define a placa do veículo
            setVeicUsuId(modalEvent?._def?.extendedProps?.veic_usu_id || ''); // Define o ID do veículo do usuário
        }
    }, [modalEvent]); // Executa o efeito quando modalEvent muda

// ----------------------------------------------------------------------------

    // useEffect(() => {
    //     if (modalEvent) {
    //         setAgendSituacao(parseInt(modalEvent?._def?.extendedProps?.agend_serv_situ_id, 10));
    //         setAgendData(modalEvent?._def?.extendedProps?.agend_data || '');
    //         setAgendHorario(modalEvent?._def?.extendedProps?.agend_horario || '');
    //         setAgendObserv(modalEvent?._def?.extendedProps?.agend_observ || '');
    //         setServNome(modalEvent?._def?.extendedProps?.serv_nome || '');
    //         setVeicPlaca(modalEvent?._def?.extendedProps?.veic_placa || '');
    //         setVeicUsuId(modalEvent?._def?.extendedProps?.veic_usu_id || '');
    //     }
    // }, [modalEvent]);

    // Função para atualizar a situação do agendamento no estado
    const handleSituacaoChange = (e) => setAgendSituacao(parseInt(e.target.value, 10));

    // Função para editar a situação do agendamento no servidor
    const editarSituacaoDoAgendamento = async () => {
        try {
            // Envia uma requisição PATCH para atualizar a situação do agendamento
            await api.patch(`/agendamentos/situacao/${modalEvent?._def?.extendedProps?.agend_id}`, {
                agend_serv_situ_id: agendSituacao, // Novo ID da situação
            });
            // Exibe um modal de sucesso ao concluir a atualização
            Swal.fire({
                icon: 'success',
                title: 'Agendamento atualizado!',
                confirmButtonText: 'OK',
                iconColor: "rgb(40, 167, 69)", // Cor do ícone
                confirmButtonColor: "rgb(40, 167, 69)", // Cor do botão
            }).then((result) => {
                if (result.isConfirmed) { // Fecha o modal quando o usuário confirma
                    onClose(); // Chama a função para fechar o modal
                }
            });
        } catch (error) {
            // Exibe um modal de erro caso a atualização falhe
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível atualizar o agendamento.',
                confirmButtonText: 'OK',
                iconColor: '#d33', // Cor do ícone de erro
                confirmButtonColor: '#d33', // Cor do botão de erro
            });
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Detalhes do Agendamento {modalEvent?._def?.extendedProps?.agend_id}</h2>
                <div className={styles.detailsContainer}>
                    <div className={styles.detailsItem}>
                        <span className={styles.detailsLabel}>Data:</span>
                        <span>
                            {modalEvent?._def?.extendedProps?.agend_data
                                ? format(parseISO(modalEvent._def.extendedProps.agend_data), 'dd/MM/yyyy', { locale: ptBR })
                                : ''}
                        </span>
                    </div>

                    <div className={styles.detailsItem}>
                        <span className={styles.detailsLabel}>Horário:</span>
                        <span>
                            {modalEvent?._def?.extendedProps?.agend_horario
                                ? format(parseISO(`1970-01-01T${modalEvent._def.extendedProps.agend_horario}`), 'HH:mm')
                                : ''}
                        </span>
                    </div>

                    <div className={styles.detailsItem}>
                        <span className={styles.detailsLabel}>Placa:</span>
                        <span>{veicPlaca}</span>
                    </div>

                    <div className={styles.detailsItem}>
                        <span className={styles.detailsLabel}>Serviço:</span>
                        <span>{servNome || 'Não especificado'}</span>
                    </div>

                    <div className={styles.detailsItem}>
                        <span className={styles.detailsLabel}>Situação:</span>
                        {(!isEditable || isAdmin) ? (
                            <select
                                value={agendSituacao || ''}
                                onChange={handleSituacaoChange}
                                className={styles.detailsSelect}
                                disabled={!isAdmin}
                            >
                                {Object.entries(situacaoMap).map(([id, situacao]) => (
                                    <option key={id} value={id}>{situacao}</option>
                                ))}
                            </select>
                        ) : (
                            <span>{situacaoMap[agendSituacao]}</span>
                        )}
                    </div>

                    <div className={styles.detailsItem}>
                        <span className={styles.detailsLabel}>Observação:</span>
                        <span>{agendObserv}</span>
                    </div>

                    <div className={styles.buttons_form}>
                        <button className={styles.button_cancel} onClick={onClose}>Fechar</button>
                        {(!isEditable && isAdmin) && (
                            <button className={styles.button_submit} onClick={editarSituacaoDoAgendamento}>
                                Salvar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarEventDetailsModal;