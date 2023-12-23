import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/EditarTurnos.css';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export const EditarTurnos = ({}) => {
	const auth = useAuth();
	const { id } = useParams();
	const { email } = auth.user;
	const navigate = useNavigate();

   const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [show, setShow] = useState(false);
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

	const handleShow = () => setShow(true);

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
		setShow(false);
		setShowConfirmationModal(false);

	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	return (
		<>
			<div className='edittur'>
				<Form className='editturForm bg-dark'>
					<h2 className='titleedittur'>Modificar Turno</h2>

					<Form.Group className='mb-3' controlId='turnoEditarTurno'>
						<Form.Label className='labeledittur'>Turno</Form.Label>
						<Form.Control
							className='inputedittur'
							type='text'
                     name='turnoEditarTurno'
							value={formValues.turnoEditarTurno}
							onChange={handleChange}
							autoFocus
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='motivoEditarTurno'>
						<Form.Label className='labeledittur'>Motivo</Form.Label>
						<Form.Control
							className='inputedittur'
							as='textarea'
							rows={5}
                     name='motivoEditarTurno'
							value={formValues.motivoEditarTurno}
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group className='botonesedittur'>
						<Button
							className='botonedittur'
							onClick={(e) => setShowConfirmationModal(true)}>
							<i className='me-2 fs-6 bi bi-check2-square'></i>
							Guardar cambios
						</Button>
						<Link to='/gestionagenda' className='botoncanctur'>
							<i className='me-2 fs-6 bi bi-x-circle-fill'></i>
							Cancelar
						</Link>
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
						className='btnacc btn btn-success w-50'
						onClick={(e) => {
							editarTurno(e);
							navigate('/gestionagenda');
						}}>
						Confirmar
					</button>
					<button
						className='btnacc btn btn-danger'
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
