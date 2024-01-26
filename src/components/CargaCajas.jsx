import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../css/Carga.css';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { uploadFile } from '../firebase/config.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const CargaCajas = () => {
	const user = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
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
				const cajasRef = collection(db, 'cajas');
				const fetchedCajas = await getDocs(cajasRef);
				const cajasArray = Object.values(
					fetchedCajas.docs.map((doc) => doc.data())
				);
				setCajas(cajasArray);
			} catch (error) {
				console.error('Error al obtener cajas:', error);
			}
		};
		fetchData();
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

			fechaSeleccionada.setMinutes(fechaSeleccionada.getMinutes() - fechaSeleccionada.getTimezoneOffset());
			const fechaFormateada = fechaSeleccionada.toLocaleDateString('es-AR');
			const cajaData = {
				fecha: fechaFormateada,
				mes: fechaSeleccionada.getMonth() + 1,
				concepto: values.concepto,
				tipo: values.tipo,
				monto: parseInt(values.monto, 10),
				fileUrl: fileDownloadUrl,
				estado: values.estado,
			};

			const cajaDocRef = await addDoc(collection(db, 'cajas'), cajaData);
			console.log('Documento agregado con ID: ', cajaDocRef.id);
			Swal.fire({
				icon: 'success',
				title: 'Caja registrada correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
			setTimeout(() => {
				setShowModal(true);
				handleCloseModal();
				navigate('/gestioncaja');
			}, 500);
			return () => clearTimeout(timer);

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
							Cargar Movimiento de Caja
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form
							className='Formcarga'
							onSubmit={onSubmit}
							action='/uploads'
							method='post'
							encType='multipart/form-data'>
							<Form.Group id='inputname'>
								<Form.Label className='labelcarga'>Fecha</Form.Label>
								<Form.Control
									type='date'
									className='inputcarga'
									aria-label='Default select'
									{...register('fecha')}
								/>
							</Form.Group>

							<Form.Group id='inputconcepto'>
								<Form.Label className='labelcarga'>Concepto</Form.Label>
								<Form.Control
									type='text'
									className='inputcarga '
									aria-label='Default select'
									{...register('concepto')}></Form.Control>
							</Form.Group>

							<Form.Group id='inputtipo'>
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

							<Form.Group id='inputmonto'>
								<Form.Label className='labelcarga'>Monto</Form.Label>
								<Form.Control
									className='inputcarga'
									type='number'
									{...register('monto')}
								/>
							</Form.Group>

							<Form.Group id='inputcel'>
								<Form.Label className='labelcarga'>
									Comprobante de caja
								</Form.Label>
								<Form.Control
									className='inputcarga'
									type='file'
									{...register('file')}
								/>
							</Form.Group>

							<Form.Group id='inputsubname'>
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

							<Form.Group className='botonescarga' id='inputpassword'>
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
