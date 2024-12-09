'use client' // Indica que este código será executado no lado do cliente no Next.js

import React, { useState } from 'react'; // Importa React e o hook useState para gerenciar estados locais
import styles from './index.module.css'; // Importa o arquivo de estilos para estilização do componente

import api from '@/services/api'; // Importa o serviço de API para realizar chamadas HTTP

import Swal from 'sweetalert2'; // Importa a biblioteca SweetAlert2 para exibir alertas e modais

// Componente principal para o modal de criação de uma nova categoria
export default function ModalNovaCategoria({
    isOpen,
    onClose,
    onCategoriaCriada
}) {
    const [nome, setNome] = useState(''); // Estado para armazenar o nome da categoria
    const [icone, setIcone] = useState(''); // Estado para armazenar o ícone da categoria

     // Função chamada ao submeter o formulário
     const handleSubmit = async (e) => {
        e.preventDefault(); // Evita o comportamento padrão do formulário (recarregar a página)

        // Validação: verifica se o campo nome está vazio
        if (!nome.trim()) {
            Swal.fire({
                title: 'Erro!', // Título do alerta
                text: 'O nome da categoria é obrigatório.', // Mensagem do alerta
                icon: 'error', // Tipo do alerta: erro
                iconColor: '#d33', // Cor do ícone
                confirmButtonColor: '#d33', // Cor do botão de confirmação
            });
            return; // Interrompe a execução se o nome for inválido
        }

        try {
            // Envia uma requisição POST para criar a nova categoria
            const response = await api.post('/categoriasServicos', { 
                cat_serv_nome: nome, // Nome da categoria
                cat_icone: icone // Ícone da categoria
            });

            // Exibe uma mensagem de sucesso ao criar a categoria
            Swal.fire({
                title: 'Sucesso!', // Título do alerta
                text: response.data.mensagem, // Mensagem retornada pela API
                icon: 'success', // Tipo do alerta: sucesso
                iconColor: "rgb(40, 167, 69)", // Cor do ícone
                confirmButtonColor: "rgb(40, 167, 69)", // Cor do botão de confirmação
            });

            onCategoriaCriada(); // Chama a função para atualizar a lista de categorias
            onClose(); // Fecha o modal
        } catch (error) {
            console.error("Erro ao criar categoria:", error); // Loga o erro no console para depuração

            // Exibe uma mensagem de erro caso a requisição falhe
            Swal.fire({
                title: 'Erro!', // Título do alerta
                text: error.response?.data?.mensagem || 'Erro ao criar categoria.', // Mensagem de erro detalhada
                icon: 'error', // Tipo do alerta: erro
                iconColor: '#d33', // Cor do ícone
                confirmButtonColor: '#d33', // Cor do botão de confirmação
            });
        }
    };

     // Retorna null caso o modal não deva estar aberto
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
