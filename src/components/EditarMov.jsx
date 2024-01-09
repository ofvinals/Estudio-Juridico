import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useUsers } from '../context/UsersContext';
import { useExptes } from '../context/ExptesContext';

export const EditarMov = () => {
	const { user } = useAuth();
	const params = useParams();
	const navigate = useNavigate();
	const { getUsers } = useUsers();
	const [users, setUsers] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const { register, handleSubmit, setValue} = useForm();
	const { getMov, updateMov } = useExptes();

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	// Función para cerrar el modal
	const handleCloseModal = (movId) => {
		console.log(movId); 
		setShowModal(false);
		navigate(`/gestionmovimientos/${movId}`, { replace: true });	};

	// Función para cargar los datos del expediente al abrir la página
	useEffect(() => {
		async function loadMov() {
			try {
				if (params.id) {
					const mov = await getMov(params.id);
					const formattedDate = new Date(mov.fecha).toISOString().split('T')[0];

					setValue('nroexpte', mov.nroexpte);
					setValue('fecha', formattedDate);
					setValue('descripcion', mov.descripcion);
					setValue('adjunto', mov.adjunto);
					// Abre automáticamente el modal cuando se cargan los datos del turno
					handleOpenModal();
				}
			} catch (error) {
				console.error('Error al cargar el movimiento', error);
			}
		}
		loadMov();
	}, []);

	const onSubmit = handleSubmit(async (data) => {
		await updateMov(params.id, data);
		
		// Cierra el modal después de guardar los cambios
		handleCloseModal();
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title className='titlemodal'>
							Modificar Datos de Movimiento
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form
							className='formedit container fluid bg-dark'
							onSubmit={onSubmit}>
							<Form.Group className='' controlId='inputname'>
								<Form.Label className='labeledit'>Fecha</Form.Label>
								<Form.Control
									className='inputedit'
									type='date'

									{...register('fecha')}
								/>
							</Form.Group>

							<Form.Group className='' controlId='inputdomic'>
								<Form.Label className='labeledit'>
									Descripcion
								</Form.Label>
								<Form.Control
									className='inputedit'
									{...register('descripcion')}
								/>
							</Form.Group>

							<Form.Group className='' controlId='inputcel'>
								<Form.Label className='labeledit'>Adjunto</Form.Label>
								<Form.Control
									className='inputedit'
									type='text'
									{...register('adjunto')}
								/>
							</Form.Group>

							<Form.Group className='botonesedit'>
								<button className='botonedit' type='submit'>
									<i className='iconavbar bi bi-check2-square'></i>
									Guardar Cambios
								</button>
								<Link
									to='/gestionmovimientos'
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
