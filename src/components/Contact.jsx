import React from 'react';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import '../css/Contact.css';

export const Contact = () => {
	return (
		<div className='bodycontact'>
			<div className=''>
				<h1 className='titulocont text-center'>¡Contactanos!</h1>
				<p className='text-center Parrafo2'>
					Por cualquier duda, comentario o sugerencia puedes contactarnos y
					nos comunicaremos a la brevedad posible.
				</p>
			</div>
			
			<Form className='cajaForm'>
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
