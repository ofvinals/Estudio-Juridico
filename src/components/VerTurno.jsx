import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

export const VerTurno = () => {
	const [turno, setTurno] = useState([]);
	const { id } = useParams();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);

	const handleCancel = () => {
		setShowModal(false);
		navigate('/gestionagenda');
	};

	useEffect(() => {
		async function loadTurno() {
			try {
				Swal.fire({
					title: 'Cargando...',
					allowOutsideClick: false,
					showConfirmButton: false,
				});
				const turnoRef = doc(db, 'turnos', id);
				const snapshot = await getDoc(turnoRef);
				const turnoData = snapshot.data();
				setTurno(turnoData);
				Swal.close();
				setShowModal(true);
			} catch (error) {
				console.error('Error al cargar el caja', error);
			}
		}
		loadTurno();
	}, []);

	return (
		<div>
			<Modal show={showModal} onHide={handleCancel}>
				<Modal.Header closeButton>
					<Modal.Title className='text-white'>
						Ver Turno seleccionado
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Turno: {turno.turno}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Cliente: {turno.email}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3 text-white' controlId=''>
							<Form.Label>Motivo: {turno.motivo}</Form.Label>
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
