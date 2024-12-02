'use client';

import { useState, useEffect } from 'react'; // Importa hooks do React
import styles from './page.module.css'; // Importa o arquivo de estilos CSS

import api from '@/services/api'; // Importa a API para realizar as requisições

import FormVeiculo from '@/components/FormVeiculo'; // Importa o componente para o formulário de veículo
import ModalRelacionarUsuario from '@/components/relacionarUsuario'; // Importa o componente do modal de relacionamento com usuário
import ModalProprietarios from '@/components/editarRelacaoUsuarioVeiculo'; // Importa o componente para editar o relacionamento com proprietário

import { MdRemoveRedEye, MdEdit } from "react-icons/md"; // Importa ícones para visualização e edição
import { PiListMagnifyingGlassBold } from "react-icons/pi"; // Importa ícone de busca
import Swal from 'sweetalert2'; // Importa a biblioteca para exibir alertas

export default function Veiculos() {
    // Definindo os estados do componente
    const [veiculos, setVeiculos] = useState([]); // Lista de veículos
    const [filteredVeiculos, setFilteredVeiculos] = useState([]); // Veículos filtrados com base na busca e status
    const [showForm, setShowForm] = useState(false); // Controla a visibilidade do formulário de veículo
    const [searchText, setSearchText] = useState(''); // Texto de busca
    const [statusFilter, setStatusFilter] = useState('todos'); // Filtro de status (todos, pendente, etc.)
    const [isViewing, setIsViewing] = useState(false); // Controle de visualização
    const [sortedColumn, setSortedColumn] = useState(null); // Coluna de ordenação da tabela
    const [isAsc, setIsAsc] = useState(true); // Ordenação ascendente ou descendente
    const [currentPage, setCurrentPage] = useState(1); // Página atual para paginação
    const [selectedVeic, setSelectedVeic] = useState(null); // Veículo selecionado para edição
    const [isEditing, setIsEditing] = useState(false); // Controle de edição de veículo
    const [categorias, setCategorias] = useState([]); // Lista de categorias de veículos
    const [marcas, setMarcas] = useState([]); // Lista de marcas de veículos
    const [modelos, setModelos] = useState([]); // Lista de modelos de veículos
    const [modalOpen, setModalOpen] = useState(false); // Controle de exibição do modal de veículo
    const [modalOpenRelacao, setModalOpenRelacao] = useState(false); // Controle de exibição do modal de relacionamento
    const [placaErro, setPlacaErro] = useState(''); // Erro de validação da placa
    const [anoErro, setAnoErro] = useState(''); // Erro de validação do ano
    const [isPlacaValidando, setIsPlacaValidando] = useState(false); // Controle de validação da placa
    const [isSubmitting, setIsSubmitting] = useState(false); // Controle de envio de formulário

    const usersPerPage = 15; // Quantidade de veículos exibidos por página

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentVeiculos = filteredVeiculos.slice(indexOfFirstUser, indexOfLastUser); // Veículos da página atual

    // Hook useEffect para carregar a lista de veículos quando o componente for montado
    useEffect(() => {
        ListarVeiculos();
    }, []);

    // Hook useEffect para aplicar os filtros de busca e status sempre que um deles for alterado
    useEffect(() => {
        handleSearch();
    }, [searchText, statusFilter, veiculos]);

    // Função para listar os modelos de veículos com base na marca selecionada
    const ListarModelos = async (marID) => {
        try {
            const response = await api.get(`/modelos/cat/${selectedVeic.cat_id}/mar/${marID}`);
            setModelos(response.data.dados); // Atualiza a lista de modelos
        } catch (error) {
            console.error("Erro ao buscar os modelos:", error); // Exibe erro no console
        }
    }

    // Função para listar as categorias de veículos
    const ListarCategorias = async () => {
        try {
            const response = await api.get('/categorias');
            setCategorias(response.data.dados); // Atualiza a lista de categorias
        } catch (error) {
            console.error("Erro ao buscar as categorias:", error); // Exibe erro no console
        }
    }

    // Função para listar as marcas de veículos com base na categoria selecionada
    const ListarMarcas = async (catId) => {
        try {
            const response = await api.get(`/marcas/categorias/${catId}`);
            setMarcas(response.data.dados); // Atualiza a lista de marcas
        } catch (error) {
            console.error("Erro ao buscar as marcas:", error); // Exibe erro no console
        }
    }

    // Função para listar os veículos
    const ListarVeiculos = async () => {
        try {
            const response = await api.get('/veiculos');
            setVeiculos(response.data.dados); // Atualiza a lista de veículos
            handleSearch(); // Aplica os filtros de busca e status
        } catch (error) {
            console.error("Erro ao buscar os veículos:", error); // Exibe erro no console
            // Exibe um alerta de erro usando a biblioteca SweetAlert2
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível carregar os veículos.',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    const handleSearch = () => {
        // Resetando a coluna de ordenação e o estado de ordenação para o padrão
        setSortedColumn(null);
        setIsAsc(true);

        // Filtrando os veículos com base no status e no texto de pesquisa
        const result = veiculos.filter((veiculo) => {
            // Verificando se o status do veículo corresponde ao filtro selecionado
            const statusMatch =
                statusFilter === 'todos' ||
                (statusFilter === 'ativo' && veiculo.veic_situacao === 1) ||
                (statusFilter === 'inativo' && veiculo.veic_situacao === 0);

            // Verificando se o texto de pesquisa corresponde ao modelo, marca ou placa do veículo
            const searchTextMatch = searchText === '' ||
                (veiculo.veic_placa?.toLowerCase().includes(searchText.toLowerCase())) ||
                (veiculo.modelo?.toLowerCase().includes(searchText.toLowerCase())) ||
                (veiculo.marca?.toLowerCase().includes(searchText.toLowerCase()));

            // Retorna verdadeiro se ambos os filtros (status e texto) coincidirem
            return statusMatch && searchTextMatch;
        });

        // Atualizando a lista de veículos filtrados e resetando a página para a primeira
        setFilteredVeiculos(result);
        setCurrentPage(1);
    };

    const handleViewVeic = async (veiculo) => {
        try {
            // Realizando a requisição para buscar as informações do veículo
            const response = await api.get(`/veiculos/${veiculo.veic_id}`);

            // Verificando se a resposta foi bem-sucedida
            if (response.data.sucesso) {
                setSelectedVeic(response.data.dados); // Atualizando o estado com as informações do veículo
                setShowForm(true);  // Exibindo o formulário
                setIsViewing(true); // Definindo que estamos visualizando o veículo
                setIsEditing(false); // Garantindo que não estamos no modo de edição
            } else {
                throw new Error(response.data.mensagem); // Lançando um erro caso a resposta não seja bem-sucedida
            }
        } catch (error) {
            // Tratando erros na requisição
            console.error("Erro ao visualizar veículo:", error);
            if (error.response) {
                console.error("Dados do erro:", error.response.data);
                console.error("Status do erro:", error.response.status);
            }
            // Exibindo um alerta com o erro
            Swal.fire({
                title: 'Erro!',
                text: error.response ? error.response.data.mensagem : 'Erro desconhecido ao buscar veículo.',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    const handleEditVeic = async (veiculo) => {
        try {
            // Realizando a requisição para buscar as informações do veículo
            const response = await api.get(`/veiculos/${veiculo.veic_id}`);

            // Verificando se a resposta foi bem-sucedida
            if (response.data.sucesso) {
                setSelectedVeic(response.data.dados); // Atualizando o estado com as informações do veículo para edição
                setShowForm(true);  // Exibindo o formulário
                setIsViewing(false); // Garantindo que não estamos no modo de visualização
                setIsEditing(true);  // Definindo que estamos no modo de edição
            } else {
                throw new Error(response.data.mensagem); // Lançando um erro caso a resposta não seja bem-sucedida
            }
        } catch (error) {
            // Tratando erros na requisição
            console.error("Erro ao visualizar veículo:", error);
            if (error.response) {
                console.error("Dados do erro:", error.response.data);
                console.error("Status do erro:", error.response.status);
            }
            // Exibindo um alerta com o erro
            Swal.fire({
                title: 'Erro!',
                text: error.response ? error.response.data.mensagem : 'Erro desconhecido ao buscar veículo.',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    const handleExit = () => {
        // Resetando os estados relacionados ao formulário e ao veículo selecionado
        setShowForm(false);  // Fechando o formulário
        setSelectedVeic([]);  // Limpando os dados do veículo selecionado
        setIsViewing(false);  // Resetando o estado de visualização
        setIsEditing(false);  // Resetando o estado de edição
    };

    // Função para tratar a mudança na placa do veículo
    const handlePlacaChange = async (placa) => {
        // Atualiza o estado com o novo valor de placa
        setSelectedVeic(prevState => ({
            ...prevState,
            veic_placa: placa
        }));
        // Limpa a mensagem de erro
        setPlacaErro('');

        // Expressão regular para validar o formato da placa
        const placaRegex = /^[A-Z]{3}-\d{4}$|^[A-Z]{3}-\d{1}[A-Z]{1}\d{2}$/;

        // Verifica se a placa está no formato correto
        if (!placaRegex.test(placa)) {
            setPlacaErro('');
            return false; // Retorna falso se a placa for inválida
        }

        try {
            // Inicia a validação da placa
            setIsPlacaValidando(true);

            // Faz uma requisição para verificar a placa na API
            const response = await api.post('/verificarPlaca', { veic_placa: placa });

            // Se a resposta for bem-sucedida, limpa o erro e retorna verdadeiro
            if (response.status === 200) {
                setPlacaErro('');
                return true;
            }
        } catch (error) {
            // Trata os erros de requisição
            console.error("Erro ao validar placa:", error);

            // Se houver erro na resposta da API
            if (error.response) {
                console.error("Erro da API:", error.response.data);
                setPlacaErro(`teste : ${error.response.data.mensagem}`);
            }
            // Se a requisição não receber resposta da API
            else if (error.request) {
                console.error("Nenhuma resposta da API:", error.request);
                setPlacaErro('Nenhuma resposta da API.');
            }
            // Se houver erro na requisição em si
            else {
                console.error("Erro na requisição:", error.message);
                setPlacaErro('Erro na requisição ao verificar a placa.');
            }
            return false; // Retorna falso se ocorrer erro
        } finally {
            // Finaliza o processo de validação da placa
            setIsPlacaValidando(false);
        }
    };


    // Função para validar o ano do veículo
    const validarAno = (ano) => {
        const anoAtual = new Date().getFullYear(); // Ano atual
        const anoMax = anoAtual + 1; // Ano máximo permitido (ano atual + 1)
        const anoNum = parseInt(ano, 10); // Converte o ano para número

        // Verifica se o ano é válido (entre 1886 e o ano máximo)
        if (isNaN(anoNum) || anoNum < 1886 || anoNum > anoMax) {
            setAnoErro(`O ano deve ser entre 1886 e ${anoMax}.`);
            return false; // Retorna falso se o ano for inválido
        }

        setAnoErro(''); // Limpa a mensagem de erro
        return true; // Retorna verdadeiro se o ano for válido
    };

    // Função para tratar o envio do formulário de veículo
    const handleSubmit = async (veiculo) => {
        setIsSubmitting(true); // Indica que o envio está em andamento
        setPlacaErro(''); // Limpa erro de placa
        setAnoErro(''); // Limpa erro de ano

        let placaValida = true;

        // Se a placa ou ID do veículo foram alterados, valida a nova placa
        if (!veiculo.veic_id || veiculo.veic_placa !== selectedVeic.veic_placa) {
            placaValida = await handlePlacaChange(veiculo.veic_placa);
        }

        // Valida o ano do veículo
        const anoValido = validarAno(veiculo.veic_ano);

        // Se a placa ou o ano forem inválidos, cancela o envio
        if (!placaValida || !anoValido) {
            setIsSubmitting(false);
            return;
        }

        // Prepara os dados para envio
        const data = {
            mod_id: veiculo.mod_id,
            veic_placa: veiculo.veic_placa,
            veic_ano: veiculo.veic_ano,
            veic_cor: veiculo.veic_cor,
            veic_combustivel: veiculo.veic_combustivel,
            veic_observ: veiculo.veic_observ || '',
            veic_situacao: veiculo.veic_situacao,
        };

        try {
            let response;
            // Se o veículo já tem ID, realiza um PATCH para atualização, caso contrário, cria um novo veículo com POST
            if (veiculo.veic_id) {
                response = await api.patch(`/veiculos/${veiculo.veic_id}`, data);
            } else {
                response = await api.post('/veiculos', data);
            }

            // Exibe mensagem de sucesso
            Swal.fire({
                title: 'Sucesso!',
                text: response.data.mensagem,
                icon: 'success',
                iconColor: "rgb(40, 167, 69)",
                confirmButtonColor: "rgb(40, 167, 69)",
            });

            // Limpa o formulário e atualiza a lista de veículos
            setShowForm(false);
            setSelectedVeic(null);
            setIsViewing(false);
            setIsEditing(false);
            ListarVeiculos();

        } catch (error) {
            // Exibe erro em caso de falha ao salvar o veículo
            console.error("Erro ao salvar veículo:", error);
            Swal.fire({
                title: 'Erro!',
                text: error.response?.data.mensagem || 'Erro desconhecido.',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
        setIsSubmitting(false); // Finaliza o envio
    };

    // Função para criar um novo veículo
    const Create = () => {
        // Reseta os dados do veículo selecionado
        setSelectedVeic({
            cat_id: '',
            mar_id: '',
            mod_id: '',
            veic_placa: '',
            veic_ano: '',
            veic_cor: '',
            veic_combustivel: '',
            veic_observ: '',
            veic_situacao: 1,
        });
        setShowForm(true); // Exibe o formulário
        ListarCategorias(); // Atualiza a lista de categorias
    };

    // Função para ordenar os dados pela coluna selecionada
    const sortByColumn = (column) => {
        let newIsAsc = true;  // Define a ordem crescente por padrão

        // Verifica se a coluna já está sendo ordenada, caso esteja, inverte a ordem
        if (sortedColumn === column) {
            newIsAsc = !isAsc;
        }

        // Ordena os dados com base na coluna selecionada
        const sortedData = [...filteredVeiculos].sort((a, b) => {
            // Compara os valores de 'a' e 'b' para definir a ordem
            if (a[column] < b[column]) return newIsAsc ? -1 : 1;
            if (a[column] > b[column]) return newIsAsc ? 1 : -1;
            return 0;  // Caso os valores sejam iguais
        });

        // Atualiza o estado com os dados ordenados
        setFilteredVeiculos(sortedData);
        setSortedColumn(column);  // Define a coluna ordenada
        setIsAsc(newIsAsc);  // Atualiza o estado da ordem de ordenação
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
            // Verifica se o usuário confirmou o cancelamento
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Cancelado!",
                    text: "As alterações foram canceladas.",
                    icon: "success",
                    iconColor: "rgb(40, 167, 69)",
                    confirmButtonColor: "rgb(40, 167, 69)",
                }).then(() => {
                    // Reseta os estados e lista novamente os veículos
                    setShowForm(false);
                    setSelectedVeic(null);
                    setIsViewing(false);
                    setIsEditing(false);
                    ListarVeiculos();
                });
            }
        });
    }

    // Função para abrir o modal de relacionamento de usuário
    const handleRelacionarUsuario = () => {
        setModalOpen(true);  // Abre o modal de relacionamento de usuário
    }

    // Função para abrir o modal de edição de relacionamento
    const handleEditarRelacao = () => {
        setModalOpenRelacao(true);  // Abre o modal de edição de relacionamento
    }

    return (
        <div id="veiculos" className={styles.content_section}>
            <h2 className={styles.title_page}>Gerenciamento de Veículos</h2>

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
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        handleSearch();
                                    }}
                                >
                                    <option value="todos">Todos</option>
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </div>

                            <button className={styles.newButton} onClick={Create}>Novo</button>
                        </div>
                    </div>

                    <div className={styles.resultTableContainer}>
                        <table className={styles.resultTable}>
                            <thead className={styles.tableHead}>
                                <tr>
                                    <th
                                        className={`${styles.tableHeader} ${styles.id}`}
                                        onClick={() => sortByColumn('veic_id')}>
                                        Código
                                        {sortedColumn === 'veic_id' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th className={`${styles.tableHeader} ${styles.modelo}`}
                                        onClick={() => sortByColumn('modelo')}>
                                        Modelo
                                        {sortedColumn === 'modelo' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th className={`${styles.tableHeader} ${styles.marca}`}
                                        onClick={() => sortByColumn('marca')}>
                                        Marca
                                        {sortedColumn === 'marca' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th className={`${styles.tableHeader} ${styles.placa}`}
                                        onClick={() => sortByColumn('veic_placa')}>
                                        Placa
                                        {sortedColumn === 'veic_placa' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th className={`${styles.tableHeader} ${styles.cor}`}
                                        onClick={() => sortByColumn('veic_cor')}>
                                        Cor
                                        {sortedColumn === 'veic_cor' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th className={`${styles.tableHeader} ${styles.combustivel}`}
                                        onClick={() => sortByColumn('veic_combustivel')}>
                                        Combustível
                                        {sortedColumn === 'veic_combustivel' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th className={`${styles.tableHeader} ${styles.proprietario}`}
                                        onClick={() => sortByColumn('proprietarios')}>
                                        Proprietário
                                        {sortedColumn === 'proprietarios' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th className={`${styles.tableHeader} ${styles.acao}`}>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {currentVeiculos.length > 0 ? (
                                    currentVeiculos.map((veiculo) => (
                                        <tr key={veiculo.veic_id}>
                                            <td className={styles.tdId}>{veiculo.veic_id}</td>
                                            <td>{veiculo.modelo}</td>
                                            <td>{veiculo.marca}</td>
                                            <td>{veiculo.veic_placa}</td>
                                            <td>{veiculo.veic_cor}</td>
                                            <td>{veiculo.veic_combustivel}</td>
                                            <td className={styles.tdProprietario}>
                                                {veiculo.num_proprietarios > 1 ? (
                                                    <div className={styles.customSelect}>
                                                        <select>
                                                            <option value="" disabled>Selecionar Proprietário</option>
                                                            {veiculo.proprietarios.split(', ').map((proprietario, index) => (
                                                                <option key={index} value={proprietario}>{proprietario}</option>
                                                            ))}
                                                        </select>
                                                        <span> (+{veiculo.num_proprietarios - 1})</span>
                                                    </div>
                                                ) : (
                                                    <span>{veiculo.proprietarios}</span>
                                                )}
                                            </td>

                                            <td>
                                                <div className={styles.actionIcons}>
                                                    <i>
                                                        <MdRemoveRedEye
                                                            title="Visualizar"
                                                            onClick={() => handleViewVeic(veiculo)}
                                                        />
                                                    </i>
                                                    <i>
                                                        <MdEdit
                                                            title="Editar"
                                                            onClick={() => handleEditVeic(veiculo)}
                                                        />
                                                    </i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">Nenhum veículo encontrado</td>
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
                            onClick={() => setCurrentPage(prev => (veiculos.length > indexOfLastUser ? prev + 1 : prev))}
                            disabled={veiculos.length <= indexOfLastUser}
                        >
                            Próxima
                        </button>
                    </div>
                </>
            ) : (<>

                <FormVeiculo
                    selectedVeic={selectedVeic}
                    setSelectedVeic={setSelectedVeic}
                    isViewing={isViewing}
                    isEditing={isEditing}
                    categorias={categorias}
                    marcas={marcas}
                    listarMarcas={ListarMarcas}
                    modelos={modelos}
                    listarModelos={ListarModelos}
                    handleSubmit={handleSubmit}
                    Cancelar={Cancelar}
                    placaErro={placaErro}
                    anoErro={anoErro}
                    isPlacaValidando={isPlacaValidando}
                    isSubmitting={isSubmitting}
                    handlePlacaChange={handlePlacaChange}
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
                                        type="button"
                                        className={styles.button_AddUsuario}
                                        onClick={handleRelacionarUsuario}
                                    >
                                        Proprietários
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.button_relation}
                                        onClick={handleEditarRelacao}
                                    >
                                        Relacionamento
                                    </button>
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
                                            handleSubmit(selectedVeic);
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
                                            handleSubmit(selectedVeic);
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

            <ModalRelacionarUsuario
                isOpen={modalOpen}
                veiculoId={selectedVeic?.veic_id}
                onClose={() => setModalOpen(false)}
            />

            <ModalProprietarios
                isOpen={modalOpenRelacao}
                veiculoId={selectedVeic?.veic_id}
                onClose={() => setModalOpenRelacao(false)}
            />
        </div>
    );
}