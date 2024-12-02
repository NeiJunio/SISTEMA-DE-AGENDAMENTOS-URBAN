'use client'; // Identifica o código como client-side no Next.js.

import { useState, useEffect } from 'react'; // Hooks do React para estado e efeito.
import styles from './page.module.css'; // Importa estilos específicos da página.

import api from '@/services/api'; // Serviço para chamadas à API.

import { PiListMagnifyingGlassBold } from "react-icons/pi"; // Ícones de lista e pesquisa.
import { MdRemoveRedEye, MdEdit } from "react-icons/md"; // Ícones para visualizar e editar.
import { parseISO, format } from 'date-fns'; // Biblioteca para manipulação de datas.
import Swal from 'sweetalert2'; // Biblioteca para exibir alertas.

import FormCliente from '@/components/FormCliente'; // Componente do formulário de cliente.
import ModalRelacionarVeiculo from '@/components/relacionarVeiculo'; // Modal para associar veículos aos clientes.

export default function CadCliente() {
    const [usuarios, setUsuarios] = useState([]); // Estado para armazenar a lista de usuários.
    const [filteredUsers, setFilteredUsers] = useState([]); // Usuários filtrados com base em critérios.
    const [statusFilter, setStatusFilter] = useState('todos'); // Filtro para status dos usuários.
    const [tipoUsuarioFilter, setTipoUsuarioFilter] = useState('todos'); // Filtro para tipo de usuário (admin/usuário).
    const [searchText, setSearchText] = useState(''); // Texto de busca.
    const [showForm, setShowForm] = useState(false); // Controla a exibição do formulário.
    const [isViewing, setIsViewing] = useState(false); // Modo de visualização de usuário.
    const [isEditing, setIsEditing] = useState(false); // Modo de edição de usuário.
    const [sortedColumn, setSortedColumn] = useState(null); // Coluna atualmente ordenada.
    const [isAsc, setIsAsc] = useState(true); // Ordem de classificação (ascendente/descendente).
    const [senhaErro, setSenhaErro] = useState([]); // Armazena erros relacionados à senha.
    const [focused, setFocused] = useState(false); // Indica se o campo de senha está focado.
    const [senha, setSenha] = useState(''); // Estado para senha.
    const [modalCategoriaOpen, setModalCategoriaOpen] = useState(false); // Controla a abertura do modal de categorias.
    const [currentPage, setCurrentPage] = useState(1); // Página atual para paginação.
    const [selectedUser, setSelectedUser] = useState({ // Objeto do usuário atualmente selecionado.
        usu_nome: '',
        usu_cpf: '',
        usu_data_nasc: '',
        usu_sexo: '',
        usu_telefone: '',
        usu_email: '',
        usu_observ: '',
        usu_acesso: 0,
        usu_senha: '',
        usu_situacao: 1,
    });

    const usersPerPage = 15; // Define o número de usuários exibidos por página.

    // Calcula os índices para exibição da página atual.
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser); // Lista os usuários da página atual.

    useEffect(() => {
        ListarUsuarios(); // Chamada inicial para carregar usuários.
    }, []);

    useEffect(() => {
        setFilteredUsers(usuarios); // Atualiza os usuários filtrados quando a lista muda.
    }, [usuarios]);

    useEffect(() => {
        handleSearch(); // Aplica a lógica de busca ao alterar filtros ou texto de busca.
    }, [usuarios, statusFilter, tipoUsuarioFilter, searchText]);

    const Create = () => {
        // Limpa o estado do usuário selecionado e abre o formulário.
        setSelectedUser({
            usu_nome: '',
            usu_cpf: '',
            usu_data_nasc: '',
            usu_sexo: '',
            usu_telefone: '',
            usu_email: '',
            usu_observ: '',
            usu_acesso: 0,
            usu_senha: '',
            usu_situacao: 1,
        });
        setShowForm(true);
    };

    const ListarUsuarios = async () => {
        try {
            const response = await api.get('/usuarios'); // Busca usuários da API.

            // Ordena os usuários por nome em ordem alfabética.
            const sortedUsers = response.data.dados.sort((a, b) => {
                if (a.usu_nome < b.usu_nome) return -1;
                if (a.usu_nome > b.usu_nome) return 1;
                return 0;
            });

            setUsuarios(sortedUsers); // Atualiza o estado com os usuários ordenados.
        } catch (error) {
            // Exibe alerta em caso de erro ao buscar usuários.
            console.error("Erro ao buscar os usuários:", error);
            Swal.fire({
                title: "Erro!",
                text: "Não foi possível carregar os usuários.",
                icon: "error",
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    const handleSearch = () => {
        // Reseta a ordenação ao realizar uma nova busca.
        setSortedColumn(null);
        setIsAsc(true);

        // Filtra os usuários com base nos critérios selecionados.
        const result = usuarios.filter((usuario) => {
            const statusMatch =
                statusFilter === 'todos' ||
                (statusFilter === 'ativo' && usuario.usu_situacao === 1) ||
                (statusFilter === 'inativo' && usuario.usu_situacao === 0);

            const tipoMatch = tipoUsuarioFilter === 'todos' ||
                (tipoUsuarioFilter === 'admin' && usuario.usu_acesso === 1) ||
                (tipoUsuarioFilter === 'usuario' && usuario.usu_acesso === 0);

            const searchTextMatch = searchText === '' ||
                usuario.usu_nome.toLowerCase().includes(searchText.toLowerCase()) ||
                usuario.usu_email.toLowerCase().includes(searchText.toLowerCase()) ||
                usuario.usu_cpf.includes(searchText);

            return statusMatch && tipoMatch && searchTextMatch;
        });

        setFilteredUsers(result); // Atualiza a lista de usuários filtrados.
        setCurrentPage(1); // Reseta para a primeira página.
    };

    const handleViewUser = (usuario) => {
        setSelectedUser(usuario);
        setShowForm(true);
        setIsViewing(true);
        setIsEditing(false);
    };

    const handleEditUser = (usuario) => {
        setSelectedUser(usuario);
        setShowForm(true);
        setIsViewing(false);
        setIsEditing(true);
    };

    const handleExit = () => {
        setShowForm(false);
        setSelectedUser({
            usu_nome: '',
            usu_cpf: '',
            usu_data_nasc: '',
            usu_sexo: '',
            usu_telefone: '',
            usu_email: '',
            usu_observ: '',
            usu_acesso: 0,
            usu_senha: '',
            usu_situacao: 1,
        });
        setIsViewing(false);
        setIsEditing(false);
    };

    const handleSubmit = async (usuario) => {
        const errors = []; // Array para armazenar mensagens de erro

        // Valida o CPF do usuário e, se inválido, adiciona o erro ao array
        const cpfError = await validarCPF(usuario.usu_cpf);
        if (cpfError) {
            errors.push(cpfError);
        }

        // Valida o email do usuário e, se inválido, adiciona o erro ao array
        const emailError = await validaEmail(usuario);
        if (emailError) {
            errors.push(emailError);
        }

        // Valida a senha do usuário; se houver erros, adiciona ao array, senão limpa o erro
        const senhaError = validarSenha(usuario.usu_senha);
        if (senhaError.length > 0) {
            errors.push(senhaError.join(' ')); // Junta os erros de senha em uma única string
        } else {
            setSenhaErro(''); // Limpa o erro de senha se não houver
        }

        // Se houver erros, exibe um alerta ao usuário e encerra a execução
        if (errors.length > 0) {
            Swal.fire({
                title: 'Dados Incorretos',
                html: errors.join('<br/>'), // Exibe os erros como uma lista HTML
                icon: 'error',
                confirmButtonText: 'OK',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
            return;
        }

        try {
            let response;

            // Verifica se é uma edição (usu_id existente) ou criação de novo usuário
            if (usuario.usu_id) {
                response = await api.patch(`/usuarios/${usuario.usu_id}`, usuario); // Atualiza o usuário
            } else {
                response = await api.post('/usuarios', usuario); // Cria um novo usuário
            }

            // Exibe mensagem de sucesso e atualiza a lista de usuários
            Swal.fire({
                title: 'Sucesso!',
                text: response.data.mensagem,
                icon: 'success',
                iconColor: "rgb(40, 167, 69)",
                confirmButtonColor: "rgb(40, 167, 69)",
            });

            ListarUsuarios(); // Atualiza a lista de usuários
            setShowForm(false); // Fecha o formulário
        } catch (error) {
            const backendErrors = [];

            // Processa os erros retornados pelo backend
            if (error.response && error.response.data) {
                if (error.response.data.erros && Array.isArray(error.response.data.erros)) {
                    backendErrors.push(...error.response.data.erros); // Adiciona múltiplos erros
                } else if (error.response.data.mensagem) {
                    backendErrors.push(error.response.data.mensagem); // Adiciona mensagem de erro única
                }
            }

            // Exibe os erros do backend ou uma mensagem genérica de erro
            if (backendErrors.length > 0) {
                Swal.fire({
                    title: 'Erro!',
                    html: backendErrors.join('<br/>'),
                    icon: 'error',
                    iconColor: '#d33',
                    confirmButtonColor: '#d33',
                });
            } else {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao salvar usuário.',
                    icon: 'error',
                    iconColor: '#d33',
                    confirmButtonColor: '#d33',
                });
            }
        }
    };

    const validarSenha = (senha) => {
        const minLength = 8; // Tamanho mínimo para a senha
        const hasUpperCase = /[A-Z]/.test(senha); // Verifica se há letras maiúsculas
        const hasLowerCase = /[a-z]/.test(senha); // Verifica se há letras minúsculas
        const hasNumber = /\d/.test(senha); // Verifica se há números
        const hasSpecialChar = /[!@#$%^&*]/.test(senha); // Verifica se há caracteres especiais
        const hasSpaces = /\s/.test(senha); // Verifica se há espaços em branco

        let errorMessage = []; // Array para armazenar mensagens de erro

        if (senha.length < minLength) {
            errorMessage.push(`Pelo menos ${minLength} caracteres.`);
        }
        if (!hasUpperCase) {
            errorMessage.push('Uma letra maiúscula.');
        }
        if (!hasLowerCase) {
            errorMessage.push('Uma letra minúscula.');
        }
        if (!hasNumber) {
            errorMessage.push('Um número.');
        }
        if (!hasSpecialChar) {
            errorMessage.push('Um caractere especial (ex: !@#$%^&*).');
        }
        if (hasSpaces) {
            errorMessage.push('Sem espaços em branco.');
        }

        return errorMessage.length > 0 ? errorMessage : []; // Retorna os erros ou uma lista vazia
    };

    const handleFocus = () => {
        setFocused(true); // Define que o campo está focado
    };

    const handleBlur = () => {
        setFocused(false); // Remove o foco do campo
        validarSenha(senha); // Valida a senha quando o foco é removido
    };

    const validarCPF = async (cpf) => {
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/; // Valida o formato do CPF (ex: 123.456.789-00)

        if (!cpfRegex.test(cpf)) {
            return 'CPF inválido.';
        }

        const numbersOnly = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

        // Valida o tamanho e se todos os dígitos são iguais
        if (numbersOnly.length !== 11 || /^(\d)\1+$/.test(numbersOnly)) {
            return 'CPF inválido.';
        }

        // Validação matemática dos dígitos verificadores
        let soma = 0;
        let resto;

        for (let i = 1; i <= 9; i++) {
            soma += parseInt(numbersOnly.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(numbersOnly.substring(9, 10))) {
            return 'CPF inválido.';
        }

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(numbersOnly.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(numbersOnly.substring(10, 11))) {
            return 'CPF inválido.';
        }

        // Verifica se o CPF já está cadastrado no backend
        try {
            const response = await api.post('/usuarios/verificarCpf', { usu_cpf: cpf });
            if (response.data.sucesso && response.data.dados) {
                return 'CPF já está cadastrado.';
            }
        } catch (error) {
            console.error('Erro na verificação do CPF:', error);
            return 'Erro na verificação do CPF. Por favor, tente novamente.';
        }
        return null; // Retorna nulo se não houver erros
    };

    // Função para verificar o formato do email
    function checkEmail(email) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
        );
    };

    const validaEmail = async (usuario) => {
        const email = usuario.usu_email.trim(); // Remove espaços em branco do email
        const id = usuario.usu_id; // ID do usuário (se existir)

        // Valida se o email está vazio ou é inválido
        if (!email) {
            return 'O e-mail do usuário é obrigatório.';
        } else if (!checkEmail(email)) {
            return 'Insira um e-mail válido.';
        }

        // Verifica se o email já está cadastrado no backend
        try {
            const response = await api.post('/usuarios/verificarEmail', { usu_email: email, usu_id: id });
            if (response.data.sucesso && response.data.dados) {
                return 'Email já está cadastrado.';
            }
        } catch (error) {
            console.error('Erro na verificação do email:', error);
            return 'Erro na verificação do email. Por favor, tente novamente.';
        }
        return null; // Retorna nulo se não houver erros
    };

    const sortByColumn = (column) => {
        let newIsAsc = true; // Define a ordem como ascendente inicialmente

        // Inverte a ordem caso a coluna seja a mesma
        if (sortedColumn === column) {
            newIsAsc = !isAsc;
        }

        // Ordena os dados da tabela com base na coluna e ordem
        const sortedData = [...filteredUsers].sort((a, b) => {
            if (a[column] < b[column]) return newIsAsc ? -1 : 1;
            if (a[column] > b[column]) return newIsAsc ? 1 : -1;
            return 0;
        });

        setFilteredUsers(sortedData); // Atualiza os dados filtrados
        setSortedColumn(column); // Define a coluna como a coluna atual
        setIsAsc(newIsAsc); // Atualiza a ordem de classificação
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
                    setSelectedUser({
                        usu_nome: '',
                        usu_cpf: '',
                        usu_data_nasc: '',
                        usu_sexo: '',
                        usu_telefone: '',
                        usu_email: '',
                        usu_observ: '',
                        usu_acesso: 0,
                        usu_senha: '',
                        usu_situacao: 1,
                    });
                    setIsViewing(false);
                    setIsEditing(false);
                });
            }
        });
    };

    const handleNovaCategoria = () => {
        setModalCategoriaOpen(true);
    };

    const handleCategoriaCriada = () => {
        ListarCategoriasServ();
    };

    return (
        <div id="clientes" className={styles.content_section}>
            <h2 className={styles.title_page}>Gerenciamento de Clientes</h2>

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
                            <div className={styles.filterGroup}>
                                <label htmlFor="tipoUsuario" className={styles.labelFilter}>Tipo de Usuário</label>
                                <select
                                    id="tipoUsuario"
                                    className={styles.filterSelect}
                                    value={tipoUsuarioFilter}
                                    onChange={(e) => setTipoUsuarioFilter(e.target.value)}
                                >
                                    <option value="todos">Todos</option>
                                    <option value="admin">Admin</option>
                                    <option value="usuario">Usuário</option>
                                </select>
                            </div>

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
                                        onClick={() => sortByColumn('usu_id')}>
                                        Código
                                        {sortedColumn === 'usu_id' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.nome}`}
                                        onClick={() => sortByColumn('usu_nome')}>
                                        Nome
                                        {sortedColumn === 'usu_nome' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.cpf}`}
                                        onClick={() => sortByColumn('usu_cpf')}>
                                        CPF
                                        {sortedColumn === 'usu_cpf' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.dataNasc}`}
                                        onClick={() => sortByColumn('usu_data_nasc')}>
                                        Data de Nascimento
                                        {sortedColumn === 'usu_data_nasc' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.telefone}`}
                                        onClick={() => sortByColumn('usu_telefone')}>
                                        Telefone
                                        {sortedColumn === 'usu_telefone' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th
                                        className={`${styles.tableHeader} ${styles.email}`}
                                        onClick={() => sortByColumn('usu_email')}>
                                        Email
                                        {sortedColumn === 'usu_email' ? (isAsc ? '▲' : '▼') : ''}
                                    </th>
                                    <th className={`${styles.tableHeader} ${styles.acao}`}>Ações</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {currentUsers.length > 0 ? (
                                    currentUsers?.map((usuario) => (
                                        <tr key={usuario.usu_id}>
                                            <td className={styles.tdId}>{usuario.usu_id}</td>
                                            <td>{usuario.usu_nome}</td>
                                            <td>{usuario.usu_cpf}</td>
                                            <td>{format(parseISO(usuario?.usu_data_nasc), 'dd/MM/yyyy')}</td>
                                            <td>{usuario.usu_telefone}</td>
                                            <td>{usuario.usu_email}</td>
                                            <td>
                                                <div className={styles.actionIcons}>
                                                    <i>
                                                        <MdRemoveRedEye
                                                            title="Visualizar"
                                                            onClick={() => handleViewUser(usuario)}
                                                        />
                                                    </i>
                                                    <i>
                                                        <MdEdit
                                                            title="Editar"
                                                            onClick={() => handleEditUser(usuario)}
                                                        />
                                                    </i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">Nenhum usuário encontrado</td>
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
                            onClick={() => setCurrentPage(prev => (filteredUsers.length > indexOfLastUser ? prev + 1 : prev))}
                            disabled={filteredUsers.length <= indexOfLastUser}
                        >
                            Próxima
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <FormCliente
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        isViewing={isViewing}
                        isEditing={isEditing}
                        handleSubmit={handleSubmit}
                        Cancelar={Cancelar}
                        setSenhaErro={setSenhaErro}
                        senhaErro={senhaErro}
                        validarSenha={validarSenha}
                        focused={focused}
                        senha={senha}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
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
                                            className={styles.button_AddVeiculo}
                                            onClick={handleNovaCategoria}
                                        >
                                            Veículo
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
                                                handleSubmit(selectedUser);
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
                                                handleSubmit(selectedUser);
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

            <ModalRelacionarVeiculo
                isOpen={modalCategoriaOpen}
                usuarioId={selectedUser.usu_id}
                onClose={() => setModalCategoriaOpen(false)}
                onCategoriaCriada={handleCategoriaCriada}
            />
        </div>
    );
}