import React, { useState } from 'react'; // Importa React e os hooks useState e useEffect
import styles from './index.module.css'; // Importa os estilos CSS para o componente

import api from '@/services/api'; // Importa o serviço de API para chamadas HTTP

import InputMask from "react-input-mask"; // Importa a biblioteca InputMask para formatar entradas de texto, como máscaras
import Swal from 'sweetalert2'; // Importa a biblioteca para exibir modais de alertas e confirmações

export default function ModalRelacionarUsuario({ isOpen, onClose, veiculoId }) {
    const [cpf, setCpf] = useState(''); // Estado para armazenar o CPF digitado
    const [usuarios, setUsuarios] = useState([]); // Estado para armazenar a lista de usuários buscados
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null); // Estado para armazenar o ID do usuário selecionado
    const [ehProprietario, setEhProprietario] = useState(false); // Estado para indicar se o usuário selecionado é proprietário
    const [dataInicial, setDataInicial] = useState(''); // Estado para armazenar a data inicial do relacionamento

    // Função para buscar usuários com base no CPF digitado
    const buscarUsuarios = async (cpfDigitado) => {
        // Verifica se o CPF digitado possui ao menos 3 caracteres
        if (cpfDigitado.trim().length >= 3) {
            try {
                // Envia uma requisição para buscar usuários pelo CPF
                const response = await api.post(`/usuarios/usu/cpf`, { usu_cpf: cpfDigitado });

                // Atualiza o estado com os dados retornados pela API
                setUsuarios(response.data.dados || []);
            } catch (error) {
                // Loga o erro no console e limpa a lista de usuários
                console.error("Erro ao buscar usuários:", error);
                setUsuarios([]);
            }
        } else {
            // Limpa a lista de usuários se o CPF for muito curto
            setUsuarios([]);
        }
    };

    // Função chamada ao clicar no botão de buscar
    const handleBuscarClick = (e) => {
        e.preventDefault(); // Previne o comportamento padrão do botão
        buscarUsuarios(cpf); // Chama a função de busca
    };

    // Função para selecionar um usuário da lista
    const handleSelectUsuario = (usu_id) => {
        setUsuarioSelecionado(usu_id); // Atualiza o ID do usuário selecionado
    };

    // Função para salvar o relacionamento entre veículo e usuário
    const handleSalvar = async () => {
        // Verifica se o usuário e a data inicial foram selecionados
        if (!usuarioSelecionado || !dataInicial) {
            // Exibe um alerta se alguma informação estiver faltando
            Swal.fire({
                title: 'Aviso',
                text: 'Selecione uma data!',
                icon: 'warning',
                iconColor: '#ff9d00',
                confirmButtonColor: '#ff9d00',
            });
            return;
        }

        // Dados a serem enviados para a API
        const dados = {
            veic_id: veiculoId, // ID do veículo
            usu_id: usuarioSelecionado, // ID do usuário selecionado
            ehproprietario: ehProprietario ? 1 : 0, // Indica se é proprietário (1 ou 0)
            data_inicial: dataInicial // Data inicial do relacionamento
        };

        try {
            // Envia os dados para a API
            await api.post(`/veiculoUsuario`, dados);

            // Exibe mensagem de sucesso
            Swal.fire({
                title: 'Sucesso!',
                text: 'Relacionamento realizado com sucesso!',
                icon: 'success',
                iconColor: "rgb(40, 167, 69)",
                confirmButtonColor: "rgb(40, 167, 69)",
            });

            // Fecha o modal e limpa os campos
            onClose();
            limparCampos();
        } catch (error) {
            // Loga o erro no console e exibe uma mensagem de erro
            console.error("Erro ao associar usuário:", error.response);
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao associar usuário!',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    // Função para limpar todos os campos do formulário
    const limparCampos = () => {
        setCpf(''); // Reseta o CPF
        setUsuarios([]); // Limpa a lista de usuários
        setUsuarioSelecionado(null); // Reseta o usuário selecionado
        setEhProprietario(false); // Reseta o estado de proprietário
        setDataInicial(''); // Reseta a data inicial
    };

    // Retorna null se o modal não estiver aberto
    if (!isOpen) return null;

    return (
        <form className={styles.modalOverlay} onSubmit={handleBuscarClick}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}> Associar Usuário</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="cpf">CPF do usuário</label>
                    <div className={styles.cpfContainer}>
                        <InputMask
                            mask="999.999.999-99"
                            type="text"
                            id="cpf"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value.toUpperCase())}
                            className={styles.inputCpf}
                            placeholder="Digite 3 dígitos no mínimo..."
                            required
                        />
                        <button type="button" onClick={handleBuscarClick} className={styles.btnBuscar}>Buscar</button>
                    </div>

                    <ul className={styles.list}>
                        <li className={styles.header}>
                            <span className={styles.spanInput}></span>
                            <span className={styles.spanId}>ID</span>
                            <span>CPF</span>
                            <span>Nome</span>
                        </li>
                        {Array.isArray(usuarios) && usuarios.length > 0 ? (
                            usuarios.map((usuario) => (
                                usuario && ( // Verificação para garantir que `usuario` não seja nulo ou indefinido
                                    <li key={usuario.usu_id || Math.random()} className={styles.item}>
                                        <span>
                                            <input
                                                type="radio"
                                                name="usuario"
                                                onChange={() => handleSelectUsuario(usuario.usu_id)}
                                                checked={usuarioSelecionado !== null && usuarioSelecionado === usuario.usu_id}
                                                className={styles.radio}
                                            />
                                        </span>
                                        <span className={styles.spanId}>{usuario.usu_id || "N/A"}</span>
                                        <span>{usuario.usu_cpf || "N/A"}</span>
                                        <span>{usuario.usu_nome || "N/A"}</span>
                                    </li>
                                )
                            ))
                        ) : (
                            <li className={styles.noResults}>Nenhum usuário encontrado</li>
                        )}
                    </ul>

                    <div className={styles.checkboxDateContainer}>
                        <label>
                            <input
                                type="checkbox"
                                checked={ehProprietario}
                                onChange={(e) => setEhProprietario(e.target.checked)}
                            />
                            É Proprietário?
                        </label>
                        <div className={styles.dateContainer}>
                            <label htmlFor="dataInicial">Data Inicial:</label>
                            <input
                                type="date"
                                id="dataInicial"
                                value={dataInicial}
                                onChange={(e) => setDataInicial(e.target.value)}
                                required
                                className={styles.inputDate}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button type="button" onClick={() => { onClose(); limparCampos(); }} className={styles.btnCancel}>Cancelar</button>
                    <button
                        type="button"
                        onClick={handleSalvar}
                        className={styles.btnSave}
                        disabled={!usuarioSelecionado || !dataInicial}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </form>
    );
}