import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../css/Carga.css';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useCajas } from '../context/CajasContext';
import { format } from 'date-fns';

export const CargaCajas = () => {
	const { user } = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	const { createCaja, getCajas } = useCajas();
	const [cajas, setCajas] = useState([]);
	const [showModal, setShowModal] = useState(true);

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	// Función para cerrar el modal
	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/gestioncaja');
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedCajas = await getCajas();
				setCajas(fetchedCajas);
			} catch (error) {
				console.error('Error al obtener cajas:', error);
			}
		};
		fetchData();
	}, []);

	const onSubmit = handleSubmit(async (values) => {
		const fechaFormateada = format(new Date(values.fecha), 'dd/MM/yyyy');
		createCaja({ ...values, fecha: fechaFormateada });
		Swal.fire({
			icon: 'success',
			title: 'Caja registrada correctamente',
			showConfirmButton: false,
			timer: 1500,
		});
		handleCloseModal();
		navigate('/gestioncaja');
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title className='titlemodal'>
							Cargar Movimiento de Caja
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form className='Formcarga' onSubmit={onSubmit}>
							<Form.Group className='mb-3' controlId='inputname'>
								<Form.Label className='labelcarga'>Fecha</Form.Label>
								<Form.Control
									type='date'
									className='inputcarga'
									aria-label='Default select'
									{...register('fecha')}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='inputconcepto'>
								<Form.Label className='labelcarga'>Concepto</Form.Label>
								<Form.Control
									type='text'
									className='inputcarga'
									aria-label='Default select'
									{...register('concepto')}></Form.Control>
							</Form.Group>

							<Form.Group className='mb-3' controlId='inputmonto'>
								<Form.Label className='labelcarga'>Tipo</Form.Label>
								<Form.Control
									className='inputcarga'
									type='text'
									{...register('tipo')}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='inputmonto'>
								<Form.Label className='labelcarga'>Monto</Form.Label>
								<Form.Control
									className='inputcarga'
									type='number'
									{...register('monto')}
								/>
							</Form.Group>

							<Form.Group className='' controlId='inputcel'>
								<Form.Label className='labelcarga'>
									Comprobante de caja
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
									Registrar Movimiento
								</Button>
								<Link to='/gestioncaja' className='btncanccarga'>
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
