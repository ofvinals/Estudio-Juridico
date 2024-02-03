import { React, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Recuperar.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Recuperar = () => {
	const navigate = useNavigate();
	const emailRef = useRef();
	const { resetPassword } = useAuth();

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			await resetPassword(emailRef.current.value);
			navigate ('/home')
		} catch (error) {
			console.error('Error al restablecer la contraseña:', error);
		}
	}

	return (
		<section className='container-lg recuperar'>
			<Form className='Formrec bg-dark'>
				<h2 className='titulorec'>Recuperar contraseña</h2>
				<p className='subtitulorec'>
					Ingresa tu mail y te enviaremos el procedimiento para recuperar
					tu contraseña
				</p>

				<Form.Group controlId='inputemail'>
					<input className='inputrec' type='email' name='emailRef' ref={emailRef} />
				</Form.Group>

				<Form.Group
					className='mb-3 d-flex justify-content-center'
					controlId='inputpassword'>
					<button
						className='input-submitrec'
						onClick={(e) => handleSubmit(e)}>
						Enviar
					</button>
				</Form.Group>
			</Form>
		</section>
	);
};
