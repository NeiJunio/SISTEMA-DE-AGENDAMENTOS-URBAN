'use client'

import { useState, useEffect } from 'react'; // Importa hooks do React para gerenciar estado e efeitos colaterais.
import styles from './page.module.css'; // Importa o arquivo CSS para estilização.

import api from '@/services/api'; // Importa a configuração da API.

import FormServicos from '@/components/FormServicos'; // Componente para o formulário de serviços.
import ModalNovaCategoria from '@/components/novaCategoria'; // Componente para modal de criação de nova categoria.
import EditarCategoria from '@/components/editarCategoria'; // Componente para edição de categoria.

import { PiListMagnifyingGlassBold } from "react-icons/pi"; // Importa ícone para a lista com lupa.
import { MdRemoveRedEye, MdEdit } from "react-icons/md"; // Importa ícones para visualização e edição.
import Swal from 'sweetalert2'; // Biblioteca para exibição de alertas e notificações.

export default function Servicos() {
    const [servicos, setServicos] = useState([]); // Estado para armazenar a lista de serviços.
    const [selectedServico, setSelectedServico] = useState(null); // Serviço selecionado para visualização ou edição.
    const [isViewing, setIsViewing] = useState(false); // Controle de visualização de um serviço.
    const [isEditing, setIsEditing] = useState(false); // Controle de edição de um serviço.
    const [statusFilter, setStatusFilter] = useState('todos'); // Filtro de status aplicado à lista.
    const [searchText, setSearchText] = useState(''); // Texto da busca no campo de pesquisa.
    const [showForm, setShowForm] = useState(false); // Controle de exibição do formulário de serviços.
    const [filteredServicos, setFilteredServicos] = useState([]); // Lista de serviços filtrados.
    const [currentPage, setCurrentPage] = useState(1); // Página atual da paginação.
    const [sortedColumn, setSortedColumn] = useState(null); // Coluna atualmente ordenada.
    const [isAsc, setIsAsc] = useState(true); // Ordem de ordenação (ascendente ou descendente).
    const [categoriasServ, setCategoriasServ] = useState([]); // Lista de categorias de serviços.
    const [modalCategoriaOpen, setModalCategoriaOpen] = useState(false); // Controle do estado do modal para nova categoria.
    const [editarCategoriaOpen, setEditarCategoriaOpen] = useState(false); // Controle do estado do modal para editar categoria.

    const usersPerPage = 15; // Quantidade de serviços exibidos por página.

    const indexOfLastUser = currentPage * usersPerPage; // Índice do último serviço da página atual.
    const indexOfFirstUser = indexOfLastUser - usersPerPage; // Índice do primeiro serviço da página atual.
    const currentServicos = filteredServicos.slice(indexOfFirstUser, indexOfLastUser); // Serviços exibidos na página atual.

    useEffect(() => {
        ListarServicos(); // Chama a função para listar serviços ao montar o componente.
    }, []);

    useEffect(() => {
        setFilteredServicos(servicos); // Atualiza a lista de serviços filtrados sempre que a lista original muda.
    }, [servicos]);

    useEffect(() => {
        handleSearch(); // Realiza busca sempre que o texto de pesquisa ou o filtro de status mudam.
    }, [searchText, statusFilter]);

    const ListarServicos = async () => {
        try {
            const response = await api.get('/servicos'); // Faz uma requisição para buscar os serviços.
            setServicos(response.data.dados); // Armazena os serviços retornados no estado.
        } catch (error) {
            console.error("Erro ao buscar os serviços:", error); // Loga o erro no console.
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível carregar os serviços.', // Exibe uma mensagem de erro para o usuário.
                icon: 'error', // Ícone de erro no alerta.
                iconColor: '#d33', // Cor do ícone do alerta.
                confirmButtonColor: '#d33', // Cor do botão de confirmação.
            });
        }
    };

    const ListarCategoriasServAtivas = async () => {
        try {
            const response = await api.get('/categoriasServicosAtivas'); // Faz uma requisição à API para obter as categorias de serviços ativas
            setCategoriasServ(response.data.dados);  // Atualiza o estado com os dados das categorias recebidas
        } catch (error) {
            console.error("Erro ao buscar as categorias:", error); // Loga o erro no console para depuração
            // Exibe um alerta indicando que houve um erro ao buscar as categorias
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível buscar as categorias.',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    const handleSearch = () => {
        // Reseta a coluna de ordenação para o estado inicial
        setSortedColumn(null);
        // Define a ordenação como ascendente
        setIsAsc(true);

        // Filtra os serviços com base no status e no texto de busca
        const result = servicos.filter((servico) => {
            // Verifica se o status do serviço corresponde ao filtro aplicado
            const statusMatch = statusFilter === 'todos' ||
                (statusFilter === 'ativo' && servico.serv_situacao === 'Ativo') ||
                (statusFilter === 'inativo' && servico.serv_situacao === 'Inativo');

            // Verifica se o nome do serviço ou da categoria inclui o texto pesquisado
            const searchTextMatch = searchText === '' ||
                servico.serv_nome.toLowerCase().includes(searchText.toLowerCase()) ||
                servico.cat_serv_nome.toLowerCase().includes(searchText.toLowerCase());

            // Retorna true se o serviço atender aos dois critérios de filtro
            return statusMatch && searchTextMatch;
        });

        // Atualiza o estado com os serviços filtrados
        setFilteredServicos(result);
        // Redefine a página atual para a primeira
        setCurrentPage(1);
    };

    const handleViewServicos = async (servicos) => {
        try {
            // Faz uma requisição à API para obter os detalhes de um serviço específico
            const response = await api.get(`/servicos/${servicos.serv_id}`);

            if (response.data.sucesso) {
                // Se a requisição for bem-sucedida, atualiza os estados relevantes
                setSelectedServico(response.data.dados);
                setShowForm(true); // Exibe o formulário
                setIsViewing(true); // Modo de visualização ativado
                setIsEditing(false); // Modo de edição desativado
            } else {
                // Lança um erro caso a resposta indique falha
                throw new Error(response.data.mensagem);
            }
        } catch (error) {
            // Loga o erro no console para depuração
            console.error("Erro ao visualizar serviço:", error);
            // Exibe um alerta indicando o erro ao visualizar o serviço
            Swal.fire({
                title: 'Erro!',
                text: error.response ? error.response.data.mensagem : 'Erro desconhecido ao buscar serviço.',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    const handleEditServicos = (servicos) => {
        // Define o serviço selecionado para edição
        setSelectedServico(servicos);
        setShowForm(true); // Exibe o formulário
        setIsViewing(false); // Modo de visualização desativado
        setIsEditing(true); // Modo de edição ativado
    };

    const handleExit = () => {
        // Restaura os estados ao sair do formulário
        setShowForm(false); // Oculta o formulário
        setSelectedServico(null); // Remove o serviço selecionado
        setIsViewing(false); // Desativa o modo de visualização
        setIsEditing(false); // Desativa o modo de edição
    };

    const handleSubmit = async (servico) => {
        try {
            let response;

            if (servico.serv_id) {
                // Atualiza um serviço existente
                response = await api.patch(`/servicos/${servico.serv_id}`, servico);
            } else {
                // Cria um novo serviço
                response = await api.post('/servicos', servico);
            }

            // Exibe um alerta de sucesso após salvar o serviço
            Swal.fire({
                title: 'Sucesso!',
                text: response.data.mensagem,
                icon: 'success',
                confirmButtonColor: 'rgb(40, 167, 69)',
                iconColor: 'rgb(40, 167, 69)',
            });

            // Atualiza a lista de serviços e fecha o formulário
            ListarServicos();
            setShowForm(false);
        } catch (error) {
            // Loga o erro no console para depuração
            console.error("Erro ao salvar serviço:", error);
            // Exibe um alerta indicando o erro ao salvar o serviço
            Swal.fire({
                title: 'Erro!',
                text: error.response ? error.response.data.mensagem : 'Erro ao salvar serviço.',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    const Create = () => {
        // Inicializa o objeto "selectedServico" com valores padrão
        setSelectedServico({
            cat_serv_id: '',        // ID da categoria do serviço (vazio por padrão)
            serv_descricao: '',     // Descrição do serviço (vazio por padrão)
            serv_duracao: '',       // Duração do serviço (vazio por padrão)
            serv_nome: '',          // Nome do serviço (vazio por padrão)
            serv_preco: '',         // Preço do serviço (vazio por padrão)
            serv_situacao: 1        // Situação do serviço (ativo por padrão)
        });

        // Exibe o formulário de criação de serviço
        setShowForm(true);

        // Carrega a lista de categorias de serviço ativas
        ListarCategoriasServAtivas();
    };

    const sortByColumn = (column) => {
        let newIsAsc = true; // Define a ordenação como ascendente por padrão

        // Se a coluna já estiver ordenada, inverte a direção da ordenação
        if (sortedColumn === column) {
            newIsAsc = !isAsc;
        }

        // Ordena os dados com base na coluna selecionada e na direção da ordenação
        const sortedData = [...filteredServicos].sort((a, b) => {
            if (a[column] < b[column]) return newIsAsc ? -1 : 1; // Comparação para ordenação ascendente/descendente
            if (a[column] > b[column]) return newIsAsc ? 1 : -1;
            return 0; // Elementos iguais não mudam de posição
        });

        // Atualiza os dados filtrados e os estados de coluna ordenada e direção
        setFilteredServicos(sortedData);
        setSortedColumn(column);
        setIsAsc(newIsAsc);
    };


    const Cancelar = () => {
        // Exibe um alerta de confirmação para cancelar alterações
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
            if (result.isConfirmed) { // Se o botão de confirmação for clicado
                // Exibe um alerta informando que o cancelamento foi realizado
                Swal.fire({
                    title: "Cancelado!",
                    text: "As alterações foram canceladas.",
                    icon: "success",
                    iconColor: "rgb(40, 167, 69)",
                    confirmButtonColor: "rgb(40, 167, 69)",
                }).then(() => {
                    // Fecha o formulário e redefine os estados relacionados
                    setShowForm(false);
                    setSelectedServico(null);
                    setIsViewing(false);
                    setIsEditing(false);
                });
            }
        });
    };

    const handleNovaCategoria = () => {
        setModalCategoriaOpen(true); // Abre o modal para criação de uma nova categoria
    };

    const handleCategoriaCriada = () => {
        ListarCategoriasServAtivas(); // Atualiza a lista de categorias após a criação de uma nova categoria
    };

    const handleEditCategoria = () => {
        setEditarCategoriaOpen(true); // Abre o modal para editar uma categoria existente
    };

    const handleCategoriaExcluida = () => {
        ListarCategoriasServAtivas(); // Atualiza a lista de categorias após a exclusão de uma categoria
    };

    return (
        <div id="servicos" className={`${styles.content_section}`}>
            <h2 className={styles.title_page}>Gerenciamento de Serviços</h2>

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
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                <PiListMagnifyingGlassBold
                                    className={styles.lupa}
                                />
                            </div>
                        </div>

                        <div className={styles.filterButtons}>
                            <div className={`${styles.filterGroup} ${styles.filterGroupTypeUser}`}></div>

                            <div className={styles.filterGroup}>
                                <label htmlFor="status" className={styles.labelFilter}>Status</label>
                                <select
                                    id="status"
                                    className={styles.filterSelect}
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="todos">Todos</option>
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </div>

                            <button
                                className={styles.newButton}
                                onClick={Create}>
                                Novo
                            </button>
                        </div>
                    </div>

                    <div className={styles.resultTableContainer}>
                        <table className={styles.resultTable}>
                            <thead className={styles.tableHead}>
                                <tr>
                                    <th
                                        className={`${styles.tableHeader} ${styles.id}`}
                                        onClick={() => sortByColumn('serv_id')}>
                                        Código
                                        {sortedColumn === 'serv_id' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.nome}`}
                                        onClick={() => sortByColumn('serv_nome')}>
                                        Nome do Serviço
                                        {sortedColumn === 'serv_nome' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.categoria}`}
                                        onClick={() => sortByColumn('cat_serv_nome')}>
                                        Categoria
                                        {sortedColumn === 'cat_serv_nome' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.duracao}`}
                                        onClick={() => sortByColumn('serv_duracao')}>
                                        Duração
                                        {sortedColumn === 'serv_duracao' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.preco}`}
                                        onClick={() => sortByColumn('serv_preco')}>
                                        Preço
                                        {sortedColumn === 'serv_preco' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th className={`${styles.tableHeader} ${styles.acao}`}>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {currentServicos.length > 0 ? (
                                    currentServicos.map((servicos) => (
                                        <tr key={servicos.serv_id}>
                                            <td className={styles.tdId}>{servicos.serv_id}</td>
                                            <td className={styles.tdNome}>{servicos.serv_nome}</td>
                                            <td className={styles.tdCategoria}>{servicos.cat_serv_nome}</td>
                                            <td className={styles.tdDuracao}>{servicos.serv_duracao}</td>
                                            <td className={styles.tdPreco}>R${Number(servicos.serv_preco).toFixed(2)}</td>
                                            <td>
                                                <div className={styles.actionIcons}>
                                                    <i>
                                                        <MdRemoveRedEye
                                                            title="Visualizar"
                                                            onClick={() => handleViewServicos(servicos)} />
                                                    </i>
                                                    <i>
                                                        <MdEdit
                                                            title="Editar"
                                                            onClick={() => handleEditServicos(servicos)}
                                                        />
                                                    </i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className={styles.noResults}>Nenhum serviço encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.pagination}>
                        <button
                            className={styles.buttonPrev}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>

                        <span>Página {currentPage}</span>

                        <button
                            onClick={() => setCurrentPage(prev => (filteredServicos.length > indexOfLastUser ? prev + 1 : prev))}
                            disabled={filteredServicos.length <= indexOfLastUser}
                        >
                            Próxima
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <FormServicos
                        selectedServico={selectedServico}
                        setSelectedServico={setSelectedServico}
                        isViewing={isViewing}
                        isEditing={isEditing}
                        categoriasServ={categoriasServ}
                        handleSubmit={handleSubmit}
                        Cancelar={Cancelar}
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
                                <button
                                    type="button"
                                    onClick={handleNovaCategoria}
                                    className={styles.button_newCategory}
                                >
                                    Nova Categoria
                                </button>

                                <button
                                    type="button"
                                    onClick={handleEditCategoria}
                                    className={styles.button_editCategory}
                                >
                                    Editar Categoria
                                </button>

                                <button
                                    type="button"
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
                                        handleSubmit(selectedServico);
                                    }}
                                    disabled={isViewing}
                                >
                                    Salvar
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}

            <ModalNovaCategoria
                isOpen={modalCategoriaOpen}
                onClose={() => setModalCategoriaOpen(false)}
                onCategoriaCriada={handleCategoriaCriada}
            />

            <EditarCategoria
                isOpen={editarCategoriaOpen}
                onClose={() => setEditarCategoriaOpen(false)}
                onCategoriaExcluida={handleCategoriaExcluida}
                listarCategoriasServAtivas={ListarCategoriasServAtivas}
            />
        </div>
    );
}
