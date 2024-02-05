import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { uploadFile } from '../firebase/config.js';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const EditarCajas = ({}) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { register, handleSubmit, setValue } = useForm();
	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/gestioncaja');
	};

	// Función para cargar los datos de cajas al abrir la página
	useEffect(() => {
		async function loadCaja() {
			try {
				Swal.fire({
					title: 'Cargando...',
					allowOutsideClick: false,
					showConfirmButton: false,
				});
				const cajaRef = doc(db, 'cajas', id);
				const snapshot = await getDoc(cajaRef);
				const cajaData = snapshot.data();
				setValue('fecha', cajaData.fecha);
				setValue('concepto', cajaData.concepto);
				setValue('tipo', cajaData.tipo);
				setValue('monto', cajaData.monto);
				setValue('adjunto', cajaData.file);
				setValue('estado', cajaData.estado);
				handleOpenModal();
				Swal.fire({
					icon: 'success',
					title: 'Caja editada correctamente',
					showConfirmButton: false,
					timer: 1500,
				});
			} catch (error) {
				console.error('Error al cargar el caja', error);
				Swal.fire({
					icon: 'error',
					title: 'Error al editar la caja. Intente nuevamente!',
					showConfirmButton: false,
					timer: 1500,
				});
			}
		}
		loadCaja();
	}, []);

	const onSubmit = handleSubmit(async (values) => {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			let fileDownloadUrl = null;
			if (values.file && values.file[0]) {
				const file = values.file[0];
				fileDownloadUrl = await uploadFile(file);
			}
			const fechaSeleccionada = new Date(values.fecha);
			const fechaFormateada = fechaSeleccionada.toLocaleDateString('es-ES');
			const cajaData = {
				fecha: fechaFormateada,
				mes: fechaSeleccionada.getMonth() + 1,
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
			handleCloseModal();
			Swal.close();
			navigate('/gestioncaja');
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error al editar la caja. Intente nuevamente!',
				showConfirmButton: false,
				timer: 1500,
			});
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
