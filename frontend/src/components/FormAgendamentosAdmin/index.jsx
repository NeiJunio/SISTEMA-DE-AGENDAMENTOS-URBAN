import React, { useState, useEffect } from 'react'; // Importação de hooks para gerenciar estados no componente.
import styles from './index.module.css'; // Importação do arquivo CSS para estilização.

import api from '@/services/api'; // Importação da instância da API para realizar chamadas ao backend.

import Swal from 'sweetalert2'; // Importação da biblioteca SweetAlert2 para exibir modais interativos.

export default function FormAgendamentos({
    selectedAgend, // Objeto com os dados do agendamento selecionado.
    setSelectedAgend, // Função para atualizar o agendamento selecionado.
    isViewing, // Flag para determinar se está no modo de visualização.
    handleSubmit, // Função para manipular o envio do formulário.
    isEditing // Flag para determinar se está no modo de edição.
}) {

    // Estados locais do componente
    const [veiculosUsuario, setVeiculosUsuario] = useState([]); // Lista de veículos vinculados ao usuário.
    const [servicos, setServicos] = useState([]); // Lista de serviços disponíveis para a categoria selecionada.
    const [catServicos, setCatServicos] = useState([]); // Lista de categorias de serviços ativas.
    const [selectedCategoria, setSelectedCategoria] = useState(selectedAgend?.cat_serv_id); // Categoria de serviço selecionada.
    const [isServicoDisabled, setIsServicoDisabled] = useState(false); // Desabilita ou habilita o dropdown de serviços.
    const [agendServSituId, setAgendServSituId] = useState([]); // Lista de situações possíveis para o serviço.
    const [situServicoSelected, setSituServicoSelected] = useState(selectedAgend?.agend_serv_situ_id || ''); // Situação selecionada.

    const isDisabled = isViewing || isEditing; // Desabilita campos dependendo dos modos de visualização ou edição.

    const agendSituacaoMap = {
        1: 'Pendente',
        2: 'Em andamento',
        3: 'Concluído',
        4: "Cancelado"
    }; // Mapeamento de IDs de situação para os nomes correspondentes.

    // Efeito para carregar categorias e situações ao montar o componente
    useEffect(() => {
        ListarCategoriasServAtivas(); // Busca categorias de serviços ativas.
        ListarAgendServSituId(); // Busca as situações possíveis de serviço.
    }, []);

    // Efeito para carregar os veículos do usuário ao mudar o usuário selecionado
    useEffect(() => {
        ListarVeiculosUsuario(); // Busca veículos vinculados ao usuário selecionado.
    }, [selectedAgend?.usu_id]);

    // Efeito para listar serviços ao selecionar uma categoria
    useEffect(() => {
        if (selectedCategoria) {
            ListarServicos(selectedCategoria); // Busca serviços com base na categoria selecionada.
        }
    }, [selectedCategoria]);

    // Função para buscar serviços de uma categoria específica
    const ListarServicos = async (selectedCategoria) => {
        try {
            const response = await api.get(`/servicos/categoria/${selectedCategoria}`);

            if (response.data.sucesso === false && response.data.status === 200) {
                // Exibe alerta se não houver serviços para a categoria.
                Swal.fire({
                    title: 'Atenção!',
                    text: 'Nenhum serviço encontrado para essa categoria.',
                    icon: 'warning',
                    iconColor: '#f39c12',
                    confirmButtonColor: '#f39c12',
                });
                setServicos([]); // Reseta a lista de serviços.
                setServicoSelecionado(null); // Reseta o serviço selecionado.
                setIsServicoDisabled(true); // Desabilita o dropdown de serviços.
            } else {
                setServicos(response.data.dados || []); // Atualiza a lista de serviços.
                setIsServicoDisabled(false); // Habilita o dropdown de serviços.
            }
        } catch (error) {
            console.error("Erro ao buscar os serviços:", error);
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível carregar os serviços.',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    // Função para buscar os veículos de um usuário específico
    const ListarVeiculosUsuario = async () => {
        if (selectedAgend?.usu_id) {
            try {
                const response = await api.get(`/veiculoUsuario/usuario/${selectedAgend?.usu_id}`);
                setVeiculosUsuario(response.data.dados || []); // Atualiza a lista de veículos.
            } catch (error) {
                console.error("Erro ao buscar veículos:", error);
            }
        }
    };

    // Função para buscar as situações possíveis de serviço
    const ListarAgendServSituId = async () => {
        try {
            const response = await api.get('/agendaServicosSituacao');
            setAgendServSituId(response.data.dados); // Atualiza a lista de situações.
        } catch (error) {
            console.error("Erro ao buscar as categorias:", error);
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível buscar as categorias.',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    // Função para buscar categorias ativas de serviço
    const ListarCategoriasServAtivas = async () => {
        try {
            const response = await api.get('/categoriasServicosAtivas');
            setCatServicos(response.data.dados); // Atualiza a lista de categorias.
        } catch (error) {
            console.error("Erro ao buscar as categorias:", error);
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível buscar as categorias.',
                icon: 'error',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    // Atualiza a categoria selecionada
    const handleCategoryChange = (e) => {
        const newCategoryId = e.target.value;
        setSelectedCategoria(newCategoryId);

        if (setSelectedAgend) {
            setSelectedAgend((prevAgend) => ({
                ...prevAgend,
                cat_serv_id: newCategoryId,
            }));
        }
    };

    // Atualiza a situação selecionada do serviço
    const handleSituacaoServico = (e) => {
        const newSituacaoId = parseInt(e.target.value);
        setSituServicoSelected(newSituacaoId);

        if (setSelectedAgend) {
            setSelectedAgend((prevAgend) => ({
                ...prevAgend,
                agend_serv_situ_id: newSituacaoId,
            }));
        }
    };

    return (
        <form id="agendForm" className={styles.form} onSubmit={handleSubmit}>
            <input type="hidden" id="agend_id" value={selectedAgend ? selectedAgend.usu_id : ''} className={styles.input_agend} />

            <div className={styles.grid}>
                <div className={`${styles.grid_item} ${styles.grid_codigo}`}>
                    <label htmlFor="agend_id" className={styles.label_agend}>Código</label>
                    <input
                        type="number"
                        id="agend_id"
                        name="agend_id"
                        value={selectedAgend?.agend_id || ''}
                        className={styles.input_agend}
                        disabled
                        required
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_data}`}>
                    <label htmlFor="agend_data" className={styles.label_agend}>Data do Agendamento</label>
                    <input
                        type="date"
                        id="agend_data"
                        name="agend_data"
                        value={selectedAgend?.agend_data || ''}
                        onChange={(e) => setSelectedAgend({ ...selectedAgend, agend_data: e.target.value })}
                        disabled={!isEditing}
                        className={styles.input_agend}
                        required
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_cliente}`}>
                    <label htmlFor="usu_nome" className={styles.label_agend}>Cliente</label>
                    <input
                        type="text"
                        id="usu_nome"
                        name="usu_nome"
                        value={selectedAgend ? selectedAgend.usu_nome : ''}
                        disabled={isDisabled}
                        className={styles.input_agend}
                        required
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_catserv}`}>
                    <label htmlFor="cat_serv_nome" className={styles.label_agend}>Categoria do Serviço</label>
                    {isViewing ? (
                        <>
                            <input
                                type="text"
                                id="cat_serv_nome"
                                name="cat_serv_nome"
                                value={selectedAgend?.cat_serv_nome || ''}
                                onChange={(e) => setSelectedAgend({ ...selectedAgend, cat_serv_nome: e.target.value })}
                                disabled={!isEditing}
                                className={styles.input_agend}
                                required
                            />
                        </>
                    ) : (
                        <>
                            <select
                                id="cat_serv_nome"
                                name="cat_serv_nome"
                                className={styles.input_agend}
                                value={selectedCategoria}
                                onChange={handleCategoryChange}
                                disabled={isViewing}
                                required
                            >
                                {catServicos.map((catServ) => (
                                    <option key={catServ.cat_serv_id} value={catServ.cat_serv_id}>
                                        {catServ.cat_serv_nome}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_nomeserv}`}>
                    <label htmlFor="serv_nome" className={styles.label_agend}>Serviço</label>
                    {isViewing ? (
                        <>
                            <input
                                type="text"
                                id="serv_nome"
                                name="serv_nome"
                                value={selectedAgend?.serv_nome || ''}
                                onChange={(e) => setSelectedAgend({ ...selectedAgend, serv_nome: e.target.value })}
                                disabled={!isEditing}
                                className={styles.input_agend}
                                required
                            />
                        </>
                    ) : (
                        <>
                            <select
                                id="serv_nome"
                                name="serv_nome"
                                value={selectedAgend?.serv_id || ''}
                                onChange={(e) => setSelectedAgend({ ...selectedAgend, serv_id: parseInt(e.target.value) })}
                                className={styles.input_agend}
                                disabled={isServicoDisabled}
                                required
                            >
                                {Array.isArray(servicos) && servicos.map((serv) => (
                                    <option key={serv.serv_id} value={serv.serv_id}>
                                        {serv.serv_nome}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_horario}`}>
                    <label htmlFor="agend_horario" className={styles.label_agend}>Horário</label>
                    <input
                        type="time"
                        id="agend_horario"
                        name="agend_horario"
                        value={selectedAgend ? selectedAgend.agend_horario : ''}
                        onChange={(e) => setSelectedAgend({ ...selectedAgend, agend_horario: e.target.value })}
                        disabled={!isEditing}
                        className={styles.input_agend}
                        required
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_placa}`}>
                    <label htmlFor="veic_placa" className={styles.label_agend}>Placa</label>
                    {isViewing ? (
                        <>
                            <input
                                type="text"
                                id="veic_placa"
                                name="veic_placa"
                                value={selectedAgend ? selectedAgend.veic_placa : ''}
                                onChange={(e) => setSelectedAgend({ ...selectedAgend, veic_placa: e.target.value })}
                                disabled={isViewing}
                                className={`${styles.input_agend}`}
                                required
                            />
                        </>
                    ) : (
                        <>
                            <select
                                id="veiculo"
                                name="veiculo"
                                className={styles.input_agend}
                                value={selectedAgend?.veic_usu_id || ''}
                                onChange={(e) => setSelectedAgend({ ...selectedAgend, veic_usu_id: e.target.value })}
                                disabled={isViewing}
                                required
                            >
                                {veiculosUsuario.map((veiculo) => (
                                    <option key={veiculo.veic_usu_id} value={veiculo.veic_usu_id}>
                                        {veiculo.veic_placa}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_situacao}`}>
                    <label htmlFor="agend_serv_situ_id" className={styles.label_agend}>Situação</label>
                    {isViewing ? (
                        <input
                            type="text"
                            id="agend_serv_situ_id"
                            name="agend_serv_situ_id"
                            value={selectedAgend
                                ? agendSituacaoMap[selectedAgend.agend_serv_situ_id] || ''
                                : ''}
                            onChange={(e) => setSelectedAgend({ ...selectedAgend, agend_serv_situ_id: parseInt(e.target.value) })}
                            disabled
                            className={styles.input_agend}
                            required
                        />
                    ) : (
                        <>
                            <select
                                id="agend_serv_situ_id"
                                name="agend_serv_situ_id"
                                className={styles.input_agend}
                                value={situServicoSelected}
                                onChange={handleSituacaoServico}
                                disabled={isViewing}
                                required
                            >
                                {agendServSituId.map((situacao) => (
                                    <option key={situacao.agend_serv_situ_id} value={situacao.agend_serv_situ_id}>
                                        {situacao.agend_serv_situ_nome}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                {isViewing && (
                    <div className={`${styles.grid_item} ${styles.grid_modelo}`}>
                        <label htmlFor="mod_nome" className={styles.label_agend}>Modelo</label>
                        <input
                            type="text"
                            id="mod_nome"
                            name="mod_nome"
                            value={selectedAgend ? selectedAgend.mod_nome : ''}
                            onChange={(e) => setSelectedAgend({ ...selectedAgend, mod_nome: e.target.value })}
                            disabled={isViewing}
                            className={`${styles.input_agend}`}
                            required
                        />
                    </div>
                )}

                {isViewing && (
                    <div className={`${styles.grid_item} ${styles.grid_cor}`}>
                        <label htmlFor="veic_cor" className={styles.label_agend}>Cor</label>
                        <input
                            type="text"
                            id="veic_cor"
                            name="veic_cor"
                            value={selectedAgend ? selectedAgend.veic_cor : ''}
                            onChange={(e) => setSelectedAgend({ ...selectedAgend, veic_cor: e.target.value })}
                            disabled={isViewing}
                            className={`${styles.input_agend}`}
                            required
                        />
                    </div>
                )}

                {isViewing && (
                    <div className={`${styles.grid_item} ${styles.grid_marca}`}>
                        <label htmlFor="mar_nome" className={styles.label_agend}>Marca</label>
                        <input
                            type="text"
                            id="mar_nome"
                            name="mar_nome"
                            value={selectedAgend ? selectedAgend.mar_nome : ''}
                            onChange={(e) => setSelectedAgend({ ...selectedAgend, mar_nome: e.target.value })}
                            disabled={isViewing}
                            className={`${styles.input_agend}`}
                            required
                        />
                    </div>
                )}

                <div className={`${styles.grid_item} ${styles.grid_observacoes}`}>
                    <label htmlFor="agend_observ" className={styles.label_agend}>Observações</label>
                    <input
                        type="text"
                        id="agend_observ"
                        name="agend_observ"
                        value={selectedAgend ? selectedAgend.agend_observ : ''}
                        onChange={(e) => setSelectedAgend({ ...selectedAgend, agend_observ: e.target.value })}
                        disabled={isViewing}
                        className={styles.input_agend}
                        required
                    />
                </div>
            </div>
        </form>
    )
}