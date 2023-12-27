import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/Editar.css';
import { Modal, Button } from 'react-bootstrap';

export const EditarTurnos = ({}) => {
	const auth = useAuth();
	const { id } = useParams();
	const { email } = auth.user;
	const navigate = useNavigate();
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [turnos, setTurnos] = useState([]);
	const [formValues, setFormValues] = useState({
		turnoEditarTurno: '',
		emailEditarTurno: '',
		motivoEditarTurno: '',
		turnoIndex: '',
	});

	// funcion boton cancelar
	const handleCancel = () => {
		setShowConfirmationModal(false);
		handleClose();
		if (email === 'admin@gmail.com') {
			navigate('/gestionagenda');
		} else {
			navigate('/agendausu');
		}
	};

	// // Cargar turnos desde el localStorage al montar el componente
	useEffect(() => {
		const ListaTurnos =
			JSON.parse(localStorage.getItem('turnosOcupados')) || [];
		setTurnos(ListaTurnos);
	}, []);

	// funcion para mostrar la edicion de turnos
	useEffect(() => {
		const turno = turnos.find((turno) => turno.id === parseInt(id, 10));
		// Establecer los valores en el estado
		if (turno) {
			setFormValues({
				...formValues,
				turnoEditarTurno: turno.turno,
				motivoEditarTurno: turno.motivo,
				turnoIndex: id,
			});
		}
	}, [id, turnos]);

	// funcion para editar datos del turno
	function editarTurno() {
		const turnoIndexInt = parseInt(formValues.turnoIndex, 10);
		const turnoeditado = turnos.map((turno) =>
			turno.id === turnoIndexInt
				? {
						...turno,
						turno: formValues.turnoEditarTurno,
						motivo: formValues.motivoEditarTurno,
				  }
				: { ...turno }
		);
		// Actualiza el estado de turnos, luego de editar
		setTurnos(turnoeditado);
		localStorage.setItem('turnosOcupados', JSON.stringify(turnoeditado));
		setShowConfirmationModal(false);
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	return (
		<>
			<div className='bodyedit'>
				<Form className='formedit bg-dark'>
					<h2 className='titleedit'>Modificar Turno</h2>

					<Form.Group className='mb-3' controlId='turnoEditarTurno'>
						<Form.Label className='labeledit'>Turno</Form.Label>
						<Form.Control
							className='inputedit'
							type='text'
							name='turnoEditarTurno'
							value={formValues.turnoEditarTurno}
							onChange={handleChange}
							autoFocus
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='motivoEditarTurno'>
						<Form.Label className='labeledit'>Motivo</Form.Label>
						<Form.Control
							className='inputedit'
							as='textarea'
							rows={7}
							cols={70}
							name='motivoEditarTurno'
							value={formValues.motivoEditarTurno}
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group className='botonesedit'>
						<Button
							className='botonedit'
							onClick={(e) => setShowConfirmationModal(true)}>
							<i className='iconavbar bi bi-check2-square'></i>
							Guardar cambios
						</Button>
						<Button
							onClick={() => {
								if (email === 'admin@gmail.com') {
									navigate('/gestionagenda');
								} else {
									navigate('/agendausu');
								}
							}}
							className='botoncancedit'>
							<i className='iconavbar bi bi-x-circle-fill'></i>
							Cancelar
						</Button>
					</Form.Group>
				</Form>
			</div>

			{/* <!-- Modal para confirmar edicion --> */}
			<Modal
				show={showConfirmationModal}
				onHide={() => setShowConfirmationModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Confirmar cambios</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					¿Estás seguro de que deseas guardar los cambios?
				</Modal.Body>
				<Modal.Footer>
					<button
						className='btnconfmodal'
						onClick={(e) => {
							editarTurno(e);
							if (email === 'admin@gmail.com') {
								navigate('/gestionagenda');
							} else {
								navigate('/agendausu');
							}
						}}>
						Confirmar
					</button>
					<button
						className='btncancmodal'
						onClick={() => {
							handleCancel();
						}}>
						Cancelar
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
