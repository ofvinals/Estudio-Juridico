import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import '../css/Login.css';
import { Button } from 'react-bootstrap';

export const Login = () => {
	const user = useAuth();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [showPassword, setShowPassword] = useState(false);
	const { isAuthenticated, login, loginWithGoogle } = useAuth();

	const onSubmit = handleSubmit((data) => {
		login(data);
	});

	const toggleShowPassword = () => setShowPassword(!showPassword);

	const handleGoogle = (e) => {
		e.preventDefault();
		loginWithGoogle();
	};

	useEffect(() => {
		if (isAuthenticated) {
			if (user.user === 'ofvinals@gmail.com') {
				navigate('/admin');
			} else {
				navigate('/adminusu');
			}
		}
	}, [isAuthenticated, user.email, navigate]);

	return (
		<section className='login container-lg'>
			<Form id='loginForm' className='logform bg-dark' onSubmit={onSubmit}>
				<h2 className='titulolog'>Ingreso a Mi cuenta</h2>
				<Form.Group className='d-flex flex-column' controlId='inputemail'>
					<Form.Label className='labellog'>Email</Form.Label>
					<input
						className='inputlog'
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
					{errors.email && (
						<span className='error-message'>{errors.email.message}</span>
					)}
				</Form.Group>

				<Form.Group
					className='d-flex flex-column'
					controlId='inputpassword'>
					<Form.Label className='labellog'>Contraseña</Form.Label>
					<div className='d-flex flex-row justify-content-center'>
						<input
							className='inputlogpass'
							type={showPassword ? 'text' : 'password'}
							{...register('password', {
								required: {
									value: true,
									message: 'La contraseña es requerida',
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
					{errors.password && (
						<span className='error-message'>
							{errors.password.message}
						</span>
					)}
				</Form.Group>

				<Form.Group>
					<Link
						className='parrafolog text-center text-decoration-underline'
						to='/recuperar'>
						¿ Olvidaste tu contraseña ?
					</Link>
				</Form.Group>

				<Form.Group className='botoneslogin' controlId='inputpassword'>
					<Button className='input-submitlog' type='submit'>
						<i className='iconavbar bi bi-box-arrow-in-right'></i>
						Ingresar
					</Button>
					<button
						type='button'
						onClick={(e) => handleGoogle(e)}
						className='botongoogle'
						id='googleLogin'>
						<i className='iconavbar bi bi-google'></i>Ingresar con Google
					</button>
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
