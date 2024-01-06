import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../src/context/AuthContext';
import '../css/Login.css';

export const Login = () => {
	const auth = useAuth();

	const [form, setForm] = useState({
		email: '',
		password: '',
	});
	const [usuarios, setUsuarios] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		// Cargar usuarios desde el localStorage al montar el componente
		const ListaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
		setUsuarios(ListaUsuarios);
	}, []);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleGoogle = (e) => {
		e.preventDefault();
		auth.loginWithGoogle();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { email, password } = form;

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
		} else if (password.length < 7) {
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'La contraseña debe ser mayor a 7 caracteres!',
				confirmButtonColor: '#8f8e8b',
			});
			return;
		}
		auth.login(email, password, navigate);
		// const existeUsuario = usuarios.find((usuario) => usuario.email === email);

		// if (existeUsuario && existeUsuario.password === password) {
		// 	auth.login(email, password);
		// 	Swal.fire({
		// 		icon: 'success',
		// 		title: 'Inicio de sesión exitoso!',
		// 		showConfirmButton: false,
		// 		timer: 2000,
		// 	}).then(() => {
		// 		if (existeUsuario.email === 'admin@gmail.com') {
		// 			navigate('/admin', { replace: true });
		// 		} else navigate('/adminusu', { replace: true });
		// 	});
		// } else {
		// 	Swal.fire({
		// 		icon: 'error',
		// 		title: 'Ingreso rechazado',
		// 		text: 'El usuario y/o contraseña no son correctos!',
		// 		confirmButtonColor: '#8f8e8b',
		// 	});
		// }
	};

	return (
		<section className='login'>
			<Form id='loginForm' className='logform bg-dark'>
				<h2 className='titulolog'>Ingreso a Mi cuenta</h2>
				<Form.Group className='' controlId='inputemail'>
					<Form.Label className='labellog'>Email</Form.Label>
					<input
						className='inputlog'
						name='email'
						type='email'
						value={form.email}
						onChange={handleChange}
					/>
				</Form.Group>

				<Form.Group className='' controlId='inputpassword'>
					<Form.Label className='labellog'>Contraseña</Form.Label>
					<input
						className='inputlog'
						name='password'
						type='password'
						value={form.password}
						onChange={handleChange}
					/>
				</Form.Group>

				<Form.Group>
					<Link
						className='parrafolog text-center text-decoration-underline'
						to='/recuperar'>
						¿ Olvidaste tu contraseña ?
					</Link>
				</Form.Group>

				<Form.Group className='botoneslogin' controlId='inputpassword'>
					<Link className='input-submitlog' onClick={handleSubmit}>
						Ingresar
					</Link>
					<Link className='input-googlelog' onClick={(e) => handleGoogle}>
						Ingresa con tu cuenta de Google
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
			</Form>
		</section>
	);
};
