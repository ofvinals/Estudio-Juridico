import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import Swal from 'sweetalert2';
import { useExptes } from '../context/ExptesContext';
import { useForm } from 'react-hook-form';
import { useUsers } from '../context/UsersContext';
import { Modal } from 'react-bootstrap';

export const EditarExptes = ({}) => {
	const { user } = useAuth();
	const params = useParams();
	const { getExpte, updateExpte } = useExptes();
	const { getUsers } = useUsers();
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
				if (params.id) {
					const expte = await getExpte(params.id);

					setValue('cliente', expte.cliente);
					setValue('nroexpte', expte.nroexpte);
					setValue('radicacion', expte.radicacion);
					setValue('juzgado', expte.juzgado);
					setValue('caratula', expte.caratula);
					setValue('actor', expte.actor);
					setValue('demandado', expte.demandado);
					setValue('proceso', expte.proceso);
					setValue('estado', expte.estado);

					const caratulaValue = `${expte.actor} c/ ${expte.demandado} s/ ${expte.proceso}`;
					setValue('caratula', caratulaValue);
					// Abre automáticamente el modal cuando se cargan los datos del turno
					handleOpenModal();
				}
			} catch (error) {
				console.error('Error al cargar el expediente', error);
			}
		}
		loadExpte();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedUsers = await getUsers();
				setUsers(fetchedUsers);
			} catch (error) {
				console.error('Error al obtener usuarios:', error);
			}
		};

		fetchData();
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
		await updateExpte(params.id, data);
		Swal.fire({
			icon: 'success',
			title: 'Expediente editado correctamente',
			showConfirmButton: false,
			timer: 1500,
		});
		navigate('/gestionexpedientes');
		// Cierra el modal después de guardar los cambios
		handleCloseModal();
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title className='titlemodal'>
							Modificar Datos de Expediente
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form
							className='formedit'
							onSubmit={onSubmit}>

							<Form.Group className='formcargaexp' id='inputname'>
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

							<Form.Group id='inputname'>
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

							<Form.Group id='inputsubname'>
								<Form.Label className='labeledit'>
									Fuero de Radicacion
								</Form.Label>
								<select
									className='inputedit'
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

							<Form.Group id='inputsubname'>
								<Form.Label className='labeledit'>
									Juzgado de Radicacion
								</Form.Label>
								<select
									className='inputedit'
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

							<Form.Group id='inputdomic'>
								<Form.Label className='labeledit'>Actor</Form.Label>
								<Form.Control
									className='inputedit'
									type='text'
									{...register('actor')}
								/>
							</Form.Group>

							<Form.Group id='inputcel'>
								<Form.Label className='labeledit'>Demandado</Form.Label>
								<Form.Control
									className='inputedit'
									type='text'
									{...register('demandado')}
								/>
							</Form.Group>

							<Form.Group id='inputemail'>
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

							<Form.Group className='' id='inputemail'>
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
