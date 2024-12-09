import React, { useState, useEffect } from 'react';
import styles from './index.module.css';

import api from '@/services/api';

import { MdEdit, MdCheck, MdClose } from "react-icons/md";
import { format } from 'date-fns';
import Swal from 'sweetalert2';

export default function ModalProprietarios({ isOpen, onClose, veiculoId }) {
    const [proprietarios, setProprietarios] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editStartDate, setEditStartDate] = useState('');
    const [editEndDate, setEditEndDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            buscarProprietarios(veiculoId);
        }
    }, [isOpen, veiculoId]);

    const buscarProprietarios = async (veiculoId) => {
        if (veiculoId) {
            try {
                const response = await api.get(`/veiculoUsuario/proprietarios/${veiculoId}`);
                setProprietarios(response.data.dados);
            } catch (error) {
                console.error("Erro ao buscar proprietários:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível carregar os proprietários.',
                });
            }
        } else {
            setProprietarios([]);
        }
    };

    const handleEditar = (proprietario) => {
        setEditId(proprietario.veic_usu_id);
        setEditStartDate(format(new Date(proprietario.data_inicial), 'yyyy-MM-dd'));
        setEditEndDate(proprietario.data_final ? format(new Date(proprietario.data_final), 'yyyy-MM-dd') : '');
    };
    
    const handleSalvar = async (proprietarioId) => {
        const dados = {
            data_inicial: editStartDate,
            data_final: editEndDate
        };

        try {
            const response = await api.patch(`/veiculoUsuario/${editId}/data_final`, dados);

            Swal.fire({
                title: 'Sucesso!',
                text: response.data.mensagem,
                icon: 'success',
                confirmButtonColor: 'rgb(40, 167, 69)',
                iconColor: 'rgb(40, 167, 69)',
            });
            buscarProprietarios(veiculoId);
            setEditId(null);
            setEditStartDate('');
            setEditEndDate('');

        } catch (error) {
            Swal.fire('Erro!', 'Não foi possível atualizar o proprietário.', 'error');
            console.error(error.data.mensage);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={`${styles.modalContent} ${isOpen ? styles.enterActive : ''}`}>
                <h2 className={styles.modalTitle}>Proprietários do Veículo</h2>
                <div className={styles.modalTableWrapper}>
                    <table className={styles.modalTable}>
                        <thead className={styles.modalTableHead}>
                            <tr className={`${styles.modalTable_tr} ${styles.headerTable}`}>
                                <th className={styles.modalTable_th}>Nome</th>
                                <th className={styles.modalTable_th}>CPF</th>
                                <th className={styles.modalTable_th}>Data de Início</th>
                                <th className={styles.modalTable_th}>Data de Fim</th>
                                <th className={styles.modalTable_th}>Ações</th>
                            </tr>
                        </thead>
                        <tbody className={styles.modalTableBody}>
                            {proprietarios.length > 0 ? (
                                proprietarios.map(proprietario => (
                                    <tr key={proprietario.veic_usu_id} className={styles.modalTable_tr}>
                                        <td className={styles.modalTable_td}>{proprietario.usu_nome}</td>
                                        <td className={styles.modalTable_td}>{proprietario.usu_cpf}</td>
                                        <td className={styles.modalTable_td}>
                                            {editId === proprietario.veic_usu_id ? (
                                                <input
                                                    type="date"
                                                    value={editStartDate}
                                                    onChange={(e) => setEditStartDate(e.target.value)}
                                                    className={styles.inputDate}
                                                />
                                            ) : (
                                                format(new Date(proprietario.data_inicial), 'dd/MM/yyyy')
                                            )}
                                        </td>
                                        <td className={styles.modalTable_td}>
                                            {editId === proprietario.veic_usu_id ? (
                                                <input
                                                    type="date"
                                                    value={editEndDate}
                                                    onChange={(e) => setEditEndDate(e.target.value)}
                                                    className={styles.inputDate}
                                                />
                                            ) : (
                                                proprietario.data_final ? format(new Date(proprietario.data_final), 'dd/MM/yyyy') : 'N/A'
                                            )}
                                        </td>
                                        <td className={`${styles.modalTable_td} ${styles.modalTable_td_icon}`}>
                                            {editId === proprietario.veic_usu_id ? (
                                                <>
                                                    <button className={styles.btnCancel} onClick={() => { setEditId(null); setEditStartDate(''); setEditEndDate(''); }}>
                                                        <MdClose />
                                                    </button>
                                                    <button onClick={() => handleSalvar(proprietario.veic_usu_id)} className={styles.btnSave}>
                                                        <MdCheck />
                                                    </button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleEditar(proprietario)} className={styles.btnEdit}>
                                                    <MdEdit />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className={styles.modalTable_tr}>
                                    <td className={styles.modalTable_td} colSpan="5" style={{ textAlign: 'center' }}>Nenhum proprietário encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <MdClose
                    className={styles.iconModalClose}
                    onClick={onClose}
                />
                {/* <button onClick={onClose} className={styles.btnCancel}>Cancelar</button> */}
            </div>
        </div>
    );

}