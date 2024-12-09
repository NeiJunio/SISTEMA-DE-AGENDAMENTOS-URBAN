import React from 'react'; // Importa o React para criar componentes funcionais.
import styles from './index.module.css'; // Importa o arquivo de estilos CSS para estilização do componente.

export default function FormServicos({
    selectedServico, // Objeto com os dados do serviço selecionado.
    setSelectedServico, // Função para atualizar o serviço selecionado.
    isViewing, // Flag que indica se o formulário está no modo de visualização.
    isEditing, // Flag que indica se o formulário está no modo de edição.
    handleSubmit, // Função para manipular o envio do formulário.
    categoriasServ // Lista de categorias de serviços disponíveis para seleção.
}) {

    // Define se os campos do formulário devem estar desabilitados.
    const isDisabled = isViewing || isEditing;

    return (
        <form id="servicoForm" className={styles.form} onSubmit={handleSubmit}>

            <input
                type="hidden"
                id="clienteId"
                value={selectedServico ? selectedServico.serv_id : ''}
                className={styles.input_servicos}
            />

            <div className={styles.grid}>
                <div className={`${styles.grid_item} ${styles.grid_codigo}`}>
                    <label htmlFor="serv_id" className={styles.label_servicos}>Código</label>
                    <input
                        type="text"
                        name="serv_id"
                        id="serv_id"
                        value={selectedServico ? selectedServico.serv_id : ''}
                        onChange={(e) => setSelectedServico({ ...selectedServico, serv_id: e.target.value })}
                        className={styles.input_servicos}
                        disabled
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_categoria}`}>
                    <label htmlFor="cat_serv_nome" className={styles.label_servicos}>Categoria</label>

                    {isDisabled ? (
                        <input
                            type="text"
                            name="cat_serv_nome"
                            id="cat_serv_nome"
                            value={selectedServico ? selectedServico.cat_serv_nome : ''}
                            onChange={(e) => setSelectedServico({ ...selectedServico, cat_serv_nome: e.target.value })}
                            className={styles.input_servicos}
                            disabled={isDisabled}
                            required
                        />
                    ) : (
                        <>
                            <select
                                name="categoria_servico"
                                id="categoria_servico"
                                value={selectedServico ? selectedServico.cat_serv_id : ''}
                                onChange={(e) => setSelectedServico({ ...selectedServico, cat_serv_id: parseInt(e.target.value) })}
                                className={`${styles.select_servicos} ${styles.grid_categoria}`}
                                defaultValue=""
                            >
                                <option value="" disabled hidden>Selecionar</option>
                                {categoriasServ.map((catServ) => (
                                    <option key={catServ.cat_serv_id} value={catServ.cat_serv_id}>{catServ.cat_serv_nome}</option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_nome}`}>
                    <label htmlFor="serv_nome" className={styles.label_servicos}>Nome</label>

                    <input
                        type="text"
                        name="serv_nome"
                        id="serv_nome"
                        value={selectedServico ? selectedServico.serv_nome : ''}
                        onChange={(e) => setSelectedServico({ ...selectedServico, serv_nome: e.target.value })}
                        className={styles.input_servicos}
                        disabled={isViewing}
                        required
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_duracao}`}>
                    <label htmlFor="serv_duracao" className={styles.label_servicos}>Duração Estimada</label>
                    <input
                        type="text"
                        name="serv_duracao"
                        id="serv_duracao"
                        value={selectedServico ? selectedServico.serv_duracao : ''}
                        onChange={(e) => setSelectedServico({ ...selectedServico, serv_duracao: e.target.value })}
                        className={styles.input_servicos}
                        disabled={isViewing}
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_preco}`}>
                    <label htmlFor="serv_preco" className={styles.label_servicos}>Preço</label>
                    <input
                        type="text"
                        name="serv_preco"
                        id="serv_preco"
                        value={selectedServico ? selectedServico.serv_preco : ''}
                        onChange={(e) => setSelectedServico({ ...selectedServico, serv_preco: e.target.value })}
                        className={styles.input_servicos}
                        disabled={isViewing}
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_descricao} ${styles.grid_item_descricao}`}>
                    <label htmlFor="serv_descricao" className={styles.label_servicos}>Descrição</label>
                    <input
                        type="text"
                        name="serv_descricao"
                        id="serv_descricao"
                        value={selectedServico ? selectedServico.serv_descricao : ''}
                        onChange={(e) => setSelectedServico({ ...selectedServico, serv_descricao: e.target.value })}
                        className={styles.input_servicos}
                        disabled={isViewing}
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_situacao}`}>
                    <label htmlFor="serv_situacao" className={styles.label_servicos}>Situação</label>
                    {isEditing ? (
                        <select
                            id="serv_situacao"
                            name="serv_situacao"
                            value={selectedServico ? selectedServico.serv_situacao : ''}
                            onChange={(e) => setSelectedServico({ ...selectedServico, serv_situacao: parseInt(e.target.value) })}
                            className={`${styles.select_servicos} ${styles.input_situacao}`}
                            required
                        >
                            <option value="1" className={styles.option}>Ativo</option>
                            <option value="0" className={styles.option}>Inativo</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            name="serv_situacao"
                            id="serv_situacao"
                            value={selectedServico ? (selectedServico.serv_situacao ? 'Ativo' : 'Inativo') : ''}
                            className={styles.input_servicos}
                            disabled
                        />
                    )}

                </div>
            </div>
        </form>
    )
}