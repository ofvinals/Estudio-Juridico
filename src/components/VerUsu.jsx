import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

export const VerUsu = () => {
	const [users, setUsers] = useState([]);
	const { id } = useParams();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);

	const handleCancel = () => {
		setShowModal(false);
		navigate('/gestionusuarios');
	};

	useEffect(() => {
		async function loadUsuario() {
			try {
				Swal.fire({
					title: 'Cargando...',
					allowOutsideClick: false,
					showConfirmButton: false,
				});
				const usuarioRef = doc(db, 'usuarios', id);
				const snapshot = await getDoc(usuarioRef);
				const usuarioData = snapshot.data();
				setUsers(usuarioData);
				Swal.close();
				setShowModal(true);
			} catch (error) {
				console.error('Error al cargar el caja', error);
			}
		}
		loadUsuario();
	}, []);

	return (
		<div>
			{' '}
			<Modal show={showModal} onHide={handleCancel}>
				<Modal.Header closeButton>
					<Modal.Title>Ver Datos de Usuario</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' id='nombre'>
							<Form.Label>
								<u>Nombre o Razon Social:</u> {users.username}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='apellido'>
							<Form.Label>
								<u>Apellido:</u> {users.apellido}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='dni'>
							<Form.Label>
								<u>DNI/CUIT: </u> {users.dni}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='celular'>
							<Form.Label>
								<u>Celular:</u> {users.celular}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='email'>
							<Form.Label>
								<u>Email:</u> {users.email}
							</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' id='domicilio'>
							<Form.Label>
								<u>Domicilio:</u> {users.domicilio}
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
