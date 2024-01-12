import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import '../css/Login.css';
import { Button } from 'react-bootstrap';

export const Login = () => {
	const navigate = useNavigate();
	const { register, handleSubmit } = useForm();
	const { signin, errors: SigninErrors, isAuthenticated } = useAuth();

	const onSubmit = handleSubmit((data) => {
		signin(data);
	});

	useEffect(() => {
		if (isAuthenticated) navigate('/admin');
	}, [isAuthenticated]);

	return (
		<section className='login'>
			{' '}
			{SigninErrors.map((error, i) => (
				<div key={i}>{error}</div>
			))}
			<Form id='loginForm' className='logform bg-dark' onSubmit={onSubmit}>
				<h2 className='titulolog'>Ingreso a Mi cuenta</h2>
				<Form.Group className='d-flex flex-column' controlId='inputemail'>
					<Form.Label className='labellog'>Email</Form.Label>
					<input
						className='inputlog'
						type='email'
						id='email'
						{...register('email')}
					/>
				</Form.Group>

				<Form.Group
					className='d-flex flex-column'
					controlId='inputpassword'>
					<Form.Label className='labellog'>Contraseña</Form.Label>
					<input
						className='inputlog'
						type='password'
						id='password'
						{...register('password')}
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
					<Button className='input-submitlog' type='submit'>
						{' '}
						<i className='iconavbar bi bi-box-arrow-in-right'></i>
						Ingresar
					</Button>
					{/* <Link className='input-googlelog'>
						Ingresa con tu cuenta de Google
					</Link> */}
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
