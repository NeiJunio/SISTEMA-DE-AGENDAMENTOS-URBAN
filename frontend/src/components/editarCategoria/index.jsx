import React, { useState, useEffect } from 'react';
import styles from './index.module.css';

import api from '@/services/api';

import { MdDelete, MdClose } from "react-icons/md";
import Swal from 'sweetalert2';

export default function ModalCategorias({ isOpen, onClose, onCategoriaExcluida, listarCategoriasServAtivas }) {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        if (isOpen) {
            buscarCategorias();
        }
    }, [isOpen]);

    const buscarCategorias = async () => {
        try {
            const response = await api.get(`/categoriasServicos`);
            setCategorias(response.data.dados);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível carregar as categorias.',
            });
        }
    };

    const handleToggleVisibilidade = async (categoriaId, visivel) => {
        const valorVisibilidade = !visivel ? 1 : 0;
        try {
            await api.patch(`/categoriasServicos/${categoriaId}/visibilidade`, { cat_serv_visibilidade: valorVisibilidade });
            buscarCategorias();
            listarCategoriasServAtivas();

        } catch (error) {
            console.error(error.message);
        }
    };

    const handleExcluir = async (categoriaId) => {
        const resultado = await Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            iconColor: '#d33',
            confirmButtonColor: '#d33',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, excluir!',
            reverseButtons: true
        });

        if (resultado.isConfirmed) {
            try {
                await api.delete(`/categoriasServicos/${categoriaId}`);
                Swal.fire({
                    title: 'Categoria excluída com sucesso',
                    icon: 'success',
                    confirmButtonColor: 'rgb(40, 167, 69)',
                    iconColor: 'rgb(40, 167, 69)',
                });
                onCategoriaExcluida();
                buscarCategorias();
            } catch (error) {
                Swal.fire('Erro!', 'Não foi possível excluir a categoria.', 'error');
                console.error(error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Categorias</h2>
                <div className={styles.modalTableWrapper}>
                    <table className={styles.modalTable}>
                        <thead className={styles.modalTableHead}>
                            <tr className={`${styles.modalTable_tr} ${styles.headerTable}`}>
                                <th className={`${styles.modalTable_th} ${styles.headerNome}`}>Nome</th>
                                <th className={`${styles.modalTable_th} ${styles.headerVisivel}`}>Visível</th>
                                <th className={`${styles.modalTable_th} ${styles.headerAcao}`}>Ações</th>
                            </tr>
                        </thead>
                        <tbody className={styles.modalTableBody}>
                            {categorias.length > 0 ? (
                                categorias.map(categoria => (
                                    <tr key={categoria.cat_serv_id} className={styles.modalTable_tr}>
                                        <td className={`${styles.modalTable_td} ${styles.headerNome}`}>{categoria.cat_serv_nome}</td>
                                        <td className={`${styles.modalTable_td} ${styles.headerVisivel}`}>
                                            <label className={styles.switch}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!categoria.cat_serv_visibilidade}
                                                    onChange={() => handleToggleVisibilidade(categoria.cat_serv_id, categoria.cat_serv_visibilidade)}
                                                />
                                                <span className={styles.slider}></span>
                                            </label>
                                        </td>
                                        <td className={`${styles.modalTable_td} ${styles.headerAcao} ${styles.modalTable_td_icon}`}>
                                            <button onClick={() => handleExcluir(categoria.cat_serv_id)} className={styles.btnDelete}>
                                                <MdDelete className={styles.iconDelete} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className={styles.modalTable_tr}>
                                    <td className={styles.modalTable_td} colSpan="3" style={{ textAlign: 'center' }}>Nenhuma categoria encontrada.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <MdClose
                    className={styles.iconModalClose}
                    onClick={onClose}
                />
            </div>
        </div>
    );
}