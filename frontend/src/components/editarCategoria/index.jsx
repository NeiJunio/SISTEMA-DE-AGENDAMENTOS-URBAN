import React, { useState, useEffect } from 'react'; // Importa os hooks necessários do React
import styles from './index.module.css'; // Importa os estilos CSS do componente

import api from '@/services/api'; // Importa a instância da API para fazer requisições

import { MdDelete, MdClose } from "react-icons/md"; // Importa os ícones para a exclusão e fechamento
import Swal from 'sweetalert2'; // Importa o SweetAlert2 para exibir mensagens interativas

// Função principal do componente ModalCategorias
export default function ModalCategorias({ isOpen, onClose, onCategoriaExcluida, listarCategoriasServAtivas }) {
    const [categorias, setCategorias] = useState([]); // Estado para armazenar as categorias

    // UseEffect que executa ao abrir o modal (isOpen altera) para buscar as categorias
    useEffect(() => {
        if (isOpen) {
            buscarCategorias(); // Chama a função para buscar as categorias quando o modal abre
        }
    }, [isOpen]); // Dependência de isOpen, ou seja, executa sempre que o valor de isOpen mudar

    // Função para buscar as categorias na API
    const buscarCategorias = async () => {
        try {
            const response = await api.get(`/categoriasServicos`); // Faz uma requisição GET para buscar categorias
            setCategorias(response.data.dados); // Atualiza o estado com as categorias recebidas
        } catch (error) {
            console.error("Erro ao buscar categorias:", error); // Exibe erro no console
            // Exibe um alerta de erro com o SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível carregar as categorias.',
            });
        }
    };

    // Função para alternar a visibilidade da categoria
    const handleToggleVisibilidade = async (categoriaId, visivel) => {
        const valorVisibilidade = !visivel ? 1 : 0; // Inverte a visibilidade (1 para visível, 0 para invisível)
        try {
            await api.patch(`/categoriasServicos/${categoriaId}/visibilidade`, { cat_serv_visibilidade: valorVisibilidade }); // Atualiza a visibilidade via PATCH
            buscarCategorias(); // Recarrega as categorias após a alteração
            listarCategoriasServAtivas(); // Atualiza as categorias ativas na lista
        } catch (error) {
            console.error(error.message); // Exibe erro no console caso falhe
        }
    };

    // Função para excluir uma categoria
    const handleExcluir = async (categoriaId) => {
        const resultado = await Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            iconColor: '#d33', // Cor do ícone de aviso
            confirmButtonColor: '#d33', // Cor do botão de confirmação
            showCancelButton: true, // Mostra o botão de cancelar
            cancelButtonColor: '#3085d6', // Cor do botão de cancelamento
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, excluir!', // Texto do botão de confirmação
            reverseButtons: true // Inverte a posição dos botões
        });

        if (resultado.isConfirmed) { // Verifica se a confirmação foi realizada
            try {
                await api.delete(`/categoriasServicos/${categoriaId}`); // Exclui a categoria via DELETE
                // Exibe alerta de sucesso
                Swal.fire({
                    title: 'Categoria excluída com sucesso',
                    icon: 'success',
                    confirmButtonColor: 'rgb(40, 167, 69)', // Cor do botão de confirmação
                    iconColor: 'rgb(40, 167, 69)', // Cor do ícone de sucesso
                });
                onCategoriaExcluida(); // Chama a função de callback para indicar que a categoria foi excluída
                buscarCategorias(); // Recarrega as categorias
            } catch (error) {
                Swal.fire('Erro!', 'Não foi possível excluir a categoria.', 'error'); // Exibe alerta de erro
                console.error(error); // Exibe erro no console
            }
        }
    };

    if (!isOpen) return null; // Se o modal não estiver aberto, retorna null para não renderizar nada

    return (
        <div className={styles.modalOverlay}> {/* Container de sobreposição do modal */}
            <div className={styles.modalContent}> {/* Conteúdo do modal */}
                <h2 className={styles.modalTitle}>Categorias</h2> {/* Título do modal */}
                <div className={styles.modalTableWrapper}> {/* Wrapper para a tabela de categorias */}
                    <table className={styles.modalTable}> {/* Tabela para exibir categorias */}
                        <thead className={styles.modalTableHead}> {/* Cabeçalho da tabela */}
                            <tr className={`${styles.modalTable_tr} ${styles.headerTable}`}>
                                <th className={`${styles.modalTable_th} ${styles.headerNome}`}>Nome</th>
                                <th className={`${styles.modalTable_th} ${styles.headerVisivel}`}>Visível</th>
                                <th className={`${styles.modalTable_th} ${styles.headerAcao}`}>Ações</th>
                            </tr>
                        </thead>
                        <tbody className={styles.modalTableBody}> {/* Corpo da tabela */}
                            {categorias.length > 0 ? ( // Verifica se existem categorias
                                categorias.map(categoria => ( // Mapeia e exibe as categorias
                                    <tr key={categoria.cat_serv_id} className={styles.modalTable_tr}>
                                        <td className={`${styles.modalTable_td} ${styles.headerNome}`}>{categoria.cat_serv_nome}</td> {/* Exibe o nome da categoria */}
                                        <td className={`${styles.modalTable_td} ${styles.headerVisivel}`}>
                                            <label className={styles.switch}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!categoria.cat_serv_visibilidade} // Marca o checkbox de acordo com a visibilidade
                                                    onChange={() => handleToggleVisibilidade(categoria.cat_serv_id, categoria.cat_serv_visibilidade)} // Alterna a visibilidade ao mudar o checkbox
                                                />
                                                <span className={styles.slider}></span> {/* Estilo para o switch */}
                                            </label>
                                        </td>
                                        <td className={`${styles.modalTable_td} ${styles.headerAcao} ${styles.modalTable_td_icon}`}>
                                            <button onClick={() => handleExcluir(categoria.cat_serv_id)} className={styles.btnDelete}> {/* Botão de exclusão */}
                                                <MdDelete className={styles.iconDelete} /> {/* Ícone de excluir */}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : ( // Se não houver categorias
                                <tr className={styles.modalTable_tr}>
                                    <td className={styles.modalTable_td} colSpan="3" style={{ textAlign: 'center' }}>Nenhuma categoria encontrada.</td> {/* Mensagem de categoria não encontrada */}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <MdClose
                    className={styles.iconModalClose}
                    onClick={onClose} // Fecha o modal ao clicar no ícone de fechar
                />
            </div>
        </div>
    );
}