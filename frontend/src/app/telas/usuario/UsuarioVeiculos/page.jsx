import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from 'react';

import api from "@/services/api";

import Swal from "sweetalert2";
import InputMask from "react-input-mask";
import { parseISO, format } from "date-fns";
import { MdAdd, MdOutlineQuestionMark, MdRemoveRedEye } from "react-icons/md";
import { IoCarSport } from "react-icons/io5";
import { FaMotorcycle, FaTruckFront } from "react-icons/fa6";

export default function UsuarioVeiculos() {
    const [userId, setUserId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [veiculos, setVeiculos] = useState([])
    const [originalVehicle, setOriginalVehicle] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [ano, setAno] = useState('');
    const [anoErro, setAnoErro] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState({
        veic_id: "",
        veic_usu_id: "",
        veic_placa: "",
        cat_nome: "",
        data_inicial: "",
        data_final: "",
        cat_nome: "",
        mar_id: "",
        mar_nome: "",
        mod_id: "",
        mod_nome: "",
        veic_ano: "",
        veic_cor: "",
        veic_combustivel: "",
        veic_observ: "",
        ehproprietario: "",
        veic_situacao: 1,
    });
    
    useEffect(() => {
        const storedUserId = localStorage.getItem('user');
        if (storedUserId) {
            const parsedUser = JSON.parse(storedUserId);
            setUserId(parsedUser?.id || null);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            ListarVeiculosUsuario();
        }
    }, [userId]);

    useEffect(() => {
        if (selectedVehicle?.cat_id) {
            ListarMarcas();
        }
    }, [selectedVehicle?.cat_id]);
    

    useEffect(() => {
        if (selectedVehicle?.mar_id) {
            ListarModelos();
        }
    }, [selectedVehicle?.mar_id]);

    const ListarVeiculosUsuario = async () => {
        if (!userId) return;

        try {
            const response = await api.get(`/veiculoUsuario/usuario/${userId}`);
            setVeiculos(response.data.dados);
        } catch (error) {
            console.error("Erro ao buscar veículos:", error);
        }
    };

    const ListarCategorias = async () => {
        try {
            const response = await api.get('/categorias');
            setCategorias(response.data.dados);
        } catch (error) {
            console.error("Erro ao buscar as categorias:", error);
        }
    };

    const ListarMarcas = async () => {
        try {
            const response = await api.get(`/marcas/categorias/${selectedVehicle.cat_id}`);
            setMarcas(response.data.dados);
        } catch (error) {
            console.error("Erro ao buscar as marcas:", error);
        }
    };

    const ListarModelos = async () => {
        try {
            const response = await api.get(`/modelos/cat/${selectedVehicle.cat_id}/mar/${selectedVehicle.mar_id}`);
            setModelos(response.data.dados);
        } catch (error) {
            console.error("Erro ao buscar as marcas:", error);
        }
    };

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;

    //     setSelectedVehicle((prevVehicle) => ({
    //         ...prevVehicle,
    //         [name]: (name === 'cat_id' || name === 'mar_id' || name === 'mod_id' || name === 'ehproprietario')
    //             ? parseInt(value, 10)
    //             : name === 'veic_placa'
    //                 ? value.toUpperCase()
    //                 : value
    //     }));
    // };

    //const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    
    //     // Validação para campos do tipo "date"
    //     if (name === 'data_inicial') {
    //         // Permite apenas valores no formato "yyyy-MM-dd"
    //         if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    //             return;
    //         }
    //     }
    
    //     setSelectedVehicle((prevVehicle) => ({
    //         ...prevVehicle,
    //         [name]: (name === 'cat_id' || name === 'mar_id' || name === 'mod_id' || name === 'ehproprietario')
    //             ? parseInt(value, 10)
    //             : name === 'veic_placa'
    //                 ? value.toUpperCase()
    //                 : value
    //     }));
    // };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'data_inicial') {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                return;
            }
            const inputDate = new Date(value);
            const currentDate = new Date();
    
            currentDate.setHours(0, 0, 0, 0);
    
            if (inputDate > currentDate) {
                alert("A data não pode ser maior que a data atual.");
                return;
            }
        }
    
        setSelectedVehicle((prevVehicle) => ({
            ...prevVehicle,
            [name]: (name === 'cat_id' || name === 'mar_id' || name === 'mod_id' || name === 'ehproprietario')
                ? parseInt(value, 10)
                : name === 'veic_placa'
                    ? value.toUpperCase()
                    : value
        }));
    };
    

    const handleExcluirVeiculo = async (veic_usu_id) => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você deseja realmente excluir este veículo? Esta ação não pode ser desfeita.",
            icon: "warning",
            iconColor: "#ff9d00",
            showCancelButton: true,
            confirmButtonColor: "rgb(40, 167, 69)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
            backdrop: "rgba(0,0,0,0.7)"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const dataAtual = format(new Date(), 'yyyy-MM-dd');
                try {
                    const response = await api.patch(`/veiculoUsuario/${veic_usu_id}/data_final`, {
                        data_final: dataAtual
                    });

                    if (response.data.sucesso) {
                        Swal.fire({
                            title: 'Sucesso!',
                            text: 'Veículo excluído com sucesso.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            iconColor: "rgb(40, 167, 69)",
                            confirmButtonColor: "rgb(40, 167, 69)",
                        });

                        ListarVeiculosUsuario();
                    } else {
                        Swal.fire({
                            title: 'Erro!',
                            text: response.data.mensagem || 'Ocorreu um erro ao excluir o veículo.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            iconColor: '#d33',
                            confirmButtonColor: '#d33',
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Erro!',
                        text: `Erro na exclusão do veículo: ${error.message}`,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        iconColor: '#d33',
                        confirmButtonColor: '#d33',
                    });
                }
            }
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (!validarAno(selectedVehicle.veic_ano)) {
            setAnoErro(`O ano deve ser entre 1886 e ${new Date().getFullYear() + 1}.`);
            Swal.fire({
                title: 'Erro!',
                text: 'O ano inserido é inválido. Por favor, insira um ano válido.',
                icon: 'error',
                confirmButtonText: 'Ok',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
            return;
        }
    
        setAnoErro('');

        const NovoVeiculo = {
            mod_id: selectedVehicle.mod_id,
            veic_placa: selectedVehicle.veic_placa,
            veic_ano: selectedVehicle.veic_ano,
            veic_cor: selectedVehicle.veic_cor,
            veic_combustivel: selectedVehicle.veic_combustivel,
            veic_observ: selectedVehicle.veic_observ,
            veic_situacao: selectedVehicle.veic_situacao || 1
        };

        const UpdateVeiculo = {
            mod_id: selectedVehicle.mod_id || veiculos.mod_id,
            veic_placa: selectedVehicle.veic_placa || veiculos.veic_placa,
            veic_ano: selectedVehicle.veic_ano || veiculos.veic_ano,
            veic_cor: selectedVehicle.veic_cor || veiculos.veic_cor,
            veic_combustivel: selectedVehicle.veic_combustivel || veiculos.veic_combustivel,
            veic_observ: selectedVehicle.veic_observ || veiculos.veic_observ,
            ehproprietario: selectedVehicle.ehproprietario !== undefined
                ? parseInt(selectedVehicle.ehproprietario, 10)
                : parseInt(veiculos.ehproprietario, 10)
            // veic_situacao: selectedVehicle.veic_situacao || veiculos.veic_situacao, // Alterado
            };

        const UpdateVeiculoUsuario = {
            veic_usu_id: selectedVehicle.veic_usu_id || veiculos.veic_usu_id,
            data_inicial: selectedVehicle.data_inicial || veiculos.data_inicial,
            ehproprietario: selectedVehicle.ehproprietario !== undefined
                ? parseInt(selectedVehicle.ehproprietario, 10)
                : parseInt(veiculos.ehproprietario, 10)
        };

        let NovoVeiculoUsuario;

        try {
            let responseVehicle;

            if (!selectedVehicle.veic_id) {
                responseVehicle = await api.post('/veiculos', NovoVeiculo);

                if (responseVehicle.data.sucesso) {
                    const newVeic_id = responseVehicle.data.dados;

                    NovoVeiculoUsuario = {
                        veic_id: newVeic_id,
                        usu_id: userId,
                        data_inicial: selectedVehicle.data_inicial || veiculos.data_inicial,
                        ehproprietario: selectedVehicle.ehproprietario !== undefined
                            ? parseInt(selectedVehicle.ehproprietario, 10)
                            : parseInt(veiculos.ehproprietario, 10)
                    };

                    await api.post('/veiculoUsuario', NovoVeiculoUsuario);
                } else {
                    throw new Error("Falha ao criar veículo: " + responseVehicle.data.mensagem);
                }
            } else {
                responseVehicle = await api.patch(`/veiculos/usuario/${selectedVehicle.veic_id}`, UpdateVeiculo);
                if (!responseVehicle.data.sucesso) {
                    throw new Error("Falha ao atualizar veículo: " + responseVehicle.data.mensagem);
                }
                 
                const responseUsuario = await api.patch(`/veiculoUsuario/${selectedVehicle.veic_usu_id}`, UpdateVeiculoUsuario);
                if (!responseUsuario.data.sucesso) {
                    throw new Error("Falha ao atualizar veículo-usuário: " + responseUsuario.data.mensagem);
                }
            }

            Swal.fire({
                title: 'Sucesso!',
                text: 'O veículo foi criado/atualizado com sucesso.',
                icon: 'success',
                confirmButtonText: 'OK',
                iconColor: "rgb(40, 167, 69)",
                confirmButtonColor: "rgb(40, 167, 69)",
            });

            setShowForm(false);
            ListarVeiculosUsuario();

        } catch (error) {
            console.error("Erro completo na requisição:", error);
            let errorMessage;

            if (error.message.includes("Falha ao criar veículo")) {
                errorMessage = "Erro ao criar veículo: " + error.message;
            } else if (error.message.includes("Falha ao atualizar veículo")) {
                errorMessage = "Erro ao atualizar veículo: " + error.message;
            } else if (error.message.includes("Falha ao atualizar veículo-usuário")) {
                errorMessage = "Erro ao atualizar veículo-usuário: " + error.message;
            } else {
                errorMessage = error.response ? error.response.data.mensagem : error.message;
            }

            Swal.fire({
                title: 'Erro!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Ok',
                iconColor: '#d33',
                confirmButtonColor: '#d33',
            });
        }
    };

    const handleEditar = (veiculo) => {
        const vehicleData = {
            veic_id: veiculo.veic_id || "",
            veic_usu_id: veiculo.veic_usu_id || "",
            veic_placa: veiculo.veic_placa || "",
            data_inicial: veiculo.data_inicial || "",
            cat_nome: veiculo.cat_nome || "",
            mar_id: veiculo.mar_id || "",
            mar_nome: veiculo.mar_nome || "",
            mod_id: veiculo.mod_id || "",
            mod_nome: veiculo.mod_nome || "",
            veic_ano: veiculo.veic_ano || "",
            veic_cor: veiculo.veic_cor || "",
            veic_combustivel: veiculo.veic_combustivel || "",
            veic_observ: veiculo.veic_observ || "",
            ehproprietario: veiculo.ehproprietario !== undefined ? veiculo.ehproprietario.toString() : ""
        };

        setSelectedVehicle(vehicleData);
        setOriginalVehicle(veiculo);
        setShowForm(true);
        setIsEditing(true);
        setIsCreate(false);
        setIsViewing(false);
    };

    const handleVisualizar = (veiculo) => {
        setSelectedVehicle(veiculo);
        setIsViewing(true);
        setIsEditing(false);
        setIsCreate(false);
        setShowForm(true);
    };

    const CreateVeiculo = () => {
        const vehicleData = {
            veic_id: "",
            veic_usu_id: "",
            veic_placa: "",
            data_inicial: "",
            cat_nome: "",
            mar_id: "",
            mar_nome: "",
            mod_id: "",
            mod_nome: "",
            veic_ano: "",
            veic_cor: "",
            veic_combustivel: "",
            veic_observ: "",
            ehproprietario: 0,
            veic_situacao: 1
        };
        ListarCategorias();
        setSelectedVehicle(vehicleData);
        setShowForm(true);
        setIsCreate(true);
        setIsEditing(false);
        setIsViewing(false);
    };

    const handleReturn = () => {
        setShowForm(false)
    };

    const handleCancel = () => {
        Swal.fire({
            title: "Deseja Cancelar?",
            text: "As informações não serão salvas",
            icon: "warning",
            iconColor: "#ff9d00",
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
                    setSelectedVehicle(originalVehicle);
                    setShowForm(false);
                    setIsEditing(false);
                });
            }
        });
    };

    const validarAno = (ano) => {
        const anoAtual = new Date().getFullYear();
        const anoMax = anoAtual + 1;
        const anoNum = parseInt(ano, 10);
    
        if (isNaN(anoNum) || anoNum < 1886 || anoNum > anoMax) {
            return false;
        }
        return true;
    };

    return (
        <>
            <div id="clientes" className={styles.content_section}>
                <h2 className={styles.title_page}>Meus Veículos</h2>
                {!showForm ? (
                    <>
                        <ol className={styles.fundocards}>
                            {veiculos.map((veiculo) => (
                                <li key={veiculo.veic_id} className={styles.lista}>

                                    <div className={styles.icone}>
                                        <div className={styles.icone}>
                                            {veiculo.cat_id === 1 ? (
                                                <FaTruckFront className={styles.iconeVeiculo} />

                                            ) : veiculo.cat_id === 2 ? (
                                                <IoCarSport className={styles.iconeVeiculo} />

                                            ) : veiculo.cat_id === 3 ? (
                                                <FaMotorcycle className={styles.iconeVeiculo} />
                                            ) : (
                                                <MdOutlineQuestionMark className={styles.iconeVeiculo} />
                                            )}
                                        </div>

                                    </div>

                                    <div className={styles.botoeslink}>
                                        <MdRemoveRedEye
                                            onClick={() => handleVisualizar(veiculo)}
                                            className={styles.iconeVisualizar}
                                        />

                                        <button
                                            className={styles.link}
                                            onClick={() => handleEditar(veiculo)}
                                        >
                                            <span className={styles.iconeAlterar}></span>
                                        </button>

                                        <Link href="#" onClick={() => handleExcluirVeiculo(veiculo.veic_usu_id)} className={styles.link}>
                                            <span className={styles.iconeExcluir}></span>
                                        </Link>

                                    </div>

                                    <div className={styles.content}>
                                        <span className={styles.placa}>{veiculo.veic_placa}</span>
                                        <span className={styles.marca}>{veiculo.mar_nome}</span>
                                        <span className={styles.modelo}>{veiculo.mod_nome}</span>
                                        {/* <span className={styles.ano}>Ano: {veiculo.veic_ano}</span> */}
                                        {veiculo.ehproprietario === 1 ? (
                                            <span className={styles.proprietario}>Proprietário</span>
                                        ) : (
                                            <span className={styles.naoProprietario}>Não Proprietário</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                            <li
                                className={`${styles.lista} ${styles.listaAddVeiculo}`}
                                onClick={CreateVeiculo}>
                                <MdAdd
                                    className={styles.iconeAddVeiculo}
                                />
                            </li>
                        </ol>

                    </>
                ) : (
                    <>
                        <form id="veiculoForm" className={styles.form} onSubmit={handleFormSubmit}>
                            <div className={styles.grid}>

                                <div className={`${styles.grid_item} ${styles.grid_codigo}`}>
                                    <label htmlFor="veic_id" className={styles.label_veiculos}>Código</label>
                                    <input
                                        type="text"
                                        id="veic_id"
                                        name="veic_id"
                                        value={selectedVehicle.veic_id}
                                        onChange={handleInputChange}
                                        className={styles.input_veiculos}
                                        required
                                        disabled
                                    />
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_categoria}`}>
                                    <label htmlFor="veic_id" className={styles.label_veiculos}>Categoria</label>
                                    {isCreate ? (
                                        <select
                                            name="cat_id"
                                            id="cat_id"
                                            value={selectedVehicle.cat_id}
                                            onChange={handleInputChange}
                                            className={styles.select_veiculos}
                                            required
                                        >
                                            <option value="" hidden>Selecione</option>
                                            {
                                                categorias.map((categoria) => (
                                                    <option key={categoria.cat_id} value={categoria.cat_id}>{categoria.cat_nome}</option>
                                                ))
                                            }
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            id="cat_nome"
                                            name="cat_nome"
                                            value={selectedVehicle.cat_nome}
                                            onChange={handleInputChange}
                                            className={styles.input_veiculos}
                                            disabled
                                            required
                                        />

                                    )}
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_marca}`}>
                                    <label htmlFor="mar_nome" className={styles.label_veiculos}>Marca</label>
                                    {isCreate ? (
                                        <select
                                            name="mar_id"
                                            id="mar_id"
                                            value={selectedVehicle.mar_id}
                                            onChange={handleInputChange}
                                            className={styles.select_veiculos}
                                            required
                                            disabled={!selectedVehicle.cat_id}
                                        >
                                            <option value="" hidden>Selecione</option>
                                            {
                                                marcas.map((marca) => (
                                                    <option key={marca.mar_id} value={marca.mar_id}>{marca.mar_nome}</option>
                                                ))
                                            }
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            id="mar_nome"
                                            name="mar_nome"
                                            value={selectedVehicle.mar_nome}
                                            onChange={handleInputChange}
                                            required
                                            disabled
                                            className={styles.input_veiculos}
                                        />
                                    )}

                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_modelo}`}>
                                    <label htmlFor="mod_nome" className={styles.label_veiculos}>Modelo</label>
                                    {isCreate ? (
                                        <select
                                            name="mod_id"
                                            id="mod_id"
                                            value={selectedVehicle.mod_id}
                                            onChange={handleInputChange}
                                            className={styles.select_veiculos}
                                            disabled={!selectedVehicle.mar_id}
                                            required
                                        >
                                            <option value="" hidden>Selecione</option>
                                            {
                                                modelos.map((modelo) => (
                                                    <option key={modelo.mod_id} value={modelo.mod_id}>{modelo.mod_nome}</option>
                                                ))
                                            }
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            id="mod_nome"
                                            name="mod_nome"
                                            value={selectedVehicle.mod_nome}
                                            onChange={handleInputChange}
                                            required
                                            disabled
                                            className={styles.input_veiculos}
                                        />
                                    )}

                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_placa}`}>
                                    <label htmlFor="veic_placa" className={styles.label_veiculos}>Placa</label>
                                    <InputMask
                                        mask="aaa-9*99"
                                        type="text"
                                        id="veic_placa"
                                        name="veic_placa"
                                        value={selectedVehicle.veic_placa}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!isCreate && !isEditing}
                                        className={styles.input_veiculos}
                                        placeholder="Letras e números"
                                    />
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_ano}`}>
                                    <label htmlFor="veic_ano" className={styles.label_veiculos}>Ano</label>
                                    <input
                                        type="number"
                                        id="veic_ano"
                                        name="veic_ano"
                                        value={selectedVehicle.veic_ano || ''}
                                        onChange={(e) => setSelectedVehicle({ ...selectedVehicle, veic_ano: e.target.value })}
                                        onBlur={() => validarAno(ano)}
                                        className={styles.input_veiculos}
                                        required
                                        disabled={!isCreate}
                                    />
                                    {anoErro && <span className={styles.error_message}>{anoErro}</span>}
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_cor}`}>
                                    <label htmlFor="veic_cor" className={styles.label_veiculos}>Cor</label>
                                    {isViewing ? (
                                        <>
                                            <input
                                                type="text"
                                                id="veic_cor"
                                                name="veic_cor"
                                                value={selectedVehicle.veic_cor}
                                                onChange={handleInputChange}
                                                required
                                                disabled
                                                className={styles.input_veiculos}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <select
                                                id="veic_cor"
                                                name="veic_cor"
                                                value={selectedVehicle.veic_cor}
                                                onChange={handleInputChange}
                                                className={styles.select_veiculos}
                                                required
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
                                        </>
                                    )}
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_combustivel}`}>
                                    <label htmlFor="veic_combustivel" className={styles.label_veiculos}>Combustível</label>

                                    {isCreate || isEditing ? (
                                        <select
                                            id="veic_combustivel"
                                            name="veic_combustivel"
                                            value={selectedVehicle.veic_combustivel}
                                            onChange={handleInputChange}
                                            className={styles.select_veiculos}
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
                                    ) : (
                                        <input
                                            type="text"
                                            id="veic_combustivel"
                                            name="veic_combustivel"
                                            value={selectedVehicle.veic_combustivel}
                                            onChange={handleInputChange}
                                            className={styles.input_veiculos}
                                            disabled
                                        />
                                    )}
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_datainicial}`}>
                                    <label htmlFor="data_inicial" className={styles.label_veiculos}>Data Inicial</label>
                                    <input
                                        type="date"
                                        id="data_inicial"
                                        name="data_inicial"
                                        value={selectedVehicle?.data_inicial ? format(parseISO(selectedVehicle.data_inicial), 'yyyy-MM-dd') : ''}
                                        onChange={handleInputChange}
                                        // max={new Date().toISOString().split('T')[0]} // Limita até hoje
                                        className={styles.input_veiculos}
                                        required
                                        disabled={!isCreate && !isEditing}
                                    />
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_proprietario}`}>
                                    <label htmlFor="" className={styles.label_veiculos}>Proprietário</label>

                                    {isViewing ? (
                                        <>
                                            <input
                                                type="text"
                                                id="ehproprietario"
                                                name="ehproprietario"
                                                value={selectedVehicle.ehproprietario === 1 ? "Sim" : "Não"}
                                                onChange={handleInputChange}
                                                className={styles.input_veiculos}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <select
                                                id="ehproprietario"
                                                name="ehproprietario"
                                                value={selectedVehicle.ehproprietario || 0}
                                                onChange={handleInputChange}
                                                required
                                                className={styles.select_veiculos}
                                            >
                                                <option value="" hidden>Selecionar</option>
                                                <option value="1">Sim</option>
                                                <option value="0">Não</option>
                                            </select>
                                        </>
                                    )}
                                </div>

                                <div className={`${styles.grid_item} ${styles.grid_observacoes}`}>
                                    <label htmlFor="data_final" className={styles.label_veiculos}>Observações</label>
                                    <input
                                        type="text"
                                        id="veic_observ"
                                        name="veic_observ"
                                        value={selectedVehicle.veic_observ}
                                        onChange={handleInputChange}
                                        className={styles.input_veiculos}
                                        disabled={!isCreate && !isEditing}
                                    />
                                </div>
                            </div>
                        </form>

                        <div className={styles.footer_form}>

                            {isViewing ? (
                                <button type="button" onClick={handleReturn} className={styles.button_return}>Voltar</button>
                            ) : (
                                <>
                                    <button type="button" onClick={handleCancel} className={styles.button_cancel}>Cancelar</button>
                                    <button type="submit" onClick={handleFormSubmit} className={styles.submitButton}>Salvar</button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div >
        </>
    );
}