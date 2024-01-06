import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import { Button, Modal } from 'react-bootstrap';
import { useGastos } from '../context/GastosContext';
import { useForm } from 'react-hook-form';
import { useExptes } from '../context/ExptesContext';

export const EditarGastos = ({}) => {
	const { user } = useAuth();
	const params = useParams();
	const navigate = useNavigate();
	const [exptes, setExptes] = useState([]);
	const { register, handleSubmit, setValue } = useForm();
	const { getGasto, updateGasto } = useGastos();
	const { getExptes } = useExptes();
	const [showModal, setShowModal] = useState(false);

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	// Función para cerrar el modal
	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/gestiongastos');
	};

	// Función para cargar los datos de gastos al abrir la página
	useEffect(() => {
		async function loadGasto() {
			try {
				if (params.id) {
					const gasto = await getGasto(params.id);
					setValue('nroexpte', gasto.nroexpte);
					setValue('concepto', gasto.concepto);
					setValue('comprobante', gasto.comprobante);
					setValue('monto', gasto.monto);
					setValue('estado', gasto.estado);
					// Abre automáticamente el modal cuando se cargan los datos del turno
					handleOpenModal();
				}
			} catch (error) {
				console.error('Error al cargar el gasto', error);
			}
		}
		loadGasto();
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

	const onSubmit = handleSubmit(async (data) => {
		await updateGasto(params.id, data);
		// Cierra el modal después de guardar los cambios
		handleCloseModal();
		navigate('/gestiongastos');
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title className='titlemodal'>
							Modificar Gasto
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form className='formedit' onSubmit={onSubmit}>
							<Form.Group className='mb-3' controlId='inputname'>
								<Form.Label className='labeledit'>
									Expediente
								</Form.Label>
								<select
									className='inputedit'
									aria-label='Default select'
									name='expte'
									{...register('nroexpte')}>
									<option>Selecciona..</option>
									{exptes.map((expte) => (
										<option key={expte._id} value={expte.nroexpte}>
											{expte.nroexpte}
										</option>
									))}
								</select>
							</Form.Group>

							<Form.Group className='mb-3' controlId='inputconcepto'>
								<Form.Label className='labeledit'>Concepto</Form.Label>
								<select
									className='inputedit'
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

							<Form.Group className='mb-3' controlId='inputmonto'>
								<Form.Label className='labeledit'>Monto</Form.Label>
								<Form.Control
									className='inputedit'
									type='number'
									{...register('monto')}
								/>
							</Form.Group>

							<Form.Group className='' controlId='inputcel'>
								<Form.Label className='labeledit'>
									Comprobante de gasto
								</Form.Label>
								<Form.Control
									className='inputedit'
									type='text'
									{...register('comprobante')}
								/>
							</Form.Group>

							<Form.Group
								className='formcargagroup'
								controlId='inputsubname'>
								<Form.Label className='labeledit'>Estado</Form.Label>
								<select
									className='inputedit'
									aria-label='Default select'
									{...register('estado')}>
									<option>Selecciona..</option>
									<option value='Pendiente'>Pendiente</option>
									<option value='Pagado'>Pagado</option>
									<option value='Cancelado'>Cancelado</option>
								</select>
							</Form.Group>

							{/* <Form.Group
						className='mb-3 grupocaratula'
						controlId='inputcaratula'>
						<Form.Label className='labelcarga'>Caratula</Form.Label>
						<Form.Control
							className='labelcarcaratula'
							type='text'
							{...register('caratula')}
						/>
					</Form.Group> */}

							<Form.Group className='botonesedit'>
								<button className='btnconfmodal' type='submit'>
									<i className='iconavbar bi bi-check2-square'></i>
									Guardar Cambios
								</button>
								<button
									type='button'
									className='btncancmodal'
									onClick={handleCloseModal}>
									<i className='iconavbar bi bi-x-circle-fill'></i>
									Cancelar
								</button>
							</Form.Group>
						</Form>
					</Modal.Body>
				</Modal>
			</div>
		</>
	);
};
