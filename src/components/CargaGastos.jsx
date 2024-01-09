import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../css/Carga.css';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useGastos } from '../context/GastosContext';
import { useExptes } from '../context/ExptesContext';

export const CargaGastos = () => {
	const { user } = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	const { createGasto, getGastos } = useGastos();
	const { getExptes } = useExptes();
	const [exptes, setExptes] = useState([]);
	const [gastos, setGastos] = useState([]);
	const [showModal, setShowModal] = useState(true);

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	// Función para cerrar el modal
	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/gestiongastos');
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedGastos = await getGastos();
				setGastos(fetchedGastos);
			} catch (error) {
				console.error('Error al obtener gastos:', error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedExptes = await getExptes();
				setExptes(fetchedExptes);
			} catch (error) {
				console.error('Error al obtener expedientes:', error);
			}
		};
		fetchData();
	}, []);

	const onSubmit = handleSubmit(async (values) => {
		createGasto(values);
		Swal.fire({
			icon: 'success',
			title: 'Gasto registrado correctamente',
			showConfirmButton: false,
			timer: 1500,
		});
		handleCloseModal();
		navigate('/gestiongastos');
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title className='titlemodal'>
							Cargar Nuevo Gasto
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form
							className='Formcarga'
							onSubmit={onSubmit}>

							<Form.Group className='mb-3' controlId='inputname'>
								<Form.Label className='labelcarga'>
									Expediente
								</Form.Label>
								<select
									className='inputcarga'
									aria-label='Default select'
									{...register('nroexpte')}>
									<option>Selecciona..</option>
									{exptes.map((expte) => (
										<option key={expte._id} value={expte.nroexpte}>
											{expte.nroexpte}
										</option>
									))}
								</select>
							</Form.Group>

							<Form.Group
								className='mb-3 grupocaratula'
								controlId='inputcaratula'>
								<Form.Label className='labelcarga'>Caratula</Form.Label>
								<Form.Control
									className='labelcarcaratula'
									type='text'
									{...register('caratula')}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='inputconcepto'>
								<Form.Label className='labelcarga'>Concepto</Form.Label>
								<select
									className='inputcarga'
									aria-label='Default select'
									{...register('concepto')}>
									<option>Selecciona..</option>
									<option value='Planilla Fiscal'>
										Planilla Fiscal
									</option>
									<option value='Gastos de Apersonamiento'>
										Gastos de Apersonamiento
									</option>
									<option value='Bonos de Movilidad'>
										Bonos de Movilidad
									</option>
									<option value='Honorarios Profesionales'>
										Honorarios Profesionales
									</option>
									<option value='Gastos de pericias'>
										Gastos de pericias
									</option>
									<option value='Gastos Extrajudiciales'>
										Gastos Extrajudiciales
									</option>
								</select>
							</Form.Group>

							<Form.Group className='' controlId='inputmonto'>
								<Form.Label className='labelcarga'>Monto</Form.Label>
								<Form.Control
									className='inputcarga'
									type='number'
									{...register('monto')}
								/>
							</Form.Group>

							<Form.Group className='' controlId='inputcel'>
								<Form.Label className='labelcarga'>
									Comprobante de gasto
								</Form.Label>
								<Form.Control
									className='inputcarga'
									type='text'
									{...register('comprobante')}
								/>
							</Form.Group>

							<Form.Group
								className='formcargagroup'
								controlId='inputsubname'>
								<Form.Label className='labelcarga'>Estado</Form.Label>
								<select
									className='inputcarga'
									aria-label='Default select'
									{...register('estado')}>
									<option>Selecciona..</option>
									<option value='Pendiente'>Pendiente</option>
									<option value='Pagado'>Pagado</option>
									<option value='Cancelado'>Cancelado</option>
								</select>
							</Form.Group>

							<Form.Group
								className='mb-3 botonescarga'
								controlId='inputpassword'>
								<Button className='botoneditcarga' type='submit'>
									<i className='iconavbar bi bi-check2-square'></i>
									Registrar Gasto
								</Button>
								<Link to='/gestiongastos' className='btncanccarga'>
									<i className='iconavbar bi bi-x-circle-fill'></i>
									Cancelar
								</Link>
							</Form.Group>
						</Form>
					</Modal.Body>
				</Modal>
			</div>
		</>
	);
};
