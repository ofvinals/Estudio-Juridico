import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../css/Login.css';

export const Login = () => {
	const [form, setForm] = useState({
		email: '',
		contrasena: '',
	});
	const [usuarios, setUsuarios] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		// Cargar usuarios desde el localStorage al montar el componente
		const ListaUsuarios =
			JSON.parse(localStorage.getItem('usuarios')) || [];
		setUsuarios(ListaUsuarios);
	}, []);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { email, contrasena } = form;

		const validarEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
		const resultadoValidacion = validarEmail.test(email);
		if (!resultadoValidacion) {
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
		}
		const existeUsuario = usuarios.find(
			(usuario) => usuario.email === email
		);

		if (existeUsuario && existeUsuario.contrasena === contrasena) {
			localStorage.setItem("token", "true")
			Swal.fire({
				icon: 'success',
				title: 'Inicio de sesión exitoso!',
				showConfirmButton: false,
				timer: 2000,
			}).then(() => {
				if (existeUsuario.email === 'admin@gmail.com') {
					navigate('/admin');
				} else navigate('/adminusu');
			});
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Ingreso rechazado',
				text: 'El usuario y/o contraseña no son correctos!',
				confirmButtonColor: '#8f8e8b',
			});
		}
	};

	return (
		<section className='login'>
			<Form id='loginForm' className='container fluid bg-dark'>
				<h2 className='login-titulolog'>Ingreso a Mi cuenta</h2>
				<Form.Group className='' controlId='inputemail'>
					<Form.Label className='labellog'>Email</Form.Label>
					<Form.Control
						className='inputlog'
						name='email'
						type='email'
						value={form.email}
						onChange={handleChange}
					/>
				</Form.Group>
				<Form.Group className='' controlId='inputpassword'>
					<Form.Label className='labellog'>Contraseña</Form.Label>
					<Form.Control
						className='inputlog'
						name='contrasena'
						type='password'
						value={form.contrasena}
						onChange={handleChange}
					/>
					<Link
						className='parrafolog text-center text-decoration-underline'
						to='/recuperar'>
						¿ Olvidaste tu contraseña ?
					</Link>
					<Form.Group
						className='mb-3 d-flex justify-content-center'
						controlId='inputpassword'>
						<Link
							className='input-submitlog'
							onClick={handleSubmit}>
							Enviar
						</Link>
					</Form.Group>
					<p className='parrafolog text-center'>
						No tienes una cuenta?<br></br>
						<Link
							className='parrafolog text-decoration-underline'
							to='/registro'>
							Registrarme ahora
						</Link>
					</p>
				</Form.Group>
			</Form>
		</section>
	);
};
