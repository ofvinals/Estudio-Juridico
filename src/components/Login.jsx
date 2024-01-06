import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import '../css/Login.css';
import { Button } from 'react-bootstrap';

export const Login = () => {
	const navigate = useNavigate();
	const { register, handleSubmit, formState: errors } = useForm();
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
				<Form.Group className='' controlId='inputemail'>
					<Form.Label className='labellog'>Email</Form.Label>
					<input
						className='inputlog'
						type='email'
						{...register('email', { required: true })}
					/>
					{errors.email && <p>El Email es requerido</p>}
				</Form.Group>

				<Form.Group className='' controlId='inputpassword'>
					<Form.Label className='labellog'>Contraseña</Form.Label>
					<input
						className='inputlog'
						type='password'
						{...register('password', { required: true })}
					/>
					{errors.password && <p>La contraseña es requerida</p>}
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
						Ingresar
					</Button>
					<Link className='input-googlelog'>
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
