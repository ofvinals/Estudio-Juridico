import React  from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../css/Registro.css';
import { useAuth } from '../context/AuthContext';

export const Registro = () => {
	const { registro} = useAuth();
	const navigate = useNavigate();
	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = handleSubmit(async (values) => {
		try {
			await registro(values);
			navigate('/adminusu', { replace: true });
		} catch (error) {
			console.error('Error al registrar:', error);
		}
	});

	return (
		<section className='register container-lg'>
			<Form
				id='loginFormreg'
				className='loginFormreg container fluid bg-dark'
				onSubmit={onSubmit}>
				<h2 className='login-tituloreg'>Crear Nueva Cuenta</h2>

				<Form.Group className='mb-3' id='inputname'>
					<Form.Label className='labelreg'>Nombre/s</Form.Label>
					<Form.Control
						className='inputreg'
						type='text'
						id='name'
						{...register('username', {
							required: {
								value: true,
								message: 'El nombre o razon social es requerido.',
							},
						})}
					/>
				</Form.Group>

				<Form.Group className='mb-3' id='inputsubname'>
					<Form.Label className='labelreg'>Apellido/s</Form.Label>
					<Form.Control
						className='inputreg'
						type='text'
						id='subname'
						{...register('apellido')}
					/>
				</Form.Group>

				<Form.Group className='mb-3' id='inputdni'>
					<Form.Label className='labelreg'>DNI/CUIT/CUIL</Form.Label>
					<Form.Control
						className='inputreg'
						type='number'
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

				<Form.Group className='mb-3' id='inputdomic'>
					<Form.Label className='labelreg'>Domicilio</Form.Label>
					<Form.Control
						className='inputreg'
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

				<Form.Group className='mb-3' id='inputcel'>
					<Form.Label className='labelreg'>Celular</Form.Label>
					<Form.Control
						className='inputreg'
						type='number'
						id='cel'
						{...register('celular', {
							required: {
								value: true,
								message: 'El celular es requerido.',
							},
							minLength: {
								value: 10,
								message: 'El celular debe contenter 10 digitos.',
							},
							maxLength: {
								value: 11,
								message: 'El celular debe contenter 10 digitos.',
							},
						})}
					/>
				</Form.Group>

				<Form.Group className='mb-3' id='inputemail'>
					<Form.Label className='labelreg'>Email</Form.Label>
					<Form.Control
						className='inputreg'
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

				<Form.Group className='mb-3'>
					<Form.Label className='labelreg'>Contraseña</Form.Label>
					<Form.Control
						className='inputreg'
						type='password'
						id='password'
						{...register('password', {
							required: {
								value: true,
								message: 'La contraseña es requerida',
							},
							minLength: {
								value: 7,
								message: 'La contraseña debe ser mayor a 7 caracteres',
							},
						})}
					/>
				</Form.Group>

				<Form.Group className='mb-3'>
					<Form.Label className='labelreg' id='inputconfirm'>
						Confirmar Contraseña
					</Form.Label>
					<Form.Control
						className='inputreg'
						type='password'
						id='copassword'
						{...register('copassword', {
							required: {
								value: true,
								message: 'La confirmacion de contraseña es requerida',
							},
							minLength: {
								value: 7,
								message:
									'Confirmar contraseña debe ser mayor a 7 caracteres',
							},
							validate: (copassword) => {
								const { password } = getValues();
								return (
									copassword === password ||
									'Las contraseñas ingresadas no coinciden'
								);
							},
						})}
					/>
					{errors.copassword && (
						<span>{errors.copassword.message}</span>
					)}
				</Form.Group>

				<Form.Group className='mb-3 botonesreg'>
					<Button className='input-submitreg' type='submit'>
						<i className='iconavbar bi bi-r-circle-fill'></i>
						Registrar cuenta
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
