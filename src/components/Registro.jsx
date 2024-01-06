import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../css/Registro.css';
import { useAuth } from '../context/AuthContext';

export const Registro = () => {
	const { signup, isAuthenticated, errors: RegisterErrors } = useAuth();
	const navigate = useNavigate();
	const { register, handleSubmit, formState: errors } = useForm();

	useEffect(() => {
		if (isAuthenticated) navigate('/adminusu');
	}, [isAuthenticated]);

	const onSubmit = handleSubmit(async (values) => {
		signup(values);
	});

	return (
		<section className='register'>
			{
				RegisterErrors.map((error, i)=>(
					<div key={i}>
						{error}
					</div>
				))
			}
			<Form
				id='loginFormreg'
				className='container fluid bg-dark'
				onSubmit={onSubmit}>
				<h2 className='login-tituloreg'>Crear Nueva Cuenta</h2>

				<Form.Group className='mb-3' controlId='inputname'>
					<Form.Label className='labelreg'>Nombre/s</Form.Label>
					<Form.Control
						className='inputreg'
						type='text'
						{...register('username', { required: true })}
					/>
					{errors.username && <p>Nombre es requerido</p>}
				</Form.Group>

				<Form.Group className='mb-3' controlId='inputsubname'>
					<Form.Label className='labelreg'>Apellido/s</Form.Label>
					<Form.Control
						className='inputreg'
						type='text'
						{...register('apellido', { required: true })}
					/>
				</Form.Group>

				<Form.Group className='mb-3' controlId='inputdni'>
					<Form.Label className='labelreg'>DNI/CUIT/CUIL</Form.Label>
					<Form.Control
						className='inputreg'
						type='number'
						{...register('dni', { required: true })}
					/>
				</Form.Group>

				<Form.Group className='mb-3' controlId='inputdomic'>
					<Form.Label className='labelreg'>Domicilio</Form.Label>
					<Form.Control
						className='inputreg'
						type='text'
						{...register('domicilio', { required: true })}
					/>
				</Form.Group>

				<Form.Group className='mb-3' controlId='inputcel'>
					<Form.Label className='labelreg'>Celular</Form.Label>
					<Form.Control
						className='inputreg'
						type='number'
						{...register('celular', { required: true })}
					/>
				</Form.Group>

				<Form.Group className='mb-3' controlId='inputemail'>
					<Form.Label className='labelreg'>Email</Form.Label>
					<Form.Control
						className='inputreg'
						type='email'
						{...register('email', { required: true })}
					/>
				</Form.Group>

				<Form.Group className='mb-3'>
					<Form.Label className='labelreg'>Contraseña</Form.Label>
					<Form.Control
						className='inputreg'
						type='password'
						{...register('password', { required: true })}
					/>
				</Form.Group>

				<Form.Group className='mb-3'>
					<Form.Label className='labelreg' controlid='inputconfirm'>
						Confirmar Contraseña
					</Form.Label>
					<Form.Control className='inputreg' type='password' />
				</Form.Group>

				<Form.Group className='mb-3 botonesreg'>
					<Button className='input-submitreg' type='submit'>
						Enviar
					</Button>

					<p className='parraforeg text-center'>
						Ya tienes una cuenta ?
						<Link className='parraforeg' to='/login'>
							Ingresar a mi cuenta
						</Link>
					</p>
				</Form.Group>
			</Form>
		</section>
	);
};
