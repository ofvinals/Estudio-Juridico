import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../css/Carga.css';
import { useForm } from 'react-hook-form';
import { uploadFile } from '../firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const CargaGastos = () => {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	const [exptes, setExptes] = useState([]);
	const [users, setUsers] = useState([]);
	const [showModal, setShowModal] = useState(true);
	const [selectedExpteCaratula, setSelectedExpteCaratula] = useState('');

	// Función para cerrar el modal
	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/gestiongastos');
	};

	useEffect(() => {
		const fetchExptes = async () => {
			try {
				const exptesRef = collection(db, 'expedientes');
				const fetchedExptes = await getDocs(exptesRef);
				const exptesArray = Object.values(
					fetchedExptes.docs.map((doc) => doc.data())
				);
				setExptes(exptesArray);
			} catch (error) {
				console.error('Error al obtener expedientes:', error);
			}
		};
		fetchExptes();
	}, []);

	useEffect(() => {
		const fetchUsuarios = async () => {
			try {
				const usuariosRef = collection(db, 'usuarios');
				const fetchedUsers = await getDocs(usuariosRef);
				const usersArray = Object.values(
					fetchedUsers.docs.map((doc) => doc.data())
				);
				setUsers(usersArray);
			} catch (error) {
				console.error('Error al obtener usuarios:', error);
			}
		};
		fetchUsuarios();
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
			const gastoData = {
				expte: values.nroexpte,
				cliente: values.cliente,
				caratula: selectedExpteCaratula,
				concepto: values.concepto,
				monto: parseInt(values.monto, 10),
				fileUrl: fileDownloadUrl,
				estado: values.estado,
			};
			await addDoc(collection(db, 'gastos'), gastoData);
			Swal.fire({
				icon: 'success',
				title: 'Gasto registrado correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
			Swal.close();
			handleCloseModal();
			navigate('/gestiongastos');
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Error al registrar el gasto. Intente nuevamente!',
				showConfirmButton: false,
				timer: 1500,
			});
		}
	});

	// Función para manejar el cambio en el select de número de expediente
	const handleExpteSelectChange = async (e) => {
		const selectedExpteNro = e.target.value;
		const selectedExpte = exptes.find(
			(expte) => expte.nroexpte === selectedExpteNro
		);
		// Obtén la carátula del expediente seleccionado
		const caratulaToUpdate = selectedExpte ? selectedExpte.caratula : '';
		// Actualiza la carátula de manera asíncrona
		await setSelectedExpteCaratula(caratulaToUpdate);
		// Continúa con otras operaciones después de asegurarte de que la carátula está actualizada
	};

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
						<Form className='Formcarga' onSubmit={onSubmit}>
							<Form.Group className='mb-3' controlId='inputname'>
								<Form.Label className='labelcarga'>
									Expediente
								</Form.Label>
								<select
									className='inputcarga'
									aria-label='Default select'
									{...register('nroexpte')}
									onChange={handleExpteSelectChange}>
									<option>Selecciona..</option>
									{exptes.map((expte) => (
										<option key={expte.mid} value={expte.nroexpte}>
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
									value={selectedExpteCaratula}
									{...register('caratula')}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='inputname'>
								<Form.Label className='labelcarga'>Cliente</Form.Label>
								<select
									className='inputcarga'
									aria-label='Default select'
									{...register('cliente')}>
									<option>Selecciona..</option>
									{users.map((user) => (
										<option key={user._id} value={user.cliente}>
											{user.cliente}
										</option>
									))}
								</select>
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

							<Form.Group className='' controlId='file'>
								<Form.Label className='labelcarga'>
									Comprobante de gasto
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
