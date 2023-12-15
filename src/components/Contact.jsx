import React from 'react';
import Form from 'react-bootstrap/Form';
import { Link, NavLink } from 'react-router-dom';
import '../css/Contact.css';
import { Button } from 'react-bootstrap';

export const Contact = () => {
	return (
		<div className='bodycontact container-fluid'>
			<div className='p-3 mb-2'>
				<h1 className='titulocont text-center'>¡CONTACTANOS!</h1>
				<p className='text-center fw-semibold Parrafo2'>
					Por cualquier duda, comentario o sugerencia puedes
					contactarnos y nos comunicaremos lo antes posible.
				</p>
			</div>
			<div className='cajaForm'>
				<Form>
					<Form.Group
						className=''
						controlId='exampleForm.ControlInput1'>
						<Form.Label className='labelcontact'>Email </Form.Label>
						<Form.Control type='email' placeholder='' className='inputcontact'/>
					</Form.Group>
					<Form.Group
						className=''
						controlId='exampleForm.ControlTextarea1'>
						<Form.Label className='labelcontact'>
							Escribe tu comentario
						</Form.Label>
						<Form.Control as='textarea' rows={2} className='inputcontact'/>
					</Form.Group>
					<div className='d-flex justify-content-center row '>
						<Link type='submit' className='btncont'>
							Enviar
						</Link>
					</div>
				</Form>
				
			</div>
		</div>
	);
};
