import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../css/EditarExptes.css';
import { Button, Modal } from 'react-bootstrap';

export const EditarMov = () => {
	const auth = useAuth();
	const { id } = useParams();
	const { email } = auth.user;
	const navigate = useNavigate();
	const [movimientos, setMovimientos] = useState([]);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [form, setForm] = useState({
		fecha: '',
		movimiento: '',
		archivo: null,
		id: '',
	});

	const handleCancel = () => {
		setShowConfirmationModal(false);
		handleClose();
		navigate(`/movexptes/${id}`);
	};

	const handleShow = () => setShowConfirmationModal(true);

	useEffect(() => {
		const ListaMov = JSON.parse(localStorage.getItem('movimientos')) || [];
		setMovimientos(ListaMov);
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	useEffect(() => {
		const movimiento = movimientos.find(
			(movimiento) => movimiento.id === parseInt(id)
		);
		if (movimiento) {
			setForm({
				...form,
				nroexpte:movimiento.nroexpte,
				fecha: movimiento.fecha,
				movimiento: movimiento.movimiento,
				archivo: movimiento.archivo,
				id: id,
			});
		}
	}, [id, movimientos]);

	// Funcion para editar datos de expedientes
	function editarMov() {
		const nuevosMovs = movimientos.map((movimiento) => {
			if (movimiento.id === parseInt(id, 10)) {
				console.log('Antes de la actualización:', movimiento);
				return {
					...movimiento,
					nroexpte: movimiento.nroexpte,
					fecha: form.fecha,
					movimiento: form.movimiento,
					archivo: form.archivo,
				};
			} else {
				return movimiento;
			}
		});
		console.log('Nuevos movimientos:', nuevosMovs);
		// Actualizar el estado de expedientes, luego de editar
		setMovimientos(nuevosMovs);
		localStorage.setItem('movimientos', JSON.stringify(nuevosMovs));
		setShowConfirmationModal(false);
		navigate(`/movexptes/${id}`);
	}

	return (
		<>
			<section className='editexpe'>
				<Form className='editexpForm container fluid bg-dark'>
					<h2 className='titleeditexp'>Editar Datos de Movimientos</h2>
					<Form.Group className='' controlId='inputname'>
						<Form.Label className='labeleditexp'>Fecha</Form.Label>
						<Form.Control
							className='inputeditexp'
							type='text'
							name='fecha'
							value={form.fecha}
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group className='' controlId='inputdomic'>
						<Form.Label className='labeleditexp'>Movimiento</Form.Label>
						<Form.Control
							className='inputeditexp'
							as='textarea'
							rol={13}
							col={50}
							name='movimiento'
							value={form.movimiento}
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group className='' controlId='inputcel'>
						<Form.Label className='labeleditexp'>Archivo</Form.Label>
						{form.archivo !== null && (
							<Form.Control
								className='inputeditexp'
								type='file'
								name='archivo'
								value={form.archivo}
								onChange={handleChange}
							/>
						)}
					</Form.Group>

					<Form.Group className='botoneseditexp'>
						<Button
							className='btneditexp'
							onClick={(e) => setShowConfirmationModal(true)}>
							<i className='iconavbar bi bi-check2-square'></i>
							Guardar Cambios
						</Button>
						<Link to='/movexptes' className='botoneditcancexp'>
							<i className='iconavbar bi bi-x-circle-fill'></i>
							Cancelar
						</Link>
					</Form.Group>
				</Form>
			</section>

			{/* Modal para confirmar edicion */}
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
						className='btnacept'
						onClick={(e) => {
							editarMov(e);
						}}>
						Confirmar
					</button>
					<button
						className='btncanc'
						onClick={() => {
							handleCancel();
							navigate(`/movexptes/${id}`);
						}}>
						Cancelar
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
