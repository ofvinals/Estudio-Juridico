import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import Swal from 'sweetalert2';
import {  Modal } from 'react-bootstrap';
import { useCajas } from '../context/CajasContext';
import { useForm } from 'react-hook-form';

export const EditarCajas = ({}) => {
	const { user } = useAuth();
	const params = useParams();
	const navigate = useNavigate();
	const { register, handleSubmit, setValue } = useForm();
	const { getCaja, updateCaja } = useCajas();
	const [showModal, setShowModal] = useState(false);

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	// Función para cerrar el modal
	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/gestioncaja');
	};

	// Función para cargar los datos de cajas al abrir la página
	useEffect(() => {
		async function loadCaja() {
			try {
				if (params.id) {
					const caja = await getCaja(params.id);
					setValue('fecha', caja.fecha);
					setValue('concepto', caja.concepto);
					setValue('tipo', caja.tipo);
					setValue('monto', caja.monto);
					setValue('adjunto', caja.adjunto);
					setValue('estado', caja.estado);
					// Abre automáticamente el modal cuando se cargan los datos del turno
					handleOpenModal();
				}
			} catch (error) {
				console.error('Error al cargar el caja', error);
			}
		}
		loadCaja();
	}, []);

	const onSubmit = handleSubmit(async (data) => {
		await updateCaja(params.id, data);
		Swal.fire({
			icon: 'success',
			title: 'Caja editada correctamente',
			showConfirmButton: false,
			timer: 1500,
		});
		// Cierra el modal después de guardar los cambios
		handleCloseModal();
		navigate('/gestioncaja');
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title className='titlemodal'>
							Modificar Movimiento de Caja
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

							<Form.Group className='mb-3' id='inputtipo'>
								<Form.Label className='labelcarga'>Tipo</Form.Label>
								<select
									className='inputcarga'
									aria-label='Default select'
									{...register('tipo')}>
									<option>Selecciona..</option>
									<option value='Ingreso'>Ingreso</option>
									<option value='Egreso'>Egreso</option>
								</select>
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
									<option value='Cobrado'>Cobrado</option>
									<option value='Cancelado'>Cancelado</option>
								</select>
							</Form.Group>

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
