import React from 'react'; // Importa o React para criar o componente
import styles from './index.module.css'; // Importa os estilos do arquivo CSS do componente

import InputMask from "react-input-mask"; // Importa a biblioteca InputMask para formatar entradas de texto, como máscaras

export default function FormVeiculo({
    selectedVeic, // Objeto contendo os dados do veículo selecionado
    setSelectedVeic, // Função para atualizar o estado do veículo selecionado
    isViewing, // Flag para indicar se o formulário está em modo de visualização
    isEditing, // Flag para indicar se o formulário está em modo de edição
    handleSubmit, // Função para lidar com o envio do formulário
    categorias, // Lista de categorias disponíveis
    marcas, // Lista de marcas filtradas com base na categoria selecionada
    listarMarcas, // Função para listar marcas com base na categoria selecionada
    modelos, // Lista de modelos filtrados com base na marca selecionada
    listarModelos, // Função para listar modelos com base na marca selecionada
    placaErro, // Mensagem de erro para validação da placa
    anoErro, // Mensagem de erro para validação do ano
    handlePlacaChange // Função para manipular alterações na placa do veículo
}) {

    const isDisabled = isViewing || isEditing; // Define se os campos do formulário estarão desabilitados com base no modo de visualização ou edição

    // Manipula alterações no campo da placa, convertendo o valor para letras maiúsculas
    const handlePlacaInputChange = (e) => {
        const placa = e.target.value.toUpperCase(); // Converte o valor para letras maiúsculas
        handlePlacaChange(placa); // Chama a função para atualizar o estado da placa
    };

    // Manipula alterações no campo do ano do veículo
    const handleAnoChange = (e) => {
        setSelectedVeic({ ...selectedVeic, veic_ano: e.target.value }); // Atualiza o ano do veículo no estado
    };

    // Lida com o envio do formulário de maneira assíncrona
    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)
        await handleSubmit(selectedVeic); // Envia os dados do veículo via a função handleSubmit
    };

    // Manipula mudanças na categoria selecionada
    const handleCategoryChange = (e) => {
        const catId = parseInt(e.target.value, 10); // Converte o ID da categoria para um número inteiro
        setSelectedVeic({ ...selectedVeic, cat_id: catId }); // Atualiza a categoria no estado do veículo
        listarMarcas(catId); // Lista as marcas correspondentes à categoria selecionada
    };

    // Manipula mudanças na marca selecionada
    const handleMarcas = (e) => {
        const marId = parseInt(e.target.value, 10); // Converte o ID da marca para um número inteiro
        setSelectedVeic({ ...selectedVeic, mar_id: marId }); // Atualiza a marca no estado do veículo
        listarModelos(marId); // Lista os modelos correspondentes à marca selecionada
    };

    return (
        <form id="veiculoForm" className={styles.form} onSubmit={handleFormSubmit} noValidate>

            <input
                type="hidden"
                id="mod_id"
                name="mod_id"
                value={selectedVeic ? selectedVeic.mod_id : ''}
                className={styles.input_veiculos}
            />

            <div className={styles.grid}>
                <div className={`${styles.grid_item} ${styles.grid_codigo}`}>
                    <label htmlFor="veic_id" className={styles.label_veiculos}>Código</label>
                    <input
                        type="text"
                        id="veic_id"
                        name="veic_id"
                        value={selectedVeic ? selectedVeic.veic_id : ''}
                        className={styles.input_veiculos}
                        disabled
                        required
                    />
                </div>

                <div className={`${styles.grid_item} ${styles.grid_categoria}`}>
                    <label htmlFor="cat_nome" className={styles.label_veiculos}>Categoria</label>

                    {isDisabled ? (
                        <input
                            type="text"
                            id="cat_nome"
                            name="cat_nome"
                            value={selectedVeic ? selectedVeic.cat_nome : ''}
                            onChange={(e) => setSelectedVeic({ ...selectedVeic, cat_nome: e.target.value })}
                            className={styles.input_veiculos}
                            disabled={isDisabled}
                            required
                        />
                    ) : (
                        <select
                            name="cat_id"
                            id="cat_id"
                            value={selectedVeic ? selectedVeic.cat_id : ''}
                            onChange={handleCategoryChange}
                            className={`${styles.select_veiculos} ${styles.input_marca}`}
                            required
                        >
                            <option value="" hidden>Selecione</option>
                            {
                                categorias.map((categoria) => (
                                    <option key={categoria.cat_id} value={categoria.cat_id}>{categoria.cat_nome}</option>
                                ))
                            }
                        </select>
                    )}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_marca}`}>
                    <label htmlFor="mar_id" className={styles.label_veiculos}>Marca</label>
                    {isDisabled ? (
                        <input
                            type='text'
                            id="mar_id"
                            name="mar_id"
                            value={selectedVeic ? selectedVeic.mar_nome : ''}
                            onChange={(e) => setSelectedVeic({ ...selectedVeic, mar_nome: e.target.value })}
                            className={styles.input_veiculos}
                            disabled={isDisabled}
                            required
                        />
                    ) : (
                        <select
                            name="mar_id"
                            id="mar_id"
                            value={selectedVeic ? selectedVeic.mar_id : ''}
                            onChange={handleMarcas}
                            className={`${styles.select_veiculos} ${styles.input_marca}`}
                            required
                        >
                            <option value="" hidden>Selecione</option>
                            {
                                marcas
                                    .sort((a, b) => a.mar_nome.localeCompare(b.mar_nome))
                                    .map((marca) => (
                                        <option key={marca.mar_id} value={marca.mar_id}>{marca.mar_nome}</option>
                                    ))
                            }
                        </select>
                    )}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_modelo}`}>
                    <label htmlFor="mod_id" className={styles.label_veiculos}>Modelo</label>

                    {isDisabled ? (
                        <input
                            type='text'
                            id="mod_id"
                            name="mod_id"
                            value={selectedVeic ? selectedVeic.mod_nome : ''}
                            onChange={(e) => setSelectedVeic({ ...selectedVeic, mod_nome: e.target.value })}
                            className={styles.input_veiculos}
                            disabled={isDisabled}
                            required
                        />
                    ) : (
                        <select
                            name="mod_id"
                            id="mod_id"
                            value={selectedVeic ? selectedVeic.mod_id : ''}
                            onChange={(e) => setSelectedVeic({ ...selectedVeic, mod_id: parseInt(e.target.value) })}
                            className={`${styles.select_veiculos} ${styles.input_marca}`}
                            required
                        >
                            <option value="" hidden>Selecione</option>
                            {modelos
                                .sort((a, b) => a.mod_nome.localeCompare(b.mod_nome))
                                .map((modelo) => (
                                    <option key={modelo.mod_id} value={modelo.mod_id}>{modelo.mod_nome}</option>
                                ))}
                        </select>
                    )}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_placa}`}>
                    <label htmlFor="veic_placa" className={styles.label_veiculos}>Placa</label>
                    <InputMask
                        mask="aaa-9*99"
                        type="text"
                        id="veic_placa"
                        name="veic_placa"
                        value={selectedVeic ? selectedVeic.veic_placa : ''}
                        onChange={handlePlacaInputChange}
                        className={`${styles.input_veiculos} ${placaErro ? styles.inputErro : ''}`}
                        disabled={isDisabled}
                        required
                    />
                    {placaErro && <div className={styles.error_message}>{placaErro}</div>}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_ano}`}>
                    <label htmlFor="veic_ano" className={styles.label_veiculos}>Ano</label>
                    <InputMask
                        mask="9999"
                        type="text"
                        id="veic_ano"
                        name="veic_ano"
                        value={selectedVeic ? selectedVeic.veic_ano : ''}
                        onChange={handleAnoChange}
                        className={`${styles.input_veiculos} ${anoErro ? styles.inputErro : ''}`}
                        disabled={isDisabled}
                        required
                    />
                    {anoErro && <div className={styles.error_message}>{anoErro}</div>}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_cor}`}>
                    <label htmlFor="veic_cor" className={styles.label_veiculos}>Cor</label>

                    {isViewing ? (
                        <input
                            type="text"
                            id="veic_cor"
                            name="veic_cor"
                            value={selectedVeic ? selectedVeic.veic_cor : ''}
                            onChange={(e) => setSelectedVeic({ ...selectedVeic, veic_cor: e.target.value })}
                            className={styles.input_veiculos}
                            disabled={isViewing}
                            required
                        />
                    ) : (
                        <select
                            id="veic_cor"
                            name="veic_cor"
                            required
                            value={selectedVeic ? selectedVeic.veic_cor : ''}
                            onChange={(e) => setSelectedVeic({ ...selectedVeic, veic_cor: e.target.value })}
                            className={`${styles.select_veiculos} ${styles.input_cor}`}
                        >
                            <option value="" disabled hidden>Selecionar</option>
                            <option value="Amarelo">Amarelo</option>
                            <option value="Azul">Azul</option>
                            <option value="Bege">Bege</option>
                            <option value="Branco">Branco</option>
                            <option value="Cinza">Cinza</option>
                            <option value="Dourado">Dourado</option>
                            <option value="Laranja">Laranja</option>
                            <option value="Marrom">Marrom</option>
                            <option value="Preto">Preto</option>
                            <option value="Prata">Prata</option>
                            <option value="Rosa">Rosa</option>
                            <option value="Roxo">Roxo</option>
                            <option value="Verde">Verde</option>
                            <option value="Vermelho">Vermelho</option>
                            <option value="Vinho">Vinho</option>
                            <option value="Personalizado">Personalizado</option>
                        </select>
                    )}
                </div>

                <div className={`${styles.grid_item} ${styles.grid_combustivel}`}>
                    <label htmlFor="veic_combustivel" className={styles.label_veiculos}>Combustível</label>
                    {isViewing ? (
                        <input
                            type="text"
                            id="veic_combustivel"
                            name="veic_combustivel"
                            value={selectedVeic ? selectedVeic.veic_combustivel : ''}
                            onChange={(e) => setSelectedVeic({ ...selectedVeic, veic_combustivel: e.target.value })}
                            className={styles.input_veiculos}
                            disabled={isViewing}
                            required
                        />
                    ) : (
                        <select
                            id="veic_combustivel"
                            name="veic_combustivel"
                            value={selectedVeic ? selectedVeic.veic_combustivel : ''}
                            onChange={(e) => setSelectedVeic({ ...selectedVeic, veic_combustivel: e.target.value })}
                            className={`${styles.select_veiculos} ${styles.input_combustivel}`}
                            required
                        >
                            <option value="" disabled hidden>Selecionar</option>
                            <option value="Gasolina">Gasolina</option>
                            <option value="Alcool">Álcool</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Flex">Flex</option>
                            <option value="GNV">GNV (Gás Natural Veicular)</option>
                            <option value="Eletrico">Elétrico</option>
                            <option value="Hibrido">Híbrido</option>
                        </select>
                    )}
                </div>

                {isViewing ? (
                    <div className={`${styles.grid_item} ${styles.grid_observacoesSmall} ${styles.grid_item_observacoes}`}>
                        <label htmlFor="veic_observ" className={styles.label_veiculos}>Observações</label>
                        <input
                            type="text"
                            id="veic_observ"
                            name="veic_observ"
                            value={selectedVeic ? selectedVeic.veic_observ : ''}
                            onChange={(e) => setSelectedVeic({ ...selectedVeic, veic_observ: e.target.value })}
                            className={styles.input_veiculos}
                            disabled={isViewing}
                        />
                    </div>
                ) : (
                    <div className={`${styles.grid_item} ${styles.grid_observacoes} ${styles.grid_item_observacoes}`}>
                        <label htmlFor="veic_observ" className={styles.label_veiculos}>Observações</label>
                        <input
                            type="text"
                            id="veic_observ"
                            name="veic_observ"
                            value={selectedVeic ? selectedVeic.veic_observ : ''}
                            onChange={(e) => setSelectedVeic({ ...selectedVeic, veic_observ: e.target.value })}
                            className={styles.input_veiculos}
                            disabled={isViewing}
                        />
                    </div>
                )}

                {isViewing && (
                    selectedVeic.num_proprietarios > 1 ? (
                        <div className={`${styles.grid_item} ${styles.grid_proprietario}`}>
                            <label htmlFor="proprietarios" className={styles.label_veiculos}>
                                Proprietário(s)
                                <span className={styles.numProprietarios}>
                                    (+{selectedVeic.num_proprietarios - 1})
                                </span>
                            </label>
                            <select
                                id="proprietarios"
                                required
                                name="proprietarios"
                                value={selectedVeic ? selectedVeic.proprietario : ''}
                                onChange={(e) => setSelectedVeic({ ...selectedVeic, proprietario: e.target.value })}
                                className={`${styles.select_veiculos} ${styles.input_proprietario}`}
                            >
                                <option value="" disabled>Selecionar Proprietário</option>
                                {selectedVeic.proprietarios.split(', ').map((proprietario, index) => (
                                    <option key={index} value={proprietario}>{proprietario}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className={`${styles.grid_item} ${styles.grid_proprietario}`}>
                            <label htmlFor="proprietarios" className={styles.label_veiculos}>Proprietário(s)</label>
                            <input
                                type="text"
                                id="proprietarios"
                                name="proprietarios"
                                value={selectedVeic ? selectedVeic.proprietarios : ''}
                                onChange={(e) => setSelectedVeic({ ...selectedVeic, proprietarios: e.target.value })}
                                className={styles.input_veiculos}
                                disabled={isViewing}
                                required
                            />
                        </div>
                    )
                )}

                <div className={`${styles.grid_item} ${styles.grid_situacao}`}>
                    <label htmlFor="veic_situacao" className={styles.label_veiculos}>Situação</label>
                    {isEditing ? (
                        <select
                            id="veic_situacao"
                            name="veic_situacao"
                            value={selectedVeic ? selectedVeic.veic_situacao : ''}
                            onChange={(e) => setSelectedVeic({ ...selectedVeic, veic_situacao: parseInt(e.target.value) })}
                            className={`${styles.select_veiculos} ${styles.input_situacao}`}
                            required
                        >
                            <option value="1">Ativo</option>
                            <option value="0">Inativo</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            id="veic_situacao"
                            name="veic_situacao"
                            value={selectedVeic ? (selectedVeic.veic_situacao === 1 ? 'Ativo' : 'Inativo') : ''}
                            onChange={(e) => setSelectedVeic({ ...selectedVeic, veic_situacao: e.target.value })}
                            className={styles.input_veiculos}
                            disabled
                            required
                        />
                    )}
                </div>
            </div>
        </form>
    )
}