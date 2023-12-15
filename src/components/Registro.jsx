import React, { useEffect } from 'react';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

import '../css/Registro.css';

export const Registro = () => {
	const initialForm = {
		nombre: '',
		apellido: '',
		dni: '',
		domicilio: '',
		celular: '',
		email: '',
		contrasena: '',
		confcontrasena: '',
	};

	const [form, setForm] = useState(initialForm);
	const [usuarios, setUsuarios] = useState([]);

	useEffect(() => {
		// Cargar usuarios desde el localStorage al montar el componente
		const usuariosGuardados =
			JSON.parse(localStorage.getItem('usuarios')) || [];
		setUsuarios(usuariosGuardados);
	}, []);

	const agregarUsuario = (newUser) => {
		const ListaUsuarios = [...usuarios, newUser];
		setUsuarios(ListaUsuarios);
		localStorage.setItem('usuarios', JSON.stringify(ListaUsuarios));
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleBlur = (e) => {
		if (e.target.value === '' || +e.target.value === 0) {
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'Todos los campos son obligatorios!',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		}
	};

	function handleSubmit(e) {
		e.preventDefault();

		const {
			nombre,
			apellido,
			dni,
			domicilio,
			celular,
			email,
			contrasena,
			confcontrasena,
		} = form;

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
		} else if (contrasena.length < 7) {
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'La contraseña debe ser mayor a 7 caracteres!',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		} else if (contrasena !== confcontrasena) {
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'Las contraseñas deben ser iguales!',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		}

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
			contrasena,
		};

		agregarUsuario(newUser);

		Swal.fire({
			icon: 'success',
			title: 'Usuario registrado correctamente',
			showConfirmButton: false,
			timer: 2000,
		}).then(() => {
			// Después de mostrar el SweetAlert, redirigir al usuario al formulario de inicio de sesión (login.html)

			window.location.href = '/login';

			// Restablecer el formulario después de la redirección
			setForm(initialForm);
		});
	}

	return (
		<section className='register'>
			<Form id='loginFormreg' className='container fluid bg-dark'>
				<h2 className='login-tituloreg'>Crear Nueva Cuenta</h2>
				<Form.Group className='mb-3' controlId='inputname'>
					<Form.Label className='labelreg'>Nombre/s</Form.Label>
					<Form.Control
						className='inputreg'
						type='text'
						name='nombre'
						value={form.nombre}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='inputsubname'>
					<Form.Label className='labelreg'>Apellido/s</Form.Label>
					<Form.Control
						className='inputreg'
						type='text'
						name='apellido'
						value={form.apellido}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='inputdni'>
					<Form.Label className='labelreg'>DNI/CUIT/CUIL</Form.Label>
					<Form.Control
						className='inputreg'
						type='number'
						name='dni'
						value={form.dni}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='inputdomic'>
					<Form.Label className='labelreg'>Domicilio</Form.Label>
					<Form.Control
						className='inputreg'
						type='text'
						name='domicilio'
						value={form.domicilio}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='inputcel'>
					<Form.Label className='labelreg'>Celular</Form.Label>
					<Form.Control
						className='inputreg'
						type='number'
						name='celular'
						value={form.celular}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Form.Group>
				<Form.Group className='mb-3' controlId='inputemail'>
					<Form.Label className='labelreg'>Email</Form.Label>
					<Form.Control
						className='inputreg'
						type='email'
						name='email'
						value={form.email}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label className='labelreg'>Contraseña</Form.Label>
					<Form.Control
						className='inputreg'
						type='password'
						name='contrasena'
						value={form.contrasena}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label className='labelreg' controlid='inputconfirm'>
						Confirmar Contraseña
					</Form.Label>
					<Form.Control
						className='inputreg'
						type='password'
						name='confcontrasena'
						value={form.confcontrasena}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
				</Form.Group>

				<Form.Group
					className='mb-3 d-flex justify-content-center flex-column align-items-center'
					controlId='inputpassword'>
					<Button
						disabled={Object.values(form).some(
							(valor) => valor === '' || valor === 0
						)}
						className='input-submitreg'
						onClick={handleSubmit}>
						Enviar
					</Button>

					<p className='parraforeg text-center'>
						Ya tienes una cuenta ?{' '}
						<Link className='parraforeg' to='/login'>
							Ingresar a mi cuenta
						</Link>
					</p>
				</Form.Group>
			</Form>
		</section>
	);
};
