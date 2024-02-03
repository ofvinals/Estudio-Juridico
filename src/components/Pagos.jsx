import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const Pagos = () => {
	const [showModal, setShowModal] = useState(true);
	const navigate = useNavigate();
	// Función para cerrar el modal
	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/gestiongastos');
	};

	return (
		<>
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title className='text-white'>
						Consultar Medios de Pago
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Cuenta Banco Galicia : </Form.Label>
							<ul>
								<li>
									<b>Caja de Ahorro en Pesos</b>
								</li>
								<li>
									<b>Nro cuenta:</b> 4052804-8 089-0
								</li>
								<li>
									<b>CBU:</b> 0070089430004052804802
								</li>
								<li>
									<b>Alias:</b> ofvinals.gali.peso
								</li>
							</ul>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Cuenta Banco Macro : </Form.Label>
							<ul>
								<li>
									<b>Caja de Ahorro en Pesos</b>
								</li>
								<li>
									<b>Nro cuenta:</b> 462809528678896
								</li>
								<li>
									<b>CBU:</b> 2850628540095286788968
								</li>
								<li>
									<b>Alias:</b> ofvinals.macro.peso{' '}
								</li>
							</ul>
						</Form.Group>
						<Form.Group
							className='mb-3 text-white d-flex flex-column'
							controlId=''>
							<Form.Label>Mercado Pago :</Form.Label>
							<button className='botonmp'>
								<a
									className='text-white text-decoration-none'
									href='https://link.mercadopago.com.ar/estudioposse'
									target='_blank'>
									<i className='pe-2 fa-solid fa-handshake-simple'></i>
									Boton de Pago
								</a>
							</button>{' '}
							<img
								className='mt-3 align-self-center'
								src='/qr-mp.png'
								alt='QR Mercado Pago'
								width={300}
							/>
						</Form.Group>
						<Form.Group
							className='mb-3 text-white d-flex flex-column'
							controlId=''>
							<Form.Label>Criptomonedas :</Form.Label>
							<img
								className='mt-3 align-self-center'
								src='/qr-binancec.png'
								alt='QR Mercado Pago'
								width={200}
							/>{' '}
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<button
						className='btneditgestion px-2'
						onClick={() => {
							handleCloseModal();
						}}>
						Volver
					</button>
				</Modal.Footer>
			</Modal>
			;
		</>
	);
};
