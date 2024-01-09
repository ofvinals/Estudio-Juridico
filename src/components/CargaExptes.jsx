import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import '../css/Carga.css';
import Swal from 'sweetalert2';
import { Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useExptes } from '../context/ExptesContext';
import { useUsers } from '../context/UsersContext';

export const CargaExptes = () => {
	const { user } = useAuth();
	const { register, handleSubmit } = useForm();
	const { exptes, createExpte } = useExptes();
	const { getUsers } = useUsers();
	const [users, setUsers] = useState([]);
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(true);

		// Función para abrir el modal
		const handleOpenModal = () => setShowModal(true);

		// Función para cerrar el modal
		const handleCloseModal = () => {
			setShowModal(false);
			handleCloseModal();
			navigate('/gestionexpedientes');
		};

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

	const onSubmit = handleSubmit(async (values) => {
		createExpte(values);
		Swal.fire({
			icon: 'success',
			title: 'Expediente registrado correctamente',
			showConfirmButton: false,
			timer: 1500,
		});
		navigate('/gestionexpedientes');
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title className='titlemodal'>
							Cargar Nuevo Expediente
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
				<Form
					className='Formcarga '
					onSubmit={onSubmit}>

					<Form.Group className='formcargagroup' controlId='inputname'>
						<Form.Label className='labelcarga'>Cliente</Form.Label>
						<select
							className='inputcarga'
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

					<Form.Group className='formcargagroup' controlId='inputname'>
						<Form.Label className='labelcarga'>Nro Expediente</Form.Label>
						<Form.Control
							className='inputcarga'
							type='text'
							{...register('nroexpte')}
						/>
					</Form.Group>

					<Form.Group className='formcargagroup' controlId='inputsubname'>
						<Form.Label className='labelcarga'>
							Fuero de Radicacion
						</Form.Label>
						<select
							className='inputcarga'
							aria-label='Default select'
							{...register('radicacion')}>
							<option>Selecciona..</option>
							<option value='Civil y Comercial'>
								Civil y Comercial Comun
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

					<Form.Group className='formcargagroup' controlId='inputsubname'>
						<Form.Label className='labelcarga'>
							Juzgado de Radicacion
						</Form.Label>
						<select
							className='inputcarga'
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

					<Form.Group className='formcargagroup' controlId='inputdomic'>
						<Form.Label className='labelcarga'>Actor</Form.Label>
						<Form.Control
							className='inputcarga'
							type='text'
							{...register('actor')}
						/>
					</Form.Group>

					<Form.Group className='formcargagroup' controlId='inputcel'>
						<Form.Label className='labelcarga'>Demandado</Form.Label>
						<Form.Control
							className='inputcarga'
							type='text'
							{...register('demandado')}
						/>
					</Form.Group>

					<Form.Group className='formcargagroup' controlId='inputemail'>
						<Form.Label className='labelcarga'>
							Tipo de Proceso
						</Form.Label>
						<select
							className='inputcarga'
							aria-label='Default select'
							{...register('proceso')}>
							<option>Selecciona..</option>
							<option value='Cobro de Pesos'>Cobro de Pesos</option>
							<option value='Daños y Perjuicios'>
								Daños y Perjuicios
							</option>
							<option value='Desalojo'>Desalojo</option>
							<option value='Cobro Ejecutivo'>Cobro Ejecutivo</option>
							<option value='Reivindicacion'>Reivindicacion</option>
							<option value='Sucesion'>Sucesion</option>
							<option value='Accion de Consumo'>
								Accion de Consumo
							</option>
						</select>
					</Form.Group>

					<Form.Group className='formcargagroup' controlId='inputsubname'>
						<Form.Label className='labelcarga'>Estado</Form.Label>
						<select
							className='inputcarga'
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

					<Form.Group className='botonescarga'>
						<Button className='botoneditcarga' type='submit'>
							<i className='iconavbar bi bi-check2-square'></i>
							Agregar Expediente
						</Button>
						<Link to='/gestionexpedientes' className='btncanccarga'>
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
