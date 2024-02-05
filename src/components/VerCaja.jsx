import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

export const VerCaja = () => {
	const [caja, setCaja] = useState([]);
	const { id } = useParams();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);

	const handleCancel = () => {
		setShowModal(false);
		navigate('/gestioncaja');
	};
	
	useEffect(() => {
		async function loadCaja() {
			try {
				Swal.fire({
					title: 'Cargando...',
					allowOutsideClick: false,
					showConfirmButton: false,
				});
				const cajaRef = doc(db, 'cajas', id);
				const snapshot = await getDoc(cajaRef);
				const cajaData = snapshot.data();
				setCaja(cajaData);
				Swal.close();
				setShowModal(true);
			} catch (error) {
				console.error('Error al cargar el caja', error);
			}
		}
		loadCaja();
	}, []);

	return (
		<div>
			<Modal show={showModal} onHide={handleCancel}>
				<Modal.Header closeButton>
					<Modal.Title>Ver Movimiento de Caja</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' id='fecha'>
							<Form.Label>Fecha: {caja.fecha}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='concepto'>
							<Form.Label>Concepto: {caja.concepto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='monto'>
							<Form.Label>Monto: $ {caja.monto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='comprobante'>
							<Form.Label>
								Comprobante Adjunto:{' '}
								{caja.fileUrl ? (
									<a
										href={caja.fileUrl}
										target='_blank'
										className='text-white'
										rel='noopener noreferrer'>
										Ver Comprobante
									</a>
								) : (
									'Sin comprobante adjunto'
								)}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='estado'>
							<Form.Label>Estado: {caja.estado}</Form.Label>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<button
						className='btneditgestion px-2'
						onClick={() => {
							handleCancel();
						}}>
						Volver
					</button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};
