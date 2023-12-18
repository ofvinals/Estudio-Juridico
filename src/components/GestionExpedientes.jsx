import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import '../css/GestionExpedientes.css';

export const GestionExpedientes = () => {
	const auth = useAuth();
	const { email } = auth.user;
	console.log(email);

	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [exptes, setExptes] = useState([]);
	const [tablaExpte, setTablaExpte] = useState();
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [formValues, setFormValues] = useState({
		nroexpteEditar: '',
		radicacionEditar: '',
		caratulaEditar: '',
		actorEditar: '',
		demandadoEditar: '',
		procesoEditar: '',
		expteIndex: null,
	});
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// Actualizar la tabla después de cualquier cambio
	// const handleExpteChange = (nuevosExptes) => {
	// 	setExptes(nuevosExptes);
	// 	cargarTablaExpte();
	// };
	// Cargar expedientes desde el localStorage al montar el componente
	useEffect(() => {
		const ListaExpte = JSON.parse(localStorage.getItem('exptes')) || [];
		setExptes(ListaExpte);
	}, []);

	useEffect(() => {
		cargarTablaExpte();
	}, [exptes]);

	// Funcion para cargar tabla de Exptes traida de Local Storage
	function cargarTablaExpte() {
		const tabla = exptes.map((expte) => (
			<tr key={expte.id}>
				<td className='align-middle'>{expte.nroexpte}</td>
				<td className='align-middle '>{expte.radicacion}</td>
				<td className='align-middle '>{expte.caratula}</td>
				<td>
					<div className='d-flex flex-row justify-content-around'>
						<button
							className='btnacc btn btn-success'
							onClick={() => mostrarEditarExpteModal(expte.id)}>
							<i className='bi bi-pen  accico'></i>
						</button>
						<button
							className='btnacc btn btn-danger'
							onClick={() => borrarExpte(expte.id)}>
							<i className='bi bi-trash-fill  accico'></i>
						</button>
					</div>
				</td>
			</tr>
		));
		setTablaExpte(tabla);
	}

	// funcion para mostrar el modal de edicion de usuarios
	function mostrarEditarExpteModal(id) {
		const expte = exptes.find((expte) => expte.id === id);
		// Establecer los valores en el estado
		setFormValues({
			...formValues,
			nroexpteEditar: expte.nroexpte,
			radicacionEditar: expte.radicacion,
			caratulaEditar: expte.caratula,
			actorEditar: expte.actor,
			demandadoEditar: expte.demandado,
			procesoEditar: expte.proceso,
			expteIndex:id,
		});
		// Mostrar el modal
		setShow(true);
	}

	// Funcion para editar datos de usuarios
	function editarExpte(e) {
		e.preventDefault();
		const {
			nroexpteEditar,
			radicacionEditar,
			caratulaEditar,
			actorEditar,
			demandadoEditar,
			procesoEditar,
			expteIndex,
		} = formValues;
		const expteIndexInt = parseInt(formValues.expteIndex, 10);
		const nuevosExptes = exptes.map((expte) =>
			expte.id === expteIndexInt
				? {
						...expte,
						nroexpte: formValues.nroexpteEditar,
						radicacion: formValues.radicacionEditar,
						caratula: formValues.caratulaEditar,
						actor: formValues.actorEditar,
						demandado: formValues.demandadoEditar,
						proceso: formValues.procesoEditar,
				  }
				: { ...expte }
		);

		// Actualizar el estado de usuarios, luego de editar
		setExptes(nuevosExptes);

		localStorage.setItem('exptes', JSON.stringify(nuevosExptes));
		cargarTablaExpte();
		setShow(false);
		setShowConfirmationModal(false);
	}

	// funcion para eliminar expedientes
	function borrarExpte(id) {
		Swal.fire({
			title: '¿Estás seguro?',
			text: 'Confirmas la eliminacion del expdiente?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#8f8e8b',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.isConfirmed) {
				// Filtrar
				const nuevosExptes = exptes.filter(function (expte) {
					return expte.id !== id;
				});
				localStorage.setItem('exptes', JSON.stringify(nuevosExptes));
				setExptes(nuevosExptes);
				cargarTablaExpte();
				Swal.fire(
					'Eliminado',
					'El expediente fue eliminado con exito',
					'success'
				);
			}
		});
	}

	return (
		<>
			<div className='container-fluid bg-dark'>
				<div className='main px-3 bodyadexped '>
					<h4 className='titlead'>Bienvenido de nuevo, {email}</h4>
					<p className=''>Panel de Administracion de Expedientes</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						<Link
							type='button'
							className='btnusu align-self-center '
							to='/CargaExptes'
							data-bs-toggle='modal'
							data-bs-target='#Modal'>
							Agregar expediente
						</Link>
						<Link to='/Admin' className='btnadexped align-self-center '>
							Volver al Panel
						</Link>
					</div>

					<div>
						<p className='titleagusu text-center'>
							Expedientes en tramite
						</p>
					</div>

					<div className='container table-responsive'>
						<Table
							striped
							hover
							variant='dark'
							className='text-center table   border border-secondary-subtle'>
							<thead>
								<tr>
									<th>#Expte</th>
									<th>Radicacion</th>
									<th>Caratula</th>
									<th className='acciones'>Acciones</th>
								</tr>
							</thead>
							<tbody id='tablaTurnos' className='table-group-divider'>
								{tablaExpte}
							</tbody>
						</Table>
					</div>
				</div>
			</div>

			{/* <!-- Modal Editar Expedientes -->	 */}
			<div id='editExpteModal' className='modal my-auto mx-auto'>
				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title className='modedittitle'>
							Editar Expedientes
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group className='mb-3' controlId='expteEditar'>
								<Form.Label className='modeditlabel'>Expte</Form.Label>
								<Form.Control
									className='modeditinput'
									type='text'
									placeholder='Expte'
									value={formValues.nroexpteEditar}
									onChange={(e) =>
										setFormValues({
											...formValues,
											nroexpteEditar: e.target.value,
										})
									}
									autoFocus
								/>
							</Form.Group>
							<Form.Group className='mb-3' controlId='radicacionEditar'>
								<Form.Label className='modeditlabel'>
									Radicacion
								</Form.Label>
								<Form.Control
									className='modeditinput'
									type='text'
									placeholder='Radicacion'
									value={formValues.radicacionEditar}
									onChange={(e) =>
										setFormValues({
											...formValues,
											radicacionEditar: e.target.value,
										})
									}
									autoFocus
								/>
							</Form.Group>
							<Form.Group className='mb-3' controlId='caratulaEditar'>
								<Form.Label className='modeditlabel'>
									Caratula
								</Form.Label>
								<Form.Control
									className='modeditinput'
									type='text'
									placeholder='caratula'
									value={formValues.caratulaEditar}
									onChange={(e) =>
										setFormValues({
											...formValues,
											caratulaEditar: e.target.value,
										})
									}
									autoFocus
								/>
							</Form.Group>
							<Form.Group className='mb-3' controlId='actorEditar'>
								<Form.Label className='modeditlabel'>Actor</Form.Label>
								<Form.Control
									className='modeditinput'
									type='text'
									placeholder='Actor'
									value={formValues.actorEditar}
									onChange={(e) =>
										setFormValues({
											...formValues,
											actorEditar: e.target.value,
										})
									}
									autoFocus
								/>
							</Form.Group>
							<Form.Group className='mb-3' controlId='demandadoEditar'>
								<Form.Label className='modeditlabel'>
									Demandado
								</Form.Label>
								<Form.Control
									className='modeditinput'
									type='text'
									placeholder='Demandado'
									value={formValues.demandadoEditar}
									onChange={(e) =>
										setFormValues({
											...formValues,
											demandadoEditar: e.target.value,
										})
									}
									autoFocus
								/>
							</Form.Group>
							<Form.Group className='mb-3' controlId='procesoEditar'>
								<Form.Label className='modeditlabel'>
									Proceso
								</Form.Label>
								<Form.Control
									className='modeditinput'
									type='email'
									placeholder='Proceso'
									value={formValues.procesoEditar}
									onChange={(e) =>
										setFormValues({
											...formValues,
											procesoEditar: e.target.value,
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
						className='btnacc btn btn-success w-50'
						onClick={(e) => {
							editarExpte(e);
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
		</>
	);
};
