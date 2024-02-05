import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const EditarUsu = () => {
	const user = useAuth();
	const { id } = useParams();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);
	const toggleShowPassword = () => setShowPassword(!showPassword);
	const handleCloseModal = () => {
		setShowModal(false);
		if (user === 'ofvinals@gmail.com') {
			navigate('/gestionusuarios');
		} else {
			navigate('/adminusu');
		}
	};

	useEffect(() => {
		async function loadUser() {
			try {
				Swal.fire({
					title: 'Cargando...',
					allowOutsideClick: false,
					showConfirmButton: false,
				});
				const usuarioRef = doc(db, 'usuarios', id);
				const snapshot = await getDoc(usuarioRef);
				const userData = snapshot.data();
				setValue('username', userData.username);
				setValue('apellido', userData.apellido);
				setValue('email', userData.email);
				setValue('dni', userData.dni);
				setValue('domicilio', userData.domicilio);
				setValue('celular', userData.celular);
				setValue('password', userData.password);
				Swal.close();
				handleOpenModal();
			} catch (error) {
				console.error('Error al cargar el usuario', error);
			}
		}
		loadUser();
	}, []);

	const onSubmit = handleSubmit(async (data) => {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			const usuarioRef = doc(db, 'usuarios', id);
			await updateDoc(usuarioRef, data);
			// if (data.contraseña) {
			// 	await updatePass(data.contraseña);
			// }
			Swal.fire({
				icon: 'success',
				title: 'Usuario editado correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
				Swal.close();
				handleCloseModal();
		} catch (error) {
			console.error('Error al editar el usuario:', error);
			Swal.fire({
				icon: 'error',
				title: 'Error al editar el usuario. Intente nuevamente!',
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
							Modificar Datos de Usuario
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={onSubmit}>
							<div className='formedit'>
								<Form.Group className='mb-3' id='nombreEditarUsuario'>
									<Form.Label className='labeledit'>Nombre</Form.Label>
									<Form.Control
										className='inputedit'
										type='text'
										id='name'
										{...register('username', {
											required: {
												value: true,
												message:
													'El nombre o razon social es requerido.',
											},
										})}
									/>
								</Form.Group>
								<Form.Group className='mb-3' id='apellidoEditarUsuario'>
									<Form.Label className='labeledit'>
										Apellido
									</Form.Label>
									<Form.Control
										className='inputedit'
										type='text'
										id='subname'
										{...register('apellido')}
									/>
								</Form.Group>
								<Form.Group className='mb-3' id='dniEditarUsuario'>
									<Form.Label className='labeledit'>
										DNI/CUIT
									</Form.Label>
									<Form.Control
										className='inputedit'
										type='text'
										id='dni'
										{...register('dni', {
											required: {
												value: true,
												message: 'El DNI/CUIT es requerido.',
											},
											minLength: {
												value: 8,
												message:
													'El DNI/CUIT debe contenter entre 8 y 10 digitos.',
											},
											maxLength: {
												value: 11,
												message:
													'El DNI/CUIT debe contenter entre 8 y 10 digitos.',
											},
										})}
									/>
								</Form.Group>
								<Form.Group
									className='mb-3'
									id='domicilioEditarUsuario'>
									<Form.Label className='labeledit'>
										Domicilio
									</Form.Label>
									<Form.Control
										className='inputedit'
										type='text'
										id='domic'
										{...register('domicilio', {
											required: {
												value: true,
												message: 'El domicilio es requerido.',
											},
										})}
									/>
								</Form.Group>
								<Form.Group className='mb-3' id='celularEditarUsuario'>
									<Form.Label className='labeledit'>
										Celular
									</Form.Label>
									<Form.Control
										className='inputedit'
										type='text'
										id='cel'
										{...register('celular', {
											required: {
												value: true,
												message: 'El celular es requerido.',
											},
											minLength: {
												value: 10,
												message:
													'El celular debe contenter 10 digitos.',
											},
											maxLength: {
												value: 10,
												message:
													'El celular debe contenter 10 digitos.',
											},
										})}
									/>
								</Form.Group>

								<Form.Group className='mb-3' id='passEditarUsuario'>
									<Form.Label className='labeledit'>
										Contraseña
									</Form.Label>
									<div className='d-flex flex-row justify-content-center'>
										<Form.Control
											className='inputedit'
											type={showPassword ? 'text' : 'password'}
											{...register('password', {
												required: {
													value: true,
													message: 'La contraseña es requerida.',
												},
												minLength: {
													value: 7,
													message:
														'La contraseña debe ser mayor a 7 caracteres',
												},
											})}
										/>
										<button
											type='button'
											onClick={toggleShowPassword}
											id='vercontrasena'
											className='btncontrasena'>
											<i
												className={`iconavbar p-0 ${
													showPassword ? 'bi-eye-slash' : 'bi-eye'
												}`}></i>
										</button>
									</div>
								</Form.Group>

								<Form.Group className='botonesedit'>
									<button className='btnconfmodal' type='submit'>
										<i className='iconavbar bi bi-check2-square'></i>
										Guardar cambios
									</button>
									<button
										type='button'
										className='btncancmodal'
										onClick={handleCloseModal}>
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
