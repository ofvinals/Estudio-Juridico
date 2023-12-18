import React, { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import '../css/GestionAgenda.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export const GestionAgenda = () => {
	const auth = useAuth();
	const { email } = auth.user;
	console.log(email);

	const [show, setShow] = useState(false);
	// const [usuarios, setUsuarios] = useState([]);
	const [turnos, setTurnos] = useState([]);
	const [tablaTurnos, setTablaTurnos] = useState();
	const [formValues, setFormValues] = useState({
		turnoEditarTurno: '',
		emailEditarTurno: '',
		motivoEditarTurno: '',
		turnoIndex: null,
	});
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// // Cargar turnos desde el localStorage al montar el componente
	useEffect(() => {
		// const ListaUsuarios =
		// 	JSON.parse(localStorage.getItem('usuarios')) || [];
		// setUsuarios(ListaUsuarios);
		const ListaTurnos =
			JSON.parse(localStorage.getItem('turnosOcupados')) || [];

		// Ordenar por la propiedad 'turno'
		ListaTurnos.sort((a, b) => a.turno.localeCompare(b.turno));

		setTurnos(ListaTurnos);
	}, []);

	useEffect(() => {
		cargarTablaTurnos();
	}, [turnos]);

	function cargarTablaTurnos() {
		const tabla = turnos.map((turnos) => (
			<tr key={turnos.id}>
				{/* <td className='align-middle'>{usuario.id}</td> */}
				<td className='align-middle '>{turnos.id}</td>
				<td className='align-middle '>{turnos.turno}</td>
				<td className='align-middle '>{turnos.email}</td>
				<td className='align-middle '>{turnos.motivo}</td>
				<td>
					<div className='d-flex flex-row justify-content-around'>
						<button
							className='btnacc btn btn-success'
							onClick={() => mostrarEditarTurnoModal(turnos.id)}>
							<i className='bi bi-pen  accico'></i>
						</button>
						<button
							className='btnacc btn btn-danger'
							onClick={() => borrarTurno(turnos.id)}>
							<i className='bi bi-trash-fill  accico'></i>
						</button>
					</div>
				</td>
			</tr>
		));

		setTablaTurnos(tabla);
	}

	// funcion para mostrar el modal de edicion de usuarios
	function mostrarEditarTurnoModal(id) {
		const turno = turnos.find((turno) => turno.id === id);
		// Establecer los valores en el estado
		setFormValues({
			...formValues,
			turnoEditarTurno: turno.turno,
			motivoEditarTurno: turno.motivo,
			turnoIndex: id,
		});
		// Mostrar el modal
		setShow(true);
	}

	function editarTurno(e) {
		e.preventDefault();

		const { turnoEditarTurno, motivoEditarTurno, usuarioIndex } = formValues;

		Swal.fire({
			icon: 'success',
			text: 'Editado exitosamente!',
			confirmButtonColor: '#8f8e8b',
		});

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
		cargarTablaTurnos();
		setShow(false);
		setShowConfirmationModal(false);
	}

	// funcion para eliminar usuarios
	function borrarTurno(id) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'Confirmas la eliminacion del turno',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#8f8e8b',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				// Filtrar
				const eliminaTurno = turnos.filter(function (turno) {
					return turno.id !== id;
				});
				localStorage.setItem(
					'turnosOcupados',
					JSON.stringify(eliminaTurno)
				);
				setTurnos(eliminaTurno);
				cargarTablaTurnos();
				Swal.fire(
					'Eliminado',
					'El turno fue eliminado con exito',
					'success'
				);
			}
		});
	}

	return (
		<>
			<div className='bodygestionag container-fluid bg-dark'>
				<div className='main px-3 '>
					<h4 className='titlead'>Bienvenido de nuevo, {email}</h4>
					<p className=''>Panel de Administracion de Turnos</p>
				</div>
			</div>

			<div className='bg-dark'>
				<div className='d-flex justify-content-around'>
					<Link to='/Admin' className='btnag align-self-center '>
						Volver al Panel
					</Link>
				</div>
				<div>
					<p className='titleag text-center'>Turnos registrados</p>
				</div>
				<div className='container table-responsive'>
					<Table
						striped
						hover
						variant='dark'
						className='text-center table border border-secondary-subtle'>
						<thead>
							<tr>
								<th>#ID</th>
								<th>Turno</th>
								<th>Usuario</th>
								<th>Motivo</th>
								<th className='acciones'>Acciones</th>
							</tr>
						</thead>
						<tbody id='tablaTurnos' className='table-group-divider'>
							{tablaTurnos}
						</tbody>
					</Table>
				</div>
				{/* <!-- Modal Editar Usuario --> */} */
				<div id='editTurnoModal' className='modal my-auto mx-auto'>
					<Modal show={show} onHide={handleClose}>
						<Modal.Header closeButton>
							<Modal.Title className='modedittitle'>
								Editar Turno
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form>
								<Form.Group
									className='mb-3'
									controlId='turnoEditarTurno'>
									<Form.Label className='modeditlabel'>
										Turno
									</Form.Label>
									<Form.Control
										className='modeditinput'
										type='text'
										placeholder='Turno'
										value={formValues.turnoEditarTurno}
										onChange={(e) =>
											setFormValues({
												...formValues,
												turnoEditarTurno: e.target.value,
											})
										}
										autoFocus
									/>
								</Form.Group>
								<Form.Group
									className='mb-3'
									controlId='motivoEditarTurno'>
									<Form.Label className='modeditlabel'>
										Motivo
									</Form.Label>
									<Form.Control
										className='modeditinput'
										type='email'
										placeholder='name@example.com'
										value={formValues.motivoEditarTurno}
										onChange={(e) =>
											setFormValues({
												...formValues,
												motivoEditarTurno: e.target.value,
											})
										}
									/>
								</Form.Group>
							</Form>
						</Modal.Body>
						<Modal.Footer>
							<button
								className='btnacc btn btn-success w-50'
								onClick={(e) => setShowConfirmationModal(true)}>
								Guardar cambios
							</button>
							<button
								className='btnacc btn btn-danger'
								onClick={(e) => handleClose()}>
								Cancelar
							</button>
							<p id='formErrorModalEditUser' className='m-3'></p>
						</Modal.Footer>
					</Modal>
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
								handleClose();
							}}>
							Confirmar
						</button>
						<button
							className='btnacc btn btn-danger'
							onClick={() => {
								setShowConfirmationModal(false);
								handleClose();
							}}>
							Cancelar
						</button>
					</Modal.Footer>
				</Modal>
			</div>
		</>
	);
};
