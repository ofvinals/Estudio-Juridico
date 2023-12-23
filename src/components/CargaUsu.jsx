import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../css/CargaUsu.css';
import { useAuth } from '../context/AuthContext';

export const CargaUsu = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	const [emailRegister, setEmailRegister] = useState('');
	const [passwordRegister, setPasswordRegister] = useState('');
	const [displayNameRegister, setDisplayNameRegister] = useState('');

	const initialForm = {
		nombre: '',
		apellido: '',
		dni: '',
		domicilio: '',
		celular: '',
		email: '',
		password: '',
		confpassword: '',
	};

	const handleCancel = () => {
		setShowConfirmationModal(false);
		handleClose();
		navigate('/gestionusuarios');
	};

	const [form, setForm] = useState(initialForm);
	const [usuarios, setUsuarios] = useState([]);

	const handleShow = () => setShow(true);

	useEffect(() => {
		// Cargar usuarios desde el localStorage al montar el componente
		const usuariosGuardados =
			JSON.parse(localStorage.getItem('usuarios')) || [];
		setUsuarios(usuariosGuardados);
	}, []);

	// funcion para agregar usuarios
	const agregarUsuario = (newUser) => {
		const ListaUsuarios = [...usuarios, newUser];
		setUsuarios(ListaUsuarios);
		localStorage.setItem('usuarios', JSON.stringify(ListaUsuarios));
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Verifica que todos los campos contengan datos
	const handleBlur = (e) => {
		if (e.target.value === '' || +e.target.value === 0) {
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'Todos los campos son obligatorios!',
				timer: 1500,
			});
			return;
		}
	};
	// funcion para registrar mail y contraseña solamente en Firebase
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			await auth.register(emailRegister, passwordRegister);
		} catch (error) {
			console.error('Error al registrar', error.message);
		}
		const {
			nombre,
			apellido,
			dni,
			domicilio,
			celular,
			email,
			password,
			confpassword,
		} = form;

		// Validaciones
		const validarEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
		const resultadoValidacion = validarEmail.test(email);
		if (celular.length < 10 || celular.length > 11) {
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'El nro de celular debe tener 10 digitos',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		} else if (!resultadoValidacion) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Email no valido!',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		} else if (password.length < 7) {
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'La contraseña debe ser mayor a 7 caracteres!',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		} else if (password !== confpassword) {
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'Las contraseñas deben ser iguales!',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		}

		// Verifica si el mail o DNI ya se encuentran registrados en el Local Storage
		const existeEmail = usuarios.find((usuario) => usuario.email === email);
		const existeDni = usuarios.find((usuario) => usuario.dni === dni);

		if (existeEmail !== undefined) {
			Swal.fire({
				icon: 'error',
				title: 'Usuario Existente',
				text: 'Lo siento, el email ingresado ya esta registrado!',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		} else if (existeDni !== undefined) {
			Swal.fire({
				icon: 'error',
				title: 'Usuario Existente',
				text: 'Lo siento, el DNI ingresado ya esta registrado!',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		}
		const id = Date.now();
		const newUser = {
			id,
			nombre,
			apellido,
			dni,
			domicilio,
			celular,
			email,
			password,
		};

		agregarUsuario(newUser);

		Swal.fire({
			icon: 'success',
			title: 'Usuario registrado correctamente',
			showConfirmButton: false,
			timer: 1500,
		});
		// Restablecer el formulario después de la redirección
		setForm(initialForm);
		navigate('/gestionusuarios');
	}

	return (
		<>
			<section className='registerusu'>
				<Form className='FormcargaUsu container fluid bg-dark'>
					<h2 className='titulocargausu'>Crear Nuevo Usuario</h2>

					<Form.Group className='mb-3' controlId='inputname'>
						<Form.Label className='labelcarusu'>Nombre/s</Form.Label>
						<Form.Control
							className='inputcarusu'
							type='text'
							name='nombre'
							value={form.nombre}
							onChange={(e) => {
								handleChange(e);
								setDisplayNameRegister(e.target.value);
							}}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='inputsubname'>
						<Form.Label className='labelcarusu'>Apellido/s</Form.Label>
						<Form.Control
							className='inputcarusu'
							type='text'
							name='apellido'
							value={form.apellido}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='inputdni'>
						<Form.Label className='labelcarusu'>DNI/CUIT/CUIL</Form.Label>
						<Form.Control
							className='inputcarusu'
							type='number'
							name='dni'
							value={form.dni}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='inputdomic'>
						<Form.Label className='labelcarusu'>Domicilio</Form.Label>
						<Form.Control
							className='inputcarusu'
							type='text'
							name='domicilio'
							value={form.domicilio}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='inputcel'>
						<Form.Label className='labelcarusu'>Celular</Form.Label>
						<Form.Control
							className='inputcarusu'
							type='number'
							name='celular'
							value={form.celular}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='inputemail'>
						<Form.Label className='labelcarusu'>Email</Form.Label>
						<Form.Control
							className='inputcarusu'
							type='email'
							name='email'
							value={form.email}
							onChange={(e) => {
								handleChange(e);
								setEmailRegister(e.target.value);
							}}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label className='labelcarusu'>Contraseña</Form.Label>
						<Form.Control
							className='inputcarusu'
							type='password'
							name='password'
							value={form.password}
							onChange={(e) => {
								handleChange(e);
								setPasswordRegister(e.target.value);
							}}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label className='labelcarusu' controlid='inputconfirm'>
							Confirmar Contraseña
						</Form.Label>
						<Form.Control
							className='inputcarusu'
							type='password'
							name='confpassword'
							value={form.confpassword}
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</Form.Group>

					<Form.Group
						className='mb-3 botonescarusu'
						controlId='inputpassword'>
						<Button className='btncarusu' onClick={handleSubmit}>
							<i className='me-2 fs-6 bi bi-check2-square'></i>
							Guardar Usuario
						</Button>
						<Link to='/gestionusuarios' className='btncancusu'>
							<i className='me-2 fs-6 bi bi-x-circle-fill'></i>
							Cancelar
						</Link>
					</Form.Group>
				</Form>
			</section>
		</>
	);
};
