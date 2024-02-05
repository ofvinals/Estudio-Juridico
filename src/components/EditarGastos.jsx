import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { db } from '../firebase/config';
import {
	doc,
	getDoc,
	getDocs,
	updateDoc,
	collection,
} from 'firebase/firestore';

export const EditarGastos = ({}) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [exptes, setExptes] = useState([]);
	const { register, handleSubmit, setValue, watch } = useForm();
	const [showModal, setShowModal] = useState(false);
	const [selectedExpteCaratula, setSelectedExpteCaratula] = useState('');

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

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
		async function loadGasto() {
			try {
				Swal.fire({
					title: 'Cargando...',
					allowOutsideClick: false,
					showConfirmButton: false,
				});
				const gastoRef = doc(db, 'gastos', id);
				const snapshot = await getDoc(gastoRef);
				const gastoData = snapshot.data();
				setValue('nroexpte', gastoData.expte);
				setValue('caratula', gastoData.caratula);
				setValue('concepto', gastoData.concepto);
				setValue('comprobante', gastoData.comprobante);
				setValue('monto', gastoData.monto);
				setValue('estado', gastoData.estado);
				Swal.fire({
					icon: 'success',
					title: 'Gasto editado correctamente',
					showConfirmButton: false,
					timer: 1500,
					
				});
				handleOpenModal();
				Swal.close();
			} catch (error) {
				console.error('Error al cargar el gasto', error);
				Swal.fire({
					icon: 'error',
					title: 'Error al editar el gasto. Intente nuevamente!',
					showConfirmButton: false,
					timer: 1500,
				});
			}
		}
		loadGasto();
	}, []);

	const handleExpteSelectChange = async (e) => {
		const selectedExpteNro = e.target.value;
		updateCaratula(selectedExpteNro);
	};
	const updateCaratula = (selectedExpteNro) => {
		const selectedExpte = exptes.find(
			(expte) => expte.nroexpte === selectedExpteNro
		);
		const caratulaToUpdate = selectedExpte ? selectedExpte.caratula : '';
		setSelectedExpteCaratula(caratulaToUpdate);
		setValue('caratula', caratulaToUpdate);
	};

	useEffect(() => {
		// Llamada inicial para establecer la carátula
		updateCaratula(watch('nroexpte'));
	}, []);

	useEffect(() => {
		// Llamada cada vez que cambie el valor de nroexpte
		updateCaratula(watch('nroexpte'));
	}, [watch('nroexpte')]);

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
				caratula: selectedExpteCaratula,
				concepto: values.concepto,
				monto: parseInt(values.monto, 10),
				fileUrl: fileDownloadUrl,
				estado: values.estado,
			};
			const gastoRef = doc(db, 'gastos', id);
			await updateDoc(gastoRef, gastoData);
			Swal.fire({
				icon: 'success',
				title: 'Gasto editado correctamente',
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
				title: 'Error al editar el gasto. Intente nuevamente!',
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
									{...register('nroexpte')}
									onChange={handleExpteSelectChange}>
									<option>Selecciona..</option>
									{exptes.map((expte) => (
										<option
											key={expte.nroexpte}
											value={expte.nroexpte}>
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
									readOnly
								/>
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

							<Form.Group className='' controlId='inputmonto'>
								<Form.Label className='labeledit'>Monto</Form.Label>
								<Form.Control
									className='inputedit'
									type='number'
									{...register('monto')}
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

							<Form.Group className='' controlId='inputcel'>
								<Form.Label className='labeledit'>
									Comprobante de gasto
								</Form.Label>
								<Form.Control
									className='inputedit'
									type='file'
									{...register('file')}
								/>
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
