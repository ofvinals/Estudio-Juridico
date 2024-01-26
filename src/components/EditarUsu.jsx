import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
		watch,
		formState: { errors },
	} = useForm();
	const password = watch('contraseña', ''); // Obtener el valor del campo contraseña
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [newMail, setNewMail] = useState('');
	const [showModal, setShowModal] = useState(false);
	const { updatePass, updateMail } = useAuth();

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	const toggleShowPassword = () => setShowPassword(!showPassword);

	// Función para cerrar el modal
	const handleCloseModal = () => {
		setShowModal(false);
		if (user.user === 'ofvinals@gmail.com') {
			navigate('/gestionusuarios');
		} else {
			navigate('/adminusu');
		}
	};

	// Función para cargar los datos del usuario al abrir la página
	useEffect(() => {
		async function loadUser() {
			try {
				Swal.showLoading();
				const usuarioRef = doc(db, 'usuarios', id);
				const snapshot = await getDoc(usuarioRef);
				const userData = snapshot.data();
				setValue('username', userData.username);
				setValue('apellido', userData.apellido);
				setValue('email', userData.email);
				setValue('dni', userData.dni);
				setValue('domicilio', userData.domicilio);
				setValue('celular', userData.celular);
				setNewPassword(userData.contraseña);
				setNewMail(userData.email);
				setTimeout(() => {
					Swal.close();
					handleOpenModal();
				}, 500);
				return () => clearTimeout(timer);
			} catch (error) {
				console.error('Error al cargar el usuario', error);
			}
		}
		loadUser();
	}, []);

	const onSubmit = handleSubmit(async (data) => {
		try {
			Swal.showLoading();
			const usuarioRef = doc(db, 'usuarios', id);
			
			// if (
				
			// 	data.contraseñaAnterior !== userData.contraseña
			// ) {
			// 	setError('contraseñaAnterior', {
			// 		type: 'manual',
			// 		message: 'La contraseña anterior no es correcta',
			// 	});
			// 	Swal.close();
			// 	return;
			// }
			await updateDoc(usuarioRef, data);
			await updateMail(newMail);
			// if (data.contraseña) {
			// 	await updatePass(data.contraseña);
			// }
			Swal.fire({
				icon: 'success',
				title: 'Usuario editado correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
			setTimeout(() => {
				Swal.close();
				handleCloseModal();
			}, 500);
			return () => clearTimeout(timer);
		} catch (error) {
			console.error('Error al eliminar el usuario:', error);
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
								{/* <Form.Group className='mb-3' id='emailEditarUsuario'>
									<Form.Label className='labeledit'>Email</Form.Label>
									<Form.Control
										className='inputedit'
										type='email'
										id='email'
										{...register('email', {
											required: {
												value: true,
												message: 'El email es requerido',
											},
											pattern: {
												value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
												message: 'Email no válido',
											},
										})}
									/>
								</Form.Group> */}
								{/* <Form.Group className='mb-3' id='passEditarUsuario'>
									<Form.Label className='labeledit'>
										Contraseña Anterior
									</Form.Label>
									<div className='d-flex flex-row justify-content-center'>
										<Form.Control
											className='inputedit'
											type={showPassword ? 'text' : 'password'}
											{...register('contraseña', {
												minLength: {
													value: 7,
													message:
														'La contraseña debe ser mayor a 7 caracteres',
												},
											})}
										/>
									</div>
								</Form.Group>
								<Form.Group className='mb-3' id='passEditarUsuario'>
									<Form.Label className='labeledit'>
										Nueva Contraseña
									</Form.Label>
									<div className='d-flex flex-row justify-content-center'>
										<Form.Control
											className='inputedit'
											type={showPassword ? 'text' : 'password'}
											{...register('contraseña', {
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
								</Form.Group> */}
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
