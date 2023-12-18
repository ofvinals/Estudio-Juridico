import React from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Recuperar.css';
import { Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

export const Recuperar = () => {
	return (
		<section className='recuperar'>

			<Form className='Formrec bg-dark'>
				<h2 className='titulorec'>Recuperar contraseña</h2>
				<p className='subtitulorec'>
					Ingresa tu mail y te enviaremos el procedimiento para recuperar
					tu contraseña
				</p>

				<Form.Group controlId='inputemail'>
					<input className='inputrec' type='email' />
				</Form.Group>
				
				<Form.Group
					className='mb-3 d-flex justify-content-center'
					controlId='inputpassword'>
					<button className='input-submitrec'>Enviar</button>
				</Form.Group>
			</Form>

		</section>
	);
};
