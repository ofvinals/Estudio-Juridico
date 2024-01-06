import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import { Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useUsers } from '../context/UsersContext';

export const EditarUsu = () => {
	const { user } = useAuth();
	const params = useParams();
	const { getUser, updateUser } = useUsers();
	const { register, handleSubmit, setValue } = useForm();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	// Función para cerrar el modal
	const handleCloseModal = () => {
		setShowModal(false);
		navigate ('/gestionusuarios')
	};

	// Función para cargar los datos del usuario al abrir la página
	useEffect(() => {
		async function loadUser() {
			try {
				if (params.id) {
					const user = await getUser(params.id);
					setValue('username', user.username);
					setValue('apellido', user.apellido);
					setValue('email', user.email);
					setValue('dni', user.dni);
					setValue('domicilio', user.domicilio);
					setValue('celular', user.celular);
					// Abre automáticamente el modal cuando se cargan los datos del usuario
					handleOpenModal();
				}
			} catch (error) {
				console.error('Error al cargar el usuario', error);
			}
		}
		loadUser();
	}, []);

	const onSubmit = handleSubmit(async (data) => {
		await updateUser(params.id, data);
		handleCloseModal();
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title className='titlemodal'>
							Modificar Datos de Usuario
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form  onSubmit={onSubmit}>
							<div className='formedit' >
								<Form.Group
									className='mb-3'
									controlId='nombreEditarUsuario'>
									<Form.Label className='labeledit'>Nombre</Form.Label>
									<Form.Control
										className='inputedit'
										type='text'
										placeholder='Nombre'
										{...register('username')}
									/>
								</Form.Group>
								<Form.Group
									className='mb-3'
									controlId='apellidoEditarUsuario'>
									<Form.Label className='labeledit'>
										Apellido
									</Form.Label>
									<Form.Control
										className='inputedit'
										type='text'
										placeholder='Apellido'
										{...register('apellido')}
									/>
								</Form.Group>
								<Form.Group
									className='mb-3'
									controlId='dniEditarUsuario'>
									<Form.Label className='labeledit'>
										DNI/CUIT
									</Form.Label>
									<Form.Control
										className='inputedit'
										type='text'
										placeholder='DNI/CUIT'
										{...register('dni')}
									/>
								</Form.Group>
								<Form.Group
									className='mb-3'
									controlId='domicilioEditarUsuario'>
									<Form.Label className='labeledit'>
										Domicilio
									</Form.Label>
									<Form.Control
										className='inputedit'
										type='text'
										placeholder='Domicilio'
										{...register('domicilio')}
									/>
								</Form.Group>
								<Form.Group
									className='mb-3'
									controlId='celularEditarUsuario'>
									<Form.Label className='labeledit'>
										Celular
									</Form.Label>
									<Form.Control
										className='inputedit'
										type='text'
										placeholder='Celular'
										{...register('celular')}
									/>
								</Form.Group>
								<Form.Group
									className='mb-3'
									controlId='emailEditarUsuario'>
									<Form.Label className='labeledit'>Email</Form.Label>
									<Form.Control
										className='inputedit'
										type='email'
										{...register('email')}
									/>
								</Form.Group>
								<Form.Group className='botonesedit'>
									<button className='btnconfmodal' type='submit'>
										<i className='iconavbar bi bi-check2-square'></i>
										Guardar cambios
									</button>
									<button type='button' className='btncancmodal' onClick={handleCloseModal}>
										<i className='iconavbar bi bi-x-circle-fill'></i>
										Cancelar
									</button>
								</Form.Group>
							</div>
						</Form>
					</Modal.Body>
				</Modal>
			</div>
		</>
	);
};
