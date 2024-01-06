import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import '../css/Editar.css';
import { useTurnos } from '../context/TurnosContext';

export const EditarTurnos = ({}) => {
	const { user } = useAuth();
	const params = useParams();
	const navigate = useNavigate();
	const { getTurno, updateTurno, getTurnos } = useTurnos();
	const { register, handleSubmit, setValue } = useForm();
	const [turno, setTurno] = useState({});
	const [turnos, setTurnos] = useState([]);
	const [showModal, setShowModal] = useState(false);

	// Función para abrir el modal
	const handleOpenModal = () => setShowModal(true);

	// Función para cerrar el modal
	const handleCloseModal = () => {
		setShowModal(false);
		if (user.email === 'admin@gmail.com') {
			navigate('/gestionagenda');
		} else {
			navigate('/agendausu');
		}
	};

	// Función para cargar los datos del turno al abrir la página
	useEffect(() => {
		async function loadTurno() {
			try {
				if (params.id) {
					const turnoData = await getTurno(params.id);
					setTurno(turnoData);
					setValue('turno', turnoData.turno);
					setValue('email', turnoData.email);
					setValue('motivo', turnoData.motivo);
					// Abre automáticamente el modal cuando se cargan los datos del turno
					handleOpenModal();
				}
			} catch (error) {
				console.error('Error al cargar el expediente', error);
			}
		}
		loadTurno();
	}, []);

	// Carga de turnos
	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedTurnos = await getTurnos();
				setTurnos(fetchedTurnos);
			} catch (error) {
				console.error('Error al obtener turnos:', error);
			}
		};

		fetchData();
	}, []);

	// Función para manejar el envío del formulario
	const onSubmit = handleSubmit(async (data) => {
		await updateTurno(params.id, data);
		// Cierra el modal después de guardar los cambios
		handleCloseModal();
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
							<div className='d-flex justify-content-around'>
								<Form.Group
									className='mb-3'
									controlId='turnoEditarTurno'>
									<Form.Label className='labeleditturno '>
										Cliente
									</Form.Label>
									<Form.Control
										className='inputeditturno'
										type='text'
										defaultValue={turno.email}
										{...register('email')}
										readOnly
									/>
								</Form.Group>

								<Form.Group
									className='mb-3'
									controlId='turnoEditarTurno'>
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
