import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../css/MovExptes.css';
import { Button, Form, Modal } from 'react-bootstrap';

export const MovExptes = () => {
	const auth = useAuth();
	const { email } = auth.user;
	const { id } = useParams();

	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [exptes, setExptes] = useState([]);
	const [datosExpte, setDatosExpte] = useState();
	const [tablaMov, setTablaMov] = useState();
	const [movExpte, setMovExpte] = useState([]);
	const [editarMov, setMovEditar] = useState([]);
	const [movimientos, setMovimientos] = useState([]);
	const [showVerMovModal, setShowVerMovModal] = useState(false);
	const [showEditMovModal, setShowEditMovModal] = useState(false);
	const [showCreaMovModal, setShowCreaMovModal] = useState(false);
	const initialForm = {
		fechamov: '',
		movimiento: '',
		archivo: '',
		id: '',
	};
	const [form, setForm] = useState(initialForm);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [formValues, setFormValues] = useState({
		fechaEditar: '',
		movimientoEditar: '',
		archivoEditar: '',
	});

	const handleCancel = () => {
		setShowVerMovModal(false);
		setShowCreaMovModal(false);
		setShowEditMovModal(false);
		handleClose();
	};

	// Carga expedientes desde el localStorage al montar el componente
	useEffect(() => {
		const ListaExpte = JSON.parse(localStorage.getItem('exptes')) || [];
		setExptes(ListaExpte);
	}, []);

	// Carga movimientos desde el localStorage al montar el componente
	useEffect(() => {
		const ListaMov = JSON.parse(localStorage.getItem('movimientos')) || [];
		setMovimientos(ListaMov);
	}, []);

	// Renderiza tabla de movimientos y datos del expediente
	useEffect(() => {
		cargarTablaMov();
		cargarDatosExpte();
	}, [id, exptes, movimientos]);

	// funcion para cargar datos del expediente
	function cargarDatosExpte() {
		const expteIndexInt = parseInt(id, 10);
		const datosexpte = exptes
			.filter((expte) => expte.id === expteIndexInt)
			.map((expte) => (
				<div key={expte.id}>
					<p className='datosmovexpte'>Nro Expte: {expte.nroexpte}</p>
					<p className='datosmovexpte'>Caratula: {expte.caratula}</p>
					<p className='datosmovexpte'>
						Radicacion: {expte.radicacion} {expte.juzgado}
					</p>
				</div>
			));
		setDatosExpte(datosexpte);
	}

	// Funcion para cargar tabla de movimientos traida de Local Storage
	function cargarTablaMov() {
		const tabla = movimientos.map((movimiento) => (
			<tr key={movimiento.id}>
				<td className='align-middle'>{movimiento.fecha}</td>
				<td className='align-middle '>{movimiento.movimiento}</td>
				<td className='align-middle '>{movimiento.archivo}</td>
				<td>
					<div className='d-flex flex-row justify-content-around'>
						{/* solo visible para admin */}
						{email === 'admin@gmail.com' && (
							<button
								className='btnaccgestexp'
								onClick={(e) => {
									setShowEditMovModal(true);
									editMovExpte(movimiento.id);
								}}>
								<i className='bi bi-pen  accico'></i>
							</button>
						)}
						{/* solo visible para admin */}
						{email === 'admin@gmail.com' && (
							<button
								className='btnborrargestexp'
								onClick={() => borrarMov(movimiento.id)}>
								<i className='bi bi-trash-fill  accico'></i>
							</button>
						)}
						<button
							className='btnvergestexp'
							onClick={(e) => {
								setShowVerMovModal(true);
								verMovExpte(movimiento.id);
							}}>
							<i className='bi bi-search accico'></i>
						</button>
					</div>
				</td>
			</tr>
		));
		setTablaMov(tabla);
	}

	//funcion para agregar movimientos
	const agregarMov = (newMov) => {
		const ListaMov = [...movimientos, newMov];
		setMovimientos(ListaMov);
		localStorage.setItem('movimientos', JSON.stringify(ListaMov));
		setShow(false);
		setShowCreaMovModal(false);
	};

	// Atrapa datos del imput y carga en form
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// crea nuevo movimiento y llama a agregarMov
	function handleSubmit(e) {
		const { fechamov, movimiento, archivo } = form;
		// Convierte el turno seleccionado al formato de cadena
		const fecha = new Date(fechamov).toLocaleString('es-AR', {
			day: 'numeric',
			month: 'numeric',
			year: 'numeric',
		});
		const id = Date.now();
		const newMov = {
			id,
			fecha,
			movimiento,
			archivo,
		};
		agregarMov(newMov);
		setForm(initialForm);
		window.location.reload();
		handleClose();
	}

	// funcion para ver movimientos en Modal
	function verMovExpte(id) {
		const movimientoSeleccionado = movimientos.find(
			(movimiento) => movimiento.id === id
		);
		setMovExpte(movimientoSeleccionado);
		setShowVerMovModal(true);
	}

	// funcion para editar movimientos del expediente
	function editMovExpte(id) {
		const movimientoSeleccionado = movimientos.find(
			(movimiento) => movimiento.id === id
		);
		console.log(movimientoSeleccionado);
		if (movimientoSeleccionado) {
			setFormValues = ({
				...formValues,
				fechaEditar: movimientoSeleccionado.fecha,
				movimientoEditar: movimientoSeleccionado.movimiento,
				archivoEditar: movimientoSeleccionado.archivo,
			});
		}

		// Actualiza el estado de turnos, luego de editar
		setMovEditar(movimientoSeleccionado);
		localStorage.setItem('movimientos', JSON.stringify(movimientosEditados));
		setShowEditMovModal(true);
	}

	const handleChangeEdit = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	// funcion para eliminar movimientos
	function borrarMov(id) {
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
				const nuevosMov = movimientos.filter(function (movimiento) {
					return movimiento.id !== id;
				});
				setMovimientos(nuevosMov);
				localStorage.setItem('movimientos', JSON.stringify(nuevosMov));
				cargarTablaMov();
				window.location.reload();
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
					<p className='subtitleadusu'>
						Panel de Movimientos de Expedientes
					</p>
				</div>
				<div className='bg-dark'>
					<div className='d-flex justify-content-around'>
						{email === 'admin@gmail.com' && (
							<Button
								className='btngestexpad'
								onClick={(e) => setShowCreaMovModal(true)}>
								<i className='me-2 fs-6 bi bi-file-earmark-plus'></i>
								Agregar movimiento
							</Button>
						)}
						<Button
							onClick={() => {
								if (email === 'admin@gmail.com') {
									navigate('/gestionexpedientes');
								} else {
									navigate('/gestionexpteusu');
								}
							}}
							className='btngestexpad'>
							<i className='me-2 fs-6 bi bi-box-arrow-left'></i>
							Volver al Panel
						</Button>
					</div>

					<div>
						<div>
							<h2 className='titlemovexp'>Datos del Expediente</h2>
							{datosExpte}
						</div>
					</div>
					<h2 className='subtitleadusu text-center'>
						Movimientos del Expediente
					</h2>
					<div className='container table-responsive'>
						<Table
							striped
							hover
							variant='dark'
							className='tablamovexpte text-center table border border-secondary-subtle'>
							<thead>
								<tr>
									<th>Fecha</th>
									<th>Descripcion</th>
									<th>Adjunto</th>
									<th className='acciones'>Acciones</th>
								</tr>
							</thead>
							<tbody id='tablaTurnos' className='table-group-divider'>
								{tablaMov}
							</tbody>
						</Table>
					</div>
				</div>
			</div>

			{/* Modal para agregar movimientos al expediente */}
			<Modal
				show={showCreaMovModal}
				onHide={() => setShowCreaMovModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Agregar Movimientos</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group
							className='mb-3'
							onChange={handleChange}
							controlId=''>
							<Form.Label>Fecha</Form.Label>
							<Form.Control type='date' name='fechamov' />
						</Form.Group>
						<Form.Group
							className='mb-3'
							onChange={handleChange}
							controlId=''>
							<Form.Label>Movimiento</Form.Label>
							<Form.Control as='textarea' rows={3} name='movimiento' />
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Agregar archivos</Form.Label>
							<Form.Control
								type='file'
								name='archivo'
								onChange={handleChange}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<button className='btnaccag' onClick={handleSubmit}>
						Confirmar
					</button>
					<button
						className='btnborrarag '
						onClick={() => {
							handleCancel();
						}}>
						Cancelar
					</button>
				</Modal.Footer>
			</Modal>

			{/* Modal para consultar movimientos al expediente */}
			<Modal show={showVerMovModal} onHide={() => setShowVerMovModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Ver Movimiento</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Fecha: {movExpte.fecha}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Movimiento:{movExpte.movimiento}</Form.Label>
						</Form.Group>
						<Form.Group className='mb-3' controlId=''>
							<Form.Label>
								Archivos Adjuntos: {movExpte.archivo}
							</Form.Label>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<button
						className='btnaccag '
						onClick={() => {
							handleCancel();
						}}>
						Volver
					</button>
				</Modal.Footer>
			</Modal>

			{/* Modal para editar movimientos al expediente */}
			<Modal
				show={showEditMovModal}
				onHide={() => setShowEditMovModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Editar Movimientos</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group
							className='mb-3'
							onChange={(e) =>
								setFormValues({
									...formValues,
									fechaEditar: e.target.value,
								})
							}
							controlId=''>
							<Form.Label>Fecha</Form.Label>
							<Form.Control
								type='date'
								name='fechamov'
								value={formValues.fecha}
							/>
						</Form.Group>

						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Movimiento</Form.Label>
							<Form.Control
								onChange={(e) =>
									setFormValues({
										...formValues,
										movimientoEditar: e.target.value,
									})
								}
								as='textarea'
								rows={3}
								name='movimiento'
								value={formValues.movimiento}
							/>
						</Form.Group>

						<Form.Group className='mb-3' controlId=''>
							<Form.Label>Agregar archivos</Form.Label>
							<Form.Control
								type='file'
								name='archivo'
								onChange={(e) =>
									setFormValues({
										...formValues,
										archivoEditar: e.target.value,
									})
								}
								value={formValues.archivo}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<button className='btnaccag' onClick={handleSubmit}>
						Confirmar cambios
					</button>
					<button
						className='btnborrarag '
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
