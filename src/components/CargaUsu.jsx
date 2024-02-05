import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../css/Carga.css';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const CargaUsu = () => {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	const [showModal, setShowModal] = useState(true);

	// Función para cerrar el modal
	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/gestionusuarios');
	};

	const onSubmit = handleSubmit(async (values) => {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			const usuariosRef = collection(db, 'usuarios');
			await addDoc(usuariosRef, values);
			Swal.fire({
				icon: 'success',
				title: 'Usuario registrado correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
			Swal.close();
			handleCloseModal();
			navigate('/gestionusuarios');
		} catch (error) {
			console.error('Error al registrar el usuario:', error);
			Swal.fire({
				icon: 'error',
				title: 'Error al cargar el usuario. Intente nuevamente!',
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
							Cargar Nuevo Usuario
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form className='Formcarga ' onSubmit={onSubmit}>
							<Form.Group className='mb-3' controlId='inputname'>
								<Form.Label className='labelcarga'>
									Nombre/s o Razon Social
								</Form.Label>
								<Form.Control
									className='inputcarga'
									type='text'
									{...register('username')}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='inputsubname'>
								<Form.Label className='labelcarga'>
									Apellido/s
								</Form.Label>
								<Form.Control
									className='inputcarga'
									type='text'
									{...register('apellido')}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='inputdni'>
								<Form.Label className='labelcarga'>
									DNI/CUIT/CUIL
								</Form.Label>
								<Form.Control
									className='inputcarga'
									type='number'
									{...register('dni')}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='inputdomic'>
								<Form.Label className='labelcarga'>
									Domicilio
								</Form.Label>
								<Form.Control
									className='inputcarga'
									type='text'
									{...register('domicilio')}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='inputcel'>
								<Form.Label className='labelcarga'>Celular</Form.Label>
								<Form.Control
									className='inputcarga'
									type='number'
									{...register('celular')}
								/>
							</Form.Group>

							<Form.Group className='mb-3' controlId='inputemail'>
								<Form.Label className='labelcarga'>Email</Form.Label>
								<Form.Control
									className='inputcarga'
									type='email'
									{...register('email')}
								/>
							</Form.Group>

							<Form.Group className='mb-3'>
								<Form.Label className='labelcarga'>
									Contraseña
								</Form.Label>
								<Form.Control
									className='inputcarga'
									type='password'
									{...register('password')}
								/>
							</Form.Group>

							<Form.Group
								className='mb-3 botonescarga'
								controlId='inputpassword'>
								<button className='btnconfmodal' type='submit'>
									<i className='iconavbar bi bi-check2-square'></i>
									Guardar Usuario
								</button>
								<button
									type='button'
									onClick={handleCloseModal}
									className='btncancmodal'>
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
