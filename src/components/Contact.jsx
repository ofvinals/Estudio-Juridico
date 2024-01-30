import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import '../css/Contact.css';

export const Contact = () => {
	const form = useRef();

	const sendEmail = (e) => {
		e.preventDefault();

		emailjs
			.sendForm(
				'service_iew5q2g',
				'template_qar0tof',
				form.current,
				'saMzvd5sdlHj2BhYr'
			)
			.then(
				(result) => {
					Swal.fire({
						icon: 'success',
						title: 'Mensaje enviado correctamente! Te responderemos a la brevedad posible!',
						showConfirmButton: false,
						timer: 3000,
					});
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
			<form className='cajaForm' ref={form} onSubmit={sendEmail}>
				<label className='labelcontact'>Tu Nombre</label>
				<input
					className='inputcontactemail'
					type='text'
					name='user_name'
					required
				/>
				<label className='labelcontact' placeholder='Ingrese su email..'>
					Email
				</label>
				<input
					className='inputcontactemail'
					type='email'
					name='user_email'
					required
				/>
				<label className='labelcontact' placeholder='Ingrese su mensaje..'>
					Mensaje
				</label>
				<textarea className='inputcontactcoment' name='message' required />
				<input className='btncont' type='submit' value='Enviar' />
			</form>
		</div>
	);
};
