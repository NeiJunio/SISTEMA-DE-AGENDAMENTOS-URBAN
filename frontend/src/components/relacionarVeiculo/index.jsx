import React, { useState, useEffect } from 'react'; // Importa React e os hooks useState e useEffect
import styles from './index.module.css'; // Importa os estilos CSS para o componente

import api from '@/services/api'; // Importa o serviço de API para chamadas HTTP

import Swal from 'sweetalert2'; // Importa a biblioteca para exibir modais de alertas e confirmações

export default function ModalRelacionarVeiculo({ isOpen, onClose, usuarioId }) {
    const [nome, setNome] = useState(''); // Estado para armazenar o nome digitado no campo de busca.
    const [veiculos, setVeiculos] = useState([]); // Estado para armazenar a lista de veículos retornada pela API.
    const [veiculoSelecionado, setVeiculoSelecionado] = useState(null); // Estado para armazenar o veículo selecionado pelo usuário.
    const [ehProprietario, setEhProprietario] = useState(false); // Estado para controlar se o usuário é o proprietário do veículo.
    const [dataInicial, setDataInicial] = useState(''); // Estado para armazenar a data inicial da relação entre veículo e usuário.

    // Função para buscar veículos com base no nome ou placa digitados.
    const buscarVeiculos = async (nomeDigitado) => {
        if (nomeDigitado.trim()) { // Verifica se o input não está vazio.
            try {
                // Faz uma chamada à API para buscar veículos com a placa informada.
                const response = await api.post(`veiculos/placa`, { veic_placa: nomeDigitado });
                setVeiculos(response.data.dados); // Atualiza o estado com os veículos retornados.
            } catch (error) {
                console.error("Erro ao buscar veículos:", error); // Exibe o erro no console.
            }
        } else {
            setVeiculos([]); // Limpa a lista de veículos se o campo estiver vazio.
        }
    };

    // Hook useEffect que executa a busca de veículos sempre que o estado "nome" mudar.
    useEffect(() => {
        buscarVeiculos(nome); // Chama a função buscarVeiculos com o nome digitado.
    }, [nome]);

    // Função chamada ao selecionar um veículo na lista.
    const handleSelectVeiculo = (veic_id) => {
        setVeiculoSelecionado(veic_id); // Atualiza o estado com o ID do veículo selecionado.
    };

    // Função para salvar os dados do relacionamento veículo-usuário.
    const handleSalvar = async () => {
        // Valida se o veículo e a data inicial foram preenchidos.
        if (!veiculoSelecionado || !dataInicial) {
            Swal.fire('Atenção', 'Selecione um veículo e uma data inicial.', 'warning');
            return;
        }

        // Cria o objeto com os dados a serem enviados para a API.
        const dadosVeiculo = {
            veic_id: veiculoSelecionado,
            usu_id: usuarioId,
            ehproprietario: ehProprietario ? 1 : 0, // Converte o booleano para 1 ou 0.
            data_inicial: dataInicial,
        };

        try {
            // Envia os dados para a API e exibe mensagem de sucesso.
            const response = await api.post(`/veiculoUsuario`, dadosVeiculo);
            Swal.fire({
                title: 'Sucesso!',
                text: response.data.mensagem,
                icon: 'success',
                iconColor: "rgb(40, 167, 69)",
                confirmButtonColor: "rgb(40, 167, 69)",
            });

            onClose(); // Fecha o modal.
            limparCampos(); // Limpa os campos do formulário.

        } catch (error) {
            // Trata erros de validação ou erros gerais.
            if (error.response && error.response.status === 400) {
                Swal.fire({
                    title: 'Atenção',
                    text: error.response.data.mensagem,
                    icon: 'warning',
                    iconColor: '#ff9d00',
                    confirmButtonColor: '#ff9d00',
                });
            } else {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao associar veículo!',
                    icon: 'error',
                    iconColor: '#d33',
                    confirmButtonColor: '#d33',
                });
            }
        }
    };

    // Função para limpar os campos do formulário e resetar os estados.
    const limparCampos = () => {
        setNome(''); // Limpa o campo de nome.
        setVeiculos([]); // Limpa a lista de veículos.
        setVeiculoSelecionado(null); // Reseta o veículo selecionado.
        setEhProprietario(false); // Reseta o checkbox de proprietário.
        setDataInicial(''); // Limpa o campo de data inicial.
    };

    // Retorna null caso o modal não esteja aberto.
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Associar Veículo</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="nome">Placa do veículo</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value.toUpperCase())}
                        required
                        className={styles.inputCategoria}
                    />
                    <ul className={styles.veiculosList}>
                        <li className={styles.veiculosHeader}>
                            <span className={styles.spanInput}></span>
                            <span className={styles.spanId}>ID</span>
                            <span>Placa</span>
                            <span>Modelo</span>
                        </li>
                        {veiculos.map((veiculo) => (
                            <li key={veiculo.veic_id} className={styles.veiculoItem}>
                                <span>
                                    <input
                                        type="radio"
                                        name="veiculo"
                                        onChange={() => handleSelectVeiculo(veiculo.veic_id)}
                                        checked={veiculoSelecionado === veiculo.veic_id}
                                        className={styles.radioVeiculo}
                                    />
                                </span>
                                <span className={styles.spanId}>{veiculo.veic_id}</span>
                                <span>{veiculo.veic_placa}</span>
                                <span>{veiculo.mod_nome}</span>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.checkboxDateContainer}>
                        <label>
                            <input
                                type="checkbox"
                                checked={ehProprietario}
                                onChange={(e) => setEhProprietario(e.target.checked ? 1 : 0)}
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
                        disabled={!veiculoSelecionado || !dataInicial}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}
