import React, { useState, useEffect } from 'react';
import styles from './index.module.css';

import api from '@/services/api';

import { MdEdit, MdCheck, MdClose } from "react-icons/md";
import { format } from 'date-fns'; // Importa a função para formatar datas
import Swal from 'sweetalert2'; // Importa a biblioteca para exibir alertas personalizados

export default function ModalProprietarios({ isOpen, onClose, veiculoId }) {
    const [proprietarios, setProprietarios] = useState([]); // Estado para armazenar os proprietários
    const [editId, setEditId] = useState(null); // Estado para controlar qual proprietário está sendo editado
    const [editStartDate, setEditStartDate] = useState(''); // Estados para armazenar as datas de início e fim durante a edição
    const [editEndDate, setEditEndDate] = useState('');

    // UseEffect para carregar os proprietários sempre que o modal for aberto
    useEffect(() => {
        if (isOpen) {
            buscarProprietarios(veiculoId); // Chama a função de busca quando o modal for aberto
        }
    }, [isOpen, veiculoId]);


    // Função para buscar os proprietários do veículo
    const buscarProprietarios = async (veiculoId) => {
        if (veiculoId) {
            try {
                const response = await api.get(`/veiculoUsuario/proprietarios/${veiculoId}`);
                setProprietarios(response.data.dados); // Armazena os dados dos proprietários no estado
            } catch (error) {
                console.error("Erro ao buscar proprietários:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível carregar os proprietários.',
                });
            }
        } else {
            setProprietarios([]); // Limpa a lista de proprietários caso não exista veiculoId
        }
    };

    // Função para iniciar o processo de edição de um proprietário
    const handleEditar = (proprietario) => {
        setEditId(proprietario.veic_usu_id); // Armazena o ID do proprietário que será editado
        // Define as datas de início e fim no formato correto
        setEditStartDate(format(new Date(proprietario.data_inicial), 'yyyy-MM-dd'));
        setEditEndDate(proprietario.data_final ? format(new Date(proprietario.data_final), 'yyyy-MM-dd') : '');
    };

    // Função para salvar as alterações feitas em um proprietário
    const handleSalvar = async (proprietarioId) => {
        const dados = {
            data_inicial: editStartDate, // Envia a data de início
            data_final: editEndDate // Envia a data de fim (caso exista)
        };

        try {
            const response = await api.patch(`/veiculoUsuario/${editId}/data_final`, dados); // Faz a requisição de atualização
            Swal.fire({
                title: 'Sucesso!',
                text: response.data.mensagem,
                icon: 'success',
                confirmButtonColor: 'rgb(40, 167, 69)', // Cor do botão de confirmação
                iconColor: 'rgb(40, 167, 69)', // Cor do ícone de sucesso
            });
            buscarProprietarios(veiculoId); // Atualiza a lista de proprietários
            setEditId(null); // Limpa o ID de edição
            setEditStartDate(''); // Limpa o campo de data de início
            setEditEndDate(''); // Limpa o campo de data de fim

        } catch (error) {
            Swal.fire('Erro!', 'Não foi possível atualizar o proprietário.', 'error'); // Exibe erro caso a atualização falhe
            console.error(error.data.mensage);
        }
    };

    // Se o modal não estiver aberto, retorna null para não renderizar nada
    if (!isOpen) return null;

    return (
        // Overlay de fundo que cobre toda a tela, criando o efeito de modal
        <div className={styles.modalOverlay}>
            {/* Conteúdo principal do modal, com animação condicional para a exibição */}
            <div className={`${styles.modalContent} ${isOpen ? styles.enterActive : ''}`}>

                {/* Título do modal, indicando que são os proprietários do veículo */}
                <h2 className={styles.modalTitle}>Proprietários do Veículo</h2>

                {/* Wrapper para a tabela, garantindo a organização e o estilo */}
                <div className={styles.modalTableWrapper}>
                    {/* Tabela exibindo os dados dos proprietários */}
                    <table className={styles.modalTable}>
                        <thead className={styles.modalTableHead}>
                            {/* Cabeçalho da tabela com os nomes das colunas */}
                            <tr className={`${styles.modalTable_tr} ${styles.headerTable}`}>
                                <th className={styles.modalTable_th}>Nome</th> {/* Coluna do Nome */}
                                <th className={styles.modalTable_th}>CPF</th> {/* Coluna do CPF */}
                                <th className={styles.modalTable_th}>Data de Início</th> {/* Coluna de Data de Início */}
                                <th className={styles.modalTable_th}>Data de Fim</th> {/* Coluna de Data de Fim */}
                                <th className={styles.modalTable_th}>Ações</th> {/* Coluna de Ações (editar, salvar, cancelar) */}
                            </tr>
                        </thead>

                        <tbody className={styles.modalTableBody}>
                            {/* Verifica se há proprietários para exibir */}
                            {proprietarios.length > 0 ? (
                                // Mapeia e exibe os dados de cada proprietário
                                proprietarios.map(proprietario => (
                                    <tr key={proprietario.veic_usu_id} className={styles.modalTable_tr}>
                                        {/* Exibe o nome do proprietário */}
                                        <td className={styles.modalTable_td}>{proprietario.usu_nome}</td>
                                        {/* Exibe o CPF do proprietário */}
                                        <td className={styles.modalTable_td}>{proprietario.usu_cpf}</td>
                                        {/* Exibe a data de início, permitindo edição se o proprietário estiver sendo editado */}
                                        <td className={styles.modalTable_td}>
                                            {editId === proprietario.veic_usu_id ? (
                                                // Campo de input para edição da data de início
                                                <input
                                                    type="date"
                                                    value={editStartDate}
                                                    onChange={(e) => setEditStartDate(e.target.value)} // Atualiza a data de início
                                                    className={styles.inputDate} // Aplica o estilo de input
                                                />
                                            ) : (
                                                // Exibe a data de início formatada quando não está sendo editada
                                                format(new Date(proprietario.data_inicial), 'dd/MM/yyyy')
                                            )}
                                        </td>
                                        {/* Exibe a data de fim, com opção de edição se o proprietário estiver sendo editado */}
                                        <td className={styles.modalTable_td}>
                                            {editId === proprietario.veic_usu_id ? (
                                                // Campo de input para edição da data final
                                                <input
                                                    type="date"
                                                    value={editEndDate}
                                                    onChange={(e) => setEditEndDate(e.target.value)} // Atualiza a data de fim
                                                    className={styles.inputDate} // Aplica o estilo de input
                                                />
                                            ) : (
                                                // Exibe a data de fim formatada ou 'N/A' se não houver data final
                                                proprietario.data_final ? format(new Date(proprietario.data_final), 'dd/MM/yyyy') : 'N/A'
                                            )}
                                        </td>
                                        {/* Exibe os botões de ação (editar, salvar, cancelar) */}
                                        <td className={`${styles.modalTable_td} ${styles.modalTable_td_icon}`}>
                                            {editId === proprietario.veic_usu_id ? (
                                                <>
                                                    {/* Botão para cancelar a edição e limpar os campos */}
                                                    <button className={styles.btnCancel} onClick={() => {
                                                        setEditId(null);
                                                        setEditStartDate('');
                                                        setEditEndDate('');
                                                    }}>
                                                        <MdClose /> {/* Ícone de fechar */}
                                                    </button>
                                                    {/* Botão para salvar as alterações feitas */}
                                                    <button onClick={() => handleSalvar(proprietario.veic_usu_id)} className={styles.btnSave}>
                                                        <MdCheck /> {/* Ícone de confirmar */}
                                                    </button>
                                                </>
                                            ) : (
                                                // Botão para iniciar a edição do proprietário
                                                <button onClick={() => handleEditar(proprietario)} className={styles.btnEdit}>
                                                    <MdEdit /> {/* Ícone de editar */}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                // Caso não haja proprietários, exibe uma linha indicando isso
                                <tr className={styles.modalTable_tr}>
                                    <td className={styles.modalTable_td} colSpan="5" style={{ textAlign: 'center' }}>
                                        Nenhum proprietário encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Ícone de fechar no canto superior direito do modal */}
                <MdClose
                    className={styles.iconModalClose}
                    onClick={onClose} // Fecha o modal quando o ícone é clicado
                />
                {/* <button onClick={onClose} className={styles.btnCancel}>Cancelar</button> */}
            </div>
        </div>
    );
}