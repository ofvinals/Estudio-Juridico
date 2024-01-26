import React from 'react';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import '../css/Contact.css';
import emailjs from '@emailjs/browser';

export const Contact = () => {
	const sendEmail = (e) => {
		e.preventDefault();

		emailjs
			.sendForm(
				'YOUR_SERVICE_ID',
				'YOUR_TEMPLATE_ID',
				form.current,
				'YOUR_PUBLIC_KEY'
			)
			.then(
				(result) => {
					console.log(result.text);
				},
				(error) => {
					console.log(error.text);
				}
			);
	};
	return (
		<div className='container-lg bodycontact'>
			<div className=''>
				<h1 className='titulocont text-center'>¡Contactanos!</h1>
				<p className='text-center Parrafo2'>
					Por cualquier duda, comentario o sugerencia puedes contactarnos y
					nos comunicaremos a la brevedad posible.
				</p>
			</div>

			<Form className='cajaForm' onSubmit={sendEmail}>
				<Form.Group className='' controlId='emailcontact'>
					<Form.Label className='labelcontact'>Email</Form.Label>
					<Form.Control
						type='email'
						placeholder='Ingrese su email..'
						className='inputcontactemail'
					/>
				</Form.Group>
				<Form.Group className='' controlId='comentariocontact'>
					<Form.Label className='labelcontact'>
						Escribe tu comentario
					</Form.Label>
					<Form.Control
						as='textarea'
						rows={5}
						className='inputcontactcoment'
						placeholder='Ingrese su comentario..'
					/>
				</Form.Group>
				<div className='d-flex justify-content-center row '>
					<Link type='submit' className='btncont'>
						Enviar
					</Link>
				</div>
			</Form>
		</div>
	);
};
