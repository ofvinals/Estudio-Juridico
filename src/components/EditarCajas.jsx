import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const EditarCajas = ({}) => {
	const user = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();
	const { register, handleSubmit, setValue } = useForm();
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
				Swal.showLoading();
				const cajaRef = doc(db, 'cajas', id);
				const snapshot = await getDoc(cajaRef);
				console.log('Datos de la caja cargada:', snapshot.data());
				const cajaData = snapshot.data();
				setValue('fecha', cajaData.fecha);
				setValue('concepto', cajaData.concepto);
				setValue('tipo', cajaData.tipo);
				setValue('monto', cajaData.monto);
				setValue('adjunto', cajaData.file);
				setValue('estado', cajaData.estado);
				setTimeout(() => {
					Swal.close();
					handleOpenModal();
				}, 500);
				return () => clearTimeout(timer);
			} catch (error) {
				console.error('Error al cargar el caja', error);
			}
		}
		loadCaja();
	}, []);

	const onSubmit = handleSubmit(async (values) => {
		try {
			Swal.showLoading();
			let fileDownloadUrl = null;
			if (values.file && values.file[0]) {
				const file = values.file[0];
				fileDownloadUrl = await uploadFile(file);
			}
			const fechaSeleccionada = new Date(values.fecha);
			const fechaFormateada = fechaSeleccionada.toLocaleDateString('es-AR');
			const cajaData = {
				fecha: fechaFormateada,
				concepto: values.concepto,
				tipo: values.tipo,
				monto: parseInt(values.monto, 10),
				fileUrl: fileDownloadUrl,
				estado: values.estado,
			};
			const cajaRef = doc(db, 'cajas', id);
			await updateDoc(cajaRef, cajaData);
			Swal.fire({
				icon: 'success',
				title: 'Caja editada correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
			setTimeout(() => {
				Swal.close();
				handleCloseModal();
				navigate('/gestioncaja');
			}, 500);
		} catch (error) {
			console.error(error);
		}
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
									<option value='INGRESO'>INGRESO</option>
									<option value='EGRESO'>EGRESO</option>
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
									type='file'
									{...register('file')}
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
								<button className='botonedit' type='submit'>
									<i className='iconavbar bi bi-check2-square'></i>
									Guardar Cambios
								</button>
								<button
									type='button'
									className='botoncancedit'
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
