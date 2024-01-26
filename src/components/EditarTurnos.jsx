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
	getDocs,
	updateDoc,
	collection,
} from 'firebase/firestore';

export const EditarTurnos = ({}) => {
	const user = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();
	const { register, handleSubmit, setValue } = useForm();
	const [turno, setTurno] = useState({});
	const [showModal, setShowModal] = useState(false);

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	// Función para cerrar el modal
	const handleCloseModal = () => {
		setShowModal(false);
		navigate('/agendausu');
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const turnosRef = collection(db, 'turnos');
				const fetchedTurnos = await getDocs(turnosRef);
				const turnosArray = Object.values(
					fetchedTurnos.docs.map((doc) => doc.data())
				);
				setTurno(turnosArray);
			} catch (error) {
				console.error('Error al obtener turnos:', error);
			}
		};
		fetchData();
	}, []);

	// Función para cargar los datos del turno al abrir la página
	useEffect(() => {
		async function loadTurno() {
			try {
				Swal.showLoading();
				const turnoRef = doc(db, 'turnos', id);
				const snapshot = await getDoc(turnoRef);
				console.log('Datos del turno cargado:', snapshot.data());
				const turnoData = snapshot.data();
				setValue('turno', turnoData.turno);
				setValue('email', turnoData.email);
				setValue('motivo', turnoData.motivo);
				handleOpenModal();
				setTimeout(() => {
					Swal.close();
					handleOpenModal();
				}, 500);
				return () => clearTimeout(timer);
			} catch (error) {
				console.error('Error al cargar el turno', error);
			}
		}
		loadTurno();
	}, []);

	// Función para envíar los datos modificados
	const onSubmit = handleSubmit(async (data) => {
		try {
			Swal.showLoading();
			const turnoRef = doc(db, 'turnos', id);
			await updateDoc(turnoRef, data);
			Swal.fire({
				icon: 'success',
				title: 'Turno editado correctamente',
				showConfirmButton: false,
				timer: 1500,
			});
			setTimeout(() => {
				Swal.close();
				handleCloseModal();
				if (user.user === 'ofvinals@gmail.com') {
					navigate('/gestionagenda', { replace: true });
				} else {
					navigate('/agendausu', { replace: true });
				}
			}, 500);
			return () => clearTimeout(timer);
		} catch (error) {
			console.error('Error al eliminar el movimiento:', error);
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
