import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';
import { db } from '../firebase/config';
import {
	doc,
	getDoc,
	getDocs,
	collection,
	updateDoc,
} from 'firebase/firestore';
import { DateTimePicker } from '@mui/x-date-pickers';

export const EditarExptes = ({}) => {
	const { id } = useParams();
	const [users, setUsers] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const { register, handleSubmit, setValue, watch, unregister } = useForm();
	const navigate = useNavigate();

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	// Función para cerrar el modal
	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/gestionexpedientes');
	};

	// Función para cargar los datos del expediente al abrir la página
	useEffect(() => {
		async function loadExpte() {
			try {
				const expteRef = doc(db, 'expedientes', id);
				const snapshot = await getDoc(expteRef);
				const expteData = snapshot.data();
				setValue('cliente', expteData.cliente);
				setValue('nroexpte', expteData.nroexpte);
				setValue('radicacion', expteData.radicacion);
				setValue('juzgado', expteData.juzgado);
				setValue('caratula', expteData.caratula);
				setValue('actor', expteData.actor);
				setValue('demandado', expteData.demandado);
				setValue('proceso', expteData.proceso);
				setValue('estado', expteData.estado);
				const caratulaValue = `${expteData.actor} c/ ${expteData.demandado} s/ ${expteData.proceso}`;
				setValue('caratula', caratulaValue);
				handleOpenModal();
			} catch (error) {
				console.error('Error al editar el expediente', error);
			}
		}
		loadExpte();
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

	useEffect(() => {
		const updateCaratula = () => {
			const actor = watch('actor');
			const demandado = watch('demandado');
			const proceso = watch('proceso');
			const caratulaValue = `${actor} c/ ${demandado} s/ ${proceso}`;
			setValue('caratula', caratulaValue);
		};
		watch(['actor', 'demandado', 'proceso'], updateCaratula);
		return () => {
			unregister(['actor', 'demandado', 'proceso']);
		};
	}, [watch, setValue, unregister]);

	const onSubmit = handleSubmit(async (data) => {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			const expteRef = doc(db, 'expedientes', id);
			await updateDoc(expteRef, data);
			Swal.fire({
				icon: 'success',
				title: 'Expediente editado correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
			navigate('/gestionexpedientes');
			Swal.close();
			handleCloseModal();
		} catch (error) {
			console.error('Error al eliminar el expediente:', error);
			Swal.fire({
				icon: 'error',
				title: 'Error al editar el expediente. Intente nuevamente!',
				showConfirmButton: false,
				timer: 1500,
			});
		}
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal size='lg' show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title>Modificar Datos de Expediente</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form className='formedit' onSubmit={onSubmit}>
							<Form.Group className='groupedit' id='inputname'>
								<Form.Label className='labeledit'>Cliente</Form.Label>
								<select
									className='inputedit'
									aria-label='Default select'
									{...register('cliente')}>
									<option>Selecciona..</option>
									{users.map((user) => (
										<option key={user._id} value={user.email}>
											{user.email}
										</option>
									))}
								</select>
							</Form.Group>
							<DateTimePicker />
							<Form.Group className='groupedit' id='inputname'>
								<Form.Label className='labeledit'>
									Nro Expediente
								</Form.Label>
								<Form.Control
									className='inputedit'
									type='text'
									{...register('nroexpte')}
								/>
							</Form.Group>

							<Form.Group
								className='mb-3 grupocaratula'
								id='inputcaratula'>
								<Form.Label className='labeledit'>Caratula</Form.Label>
								<Form.Control
									className='labelcarcaratula'
									type='text'
									{...register('caratula')}
								/>
							</Form.Group>

							<Form.Group className='groupedit' id='inputradic'>
								<Form.Label className='labeledit w-50'>
									Fuero de Radicacion
								</Form.Label>
								<select
									className='inputedit w-50'
									aria-label='Default select'
									{...register('radicacion')}>
									<option>Selecciona..</option>
									<option value='Civil y Comercial'>
										Civil y Comercial
									</option>
									<option value='Contensioso Admnistrativo'>
										Contensioso Admnistrativo
									</option>
									<option value='Documentos y Locaciones'>
										Documentos y Locaciones
									</option>
									<option value='Familia y Sucesiones'>
										Familia y Sucesiones
									</option>
									<option value='Trabajo'>Trabajo</option>
								</select>
							</Form.Group>

							<Form.Group className='groupedit' id='inputradic'>
								<Form.Label className='labeledit w-50'>
									Juzgado de Radicacion
								</Form.Label>
								<select
									className='inputedit w-50'
									aria-label='Default select'
									{...register('juzgado')}>
									<option>Selecciona..</option>
									<option value='I NOM'>I NOM</option>
									<option value='II NOM'>II NOM</option>
									<option value='III NOM'>III NOM</option>
									<option value='IV NOM'>IV NOM</option>
									<option value='V NOM'>V NOM</option>
									<option value='VI NOM'>VI NOM</option>
									<option value='VII NOM'>VII NOM</option>
									<option value='VIII NOM'>VIII NOM</option>
									<option value='IX NOM'>IX NOM</option>
									<option value='X NOM'>X NOM</option>
									<option value='XI NOM'>XI NOM</option>
									<option value='XII NOM'>XII NOM</option>
								</select>
							</Form.Group>

							<Form.Group className='groupedit' id='inputdomic'>
								<Form.Label className='labeledit'>Actor</Form.Label>
								<Form.Control
									className='inputedit'
									type='text'
									{...register('actor')}
								/>
							</Form.Group>

							<Form.Group className='groupedit' id='inputcel'>
								<Form.Label className='labeledit'>Demandado</Form.Label>
								<Form.Control
									className='inputedit'
									type='text'
									{...register('demandado')}
								/>
							</Form.Group>

							<Form.Group className='groupedit' id='inputemail'>
								<Form.Label className='labeledit'>
									Tipo de Proceso
								</Form.Label>
								<select
									className='inputedit'
									aria-label='Default select example'
									{...register('proceso')}>
									<option>Selecciona..</option>
									<option value='Cobro de Pesos'>
										Cobro de Pesos
									</option>
									<option value='Daños y Perjuicios'>
										Daños y Perjuicios
									</option>
									<option value='Desalojo'>Desalojo</option>
									<option value='Cobro Ejecutivo'>
										Cobro Ejecutivo
									</option>
									<option value='Reivindicacion'>
										Reivindicacion
									</option>
									<option value='Sucesion'>Sucesion</option>
									<option value='Sucesion'>Sucesion</option>
								</select>
							</Form.Group>

							<Form.Group className='groupedit' id='inputemail'>
								<Form.Label className='labeledit'>Estado</Form.Label>
								<select
									className='inputedit'
									aria-label='Default select'
									{...register('estado')}>
									<option>Selecciona..</option>
									<option value='En tramite'>En tramite</option>
									<option value='Mediacion'>Mediacion</option>
									<option value='Extrajudicial'>Extrajudicial</option>
									<option value='Terminado'>Terminado</option>
									<option value='Caduco'>Caduco</option>
								</select>
							</Form.Group>

							<Form.Group className='botonesedit'>
								<button className='botonedit' type='submit'>
									<i className='iconavbar bi bi-check2-square'></i>
									Guardar Cambios
								</button>
								<Link
									to='/gestionexpedientes'
									className='botoncancedit'>
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
