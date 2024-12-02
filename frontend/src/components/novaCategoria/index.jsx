'use client'

import React, { useState } from 'react';
import styles from './index.module.css';

import api from '@/services/api';

import Swal from 'sweetalert2';

export default function ModalNovaCategoria({ isOpen, onClose, onCategoriaCriada }) {
    const [nome, setNome] = useState('');
    const [icone, setIcone] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome.trim()) {
            Swal.fire({
                title: 'Erro!',
                text: 'O nome da categoria é obrigatório.',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
            return;
        }

        try {
            const response = await api.post('/categoriasServicos', { cat_serv_nome: nome, cat_icone: icone });
            Swal.fire({
                title: 'Sucesso!',
                text: response.data.mensagem,
                icon: 'success',
                iconColor: "rgb(40, 167, 69)",
                confirmButtonColor: "rgb(40, 167, 69)",
            });
            onCategoriaCriada();
            onClose();
        } catch (error) {
            console.error("Erro ao criar categoria:", error);
            Swal.fire({
                title: 'Erro!',
                text: error.response?.data?.mensagem || 'Erro ao criar categoria.',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }

    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="nome">Nome da categoria</label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            className={styles.inputCategoria}
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.btnSubmit}>Criar</button>
                        <button type="button" onClick={onClose} className={styles.btnCancel}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
