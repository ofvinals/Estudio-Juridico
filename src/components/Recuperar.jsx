import React from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Recuperar.css';
import { Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

export const Recuperar = () => {
	return (
		<section className='recuperar'>
			<Form className='container fluid loginFormrec bg-dark'>
				<h2 className='login-titulorec'>Recuperar contraseña</h2>
				<p className='login-titulorec fs-5'>
					Ingresa tu mail y te enviaremos el procedimiento para
					recuperar tu contraseña
				</p>
				<Form.Group className='mb-3' controlId='inputemail'>
					<Form.Label className='labelrec bg-secondary'>
						Email
					</Form.Label>
					<Form.Control className='inputrec' type='email' />
				</Form.Group>
				<Form.Group className='mb-3 d-flex justify-content-center' controlId='inputpassword'>
					<Button className='input-submitrec'>Enviar</Button>
				</Form.Group>
			</Form>
		</section>
	);
};
