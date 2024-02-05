import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import '../css/Editar.css';
import Swal from 'sweetalert2';
import { db } from '../firebase/config';
import {
	doc,
	getDoc,
	updateDoc,
	} from 'firebase/firestore';

export const EditarTurnos = ({}) => {
	const user = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();
	const { register, handleSubmit, setValue } = useForm();
	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => setShowModal(true);

	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/agendausu');
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
				setValue('turno', turnoData.turno);
				setValue('email', turnoData.email);
				setValue('motivo', turnoData.motivo);
				handleOpenModal();
				Swal.close();
				handleOpenModal();
				Swal.fire({
					icon: 'success',
					title: 'Turno editado correctamente',
					showConfirmButton: false,
					timer: 1500,
				});
			} catch (error) {
				console.error('Error al cargar el turno', error);
				Swal.fire({
					icon: 'error',
					title: 'Error al editar el turno. Intente nuevamente!',
					showConfirmButton: false,
					timer: 1500,
				});
			}
		}
		loadTurno();
	}, []);

	const onSubmit = handleSubmit(async (data) => {
		try {
			Swal.fire({
				title: 'Cargando...',
				allowOutsideClick: false,
				showConfirmButton: false,
			});
			const turnoRef = doc(db, 'turnos', id);
			await updateDoc(turnoRef, data);
			Swal.fire({
				icon: 'success',
				title: 'Turno editado correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
			Swal.close();
			handleCloseModal();
			if (user === 'ofvinals@gmail.com') {
				navigate('/gestionagenda', { replace: true });
			} else {
				navigate('/agendausu', { replace: true });
			}
		} catch (error) {
			console.error('Error al editar el turno:', error);
			Swal.fire({
				icon: 'error',
				title: 'Error al editar el turno. Intente nuevamente!',
				showConfirmButton: false,
				timer: 1500,
			});
		}
	});

	return (
		<>
			<div className='bodyedit'>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title className='titlemodal'>
							Modificar Turno
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={onSubmit}>
							<div className='d-flex flex-column align-items-center'>
								<Form.Group className='' controlId='turnoEditarTurno'>
									<Form.Label className='labeleditturno '>
										Cliente
									</Form.Label>
									<Form.Control
										className='inputeditturno'
										type='text'
										{...register('email')}
										readOnly
									/>
								</Form.Group>

								<Form.Group className='' controlId='turnoEditarTurno'>
									<Form.Label className='labeleditturno'>
										Turno
									</Form.Label>
									<Form.Control
										className='inputeditturno'
										type='text'
										{...register('turno')}
									/>
								</Form.Group>
							</div>
							<Form.Group
								className='mb-3 d-flex flex-column align-items-center'
								controlId='motivoEditarTurno'>
								<Form.Label className='labeledit'>Motivo</Form.Label>
								<Form.Control
									className='inputedit w-75'
									as='textarea'
									rows={7}
									cols={70}
									{...register('motivo')}
								/>
							</Form.Group>

							<Form.Group className='botonesedit'>
								<button className='btnconfmodal' type='submit'>
									<i className='iconavbar bi bi-check2-square'></i>
									Guardar cambios
								</button>
								<button
									type='button'
									className='btncancmodal'
									onClick={handleCloseModal}>
									<i className='iconavbar bi bi-x-circle-fill'></i>
									Cancelar
								</button>
							</Form.Group>
						</Form>
					</Modal.Body>
				</Modal>
			</div>
		</>
	);
};
