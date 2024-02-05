import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

export const VerGasto = () => {
	const [gasto, setGasto] = useState([]);
	const { id } = useParams();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);

	const handleCancel = () => {
		setShowModal(false);
		navigate('/gestiongastos');
	};
	useEffect(() => {
		async function loadGasto() {
			try {
				Swal.fire({
					title: 'Cargando...',
					allowOutsideClick: false,
					showConfirmButton: false,
				});
				const gastosRef = doc(db, 'gastos', id);
				const snapshot = await getDoc(gastosRef);
				const gastoData = snapshot.data();
				setGasto(gastoData);
				Swal.close();
				setShowModal(true);
			} catch (error) {
				console.error('Error al cargar el gasto', error);
			}
		}
		loadGasto();
	}, []);

	return (
		<div>
			{' '}
			<Modal show={showModal} onHide={handleCancel}>
				<Modal.Header closeButton>
					<Modal.Title className='text-white'>
						Ver Gasto seleccionado
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Nro Expte: {gasto.expte}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Concepto: {gasto.concepto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Monto: $ {gasto.monto}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>
								Comprobante Adjunto:{' '}
								{gasto.fileUrl ? (
									<a
										href={gasto.fileUrl}
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
